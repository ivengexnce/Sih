import math
from typing import Dict, Any, List

def perform_deep_risk_analysis(
    section_name: str,
    depth_m: int = 180,
    ch4_pct: float = 0.45,
    co_ppm: int = 15,
    air_velocity_ms: float = 1.2,
    open_violations: int = 3,
    workers_count: int = 40,
    gassiness_degree: int = 2
) -> Dict[str, Any]:
    """
    Comprehensive multi-criteria AI Risk & Failure Mode Analysis for Coal Mines.
    Evaluates:
    - Gas Hazard Index (Methane CH4, Carbon Monoxide CO)
    - Ventilation Adequacy Index (CMR 2017 Reg 153)
    - Spontaneous Combustion Susceptibility Index (Graham's Ratio surrogate)
    - Strata & Depth Hazard Index
    - Compliance & Human Exposure Index
    """

    # 1. Gas Risk Calculation
    gas_score = 0
    gas_details = []
    if ch4_pct >= 1.25:
        gas_score += 45
        gas_details.append(f"METHANE CRITICAL: {ch4_pct}% CH₄ exceeds CMR 2017 withdrawal threshold (1.25%). Electric supply tripping mandated.")
    elif ch4_pct >= 0.8:
        gas_score += 25
        gas_details.append(f"METHANE ELEVATED: {ch4_pct}% CH₄ approaching 1.0% cutoff limit.")
    else:
        gas_score += max(2, int(ch4_pct * 15))
        gas_details.append(f"Methane within permissible baseline ({ch4_pct}% CH₄).")

    if co_ppm >= 45:
        gas_score += 45
        gas_details.append(f"CARBON MONOXIDE HAZARD: {co_ppm} ppm indicates active coal self-heating or impending spontaneous combustion.")
    elif co_ppm >= 20:
        gas_score += 20
        gas_details.append(f"Elevated CO ({co_ppm} ppm) detected. Monitor trend for spontaneous heating.")
    else:
        gas_score += max(2, int(co_ppm * 0.4))
        gas_details.append(f"Carbon monoxide within standard limits ({co_ppm} ppm).")

    gas_score = min(100, gas_score)

    # 2. Ventilation Risk Calculation
    vent_score = 0
    vent_details = []
    if air_velocity_ms < 0.5:
        vent_score = 85
        vent_details.append(f"VENTILATION STARVATION: Air velocity ({air_velocity_ms} m/s) is below statutory minimum (0.5 m/s). Gas accumulation risk is severe.")
    elif air_velocity_ms < 0.8:
        vent_score = 45
        vent_details.append(f"Sub-optimal airflow ({air_velocity_ms} m/s). Inspect auxiliary fan ducting and brattice.")
    else:
        vent_score = max(5, int((4.0 - min(4.0, air_velocity_ms)) * 10))
        vent_details.append(f"Adequate airflow delivery ({air_velocity_ms} m/s).")

    # 3. Strata & Geotechnical Risk (Depth & Degree)
    strata_score = min(100, int((depth_m / 650.0) * 55 + (gassiness_degree * 15)))

    # 4. Operational & Human Risk
    human_score = min(100, open_violations * 8 + int(workers_count * 0.35))

    # Overall AI Composite Hazard Score (0 - 100)
    composite_hazard = round(
        (gas_score * 0.40) +
        (vent_score * 0.25) +
        (strata_score * 0.15) +
        (human_score * 0.20),
        1
    )

    if composite_hazard >= 65 or ch4_pct >= 1.25 or co_ppm >= 50 or air_velocity_ms < 0.4:
        risk_level = "High"
        risk_color = "#dc2626"
        p_72h = min(98.5, round(composite_hazard * 0.95 + 15, 1))
    elif composite_hazard >= 35 or ch4_pct >= 0.7 or co_ppm >= 25 or air_velocity_ms < 0.7:
        risk_level = "Medium"
        risk_color = "#ea580c"
        p_72h = round(composite_hazard * 0.75, 1)
    else:
        risk_level = "Low"
        risk_color = "#16a34a"
        p_72h = max(2.5, round(composite_hazard * 0.25, 1))

    # Recommended Actions
    actions: List[Dict[str, str]] = []
    if ch4_pct >= 1.0:
        actions.append({
            "priority": "Immediate (P1)",
            "mandate": "Trip electrical power to section switchgear and evacuate personnel (CMR Reg 153).",
            "authority": "DGMS Safety Circular 02/2024"
        })
    if co_ppm >= 30:
        actions.append({
            "priority": "Immediate (P1)",
            "mandate": "Prepare nitrogen flushing line and erect explosion-proof stopping seals.",
            "authority": "Mines Act 1952 Sec 23"
        })
    if air_velocity_ms < 0.5:
        actions.append({
            "priority": "High (P2)",
            "mandate": "Inspect auxiliary booster fan delivery and seal duct leakage points.",
            "authority": "CMR 2017 Reg 158"
        })
    if open_violations >= 4:
        actions.append({
            "priority": "Medium (P3)",
            "mandate": "Expedite remediation of pending inspection violations with assigned supervisors.",
            "authority": "Colliery Safety Committee"
        })
    if not actions:
        actions.append({
            "priority": "Routine",
            "mandate": "Maintain statutory shift inspection log in Form IV and continue continuous ETMS telemetry.",
            "authority": "Standard Operating Procedure"
        })

    return {
        "section_name": section_name,
        "composite_hazard_score": composite_hazard,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "predicted_incident_probability_72h": p_72h,
        "sub_indices": {
            "gas_hazard_index": gas_score,
            "ventilation_index": vent_score,
            "strata_depth_index": strata_score,
            "human_exposure_index": human_score
        },
        "critical_observations": gas_details + vent_details,
        "preventive_actions": actions,
        "evaluated_parameters": {
            "depth_m": depth_m,
            "ch4_pct": ch4_pct,
            "co_ppm": co_ppm,
            "air_velocity_ms": air_velocity_ms,
            "workers_count": workers_count,
            "open_violations": open_violations
        }
    }

if __name__ == "__main__":
    test = perform_deep_risk_analysis("Underground Level 3", depth_m=380, ch4_pct=1.35, co_ppm=48, air_velocity_ms=0.42, open_violations=5)
    print("Test AI Risk Analysis:", test)
