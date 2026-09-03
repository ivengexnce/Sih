# MineGuard AI – AI-Based Smart Governance & Compliance Monitoring System for Coal Mines

A robust, multi-model AI system built to automate Personal Protective Equipment (PPE) detection, evaluate worker safety compliance, identify underground coal mine hazards, and perform composite risk fusion.

---

## 🎯 System Architecture

```
                               USER IMAGE
                                   │
                     ┌─────────────┴─────────────┐
                     │ Combined Inference System │
                     └─────────────┬─────────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
              Model 1: PPE YOLO11         Model 2: Hazard YOLO11
                     │                           │
                     ▼                           ▼
              Compliance Engine           Hazard Severity Engine
                     │                           │
                     └─────────────┬─────────────┘
                                   ▼
                          Risk Fusion Engine
                                   │
                                   ▼
                          Final Safety Analysis
```

---

## 📁 Repository Structure

```
MineGuardAI/
│
├── models/
│   ├── ppe_yolo11.pt                     # Model 1: PPE Detection (YOLO11)
│   ├── compliance_classifier.pkl         # Compliance Classifier Model
│   ├── risk_predictor.pkl                # Worker Risk Predictor Model
│   └── mineguard_hazard_yolo11.pt        # Model 2: Mine Hazard Detector (YOLO11)
│
├── config/
│   ├── class_mapping.yaml                # Standardized 12-class taxonomy
│   ├── severity_rules.yaml               # Hazard risk severity weights
│   └── risk_fusion_rules.yaml            # Risk fusion weights & thresholds
│
├── src/
│   ├── data_cleaning.py                  # PPE dataset audit & cleaning
│   ├── dataset_validator.py              # Mine hazard dataset audit
│   ├── dataset_merger.py                 # Multi-dataset merger & annotator
│   ├── feature_engineering.py            # Feature vector extractor
│   ├── train_yolo.py                     # PPE YOLO11 training script
│   ├── train_classifier.py               # Compliance classifier trainer
│   ├── train_risk.py                     # Worker risk predictor trainer
│   ├── train_hazard.py                   # Mine hazard YOLO11 trainer
│   ├── hazard_severity.py                # Post-detection hazard severity engine
│   ├── temporal_hazard_analysis.py       # Multi-temporal water seepage analyzer
│   ├── risk_fusion.py                    # Risk fusion engine
│   ├── combined_inference.py             # Dual-model combined inference system
│   ├── evaluate.py                       # PPE model evaluation
│   └── evaluate_hazard.py                # Mine hazard model evaluation
│
├── reports/
│   ├── dataset_report.md                 # PPE dataset audit report
│   ├── dataset_validation.md             # Mine hazard dataset audit report
│   ├── evaluation.md                     # PPE evaluation report
│   ├── figures/                          # Confusion matrices, PR curves, annotated outputs
│   └── hazard_model/                     # Hazard model evaluation report & plots
│
├── test_app.py                           # Streamlit Local Model Testing UI
├── data.yaml                             # Merged dataset configuration
├── requirements.txt                      # Python dependencies
└── README.md                             # System documentation
```

---

## 🛠️ Installation Instructions

### 1. Clone & Navigate to Repository
```bash
cd MineGuardAI
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

---

## 🖥️ Running the Local Testing UI

To test the trained AI models interactively using Streamlit:

```bash
streamlit run test_app.py
```

### Streamlit UI Features:
1. **Confidence Threshold Slider**: Adjust detection cutoff sensitivity from `0.10` to `0.90` (Default: `0.50`).
2. **Image Upload**: Upload any coal mine photo in `JPG`, `JPEG`, or `PNG` format.
3. **Side-by-Side Visual Inspection**: View `Original Image`, `PPE Detection`, `Mine Hazard Detection`, and `Combined Overlay` side-by-side.
4. **Structured Safety Analysis**: View worker compliance scores, detected violations, hazard severity ratings, and final composite risk score ($0-100$).
5. **Detection Table**: Consolidated summary table (`Model | Object/Hazard | Confidence | Risk/Severity`).
6. **Raw JSON View**: Expandable section displaying complete structured prediction JSON.

---

## 📊 Understanding Prediction Results

### 1. PPE Analysis (`ppe_analysis`)
- **Workers Detected**: Count of workers identified in entry frame.
- **Compliance Score**: $100\%$ scale score ($100\%$ indicates full PPE compliance; drops by $20\%$ per missing PPE item).
- **Violations**: Explicit flags for missing helmets, vests, gloves, boots, or masks.

### 2. Mine Hazard Analysis (`hazard_analysis`)
- **Hazards Detected**: Lists detected coal mine hazards (`loose_rock`, `rockfall`, `crack`, `water_seepage`, `water_pooling`, `damaged_support`, `blocked_ventilation`, `damaged_ventilation_duct`, `dust_cloud`, `smoke`, `debris_obstruction`, `unsafe_worker_area`).
- **Hazard Score**: Visual hazard rating ($0-100$) based on severity weights.

### 3. Risk Fusion & Final Analysis (`final_analysis`)
- **Formula**:
  $$\text{Final Score} = 0.40 \times \text{Hazard Risk} + 0.35 \times \text{PPE Risk} + 0.25 \times \text{Critical Hazard Factor}$$
- **Risk Tiers**:
  - `0 – 20`: **LOW**
  - `21 – 40`: **MEDIUM**
  - `41 – 70`: **HIGH**
  - `71 – 100`: **CRITICAL**

---
*MineGuard AI Model Testing Engine - Designed for Coal Mine Smart Governance & Compliance Monitoring.*
