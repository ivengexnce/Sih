import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def train_all_models():
    os.makedirs(r"c:\Users\Aasawari Bodke\Sih\backend\ml\models", exist_ok=True)
    
    # 1. Train Section Risk Classifier
    data_path = r"c:\Users\Aasawari Bodke\Sih\backend\data\dgms_inspection_training.csv"
    df = pd.read_csv(data_path)
    
    feature_cols = [
        "depth_m", "gassiness_degree", "open_violations", "days_since_last_inspection",
        "ch4_pct", "co_ppm", "ventilation_velocity_ms", "workers_count", "equipment_faults"
    ]
    
    X = df[feature_cols]
    y = df["risk_level"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    clf = RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42)
    clf.fit(X_train, y_train)
    
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"=== Section Risk Random Forest Classifier ===")
    print(f"Test Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test, preds))
    
    # Save Model
    model_path = r"c:\Users\Aasawari Bodke\Sih\backend\ml\models\risk_classifier.joblib"
    joblib.dump({"model": clf, "features": feature_cols, "accuracy": acc}, model_path)
    print(f"Saved classifier to {model_path}")
    
    # 2. Train Environmental Telemetry Anomaly Detector (Isolation Forest)
    tel_path = r"c:\Users\Aasawari Bodke\Sih\backend\data\sensor_telemetry_historical.csv"
    df_tel = pd.read_csv(tel_path)
    
    tel_features = ["ch4_pct", "co_ppm", "co2_pct", "air_velocity_ms", "temperature_c", "dust_pm10_mg"]
    X_tel = df_tel[tel_features]
    
    iso = IsolationForest(n_estimators=100, contamination=0.08, random_state=42)
    iso.fit(X_tel)
    
    iso_path = r"c:\Users\Aasawari Bodke\Sih\backend\ml\models\anomaly_detector.joblib"
    joblib.dump({"model": iso, "features": tel_features}, iso_path)
    print(f"Saved Isolation Forest model to {iso_path}")

if __name__ == "__main__":
    train_all_models()
