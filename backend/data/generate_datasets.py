import random
import json
import csv
import os

random.seed(42)

def generate_training_data():
    os.makedirs(r"c:\Users\Aasawari Bodke\Sih\backend\data", exist_ok=True)
    
    # 1. DGMS Inspection & Section Risk Training Dataset
    # Features:
    # depth_m (50 to 700)
    # gassiness_degree (1, 2, 3)
    # open_violations (0 to 15)
    # days_since_last_inspection (1 to 60)
    # ch4_pct (0.05 to 2.2)
    # co_ppm (2 to 85)
    # ventilation_velocity_ms (0.2 to 4.5)
    # workers_count (5 to 150)
    # equipment_faults (0 to 6)
    # Target: risk_level (0: Low, 1: Medium, 2: High)
    
    training_rows = []
    headers = [
        "depth_m", "gassiness_degree", "open_violations", "days_since_last_inspection",
        "ch4_pct", "co_ppm", "ventilation_velocity_ms", "workers_count", "equipment_faults", "risk_level"
    ]
    
    for _ in range(1500):
        depth = random.randint(40, 650)
        gassiness = random.choices([1, 2, 3], weights=[0.55, 0.25, 0.20])[0]
        violations = random.randint(0, 12)
        days_insp = random.randint(1, 45)
        
        # Correlate gas with gassiness and depth
        if gassiness == 3:
            ch4 = round(random.uniform(0.6, 1.9), 2)
            co = random.randint(15, 75)
        elif gassiness == 2:
            ch4 = round(random.uniform(0.2, 1.1), 2)
            co = random.randint(8, 45)
        else:
            ch4 = round(random.uniform(0.02, 0.45), 2)
            co = random.randint(2, 28)
            
        vent = round(random.uniform(0.3, 3.8), 2)
        workers = random.randint(8, 95)
        eq_faults = random.randint(0, 5)
        
        # Risk heuristic based on DGMS CMR 2017:
        # High if CH4 > 1.0% OR CO > 40 ppm OR (vent < 0.5 and gassiness >= 2) OR violations >= 7
        score = 0
        if ch4 >= 1.25: score += 4
        elif ch4 >= 0.8: score += 2
        
        if co >= 45: score += 4
        elif co >= 25: score += 2
        
        if vent < 0.5: score += 3
        elif vent < 0.8: score += 1
        
        if violations >= 6: score += 3
        elif violations >= 3: score += 1
        
        if days_insp > 25: score += 2
        if depth > 400: score += 1
        if eq_faults >= 3: score += 2
        
        if score >= 6:
            risk = "High"
        elif score >= 3:
            risk = "Medium"
        else:
            risk = "Low"
            
        training_rows.append([
            depth, gassiness, violations, days_insp,
            ch4, co, vent, workers, eq_faults, risk
        ])
        
    train_path = r"c:\Users\Aasawari Bodke\Sih\backend\data\dgms_inspection_training.csv"
    with open(train_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(training_rows)
    print(f"Generated {len(training_rows)} training rows in {train_path}")

    # 2. Historical Gas & Environmental Sensor Telemetry
    telemetry_rows = []
    tel_headers = ["timestamp", "section_id", "ch4_pct", "co_ppm", "co2_pct", "air_velocity_ms", "temperature_c", "humidity_pct", "dust_pm10_mg", "is_anomaly", "alert_msg"]
    
    sections = [
        "SEC-PIT-A", "SEC-PIT-B", "SEC-UG-L1", "SEC-UG-L2", "SEC-UG-L3",
        "SEC-CHP", "SEC-CRUSHER", "SEC-WORKSHOP-3", "SEC-MAGAZINE", "SEC-HAUL-RD"
    ]
    
    base_time = 1716100000 # epoch
    for i in range(2500):
        sec = random.choice(sections)
        is_ug = "UG" in sec
        
        # 8% chance of anomaly
        anomaly = random.random() < 0.08
        
        if anomaly:
            hazard_type = random.choice(["METHANE_SPIKE", "CO_HEATING", "VENTILATION_FAILURE", "DUST_SPIKE"])
            if hazard_type == "METHANE_SPIKE":
                ch4 = round(random.uniform(1.25, 2.3), 2)
                co = random.randint(15, 35)
                co2 = round(random.uniform(0.3, 0.8), 2)
                air = round(random.uniform(0.6, 2.0), 2)
                dust = random.randint(40, 180)
                msg = f"CRITICAL: Methane concentration ({ch4}%) exceeded statutory limit (1.25%) in {sec}."
            elif hazard_type == "CO_HEATING":
                ch4 = round(random.uniform(0.1, 0.7), 2)
                co = random.randint(52, 95)
                co2 = round(random.uniform(0.4, 1.1), 2)
                air = round(random.uniform(0.5, 1.8), 2)
                dust = random.randint(50, 210)
                msg = f"WARNING: Elevated Carbon Monoxide ({co} ppm) detected. Probable spontaneous heating."
            elif hazard_type == "VENTILATION_FAILURE":
                ch4 = round(random.uniform(0.5, 1.4), 2)
                co = random.randint(20, 48)
                co2 = round(random.uniform(0.5, 1.3), 2)
                air = round(random.uniform(0.05, 0.28), 2)
                dust = random.randint(90, 320)
                msg = f"ALERT: Air velocity dropped to {air} m/s (Statutory Minimum: 0.5 m/s)."
            else:
                ch4 = round(random.uniform(0.1, 0.4), 2)
                co = random.randint(5, 20)
                co2 = round(random.uniform(0.1, 0.4), 2)
                air = round(random.uniform(1.0, 3.0), 2)
                dust = random.randint(480, 850)
                msg = f"ALERT: Airborne respirable dust concentration ({dust} mg/m³) exceeded DGMS permissible limits."
            is_anom = 1
        else:
            ch4 = round(random.uniform(0.04, 0.55 if is_ug else 0.15), 2)
            co = random.randint(3, 22 if is_ug else 12)
            co2 = round(random.uniform(0.08, 0.38), 2)
            air = round(random.uniform(0.8, 3.2), 2)
            dust = random.randint(35, 140)
            is_anom = 0
            msg = "NORMAL: Environmental telemetry within statutory parameters."
            
        temp = round(random.uniform(24.0, 35.5), 1)
        hum = round(random.uniform(60.0, 88.0), 1)
        ts = base_time + (i * 120)
        
        telemetry_rows.append([ts, sec, ch4, co, co2, air, temp, hum, dust, is_anom, msg])
        
    tel_path = r"c:\Users\Aasawari Bodke\Sih\backend\data\sensor_telemetry_historical.csv"
    with open(tel_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(tel_headers)
        writer.writerows(telemetry_rows)
    print(f"Generated {len(telemetry_rows)} telemetry rows in {tel_path}")

    # 3. Realistic DGMS Circulars and Statutory Documents JSON
    circulars = [
        {
            "doc_id": "DGMS-CIRC-2024-02",
            "title": "Continuous Tele-Monitoring of Flammable Gases & Airborne Dust in Degree-III Underground Collieries",
            "authority": "Directorate General of Mines Safety (DGMS), Dhanbad",
            "date": "15 January 2024",
            "reg_reference": "Coal Mines Regulations (CMR) 2017, Regulation 153 & 158",
            "mine_scope": "All Degree II & Degree III Underground Coal Mines across CIL Subsidiaries",
            "statutory_mandates": [
                "Mandatory deployment of flameproof methane sensor heads at return airway split junctions.",
                "Automatic power interlock to cut electrical feed when methane exceeds 1.0% volume in air.",
                "Hourly verification of auxiliary fan airflow delivering minimum 0.5 m/s at dead-end faces.",
                "Daily calibration check of multi-gas detector instruments using certified zero/span test gas."
            ],
            "severity_level": "High",
            "compliance_deadline": "31 March 2024"
        },
        {
            "doc_id": "MOEF-EC-2023-781",
            "title": "Environmental Clearance for Production Expansion (from 35 MTPA to 50 MTPA) - Gevra Opencast Project",
            "authority": "Ministry of Environment, Forest and Climate Change (MoEFCC), New Delhi",
            "date": "18 October 2023",
            "reg_reference": "Environment (Protection) Act, 1986 & EIA Notification 2006",
            "mine_scope": "Gevra Opencast Project, South Eastern Coalfields Limited (SECL)",
            "statutory_mandates": [
                "Continuous ambient air quality monitoring stations (CAAQMS) for PM10, PM2.5, SO2, and NOx.",
                "Controlled blasting using electronic delay detonators to maintain peak particle velocity (PPV) < 5 mm/s at nearest village.",
                "100% water sprinkling through mist spray cannons along 14.2 km main haulage roads.",
                "Progressive concurrent biological reclamation of external overburden dump."
            ],
            "severity_level": "Medium",
            "compliance_deadline": "Annual Compliance Return (Form V)"
        },
        {
            "doc_id": "DGMS-FORM-IV-2025-08",
            "title": "Statutory Notice of Non-Fatal Serious Accident: Spontaneous Combustion Event at Heading 4",
            "authority": "DGMS Eastern Zone Regional Office, Sitarampur",
            "date": "12 May 2025",
            "reg_reference": "Mines Act 1952, Section 23 & CMR 2017 Regulation 8",
            "mine_scope": "Rajpura Coal Colliery / Jharia Deep Section L-3",
            "statutory_mandates": [
                "Temporary cessation of extraction at Section L-3 Heading 4 until nitrogen flushing completed.",
                "Erection of 375mm thick explosion-proof isolation stopping seals with sampling inspection pipes.",
                "Submission of gas chromatograph Graham's Ratio report to Regional Inspector within 48 hours."
            ],
            "severity_level": "High",
            "compliance_deadline": "Immediate (Within 48 Hours)"
        }
    ]
    
    circ_path = r"c:\Users\Aasawari Bodke\Sih\backend\data\dgms_circulars_sample.json"
    with open(circ_path, "w", encoding="utf-8") as f:
        json.dump(circulars, f, indent=2)
    print(f"Generated sample statutory documents in {circ_path}")

if __name__ == "__main__":
    generate_training_data()
