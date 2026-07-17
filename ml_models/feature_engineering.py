"""
Feature engineering — dual-mode:
  fit_transform(df)       → batch mode for training (uses DataFrame rolling)
  transform_single(m)     → online inference mode (stateful ring-buffer rolling)
"""
from collections import deque
from typing import List
import numpy as np
import pandas as pd

from utils.config import ROLLING_WINDOW, FEATURE_NAMES


class FeatureEngineer:
    def __init__(self, window: int = ROLLING_WINDOW):
        self.window   = window
        self._buffer: deque = deque(maxlen=window)   # online inference buffer

    # ── Training mode ────────────────────────────────────────────────────────
    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        for col in FEATURE_NAMES:
            df[f"{col}_roll"] = (
                df[col].rolling(window=self.window, min_periods=1).mean().round(4)
            )
            df[f"{col}_trend"] = df[col].diff().fillna(0).round(4)
        return df

    def get_feature_names(self) -> List[str]:
        return (
            list(FEATURE_NAMES)
            + [f"{c}_roll"  for c in FEATURE_NAMES]
            + [f"{c}_trend" for c in FEATURE_NAMES]
        )

    # ── Inference mode ───────────────────────────────────────────────────────
    def transform_single(self, metrics: dict) -> List[float]:
        """Returns a flat feature vector using a stateful rolling window."""
        raw = [float(metrics.get(f, 0.0)) for f in FEATURE_NAMES]
        self._buffer.append(raw)

        arr     = np.array(list(self._buffer), dtype=np.float32)
        rolling = arr.mean(axis=0).tolist()
        trend   = (arr[-1] - arr[-2]).tolist() if len(arr) >= 2 else [0.0] * len(FEATURE_NAMES)

        return raw + rolling + trend

    def reset(self):
        self._buffer.clear()
