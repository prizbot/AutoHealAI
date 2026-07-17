import sqlite3
import json
from datetime import datetime
from utils.config import DB_PATH
from utils.logger import get_logger

logger = get_logger("store")


def _conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    c.row_factory = sqlite3.Row
    return c


def init_db():
    c = _conn()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS metrics (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp   TEXT    NOT NULL,
            cpu         REAL, memory      REAL, requests    REAL,
            latency     REAL, restarts    REAL, disk        REAL,
            network_in  REAL, network_out REAL
        );
        CREATE TABLE IF NOT EXISTS predictions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp   TEXT NOT NULL,
            failure     INTEGER,
            confidence  REAL,
            root_causes TEXT,
            actions     TEXT,
            explanation TEXT
        );
        CREATE TABLE IF NOT EXISTS incidents (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp    TEXT NOT NULL,
            severity     TEXT,
            root_causes  TEXT,
            actions      TEXT,
            explanation  TEXT,
            acknowledged INTEGER DEFAULT 0,
            resolved     INTEGER DEFAULT 0
        );
    """)
    c.commit()
    c.close()
    logger.info("Database initialised at %s", DB_PATH)


def insert_metrics(m: dict):
    try:
        c = _conn()
        c.execute(
            "INSERT INTO metrics "
            "(timestamp,cpu,memory,requests,latency,restarts,disk,network_in,network_out) "
            "VALUES (?,?,?,?,?,?,?,?,?)",
            (datetime.utcnow().isoformat(),
             m.get("cpu"), m.get("memory"), m.get("requests"),
             m.get("latency"), m.get("restarts"), m.get("disk"),
             m.get("network_in"), m.get("network_out"))
        )
        c.commit()
        c.close()
    except Exception as e:
        logger.error("insert_metrics: %s", e)


def insert_prediction(p: dict):
    try:
        c = _conn()
        c.execute(
            "INSERT INTO predictions "
            "(timestamp,failure,confidence,root_causes,actions,explanation) "
            "VALUES (?,?,?,?,?,?)",
            (datetime.utcnow().isoformat(), int(p["failure"]), p["confidence"],
             json.dumps(p.get("root_causes", [])),
             json.dumps(p.get("actions", [])),
             p.get("explanation", ""))
        )
        c.commit()
        c.close()
    except Exception as e:
        logger.error("insert_prediction: %s", e)


def insert_incident(inc: dict):
    try:
        c = _conn()
        c.execute(
            "INSERT INTO incidents "
            "(timestamp,severity,root_causes,actions,explanation) "
            "VALUES (?,?,?,?,?)",
            (datetime.utcnow().isoformat(), inc.get("severity", "warning"),
             json.dumps(inc.get("root_causes", [])),
             json.dumps(inc.get("actions", [])),
             inc.get("explanation", ""))
        )
        c.commit()
        c.close()
    except Exception as e:
        logger.error("insert_incident: %s", e)


def get_metrics_history(n: int = 60) -> list:
    try:
        c = _conn()
        rows = c.execute(
            "SELECT * FROM metrics ORDER BY id DESC LIMIT ?", (n,)
        ).fetchall()
        c.close()
        return [dict(r) for r in reversed(rows)]
    except Exception as e:
        logger.error("get_metrics_history: %s", e)
        return []


def get_recent_predictions(n: int = 10) -> list:
    try:
        c = _conn()
        rows = c.execute(
            "SELECT * FROM predictions ORDER BY id DESC LIMIT ?", (n,)
        ).fetchall()
        c.close()
        result = []
        for r in rows:
            d = dict(r)
            d["root_causes"] = json.loads(d.get("root_causes") or "[]")
            d["actions"]     = json.loads(d.get("actions")     or "[]")
            result.append(d)
        return result
    except Exception as e:
        logger.error("get_recent_predictions: %s", e)
        return []


def get_incidents(n: int = 20) -> list:
    try:
        c = _conn()
        rows = c.execute(
            "SELECT * FROM incidents ORDER BY id DESC LIMIT ?", (n,)
        ).fetchall()
        c.close()
        result = []
        for r in rows:
            d = dict(r)
            d["root_causes"] = json.loads(d.get("root_causes") or "[]")
            d["actions"]     = json.loads(d.get("actions")     or "[]")
            result.append(d)
        return result
    except Exception as e:
        logger.error("get_incidents: %s", e)
        return []


def acknowledge_incident(incident_id: int):
    try:
        c = _conn()
        c.execute("UPDATE incidents SET acknowledged=1 WHERE id=?", (incident_id,))
        c.commit()
        c.close()
    except Exception as e:
        logger.error("acknowledge_incident: %s", e)
