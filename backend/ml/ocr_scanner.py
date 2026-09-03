import re
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CIRCULARS_PATH = os.path.join(BASE_DIR, "data", "dgms_circulars_sample.json")

def load_circulars():
    if os.path.exists(CIRCULARS_PATH):
        try:
            with open(CIRCULARS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

from typing import Optional

def scan_document_text(raw_text: Optional[str] = None, doc_id: Optional[str] = None):
    circulars = load_circulars()

    if doc_id:
        for c in circulars:
            if c["doc_id"] == doc_id:
                return {
                    "doc_id": c["doc_id"],
                    "title": c["title"],
                    "issuing_authority": c["authority"],
                    "authority_short": c.get("authority_short", c["authority"]),
                    "category": c.get("category", "Statutory Directive"),
                    "date": c["date"],
                    "statutory_reference": c["reg_reference"],
                    "mine_scope": c["mine_scope"],
                    "mandates": c["statutory_mandates"],
                    "severity": c["severity_level"],
                    "deadline": c["compliance_deadline"],
                    "ocr_confidence": c.get("ocr_confidence", 98.6),
                    "scan_resolution_dpi": c.get("scan_resolution_dpi", 300),
                    "language": c.get("language", "English (Official Gazette)"),
                    "signatory": c.get("signatory", "Chief Inspector of Mines"),
                    "assigned_cadre": c.get("assigned_cadre", "Safety Officer"),
                    "bounding_boxes": c.get("bounding_boxes", []),
                    "statutory_checks": c.get("statutory_checks", []),
                    "qa_pairs": c.get("qa_pairs", []),
                    "raw_text": c.get("raw_text", "")
                }

    # If arbitrary raw text was provided, run pattern extractions
    text = raw_text if raw_text else ("DGMS Circular 2024. Continuous Gas Tele-Monitoring.")
    
    # Extract Reference Pattern
    ref_match = re.search(r"(DGMS|MOEF|CMR|ACT|CIL)[-\w/]+", text, re.IGNORECASE)
    doc_num = ref_match.group(0) if ref_match else "CUSTOM-SCAN-01"

    # Extract Dates
    date_match = re.search(r"\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b", text, re.IGNORECASE)
    extracted_date = date_match.group(0) if date_match else "Current Date"

    # Extract Regulations
    reg_match = re.search(r"(Regulation\s+\d+|Section\s+\d+|CMR\s+\d{4})", text, re.IGNORECASE)
    reg_ref = reg_match.group(0) if reg_match else "Coal Mines Regulations (CMR) 2017"

    # Extract Mandates from lines
    lines = [line.strip() for line in text.split("\n") if len(line.strip()) > 15]
    extracted_mandates = []
    for line in lines:
        if re.match(r"^(\d+\.|\*|-|Mandatory|Shall|Must|Ensure)", line, re.IGNORECASE):
            extracted_mandates.append(re.sub(r"^(\d+\.|\*|-)\s*", "", line))
    if not extracted_mandates:
        extracted_mandates = lines[:4] if len(lines) >= 4 else [text[:120] + "..."]

    return {
        "doc_id": doc_num,
        "title": lines[0] if lines else "Scanned Colliery Notice / Directive",
        "issuing_authority": "Directorate General of Mines Safety (DGMS) / Colliery Authority",
        "authority_short": "DGMS Dhanbad",
        "category": "Custom Scanned Document",
        "date": extracted_date,
        "statutory_reference": reg_ref,
        "mine_scope": "Applicable Colliery Operation",
        "mandates": extracted_mandates[:5],
        "severity": "High" if any(k in text.lower() for k in ["prohibition", "immediate", "accident", "danger", "hazard"]) else "Medium",
        "deadline": "Within 30 Days of Notice",
        "ocr_confidence": 97.2,
        "scan_resolution_dpi": 300,
        "language": "English / Hindi",
        "signatory": "Authorized Statutory Official",
        "assigned_cadre": "Mine Manager & Safety Officer",
        "bounding_boxes": [
            { "id": "b1", "label": "Header", "type": "authority", "top": 6, "left": 15, "width": 70, "height": 8 },
            { "id": "b2", "label": "Reference ID", "type": "reference", "top": 16, "left": 10, "width": 40, "height": 5 },
            { "id": "b3", "label": "Mandate 1", "type": "mandate", "top": 32, "left": 10, "width": 80, "height": 10 },
            { "id": "b4", "label": "Compliance Date", "type": "deadline", "top": 60, "left": 10, "width": 50, "height": 6 }
        ],
        "statutory_checks": [
            { "code": "CMR-2017", "rule": "Verification of statutory safety compliance", "status": "ACTION REQUIRED", "action": "Review extracted mandates with colliery safety committee" }
        ],
        "qa_pairs": [
            { "q": "What is the primary subject of this document?", "a": lines[0] if lines else "Statutory mine safety compliance." }
        ],
        "raw_text": text
    }

def get_all_circulars_summary():
    circulars = load_circulars()
    return [{
        "id": c["doc_id"],
        "name": c["title"],
        "authority": c["authority"],
        "authority_short": c.get("authority_short", c["authority"]),
        "type": c.get("category", "Statutory Directive"),
        "severity": c["severity_level"],
        "date": c["date"],
        "reg_reference": c["reg_reference"]
    } for c in circulars]

if __name__ == "__main__":
    print(scan_document_text(doc_id="DGMS-CIRC-2024-02"))
