"""
MineGuard AI - Model 3: Risk Score Prediction Training
=====================================================
Trains multiple models (Random Forest, Gradient Boosting, XGBoost)
to predict coal mine site/worker Risk Score tiers:
  - LOW (0)
  - MEDIUM (1)
  - HIGH (2)
  - CRITICAL (3)

Selects top model based on F1-score and saves to models/risk_predictor.pkl.
"""

import os
import sys
import joblib
from pathlib import Path
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, accuracy_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
OUTPUT_MODEL = MODELS_DIR / "risk_predictor.pkl"

sys.path.append(str(BASE_DIR / "src"))
from feature_engineering import generate_risk_dataset, RISK_MAP


def train_risk_predictor():
    """
    Trains candidate risk score predictors and selects top model.
    """
    print("\n==================================================")
    print("      MODEL 3: RISK SCORE PREDICTOR TRAINING")
    print("==================================================")
    
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate feature dataset
    df = generate_risk_dataset(num_samples=1500, seed=101)
    feature_cols = [
        "number_of_ppe_violations",
        "violation_frequency",
        "missing_critical_ppe_count",
        "historical_violation_trend",
        "zone_hazard_level",
        "shift_duration_hours",
        "consecutive_non_compliant_workers"
    ]
    target_col = "risk_score"
    
    X = df[feature_cols]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    candidate_models = {
        "Random Forest": RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    }
    
    if XGB_AVAILABLE:
        candidate_models["XGBoost"] = xgb.XGBClassifier(
            n_estimators=100, max_depth=6, learning_rate=0.08, random_state=42, eval_metric="mlogloss"
        )
        
    best_model_name = None
    best_model_obj = None
    best_f1 = -1.0
    results_summary = {}

    print("\n--- Training Candidate Risk Predictors ---")
    for name, model in candidate_models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        f1_weighted = f1_score(y_test, y_pred, average="weighted")
        f1_macro = f1_score(y_test, y_pred, average="macro")
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted")
        rec = recall_score(y_test, y_pred, average="weighted")
        
        results_summary[name] = {
            "model": model,
            "f1_weighted": f1_weighted,
            "f1_macro": f1_macro,
            "accuracy": acc,
            "precision": prec,
            "recall": rec
        }
        
        print(f"  > {name:20s} | F1 (Weighted): {f1_weighted:.4f} | Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f}")
        
        if f1_weighted > best_f1:
            best_f1 = f1_weighted
            best_model_name = name
            best_model_obj = model

    print(f"\n[OK] Selected Best Risk Predictor: '{best_model_name}' with F1-score: {best_f1:.4f}")
    
    best_pred = best_model_obj.predict(X_test)
    print("\nClassification Report (Best Risk Model):")
    print(classification_report(y_test, best_pred, target_names=[RISK_MAP[i] for i in range(4)]))
    
    save_payload = {
        "model_name": best_model_name,
        "model": best_model_obj,
        "feature_names": feature_cols,
        "class_mapping": RISK_MAP,
        "best_f1": best_f1
    }
    joblib.dump(save_payload, OUTPUT_MODEL)
    print(f"[OK] Risk Score Predictor saved to: {OUTPUT_MODEL}")
    
    return save_payload


if __name__ == "__main__":
    train_risk_predictor()
