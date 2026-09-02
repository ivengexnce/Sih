import os
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ISO_PATH = os.path.join(BASE_DIR, "models", "anomaly_detector.joblib")

_iso_cache = None

def get_anomaly_model():
    global _iso_cache
    if _iso_cache is None:
        if os.path.exists(ISO_PATH):
            _iso_cache = joblib.load(ISO_PATH)
        else:
            raise FileNotFoundError("Anomaly model binary not found.")
    return _iso_cache

def evaluate_sensor_anomaly(
    ch4_pct: float,
    co_ppm: int,
    co2_pct: float,
    air_velocity_ms: float,
    temperature_c: float,
    dust_pm10_mg: int = 80
):
    model_dict = get_anomaly_model()
    iso = model_dict["model"]
    features = model_dict["features"]

    input_df = pd.DataFrame([{
        "ch4_pct": ch4_pct,
        "co_ppm": co_ppm,
        "co2_pct": co2_pct,
        "air_velocity_ms": air_velocity_ms,
        "temperature_c": temperature_c,
        "dust_pm10_mg": dust_pm10_mg
    }])[features]

    # Isolation Forest returns -1 for anomaly, 1 for normal
    raw_pred = iso.predict(input_df)[0]
    score = iso.decision_function(input_df)[0] # negative indicates anomalous

    is_anomaly = bool(raw_pred == -1 or ch4_pct >= 1.0 or co_ppm >= 35 or air_velocity_ms < 0.5)

    severity = "Normal"
    reasons = []

    if ch4_pct >= 1.25:
        severity = "Critical"
        reasons.append(f"Methane level {ch4_pct}% requires emergency worker withdrawal.")
    elif ch4_pct >= 1.0:
        severity = "High"
        reasons.append(f"Methane level {ch4_pct}% requires power cutoff.")

    if co_ppm >= 50:
        severity = "Critical"
        reasons.append(f"CO level {co_ppm} ppm indicates active heating/combustion.")
    elif co_ppm >= 25:
        if severity != "Critical": severity = "High"
        reasons.append(f"CO level {co_ppm} ppm exceeds 8-hour occupational threshold.")

    if air_velocity_ms < 0.5:
        if severity == "Normal": severity = "Medium"
        reasons.append(f"Air velocity {air_velocity_ms} m/s is below 0.5 m/s minimum.")

    if dust_pm10_mg > 400:
        if severity == "Normal": severity = "Medium"
        reasons.append(f"Dust level {dust_pm10_mg} mg/m³ exceeds respirable dust threshold.")

    return {
        "is_anomaly": is_anomaly,
        "severity": severity if is_anomaly else "Normal",
        "anomaly_score": round(float(-score), 3),
        "breach_reasons": reasons if reasons else ["Telemetry within normal statutory limits."],
        "sensors": {
            "ch4_pct": ch4_pct,
            "co_ppm": co_ppm,
            "co2_pct": co2_pct,
            "air_velocity_ms": air_velocity_ms,
            "temperature_c": temperature_c,
            "dust_pm10_mg": dust_pm10_mg
        }
    }

if __name__ == "__main__":
    print(evaluate_sensor_anomaly(ch4_pct=1.3, co_ppm=55, co2_pct=0.4, air_velocity_ms=0.3, temperature_c=31.2))
