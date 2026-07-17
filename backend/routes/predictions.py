from fastapi import APIRouter
from monitoring.buffer import metrics_buffer
from monitoring.demo_fault import demo_fault
from ai_engine.predictor import run_prediction
from database.store import get_recent_predictions

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


@router.get("/latest")
async def get_latest_prediction():
    m = metrics_buffer.latest()
    if not m:
        return {"status": "no_data", "prediction": None, "demo_active": False}

    # Apply demo fault overlay — returns a copy, never touches real metrics
    effective = demo_fault.apply_overlay(m)
    prediction = run_prediction(effective)

    return {
        "status":       "ok",
        "prediction":   prediction,
        "demo_active":  demo_fault.active,
        "demo_fault":   demo_fault.fault_type,
    }


@router.get("/history")
async def get_prediction_history():
    rows = get_recent_predictions(10)
    return {"status": "ok", "data": rows}
