"""
Background metric collector.
Uses psutil for real system metrics if available,
otherwise runs a full simulation with realistic sinusoidal patterns.
Automatically injects faults at random for demo realism.
"""
import time
import math
import random
import threading
from datetime import datetime, timezone

from utils.config import COLLECTION_INTERVAL
from utils.logger import get_logger
from monitoring.buffer import metrics_buffer
from database.store import insert_metrics

logger = get_logger("collector")

# ── psutil probe ──────────────────────────────────────────────────────────────
try:
    import psutil as _psutil
    _HAS_PSUTIL = True
    logger.info("psutil available — real system metrics enabled")
except ImportError:
    _psutil = None          # type: ignore
    _HAS_PSUTIL = False
    logger.warning("psutil not installed — using full simulation mode")

# ── Global state ──────────────────────────────────────────────────────────────
_tick  = 0
_fault: dict = {"active": False, "type": None, "remaining": 0, "duration": 0}

FAULT_TYPES   = ["cpu_spike", "memory_leak", "traffic_burst", "crash_loop"]
FAULT_CHANCE  = 0.025   # 2.5% per tick ≈ one fault every ~2 minutes


def _maybe_inject_fault() -> None:
    global _fault
    if _fault["active"]:
        _fault["remaining"] -= 1
        if _fault["remaining"] <= 0:
            logger.info("[FAULT-CLEAR] %s ended", _fault["type"])
            _fault = {"active": False, "type": None, "remaining": 0, "duration": 0}
    else:
        if random.random() < FAULT_CHANCE:
            ftype    = random.choice(FAULT_TYPES)
            duration = random.randint(6, 20)
            _fault   = {"active": True, "type": ftype,
                        "remaining": duration, "duration": duration}
            logger.info("[FAULT-INJECT] type=%s duration=%d ticks", ftype, duration)


def _fault_progress() -> float:
    if not _fault["active"] or _fault["duration"] == 0:
        return 0.0
    return 1.0 - (_fault["remaining"] / _fault["duration"])


def _collect_real() -> dict:
    """Collect real host metrics via psutil."""
    cpu  = _psutil.cpu_percent(interval=None)
    mem  = _psutil.virtual_memory().percent
    disk = _psutil.disk_usage("/").percent
    net  = _psutil.net_io_counters()
    procs = len(_psutil.pids())
    return dict(
        cpu=round(cpu, 1),
        memory=round(mem, 1),
        disk=round(disk, 1),
        network_in=round(net.bytes_recv / 1_048_576, 2),   # MB
        network_out=round(net.bytes_sent / 1_048_576, 2),
        process_count=procs,
    )


def _collect_simulated() -> dict:
    """Pure simulation — realistic sinusoidal baselines."""
    t = _tick
    cpu  = 28 + 12 * math.sin(t * 0.07) + 4 * math.sin(t * 0.19) + random.gauss(0, 4)
    mem  = 52 + 8  * math.sin(t * 0.04) + random.gauss(0, 3)
    disk = 44 + 0.002 * t + random.gauss(0, 0.5)
    return dict(
        cpu=cpu, memory=mem, disk=disk,
        network_in=round(random.uniform(0.4, 3.5), 2),
        network_out=round(random.uniform(0.2, 2.2), 2),
        process_count=random.randint(90, 135),
    )


def _build_snapshot() -> dict:
    global _tick
    _tick += 1
    _maybe_inject_fault()
    p = _fault_progress()
    ft = _fault["type"]

    # ── Base host metrics ──────────────────────────────────────────────────
    base = _collect_real() if _HAS_PSUTIL else _collect_simulated()

    cpu  = base["cpu"]
    mem  = base["memory"]
    disk = base["disk"]

    # ── Simulated application metrics ─────────────────────────────────────
    req  = 250 + 75 * math.sin(_tick * 0.09) + random.gauss(0, 15)
    lat  = 215 + 45 * math.sin(_tick * 0.12) + random.gauss(0, 20)
    rst  = 0

    # ── Apply fault overlays ───────────────────────────────────────────────
    if ft == "cpu_spike":
        cpu += 30 + 25 * p + random.gauss(0, 5)
        lat += 180 + 160 * p + random.gauss(0, 25)
    elif ft == "memory_leak":
        mem = max(mem, 58 + 37 * p + random.gauss(0, 3))
    elif ft == "traffic_burst":
        req += 160 + 140 * p + random.gauss(0, 18)
        lat += 220 + 200 * p + random.gauss(0, 30)
    elif ft == "crash_loop":
        rst  = int(2 + 3 * p)
        cpu += 15 + 18 * p + random.gauss(0, 4)

    snapshot = {
        "timestamp":     datetime.now(timezone.utc).isoformat(),
        "cpu":           round(max(1.0,  min(100.0, cpu + random.gauss(0, 0.8))), 1),
        "memory":        round(max(5.0,  min(99.5,  mem + random.gauss(0, 0.5))), 1),
        "requests":      round(max(10.0, min(900.0, req)), 0),
        "latency":       round(max(50.0, min(2500.0, lat)), 0),
        "restarts":      float(max(0, rst)),
        "disk":          round(max(1.0,  min(99.9, disk)), 1),
        "network_in":    base["network_in"],
        "network_out":   base["network_out"],
        "process_count": base["process_count"],
        "fault_active":  _fault["active"],
        "fault_type":    ft,
    }
    return snapshot


def _run_loop() -> None:
    logger.info("Collector thread started (interval=%ds)", COLLECTION_INTERVAL)
    while True:
        try:
            snap = _build_snapshot()
            metrics_buffer.push(snap)
            insert_metrics(snap)
        except Exception as exc:
            logger.error("Collector error: %s", exc)
        time.sleep(COLLECTION_INTERVAL)


def start_collector() -> None:
    t = threading.Thread(target=_run_loop, daemon=True, name="metric-collector")
    t.start()
    logger.info("Metric collector running in background")
