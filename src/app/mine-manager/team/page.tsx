"use client";

import { useState, useEffect } from "react";
import {
  Users, Plus, Search, Phone, Shield, HardHat, ClipboardCheck, Wrench,
  UserCheck, Mail, MapPin, Award, HeartPulse, Clock, FileText, CheckCircle2,
  AlertTriangle, X, Send, Printer, UserCog, Calendar, Activity, ChevronRight, ListChecks
} from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: "Operations" | "Safety" | "Engineering" | "Compliance";
  shift: "Morning" | "Evening" | "Night";
  status: "On Duty" | "Off Duty" | "On Leave";
  phone: string;
  email: string;
  initials: string;
  empId: string;
  bloodGroup: string;
  emergencyContact: { name: string; relation: string; phone: string };
  dgmsCert: string;
  gasTestingCert?: string;
  firstAidCert: string;
  pmeFitnessDate: string;
  assignedSection: string;
  assignedEquipment?: string;
  inspections: number;
  violations: number;
  actions: number;
  safetyScore: number;
  joinDate: string;
  recentLogs: Array<{ date: string; action: string; type: "audit" | "warning" | "equip" }>;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "EMP-01",
    name: "Rajesh Sharma",
    role: "Mine Manager",
    dept: "Operations",
    shift: "Morning",
    status: "On Duty",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@secl.gov.in",
    initials: "RS",
    empId: "CIL-SECL-1049",
    bloodGroup: "O+",
    emergencyContact: { name: "Sunita Sharma", relation: "Spouse", phone: "+91 98765 43219" },
    dgmsCert: "DGMS-FCC-7721 (First Class Manager Coal)",
    gasTestingCert: "DGMS-GT-9012 (Continuous Gas Auditing)",
    firstAidCert: "St. John Ambulance Certified (Valid Nov 2027)",
    pmeFitnessDate: "Annual PME Cleared (Valid till Jan 2027)",
    assignedSection: "Central Command & Deep Open Pit",
    assignedEquipment: "Colliery Supervisory Unit #1",
    inspections: 41,
    violations: 3,
    actions: 5,
    safetyScore: 96.4,
    joinDate: "12 Mar 2018",
    recentLogs: [
      { date: "Today 08:30 AM", action: "Approved shift blasting clearance at Bench 4 East", type: "audit" },
      { date: "Yesterday 04:15 PM", action: "Signed off DGMS statutory weekly ventilation log", type: "audit" },
      { date: "28 Aug 2026", action: "Issued slope stability advisory for Monsoon Bench 2", type: "warning" },
    ]
  },
  {
    id: "EMP-02",
    name: "Priya Gupta",
    role: "Safety Officer",
    dept: "Safety",
    shift: "Morning",
    status: "On Duty",
    phone: "+91 91234 56789",
    email: "priya.gupta@secl.gov.in",
    initials: "PG",
    empId: "CIL-SECL-2081",
    bloodGroup: "B+",
    emergencyContact: { name: "Anand Gupta", relation: "Brother", phone: "+91 91234 56780" },
    dgmsCert: "DGMS-SO-3401 (Safety Officer Endorsement)",
    gasTestingCert: "DGMS-GT-7740 (Methane & Toxic Fume Testing)",
    firstAidCert: "Advanced Medical Responder (Valid Aug 2028)",
    pmeFitnessDate: "Periodic PME Cleared (Valid till Apr 2027)",
    assignedSection: "Bench 3 West & CHP Conveyor Junction",
    assignedEquipment: "Industrial Multi-Gas Detector GX-3R",
    inspections: 28,
    violations: 1,
    actions: 8,
    safetyScore: 98.2,
    joinDate: "05 Nov 2020",
    recentLogs: [
      { date: "Today 09:10 AM", action: "Conducted dust suppression mist spray audit at In-Pit Crusher", type: "audit" },
      { date: "Yesterday 02:00 PM", action: "Calibrated 4 remote telemetry methane sensors", type: "equip" },
    ]
  },
  {
    id: "EMP-03",
    name: "Sunita Mehta",
    role: "Safety Inspector",
    dept: "Safety",
    shift: "Evening",
    status: "On Duty",
    phone: "+91 87654 32109",
    email: "sunita.mehta@dgms.gov.in",
    initials: "SM",
    empId: "CIL-SECL-3115",
    bloodGroup: "A+",
    emergencyContact: { name: "Ramesh Mehta", relation: "Father", phone: "+91 87654 32100" },
    dgmsCert: "DGMS-INSP-4091 (Statutory Mining Inspector)",
    gasTestingCert: "DGMS-GT-6088 (Underground & Opencast)",
    firstAidCert: "St. John First Aid Standard (Valid Jun 2027)",
    pmeFitnessDate: "PME Hearing & Spirometry Normal",
    assignedSection: "Haul Road Section 4 & Dump Yard B",
    assignedEquipment: "Laser Distance Meter & Sound Level Calibrator",
    inspections: 35,
    violations: 2,
    actions: 6,
    safetyScore: 94.0,
    joinDate: "19 Jul 2021",
    recentLogs: [
      { date: "Yesterday 07:45 PM", action: "Flagged dumper overspeeding on Haul Ramp 3", type: "warning" },
      { date: "29 Aug 2026", action: "Verified PPE compliance at secondary workshop", type: "audit" },
    ]
  },
  {
    id: "EMP-04",
    name: "Kamlesh Patel",
    role: "Equipment Manager",
    dept: "Engineering",
    shift: "Morning",
    status: "On Duty",
    phone: "+91 76543 21098",
    email: "kamlesh.patel@secl.gov.in",
    initials: "KP",
    empId: "CIL-SECL-4190",
    bloodGroup: "AB+",
    emergencyContact: { name: "Bhavna Patel", relation: "Spouse", phone: "+91 76543 21090" },
    dgmsCert: "DGMS-ENG-8819 (Mechanical Colliery Engineer)",
    firstAidCert: "First Aid Basic (Valid Mar 2027)",
    pmeFitnessDate: "PME Cleared without restrictions",
    assignedSection: "Heavy Earth Moving Machinery (HEMM) Workshop",
    assignedEquipment: "Komatsu PC3000 Hydraulic Excavator Fleet",
    inspections: 12,
    violations: 0,
    actions: 3,
    safetyScore: 99.0,
    joinDate: "10 Feb 2017",
    recentLogs: [
      { date: "Today 07:00 AM", action: "Completed 250-hr maintenance on Shovel #3", type: "equip" },
      { date: "30 Aug 2026", action: "Replaced hydraulic hoses on Cat 777D Dumper", type: "equip" },
    ]
  },
  {
    id: "EMP-05",
    name: "Vijay Nair",
    role: "Site Supervisor",
    dept: "Operations",
    shift: "Night",
    status: "Off Duty",
    phone: "+91 65432 10987",
    email: "vijay.nair@secl.gov.in",
    initials: "VN",
    empId: "CIL-SECL-5042",
    bloodGroup: "O-",
    emergencyContact: { name: "Meera Nair", relation: "Spouse", phone: "+91 65432 10980" },
    dgmsCert: "DGMS-OVERMAN-5510 (Certified Mining Overman)",
    gasTestingCert: "DGMS-GT-4120 (Restricted Opencast)",
    firstAidCert: "First Aid Certified (Valid Oct 2026)",
    pmeFitnessDate: "Next PME scheduled Oct 2026",
    assignedSection: "Coal Face Seam IV & In-Pit Loading",
    assignedEquipment: "Overman Communication Radio VHF-8",
    inspections: 19,
    violations: 4,
    actions: 7,
    safetyScore: 89.5,
    joinDate: "14 Jun 2019",
    recentLogs: [
      { date: "Night Shift 02:30 AM", action: "Controlled pit water dewatering pump setup", type: "audit" },
      { date: "28 Aug 2026", action: "Rectified missing berm height along East edge", type: "warning" },
    ]
  },
  {
    id: "EMP-06",
    name: "Anil Singh",
    role: "Electrician",
    dept: "Engineering",
    shift: "Morning",
    status: "On Duty",
    phone: "+91 54321 09876",
    email: "anil.singh@secl.gov.in",
    initials: "AS",
    empId: "CIL-SECL-6112",
    bloodGroup: "B+",
    emergencyContact: { name: "Pushpa Singh", relation: "Mother", phone: "+91 54321 09870" },
    dgmsCert: "DGMS-ELEC-7231 (Certified High Tension Mines Electrician)",
    firstAidCert: "Electric Shock Resuscitation Certified",
    pmeFitnessDate: "PME Vision & Heart Normal",
    assignedSection: "Main 33kV Substation & Pumping Feeder",
    assignedEquipment: "Fluke 1587 Insulation Multimeter",
    inspections: 6,
    violations: 1,
    actions: 2,
    safetyScore: 95.0,
    joinDate: "03 Sep 2022",
    recentLogs: [
      { date: "Today 10:15 AM", action: "Tested earth leakage relay at Substation 2", type: "equip" },
    ]
  },
  {
    id: "EMP-07",
    name: "Meena Joshi",
    role: "Environmental Officer",
    dept: "Compliance",
    shift: "Morning",
    status: "On Leave",
    phone: "+91 43210 98765",
    email: "meena.joshi@secl.gov.in",
    initials: "MJ",
    empId: "CIL-SECL-7023",
    bloodGroup: "A-",
    emergencyContact: { name: "Deepak Joshi", relation: "Spouse", phone: "+91 43210 98760" },
    dgmsCert: "Env. Compliance Officer DGMS Reg. 33",
    firstAidCert: "Standard First Aid (Valid Dec 2027)",
    pmeFitnessDate: "Annual PME Cleared",
    assignedSection: "Ambient Air Quality & Settling Pond #2",
    assignedEquipment: "High Volume PM10 Sampler & pH Monitor",
    inspections: 22,
    violations: 0,
    actions: 4,
    safetyScore: 99.5,
    joinDate: "20 Jan 2021",
    recentLogs: [
      { date: "26 Aug 2026", action: "Filed monthly water discharge compliance to State PCB", type: "audit" },
    ]
  },
  {
    id: "EMP-08",
    name: "Deepak Kumar",
    role: "Drill Operator",
    dept: "Operations",
    shift: "Night",
    status: "On Duty",
    phone: "+91 32109 87654",
    email: "deepak.kumar@secl.gov.in",
    initials: "DK",
    empId: "CIL-SECL-8119",
    bloodGroup: "O+",
    emergencyContact: { name: "Suman Kumar", relation: "Spouse", phone: "+91 32109 87650" },
    dgmsCert: "DGMS-HEMM-9921 (Blast Hole Drill Operator)",
    firstAidCert: "First Aid Basic (Valid May 2027)",
    pmeFitnessDate: "PME Hearing Normal (Tested Mar 2026)",
    assignedSection: "Bench 4 Overburden Blast Pattern Area",
    assignedEquipment: "Atlas Copco Pit Viper 271 Drill",
    inspections: 3,
    violations: 2,
    actions: 1,
    safetyScore: 91.0,
    joinDate: "08 Oct 2023",
    recentLogs: [
      { date: "Night Shift 04:00 AM", action: "Drilled 18 holes of 250mm dia for pattern B", type: "equip" },
      { date: "27 Aug 2026", action: "Reported drill bit excessive wear", type: "warning" },
    ]
  }
];

const DEFAULT_ACTIONS = [
  { id: "ACT-045", title: "Replace expired fire extinguishers in Workshop Bay 3", assignee: "P. Gupta", due: "May 17, 2025", priority: "High", category: "Fire Safety", status: "Overdue" },
  { id: "ACT-043", title: "Repair ventilation fan at Underground Level 3", assignee: "S. Mehta", due: "May 16, 2025", priority: "High", category: "Ventilation", status: "Overdue" },
  { id: "ACT-041", title: "Conduct PPE awareness training for pit area crew", assignee: "R. Sharma", due: "May 15, 2025", priority: "Medium", category: "Training", status: "Overdue" },
  { id: "ACT-039", title: "Fix exposed electrical wiring in junction box panel", assignee: "K. Patel", due: "May 14, 2025", priority: "High", category: "Electrical", status: "Overdue" },
  { id: "ACT-037", title: "Install missing guards on crusher machine drum", assignee: "R. Sharma", due: "May 13, 2025", priority: "Medium", category: "Equipment", status: "Overdue" },
  { id: "ACT-035", title: "Unblock emergency exit in workshop area", assignee: "P. Gupta", due: "May 12, 2025", priority: "High", category: "Emergency", status: "Overdue" },
  { id: "ACT-047", title: "Conduct monthly fire drill – all sections", assignee: "S. Mehta", due: "May 22, 2025", priority: "High", category: "Emergency", status: "Due Soon" },
  { id: "ACT-046", title: "Submit fortnightly compliance report to admin", assignee: "R. Sharma", due: "May 21, 2025", priority: "Medium", category: "Compliance", status: "Due Soon" },
  { id: "ACT-044", title: "Service and calibrate gas detection sensors", assignee: "K. Patel", due: "May 20, 2025", priority: "High", category: "Equipment", status: "Due Soon" },
  { id: "ACT-042", title: "Update MSDS sheets for all chemicals in storage", assignee: "P. Gupta", due: "May 21, 2025", priority: "Low", category: "Documentation", status: "Due Soon" },
  { id: "ACT-040", title: "Replenish first aid kits at 4 surface stations", assignee: "R. Sharma", due: "May 22, 2025", priority: "Medium", category: "First Aid", status: "Due Soon" },
  { id: "ACT-038", title: "Schedule quarterly equipment maintenance review", assignee: "S. Mehta", due: "May 23, 2025", priority: "Low", category: "Equipment", status: "Due Soon" },
  { id: "ACT-036", title: "Install signage at all Level 3 entry points", assignee: "K. Patel", due: "May 24, 2025", priority: "Medium", category: "Signage", status: "Due Soon" },
  { id: "ACT-048", title: "Organise weekly toolbox talk for crew supervisors", assignee: "R. Sharma", due: "May 26, 2025", priority: "Low", category: "Training", status: "On Track" },
  { id: "ACT-049", title: "Review and update emergency evacuation procedures", assignee: "P. Gupta", due: "May 28, 2025", priority: "Medium", category: "Emergency", status: "On Track" },
  { id: "ACT-050", title: "Procure replacement PPE stock for Q2", assignee: "K. Patel", due: "May 30, 2025", priority: "Low", category: "PPE", status: "On Track" },
];

const getMemberActions = (member: TeamMember, allActions: any[]) => {
  const normName = member.name.toLowerCase();
  const nameParts = normName.split(" ");
  const lastName = nameParts[nameParts.length - 1] || "";
  const initials = member.initials.toLowerCase();

  return allActions.filter(act => {
    const ass = (act.assignee || "").toLowerCase();
    return ass.includes(lastName) || ass.includes(normName) || ass.includes(initials);
  });
};

const deptColors: Record<string, { bg: string; color: string }> = {
  Operations:  { bg: "#e8f5ee", color: "#2d6a4f" },
  Safety:      { bg: "#fff0f0", color: "#dc2626" },
  Engineering: { bg: "#eff6ff", color: "#2563eb" },
  Compliance:  { bg: "#fdf4ff", color: "#9333ea" },
};

const statusColors: Record<string, { bg: string; color: string; dot: string }> = {
  "On Duty":  { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  "Off Duty": { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" },
  "On Leave": { bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
};

const roleIcon = (role: string) => {
  if (role.includes("Manager"))    return <HardHat size={14} />;
  if (role.includes("Inspector") || role.includes("Safety")) return <Shield size={14} />;
  if (role.includes("Equipment") || role.includes("Electrician")) return <Wrench size={14} />;
  return <ClipboardCheck size={14} />;
};

export default function TeamPage() {
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("gevra"));
  const [teamList, setTeamList] = useState<TeamMember[]>(INITIAL_TEAM);
  const [allActions, setAllActions] = useState<any[]>(DEFAULT_ACTIONS);
  const [query, setQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "statutory" | "safety">("overview");

  // Add Member Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "Mining Sirdar",
    dept: "Operations",
    shift: "Morning",
    status: "On Duty",
    phone: "+91 ",
    email: "",
    bloodGroup: "B+",
    assignedSection: "Bench 2 East",
    dgmsCert: "DGMS-SIRDAR-2026",
    firstAidCert: "St. John Ambulance Certified"
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));

      const stored = localStorage.getItem("mineguard_custom_actions");
      let combinedActions = [...DEFAULT_ACTIONS];
      if (stored) {
        const custom = JSON.parse(stored);
        if (Array.isArray(custom) && custom.length > 0) {
          const merged = [...custom, ...DEFAULT_ACTIONS];
          combinedActions = Array.from(new Map(merged.map(item => [item.id, item])).values());
        }
      }
      setAllActions(combinedActions);

      setTeamList(prev => prev.map(m => ({
        ...m,
        actions: getMemberActions(m, combinedActions).length
      })));
    } catch (e) {}
  }, []);

  const onDuty  = teamList.filter(t => t.status === "On Duty").length;
  const offDuty = teamList.filter(t => t.status === "Off Duty").length;
  const onLeave = teamList.filter(t => t.status === "On Leave").length;

  const filtered = teamList.filter(m =>
    !query || [m.name, m.role, m.dept, m.status, m.shift, m.empId, m.assignedSection].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setActiveTab("overview");
    setDetailModalOpen(true);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;

    const initials = newMember.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const created: TeamMember = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      name: newMember.name,
      role: newMember.role || "Mining Sirdar",
      dept: (newMember.dept as any) || "Operations",
      shift: (newMember.shift as any) || "Morning",
      status: (newMember.status as any) || "On Duty",
      phone: newMember.phone,
      email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, ".")}@secl.gov.in`,
      initials,
      empId: `CIL-SECL-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup: newMember.bloodGroup || "O+",
      emergencyContact: { name: "Family Contact", relation: "Kin", phone: newMember.phone },
      dgmsCert: newMember.dgmsCert || "DGMS Certified",
      firstAidCert: newMember.firstAidCert || "Valid First Aid",
      pmeFitnessDate: "Medical Examination Cleared",
      assignedSection: newMember.assignedSection || "General Pit Area",
      assignedEquipment: "Standard Safety Gear & Radio",
      inspections: 0,
      violations: 0,
      actions: 0,
      safetyScore: 98.0,
      joinDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      recentLogs: [{ date: "Just now", action: "Registered into Colliery Roster", type: "audit" }]
    };

    setTeamList([created, ...teamList]);
    setAddModalOpen(false);
    setNotification(`Successfully added ${created.name} (${created.role}) to colliery team.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSendAdvisory = (member: TeamMember) => {
    setNotification(`Safety Advisory dispatched to ${member.name} (${member.phone}).`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
            <span>Mine Manager Portal</span>
            <span>/</span>
            <span style={{ color: "#2d6a4f", fontWeight: 600 }}>Personnel & Crew Roster</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
            Operational Team & Crew · {colliery.cleanName}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Statutory officers, overmen, and safety stewards appointed at {colliery.cleanName} ({colliery.subsidiary}).
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
            background: "#2d6a4f", color: "white", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(45,106,79,0.25)"
          }}
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div style={{
          padding: "10px 16px", background: "#dcfce7", border: "1px solid #86efac",
          borderRadius: 8, color: "#15803d", fontSize: 13, fontWeight: 600,
          marginBottom: 16, display: "flex", alignItems: "center", gap: 8
        }}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Staff",  value: teamList.length, color: "#2d6a4f", bg: "#e8f5ee", icon: <Users size={18} color="#2d6a4f" /> },
          { label: "On Duty",      value: onDuty,          color: "#16a34a", bg: "#dcfce7", icon: <UserCheck size={18} color="#16a34a" /> },
          { label: "Off Duty",     value: offDuty,         color: "#6b7280", bg: "#f3f4f6", icon: <Clock size={18} color="#6b7280" /> },
          { label: "On Leave",     value: onLeave,         color: "#ea580c", bg: "#fff7ed", icon: <Calendar size={18} color="#ea580c" /> },
        ].map(c => (
          <div key={c.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
            <div>
              <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>{c.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: c.color, lineHeight: 1.2, margin: "2px 0 0 0" }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Personnel Table Container */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* Table Toolbar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Personnel Directory</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, background: "#f9fafb" }}>
            <Search size={14} color="#9ca3af" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search personnel, role, section…"
              style={{ border: "none", outline: "none", fontSize: 12.5, color: "#374151", background: "transparent", width: 220 }}
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Name", "Role", "Department", "Shift", "Inspections", "Violations", "Actions", "Status", "Action"].map((h, i) => (
                  <th key={h} style={{
                    padding: "11px 16px", fontSize: 11, fontWeight: 700, color: "#6b7280",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                    textAlign: i === 8 ? "right" : "left"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => {
                const dc = deptColors[member.dept] || deptColors.Operations;
                const sc = statusColors[member.status];
                return (
                  <tr
                    key={member.id}
                    onClick={() => handleViewMember(member)}
                    style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fcfdfc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Name & Phone */}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>
                          <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{member.initials}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{member.name}</p>
                          <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 3, margin: "2px 0 0 0" }}>
                            <Phone size={9} />{member.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#374151", fontWeight: 600 }}>
                        {roleIcon(member.role)} {member.role}
                      </span>
                    </td>

                    {/* Department */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: dc.bg, color: dc.color }}>
                        {member.dept}
                      </span>
                    </td>

                    {/* Shift */}
                    <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
                      {member.shift}
                    </td>

                    {/* Inspections */}
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#2d6a4f" }}>
                      {member.inspections}
                    </td>

                    {/* Violations */}
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: member.violations > 0 ? "#dc2626" : "#9ca3af" }}>
                      {member.violations}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: "#374151" }}>
                      {member.actions}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: sc.bg, color: sc.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                        {member.status}
                      </span>
                    </td>

                    {/* Action button */}
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMember(member);
                        }}
                        style={{
                          fontSize: 12, color: "#2d6a4f", fontWeight: 700,
                          background: "#e8f5ee", border: "1px solid #b7e4c7",
                          padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: 4
                        }}
                      >
                        View <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MEMBER DETAIL & STATUTORY DOSSIER MODAL ("VIEW" ACTION)
          ═════════════════════════════════════════════════════════════ */}
      {detailModalOpen && selectedMember && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "white", borderRadius: 14, maxWidth: 680, width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden",
            maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            
            {/* Modal Header Bar */}
            <div style={{
              padding: "18px 24px", borderBottom: "1px solid #e5e7eb",
              background: "linear-gradient(135deg, #163824 0%, #2d6a4f 100%)",
              color: "white", display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", background: "white",
                  color: "#163824", fontSize: 16, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                }}>
                  {selectedMember.initials}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{selectedMember.name}</h3>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                      background: "rgba(255,255,255,0.2)", color: "white"
                    }}>
                      {selectedMember.empId}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: "2px 0 0 0" }}>
                    {selectedMember.role} · {selectedMember.dept} Department
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
                  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", cursor: "pointer", transition: "background 0.15s"
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div style={{
              display: "flex", borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb", padding: "0 20px"
            }}>
              {[
                { id: "overview" as const, label: "Deployment & Bio" },
                { id: "statutory" as const, label: "DGMS Statutory Credentials" },
                { id: "safety" as const, label: "Safety Audits & History" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "12px 16px", fontSize: 12.5, fontWeight: 700,
                    border: "none", background: "none", cursor: "pointer",
                    color: activeTab === tab.id ? "#2d6a4f" : "#6b7280",
                    borderBottom: `2.5px solid ${activeTab === tab.id ? "#2d6a4f" : "transparent"}`,
                    transition: "all 0.15s"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>

              {/* TAB 1: OVERVIEW & DEPLOYMENT */}
              {activeTab === "overview" && (
                <div>
                  {/* Status Strip */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
                    padding: "12px 14px", background: "#f9fafb", borderRadius: 10,
                    border: "1px solid #e5e7eb", marginBottom: 18
                  }}>
                    <div>
                      <span style={{ fontSize: 10.5, color: "#6b7280", textTransform: "uppercase", fontWeight: 700 }}>Current Status</span>
                      <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13, color: statusColors[selectedMember.status].color }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[selectedMember.status].dot }} />
                        {selectedMember.status}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 10.5, color: "#6b7280", textTransform: "uppercase", fontWeight: 700 }}>Operating Shift</span>
                      <div style={{ marginTop: 2, fontWeight: 700, fontSize: 13, color: "#111827" }}>
                        {selectedMember.shift} ({selectedMember.shift === "Morning" ? "06:00 - 14:00" : selectedMember.shift === "Evening" ? "14:00 - 22:00" : "22:00 - 06:00"})
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 10.5, color: "#6b7280", textTransform: "uppercase", fontWeight: 700 }}>Blood Group</span>
                      <div style={{ marginTop: 2, fontWeight: 800, fontSize: 13, color: "#dc2626" }}>
                        {selectedMember.bloodGroup} (Emergency Ready)
                      </div>
                    </div>
                  </div>

                  {/* Section & Equipment Deployment */}
                  <div style={{ marginBottom: 18 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <MapPin size={15} color="#2d6a4f" /> Working Location & Pit Assignment
                    </h4>
                    <div style={{ padding: "12px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 12.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: "#1e40af", fontWeight: 600 }}>Assigned Face / Zone:</span>
                        <strong style={{ color: "#1e3a8a" }}>{selectedMember.assignedSection}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#1e40af", fontWeight: 600 }}>Assigned Machinery / Gear:</span>
                        <strong style={{ color: "#1e3a8a" }}>{selectedMember.assignedEquipment || "General Shift Roster"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Emergency Info */}
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <Phone size={15} color="#2d6a4f" /> Contact & Statutory Form B Record
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12.5 }}>
                      <div style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <span style={{ color: "#6b7280", fontSize: 11, display: "block" }}>Govt. Email:</span>
                        <strong style={{ color: "#111827" }}>{selectedMember.email}</strong>
                      </div>
                      <div style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <span style={{ color: "#6b7280", fontSize: 11, display: "block" }}>Primary Phone:</span>
                        <strong style={{ color: "#111827" }}>{selectedMember.phone}</strong>
                      </div>
                      <div style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <span style={{ color: "#6b7280", fontSize: 11, display: "block" }}>Emergency Contact:</span>
                        <strong style={{ color: "#111827" }}>{selectedMember.emergencyContact.name} ({selectedMember.emergencyContact.relation})</strong>
                      </div>
                      <div style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                        <span style={{ color: "#6b7280", fontSize: 11, display: "block" }}>Emergency Hotline:</span>
                        <strong style={{ color: "#dc2626" }}>{selectedMember.emergencyContact.phone}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STATUTORY CREDENTIALS */}
              {activeTab === "statutory" && (
                <div>
                  <div style={{ padding: "12px 14px", background: "linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>Mines Act 1952 & CMR 2017 Register</div>
                    <div style={{ fontSize: 12.5, color: "#374151", marginTop: 2 }}>
                      Verified statutory certificates on record with DGMS Colliery Safety Directorate.
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                          <Award size={15} color="#2563eb" /> DGMS Certificate of Competency
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "2px 7px", borderRadius: 10 }}>
                          Verified & Active
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginTop: 4 }}>
                        {selectedMember.dgmsCert}
                      </div>
                    </div>

                    {selectedMember.gasTestingCert && (
                      <div style={{ padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                            <Shield size={15} color="#16a34a" /> Gas Testing Certificate (CMR Reg 34)
                          </span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "2px 7px", borderRadius: 10 }}>
                            Gassy Seam Certified
                          </span>
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginTop: 4 }}>
                          {selectedMember.gasTestingCert}
                        </div>
                      </div>
                    )}

                    <div style={{ padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                          <HeartPulse size={15} color="#dc2626" /> PME Medical Fitness Examination
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "2px 7px", borderRadius: 10 }}>
                          Fit for Mine Work
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginTop: 4 }}>
                        {selectedMember.pmeFitnessDate}
                      </div>
                    </div>

                    <div style={{ padding: "12px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6 }}>
                          <FileText size={15} color="#ea580c" /> First Aid & Life Saving Certificate
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#15803d", background: "#dcfce7", padding: "2px 7px", borderRadius: 10 }}>
                          Current
                        </span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1f2937", marginTop: 4 }}>
                        {selectedMember.firstAidCert}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SAFETY PERFORMANCE & LOGS */}
              {activeTab === "safety" && (
                <div>
                  {/* Safety Metrics Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
                    <div style={{ padding: "10px", background: "#e8f5ee", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#2d6a4f" }}>{selectedMember.inspections}</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>Audits Carried Out</div>
                    </div>
                    <div style={{ padding: "10px", background: selectedMember.violations > 0 ? "#fee2e2" : "#f3f4f6", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: selectedMember.violations > 0 ? "#dc2626" : "#6b7280" }}>{selectedMember.violations}</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>Violations Logged</div>
                    </div>
                    <div style={{ padding: "10px", background: "#eff6ff", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>{selectedMember.actions}</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>Actions Resolved</div>
                    </div>
                    <div style={{ padding: "10px", background: "#f0fdf4", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{selectedMember.safetyScore}%</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280", marginTop: 2 }}>Safety Index</div>
                    </div>
                  </div>

                  {/* Recent Operational Log */}
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <Activity size={15} color="#2d6a4f" /> Shift Activity & Compliance Timeline
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedMember.recentLogs.map((log, idx) => (
                      <div key={idx} style={{ padding: "10px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ fontWeight: 700, color: "#111827" }}>{log.action}</span>
                          <span style={{ fontSize: 10.5, color: "#6b7280" }}>{log.date}</span>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                          background: log.type === "warning" ? "#fee2e2" : log.type === "equip" ? "#eff6ff" : "#dcfce7",
                          color: log.type === "warning" ? "#dc2626" : log.type === "equip" ? "#2563eb" : "#16a34a"
                        }}>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Assigned CAPA Corrective Safety Actions */}
                  {selectedMember && (() => {
                    const memberActions = getMemberActions(selectedMember, allActions);
                    return (
                      <div style={{ marginTop: 18 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <ListChecks size={15} color="#2d6a4f" /> Assigned CAPA Safety Actions ({memberActions.length})
                        </h4>
                        {memberActions.length === 0 ? (
                          <p style={{ fontSize: 12, color: "#6b7280", fontStyle: "italic", margin: 0 }}>No active CAPA safety actions assigned to this officer.</p>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {memberActions.map(act => {
                              const statusColor = act.status === "Overdue" ? "#dc2626" : act.status === "On Track" ? "#16a34a" : "#ea580c";
                              const statusBg = act.status === "Overdue" ? "#fee2e2" : act.status === "On Track" ? "#dcfce7" : "#fff7ed";
                              return (
                                <div key={act.id} style={{ padding: "10px 12px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <span style={{ fontWeight: 800, color: "#2d6a4f", fontSize: 11 }}>{act.id}</span>
                                      <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: statusBg, color: statusColor }}>
                                        {act.status || "Assigned"}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: 11, color: "#6b7280" }}>Due: {act.due}</span>
                                  </div>
                                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", margin: "2px 0 4px" }}>{act.title}</p>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#e5e7eb", color: "#374151", fontWeight: 600 }}>{act.category}</span>
                                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: act.priority === "High" ? "#fee2e2" : "#fff7ed", color: act.priority === "High" ? "#dc2626" : "#ea580c", fontWeight: 600 }}>{act.priority} Priority</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

            {/* Modal Footer Manager Actions */}
            <div style={{
              padding: "14px 24px", borderTop: "1px solid #e5e7eb",
              background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleSendAdvisory(selectedMember)}
                  style={{
                    padding: "7px 12px", background: "white", border: "1px solid #d1d5db",
                    borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#374151",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 5
                  }}
                >
                  <Send size={13} color="#2d6a4f" /> Dispatch Advisory
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: "7px 12px", background: "white", border: "1px solid #d1d5db",
                    borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#374151",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 5
                  }}
                >
                  <Printer size={13} color="#6b7280" /> Form B Slip
                </button>
              </div>

              <button
                onClick={() => setDetailModalOpen(false)}
                style={{
                  padding: "8px 18px", background: "#2d6a4f", color: "white",
                  border: "none", borderRadius: 6, fontSize: 12.5, fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          ADD NEW TEAM MEMBER MODAL
          ═════════════════════════════════════════════════════════════ */}
      {addModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1200,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "white", borderRadius: 14, maxWidth: 520, width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden"
          }}>
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>Register New Colliery Personnel</h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>{colliery.cleanName} · Form B Statutory Roll</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleAddMemberSubmit} style={{ padding: "18px 20px" }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  required
                  placeholder="e.g. Suresh Kumar Yadav"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Role</label>
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12.5 }}
                  >
                    <option value="Mining Sirdar">Mining Sirdar</option>
                    <option value="Mining Overman">Mining Overman</option>
                    <option value="Safety Steward">Safety Steward</option>
                    <option value="Surveyor">Surveyor</option>
                    <option value="Electrician">Electrician</option>
                    <option value="HEMM Operator">HEMM Operator</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Department</label>
                  <select
                    value={newMember.dept}
                    onChange={e => setNewMember({ ...newMember, dept: e.target.value as any })}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12.5 }}
                  >
                    <option value="Operations">Operations</option>
                    <option value="Safety">Safety</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Shift</label>
                  <select
                    value={newMember.shift}
                    onChange={e => setNewMember({ ...newMember, shift: e.target.value as any })}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12.5 }}
                  >
                    <option value="Morning">Morning (06:00 - 14:00)</option>
                    <option value="Evening">Evening (14:00 - 22:00)</option>
                    <option value="Night">Night (22:00 - 06:00)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Phone Number</label>
                  <input
                    required
                    placeholder="+91 98765 00000"
                    value={newMember.phone}
                    onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                    style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>Assigned Working Section</label>
                <input
                  placeholder="e.g. Bench 3 Overburden / In-Pit Loading Face"
                  value={newMember.assignedSection}
                  onChange={e => setNewMember({ ...newMember, assignedSection: e.target.value })}
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  style={{ padding: "8px 14px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12.5, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Save to Form B Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
