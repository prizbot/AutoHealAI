from fastapi import APIRouter, Query
from monitoring.buffer import metrics_buffer
from database.store import get_metrics_history

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])


@router.get("/current")
async def get_current_metrics():
    """Return the single latest metric snapshot."""
    m = metrics_buffer.latest()
    return {"status": "ok" if m else "no_data", "metrics": m}


@router.get("/history")
async def get_metrics_history_endpoint(n: int = Query(60, ge=1, le=500)):
    """Return the last N metric rows from SQLite."""
    rows = get_metrics_history(n)
    return {"status": "ok", "count": len(rows), "data": rows}


@router.get("/buffer")
async def buffer_status():
    """Return current ring-buffer occupancy."""
    return {"buffer_size": len(metrics_buffer), "max_size": 200}
