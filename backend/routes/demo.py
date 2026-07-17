"""
Demo fault injection controls.
These NEVER affect real metrics stored in the DB or ring buffer.
The overlay is applied only at prediction time (see predictions.py).
"""
from fastapi import APIRouter, Path
from pydantic import BaseModel
from monitoring.demo_fault import demo_fault, DemoFaultState

router = APIRouter(prefix="/api/demo", tags=["Demo Controls"])


class InjectBody(BaseModel):
    intensity: float = 0.85   # 0.1–1.0 severity multiplier


@router.post("/inject/{fault_type}")
async def inject_fault(
    fault_type: str = Path(..., description="One of: cpu_spike, memory_leak, traffic_burst, crash_loop, combined"),
    body: InjectBody = InjectBody(),
):
    if fault_type not in DemoFaultState.VALID:
        return {"status": "error", "message": f"Valid types: {DemoFaultState.VALID}"}
    demo_fault.inject(fault_type, body.intensity)
    return {
        "status":    "injected",
        "fault":     fault_type,
        "intensity": body.intensity,
        "note":      "Overlay applied to AI predictions only — DB and ring buffer untouched",
    }


@router.delete("/inject")
async def clear_fault():
    demo_fault.clear()
    return {"status": "cleared"}


@router.get("/status")
async def status():
    return {
        "active":    demo_fault.active,
        "fault":     demo_fault.fault_type,
        "intensity": demo_fault.intensity,
    }
