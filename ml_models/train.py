"""
Train the AutoHealAI ensemble model.
Run:  python ml_models/train.py
      (from autoheal_ai_v2/ directory)
"""
import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import (
    accuracy_score, roc_auc_score, classification_report, confusion_matrix
)

from ml_models.feature_engineering import FeatureEngineer
from utils.config import MODEL_STORE, DATA_PATH
from utils.logger import get_logger

logger = get_logger("trainer")


def train():
    MODEL_STORE.mkdir(parents=True, exist_ok=True)

    # ── Load dataset ──────────────────────────────────────────────────────
    if not DATA_PATH.exists():
        logger.error(
            "Dataset not found at %s\n"
            "Run:  python simulation/data_generator.py", DATA_PATH
        )
        sys.exit(1)

    logger.info("Loading dataset: %s", DATA_PATH)
    df = pd.read_csv(DATA_PATH)
    logger.info("Rows: %d  |  Failure rate: %.1f%%", len(df), df["failure"].mean() * 100)

    # ── Feature engineering (batch mode) ─────────────────────────────────
    fe = FeatureEngineer()
    df = fe.fit_transform(df)
    feat_cols = fe.get_feature_names()

    X = df[feat_cols].values.astype(np.float32)
    y = df["failure"].values

    # ── Scaling ───────────────────────────────────────────────────────────
    scaler = StandardScaler()
    X_sc   = scaler.fit_transform(X)

    # ── Models ────────────────────────────────────────────────────────────
    models = {
        "rf": RandomForestClassifier(
            n_estimators=200, max_depth=12, min_samples_leaf=4,
            class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "gb": GradientBoostingClassifier(
            n_estimators=150, learning_rate=0.08, max_depth=5,
            subsample=0.8, random_state=42
        ),
        "lr": LogisticRegression(
            C=1.0, max_iter=2000, class_weight="balanced",
            solver="lbfgs", random_state=42
        ),
    }
    weights = {"rf": 0.40, "gb": 0.40, "lr": 0.20}

    # ── Cross-validation ─────────────────────────────────────────────────
    skf     = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_report = {}

    logger.info("Running 5-fold stratified cross-validation …")
    for name, model in models.items():
        cv_auc = cross_val_score(model, X_sc, y, cv=skf,
                                 scoring="roc_auc", n_jobs=-1)
        logger.info("  %-4s  CV-AUC = %.4f ± %.4f", name, cv_auc.mean(), cv_auc.std())
        model.fit(X_sc, y)
        cv_report[name] = {
            "cv_auc_mean": round(float(cv_auc.mean()), 4),
            "cv_auc_std":  round(float(cv_auc.std()),  4),
            "weight":      weights[name],
        }

    # ── Ensemble evaluation on training set ──────────────────────────────
    ensemble_proba = sum(
        models[n].predict_proba(X_sc)[:, 1] * weights[n]
        for n in models
    )
    ens_pred = (ensemble_proba >= 0.60).astype(int)
    ens_auc  = roc_auc_score(y, ensemble_proba)
    ens_acc  = accuracy_score(y, ens_pred)

    logger.info("Ensemble  AUC=%.4f  Acc=%.4f", ens_auc, ens_acc)
    print("\n=== Classification Report (Training Set) ===")
    print(classification_report(y, ens_pred, target_names=["healthy", "failure"]))
    print("Confusion Matrix:")
    print(confusion_matrix(y, ens_pred))

    # ── Feature importances (from RF) ─────────────────────────────────────
    importances = models["rf"].feature_importances_
    imp_dict    = {f: round(float(v), 6) for f, v in zip(feat_cols, importances)}
    imp_sorted  = dict(sorted(imp_dict.items(), key=lambda x: -x[1]))
    logger.info("Top-5 features: %s", list(imp_sorted.keys())[:5])

    # ── Save artefacts ────────────────────────────────────────────────────
    payload = {
        "models":              models,
        "weights":             weights,
        "scaler":              scaler,
        "feature_names":       feat_cols,
        "feature_importances": imp_sorted,
    }
    model_path = MODEL_STORE / "ensemble.pkl"
    joblib.dump(payload, model_path)
    logger.info("Model saved → %s", model_path)

    report = {
        "models":              cv_report,
        "ensemble_auc":        round(ens_auc, 4),
        "ensemble_accuracy":   round(ens_acc, 4),
        "feature_importances": imp_sorted,
        "n_features":          len(feat_cols),
        "n_samples":           int(len(df)),
        "failure_rate":        round(float(y.mean()), 4),
    }
    with open(MODEL_STORE / "training_report.json", "w") as fh:
        json.dump(report, fh, indent=2)
    logger.info("Training report saved → %s", MODEL_STORE / "training_report.json")

    return payload


if __name__ == "__main__":
    train()
