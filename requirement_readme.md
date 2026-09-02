# Requirement Specifications: AI-Based Smart Governance & Compliance Monitoring System for Coal Mines

**Organization:** Ministry of Coal  
**Department:** Coal India Limited (CIL)  
**Initiative:** Smart India Hackathon (SIH)  
**Project Codename:** MineGuard  

---

## 1. Executive Summary & Context

The Indian coal mining sector is the backbone of national energy security, comprising large-scale operations spread across seven producing subsidiaries of Coal India Limited (**ECL, BCCL, CCL, WCL, SECL, MCL, NCL**) and one mine planning institute (**CMPDIL**), spanning over 300+ operational open-cast and underground mines.

Governance-related activities in this ecosystem—such as statutory compliance monitoring under the **Mines Act (1952), Coal Mines Regulations (CMR 2017), DGMS Circulars, Environment Protection Act, Forest Conservation Act, and Contract Labour Regulations**—are currently fragmented across disparate spreadsheets, physical registers, manual inspection notes, and siloed software tools.

This leads to:
- **Data Inconsistencies & Duplication**: Discrepancies between field logbooks and corporate reports.
- **Compliance Gaps & Regulatory Exposure**: Delayed response to DGMS violation notices and statutory deadlines.
- **Weak Field Monitoring**: Lack of real-time proof-of-presence, geo-tagging, or time-stamping for field safety inspections.
- **Delayed Administrative Decisions**: Absence of real-time predictive hazard indicators for high-level management.

The goal is to engineer an indigenous, scalable, centralized **AI-enabled Smart Governance and Compliance Monitoring System** that integrates field activities, statutory compliance, multi-tier administration, automated workflows, and predictive analytics into a unified digital ecosystem.

---

## 2. Core Stakeholders & Role-Based Hierarchy

```
┌──────────────────────────────────────────────────────────────────┐
│              Ministry of Coal / CIL Corporate Apex               │
│          (Policy, National Compliance, Multi-Subsidiary View)     │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│    Subsidiary / Corporate Admin  │    │     Statutory Authorities       │
│  (ECL, SECL, MCL, WCL, etc.)     │    │  (DGMS, MoEFCC, Coal Controller) │
└────────────────┬─────────────────┘    └────────────────┬─────────────────┘
                 ▼                                       ▼
┌──────────────────────────────────────────────────────────────────┐
│             Mine General Manager / Colliery Safety Officers      │
│          (Operational Safety, Production, Equipment, Actions)   │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│       Field Safety Inspector     │    │    Contractor & Workforce Leads  │
│  (Checklists, Violations, Tasks) │    │  (Equipment, Attendance, Safety) │
└──────────────────────────────────┘    └──────────────────────────────────┘
```

---

## 3. Comprehensive Functional Requirements (FR)

### FR-1: Multi-Tier Governance & Role-Based Portals
- **FR-1.1**: Centralized Single Sign-On (SSO) with multi-factor authentication (MFA) supporting three core roles:
  - **Corporate / Subsidiary Admin**: Cross-mine portfolio analytics, regulatory audit tracker, subsidiary comparison.
  - **Mine Manager**: Single colliery deep-dive, section-wise compliance, fleet uptime, worker rosters, document library.
  - **Field Safety Inspector**: Mobile-responsive field inspection execution, violation logging, action verification checklist.
- **FR-1.2**: Role-Based Access Control (RBAC) ensuring data sovereignty across subsidiaries and collieries.

### FR-2: Statutory Compliance Monitoring Engine
- **FR-2.1**: Tracking compliance against statutory mandates:
  - **Safety**: Mines Act (1952), Coal Mines Regulations (CMR 2017), DGMS Safety Circulars.
  - **Environment**: Air/Water consent under CPCB/SPCB, Forest Conservation clearances, Mine Closure Plan provisions.
  - **Production & Quality**: Coal Controller Organisation (CCO) statutory returns.
  - **Labour & Contractors**: Contract Labour (Regulation & Abolition) Act, statutory PPE, mandatory vocational training (VTC).
- **FR-2.2**: Quantitative Compliance Scoring (0–100%) dynamically calculated based on open violations, overdue inspections, and resolution timelines.
- **FR-2.3**: Statutory Audit Matrix with visual compliance indicators and historical trend sparklines.

### FR-3: Digital Inspection Management System
- **FR-3.1**: Digital scheduling of mandatory shift-wise, daily, fortnightly, and quarterly inspections across mine working sections.
- **FR-3.2**: Interactive standard digital checklists tailored for mining zones (Pit areas, underground coal headings, haul roads, coal handling plants, explosives magazines, workshops).
- **FR-3.3**: Evidence capture with photo/document attachments and digital sign-offs.
- **FR-3.4**: PDF export of statutory inspection reports for DGMS record-keeping.

### FR-4: Hazard & Violation Reporting with Real-Time Dispatch
- **FR-4.1**: Multi-severity hazard categorization (`High`, `Medium`, `Low`) based on hazard impact (e.g., elevated gas concentrations, berm height violations, expired fire systems).
- **FR-4.2**: Rapid preset hazard templates for frequent mining issues (PPE Non-Compliance, Ventilation / CO₂ Spike, Blocked Egress, Unguarded Machinery).
- **FR-4.3**: Immediate dispatch workflow: Logging a violation automatically notifies the Mine Manager and relevant section engineer.
- **FR-4.4**: In-system status tracking (`Open` → `In Progress` → `Resolved`) with audit logs.

### FR-5: Corrective & Preventive Action (CAPA) Workflow
- **FR-5.1**: Automatic creation of remediation action items linked directly to inspection failures or logged violations.
- **FR-5.2**: Kanban board and interactive checklist view for tracking tasks by urgency (`Overdue`, `Due Soon`, `On Track`).
- **FR-5.3**: Escalation mechanisms for high-risk actions past statutory deadlines.

### FR-6: AI & Predictive Analytics Engine
- **FR-6.1 (Hazard Forecasting)**: Machine learning models (Random Forest / Gradient Boosting) trained on historical inspection and telemetry data to predict high-risk working sections.
- **FR-6.2 (Anomaly Detection)**: Statistical and unsupervised anomaly detection on environmental telemetry (CH₄, CO, CO₂, air velocity, dust density, temperature).
- **FR-6.3 (Recurring Violation Pattern Recognition)**: NLP / cluster analysis to identify systemic safety bottlenecks across contractor teams or specific machinery models.

### FR-7: Mobile Field Application (Offline-First & Geo-Tagged)
- **FR-7.1**: Geo-fencing & GPS time-stamping for all field inspection entries to prevent proxy reporting.
- **FR-7.2**: Offline-first operational mode with local SQLite/IndexedDB caching for underground pits where wireless networks are absent, with automatic cloud sync on surface reconnection.
- **FR-7.3**: Field device telemetry integration (gas detector calibration records, battery levels).

### FR-8: GIS & Spatial Mine Mapping
- **FR-8.1**: Interactive spatial mapping of surface pits, haul roads, benches, and underground levels.
- **FR-8.2**: Color-coded risk overlay showing live hazards, restricted sectors, and sensor nodes.

### FR-9: OCR & Paperless Document Digitization
- **FR-9.1**: OCR extraction for physical DGMS letters, equipment calibration certificates, and contractor fitness records.
- **FR-9.2**: Searchable centralized document repository with version control and statutory expiration alerts.

### FR-10: Audit Trail & Blockchain-Grade Traceability
- **FR-10.1**: Immutable audit logging of all compliance sign-offs, violation closures, and report submissions to prevent post-incident tampering.

---

## 4. Non-Functional Requirements (NFR)

| ID | Requirement | Target Metric / Specification |
|----|-------------|------------------------------|
| **NFR-1** | **Performance** | Web dashboard initial render `< 1.5s`; API response latency `< 250ms`. |
| **NFR-2** | **Scalability** | Capable of scaling to 8 subsidiaries, 350+ mines, 15,000+ daily field inspections. |
| **NFR-3** | **Availability** | 99.9% uptime for cloud services; 100% availability for offline mobile clients. |
| **NFR-4** | **Data Security** | Encrypted in transit (TLS 1.3) and at rest (AES-256); strict Indian data residency compliance. |
| **NFR-5** | **Offline Sync** | Automatic bidirectional conflict-free sync within 15 seconds of surface network detection. |
| **NFR-6** | **Usability & UX** | High-contrast industrial UI (WCAG 2.1 AA compliant) usable under harsh glare in open pits. |
| **NFR-7** | **Platform Compatibility**| Responsive Web (Chrome, Edge, Firefox), PWA / Android APK for rugged field tablets. |

---

## 5. Technology Stack & Architectural Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (UI/UX)                       │
│  Next.js 16 (App Router) • React 19 • TypeScript • Tailwind CSS 4      │
│  Recharts (Data Visualizations) • Lucide React • Progressive Web App   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST / WebSockets
┌───────────────────────────────────▼────────────────────────────────────┐
│                         APPLICATION SERVICE TIER                       │
│  FastAPI (Python 3.11) • Uvicorn • Pydantic v2 • SQLAlchemy 2.0        │
│  Role-Based Auth (JWT + RBAC) • Automated Email/SMS Notification Engine│
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
┌──────────────────▼───────────────┐ ┌───────────────▼───────────────────┐
│       AI / ANALYTICS ENGINE      │ │       DATA & STORAGE TIER         │
│  Scikit-Learn • Pandas • NumPy   │ │  PostgreSQL (Relational + Audit)  │
│  Tesseract OCR • Predictive Risk │ │  TimescaleDB (Sensor Telemetry)   │
│  Recurring Hazard Cluster Engine │ │  MinIO / S3 (Encrypted Documents) │
└──────────────────────────────────┘ └───────────────────────────────────┘
```
