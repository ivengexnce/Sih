# MineGuard AI - Mine Hazard Dataset Validation Audit

## Executive Summary
This document records the automated validation and audit performed on the **Underground Coal Mine Hazard Dataset**. In accordance with MineGuard AI compliance protocols, raw datasets in `data/raw/` remain completely unchanged.

---

## Dataset Audit Summary Statistics

| Validation Metric | Quantity | Status |
| :--- | :---: | :---: |
| **Total Images Inspected** | `171` | PASSED |
| **Total Label Files Inspected** | `170` | PASSED |
| **Corrupted Image Files** | `1` | FILTERED |
| **Duplicate Image Files** | `0` | IDENTIFIED |
| **Invalid Bounding Box Annotations** | `2` | FILTERED |
| **Extremely Small Objects ($area < 0.05\%$)** | `0` | LOGGED |
| **Train / Val / Test Data Leakage** | `0` | NONE |

---

## Target Class Distribution Breakdown

| Class ID | Class Name | Total Bounding Boxes | Percentage | Risk Criticality |
| :---: | :--- | :---: | :---: | :---: |
| `0` | **loose_rock** | `250` | `14.04%` | `HIGH CRITICAL` |
| `1` | **rockfall** | `106` | `5.96%` | `HIGH CRITICAL` |
| `2` | **crack** | `257` | `14.44%` | `HIGH CRITICAL` |
| `3` | **water_seepage** | `99` | `5.56%` | `HIGH CRITICAL` |
| `4` | **water_pooling** | `236` | `13.26%` | `STANDARD` |
| `5` | **damaged_support** | `120` | `6.74%` | `HIGH CRITICAL` |
| `6` | **blocked_ventilation** | `282` | `15.84%` | `STANDARD` |
| `7` | **damaged_ventilation_duct** | `74` | `4.16%` | `HIGH CRITICAL` |
| `8` | **dust_cloud** | `211` | `11.85%` | `STANDARD` |
| `9` | **smoke** | `145` | `8.15%` | `STANDARD` |
| `10` | **debris_obstruction** | `0` | `0.00%` | `STANDARD` |
| `11` | **unsafe_worker_area** | `0` | `0.00%` | `STANDARD` |

---

## Detailed Audit Logs

### 1. Image Integrity & Format Checks
- **Method**: PIL byte-level verification (`verify()`) and OpenCV frame load test.
- **Corrupted Image Count**: `1`
  - Corrupted: `corrupted_miner_test.jpg`

### 2. Duplicate Image & Leakage Audit
- **Method**: MD5 binary hashing across `train`, `valid`, and `test` splits.
- **Duplicates Detected**: `0`
- **Leakage Across Splits**: `0`

### 3. Annotation Syntax & Boundary Checks
- **Method**: Parsing YOLO `[class_id cx cy w h]` format.
- **Invalid Annotations Detected**: `2`
  - Anomaly: `miner_train_0119.txt: Out of bounds bbox (1.5, 0.5, 0.2, 0.2)`
  - Anomaly: `miner_train_0119.txt: Invalid class ID 99`

---

## Recommendations & Next Steps
1. All validated clean images and bounding box annotations will be consolidated into `data/combined/`.
2. 50 random sample annotated images will be rendered in `reports/annotations/` for manual review.
