"""
generate_report_graphs.py
Run from your project root:  python generate_report_graphs.py
Outputs 5 PNG images into a  report_graphs/  folder.
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# ── paths ─────────────────────────────────────────────────────────────────────
CSV_PATH   = "data/synthetic_metrics.csv"
JSON_PATH  = "ml_models/model_store/training_report.json"
MODEL_PATH = "ml_models/model_store/ensemble.pkl"
OUT_DIR    = "report_graphs"

os.makedirs(OUT_DIR, exist_ok=True)

C_BLUE   = "#4C72B0"
C_GREEN  = "#55A868"
C_RED    = "#C44E52"
C_ORANGE = "#DD8452"
C_PURPLE = "#8172B2"
GRID_KW  = dict(color="#e0e0e0", linewidth=0.7, linestyle="--")


# ─────────────────────────────────────────────────────────────────────────────
# loaders
# ─────────────────────────────────────────────────────────────────────────────
def load_data():
    df = pd.read_csv(CSV_PATH)
    df.index = pd.RangeIndex(len(df))
    return df

def load_report():
    with open(JSON_PATH) as f:
        return json.load(f)

def load_model():
    import joblib
    raw = joblib.load(MODEL_PATH)
    print(f"  pkl keys: {list(raw.keys())}")
    return raw          # return the full dict; we unpack in build_X / predict


# ─────────────────────────────────────────────────────────────────────────────
# feature engineering + prediction using the pkl dict directly
# ─────────────────────────────────────────────────────────────────────────────
def build_X(df, model_dict):
    """
    Use the scaler and feature_names stored inside the pkl dict to produce
    the exact feature matrix the sub-models were trained on.
    """
    feature_names = model_dict["feature_names"]   # list of column names
    scaler        = model_dict["scaler"]           # fitted StandardScaler (or similar)

    # ── engineer all possible rolling/trend columns ──────────────────────────
    base_cols = ["cpu", "memory", "requests", "latency", "restarts"]
    eng = df[base_cols].copy()
    for col in base_cols:
        eng[f"{col}_roll"]  = df[col].rolling(5,  min_periods=1).mean()
        eng[f"{col}_trend"] = (df[col].rolling(10, min_periods=1).mean()
                             - df[col].rolling(30, min_periods=1).mean())

    # select only the columns the model was trained on, in the right order
    missing = [c for c in feature_names if c not in eng.columns]
    if missing:
        raise ValueError(f"Cannot build features — missing columns: {missing}\n"
                         f"Available: {list(eng.columns)}")

    X_raw = eng[feature_names].values
    X     = scaler.transform(X_raw)
    print(f"  feature matrix: {X.shape}  features: {feature_names}")
    return X


def ensemble_predict(X, model_dict):
    """Weighted average of predict_proba across all sub-models."""
    sub_models = model_dict["models"]    # dict  {name: fitted_estimator}
    weights    = model_dict["weights"]   # dict  {name: float}  or list

    # normalise weights to sum to 1
    if isinstance(weights, dict):
        names = list(sub_models.keys())
        w_arr = np.array([weights[n] for n in names], dtype=float)
    else:
        names = list(sub_models.keys())
        w_arr = np.array(weights, dtype=float)
    w_arr /= w_arr.sum()

    proba = np.zeros((len(X), 2))
    for name, w in zip(names, w_arr):
        m = sub_models[name]
        proba += w * m.predict_proba(X)
        print(f"    sub-model '{name}'  weight={w:.3f}  "
              f"predicted failures: {(m.predict(X)==1).sum()}")

    y_prob = proba[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)
    return y_pred, y_prob


def save(fig, name):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved  {path}")


# ─────────────────────────────────────────────────────────────────────────────
# 1. CPU Usage Trend
# ─────────────────────────────────────────────────────────────────────────────
def plot_cpu_trend(df):
    fig, ax = plt.subplots(figsize=(10, 4))
    window  = max(1, len(df) // 100)
    rolling = df["cpu"].rolling(window, center=True).mean()

    ax.plot(df.index, df["cpu"], color=C_BLUE, alpha=0.25, linewidth=0.6, label="Raw CPU %")
    ax.plot(df.index, rolling,   color=C_BLUE, linewidth=2, label=f"Rolling avg (w={window})")
    ax.axhline(df["cpu"].mean(), color=C_ORANGE, linestyle="--", linewidth=1.4,
               label=f"Mean {df['cpu'].mean():.1f}%")

    ax.set_title("CPU Usage Trend Over Time", fontsize=14, fontweight="bold")
    ax.set_xlabel("Sample Index")
    ax.set_ylabel("CPU Usage (%)")
    ax.legend(fontsize=9)
    ax.yaxis.set_major_formatter(mticker.PercentFormatter(xmax=100))
    ax.grid(**GRID_KW)
    fig.tight_layout()
    save(fig, "1_cpu_usage_trend.png")


# ─────────────────────────────────────────────────────────────────────────────
# 2. Memory Usage Trend
# ─────────────────────────────────────────────────────────────────────────────
def plot_memory_trend(df):
    fig, ax = plt.subplots(figsize=(10, 4))
    window  = max(1, len(df) // 100)
    rolling = df["memory"].rolling(window, center=True).mean()

    ax.plot(df.index, df["memory"], color=C_GREEN, alpha=0.25, linewidth=0.6, label="Raw Memory %")
    ax.plot(df.index, rolling,      color=C_GREEN, linewidth=2, label=f"Rolling avg (w={window})")
    ax.axhline(df["memory"].mean(), color=C_ORANGE, linestyle="--", linewidth=1.4,
               label=f"Mean {df['memory'].mean():.1f}%")

    ax.set_title("Memory Usage Trend Over Time", fontsize=14, fontweight="bold")
    ax.set_xlabel("Sample Index")
    ax.set_ylabel("Memory Usage (%)")
    ax.legend(fontsize=9)
    ax.yaxis.set_major_formatter(mticker.PercentFormatter(xmax=100))
    ax.grid(**GRID_KW)
    fig.tight_layout()
    save(fig, "2_memory_usage_trend.png")


# ─────────────────────────────────────────────────────────────────────────────
# 3. Model Accuracy Bar Chart  (JSON only)
# ─────────────────────────────────────────────────────────────────────────────
def plot_model_accuracy(report):
    models   = report["models"]
    names    = list(models.keys()) + ["Ensemble"]
    auc_vals = [v["cv_auc_mean"] for v in models.values()] + [report["ensemble_auc"]]
    errors   = [v["cv_auc_std"]  for v in models.values()] + [0]
    weights  = [v["weight"]      for v in models.values()] + [None]

    label_map = {"rf": "Random\nForest", "gb": "Gradient\nBoost",
                 "lr": "Logistic\nRegression", "Ensemble": "Ensemble"}
    display  = [label_map.get(n, n) for n in names]
    colours  = [C_BLUE, C_GREEN, C_PURPLE, C_ORANGE]

    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(display, auc_vals, color=colours, width=0.5,
                  yerr=errors, capsize=5, error_kw=dict(elinewidth=1.5))

    for bar, val, w in zip(bars, auc_vals, weights):
        label = f"{val:.4f}" + (f"\n(w={w})" if w is not None else "")
        ax.text(bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.0005,
                label, ha="center", va="bottom", fontsize=9)

    ax.set_ylim(0.97, 1.005)
    ax.set_title("ML Model AUC Accuracy Comparison", fontsize=14, fontweight="bold")
    ax.set_ylabel("Cross-Validated AUC")
    ax.grid(axis="y", **GRID_KW)
    fig.tight_layout()
    save(fig, "3_model_accuracy_comparison.png")


# ─────────────────────────────────────────────────────────────────────────────
# 4. Confusion Matrix
# ─────────────────────────────────────────────────────────────────────────────
def plot_confusion_matrix(df, model_dict, X, y_pred):
    y_true = df["failure"].values

    cm  = confusion_matrix(y_true, y_pred)
    cmd = ConfusionMatrixDisplay(cm, display_labels=["Normal (0)", "Failure (1)"])

    fig, ax = plt.subplots(figsize=(6, 5))
    cmd.plot(ax=ax, colorbar=False, cmap="Blues")
    ax.set_title("Confusion Matrix -- Ensemble Model", fontsize=14, fontweight="bold")

    total = cm.sum()
    for text in ax.texts:
        val = int(text.get_text())
        text.set_text(f"{val}\n({val/total*100:.1f}%)")

    fig.tight_layout()
    save(fig, "4_confusion_matrix.png")
    return y_true


# ─────────────────────────────────────────────────────────────────────────────
# 5. Prediction vs Actual
# ─────────────────────────────────────────────────────────────────────────────
def plot_prediction_vs_actual(df, y_true, y_pred, y_prob):
    fig, ax = plt.subplots(figsize=(12, 4))

    ax.plot(df.index, y_prob, color=C_BLUE, linewidth=0.8, alpha=0.7,
            label="Predicted failure probability")
    ax.scatter(df.index[y_true == 1], y_prob[y_true == 1],
               color=C_RED,   s=12, zorder=5, label="Actual failure")
    ax.scatter(df.index[y_true == 0], y_prob[y_true == 0],
               color=C_GREEN, s=4,  alpha=0.3, zorder=4, label="Actual normal")
    ax.axhline(0.5, color=C_ORANGE, linestyle="--", linewidth=1.2,
               label="Decision boundary (0.5)")

    ax.set_title("Predicted Failure Probability vs Actual Labels",
                 fontsize=14, fontweight="bold")
    ax.set_xlabel("Sample Index")
    ax.set_ylabel("Predicted Probability")
    ax.set_ylim(-0.05, 1.05)
    ax.legend(fontsize=8, ncol=2)
    ax.grid(**GRID_KW)
    fig.tight_layout()
    save(fig, "5_prediction_vs_actual.png")


# ─────────────────────────────────────────────────────────────────────────────
# main
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("Loading data ...")
    df         = load_data()
    report     = load_report()
    model_dict = load_model()

    print(f"  dataset : {df.shape[0]} rows x {df.shape[1]} cols\n")
    print("Generating graphs ...")

    plot_cpu_trend(df)
    plot_memory_trend(df)
    plot_model_accuracy(report)

    print("\nRunning ensemble inference ...")
    X              = build_X(df, model_dict)
    y_pred, y_prob = ensemble_predict(X, model_dict)

    plot_confusion_matrix(df, model_dict, X, y_pred)
    plot_prediction_vs_actual(df, df["failure"].values, y_pred, y_prob)

    print(f"\nDone -- 5 PNGs saved to ./{OUT_DIR}/")

if __name__ == "__main__":
    main()