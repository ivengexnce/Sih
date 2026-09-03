"""
MineGuard AI - Model 1: PPE Detection Training (YOLO11)
======================================================
Trains YOLO11n on the cleaned dataset in data/processed/data.yaml.
Evaluates metrics (Precision, Recall, F1, mAP@50, mAP@50:95) and saves the best model to models/ppe_yolo11.pt.
"""

import os
import sys
import shutil
from pathlib import Path
from ultralytics import YOLO

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_YAML = BASE_DIR / "data" / "processed" / "data.yaml"
MODELS_DIR = BASE_DIR / "models"
OUTPUT_MODEL = MODELS_DIR / "ppe_yolo11.pt"
RUNS_DIR = BASE_DIR / "runs"


def train_ppe_yolo11(epochs=5, imgsz=640, batch=8):
    """
    Trains YOLO11n object detector on coal mine PPE dataset.
    """
    print("\n==================================================")
    print("      MODEL 1: PPE DETECTION TRAINING (YOLO11)")
    print("==================================================")
    
    if not DATA_YAML.exists():
        print(f"[!] Cleaned dataset yaml not found at {DATA_YAML}. Running data_cleaning.py first...")
        from data_cleaning import validate_and_clean_dataset
        validate_and_clean_dataset()

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"[+] Loading YOLO11n base architecture...")
    model = YOLO("yolo11n.pt")
    
    print(f"[+] Starting training for {epochs} epochs on {DATA_YAML}...")
    results = model.train(
        data=str(DATA_YAML),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        project=str(RUNS_DIR),
        name="ppe_yolo11_run",
        exist_ok=True,
        save=True,
        plots=True,
        verbose=True
    )
    
    print("\n[+] Evaluating trained YOLO11 model on validation/test set...")
    val_results = model.val(data=str(DATA_YAML), split="test")
    
    # Locate best weights from training run
    best_weights = RUNS_DIR / "ppe_yolo11_run" / "weights" / "best.pt"
    if not best_weights.exists():
        best_weights = RUNS_DIR / "ppe_yolo11_run" / "weights" / "last.pt"
        
    if best_weights.exists():
        shutil.copy2(best_weights, OUTPUT_MODEL)
        print(f"\n[OK] Best YOLO11 model successfully saved to: {OUTPUT_MODEL}")
    else:
        # Fallback save directly from model
        model.save(str(OUTPUT_MODEL))
        print(f"\n[OK] Model state saved to: {OUTPUT_MODEL}")

    # Extract metrics
    try:
        mp = val_results.results_dict.get("metrics/precision(B)", 0.0)
        mr = val_results.results_dict.get("metrics/recall(B)", 0.0)
        map50 = val_results.results_dict.get("metrics/mAP50(B)", 0.0)
        map5095 = val_results.results_dict.get("metrics/mAP50-95(B)", 0.0)
        f1 = (2 * mp * mr) / (mp + mr + 1e-16)
        
        print("\n--- YOLO11 Evaluation Metrics Summary ---")
        print(f"  Precision:   {mp:.4f}")
        print(f"  Recall:      {mr:.4f}")
        print(f"  F1 Score:    {f1:.4f}")
        print(f"  mAP@50:      {map50:.4f}")
        print(f"  mAP@50:95:   {map5095:.4f}")
    except Exception as e:
        print(f"[!] Metrics extraction note: {e}")

    return str(OUTPUT_MODEL)


if __name__ == "__main__":
    train_ppe_yolo11(epochs=3, batch=8)
