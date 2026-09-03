"""
MineGuard AI - Dataset Merger & Taxonomy Standardizer
===================================================
Consolidates raw hazard datasets into data/combined/, standardizes class labels
using config/class_mapping.yaml, creates root data.yaml, and renders at least 50
sample annotated images in reports/annotations/ for quality inspection.
"""

import os
import sys
import shutil
import yaml
import numpy as np
import cv2
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
COMBINED_DIR = DATA_DIR / "combined"
REPORTS_DIR = BASE_DIR / "reports"
ANNOTATIONS_DIR = REPORTS_DIR / "annotations"
ROOT_YAML = BASE_DIR / "data.yaml"

CONFIG_MAPPING = BASE_DIR / "config" / "class_mapping.yaml"

with open(CONFIG_MAPPING, "r") as f:
    class_config = yaml.safe_load(f)

TARGET_CLASSES = class_config["target_classes"]
NUM_CLASSES = len(TARGET_CLASSES)
CLASS_NAMES = [TARGET_CLASSES[i] for i in range(NUM_CLASSES)]

# Distinct RGB color palette for rendering bounding boxes
COLORS = [
    (230, 25, 75),   # loose_rock
    (245, 130, 48),  # rockfall
    (225, 225, 25),  # crack
    (0, 130, 200),   # water_seepage
    (70, 240, 240),  # water_pooling
    (240, 50, 230),  # damaged_support
    (210, 245, 60),  # blocked_ventilation
    (250, 190, 212), # damaged_ventilation_duct
    (0, 128, 128),   # dust_cloud
    (145, 30, 180),  # smoke
    (170, 110, 40),  # debris_obstruction
    (128, 0, 0)      # unsafe_worker_area
]


def merge_and_standardize_datasets():
    """Merges validated datasets into data/combined/ and generates root data.yaml."""
    print("\n==================================================")
    print("   MINEGUARD AI - DATASET MERGER & STANDARDIZER")
    print("==================================================")
    
    COMBINED_DIR.mkdir(parents=True, exist_ok=True)
    ANNOTATIONS_DIR.mkdir(parents=True, exist_ok=True)
    
    splits = ["train", "valid", "test"]
    processed_counts = {s: 0 for s in splits}
    
    for split in splits:
        src_img_dir = RAW_DIR / split / "images"
        src_lbl_dir = RAW_DIR / split / "labels"
        
        dst_img_dir = COMBINED_DIR / split / "images"
        dst_lbl_dir = COMBINED_DIR / split / "labels"
        dst_img_dir.mkdir(parents=True, exist_ok=True)
        dst_lbl_dir.mkdir(parents=True, exist_ok=True)
        
        if not src_img_dir.exists():
            continue
            
        images = list(src_img_dir.glob("*.jpg")) + list(src_img_dir.glob("*.png")) + list(src_img_dir.glob("*.jpeg"))
        
        for img_path in images:
            # Verify image file
            try:
                cv_img = cv2.imread(str(img_path))
                if cv_img is None or cv_img.size == 0:
                    continue
            except Exception:
                continue
                
            lbl_path = src_lbl_dir / f"{img_path.stem}.txt"
            valid_boxes = []
            
            if lbl_path.exists():
                with open(lbl_path, "r") as f:
                    lines = f.readlines()
                    
                for line in lines:
                    line_str = line.strip()
                    if not line_str:
                        continue
                    parts = line_str.split()
                    if len(parts) == 5:
                        try:
                            cid = int(parts[0])
                            cx, cy, w, h = float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
                            if 0 <= cid < NUM_CLASSES and (0.0 <= cx <= 1.0) and (0.0 <= cy <= 1.0) and (0.0 < w <= 1.0) and (0.0 < h <= 1.0):
                                valid_boxes.append(f"{cid} {cx:.6f} {cy:.6f} {w:.6f} {h:.6f}")
                        except ValueError:
                            continue
            
            # Copy to combined split
            shutil.copy2(img_path, dst_img_dir / img_path.name)
            if valid_boxes:
                with open(dst_lbl_dir / f"{img_path.stem}.txt", "w") as f:
                    f.write("\n".join(valid_boxes))
            processed_counts[split] += 1

    # Create root data.yaml
    data_yaml_dict = {
        "path": str(COMBINED_DIR.absolute()),
        "train": "train/images",
        "val": "valid/images",
        "test": "test/images",
        "names": {i: name for i, name in enumerate(CLASS_NAMES)},
        "nc": NUM_CLASSES
    }
    
    with open(ROOT_YAML, "w") as f:
        yaml.dump(data_yaml_dict, f, default_flow_style=False)
        
    print(f"[OK] Root dataset YAML created at: {ROOT_YAML}")
    for s, cnt in processed_counts.items():
        print(f"  > Split '{s}': {cnt} images processed")
        
    # Render at least 50 annotated sample images in reports/annotations/
    render_annotation_visualizations(num_samples=60)


def render_annotation_visualizations(num_samples=60):
    """Renders sample images with bounding box overlays for manual audit in reports/annotations/."""
    print(f"\n[+] Rendering {num_samples} sample annotated images to {ANNOTATIONS_DIR}...")
    
    combined_img_dir = COMBINED_DIR / "train" / "images"
    combined_lbl_dir = COMBINED_DIR / "train" / "labels"
    
    images = list(combined_img_dir.glob("*.jpg")) + list(combined_img_dir.glob("*.png"))
    if not images:
        return
        
    np.random.seed(42)
    selected_images = np.random.choice(images, size=min(num_samples, len(images)), replace=False)
    
    for idx, img_path in enumerate(selected_images):
        lbl_path = combined_lbl_dir / f"{img_path.stem}.txt"
        cv_img = cv2.imread(str(img_path))
        if cv_img is None:
            continue
            
        h_img, w_img, _ = cv_img.shape
        img_pil = Image.fromarray(cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(img_pil)
        
        if lbl_path.exists():
            with open(lbl_path, "r") as f:
                lines = f.readlines()
                
            for line in lines:
                parts = line.strip().split()
                if len(parts) == 5:
                    cid = int(parts[0])
                    cx, cy, bw, bh = float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
                    
                    x1 = int((cx - bw/2) * w_img)
                    y1 = int((cy - bh/2) * h_img)
                    x2 = int((cx + bw/2) * w_img)
                    y2 = int((cy + bh/2) * h_img)
                    
                    color = COLORS[cid % len(COLORS)]
                    c_name = CLASS_NAMES[cid]
                    
                    draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
                    draw.rectangle([x1, max(0, y1-20), x1 + len(c_name)*9, y1], fill=color)
                    draw.text((x1 + 3, max(0, y1-18)), c_name, fill=(255, 255, 255))
                    
        out_name = f"sample_annotated_{idx+1:03d}.png"
        img_pil.save(ANNOTATIONS_DIR / out_name)
        
    print(f"[OK] {num_samples} annotated inspection images rendered in: {ANNOTATIONS_DIR}")


if __name__ == "__main__":
    merge_and_standardize_datasets()
