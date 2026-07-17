"""
Singleton ensemble model loader.
Exposes weighted predict() and initialises SHAP after loading.
"""
import numpy as np
from typing import Dict, List, Any

from utils.config import MODEL_STORE, FAILURE_THRESHOLD
from utils.logger import get_logger

logger = get_logger("ensemble")


class EnsembleModel:
    def __init__(self):
        self._loaded              = False
        self.models:  Dict        = {}
        self.weights: Dict        = {}
        self.scaler:  Any         = None
        self.feature_names: List[str] = []
        self.feature_importances: Dict = {}

    def load(self) -> bool:
        path = MODEL_STORE / "ensemble.pkl"
        if not path.exists():
            logger.warning("ensemble.pkl not found — run: python ml_models/train.py")
            return False
        try:
            import joblib
            p = joblib.load(path)
            self.models              = p["models"]
            self.weights             = p["weights"]
            self.scaler              = p["scaler"]
            self.feature_names       = p["feature_names"]
            self.feature_importances = p.get("feature_importances", {})
            self._loaded = True
            logger.info("Ensemble loaded: %s", list(self.models.keys()))

            # Initialise SHAP with the RF model (best for TreeExplainer)
            try:
                from ai_engine.shap_explainer import init_shap
                init_shap(self.models["rf"], self.scaler, self.feature_names)
            except Exception as exc:
                logger.warning("SHAP init skipped: %s", exc)

            return True
        except Exception as exc:
            logger.error("Ensemble load failed: %s", exc)
            return False

    @property
    def is_ready(self) -> bool:
        return self._loaded

    def predict(self, feature_vector: List[float]) -> Dict:
        if not self._loaded:
            return {"failure": False, "confidence": 0.0, "raw_probas": {}}

        X    = np.array(feature_vector, dtype=np.float32).reshape(1, -1)
        X_sc = self.scaler.transform(X)

        weighted, raw = 0.0, {}
        for name, model in self.models.items():
            p = float(model.predict_proba(X_sc)[0][1])
            raw[name] = round(p, 4)
            weighted += p * self.weights.get(name, 0.0)

        confidence = round(weighted, 4)
        return {
            "failure":    confidence > FAILURE_THRESHOLD,
            "confidence": confidence,
            "raw_probas": raw,
        }

    def top_features(self, n: int = 5) -> List[str]:
        return list(self.feature_importances.keys())[:n]


ensemble = EnsembleModel()
