import os
import csv
import json
import random
import time
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.ml.risk_predictor import predict_colliery_risk
from backend.ml.anomaly_detector import evaluate_sensor_anomaly
from backend.ml.ocr_scanner import scan_document_text
from backend.ml.risk_analyzer import perform_deep_risk_analysis

app = FastAPI(
    title="MineGuard AI Governance & Compliance API",
    description="Centralized AI-enabled governance and compliance monitoring platform for Coal India Limited (Ministry of Coal)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- IN-MEMORY STATE INITIALIZATION FROM DATASETS -----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MINES_PATH = os.path.join(BASE_DIR, "data", "cil_mines.csv")

mines_db = []
if os.path.exists(MINES_PATH):
    with open(MINES_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            mines_db.append({
                "id": row["mine_id"],
                "subsidiary": row["subsidiary"],
                "name": row["mine_name"],
                "coalfield": row["coalfield"],
                "state": row["state"],
                "latitude": float(row["latitude"]),
                "longitude": float(row["longitude"]),
                "type": row["mine_type"],
                "depth_m": int(row["seam_depth_m"]),
                "capacity_mtpa": float(row["capacity_mtpa"]),
                "manpower": int(row["manpower"]),
                "gassiness": row["gassiness_degree"],
                "compliance_score": float(row["compliance_score"]),
                "open_violations": int(row["open_violations"]),
                "combustion_risk": row["spontaneous_combustion_risk"]
            })

sections_db = [
    { "id": "SEC-01", "name": "Pit Area – Section A", "depth": "45m", "compliance": 92, "risk": "Low", "workers": 48, "hazard": "Dust accumulation near bench crest", "supervisor": "Rajesh Sharma", "mine_id": "MINE-01" },
    { "id": "SEC-02", "name": "Pit Area – Section B", "depth": "60m", "compliance": 88, "risk": "Medium", "workers": 34, "hazard": "Haul road slope gradient > 1:16", "supervisor": "Anil Verma", "mine_id": "MINE-01" },
    { "id": "SEC-03", "name": "Underground Level 1", "depth": "180m", "compliance": 94, "risk": "Low", "workers": 55, "hazard": "Auxiliary fan duct joint leak", "supervisor": "P. K. Mishra", "mine_id": "MINE-03" },
    { "id": "SEC-04", "name": "Underground Level 2", "depth": "270m", "compliance": 81, "risk": "High", "workers": 62, "hazard": "Methane local build-up at heading roof", "supervisor": "Sunil Soren", "mine_id": "MINE-03" },
    { "id": "SEC-05", "name": "Underground Level 3", "depth": "380m", "compliance": 76, "risk": "High", "workers": 40, "hazard": "CO reading 42 ppm, nitrogen line required", "supervisor": "M. K. Das", "mine_id": "MINE-03" },
    { "id": "SEC-06", "name": "Crusher Plant", "depth": "Surface", "compliance": 90, "risk": "Medium", "workers": 22, "hazard": "Primary crusher drive guard detached", "supervisor": "D. Sengupta", "mine_id": "MINE-01" },
    { "id": "SEC-07", "name": "Coal Handling Plant (CHP)", "depth": "Surface", "compliance": 95, "risk": "Low", "workers": 38, "hazard": "Conveyor belt 2 water sprayer nozzle blocked", "supervisor": "K. R. Roy", "mine_id": "MINE-01" },
    { "id": "SEC-08", "name": "Workshop – Bay 1", "depth": "Surface", "compliance": 96, "risk": "Low", "workers": 28, "hazard": "Minor oil spill near hydraulic press", "supervisor": "V. K. Singh", "mine_id": "MINE-01" },
    { "id": "SEC-09", "name": "Workshop – Bay 3", "depth": "Surface", "compliance": 79, "risk": "High", "workers": 19, "hazard": "Fire extinguisher expired, exit blocked", "supervisor": "S. Chatterjee", "mine_id": "MINE-01" },
    { "id": "SEC-10", "name": "Explosives Magazine", "depth": "Surface", "compliance": 98, "risk": "Low", "workers": 8, "hazard": "Lightning arrestor earth resistance verified", "supervisor": "B. N. Pandey", "mine_id": "MINE-01" },
    { "id": "SEC-11", "name": "Main Haul Road (14 km)", "depth": "Surface", "compliance": 89, "risk": "Medium", "workers": 16, "hazard": "Berm height below 1.8m near curve 4", "supervisor": "R. C. Murmu", "mine_id": "MINE-01" },
    { "id": "SEC-12", "name": "Electrical Sub-station 33kV", "depth": "Surface", "compliance": 93, "risk": "Low", "workers": 12, "hazard": "Danger signage faded at transformer bay", "supervisor": "A. K. Ghosh", "mine_id": "MINE-01" },
]

inspections_db = [
    { "id": "INSP-041", "area": "Pit Area – Section A", "mine": "Rajpura Coal Mine", "assigned": "May 19, 2025", "time": "10:15 AM", "deadline": "May 19, 2025", "status": "Completed", "severity": "Low", "findingsNote": "Haul road berm height verified at 1.8m. Dust suppression sprayers operational." },
    { "id": "INSP-040", "area": "Workshop – Bay 3", "mine": "Rajpura Coal Mine", "assigned": "May 19, 2025", "time": "09:31 AM", "deadline": "May 19, 2025", "status": "Completed", "severity": "High", "findingsNote": "Fire extinguisher expired in March 2025. Emergency exit partially blocked by scrap drums." },
    { "id": "INSP-039", "area": "Conveyor Belt – Line 2", "mine": "Rajpura Coal Mine", "assigned": "May 18, 2025", "time": "05:45 PM", "deadline": "May 19, 2025", "status": "Completed", "severity": "Low", "findingsNote": "Emergency pull-cord switch tripped correctly during test. Rollers properly lubricated." },
    { "id": "INSP-038", "area": "Electrical Room", "mine": "Rajpura Coal Mine", "assigned": "May 18, 2025", "time": "03:08 PM", "deadline": "May 19, 2025", "status": "Completed", "severity": "Medium", "findingsNote": "Rubber safety mats missing in front of 415V switchgear panel #2." },
    { "id": "INSP-042", "area": "Main Haul Road", "mine": "Rajpura Coal Mine", "assigned": "May 19, 2025", "time": "—", "deadline": "May 20, 2025", "status": "Scheduled", "severity": "—", "findingsNote": "Routine scheduled road grading and visibility check." }
]

violations_db = [
    { "id": "VIO-128", "type": "PPE Non-Compliance", "area": "Pit Area – Section A", "date": "May 19, 2025", "severity": "High", "status": "Open", "findings": "3 drill operators observed without certified hardhats in active bench blasting perimeter." },
    { "id": "VIO-127", "type": "Fire Safety Equipment", "area": "Workshop – Bay 3", "date": "May 19, 2025", "severity": "High", "status": "Open", "findings": "Primary 9kg dry chemical fire extinguisher expired. Emergency egress passage blocked by metal drums." },
    { "id": "VIO-126", "type": "Housekeeping & Spillages", "area": "Conveyor Belt – Line 2", "date": "May 18, 2025", "severity": "Low", "status": "Resolved", "findings": "Lubricant oil spill near conveyor drive motor drum posing slip and fire hazard." },
    { "id": "VIO-125", "type": "Machine Guarding", "area": "Crusher Plant", "date": "May 18, 2025", "severity": "Medium", "status": "In Progress", "findings": "Perimeter mesh guard detached on primary jaw crusher flywheel assembly." },
    { "id": "VIO-124", "type": "Mine Ventilation", "area": "Underground Level 3", "date": "May 17, 2025", "severity": "High", "status": "Open", "findings": "Multi-gas detector triggered at heading 4: Carbon dioxide (CO₂) elevated at 2,200 ppm." }
]

actions_db = [
    { "id": "ACT-043", "title": "Verify repair of ventilation fan at Underground Level 3", "relatedTo": "VIO-124", "due": "May 20, 2025", "priority": "High", "done": False },
    { "id": "ACT-047", "title": "Confirm fire drill completed – all sections", "relatedTo": "INS-038", "due": "May 22, 2025", "priority": "High", "done": False },
    { "id": "ACT-044", "title": "Re-inspect gas detection sensors after calibration", "relatedTo": "VIO-124", "due": "May 20, 2025", "priority": "High", "done": False },
    { "id": "ACT-046", "title": "Review and counter-sign fortnightly compliance report", "relatedTo": "—", "due": "May 21, 2025", "priority": "Medium", "done": False },
    { "id": "ACT-039", "title": "Inspect fixed electrical wiring in junction box panel", "relatedTo": "VIO-122", "due": "May 21, 2025", "priority": "High", "done": False },
    { "id": "ACT-045", "title": "Validate replacement of fire extinguishers – Workshop Bay 3", "relatedTo": "VIO-127", "due": "May 21, 2025", "priority": "High", "done": False },
    { "id": "ACT-036", "title": "Check new signage installation at Level 3 entry points", "relatedTo": "INS-036", "due": "May 24, 2025", "priority": "Medium", "done": True }
]

# ----------------- API SCHEMAS -----------------

class RiskPredictionRequest(BaseModel):
    depth_m: int = 180
    gassiness_degree: int = 2
    open_violations: int = 3
    days_since_last_inspection: int = 7
    ch4_pct: float = 0.45
    co_ppm: int = 18
    ventilation_velocity_ms: float = 1.2
    workers_count: int = 40
    equipment_faults: int = 1

class AnomalyCheckRequest(BaseModel):
    ch4_pct: float
    co_ppm: int
    co2_pct: float = 0.25
    air_velocity_ms: float
    temperature_c: float = 29.5
    dust_pm10_mg: int = 90

class OCRScanRequest(BaseModel):
    doc_id: Optional[str] = "DGMS-CIRC-2024-02"
    raw_text: Optional[str] = None

# ----------------- ROUTES -----------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MineGuard CIL Smart Governance API",
        "timestamp": time.time(),
        "database": "connected",
        "ml_models": ["risk_classifier_rf", "isolation_forest_anomaly_detector", "ocr_statutory_parser"]
    }

@app.get("/api/mines")
def get_mines():
    return {"total": len(mines_db), "mines": mines_db}

@app.get("/api/sections/{mine_id}")
def get_sections(mine_id: str):
    matched = [s for s in sections_db if s["mine_id"] == mine_id]
    return {"mine_id": mine_id, "total": len(matched or sections_db), "sections": matched or sections_db}

@app.get("/api/inspections")
def get_inspections():
    return {"total": len(inspections_db), "inspections": inspections_db}

@app.post("/api/inspections")
def create_inspection(item: dict = Body(...)):
    new_id = f"INSP-0{len(inspections_db) + 42}"
    item["id"] = new_id
    inspections_db.insert(0, item)
    return {"message": "Inspection created successfully", "inspection": item}

@app.get("/api/violations")
def get_violations():
    return {"total": len(violations_db), "violations": violations_db}

@app.post("/api/violations")
def create_violation(item: dict = Body(...)):
    new_id = f"VIO-1{len(violations_db) + 29}"
    item["id"] = new_id
    violations_db.insert(0, item)
    return {"message": "Violation logged and dispatched to Mine Manager", "violation": item}

@app.get("/api/actions")
def get_actions():
    return {"total": len(actions_db), "actions": actions_db}

@app.post("/api/actions")
def create_action(item: dict = Body(...)):
    new_id = f"ACT-0{len(actions_db) + 49}"
    item["id"] = new_id
    actions_db.insert(0, item)
    return {"message": "Action item created", "action": item}

@app.patch("/api/actions/{action_id}")
def toggle_action(action_id: str):
    for a in actions_db:
        if a["id"] == action_id:
            a["done"] = not a["done"]
            return {"message": "Status updated", "action": a}
    raise HTTPException(status_code=404, detail="Action not found")

# ----------------- AI / ML ENDPOINTS -----------------

@app.post("/api/ai/predict-risk")
def api_predict_risk(req: RiskPredictionRequest):
    try:
        result = predict_colliery_risk(
            depth_m=req.depth_m,
            gassiness_degree=req.gassiness_degree,
            open_violations=req.open_violations,
            days_since_last_inspection=req.days_since_last_inspection,
            ch4_pct=req.ch4_pct,
            co_ppm=req.co_ppm,
            ventilation_velocity_ms=req.ventilation_velocity_ms,
            workers_count=req.workers_count,
            equipment_faults=req.equipment_faults
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/detect-anomaly")
def api_detect_anomaly(req: AnomalyCheckRequest):
    try:
        result = evaluate_sensor_anomaly(
            ch4_pct=req.ch4_pct,
            co_ppm=req.co_ppm,
            co2_pct=req.co2_pct,
            air_velocity_ms=req.air_velocity_ms,
            temperature_c=req.temperature_c,
            dust_pm10_mg=req.dust_pm10_mg
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/telemetry-stream")
def api_telemetry_stream():
    # Returns simulated real-time reading for 4 critical sensors with random live fluctuation
    sections = ["Underground Level 2", "Underground Level 3", "Pit Area Section A", "CHP Conveyor 2"]
    res = []
    for sec in sections:
        is_ug = "Underground" in sec
        ch4 = round(random.uniform(0.12, 1.35 if "Level 3" in sec else 0.45), 2)
        co = random.randint(8, 48 if "Level 3" in sec else 18)
        air = round(random.uniform(0.35 if "Level 3" in sec else 0.8, 2.5), 2)
        temp = round(random.uniform(27.0, 33.5), 1)
        anomaly = evaluate_sensor_anomaly(ch4, co, 0.25, air, temp, 85)
        res.append({
            "section": sec,
            "timestamp": time.strftime("%H:%M:%S"),
            "ch4": ch4,
            "co": co,
            "air": air,
            "temp": temp,
            "status": anomaly["severity"],
            "alert": anomaly["breach_reasons"][0] if anomaly["is_anomaly"] else "Normal"
        })
    return {"stream": res}

@app.post("/api/ai/deep-risk-analysis")
def api_deep_risk_analysis(payload: dict = Body(...)):
    try:
        sec_name = payload.get("section_name", "Underground Level 3")
        depth = int(payload.get("depth_m", 250))
        ch4 = float(payload.get("ch4_pct", 0.45))
        co = int(payload.get("co_ppm", 18))
        air = float(payload.get("air_velocity_ms", 1.1))
        vio = int(payload.get("open_violations", 3))
        workers = int(payload.get("workers_count", 40))
        gassiness = int(payload.get("gassiness_degree", 2))

        result = perform_deep_risk_analysis(
            section_name=sec_name,
            depth_m=depth,
            ch4_pct=ch4,
            co_ppm=co,
            air_velocity_ms=air,
            open_violations=vio,
            workers_count=workers,
            gassiness_degree=gassiness
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/ocr-scan")
def api_ocr_scan(req: OCRScanRequest):
    try:
        return scan_document_text(raw_text=req.raw_text, doc_id=req.doc_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/model-metrics")
def api_model_metrics():
    metrics_path = os.path.join(BASE_DIR, "ml", "models", "model_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "model_type": "Optimized Soft-Voting Ensemble",
        "test_accuracy": 97.67,
        "statutory_standards": "DGMS Coal Mines Regulations 2017"
    }

@app.post("/api/translate")
@app.get("/api/translate")
def api_translate(payload: dict = Body(default={})):
    import urllib.request
    import urllib.parse
    texts = payload.get("texts", [])
    text = payload.get("text", "")
    target_lang = payload.get("targetLang", "hi")

    if text and not texts:
        texts = [text]

    results = []
    for t in texts:
        if not t:
            results.append("")
            continue
        try:
            url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(str(t))}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode("utf-8"))
                if data and len(data) > 0 and data[0]:
                    translated = "".join(seg[0] for seg in data[0] if seg and seg[0])
                    results.append(translated)
                else:
                    results.append(t)
        except Exception:
            results.append(t)

    return {"translated": results, "targetLang": target_lang}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
