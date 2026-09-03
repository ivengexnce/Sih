"""
MineGuard AI - Feature Engineering Pipeline
===========================================
This module extracts structured numerical features from YOLO object detection results
and domain context to fuel:
  1. Model 2 - Safety Compliance Classification (Compliant, Partial Compliance, Non-Compliant)
  2. Model 3 - Risk Score Prediction (LOW, MEDIUM, HIGH, CRITICAL)
"""

import numpy as np
import pandas as pd

# Class index mapping from YOLO
CLASSES = [
    "Helmet",        # 0
    "No-Helmet",     # 1
    "Vest",          # 2
    "No-Vest",       # 3
    "Gloves",        # 4
    "No-Gloves",     # 5
    "Safety-Shoes",  # 6
    "No-Boots",      # 7
    "Mask",          # 8
    "No-Mask"        # 9
]

COMPLIANCE_MAP = {
    0: "Compliant",
    1: "Partial Compliance",
    2: "Non-Compliant"
}

RISK_MAP = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH",
    3: "CRITICAL"
}


def extract_compliance_features_from_detections(detections):
    """
    Extracts binary and scalar compliance features for a single worker from YOLO detection dictionary/array.
    
    Parameters:
      detections: list of dicts with 'class_id' and 'confidence'
    """
    detected_classes = [d['class_id'] for d in detections]
    confidences = [d['confidence'] for d in detections] if detections else [0.0]

    helmet = 1 if (0 in detected_classes and 1 not in detected_classes) else 0
    vest = 1 if (2 in detected_classes and 3 not in detected_classes) else 0
    gloves = 1 if (4 in detected_classes and 5 not in detected_classes) else 0
    shoes = 1 if (6 in detected_classes and 7 not in detected_classes) else 0
    mask = 1 if (8 in detected_classes and 9 not in detected_classes) else 0

    detected_items = sum([helmet, vest, gloves, shoes, mask])
    missing_ppe = 5 - detected_items
    avg_conf = float(np.mean(confidences)) if confidences else 0.0

    return {
        "helmet_detected": helmet,
        "gloves_detected": gloves,
        "shoes_detected": shoes,
        "mask_detected": mask,
        "protective_clothing_detected": vest,
        "avg_detection_confidence": avg_conf,
        "total_detected_items": detected_items,
        "missing_ppe_count": missing_ppe
    }


def generate_compliance_dataset(num_samples=1200, seed=42):
    """
    Generates a realistic feature dataset for training the Safety Compliance Classifier.
    """
    np.random.seed(seed)
    data = []

    for _ in range(num_samples):
        # Probabilistic feature simulation representing realistic underground coal mine worker scenarios
        helmet = np.random.choice([1, 0], p=[0.75, 0.25])
        vest = np.random.choice([1, 0], p=[0.80, 0.20])
        gloves = np.random.choice([1, 0], p=[0.65, 0.35])
        shoes = np.random.choice([1, 0], p=[0.85, 0.15])
        mask = np.random.choice([1, 0], p=[0.60, 0.40])

        total_detected = helmet + vest + gloves + shoes + mask
        missing_ppe = 5 - total_detected
        avg_conf = np.random.uniform(0.70, 0.98)

        # Logic rules for target determination:
        # Compliant (0): Helmet=1, Vest=1, Shoes=1, and missing_ppe <= 1
        # Non-Compliant (2): Helmet=0 OR Vest=0 OR missing_ppe >= 3
        # Partial Compliance (1): Otherwise
        if helmet == 1 and vest == 1 and shoes == 1 and missing_ppe <= 1:
            target = 0  # Compliant
        elif helmet == 0 or vest == 0 or missing_ppe >= 3:
            target = 2  # Non-Compliant
        else:
            target = 1  # Partial Compliance

        data.append({
            "helmet_detected": helmet,
            "gloves_detected": gloves,
            "shoes_detected": shoes,
            "mask_detected": mask,
            "protective_clothing_detected": vest,
            "avg_detection_confidence": round(avg_conf, 4),
            "total_detected_items": total_detected,
            "missing_ppe_count": missing_ppe,
            "compliance_status": target
        })

    return pd.DataFrame(data)


def generate_risk_dataset(num_samples=1200, seed=101):
    """
    Generates engineered risk feature dataset for Model 3 - Risk Score Prediction.
    """
    np.random.seed(seed)
    data = []

    for _ in range(num_samples):
        num_violations = np.random.poisson(lam=2.5)
        shift_hours = np.random.uniform(6.0, 12.0)
        violation_freq = round(num_violations / shift_hours, 4)
        
        missing_critical_ppe = np.random.randint(0, min(num_violations + 1, 4))
        hist_trend = round(np.random.normal(loc=num_violations * 0.8, scale=1.0), 2)
        hist_trend = max(0.0, hist_trend)
        
        zone_hazard = np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2])  # 1=Low, 2=Medium, 3=High Risk Zone
        consecutive_non_compliant = np.random.randint(0, 6)

        # Risk scoring heuristic rule for ground truth initialization
        risk_score_raw = (
            num_violations * 1.5 +
            missing_critical_ppe * 2.5 +
            violation_freq * 3.0 +
            hist_trend * 1.0 +
            zone_hazard * 1.2 +
            consecutive_non_compliant * 1.0
        )

        if risk_score_raw < 5.0:
            target = 0  # LOW
        elif risk_score_raw < 9.0:
            target = 1  # MEDIUM
        elif risk_score_raw < 14.0:
            target = 2  # HIGH
        else:
            target = 3  # CRITICAL

        data.append({
            "number_of_ppe_violations": num_violations,
            "violation_frequency": violation_freq,
            "missing_critical_ppe_count": missing_critical_ppe,
            "historical_violation_trend": hist_trend,
            "zone_hazard_level": zone_hazard,
            "shift_duration_hours": round(shift_hours, 2),
            "consecutive_non_compliant_workers": consecutive_non_compliant,
            "risk_score": target
        })

    return pd.DataFrame(data)


if __name__ == "__main__":
    df_comp = generate_compliance_dataset(10)
    print("Sample Compliance Features:")
    print(df_comp.head())
    
    df_risk = generate_risk_dataset(10)
    print("\nSample Risk Features:")
    print(df_risk.head())
