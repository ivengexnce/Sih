"""
MineGuard AI - Risk Fusion Engine
=================================
Combines outputs from Model 1 (PPE Compliance Engine) and Model 2 (Hazard Severity Engine)
using configurable weights to produce the overall visual risk score, risk level, and main rationales.
"""

import os
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_FUSION = BASE_DIR / "config" / "risk_fusion_rules.yaml"


def load_fusion_config():
    """Loads configurable fusion weights and risk thresholds."""
    if CONFIG_FUSION.exists():
        with open(CONFIG_FUSION, "r") as f:
            return yaml.safe_load(f)
    else:
        return {
            "fusion_weights": {
                "hazard_risk_weight": 0.40,
                "ppe_risk_weight": 0.35,
                "critical_hazard_weight": 0.25
            },
            "risk_thresholds": {
                "LOW": [0, 20],
                "MEDIUM": [21, 40],
                "HIGH": [41, 70],
                "CRITICAL": [71, 100]
            }
        }


def fuse_safety_risks(ppe_analysis, hazard_analysis):
    """
    Fuses PPE Compliance Analysis and Hazard Analysis into one final safety assessment.
    
    Parameters:
      ppe_analysis: dict with keys 'workers_detected', 'compliance_score', 'violations', 'risk_level'
      hazard_analysis: dict with keys 'hazards_detected', 'hazard_score', 'risk_level'
      
    Returns:
      dict with 'overall_score', 'overall_risk', 'main_reasons'
    """
    config = load_fusion_config()
    weights = config.get("fusion_weights", {})
    
    w_hazard = weights.get("hazard_risk_weight", 0.40)
    w_ppe = weights.get("ppe_risk_weight", 0.35)
    w_crit = weights.get("critical_hazard_weight", 0.25)
    
    # 1. Hazard Risk Component (0 - 100)
    hazard_score = float(hazard_analysis.get("hazard_score", 0.0))
    
    # 2. PPE Risk Component (0 - 100)
    # Compliance score is 0..100 (where 100 is fully compliant), so PPE risk = 100 - compliance_score
    # If compliance_score is -1 (N/A, no workers detected), treat PPE risk as 0 (neutral)
    compliance_score = float(ppe_analysis.get("compliance_score", 100.0))
    if compliance_score < 0:
        ppe_risk = 0.0  # No workers in image => PPE risk is neutral
    else:
        ppe_risk = max(0.0, 100.0 - compliance_score)
    
    # 3. Critical Hazard Factor Component
    hazards_list = hazard_analysis.get("hazards_detected", [])
    critical_count = sum(1 for h in hazards_list if h.get("severity") in ["CRITICAL", "HIGH"])
    critical_factor = min(100.0, critical_count * 40.0)
    
    # Weighted score computation
    raw_final_score = (w_hazard * hazard_score) + (w_ppe * ppe_risk) + (w_crit * critical_factor)
    overall_score = int(round(min(100.0, max(0.0, raw_final_score))))
    
    # Classify final risk tier
    if overall_score <= 20:
        overall_risk = "LOW"
    elif overall_score <= 40:
        overall_risk = "MEDIUM"
    elif overall_score <= 70:
        overall_risk = "HIGH"
    else:
        overall_risk = "CRITICAL"
        
    # Consolidate main reasons
    main_reasons = []
    
    # Add hazard reasons
    for h in hazards_list:
        htype_str = h.get("hazard", "").replace("_", " ").title()
        sev = h.get("severity", "MEDIUM")
        main_reasons.append(f"{htype_str} detected ({sev} severity)")
        
    # Add PPE violation reasons
    for viol in ppe_analysis.get("violations", []):
        if "No PPE violations" not in viol:
            main_reasons.append(f"PPE Violation: {viol}")
        
    if not main_reasons:
        main_reasons.append("No critical hazards or PPE violations detected")

    return {
        "overall_score": overall_score,
        "overall_risk": overall_risk,
        "main_reasons": list(set(main_reasons))
    }


if __name__ == "__main__":
    test_ppe = {
        "workers_detected": 4,
        "compliance_score": 72,
        "violations": ["Worker 2: Helmet missing", "Worker 4: Gloves missing"],
        "risk_level": "HIGH"
    }
    test_hazard = {
        "hazards_detected": [
            {"hazard": "loose_rock", "confidence": 0.91, "severity": "CRITICAL"},
            {"hazard": "water_seepage", "confidence": 0.88, "severity": "HIGH"}
        ],
        "hazard_score": 85,
        "risk_level": "CRITICAL"
    }
    res = fuse_safety_risks(test_ppe, test_hazard)
    import json
    print(json.dumps(res, indent=2))
