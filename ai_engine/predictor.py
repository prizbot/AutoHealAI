"""
AI predictor — full pipeline:
  raw metrics → feature engineering → ensemble ML
  → root cause → actions → NL explanation → SHAP → DB persist
"""
from datetime import datetime, timezone

from ml_models.ensemble import ensemble
from ml_models.feature_engineering import FeatureEngineer
from ai_engine.root_cause import detect_root_cause
from ai_engine.actions import recommend_actions
from ai_engine.explainer import generate_explanation
from database.store import insert_prediction, insert_incident
from utils.logger import get_logger

logger = get_logger("predictor")
_fe = FeatureEngineer()   # stateful — maintains rolling window


def run_prediction(metrics: dict) -> dict:
    if not ensemble.is_ready:
        return {
            "failure": False, "confidence": 0.0, "confidence_raw": 0.0,
            "status": "MODEL_NOT_READY",
            "root_causes": [], "cause_severities": {}, "actions": [],
            "explanation": "Run: python ml_models/train.py then restart backend.",
            "severity": "info", "model_probas": {}, "top_features": [],
            "shap": {"available": False, "values": []},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    features = _fe.transform_single(metrics)
    ml_result  = ensemble.predict(features)
    confidence = ml_result["confidence"]
    failure    = ml_result["failure"]

    rc       = detect_root_cause(metrics)
    causes   = rc["causes"]
    severity = rc["overall_severity"]
    actions  = recommend_actions(causes)
    explanation = generate_explanation(metrics, causes, confidence)

    # SHAP values (optional — graceful if not available)
    shap_data = {"available": False, "values": []}
    try:
        from ai_engine.shap_explainer import compute_shap
        result = compute_shap(features)
        if result:
            shap_data = result
    except Exception as exc:
        logger.debug("SHAP skipped: %s", exc)

    prediction = {
        "failure":          failure,
        "confidence":       round(confidence * 100, 1),
        "confidence_raw":   confidence,
        "status":           "FAILURE LIKELY" if failure else "SYSTEM HEALTHY",
        "root_causes":      causes,
        "cause_severities": rc["severities"],
        "actions":          actions,
        "explanation":      explanation,
        "severity":         severity,
        "model_probas":     ml_result["raw_probas"],
        "top_features":     ensemble.top_features(5),
        "shap":             shap_data,
        "timestamp":        datetime.now(timezone.utc).isoformat(),
    }

    try:
        insert_prediction({
            "failure": failure, "confidence": confidence,
            "root_causes": causes,
            "actions": [a["action"] for a in actions],
            "explanation": explanation,
        })
        if failure:
            insert_incident({
                "severity": severity, "root_causes": causes,
                "actions": [a["action"] for a in actions],
                "explanation": explanation,
            })
    except Exception as exc:
        logger.error("DB persist error: %s", exc)

    return prediction
