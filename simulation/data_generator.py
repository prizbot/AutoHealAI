"""
Synthetic dataset generator for AutoHealAI v2.
Produces 7,000 rows of realistic system metrics with injected fault events.

Run:  python simulation/data_generator.py
      (from autoheal_ai_v2/ directory)
"""
import sys
from pathlib import Path

# Allow running directly from any working directory
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import numpy as np
import pandas as pd

from utils.config import DATA_PATH
from utils.logger import get_logger

logger = get_logger("datagen")


def _inject_windows(arr: np.ndarray, n_windows: int,
                    lo_len: int, hi_len: int,
                    seed_offset: int = 0) -> list:
    """Return list of (start, end) index pairs, non-overlapping."""
    rng = np.random.RandomState(42 + seed_offset)
    starts = sorted(rng.choice(len(arr) - hi_len, n_windows, replace=False).tolist())
    return [(int(s), int(s) + int(rng.randint(lo_len, hi_len))) for s in starts]


def generate(n: int = 7000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.RandomState(seed)
    t   = np.arange(n, dtype=float)

    # ── Diurnal sinusoidal baselines ──────────────────────────────────────
    cpu  = (30
            + 14 * np.sin(t * 0.050)
            +  4 * np.sin(t * 0.210)
            +  2 * np.sin(t * 0.430)
            + rng.normal(0, 5, n))
    mem  = (50
            + 10 * np.sin(t * 0.030)
            +  3 * np.sin(t * 0.130)
            + rng.normal(0, 4, n))
    req  = (260
            + 80 * np.sin(t * 0.080)
            + 20 * np.sin(t * 0.250)
            + rng.normal(0, 18, n))
    lat  = (215
            + 50 * np.sin(t * 0.060)
            + 15 * np.sin(t * 0.180)
            + rng.normal(0, 22, n))
    rst  = np.zeros(n)

    # ── Fault 1: CPU spikes ────────────────────────────────────────────────
    for s, e in _inject_windows(cpu, 35, 5, 20, seed_offset=0):
        mag        = rng.uniform(28, 60)
        cpu[s:e]  += mag + rng.normal(0, 4, e - s)
        lat[s:e]  += mag * 4.2 + rng.normal(0, 30, e - s)

    # ── Fault 2: Memory leaks (gradual growth) ────────────────────────────
    for s, e in _inject_windows(mem, 22, 14, 45, seed_offset=1):
        growth     = np.linspace(0, rng.uniform(28, 55), e - s)
        mem[s:e]  += growth

    # ── Fault 3: Traffic bursts ───────────────────────────────────────────
    for s, e in _inject_windows(req, 30, 5, 18, seed_offset=2):
        b          = rng.uniform(140, 310)
        req[s:e]  += b + rng.normal(0, 20, e - s)
        lat[s:e]  += b * 1.35 + rng.normal(0, 30, e - s)

    # ── Fault 4: Crash loops ──────────────────────────────────────────────
    for s, e in _inject_windows(rst, 18, 3, 10, seed_offset=3):
        rst[s:e]   = rng.randint(2, 6, e - s)
        cpu[s:e]  += rng.uniform(12, 28)

    # ── Clamp to realistic ranges ─────────────────────────────────────────
    cpu  = np.clip(cpu,  1.0,  100.0)
    mem  = np.clip(mem,  5.0,  100.0)
    req  = np.clip(req,  5.0,  900.0)
    lat  = np.clip(lat, 40.0, 2500.0)
    rst  = np.clip(rst,  0.0,   10.0)

    df = pd.DataFrame({
        "cpu":      np.round(cpu, 1),
        "memory":   np.round(mem, 1),
        "requests": np.round(req, 0),
        "latency":  np.round(lat, 0),
        "restarts": rst.astype(int),
    })

    # ── Multi-condition failure labelling ─────────────────────────────────
    failure = (
        ((df.cpu      > 85) & (df.latency  > 480))           |
        ((df.cpu      > 85) & (df.memory   > 78))            |
        (df.memory    > 90)                                   |
        (df.restarts  > 2)                                    |
        ((df.latency  > 700) & (df.requests > 360))          |
        ((df.cpu      > 78) & (df.memory   > 80)
                            & (df.latency  > 380))
    )
    df["failure"] = failure.astype(int)

    pos  = df["failure"].sum()
    rate = pos / len(df)
    logger.info("Generated %d rows | positives=%d (%.1f%%)", len(df), pos, rate * 100)
    return df


def main():
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df = generate()
    df.to_csv(DATA_PATH, index=False)
    logger.info("Saved → %s", DATA_PATH)
    print("\n=== Dataset Summary ===")
    print(df.describe().round(2).to_string())
    print(f"\nFailure rate : {df['failure'].mean():.1%}")
    print(f"Total rows   : {len(df):,}")


if __name__ == "__main__":
    main()
