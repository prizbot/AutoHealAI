from fastapi import APIRouter, Path, Query
from database.store import get_incidents, acknowledge_incident

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("/incidents")
async def list_incidents(n: int = Query(20, ge=1, le=100)):
    """Return last N incidents ordered by most recent first."""
    data = get_incidents(n)
    return {"status": "ok", "count": len(data), "data": data}


@router.post("/incidents/{incident_id}/acknowledge")
async def ack_incident(incident_id: int = Path(..., description="Incident ID to acknowledge")):
    """Mark an incident as acknowledged."""
    acknowledge_incident(incident_id)
    return {"status": "ok", "acknowledged_id": incident_id}
