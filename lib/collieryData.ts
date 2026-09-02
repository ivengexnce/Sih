// Colliery Data Engine: Dynamic, Real-World Data Store for CIL Mines
// Ensures the Mine Manager sees EVERYTHING related to their allocated colliery.

export interface WorkingSection {
  name: string;
  depth: string;
  status: "Active" | "Restricted" | "Maintenance";
  workers: number;
  risk: "High" | "Medium" | "Low";
  compliance: number;
  lastInspected: string;
  hazards: string[];
  supervisor: string;
  ch4?: number;
  co?: number;
  ventilation?: number;
}

export interface CollieryProfile {
  id: string;
  name: string;
  cleanName: string;
  subsidiary: string;
  state: string;
  coalfield: string;
  type: "Opencast" | "Underground" | "Underground + Opencast";
  lat: number;
  lng: number;
  seamDepthM: number;
  capacityMtpa: number;
  manpower: number;
  gassiness: "Degree I" | "Degree II" | "Degree III";
  statutoryStatus?: "Appointed" | "Vacant" | "Temporary Transfer";
  statutoryManagerName?: string;
  statutoryManagerCert?: string;
  requiredCert?: string;
  workmenInspectorsCount?: number;
  complianceScore: number;
  openViolations: number;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  failureProb72h: number;
  ch4Current: number;
  coCurrent: number;
  ventilationVelocity: number;
  activeEquipment: number;
  totalEquipment: number;
  sections: WorkingSection[];
  inspections: Array<{
    id: string;
    area: string;
    date: string;
    time: string;
    status: "Compliant" | "Non-Compliant" | "Partial";
    inspector: string;
    score: number;
  }>;
  violations: Array<{
    id: string;
    title: string;
    section: string;
    severity: "High" | "Medium" | "Low";
    reportedDate: string;
    deadline: string;
    assignedTo: string;
    status: "Open" | "In Progress" | "Resolved";
  }>;
  equipment: Array<{
    id: string;
    name: string;
    type: string;
    section: string;
    status: "Operational" | "Maintenance Due" | "Critical";
    healthScore: number;
  }>;
  team: Array<{
    name: string;
    role: string;
    contact: string;
    shift: string;
  }>;
}

export const COLLIERY_DATABASE: Record<string, CollieryProfile> = {
  gevra: {
    id: "MINE-01",
    name: "SECL Gevra Mega Opencast",
    cleanName: "Gevra Mega Opencast Project",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Korba Coalfield",
    type: "Opencast",
    lat: 22.3486,
    lng: 82.5935,
    seamDepthM: 120,
    capacityMtpa: 52.5,
    manpower: 3850,
    gassiness: "Degree I",
    complianceScore: 94.2,
    openViolations: 3,
    riskLevel: "Low",
    riskScore: 16.4,
    failureProb72h: 3.8,
    ch4Current: 0.12,
    coCurrent: 8,
    ventilationVelocity: 3.2,
    activeEquipment: 142,
    totalEquipment: 150,
    sections: [
      { name: "West Cut Mega Pit Face", depth: "0–85m", status: "Active", workers: 84, risk: "Low", compliance: 95, lastInspected: "Today, 07:30", hazards: ["Heavy Dumper Traffic"], supervisor: "Kamlesh Patel", ch4: 0.08, co: 6, ventilation: 3.4 },
      { name: "East Overburden Bench 4", depth: "0–45m", status: "Active", workers: 62, risk: "Low", compliance: 92, lastInspected: "Yesterday", hazards: ["Bench Stability"], supervisor: "Anil Singh", ch4: 0.10, co: 8, ventilation: 3.1 },
      { name: "Primary In-Pit Crusher 1", depth: "Surface", status: "Active", workers: 28, risk: "Medium", compliance: 89, lastInspected: "May 19", hazards: ["Rotating Gear", "Dust"], supervisor: "Vijay Nair", ch4: 0.12, co: 12, ventilation: 2.8 },
      { name: "Overland Conveyor Line A", depth: "Surface", status: "Active", workers: 18, risk: "Low", compliance: 96, lastInspected: "May 18", hazards: ["High-speed Belt"], supervisor: "Deepak Kumar", ch4: 0.05, co: 4, ventilation: 3.8 },
      { name: "Heavy Mining Machinery Workshop", depth: "Surface", status: "Active", workers: 45, risk: "Low", compliance: 94, lastInspected: "May 17", hazards: ["Welding Fumes", "Hydraulic Pressure"], supervisor: "S. K. Verma", ch4: 0.02, co: 5, ventilation: 4.2 },
      { name: "Silo Rail-Loading Complex", depth: "Surface", status: "Active", workers: 22, risk: "Low", compliance: 97, lastInspected: "May 19", hazards: ["Locomotive Movement"], supervisor: "P. R. Rao", ch4: 0.04, co: 4, ventilation: 3.5 },
      { name: "Blasting Perimeter South", depth: "0–60m", status: "Restricted", workers: 6, risk: "High", compliance: 86, lastInspected: "Today, 06:00", hazards: ["Pre-split Explosives Handling", "Flying Shrapnel Risk"], supervisor: "Deepak Kumar", ch4: 0.18, co: 14, ventilation: 2.2 },
      { name: "Central Explosives Magazine", depth: "Surface", status: "Active", workers: 8, risk: "High", compliance: 98, lastInspected: "May 19", hazards: ["Statutory DGMS Storage Strict Area"], supervisor: "Er. Rajesh Sharma", ch4: 0.01, co: 2, ventilation: 4.5 }
    ],
    inspections: [
      { id: "INSP-GV-01", area: "West Cut Mega Pit Face", date: "Today", time: "07:30 AM", status: "Compliant", inspector: "DGMS Regional Inspector", score: 96 },
      { id: "INSP-GV-02", area: "Blasting Perimeter South", date: "Yesterday", time: "02:15 PM", status: "Compliant", inspector: "Colliery Safety Officer", score: 91 },
      { id: "INSP-GV-03", area: "Heavy Machinery Workshop", date: "May 18", time: "11:00 AM", status: "Compliant", inspector: "Internal Safety Steward", score: 94 },
      { id: "INSP-GV-04", area: "In-Pit Crusher 1", date: "May 17", time: "04:30 PM", status: "Partial", inspector: "Environmental Officer", score: 84 }
    ],
    violations: [
      { id: "VIO-GV-101", title: "Water Sprinkler Pressure Drop at Transfer Point 3", section: "In-Pit Crusher 1", severity: "Medium", reportedDate: "May 18", deadline: "May 22", assignedTo: "Vijay Nair", status: "In Progress" },
      { id: "VIO-GV-102", title: "Reflective Tail Tape Missing on Dumper D-88", section: "West Cut Mega Pit Face", severity: "Low", reportedDate: "May 17", deadline: "May 20", assignedTo: "Kamlesh Patel", status: "Open" },
      { id: "VIO-GV-103", title: "Overdue Fire Extinguisher Refill at Workshop Bay 4", section: "Heavy Mining Machinery Workshop", severity: "Low", reportedDate: "May 15", deadline: "May 21", assignedTo: "S. K. Verma", status: "Open" }
    ],
    equipment: [
      { id: "EQ-GV-01", name: "P&H 4100XPC Electric Rope Shovel", type: "Heavy Shovel", section: "West Cut Mega Pit Face", status: "Operational", healthScore: 98 },
      { id: "EQ-GV-02", name: "CAT 793F 240-Ton Dumper Fleet (x14)", type: "Haulage Truck", section: "West Cut Mega Pit Face", status: "Operational", healthScore: 94 },
      { id: "EQ-GV-03", name: "Marion 8050 Dragline 'Shakti'", type: "Dragline", section: "East Overburden Bench 4", status: "Operational", healthScore: 92 },
      { id: "EQ-GV-04", name: "MMD 1300 Series Sizer In-Pit Crusher", type: "Crushing Plant", section: "In-Pit Crusher 1", status: "Maintenance Due", healthScore: 82 }
    ],
    team: [
      { name: "Er. Rajesh Kumar Sharma", role: "First Class Mine Manager (Statutory Head)", contact: "+91 94252 88120", shift: "General Shift" },
      { name: "Deepak Kumar", role: "Safety Officer & CMR Blasting Overman", contact: "+91 94252 88124", shift: "Shift A (06:00–14:00)" },
      { name: "Kamlesh Patel", role: "Pit In-Charge (West Cut)", contact: "+91 94252 88128", shift: "Shift B (14:00–22:00)" },
      { name: "Vijay Nair", role: "Mechanical Engineer & CHP Head", contact: "+91 94252 88132", shift: "General Shift" }
    ]
  },

  jharia: {
    id: "MINE-03",
    name: "BCCL Jharia Deep Colliery",
    cleanName: "Jharia Deep Underground Colliery",
    subsidiary: "BCCL",
    state: "Jharkhand",
    coalfield: "Jharia Coalfield",
    type: "Underground",
    lat: 23.7420,
    lng: 86.4110,
    seamDepthM: 380,
    capacityMtpa: 4.2,
    manpower: 2140,
    gassiness: "Degree III",
    complianceScore: 82.4,
    openViolations: 8,
    riskLevel: "High",
    riskScore: 78.6,
    failureProb72h: 24.5,
    ch4Current: 1.35,
    coCurrent: 44,
    ventilationVelocity: 0.95,
    activeEquipment: 48,
    totalEquipment: 58,
    sections: [
      { name: "Seam 16 Heading North", depth: "340–380m", status: "Restricted", workers: 24, risk: "High", compliance: 68, lastInspected: "Today, 04:00", hazards: ["Degree III Gassy Face", "CH₄ 1.35%", "Spontaneous Heating"], supervisor: "S. N. Murthy", ch4: 1.35, co: 44, ventilation: 0.85 },
      { name: "Longwall Mechanized Face 2", depth: "310–350m", status: "Active", workers: 42, risk: "High", compliance: 78, lastInspected: "Yesterday", hazards: ["Roof Strata Pressure", "Gas Desorption"], supervisor: "B. K. Pandey", ch4: 0.95, co: 26, ventilation: 1.15 },
      { name: "Underground Level 2 Incline", depth: "220–290m", status: "Active", workers: 36, risk: "Medium", compliance: 84, lastInspected: "May 18", hazards: ["Haulage Rope Tension", "Dust"], supervisor: "R. C. Mandal", ch4: 0.62, co: 18, ventilation: 1.45 },
      { name: "Return Airway Fan Drift", depth: "Surface–380m", status: "Active", workers: 12, risk: "High", compliance: 80, lastInspected: "Today, 06:30", hazards: ["Vitiated Air Extraction", "CO Accretion"], supervisor: "Anil Singh", ch4: 1.10, co: 38, ventilation: 2.80 },
      { name: "Shaft 2 Cage Landing & Sump", depth: "380m", status: "Active", workers: 18, risk: "Medium", compliance: 85, lastInspected: "May 17", hazards: ["Water Inrush Hazard", "Winding Cage"], supervisor: "Deepak Kumar", ch4: 0.40, co: 12, ventilation: 1.80 },
      { name: "Methane Drainage Plant Surface", depth: "Surface", status: "Active", workers: 14, risk: "Medium", compliance: 92, lastInspected: "May 19", hazards: ["High-Pressure Flammable Gas Extraction"], supervisor: "Dr. K. Das", ch4: 0.05, co: 4, ventilation: 3.50 },
      { name: "Underground Substation 3.3kV", depth: "310m", status: "Active", workers: 6, risk: "High", compliance: 75, lastInspected: "May 16", hazards: ["Flameproof Enclosure FLP Integrity"], supervisor: "P. Mukherjee", ch4: 0.55, co: 15, ventilation: 1.20 }
    ],
    inspections: [
      { id: "INSP-JH-01", area: "Seam 16 Heading North", date: "Today", time: "04:30 AM", status: "Non-Compliant", inspector: "DGMS Joint Director (Safety)", score: 68 },
      { id: "INSP-JH-02", area: "Return Airway Fan Drift", date: "Yesterday", time: "06:15 PM", status: "Partial", inspector: "Ventilation Officer", score: 76 },
      { id: "INSP-JH-03", area: "Longwall Mechanized Face 2", date: "May 18", time: "10:00 AM", status: "Compliant", inspector: "Internal Audit Team", score: 85 }
    ],
    violations: [
      { id: "VIO-JH-201", title: "CH₄ Methane Exceeds 1.25% Threshold at Seam 16 Return", section: "Seam 16 Heading North", severity: "High", reportedDate: "Today", deadline: "Immediate 24h", assignedTo: "S. N. Murthy", status: "Open" },
      { id: "VIO-JH-202", title: "Carbon Monoxide Rising (44 ppm) - Spontaneous Combustion Alert", section: "Seam 16 Heading North", severity: "High", reportedDate: "Today", deadline: "Immediate 12h", assignedTo: "S. N. Murthy", status: "Open" },
      { id: "VIO-JH-203", title: "Auxiliary Ventilation Fan Air-Duct Leakage at Heading 3", section: "Longwall Mechanized Face 2", severity: "Medium", reportedDate: "Yesterday", deadline: "May 21", assignedTo: "B. K. Pandey", status: "In Progress" },
      { id: "VIO-JH-204", title: "FLP Gasket Integrity Degraded on 3.3kV Gate End Box", section: "Underground Substation 3.3kV", severity: "High", reportedDate: "May 17", deadline: "May 20", assignedTo: "P. Mukherjee", status: "Open" }
    ],
    equipment: [
      { id: "EQ-JH-01", name: "Joy 7LS Shearer Longwall System", type: "Longwall Shearer", section: "Longwall Mechanized Face 2", status: "Operational", healthScore: 88 },
      { id: "EQ-JH-02", name: "Howden Main Surface Ventilation Fan 350kW", type: "Main Exhaust Fan", section: "Return Airway Fan Drift", status: "Operational", healthScore: 92 },
      { id: "EQ-JH-03", name: "Methane Suction Vacuum Drainage Pumps", type: "Degasification Plant", section: "Methane Drainage Plant Surface", status: "Operational", healthScore: 95 },
      { id: "EQ-JH-04", name: "Flameproof 300kW Auxiliary Booster Fan", type: "Auxiliary Fan", section: "Seam 16 Heading North", status: "Critical", healthScore: 64 }
    ],
    team: [
      { name: "Er. A. K. Choudhury", role: "First Class Mine Manager (Statutory Head)", contact: "+91 94311 44520", shift: "General Shift" },
      { name: "S. N. Murthy", role: "Statutory Ventilation Officer (CMR Reg 29)", contact: "+91 94311 44524", shift: "Shift A (06:00–14:00)" },
      { name: "B. K. Pandey", role: "Underground Safety Officer", contact: "+91 94311 44528", shift: "Shift B (14:00–22:00)" },
      { name: "P. Mukherjee", role: "Chief Colliery Electrical Engineer", contact: "+91 94311 44532", shift: "General Shift" }
    ]
  },

  singrauli: {
    id: "MINE-05",
    name: "NCL Singrauli Project",
    cleanName: "Jayant & Nigahi Mega Complex (NCL)",
    subsidiary: "NCL",
    state: "Madhya Pradesh",
    coalfield: "Singrauli Coalfield",
    type: "Opencast",
    lat: 24.1130,
    lng: 82.6710,
    seamDepthM: 165,
    capacityMtpa: 25.0,
    manpower: 2900,
    gassiness: "Degree I",
    complianceScore: 93.0,
    openViolations: 4,
    riskLevel: "Low",
    riskScore: 18.2,
    failureProb72h: 4.5,
    ch4Current: 0.10,
    coCurrent: 9,
    ventilationVelocity: 3.5,
    activeEquipment: 110,
    totalEquipment: 118,
    sections: [
      { name: "North-West Quarry Pit Face", depth: "0–110m", status: "Active", workers: 72, risk: "Low", compliance: 94, lastInspected: "Today, 08:00", hazards: ["Deep Cut Haul Road"], supervisor: "R. S. Chauhan", ch4: 0.08, co: 7, ventilation: 3.6 },
      { name: "Central Turra Coal Seam", depth: "40–90m", status: "Active", workers: 58, risk: "Low", compliance: 92, lastInspected: "Yesterday", hazards: ["Excavator Bench"], supervisor: "M. P. Yadav", ch4: 0.10, co: 9, ventilation: 3.4 },
      { name: "Dragline Stripping Cut 3", depth: "0–65m", status: "Active", workers: 32, risk: "Medium", compliance: 90, lastInspected: "May 18", hazards: ["Heavy Bucket Swing"], supervisor: "Deepak Kumar", ch4: 0.11, co: 10, ventilation: 3.2 },
      { name: "Overland Belt Conveyor to NTPC", depth: "Surface", status: "Active", workers: 16, risk: "Low", compliance: 96, lastInspected: "May 19", hazards: ["Rapid Coal Feed"], supervisor: "Vijay Nair", ch4: 0.05, co: 5, ventilation: 3.8 },
      { name: "Central Haul Truck Workshop", depth: "Surface", status: "Active", workers: 40, risk: "Low", compliance: 95, lastInspected: "May 17", hazards: ["Tire Handling"], supervisor: "Anil Singh", ch4: 0.02, co: 4, ventilation: 4.0 }
    ],
    inspections: [
      { id: "INSP-SG-01", area: "North-West Quarry Pit Face", date: "Today", time: "08:15 AM", status: "Compliant", inspector: "NCL Safety Directorate", score: 95 },
      { id: "INSP-SG-02", area: "Dragline Stripping Cut 3", date: "May 18", time: "03:00 PM", status: "Compliant", inspector: "Internal Safety Overman", score: 91 }
    ],
    violations: [
      { id: "VIO-SG-301", title: "Haul Road Berm Height Less than 2m along Chute 4", section: "North-West Quarry Pit Face", severity: "Medium", reportedDate: "May 17", deadline: "May 21", assignedTo: "R. S. Chauhan", status: "In Progress" },
      { id: "VIO-SG-302", title: "Dust Suppression Cannon Nozzle Clogged", section: "Central Turra Coal Seam", severity: "Low", reportedDate: "May 16", deadline: "May 20", assignedTo: "M. P. Yadav", status: "Open" }
    ],
    equipment: [
      { id: "EQ-SG-01", name: "Bucyrus-Erie 2570 Dragline", type: "Mega Dragline", section: "Dragline Stripping Cut 3", status: "Operational", healthScore: 96 },
      { id: "EQ-SG-02", name: "Komatsu HD785 100-Ton Hauler (x22)", type: "Haulage Truck", section: "North-West Quarry Pit Face", status: "Operational", healthScore: 93 }
    ],
    team: [
      { name: "Er. Rameshwar Dayal", role: "First Class Mine Manager (Statutory Head)", contact: "+91 94251 77201", shift: "General Shift" },
      { name: "R. S. Chauhan", role: "Mining Superintendent", contact: "+91 94251 77205", shift: "Shift A" }
    ]
  },

  rajpura: {
    id: "MINE-04",
    name: "Rajpura Coal Mine (SECL)",
    cleanName: "Rajpura Model Colliery (SECL)",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Bisrampur Coalfield",
    type: "Underground + Opencast",
    lat: 23.2840,
    lng: 83.1520,
    seamDepthM: 185,
    capacityMtpa: 12.0,
    manpower: 1450,
    gassiness: "Degree II",
    complianceScore: 88.0,
    openViolations: 6,
    riskLevel: "Medium",
    riskScore: 24.8,
    failureProb72h: 8.2,
    ch4Current: 0.45,
    coCurrent: 18,
    ventilationVelocity: 1.8,
    activeEquipment: 64,
    totalEquipment: 72,
    sections: [
      { name: "Pit Area – Section A", depth: "0–45m", status: "Active", workers: 48, risk: "High", compliance: 82, lastInspected: "Today, 08:30", hazards: ["Blasting zone", "Heavy machinery"], supervisor: "Deepak Kumar", ch4: 0.22, co: 12, ventilation: 2.1 },
      { name: "Pit Area – Section B", depth: "0–38m", status: "Active", workers: 35, risk: "Medium", compliance: 88, lastInspected: "May 17", hazards: ["Dust exposure"], supervisor: "Vijay Nair", ch4: 0.18, co: 10, ventilation: 2.4 },
      { name: "Underground Level 1", depth: "50–110m", status: "Active", workers: 62, risk: "Medium", compliance: 85, lastInspected: "May 18", hazards: ["Roof fall risk", "Limited egress"], supervisor: "Anil Singh", ch4: 0.42, co: 16, ventilation: 1.8 },
      { name: "Underground Level 2", depth: "115–200m", status: "Active", workers: 54, risk: "High", compliance: 74, lastInspected: "May 16", hazards: ["CO₂ levels elevated", "Poor ventilation"], supervisor: "Deepak Kumar", ch4: 0.65, co: 24, ventilation: 1.2 },
      { name: "Underground Level 3", depth: "210–310m", status: "Restricted", workers: 8, risk: "High", compliance: 58, lastInspected: "May 17", hazards: ["CO 42 ppm", "CH₄ 0.85%", "Secondary exit repair"], supervisor: "S. N. Murthy", ch4: 0.85, co: 42, ventilation: 0.9 },
      { name: "Crusher Plant", depth: "Surface", status: "Active", workers: 22, risk: "Medium", compliance: 79, lastInspected: "May 15", hazards: ["Rotating machinery", "Noise"], supervisor: "Kamlesh Patel", ch4: 0.08, co: 8, ventilation: 3.2 },
      { name: "Coal Handling Plant", depth: "Surface", status: "Active", workers: 18, risk: "Low", compliance: 91, lastInspected: "May 14", hazards: ["Dust"], supervisor: "Kamlesh Patel", ch4: 0.04, co: 5, ventilation: 3.5 },
      { name: "Workshop – Bay 1 & 2", depth: "Surface", status: "Active", workers: 14, risk: "Low", compliance: 93, lastInspected: "May 13", hazards: ["Welding fumes"], supervisor: "Anil Singh", ch4: 0.02, co: 4, ventilation: 4.1 },
      { name: "Workshop – Bay 3", depth: "Surface", status: "Restricted", workers: 0, risk: "High", compliance: 45, lastInspected: "May 19", hazards: ["Fire safety fail", "Blocked exit"], supervisor: "Vijay Nair", ch4: 0.01, co: 3, ventilation: 3.8 },
      { name: "Explosives Magazine", depth: "Surface", status: "Active", workers: 6, risk: "High", compliance: 88, lastInspected: "May 17", hazards: ["Explosives handling"], supervisor: "Er. Rajesh Sharma", ch4: 0.01, co: 2, ventilation: 4.5 }
    ],
    inspections: [
      { id: "INSP-RP-01", area: "Pit Area – Section A", date: "Today", time: "10:15 AM", status: "Compliant", inspector: "Inspector Smith", score: 86 },
      { id: "INSP-RP-02", area: "Workshop – Bay 3", date: "May 19", time: "09:31 AM", status: "Non-Compliant", inspector: "Inspector Smith", score: 45 },
      { id: "INSP-RP-03", area: "Coal Handling Plant", date: "May 18", time: "05:45 PM", status: "Compliant", inspector: "Colliery Internal Steward", score: 91 },
      { id: "INSP-RP-04", area: "Underground Level 2", date: "May 18", time: "03:08 PM", status: "Partial", inspector: "Inspector Smith", score: 74 }
    ],
    violations: [
      { id: "VIO-RP-01", title: "Fire Safety Equipment Overdue at Workshop Bay 3", section: "Workshop – Bay 3", severity: "High", reportedDate: "May 19", deadline: "May 22", assignedTo: "Anil Singh", status: "Open" },
      { id: "VIO-RP-02", title: "Ventilation Velocity Below Statutory Minimum at Level 3", section: "Underground Level 3", severity: "High", reportedDate: "May 17", deadline: "May 20", assignedTo: "Deepak Kumar", status: "Open" },
      { id: "VIO-RP-03", title: "Missing Guard Rails along Conveyor B Chute", section: "Crusher Plant", severity: "Medium", reportedDate: "May 15", deadline: "May 23", assignedTo: "Kamlesh Patel", status: "In Progress" }
    ],
    equipment: [
      { id: "EQ-RP-01", name: "Joy 12CM12 Continuous Miner", type: "Continuous Miner", section: "Underground Level 1", status: "Operational", healthScore: 91 },
      { id: "EQ-RP-02", name: "Main Ventilation Exhaust Fan 250kW", type: "Ventilation Fan", section: "Underground Level 2", status: "Maintenance Due", healthScore: 78 },
      { id: "EQ-RP-03", name: "CAT 777D 100-Ton Hauler", type: "Haulage Truck", section: "Pit Area – Section A", status: "Operational", healthScore: 89 }
    ],
    team: [
      { name: "Er. Rajesh Sharma", role: "First Class Mine Manager (Statutory Head)", contact: "+91 98261 55001", shift: "General Shift" },
      { name: "Deepak Kumar", role: "Safety Officer", contact: "+91 98261 55004", shift: "Shift A" },
      { name: "Vijay Nair", role: "Mechanical Engineer", contact: "+91 98261 55008", shift: "Shift B" },
      { name: "Anil Singh", role: "Overman", contact: "+91 98261 55012", shift: "Shift C" }
    ]
  }
};

// Helper function to resolve colliery profile by any string name (from auth session or URL)
export function getCollieryProfile(nameOrId?: string | null): CollieryProfile {
  if (!nameOrId) return COLLIERY_DATABASE.gevra;

  const q = nameOrId.toLowerCase();

  if (q.includes("gevra")) return COLLIERY_DATABASE.gevra;
  if (q.includes("jharia")) return COLLIERY_DATABASE.jharia;
  if (q.includes("singrauli") || q.includes("jayant") || q.includes("nigahi")) return COLLIERY_DATABASE.singrauli;
  if (q.includes("rajpura")) return COLLIERY_DATABASE.rajpura;

  // Default fallback for any other selected mine
  return {
    ...COLLIERY_DATABASE.gevra,
    name: nameOrId,
    cleanName: nameOrId,
    subsidiary: nameOrId.includes("SECL") ? "SECL" : nameOrId.includes("BCCL") ? "BCCL" : nameOrId.includes("NCL") ? "NCL" : nameOrId.includes("MCL") ? "MCL" : nameOrId.includes("ECL") ? "ECL" : nameOrId.includes("WCL") ? "WCL" : "CIL"
  };
}
