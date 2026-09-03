"""
MineGuard AI - Model 2: Safety Compliance Classification Training
================================================================
Trains multiple classifiers (Logistic Regression, Random Forest, XGBoost)
to determine worker compliance status:
  - Compliant (0)
  - Partial Compliance (1)
  - Non-Compliant (2)

Selects the top-performing model based on F1-score and saves it to models/compliance_classifier.pkl.
"""

import os
import sys
import joblib
from pathlib import Path
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
OUTPUT_MODEL = MODELS_DIR / "compliance_classifier.pkl"

sys.path.append(str(BASE_DIR / "src"))
from feature_engineering import generate_compliance_dataset, COMPLIANCE_MAP


def train_compliance_classifier():
    """
    Trains and evaluates multiple candidate models for Safety Compliance Classification.
    """
    print("\n==================================================")
    print("  MODEL 2: SAFETY COMPLIANCE CLASSIFIER TRAINING")
    print("==================================================")
    
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate feature dataset
    df = generate_compliance_dataset(num_samples=1500, seed=42)
    feature_cols = [
        "helmet_detected",
        "gloves_detected",
        "shoes_detected",
        "mask_detected",
        "protective_clothing_detected",
        "avg_detection_confidence",
        "total_detected_items",
        "missing_ppe_count"
    ]
    target_col = "compliance_status"
    
    X = df[feature_cols]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    candidate_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    }
    
    if XGB_AVAILABLE:
        candidate_models["XGBoost"] = xgb.XGBClassifier(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42, eval_metric="mlogloss"
        )
    else:
        candidate_models["Extra Trees (Fallback)"] = ExtraTreesClassifier(
            n_estimators=100, random_state=42
        )
        
    best_model_name = None
    best_model_obj = None
    best_f1 = -1.0
    results_summary = {}

    print("\n--- Training Candidate Classifiers ---")
    for name, model in candidate_models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        f1_weighted = f1_score(y_test, y_pred, average="weighted")
        f1_macro = f1_score(y_test, y_pred, average="macro")
        prec = precision_score(y_test, y_pred, average="weighted")
        rec = recall_score(y_test, y_pred, average="weighted")
        
        results_summary[name] = {
            "model": model,
            "f1_weighted": f1_weighted,
            "f1_macro": f1_macro,
            "precision": prec,
            "recall": rec
        }
        
        print(f"  > {name:25s} | F1 (Weighted): {f1_weighted:.4f} | F1 (Macro): {f1_macro:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f}")
        
        if f1_weighted > best_f1:
            best_f1 = f1_weighted
            best_model_name = name
            best_model_obj = model

    print(f"\n[OK] Selected Best Model: '{best_model_name}' with F1-score: {best_f1:.4f}")
    
    # Detailed report for best model
    best_pred = best_model_obj.predict(X_test)
    print("\nClassification Report (Best Model):")
    print(classification_report(y_test, best_pred, target_names=[COMPLIANCE_MAP[i] for i in range(3)]))
    
    # Save best model dictionary containing model object and metadata
    save_payload = {
        "model_name": best_model_name,
        "model": best_model_obj,
        "feature_names": feature_cols,
        "class_mapping": COMPLIANCE_MAP,
        "best_f1": best_f1
    }
    joblib.dump(save_payload, OUTPUT_MODEL)
    print(f"[OK] Safety Compliance Classifier saved to: {OUTPUT_MODEL}")
    
    return save_payload


if __name__ == "__main__":
    train_compliance_classifier()
