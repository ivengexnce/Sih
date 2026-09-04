# MineGuard - DGMS-Compliant Mine Safety & Compliance Management System

MineGuard is a comprehensive, production-grade enterprise safety management ecosystem designed for Coal Mines & Mining Conglomerates in compliance with **DGMS (Directorate General of Mines Safety)** regulations and **CMR 2017 (Coal Mines Regulations)**. 

The platform connects **Mine Managers**, **Statutory Safety Inspectors**, and **Corporate Administrators** across web and mobile platforms with offline-first capabilities, real-time sync, AI/ML risk analytics, and statutory compliance digitizers.

---

## 🚀 Key Modules & System Architecture

```
                      ┌─────────────────────────────────────────┐
                      │    Corporate Admin Web Portal           │
                      │  (Executive Oversight & Cadre Sync)    │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             Mine Manager Web Dashboard                               │
│  ┌───────────────────────┬───────────────────────┬───────────────────────────────┐  │
│  │ Overviews & Analytics │ Inspections & CAPA    │ OCR Circular Digitizer        │  │
│  │ (Live Sensor Stream)  │ (Actions & Roster)    │ (Mandate Extraction)          │  │
│  └───────────────────────┴───────────────────────┴───────────────────────────────┘  │
└──────────────────────────────────────────▲──────────────────────────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    MineGuard Mobile App (Expo/RN)       │
                      │  (Offline Field Inspections & GPS Sync) │
                      └─────────────────────────────────────────┘
```

---

## 🌟 Major Implemented Features & Technical Work Done

### 1. 🛡️ Mine Manager Portal (`src/app/mine-manager`)
- **Corrective Actions & CAPA Workflow**: 
  - Kanban board (`Overdue`, `Due Soon`, `On Track`) with strict status persistence in `localStorage` (`mineguard_custom_actions`).
  - Seamless action creation with direct assignment to statutory colliery engineers (`Er. R. Sharma`, `Er. P. Gupta`, `Er. S. Mehta`, `Er. K. Patel`).
- **Personnel & Crew Roster Linkage** (`/mine-manager/team`):
  - Dynamic aggregation of assigned CAPA actions per engineer.
  - Detailed Officer Dossier modal featuring **Assigned CAPA Safety Actions** breakdown, DGMS certification credentials, and PME medical fitness records.
- **Responsive Inspection Tables**:
  - Horizontal scrolling layout (`overflowX: auto`) for *Recent Statutory Inspections* ensuring full data visibility across desktop, tablet, and mobile browsers without content truncation.
- **OCR Statutory Digitizer** (`/mine-manager/ocr-digitizer`):
  - Parses DGMS gazette circulars into structured compliance mandates and injects them directly into the CAPA Action queue.

### 2. 📱 MineGuard Mobile App (`MineGuard/`)
- **Offline-First Field Inspection Engine**:
  - Full support for logging inspections in remote/offline underground mine areas.
  - Inspection submission queue (`mineguard_offline_queue`) with automatic background sync when network connectivity is restored.
  - Dynamic status indicator ("Synced to Cloud" vs "Pending Sync").
- **GPS Location & Telemetry System**:
  - Real-time GPS coordinate fetching (`location.tsx`) using Expo Location APIs with graceful web preview fallbacks.

### 3. ⚖️ Inspector Portal (`src/app/inspector`)
- **Interactive Inspection Task Status Toggle**:
  - In-place status dropdown on the Inspector dashboard (`/inspector/inspections`) enabling inspectors to toggle inspection task statuses between `Pending` and `Completed` in real time.

### 4. 🏢 Corporate Admin Dashboard (`src/app/corporate-admin`)
- **Real-Time Violation & Cadre Sync**:
  - Synchronized state management via `storageService` so violations reported by Mine Managers reflect immediately on the Corporate Admin overview.
  - Synchronized Manager Cadre roster (`/corporate-admin/manager-assignment`) displaying appointed statutory heads.

### 5. ⚡ Performance & Browser Resilience
- **Global AbortError Handling**:
  - Managed in `ClientProviders.tsx` with a capture-phase `unhandledrejection` handler to cleanly ignore canceled fetch requests during rapid route changes.
- **Next.js Router Compatibility**:
  - Added `data-scroll-behavior="smooth"` attribute to the root `<html>` element to maintain smooth scrolling without Next.js navigation warnings.

---

## 🛠️ Tech Stack

- **Web Frontend Framework**: Next.js 14 (App Router, React 18, TypeScript)
- **Mobile Framework**: React Native (Expo SDK, React Navigation)
- **Styling**: Vanilla CSS & Tailwind CSS (Design Tokens, Glassmorphism, Micro-animations)
- **Icons**: Lucide React / Lucide React Native
- **Charts & Visualizations**: Recharts
- **Internationalization (i18n)**: Custom translation context with multi-language AI auto-translation support

---

## ⚙️ Getting Started

### Web Application (Next.js)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mobile Application (Expo React Native)

1. Navigate to the mobile project directory:
   ```bash
   cd MineGuard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 📄 License & Compliance

MineGuard is built to meet **DGMS (Directorate General of Mines Safety)** compliance guidelines under the **Coal Mines Regulations (CMR) 2017**.
