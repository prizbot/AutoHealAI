"""
SHAP value computation — fixed for shap 0.51 + numpy 2.x.

shap 0.41-0.44 : sv is list[class0_arr, class1_arr]  shape (n_samples, n_feats)
shap 0.45-0.48 : sv may be single arr shape (n_classes, n_samples, n_feats)
shap 0.49-0.51+: sv is single arr shape (n_samples, n_feats, n_classes)   <-- NEW

We probe the actual shape and pick the class-1 slice accordingly.
"""
from typing import List, Dict, Optional, Any
from utils.logger import get_logger

logger = get_logger("shap")

_HAS_SHAP = False
_state: Optional[Dict[str, Any]] = None

try:
    import shap as _shap
    import numpy as _np
    _HAS_SHAP = True
    logger.info("SHAP %s loaded OK", _shap.__version__)
except ImportError as e:
    logger.warning("shap not installed: %s", e)
except Exception as e:
    logger.error("shap import failed (%s): %s", type(e).__name__, e)


def _safe_float(v) -> float:
    """Safely extract a Python float from any numpy scalar, 0-d array, or list."""
    import numpy as np
    if isinstance(v, (list, tuple)):
        v = v[1] if len(v) > 1 else v[0]
    arr = np.asarray(v, dtype=np.float64)
    while arr.ndim > 0:
        arr = arr[0]
    return float(arr)


def init_shap(rf_model: Any, scaler: Any, feature_names: List[str]) -> bool:
    global _state
    if not _HAS_SHAP:
        return False
    try:
        try:
            explainer = _shap.TreeExplainer(rf_model, check_additivity=False)
        except TypeError:
            explainer = _shap.TreeExplainer(rf_model)

        _state = {"explainer": explainer, "scaler": scaler, "feature_names": feature_names}
        logger.info("SHAP TreeExplainer ready (%d features)", len(feature_names))
        return True
    except Exception as exc:
        logger.error("SHAP init failed: %s", exc)
        return False


def compute_shap(feature_vector: List[float]) -> Optional[Dict]:
    if not _HAS_SHAP or _state is None:
        return {"available": False, "values": []}

    try:
        import numpy as np

        X    = np.array(feature_vector, dtype=np.float64).reshape(1, -1)
        X_sc = _state["scaler"].transform(X)
        exp  = _state["explainer"]

        sv = exp.shap_values(X_sc)
        ev = exp.expected_value

        # ── Determine output shape and extract class-1 row ───────────────
        if isinstance(sv, list):
            # Old SHAP: list[class0_array, class1_array]
            # Each element shape (n_samples, n_features)
            raw  = np.asarray(sv[1] if len(sv) > 1 else sv[0], dtype=np.float64)
            raw  = raw.reshape(-1)   # flatten to (n_features,)
            base = _safe_float(ev[1] if hasattr(ev, '__len__') and len(ev) > 1 else ev)

        else:
            arr = np.asarray(sv, dtype=np.float64)
            logger.debug("SHAP sv shape: %s", arr.shape)

            if arr.ndim == 3:
                s = arr.shape
                if s[0] == 1:
                    # shape (1, n_features, n_classes) — new SHAP 0.49+
                    raw  = arr[0, :, 1] if s[2] > 1 else arr[0, :, 0]
                    base_arr = np.asarray(ev, dtype=np.float64)
                    base = _safe_float(base_arr.flat[1] if base_arr.size > 1 else base_arr.flat[0])
                elif s[2] == 1 or s[0] == s[2]:
                    # shape (n_classes, n_samples, n_features) — SHAP 0.45-0.48
                    cls1_idx = 1 if s[0] > 1 else 0
                    raw  = arr[cls1_idx, 0, :]
                    base_arr = np.asarray(ev, dtype=np.float64)
                    base = _safe_float(base_arr.flat[cls1_idx] if base_arr.size > cls1_idx else base_arr.flat[0])
                else:
                    # Fallback: treat first dim as classes
                    raw  = arr[min(1, s[0]-1), 0, :]
                    base = _safe_float(ev)
            elif arr.ndim == 2:
                # shape (n_samples, n_features) — single class output
                raw  = arr[0, :]
                base = _safe_float(ev)
            else:
                raw  = arr.flatten()
                base = _safe_float(ev)

        raw  = np.asarray(raw, dtype=np.float64).flatten()
        names = _state["feature_names"]
        n     = min(len(names), len(raw))
        names = names[:n]
        raw   = raw[:n]

        # Sanity check: SHAP values for class 1 should be in roughly [-1, 1]
        # If max abs < 0.001 we likely got the wrong class — try negating
        # (some SHAP versions return class-0 contribution which sums opposite)
        if np.abs(raw).max() < 0.001:
            logger.warning("SHAP values suspiciously small (max=%.6f); data may be class-0 slice", np.abs(raw).max())

        max_abs = float(np.abs(raw).max()) or 1.0

        pairs = []
        for name, val in zip(names, raw.tolist()):
            fval = float(val)
            pairs.append({
                "feature":   name,
                "value":     round(fval, 5),           # raw SHAP contribution
                "pct":       round(abs(fval) / max_abs * 100, 1),  # % of max for bar width
                "direction": "positive" if fval >= 0 else "negative",
            })

        pairs.sort(key=lambda x: abs(x["value"]), reverse=True)

        total_pos = sum(v["value"] for v in pairs if v["value"] > 0)
        total_neg = sum(v["value"] for v in pairs if v["value"] < 0)
        logger.info("SHAP OK — base=%.3f total+%.3f total%.3f top=%s",
                    base, total_pos, total_neg, pairs[0]["feature"] if pairs else "?")

        return {
            "available":  True,
            "base_value": round(float(base), 4),
            "values":     pairs[:10],
        }

    except Exception as exc:
        import traceback
        logger.error("SHAP compute error: %s\n%s", exc, traceback.format_exc())
        return {"available": False, "values": []}