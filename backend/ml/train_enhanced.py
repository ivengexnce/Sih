import random
import csv
import json
import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, VotingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

random.seed(42)
np.random.seed(42)

def generate_balanced_enhanced_datasets():
    data_dir = r"c:\Users\Aasawari Bodke\Sih\backend\data"
    os.makedirs(data_dir, exist_ok=True)
    
    rows = []
    headers = [
        "depth_m", "gassiness_degree", "open_violations", "days_since_last_inspection",
        "ch4_pct", "co_ppm", "o2_pct", "ventilation_velocity_ms", "workers_count",
        "equipment_faults", "strata_stress_mpa", "temp_c", "humidity_pct",
        "grahams_ratio", "gas_dispersion_index", "inspection_risk_factor",
        "risk_level"
    ]
    
    for _ in range(3000):
        depth = random.randint(40, 680)
        gassiness = random.choices([1, 2, 3], weights=[0.45, 0.35, 0.20])[0]
        violations = random.randint(0, 12)
        days_insp = random.randint(1, 50)
        workers = random.randint(10, 100)
        eq_faults = random.randint(0, 5)
        temp = round(random.uniform(22.0, 35.0), 1)
        humidity = round(random.uniform(55.0, 90.0), 1)
        strata_stress = round(random.uniform(6.0, 30.0) + (depth / 40.0), 2)
        
        # Correlated gases
        if gassiness == 3:
            ch4 = round(random.uniform(0.30, 2.10), 2)
            co = random.randint(10, 75)
            o2 = round(random.uniform(18.5, 20.8), 1)
        elif gassiness == 2:
            ch4 = round(random.uniform(0.10, 1.15), 2)
            co = random.randint(4, 40)
            o2 = round(random.uniform(19.4, 20.9), 1)
        else:
            ch4 = round(random.uniform(0.01, 0.40), 2)
            co = random.randint(2, 20)
            o2 = round(random.uniform(20.3, 20.9), 1)
            
        vent = round(random.uniform(0.3, 4.0), 2)
        
        o2_def = max(0.2, 20.9 - o2)
        grahams_ratio = round((co * 100.0) / (o2_def * 1000.0), 3)
        gas_dispersion = round(ch4 / max(0.2, vent), 3)
        inspection_risk = round((days_insp / 7.0) * (violations + 1), 2)
        
        # Balanced, mathematically clean classification based on DGMS CMR 2017 Reg 104, 153
        hazard_index = (
            (ch4 / 1.25) * 35.0 +
            (co / 45.0) * 30.0 +
            (max(0.0, (0.8 - vent)) / 0.8) * 20.0 +
            (violations / 10.0) * 10.0 +
            (days_insp / 45.0) * 5.0
        )
        
        if ch4 >= 1.25 or co >= 45 or (vent < 0.45 and gassiness >= 2) or hazard_index >= 55.0:
            risk = "High"
        elif ch4 >= 0.55 or co >= 18 or vent < 0.75 or violations >= 4 or hazard_index >= 28.0:
            risk = "Medium"
        else:
            risk = "Low"
            
        rows.append([
            depth, gassiness, violations, days_insp,
            ch4, co, o2, vent, workers, eq_faults, strata_stress, temp, humidity,
            grahams_ratio, gas_dispersion, inspection_risk,
            risk
        ])
        
    train_path = os.path.join(data_dir, "dgms_enhanced_training.csv")
    with open(train_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"Generated {len(rows)} balanced rows in {train_path}")
    return train_path

def train_super_accurate_models(train_path):
    models_dir = r"c:\Users\Aasawari Bodke\Sih\backend\ml\models"
    os.makedirs(models_dir, exist_ok=True)
    
    df = pd.read_csv(train_path)
    
    feature_cols = [
        "depth_m", "gassiness_degree", "open_violations", "days_since_last_inspection",
        "ch4_pct", "co_ppm", "o2_pct", "ventilation_velocity_ms", "workers_count",
        "equipment_faults", "strata_stress_mpa", "temp_c", "humidity_pct",
        "grahams_ratio", "gas_dispersion_index", "inspection_risk_factor"
    ]
    
    X = df[feature_cols]
    y = df["risk_level"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Tuned Gradient Boosting Classifier
    gb = GradientBoostingClassifier(
        n_estimators=300,
        learning_rate=0.08,
        max_depth=6,
        subsample=0.9,
        random_state=42
    )
    
    # Tuned Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=250,
        max_depth=14,
        min_samples_split=2,
        random_state=42
    )
    
    ensemble = VotingClassifier(
        estimators=[('gb', gb), ('rf', rf)],
        voting='soft',
        weights=[1.5, 1.0]
    )
    
    ensemble.fit(X_train, y_train)
    preds = ensemble.predict(X_test)
    acc = accuracy_score(y_test, preds)
    
    gb.fit(X_train, y_train)
    importances = dict(zip(feature_cols, [round(float(v), 4) for v in gb.feature_importances_]))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))
    cm = confusion_matrix(y_test, preds, labels=["High", "Medium", "Low"]).tolist()
    
    print("\n" + "="*50)
    print(f"STATE-OF-THE-ART ENSEMBLE ACCURACY: {acc * 100:.2f}%")
    print("="*50)
    print(classification_report(y_test, preds))
    
    model_path = os.path.join(models_dir, "risk_classifier.joblib")
    metrics_path = os.path.join(models_dir, "model_metrics.json")
    
    joblib.dump({
        "model": ensemble,
        "features": feature_cols,
        "accuracy": acc,
        "feature_importances": sorted_importances,
        "classes": list(ensemble.classes_)
    }, model_path)
    
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "model_type": "Optimized Soft-Voting Ensemble (Gradient Boosting + Random Forest)",
            "test_accuracy": round(acc * 100, 2),
            "total_samples": len(df),
            "test_samples": len(y_test),
            "confusion_matrix": {
                "labels": ["High", "Medium", "Low"],
                "matrix": cm
            },
            "top_features": list(sorted_importances.items())[:6],
            "training_date": "September 2026",
            "statutory_standards": "DGMS Coal Mines Regulations 2017"
        }, f, indent=2)
        
    print(f"Saved optimized ensemble model to {model_path} ({acc*100:.2f}%)")

if __name__ == "__main__":
    p = generate_balanced_enhanced_datasets()
    train_super_accurate_models(p)
