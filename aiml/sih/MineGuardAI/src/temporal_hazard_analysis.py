"""
MineGuard AI - Temporal Water Seepage & Hazard Analysis Module
==============================================================
Compares multi-temporal camera images (T1, T2, T3) from the same mine location
to determine visible water seepage trend: STABLE, INCREASING, DECREASING, or UNCERTAIN.
"""

import os
import cv2
import numpy as np
from pathlib import Path


def analyze_seepage_area_and_darkness(image_path):
    """
    Extracts visual wetness area and pixel intensity darkness indicator for water seepage.
    """
    img = cv2.imread(str(image_path))
    if img is None:
        return 0.0, 0.0
        
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # Water seepage on coal rock surface shows dark, highly saturated/reflective regions
    v_channel = hsv[:, :, 2]
    s_channel = hsv[:, :, 1]
    
    # Threshold dark and damp regions (low value, high saturation)
    damp_mask = (v_channel < 75) & (s_channel > 30)
    seepage_pixel_count = np.sum(damp_mask)
    total_pixels = img.shape[0] * img.shape[1]
    
    seepage_ratio = float(seepage_pixel_count / total_pixels)
    avg_darkness = float(np.mean(v_channel[damp_mask])) if seepage_pixel_count > 0 else 0.0
    
    return seepage_ratio, avg_darkness


def analyze_temporal_water_seepage(image_paths):
    """
    Analyzes a sequence of time-stamped images from the exact same underground mine location.
    
    Parameters:
      image_paths: list of 2 or more file path strings ordered chronologically [T1, T2, T3]
      
    Returns dict with trend classification and detailed evidence metrics.
    """
    if len(image_paths) < 2:
        return {
            "seepage_trend": "UNCERTAIN",
            "confidence": 0.0,
            "reason": "Temporal trend analysis requires at least two time-point images (T1, T2). Single image is insufficient.",
            "metrics": []
        }
        
    metrics = []
    for idx, path in enumerate(image_paths):
        ratio, dark = analyze_seepage_area_and_darkness(path)
        metrics.append({
            "timepoint": f"T{idx+1}",
            "image_path": str(path),
            "visible_seepage_area_ratio": round(ratio, 6),
            "mean_dampness_intensity": round(dark, 2)
        })
        
    area_ratios = [m["visible_seepage_area_ratio"] for m in metrics]
    
    # Calculate relative changes across consecutive timepoints
    deltas = [area_ratios[i] - area_ratios[i-1] for i in range(1, len(area_ratios))]
    avg_delta = np.mean(deltas)
    
    # Decision boundaries
    if avg_delta > 0.005 and all(d > 0 for d in deltas):
        trend = "INCREASING"
        confidence = 0.92
        reason = f"Visible wet surface area expanded across {len(image_paths)} time points (average expansion: +{avg_delta*100:.2f}% per interval)."
    elif avg_delta < -0.005 and all(d < 0 for d in deltas):
        trend = "DECREASING"
        confidence = 0.88
        reason = f"Visible wet surface area contracted across {len(image_paths)} time points."
    elif abs(avg_delta) <= 0.005:
        trend = "STABLE"
        confidence = 0.85
        reason = f"Visible water seepage surface area remained consistent across {len(image_paths)} time points."
    else:
        trend = "UNCERTAIN"
        confidence = 0.60
        reason = f"Fluctuating visual evidence observed across {len(image_paths)} time points."
        
    return {
        "seepage_trend": trend,
        "confidence": confidence,
        "reason": reason,
        "timepoint_metrics": metrics
    }


if __name__ == "__main__":
    # Test single vs temporal behavior
    res1 = analyze_temporal_water_seepage(["sample_t1.jpg"])
    print("Single Image Output:")
    print(res1)
