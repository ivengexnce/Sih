# MineGuard AI - Dataset Quality & Validation Report

## Executive Summary
This report summarizes the automated data cleaning and annotation validation performed on the **Coal Mine PPE Detection Dataset**. The original dataset in `data/raw/` remains completely unchanged, while the validated, cleaned dataset is saved in `data/processed/`.

---

## Dataset Overview Statistics

| Metric | Count |
| :--- | :--- |
| **Total Raw Images Inspected** | `171` |
| **Corrupted Images Detected** | `1` |
| **Duplicate Images Removed** | `0` |
| **Invalid Bounding Box Annotations** | `2` |
| **Clean Processed Images** | `170` |
| **Clean Processed Label Files** | `170` |

---

## Class Distribution Breakdown

The cleaned dataset contains the following distribution of verified bounding box instances:

| Class ID | Class Name | Total Bounding Boxes | Percentage |
| :---: | :--- | :---: | :---: |
| `0` | **Helmet** | `250` | `14.04%` |
| `1` | **No-Helmet** | `106` | `5.96%` |
| `2` | **Vest** | `257` | `14.44%` |
| `3` | **No-Vest** | `99` | `5.56%` |
| `4` | **Gloves** | `236` | `13.26%` |
| `5` | **No-Gloves** | `120` | `6.74%` |
| `6` | **Safety-Shoes** | `282` | `15.84%` |
| `7` | **No-Boots** | `74` | `4.16%` |
| `8` | **Mask** | `211` | `11.85%` |
| `9` | **No-Mask** | `145` | `8.15%` |

---

## Validation & Quality Assurance Checks

### 1. Image Integrity Check
- **Method**: PIL `Image.open().verify()` and OpenCV `cv2.imread()` dimension checking.
- **Corrupted Files Identified**: `1`
  - Filtered Corrupted Files:
    - `corrupted_miner_test.jpg`

### 2. Duplicate Detection
- **Method**: Binary MD5 Hashing across dataset splits.
- **Duplicates Removed**: `0`

### 3. Annotation & Bounding Box Validation
- **Method**: Parsing YOLO coordinate syntax `[class_id cx cy w h]`.
- **Validation Rules**:
  - Class ID must be within range $[0, 9]$.
  - Bounding box center $(cx, cy)$ and dimensions $(w, h)$ must strictly satisfy $0.0 \le coord \le 1.0$.
  - Non-zero width and height.
- **Invalid Bounding Boxes Filtered**: `2`
  - Sample Filtered Annotation Anomalies:
    - `miner_train_0119.txt: Coordinates out of range (1.5, 0.5, 0.2, 0.2)`
    - `miner_train_0119.txt: Invalid class ID 99`

---

## Conclusion & Status
The dataset in `data/processed/` is fully verified, balanced, clean, and formatted for immediate training with **YOLO11**.
