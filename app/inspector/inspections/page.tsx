"use client";

import {
  ClipboardCheck, Plus, Search, CheckCircle, Clock, AlertCircle,
  Calendar, MapPin, ChevronRight, X, ShieldAlert, CheckSquare,
  FileText, Download, Printer, Filter
} from "lucide-react";
import { useState } from "react";

type Inspection = {
  id: string;
  area: string;
  mine: string;
  assigned: string;
  time: string;
  deadline: string;
  status: "Completed" | "Scheduled" | "Pending" | "Overdue";
  severity: "High" | "Medium" | "Low" | "—";
  findingsNote?: string;
  checklist?: { item: string; ok: boolean }[];
};

const initialInspections: Inspection[] = [
  {
    id: "INSP-041",
    area: "Pit Area – Section A",
    mine: "Rajpura Coal Mine",
    assigned: "May 19, 2025",
    time: "10:15 AM",
    deadline: "May 19, 2025",
    status: "Completed",
    severity: "Low",
    findingsNote: "Haul road berm height verified at 1.8m. Dust suppression sprayers operational.",
    checklist: [
      { item: "Berm height compliance", ok: true },
      { item: "Dust suppression active", ok: true },
      { item: "Operator PPE worn", ok: true },
      { item: "Signage clear", ok: true },
    ],
  },
  {
    id: "INSP-040",
    area: "Workshop – Bay 3",
    mine: "Rajpura Coal Mine",
    assigned: "May 19, 2025",
    time: "09:31 AM",
    deadline: "May 19, 2025",
    status: "Completed",
    severity: "High",
    findingsNote: "Fire extinguisher expired in March 2025. Emergency exit partially blocked by scrap drums.",
    checklist: [
      { item: "Fire extinguishers valid", ok: false },
      { item: "Emergency exits unobstructed", ok: false },
      { item: "Welding fume extraction", ok: true },
      { item: "Electrical earthing intact", ok: true },
    ],
  },
  {
    id: "INSP-039",
    area: "Conveyor Belt – Line 2",
    mine: "Rajpura Coal Mine",
    assigned: "May 18, 2025",
    time: "05:45 PM",
    deadline: "May 19, 2025",
    status: "Completed",
    severity: "Low",
    findingsNote: "Emergency pull-cord switch tripped correctly during test. Rollers properly lubricated.",
    checklist: [
      { item: "Emergency pull cord test", ok: true },
      { item: "Belt alignment", ok: true },
      { item: "Spillage containment", ok: true },
    ],
  },
  {
    id: "INSP-038",
    area: "Electrical Room",
    mine: "Rajpura Coal Mine",
    assigned: "May 18, 2025",
    time: "03:08 PM",
    deadline: "May 19, 2025",
    status: "Completed",
    severity: "Medium",
    findingsNote: "Rubber safety mats missing in front of 415V switchgear panel #2.",
    checklist: [
      { item: "Insulating rubber mats present", ok: false },
      { item: "Danger signs displayed", ok: true },
      { item: "CO₂ fire cylinder charged", ok: true },
    ],
  },
  {
    id: "INSP-042",
    area: "Main Haul Road",
    mine: "Rajpura Coal Mine",
    assigned: "May 19, 2025",
    time: "—",
    deadline: "May 20, 2025",
    status: "Scheduled",
    severity: "—",
    findingsNote: "Routine scheduled road grading and visibility check.",
  },
  {
    id: "INSP-043",
    area: "Coal Handling Plant",
    mine: "Rajpura Coal Mine",
    assigned: "May 19, 2025",
    time: "—",
    deadline: "May 21, 2025",
    status: "Scheduled",
    severity: "—",
    findingsNote: "Screening plant acoustic enclosure and dust mitigation audit.",
  },
  {
    id: "INSP-044",
    area: "Explosives Magazine",
    mine: "Rajpura Coal Mine",
    assigned: "May 20, 2025",
    time: "—",
    deadline: "May 22, 2025",
    status: "Pending",
    severity: "High",
    findingsNote: "Mandatory fortnightly lightning protection and magazine security verification.",
  },
  {
    id: "INSP-037",
    area: "Rest Area & Canteen",
    mine: "Rajpura Coal Mine",
    assigned: "May 16, 2025",
    time: "02:15 PM",
    deadline: "May 17, 2025",
    status: "Overdue",
    severity: "Medium",
    findingsNote: "Hygiene audit and drinking water quality test kit pending submission.",
  },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  "Completed": { color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={12} color="#16a34a" /> },
  "Scheduled": { color: "#2563eb", bg: "#eff6ff", icon: <Calendar size={12} color="#2563eb" /> },
  "Pending":   { color: "#ea580c", bg: "#fff7ed", icon: <Clock size={12} color="#ea580c" /> },
  "Overdue":   { color: "#dc2626", bg: "#fee2e2", icon: <AlertCircle size={12} color="#dc2626" /> },
};

export default function InspectorInspectionsPage() {
  const [inspectionsList, setInspectionsList] = useState<Inspection[]>(initialInspections);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Inspection Form State
  const [formArea, setFormArea] = useState("Pit Area – Section A");
  const [formStatus, setFormStatus] = useState<"Completed" | "Pending" | "Scheduled">("Completed");
  const [formSeverity, setFormSeverity] = useState<"Low" | "Medium" | "High">("Low");
  const [formNotes, setFormNotes] = useState("");
  const [checkPpe, setCheckPpe] = useState(true);
  const [checkVent, setCheckVent] = useState(true);
  const [checkFire, setCheckFire] = useState(true);
  const [checkGuards, setCheckGuards] = useState(true);

  const completed = inspectionsList.filter(i => i.status === "Completed").length;
  const scheduled = inspectionsList.filter(i => i.status === "Scheduled").length;
  const overdue   = inspectionsList.filter(i => i.status === "Overdue").length;
  const pending   = inspectionsList.filter(i => i.status === "Pending").length;

  const filtered = inspectionsList.filter(ins => {
    const matchesTab = activeTab === "All" || ins.status === activeTab;
    const matchesSearch = !query || [ins.id, ins.area, ins.mine, ins.status, ins.severity, ins.findingsNote || ""].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );
    return matchesTab && matchesSearch;
  });

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INSP-0${inspectionsList.length + 42}`;
    const todayStr = "May 20, 2025";

    const newInsp: Inspection = {
      id: newId,
      area: formArea,
      mine: "Rajpura Coal Mine",
      assigned: todayStr,
      time: "11:45 AM",
      deadline: todayStr,
      status: formStatus,
      severity: formSeverity,
      findingsNote: formNotes || "Inspection conducted and verified by field safety inspector.",
      checklist: [
        { item: "PPE & Hardhat Compliance", ok: checkPpe },
        { item: "Ventilation & Airflow", ok: checkVent },
        { item: "Fire & Emergency Equipment", ok: checkFire },
        { item: "Machine Guards & Interlocks", ok: checkGuards },
      ],
    };

    setInspectionsList([newInsp, ...inspectionsList]);
    setShowModal(false);
    setFormNotes("");
    setToastMsg(`Inspection ${newId} logged successfully!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0f2318",
          color: "white",
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <CheckCircle size={16} color="#52b788" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Field Inspections</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Conduct safety audits, check equipment standards, and review compliance logs.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            background: "#2d6a4f",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(45,106,79,0.2)",
          }}
        >
          <Plus size={15} /> Start Inspection
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Completed",  value: completed, color: "#16a34a", bg: "#dcfce7", filter: "Completed" },
          { label: "Scheduled",  value: scheduled, color: "#2563eb", bg: "#eff6ff", filter: "Scheduled" },
          { label: "Pending",    value: pending,   color: "#ea580c", bg: "#fff7ed", filter: "Pending" },
          { label: "Overdue",    value: overdue,   color: "#dc2626", bg: "#fee2e2", filter: "Overdue" },
        ].map(c => (
          <div
            key={c.label}
            onClick={() => setActiveTab(activeTab === c.filter ? "All" : c.filter)}
            style={{
              background: "white",
              border: `1.5px solid ${activeTab === c.filter ? c.color : "#e5e7eb"}`,
              borderRadius: 12,
              padding: "16px 18px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        {/* Controls Bar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Completed", "Scheduled", "Pending", "Overdue"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: activeTab === tab ? "#2d6a4f" : "#f3f4f6",
                  color: activeTab === tab ? "white" : "#4b5563",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
            <Search size={14} color="#9ca3af" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by area, ID, findings…"
              style={{ border: "none", outline: "none", fontSize: 12.5, color: "#111827", background: "transparent", width: 200 }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
                <X size={13} color="#9ca3af" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: "36px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              No inspections found matching your search.
            </div>
          ) : (
            filtered.map((ins, i) => {
              const sc = statusConfig[ins.status];
              return (
                <div
                  key={ins.id}
                  onClick={() => setSelectedInspection(ins)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 20px",
                    borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fcfdfc")}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ClipboardCheck size={18} color={sc.color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#2d6a4f" }}>{ins.id}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{ins.area}</span>
                      {ins.severity !== "—" && (
                        <span style={{
                          padding: "1px 7px",
                          borderRadius: 12,
                          fontSize: 10.5,
                          fontWeight: 700,
                          background: ins.severity === "High" ? "#fee2e2" : ins.severity === "Medium" ? "#fff7ed" : "#f0fdf4",
                          color: ins.severity === "High" ? "#dc2626" : ins.severity === "Medium" ? "#ea580c" : "#16a34a",
                        }}>
                          {ins.severity} Severity
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {ins.findingsNote}
                    </p>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, display: "flex", gap: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{ins.mine}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Calendar size={10} />{ins.assigned} {ins.time !== "—" ? `· ${ins.time}` : ""}</span>
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 10.5, color: "#9ca3af", textTransform: "uppercase" }}>Deadline</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{ins.deadline}</p>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color, whiteSpace: "nowrap" }}>
                      {sc.icon} {ins.status}
                    </span>
                    <ChevronRight size={15} color="#9ca3af" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: New Inspection Form */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{ background: "white", borderRadius: 14, maxWidth: 520, width: "100%", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 20px", background: "#0f2318", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClipboardCheck size={18} color="#52b788" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Conduct Safety Inspection</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} style={{ padding: 22 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Inspection Area / Checkpoint</label>
                <select
                  value={formArea}
                  onChange={e => setFormArea(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa" }}
                >
                  <option value="Pit Area – Section A">Pit Area – Section A</option>
                  <option value="Workshop – Bay 3">Workshop – Bay 3</option>
                  <option value="Underground Level 1">Underground Level 1</option>
                  <option value="Underground Level 2">Underground Level 2</option>
                  <option value="Conveyor Belt – Line 2">Conveyor Belt – Line 2</option>
                  <option value="Crusher Plant">Crusher Plant</option>
                  <option value="Explosives Magazine">Explosives Magazine</option>
                </select>
              </div>

              {/* Checklist */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Standard Verification Checklist</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "PPE & Hardhats", val: checkPpe, set: setCheckPpe },
                    { label: "Ventilation OK", val: checkVent, set: setCheckVent },
                    { label: "Fire Safety Pass", val: checkFire, set: setCheckFire },
                    { label: "Machine Guards", val: checkGuards, set: setCheckGuards },
                  ].map(chk => (
                    <label key={chk.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: chk.val ? "#f0fdf4" : "#fef2f2", borderRadius: 6, border: `1px solid ${chk.val ? "#bbf7d0" : "#fecaca"}`, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                      <input type="checkbox" checked={chk.val} onChange={e => chk.set(e.target.checked)} />
                      {chk.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Status & Severity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa" }}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={e => setFormSeverity(e.target.value as any)}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa" }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Findings */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Findings & Observations</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Record observations, sensor readings, or corrective orders..."
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, boxSizing: "border-box", outline: "none", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "10px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspection Detail View */}
      {selectedInspection && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{ background: "white", borderRadius: 14, maxWidth: 520, width: "100%", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 20px", background: "#0f2318", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="#52b788" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Inspection Report · {selectedInspection.id}</h3>
              </div>
              <button onClick={() => setSelectedInspection(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{selectedInspection.area}</h4>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{selectedInspection.mine} · Assigned: {selectedInspection.assigned}</p>
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: statusConfig[selectedInspection.status]?.bg,
                  color: statusConfig[selectedInspection.status]?.color,
                  height: "fit-content"
                }}>
                  {selectedInspection.status}
                </span>
              </div>

              {/* Checklist */}
              {selectedInspection.checklist && selectedInspection.checklist.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>Checklist Audited</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedInspection.checklist.map(c => (
                      <div key={c.item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: c.ok ? "#f0fdf4" : "#fef2f2", fontSize: 12.5 }}>
                        <span style={{ color: "#374151" }}>{c.item}</span>
                        <span style={{ fontWeight: 700, color: c.ok ? "#16a34a" : "#dc2626" }}>{c.ok ? "✓ PASS" : "✕ FAIL"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8, padding: 14, marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Findings & Observations</p>
                <p style={{ fontSize: 13, color: "#111827", marginTop: 4, lineHeight: 1.5 }}>
                  {selectedInspection.findingsNote}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    alert("Report exported to PDF format.");
                    setSelectedInspection(null);
                  }}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  <Download size={14} /> Export Report (PDF)
                </button>
                <button
                  onClick={() => setSelectedInspection(null)}
                  style={{ padding: "10px 16px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
