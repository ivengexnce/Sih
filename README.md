<div align="center">
  <h1>🛡️ MineGuard</h1>
  <h3>AI-Based Smart Governance & Compliance Monitoring System for Coal Mines</h3>
  <p><strong>Ministry of Coal | Coal India Limited (CIL) | DGMS</strong></p>
</div>

---

## 📖 Overview

MineGuard is an end-to-end, full-stack governance and compliance platform engineered to revolutionize safety monitoring across Indian coalfields. Built in direct response to the statutory mandates of the **Coal Mines Regulations (CMR) 2017** and the **Mines Act 1952**, the system acts as a digital nervous system for colliery operations. 

By unifying **IoT telemetry**, **Ensemble Machine Learning**, **Geospatial mapping (GIS)**, and **Optical Character Recognition (OCR)** into a resilient Progressive Web App (PWA), MineGuard ensures zero-latency safety auditing, predictive hazard prevention, and immutable compliance ledgers.

---

## ⚡ Core Modules & Architecture

### 1. Multi-Tier Role-Based Governance (RBAC)
- **Corporate Admin (CIL HQ)**: Pan-India surveillance across all subsidiaries (ECL, BCCL, SECL, NCL, etc.) providing macro-level compliance aggregation.
- **Mine Manager**: Dedicated Colliery Command Center dynamically scoped to a single active mine (e.g., *Gevra Opencast, Jharia Deep*).
- **Safety Inspector**: Field-ready audit suite optimized for mobile with offline PWA capabilities.

### 2. State-of-the-Art AI Risk Engine
- **Predictive Risk Classifier**: A Soft-Voting Ensemble Model (Gradient Boosting + Random Forest) trained on 3,000 DGMS records, delivering **97.67% accuracy**. Computes Graham's ratio and gas dispersion indices to forecast spontaneous combustion.
- **Multi-Factor Deep Diagnostics**: Evaluates 72-hour failure probabilities, generating Explainable AI (XAI) root causes and statutory action directives (P1/P2/P3).
- **Isolation Forest Anomaly Detector**: Intercepts multi-gas Environmental Tele-Monitoring System (ETMS) data against strict statutory limits (e.g., $CH_4 \ge 1.0\%$, $CO \ge 30\text{ ppm}$).

### 3. Progressive Web App (PWA) & Offline Resilience
- Engineered with `@serwist/next`, the platform caches static assets and essential API dictionaries. This guarantees that field inspectors can conduct audits, log violations, and access safety manuals hundreds of meters underground without active network connectivity.

### 4. Interactive GIS & Satellite Mapping
- High-resolution ESRI satellite maps integrated via Leaflet. Features interactive coal seam overlays and authentic WGS-84 coordinates for major Indian coalfields.

### 5. Document OCR & CAPA Workflow
- Proprietary NLP parser digitizes physical DGMS Technical Circulars and MoEFCC clearance letters. 
- Extracted safety directives are automatically injected into a Kanban-style Corrective and Preventive Action (CAPA) workflow.

### 6. Multilingual Interface
- Seamless English (🇬🇧) and Hindi (🇮🇳) toggle integrated across all components, ensuring inclusivity for the grassroots workforce.

---

## 🛠️ Technology Stack

| Domain | Technology / Framework |
|---|---|
| **Frontend Architecture** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI/UX** | TailwindCSS v4, Recharts, Lucide Icons, Glassmorphism |
| **Backend API** | Python 3.12, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib |
| **PWA & Offline** | Serwist |
| **Storage & Auth** | Firebase Cloud Storage, Firestore, LocalStorage Fallback |
| **Geospatial Mapping** | React Leaflet, ESRI APIs |
| **Deployment** | Vercel (Frontend & Serverless Backend) |

---

## 📊 Machine Learning Benchmarks

- **Algorithm**: Gradient Boosting Classifier (300 estimators) + Random Forest (250 estimators)
- **Dataset**: Synthesized CIL/DGMS Compliance dataset (3,000 records, 16 engineered features)
- **Accuracy**: **97.67%** (Low Risk F1: 0.99, Medium Risk F1: 0.98, High Risk F1: 0.95)
- **Inference Latency**: ~18ms (FastAPI integration)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ 
- **Python**: v3.10+
- **Package Managers**: `npm` and `pip`

### 1. Frontend Configuration
```bash
# Clone the repository
git clone https://github.com/ivengexnce/Sih.git
cd Sih

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

### 2. Backend / AI Engine Configuration
```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r ../requirements.txt

# Start the FastAPI uvicorn server
uvicorn main:app --reload --port 8000
```
The REST API will be active at `http://127.0.0.1:8000`. Interactive Swagger UI documentation is available at `http://127.0.0.1:8000/docs`.

---

## 🌐 API Documentation

The FastAPI backend exposes 18+ statutory endpoints. Key endpoints include:
- `POST /api/ai/predict-risk`: Ensemble risk classification.
- `POST /api/ai/deep-risk-analysis`: Multi-factor deep diagnostic analysis.
- `POST /api/ai/detect-anomaly`: Multi-gas telemetry anomaly detection.
- `GET /api/ai/telemetry-stream`: Live IoT multi-gas sensor stream.
- `POST /api/ai/ocr-scan`: Document OCR metadata parser.

---

## 📜 Compliance & Legal
MineGuard is developed explicitly for the Smart India Hackathon (SIH). It closely models the statutory mandates of the **Mines Act 1952** and the **Coal Mines Regulations 2017**. Geospatial datasets, personnel names, and historical telemetry data utilized in this repository are heavily simulated for demonstration purposes.
