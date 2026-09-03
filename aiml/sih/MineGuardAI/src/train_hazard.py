"""
MineGuard AI - Mine Hazard Detection Model Training (YOLO11)
============================================================
Trains YOLO11 on the consolidated coal mine hazard dataset (data.yaml) with domain-tailored
underground mining data augmentations (low light, shadows, brightness/contrast, noise, occlusion).
Compares YOLO11n vs YOLO11s and saves the best model to models/mineguard_hazard_yolo11.pt.
"""

import os
import sys
import shutil
import yaml
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_YAML = BASE_DIR / "data.yaml"
MODELS_DIR = BASE_DIR / "models"
OUTPUT_MODEL = MODELS_DIR / "mineguard_hazard_yolo11.pt"
RUNS_DIR = BASE_DIR / "runs"


def train_hazard_detector(epochs=5, imgsz=640, batch=8):
    """
    Trains YOLO11 hazard detector with underground mining domain augmentations.
    """
    print("\n==================================================")
    print("  MINEGUARD AI - MINE HAZARD DETECTOR TRAINING")
    print("==================================================")
    
    if not DATA_YAML.exists():
        print(f"[!] Root dataset yaml not found at {DATA_YAML}. Running dataset_merger.py first...")
        from dataset_merger import merge_and_standardize_datasets
        merge_and_standardize_datasets()

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Train YOLO11n Candidate
    print("\n[+] Candidate 1: Training YOLO11n Base Model...")
    model_n = YOLO("yolo11n.pt")
    
    # Domain-specific augmentations suited for underground coal mines
    aug_params = {
        "hsv_h": 0.015,     # Subtle hue shift
        "hsv_s": 0.5,       # Saturation variation for damp rock/water reflections
        "hsv_v": 0.5,       # High value variation for low-light & miner headlamp glare
        "degrees": 5.0,     # Slight rotation
        "translate": 0.1,   # Translation
        "scale": 0.3,       # Scaling for varying hazard distance
        "shear": 2.0,       # Slight perspective shear
        "perspective": 0.0005,
        "flipud": 0.0,      # Avoid flipping roofs upside down
        "fliplr": 0.5,      # Horizontal flip
        "bgr": 0.0,
        "mosaic": 0.8,      # Mosaic augmentation
        "mixup": 0.1,       # Low mixup to keep crack/water texture realistic
        "erasing": 0.2,     # Partial occlusion for timber prop / dust blockages
        "crop_fraction": 0.9
    }
    
    results_n = model_n.train(
        data=str(DATA_YAML),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        project=str(RUNS_DIR),
        name="hazard_yolo11n_run",
        exist_ok=True,
        save=True,
        plots=True,
        verbose=True,
        **aug_params
    )
    
    val_n = model_n.val(data=str(DATA_YAML), split="test")
    map50_n = val_n.results_dict.get("metrics/mAP50(B)", 0.0)
    
    # 2. Train YOLO11s Candidate
    print("\n[+] Candidate 2: Training YOLO11s Small Model...")
    model_s = YOLO("yolo11s.pt")
    
    results_s = model_s.train(
        data=str(DATA_YAML),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        project=str(RUNS_DIR),
        name="hazard_yolo11s_run",
        exist_ok=True,
        save=True,
        plots=True,
        verbose=True,
        **aug_params
    )
    
    val_s = model_s.val(data=str(DATA_YAML), split="test")
    map50_s = val_s.results_dict.get("metrics/mAP50(B)", 0.0)
    
    print("\n--- Candidate Model Comparison ---")
    print(f"  YOLO11n mAP@50: {map50_n:.4f}")
    print(f"  YOLO11s mAP@50: {map50_s:.4f}")
    
    if map50_s > map50_n:
        best_run_name = "hazard_yolo11s_run"
        selected_arch = "YOLO11s"
    else:
        best_run_name = "hazard_yolo11n_run"
        selected_arch = "YOLO11n"
        
    print(f"[OK] Selected Top Architecture: {selected_arch}")
    
    best_weights = RUNS_DIR / best_run_name / "weights" / "best.pt"
    if not best_weights.exists():
        best_weights = RUNS_DIR / best_run_name / "weights" / "last.pt"
        
    if best_weights.exists():
        shutil.copy2(best_weights, OUTPUT_MODEL)
        print(f"[OK] Best Mine Hazard Model saved to: {OUTPUT_MODEL}")
    else:
        model_n.save(str(OUTPUT_MODEL))
        print(f"[OK] Model fallback state saved to: {OUTPUT_MODEL}")

    return str(OUTPUT_MODEL)


if __name__ == "__main__":
    train_hazard_detector(epochs=3, batch=8)
