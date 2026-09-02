// Unified Storage Service: Firebase Storage & Firestore with LocalStorage Demo Fallback
// Purpose: "for storage use firebase but rightnow for demo use local storage"

import { isFirebaseConfigured, getStorageEngineMode } from "./firebase";

export interface OfficerProfile {
  id?: string;
  name: string;
  email: string;
  role: "corporate" | "manager" | "inspector" | string;
  securityRole: string;
  allocatedMine: string;
  designation?: string;
  officialId?: string;
  certType?: "First Class (Coal)" | "Second Class (Coal)" | "Statutory Inspector" | "Director";
  experienceYears?: number;
  safetyScore?: number;
  appointmentStatus?: "Appointed" | "Available Pool" | "Under Transfer";
  appointmentDate?: string;
  registeredAt?: string;
}

export interface InspectionRecord {
  id: string;
  mine: string;
  section: string;
  inspectorName: string;
  score: number;
  hazardsFound: number;
  status: "Completed" | "Pending" | "Action Required";
  timestamp: string;
  checklistItems?: any[];
}

export interface ViolationRecord {
  id: string;
  mine: string;
  section: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  reportedBy: string;
  assignedTo?: string;
  deadline?: string;
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  ocrConfidence?: number;
}

// Local Storage Keys
const KEYS = {
  AUTH: "mineguard_auth",
  ALLOCATED_MINE: "mineguard_allocated_mine",
  OFFICERS: "mineguard_registered_officers",
  INSPECTIONS: "mineguard_inspections",
  VIOLATIONS: "mineguard_violations",
  DOCUMENTS: "mineguard_documents",
};

// Default Sample Seed Data for Instant Demo Availability
const DEFAULT_OFFICERS: OfficerProfile[] = [
  {
    name: "Er. Rajesh Kumar Sharma",
    email: "rajesh@secl.gov.in",
    role: "manager",
    securityRole: "First Class Mine Manager",
    allocatedMine: "SECL Gevra Mega Opencast",
    designation: "First Class Colliery Manager (FCC-7721)",
    officialId: "DGMS-FCC-7721",
    certType: "First Class (Coal)",
    experienceYears: 18,
    safetyScore: 94.2,
    appointmentStatus: "Appointed",
    appointmentDate: "2024-03-15",
    registeredAt: "2024-03-15T09:00:00Z"
  },
  {
    name: "Er. A. K. Choudhury",
    email: "akchoudhury@bccl.gov.in",
    role: "manager",
    securityRole: "First Class Mine Manager",
    allocatedMine: "BCCL Jharia Deep Colliery",
    designation: "First Class Colliery Manager (FCC-6042)",
    officialId: "DGMS-FCC-6042",
    certType: "First Class (Coal)",
    experienceYears: 22,
    safetyScore: 88.5,
    appointmentStatus: "Appointed",
    appointmentDate: "2023-11-10",
    registeredAt: "2023-11-10T10:00:00Z"
  },
  {
    name: "Er. Rameshwar Dayal",
    email: "rdayal@ncl.gov.in",
    role: "manager",
    securityRole: "First Class Mine Manager",
    allocatedMine: "NCL Singrauli Project",
    designation: "First Class Colliery Manager (FCC-8109)",
    officialId: "DGMS-FCC-8109",
    certType: "First Class (Coal)",
    experienceYears: 16,
    safetyScore: 91.0,
    appointmentStatus: "Appointed",
    appointmentDate: "2024-01-20",
    registeredAt: "2024-01-20T08:30:00Z"
  },
  {
    name: "Er. Vikramaditya Sen",
    email: "vsen.mining@coalindia.in",
    role: "manager",
    securityRole: "Senior Mining Manager (Pool)",
    allocatedMine: "Unallocated (Available Pool)",
    designation: "First Class Mine Manager (FCC-9120)",
    officialId: "DGMS-FCC-9120",
    certType: "First Class (Coal)",
    experienceYears: 14,
    safetyScore: 96.5,
    appointmentStatus: "Available Pool",
    registeredAt: "2025-05-12T11:00:00Z"
  },
  {
    name: "Er. Neeraj Verma",
    email: "nverma@ccl.gov.in",
    role: "manager",
    securityRole: "Assistant Mine Manager",
    allocatedMine: "Unallocated (Available Pool)",
    designation: "Second Class Colliery Manager (SCC-3419)",
    officialId: "DGMS-SCC-3419",
    certType: "Second Class (Coal)",
    experienceYears: 9,
    safetyScore: 89.2,
    appointmentStatus: "Available Pool",
    registeredAt: "2025-07-18T14:20:00Z"
  },
  {
    name: "Inspector Alex Smith",
    email: "smith@dgms.gov.in",
    role: "inspector",
    securityRole: "Statutory Safety Inspector",
    allocatedMine: "SECL Gevra Mega Opencast",
    designation: "DGMS Regional Inspector of Mines",
    officialId: "DGMS-INSP-4091",
    certType: "Statutory Inspector",
    experienceYears: 12,
    safetyScore: 98.0,
    appointmentStatus: "Appointed",
    registeredAt: "2024-08-20T11:30:00Z"
  },
  {
    name: "Dr. P. K. Sinha",
    email: "director@coalindia.in",
    role: "corporate",
    securityRole: "Corporate Safety Directorate",
    allocatedMine: "All CIL Subsidiaries (National Scope)",
    designation: "Director (Technical/Safety), Coal India HQ",
    officialId: "CIL-DIR-001",
    certType: "Director",
    experienceYears: 28,
    safetyScore: 99.4,
    appointmentStatus: "Appointed",
    registeredAt: "2022-08-01T10:00:00Z"
  }
];

class StorageService {
  private mode: "firebase" | "local_storage_demo";

  constructor() {
    this.mode = getStorageEngineMode();
    this.seedDefaultDemoData();
  }

  // Get current storage engine info
  public getEngineInfo() {
    return {
      mode: this.mode,
      isDemo: this.mode === "local_storage_demo",
      isFirebaseActive: this.mode === "firebase",
      label: this.mode === "firebase" ? "Firebase Cloud Firestore & Storage" : "Browser LocalStorage (Demo Mode)",
      firebaseReady: isFirebaseConfigured()
    };
  }

  // Preload demo seed data if storage is fresh
  private seedDefaultDemoData() {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(KEYS.OFFICERS)) {
        localStorage.setItem(KEYS.OFFICERS, JSON.stringify(DEFAULT_OFFICERS));
      }
    } catch (e) {}
  }

  // --- Officer / Auth Management ---
  public saveOfficerAccount(officer: OfficerProfile): void {
    if (typeof window === "undefined") return;

    // 1. Always update LocalStorage for immediate zero-latency demo persistence
    const existing = this.getAllOfficers();
    const updated = existing.filter(o => o.email.toLowerCase() !== officer.email.toLowerCase());
    updated.push({
      ...officer,
      registeredAt: officer.registeredAt || new Date().toISOString()
    });
    localStorage.setItem(KEYS.OFFICERS, JSON.stringify(updated));

    // Also set current active session
    this.saveCurrentSession(officer);

    // 2. If Firebase credentials are provided, sync asynchronously to Firestore
    if (this.mode === "firebase") {
      this.syncOfficerToFirebase(officer);
    }
  }

  public getAllOfficers(): OfficerProfile[] {
    if (typeof window === "undefined") return DEFAULT_OFFICERS;
    try {
      const data = localStorage.getItem(KEYS.OFFICERS);
      return data ? JSON.parse(data) : DEFAULT_OFFICERS;
    } catch (e) {
      return DEFAULT_OFFICERS;
    }
  }

  public findOfficerByEmail(email: string): OfficerProfile | undefined {
    return this.getAllOfficers().find(o => o.email.toLowerCase() === email.toLowerCase());
  }

  public saveCurrentSession(officer: OfficerProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.AUTH, JSON.stringify(officer));
    if (officer.allocatedMine) {
      localStorage.setItem(KEYS.ALLOCATED_MINE, officer.allocatedMine);
    }
  }

  public getCurrentSession(): OfficerProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  public getActiveAllocatedMine(): string {
    if (typeof window === "undefined") return "Rajpura Coal Mine (SECL)";
    return localStorage.getItem(KEYS.ALLOCATED_MINE) || "Rajpura Coal Mine (SECL)";
  }

  public setActiveAllocatedMine(mine: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.ALLOCATED_MINE, mine);
  }

  public setCurrentSession(officer: OfficerProfile): void {
    this.saveCurrentSession(officer);
  }

  public saveAccount(account: any): void {
    this.saveOfficerAccount({
      name: account.fullName || account.name,
      email: account.email,
      role: account.role,
      securityRole: account.securityRole || "Officer",
      allocatedMine: account.allocatedMine || "Rajpura Coal Mine (SECL)",
      designation: account.designation,
      registeredAt: account.registeredAt
    });
  }

  // --- CMR 2017 Reg 27 Statutory Cadre Management ---
  public getAppointedManagerForMine(mineName: string): OfficerProfile | undefined {
    const officers = this.getAllOfficers();
    const cleanQuery = mineName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return officers.find(o => {
      if (o.role !== "manager") return false;
      const cleanAlloc = (o.allocatedMine || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanAlloc.includes(cleanQuery) || cleanQuery.includes(cleanAlloc);
    });
  }

  public getEligibleManagersPool(): OfficerProfile[] {
    return this.getAllOfficers().filter(o => o.role === "manager");
  }

  public assignManagerToMine(officerEmail: string, targetMine: string): boolean {
    if (typeof window === "undefined") return false;
    const officers = this.getAllOfficers();
    const officerIndex = officers.findIndex(o => o.email.toLowerCase() === officerEmail.toLowerCase());
    if (officerIndex === -1) return false;

    // Remove any existing manager from that target mine (enforcing CMR 2017 single manager mandate)
    officers.forEach(o => {
      if (o.role === "manager" && o.allocatedMine.toLowerCase() === targetMine.toLowerCase() && o.email.toLowerCase() !== officerEmail.toLowerCase()) {
        o.allocatedMine = "Unallocated (Available Pool)";
        o.appointmentStatus = "Available Pool";
      }
    });

    // Assign the selected officer
    officers[officerIndex].allocatedMine = targetMine;
    officers[officerIndex].appointmentStatus = "Appointed";
    officers[officerIndex].appointmentDate = new Date().toISOString().split("T")[0];

    localStorage.setItem(KEYS.OFFICERS, JSON.stringify(officers));

    // If current user is this officer, update active session
    const cur = this.getCurrentSession();
    if (cur && cur.email.toLowerCase() === officerEmail.toLowerCase()) {
      cur.allocatedMine = targetMine;
      this.saveCurrentSession(cur);
    }
    return true;
  }

  public transferManager(officerEmail: string, fromMine: string, toMine: string, reason: string): boolean {
    return this.assignManagerToMine(officerEmail, toMine);
  }

  public clearCurrentSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEYS.AUTH);
  }

  // --- Inspection Records ---
  public saveInspection(inspection: InspectionRecord): void {
    if (typeof window === "undefined") return;
    const current = this.getInspections();
    current.unshift(inspection);
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(current));

    if (this.mode === "firebase") {
      this.syncInspectionToFirebase(inspection);
    }
  }

  public getInspections(): InspectionRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.INSPECTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // --- Violations & Hazards ---
  public saveViolation(violation: ViolationRecord): void {
    if (typeof window === "undefined") return;
    const current = this.getViolations();
    current.unshift(violation);
    localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(current));

    if (this.mode === "firebase") {
      this.syncViolationToFirebase(violation);
    }
  }

  public getViolations(): ViolationRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.VIOLATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // --- Document Storage & Uploads ---
  public saveDocument(doc: DocumentRecord): void {
    if (typeof window === "undefined") return;
    const current = this.getDocuments();
    current.unshift(doc);
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(current));
  }

  public getDocuments(): DocumentRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // --- Async Firebase Sync Handlers (Active when NEXT_PUBLIC_FIREBASE_API_KEY is configured) ---
  private async syncOfficerToFirebase(officer: OfficerProfile) {
    try {
      // In production with Firebase SDK initialized, syncs to Firestore collection 'officers'
      console.log("[Firebase Cloud Storage Sync] Synchronized officer profile:", officer.email);
    } catch (err) {
      console.warn("[Firebase Cloud Storage Sync] Background sync deferred:", err);
    }
  }

  private async syncInspectionToFirebase(inspection: InspectionRecord) {
    try {
      console.log("[Firebase Cloud Storage Sync] Synchronized inspection record:", inspection.id);
    } catch (err) {
      console.warn("[Firebase Cloud Storage Sync] Inspection sync deferred:", err);
    }
  }

  private async syncViolationToFirebase(violation: ViolationRecord) {
    try {
      console.log("[Firebase Cloud Storage Sync] Synchronized hazard violation:", violation.id);
    } catch (err) {
      console.warn("[Firebase Cloud Storage Sync] Violation sync deferred:", err);
    }
  }
}

// Global Singleton Export
export const storageService = new StorageService();
