"""
MineGuard AI – Local Model Testing Interface
============================================
Streamlit local testing UI to evaluate trained YOLO11 PPE & Mine Hazard models.

Run Command:
  streamlit run test_app.py
"""

import sys
import os
import json
import torch
import numpy as np
import pandas as pd
from pathlib import Path
from PIL import Image
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
PPE_MODEL_PATH = MODELS_DIR / "ppe_yolo11.pt"
HAZARD_MODEL_PATH = MODELS_DIR / "mineguard_hazard_yolo11.pt"

sys.path.append(str(BASE_DIR / "src"))
from combined_inference import run_combined_inference

# Page configuration
st.set_page_config(
    page_title="MineGuard AI - Model Testing Interface",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title { font-size: 2.2rem; font-weight: 800; color: #1E293B; margin-bottom: 0.2rem; }
    .sub-title { font-size: 1.1rem; color: #64748B; margin-bottom: 1.5rem; }
    .metric-card { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; text-align: center; }
    .stAlert { border-radius: 8px; }
</style>
""", unsafe_allow_html=True)

# Title & Subtitle
st.markdown('<div class="main-title">MineGuard AI – Model Testing Interface</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">AI Model Testing for Coal Mine PPE and Hazard Detection</div>', unsafe_allow_html=True)

# Sidebar Configuration
st.sidebar.header("⚙️ Model Settings")

# Check GPU/CPU Availability
device_info = "CUDA / GPU" if torch.cuda.is_available() else "CPU (Auto Fallback)"
st.sidebar.info(f"**Inference Compute**: `{device_info}`")

# Model Files Health Check
ppe_status = "Found" if PPE_MODEL_PATH.exists() else "Not Found (Using Fallback)"
hazard_status = "Found" if HAZARD_MODEL_PATH.exists() else "Not Found (Using Fallback)"
st.sidebar.markdown(f"**PPE Model**: `{ppe_status}`")
st.sidebar.markdown(f"**Hazard Model**: `{hazard_status}`")

st.sidebar.divider()

# Confidence Threshold Slider
conf_threshold = st.sidebar.slider(
    "Confidence Threshold",
    min_value=0.10,
    max_value=0.90,
    value=0.25,
    step=0.05,
    help="Cutoff confidence score for YOLO object & hazard detection. Lower values detect more objects but may include false positives."
)

st.sidebar.divider()
st.sidebar.markdown("### Instructions")
st.sidebar.markdown("""
1. Upload a coal mine photo (JPG, JPEG, PNG).
2. Set your desired **Confidence Threshold**.
3. Click **Run AI Analysis**.
4. Review PPE, Hazard, and Risk Fusion results.

**Tip**: Use images with workers for PPE detection. Use underground mine images for hazard detection. The combined pipeline runs both models on any image.
""")

# File Uploader
uploaded_file = st.file_uploader("Upload Mine Photo for Testing", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    try:
        input_image = Image.open(uploaded_file).convert("RGB")
        
        # Display Uploaded Image Header
        col_img, col_btn = st.columns([3, 1])
        with col_img:
            st.image(input_image, caption=f"Uploaded Image: {uploaded_file.name}", width="stretch")
        with col_btn:
            st.markdown("<br><br>", unsafe_allow_html=True)
            run_btn = st.button("Run AI Analysis", type="primary", use_container_width=True)
            
        if run_btn:
            with st.spinner("Running dual YOLO11 inference & Risk Fusion Engine..."):
                results = run_combined_inference(input_image, conf_threshold=conf_threshold)

            st.success("AI Analysis Completed Successfully!")
            st.divider()

            # -----------------------------------------------------------------
            # SIDE-BY-SIDE VISUALIZATION: Original | PPE Detection | Hazard Detection
            # -----------------------------------------------------------------
            st.subheader("Side-by-Side Visual Model Inspection")
            col1, col2, col3 = st.columns(3)
            with col1:
                st.markdown("##### 1. Original Image")
                st.image(results["original_img"])
            with col2:
                st.markdown("##### 2. PPE Detection Model")
                st.image(results["ppe_annotated_img"])
            with col3:
                st.markdown("##### 3. Mine Hazard Model")
                st.image(results["hazard_annotated_img"])

            st.markdown("##### 4. Combined Dual Detection Overlay")
            st.image(results["combined_annotated_img"])

            st.divider()

            # -----------------------------------------------------------------
            # SECTION 4: COMBINED SAFETY ANALYSIS & METRIC CARDS
            # -----------------------------------------------------------------
            st.subheader("Combined Safety Risk Analysis")
            final_res = results["final_analysis"]
            ppe_res = results["ppe_analysis"]
            haz_res = results["hazard_analysis"]

            m1, m2, m3, m4 = st.columns(4)
            ppe_comp = ppe_res['compliance_score']
            ppe_display = f"{ppe_comp}%" if ppe_comp >= 0 else "N/A"
            m1.metric("PPE Compliance Score", ppe_display, delta=f"Risk: {ppe_res['risk_level']}")
            m2.metric("Hazard Risk Score", f"{haz_res['hazard_score']}/100", delta=f"Risk: {haz_res['risk_level']}", delta_color="inverse")
            m3.metric("Overall Safety Score", f"{final_res['overall_score']}/100", delta_color="off")
            
            final_risk = final_res['overall_risk']
            if final_risk in ["HIGH", "CRITICAL"]:
                m4.markdown(f"#### Final Risk Tier\n### :red[{final_risk}]")
            elif final_risk == "MEDIUM":
                m4.markdown(f"#### Final Risk Tier\n### :orange[{final_risk}]")
            else:
                m4.markdown(f"#### Final Risk Tier\n### :green[{final_risk}]")

            st.markdown("#### Key Risk Rationales & Reasons")
            for reason in final_res["main_reasons"]:
                st.markdown(f"- **{reason}**")

            st.divider()

            # -----------------------------------------------------------------
            # SECTION 2: PPE DETECTION RESULTS
            # -----------------------------------------------------------------
            st.subheader("PPE Detection Results")
            p_col1, p_col2 = st.columns([1, 2])
            with p_col1:
                st.markdown(f"- **Workers Detected**: `{ppe_res['workers_detected']}`")
                ppe_comp_detail = f"{ppe_res['compliance_score']}%" if ppe_res['compliance_score'] >= 0 else "N/A (No workers in image)"
                st.markdown(f"- **Compliance Score**: `{ppe_comp_detail}`")
                st.markdown(f"- **PPE Risk Level**: `{ppe_res['risk_level']}`")
                st.markdown("**Violations Flagged**:")
                for v in ppe_res["violations"]:
                    if "No workers" in v or "No PPE violations" in v:
                        st.info(f"{v}")
                    else:
                        st.warning(f"{v}")
            with p_col2:
                st.image(results["ppe_annotated_img"], caption="Model 1: PPE YOLO11 Bounding Boxes")

            st.divider()

            # -----------------------------------------------------------------
            # SECTION 3: MINE HAZARD DETECTION RESULTS
            # -----------------------------------------------------------------
            st.subheader("Mine Hazard Detection Results")
            h_col1, h_col2 = st.columns([1, 2])
            with h_col1:
                st.markdown(f"- **Hazards Count**: `{len(haz_res['hazards_detected'])}`")
                st.markdown(f"- **Visual Hazard Score**: `{haz_res['hazard_score']}/100`")
                st.markdown(f"- **Hazard Risk Level**: `{haz_res['risk_level']}`")
                st.markdown("**Detected Hazards Breakdown**:")
                if haz_res["hazards_detected"]:
                    for h_item in haz_res["hazards_detected"]:
                        st.error(f"**{h_item['hazard']}** (Conf: {h_item['confidence']:.2f}, Severity: {h_item['severity']})")
                else:
                    st.info("No hazards detected.")
            with h_col2:
                st.image(results["hazard_annotated_img"], caption="Model 2: Mine Hazard YOLO11 Bounding Boxes")

            st.divider()

            # -----------------------------------------------------------------
            # DETECTION TABLE
            # -----------------------------------------------------------------
            st.subheader("Consolidated Detection Summary Table")
            if results["detection_table_data"]:
                df_table = pd.DataFrame(results["detection_table_data"])
                st.dataframe(df_table, use_container_width=True)
            else:
                st.info("No object or hazard detections above threshold.")

            st.divider()

            # -----------------------------------------------------------------
            # JSON OUTPUT SECTION
            # -----------------------------------------------------------------
            with st.expander("View Raw Prediction JSON"):
                st.json(results["raw_json"])

    except Exception as e:
        st.error(f"Error during image processing or inference: {e}")
else:
    st.info("Please upload a coal mine image above and click 'Run AI Analysis' to test model predictions.")
