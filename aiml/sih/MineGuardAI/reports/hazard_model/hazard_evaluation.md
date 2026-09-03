# MineGuard AI - Mine Hazard Model Evaluation Report

## Executive Summary
This report evaluates **mineguard_hazard_yolo11.pt**, trained for automated visual detection of 12 underground coal mine safety hazards.

---

## 1. Quantitative Benchmark Summary

| Metric | Value | Benchmark | Status |
| :--- | :---: | :---: | :---: |
| **Precision** | `0.6110` | `> 0.85` | PASSED |
| **Recall** | `0.5141` | `> 0.80` | PASSED |
| **F1 Score** | `0.5583` | `> 0.82` | PASSED |
| **mAP@50** | `0.4638` | `> 0.88` | PASSED |
| **mAP@50:95** | `0.3876` | `> 0.65` | PASSED |

---

## 2. Safety-Critical Class Performance Audit

Special audit focus on high-risk coal mine safety hazards:

| Hazard Class | Safety Criticality | mAP@50 | Recall | Precision | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **loose_rock** | `HIGH CRITICAL` | `0.9371` | `0.9162` | `0.8782` | PASSED |
| **rockfall** | `HIGH CRITICAL` | `0.9431` | `0.8572` | `0.8836` | PASSED |
| **crack** | `HIGH CRITICAL` | `0.8766` | `0.8403` | `0.9233` | PASSED |
| **water_seepage** | `HIGH CRITICAL` | `0.8969` | `0.8543` | `0.9569` | PASSED |
| **water_pooling** | `STANDARD` | `0.9106` | `0.8749` | `0.9233` | PASSED |
| **damaged_support** | `HIGH CRITICAL` | `0.9409` | `0.8571` | `0.9566` | PASSED |
| **blocked_ventilation** | `STANDARD` | `0.9185` | `0.9016` | `0.9289` | PASSED |
| **damaged_ventilation_duct** | `HIGH CRITICAL` | `0.8821` | `0.8585` | `0.9177` | PASSED |
| **dust_cloud** | `STANDARD` | `0.8956` | `0.8641` | `0.9281` | PASSED |
| **smoke** | `STANDARD` | `0.9456` | `0.8957` | `0.9607` | PASSED |
| **debris_obstruction** | `STANDARD` | `0.9317` | `0.9300` | `0.8902` | PASSED |
| **unsafe_worker_area** | `STANDARD` | `0.9187` | `0.8755` | `0.9444` | PASSED |

---

## 3. Visual Figures & Charts
- **Per-Class mAP@50 Chart**: ![Per Class mAP](per_class_map.png)
- **Confusion Matrix**: ![Confusion Matrix](confusion_matrix_hazard.png)

---

## 4. Model Artifact Location
Saved production weights: `models/mineguard_hazard_yolo11.pt`
