"""
MineGuard AI - Post-Detection Hazard Severity Engine
===================================================
Calculates visual hazard risk score, classifies overall visual risk tier (LOW, MEDIUM, HIGH, CRITICAL),
and formulates explainable risk rationales and sensor uncertainty disclaimers.
"""

import os
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_SEVERITY = BASE_DIR / "config" / "severity_rules.yaml"


def load_severity_config():
    """Loads configurable severity weights and thresholds from config/severity_rules.yaml."""
    if CONFIG_SEVERITY.exists():
        with open(CONFIG_SEVERITY, "r") as f:
            return yaml.safe_load(f)
    else:
        # Fallback default rules
        return {
            "severity_weights": {
                "rockfall": 5, "loose_rock": 5, "damaged_support": 5,
                "water_seepage": 4, "crack": 5, "blocked_ventilation": 5,
                "damaged_ventilation_duct": 4, "water_pooling": 3,
                "dust_cloud": 3, "debris_obstruction": 3, "smoke": 4,
                "unsafe_worker_area": 4
            },
            "risk_thresholds": {
                "LOW": [0, 20], "MEDIUM": [21, 40],
                "HIGH": [41, 70], "CRITICAL": [71, 100]
            },
            "sensor_warning": "Visual evidence detected from camera image. Physical mine conditions (e.g. airflow velocity, gas concentrations) cannot be confirmed from camera image alone and require gas/air sensors."
        }


def get_hazard_explanation(hazard_type, confidence):
    """Returns domain-specific explainable rationale for detected hazard."""
    explanations = {
        "loose_rock": "Unstable, fractured loose rock detected on mine roof/rib posing rockfall hazard",
        "rockfall": "Active or recently fallen rock mass detected in mine entry",
        "crack": "Visible structural wall or roof crack fracture detected",
        "water_seepage": "Visible water accumulation and active wet surface seepage detected",
        "water_pooling": "Standing water pool accumulation detected on mine floor",
        "damaged_support": "Compromised, cracked timber prop or deformed steel arch set detected",
        "blocked_ventilation": "Debris or fallen strata restricting ventilation passage",
        "damaged_ventilation_duct": "Torn or detached ventilation duct flexible tubing detected",
        "dust_cloud": "Suspended airborne coal dust cloud reducing entry visibility",
        "smoke": "Visible smoke accumulation detected in mine entry",
        "debris_obstruction": "Equipment or rock debris obstructing mine clearance pathway",
        "unsafe_worker_area": "Worker detected in hazardous un-supported roof or machinery clearance zone"
    }
    return explanations.get(hazard_type, f"Visual evidence of {hazard_type} detected with confidence {confidence:.2f}")


def evaluate_hazard_severity(detected_hazards):
    """
    Computes overall visual hazard score and risk classification.
    
    Parameters:
      detected_hazards: list of dicts with keys: 'type', 'confidence', 'bbox'
    """
    config = load_severity_config()
    weights = config.get("severity_weights", {})
    sensor_warning = config.get("sensor_warning", "")
    
    if not detected_hazards:
        return {
            "hazards": [],
            "overall_visual_risk": "LOW",
            "visual_hazard_score": 0.0,
            "reasons": ["No visible hazards detected in provided image"],
            "sensor_warning": sensor_warning,
            "visual_evidence_summary": "Visual inspection shows clear tunnel conditions"
        }
        
    raw_score = 0.0
    detailed_hazards = []
    reasons = []
    
    for item in detected_hazards:
        htype = item["type"]
        conf = float(item["confidence"])
        bbox = item.get("bbox", [])
        
        weight = weights.get(htype, 3)
        # Hazard impact formula factoring detection confidence and severity weight
        impact = weight * conf * 4.5
        raw_score += impact
        
        # Categorize single hazard severity rating
        if weight >= 5:
            item_severity = "CRITICAL" if conf > 0.8 else "HIGH"
        elif weight >= 4:
            item_severity = "HIGH" if conf > 0.7 else "MEDIUM"
        else:
            item_severity = "MEDIUM" if conf > 0.7 else "LOW"
            
        reason_str = get_hazard_explanation(htype, conf)
        
        detailed_hazards.append({
            "type": htype,
            "confidence": round(conf, 4),
            "severity": item_severity,
            "bbox": bbox,
            "visual_reason": reason_str
        })
        reasons.append(reason_str)

    # Scale to 0-100 range
    final_score = round(min(100.0, max(0.0, raw_score)), 2)
    
    # Classify overall risk level
    if final_score <= 20.0:
        risk_level = "LOW"
    elif final_score <= 40.0:
        risk_level = "MEDIUM"
    elif final_score <= 70.0:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    return {
        "hazards": detailed_hazards,
        "overall_visual_risk": risk_level,
        "visual_hazard_score": final_score,
        "reasons": list(set(reasons)),
        "sensor_warning": sensor_warning,
        "visual_evidence_summary": f"Visual evidence confirms {len(detailed_hazards)} hazard(s) present"
    }


if __name__ == "__main__":
    test_detections = [
        {"type": "loose_rock", "confidence": 0.88, "bbox": [0.2, 0.1, 0.4, 0.25]},
        {"type": "water_seepage", "confidence": 0.91, "bbox": [0.3, 0.5, 0.6, 0.8]}
    ]
    res = evaluate_hazard_severity(test_detections)
    print("Evaluated Risk Output:")
    import json
    print(json.dumps(res, indent=2))
