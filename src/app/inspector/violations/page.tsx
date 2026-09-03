"use client";

import {
  AlertTriangle, Plus, CheckCircle, Clock, ChevronRight,
  Search, Filter, X, ShieldAlert, Sparkles, CheckCircle2,
  MapPin, Calendar, FileText, AlertOctagon
} from "lucide-react";
import { useState } from "react";

type Violation = {
  id: string;
  type: string;
  area: string;
  date: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  findings: string;
  recommendedAction?: string;
};

const initialViolations: Violation[] = [
  {
    id: "VIO-128",
    type: "PPE Non-Compliance",
    area: "Pit Area – Section A",
    date: "May 19, 2025",
    severity: "High",
    status: "Open",
    findings: "3 drill operators observed without certified hardhats in active bench blasting perimeter.",
    recommendedAction: "Issue immediate stop-work order until full PPE issued and signed off by supervisor.",
  },
  {
    id: "VIO-127",
    type: "Fire Safety Equipment",
    area: "Workshop – Bay 3",
    date: "May 19, 2025",
    severity: "High",
    status: "Open",
    findings: "Primary 9kg dry chemical fire extinguisher expired. Emergency egress passage blocked by metal drums.",
    recommendedAction: "Replace cylinder immediately with certified batch and clear passage.",
  },
  {
    id: "VIO-126",
    type: "Housekeeping & Spillages",
    area: "Conveyor Belt – Line 2",
    date: "May 18, 2025",
    severity: "Low",
    status: "Resolved",
    findings: "Lubricant oil spill near conveyor drive motor drum posing slip and fire hazard.",
    recommendedAction: "Spill response kit deployed; absorbent pads used and area dried.",
  },
  {
    id: "VIO-125",
    type: "Machine Guarding",
    area: "Crusher Plant",
    date: "May 18, 2025",
    severity: "Medium",
    status: "In Progress",
    findings: "Perimeter mesh guard detached on primary jaw crusher flywheel assembly.",
    recommendedAction: "Mechanical maintenance dispatched to re-bolt interlocking cage.",
  },
  {
    id: "VIO-124",
    type: "Mine Ventilation",
    area: "Underground Level 3",
    date: "May 17, 2025",
    severity: "High",
    status: "Open",
    findings: "Multi-gas detector triggered at heading 4: Carbon dioxide (CO₂) elevated at 2,200 ppm.",
    recommendedAction: "Auxiliary booster fan started; heading evacuated until reading drops below 1,500 ppm.",
  },
];

const severityStyle = (s: string) => {
  if (s === "High")   return { color: "#dc2626", bg: "#fee2e2" };
  if (s === "Medium") return { color: "#ea580c", bg: "#fff7ed" };
  return                     { color: "#16a34a", bg: "#dcfce7" };
};

const statusStyle = (s: string) => {
  if (s === "Open")        return { color: "#dc2626", bg: "#fee2e2", icon: <AlertTriangle size={11} color="#dc2626" /> };
  if (s === "In Progress") return { color: "#ea580c", bg: "#fff7ed", icon: <Clock size={11} color="#ea580c" /> };
  return                          { color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={11} color="#16a34a" /> };
};

const quickTemplates = [
  { label: "PPE Violation", area: "Pit Area – Section A", type: "PPE Non-Compliance", severity: "High", desc: "Workers observed without required high-visibility vests or protective eyewear in active operational area." },
  { label: "CO₂ / Gas Hazard", area: "Underground Level 2", type: "Mine Ventilation", severity: "High", desc: "Gas detection sensor registered elevated toxic gas levels exceeding statutory permissible threshold." },
  { label: "Fire Equipment", area: "Workshop – Bay 3", type: "Fire Safety Equipment", severity: "High", desc: "Fire extinguisher inspection tag expired or emergency fire bell circuit reporting fault." },
  { label: "Machine Guard", area: "Crusher Plant", type: "Machine Guarding", severity: "Medium", desc: "Rotating drum safety guard missing locking pins and vibrating excessively." },
];

export default function InspectorViolationsPage() {
  const [violationsList, setViolationsList] = useState<Violation[]>(initialViolations);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  // Form State
  const [area, setArea] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState<"High" | "Medium" | "Low">("High");
  const [desc, setDesc] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const applyTemplate = (t: typeof quickTemplates[0]) => {
    setArea(t.area);
    setType(t.type);
    setSeverity(t.severity as any);
    setDesc(t.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area || !type || !desc) return;

    const newId = `VIO-1${violationsList.length + 29}`;
    const newViolation: Violation = {
      id: newId,
      type,
      area,
      date: "May 20, 2025",
      severity,
      status: "Open",
      findings: desc,
      recommendedAction: "Investigate root cause and assign remediation task to section engineer.",
    };

    setViolationsList([newViolation, ...violationsList]);
    setToastMsg(`Violation ${newId} logged and dispatched to Mine Manager!`);
    setTimeout(() => setToastMsg(null), 3500);

    setArea("");
    setType("");
    setSeverity("High");
    setDesc("");
  };

  const updateStatus = (id: string, newStatus: "Open" | "In Progress" | "Resolved") => {
    setViolationsList(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    if (selectedViolation && selectedViolation.id === id) {
      setSelectedViolation({ ...selectedViolation, status: newStatus });
    }
  };

  const filtered = violationsList.filter(v => {
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    const matchesQuery = !query || [v.id, v.type, v.area, v.findings, v.severity, v.status].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );
    return matchesStatus && matchesQuery;
  });

  const totalOpen = violationsList.filter(v => v.status === "Open").length;
  const totalHigh = violationsList.filter(v => v.severity === "High" && v.status !== "Resolved").length;
  const totalInProg = violationsList.filter(v => v.status === "In Progress").length;
  const totalResolved = violationsList.filter(v => v.status === "Resolved").length;

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0f2318",
          color: "white",
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
          animation: "toastPop 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Hazard & Violation Reports</h2>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Log field safety violations, categorize risk levels, and dispatch corrective mandates.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Open Violations",  value: totalOpen,     color: "#dc2626", bg: "#fee2e2", filter: "Open" },
          { label: "Critical High Risk", value: totalHigh,    color: "#b91c1c", bg: "#fef2f2", filter: "Open" },
          { label: "In Progress",      value: totalInProg,   color: "#ea580c", bg: "#fff7ed", filter: "In Progress" },
          { label: "Resolved",         value: totalResolved, color: "#16a34a", bg: "#dcfce7", filter: "Resolved" },
        ].map(kpi => (
          <div
            key={kpi.label}
            onClick={() => setStatusFilter(statusFilter === kpi.filter ? "All" : kpi.filter)}
            style={{
              background: "white",
              border: `1.5px solid ${statusFilter === kpi.filter ? kpi.color : "var(--border)"}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
              boxShadow: statusFilter === kpi.filter ? `0 4px 16px ${kpi.color}25` : "var(--shadow-xs)"
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: kpi.color, opacity: 0.6 }} />
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{kpi.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: kpi.color, margin: 0, lineHeight: 1 }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Form + List */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.55fr", gap: 16 }}>

        {/* Log Form Container */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", alignSelf: "start", boxShadow: "var(--shadow-xs)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #fee2e2", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18} color="#dc2626" />
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#dc2626", margin: 0 }}>Log Hazard / Violation</h3>
            </div>
            <span style={{ fontSize: 10.5, background: "white", color: "#dc2626", padding: "3px 9px", borderRadius: 12, fontWeight: 800, border: "1px solid #fecaca" }}>
              Live Dispatch
            </span>
          </div>

          {/* Quick Presets */}
          <div style={{ padding: "12px 20px 0" }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              Quick Template Fill
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {quickTemplates.map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  style={{
                    padding: "4px 9px",
                    background: "var(--surface-1)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.12s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#2d6a4f";
                    (e.currentTarget as HTMLElement).style.color = "#2d6a4f";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  ⚡ {t.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "16px 20px 20px" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Area / Location</label>
              <input
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Pit Area – Section A, Underground L3"
                required
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Violation Type / Category</label>
              <input
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="e.g. PPE Non-Compliance, Machine Guarding"
                required
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Severity Level</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["High", "Medium", "Low"] as const).map(s => {
                  const sv = severityStyle(s);
                  const isSel = severity === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      style={{
                        flex: 1,
                        padding: "8px 4px",
                        border: `1.5px solid ${isSel ? sv.color : "#e5e7eb"}`,
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        background: isSel ? sv.bg : "white",
                        color: isSel ? sv.color : "#6b7280",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Observations & Evidence</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
                rows={4}
                placeholder="Describe the hazard conditions, equipment tags, or worker infractions..."
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "11px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                boxShadow: "0 2px 8px rgba(220,38,38,0.25)",
              }}
            >
              <Plus size={16} /> Submit & Notify Mine Manager
            </button>
          </form>
        </div>

        {/* Violations Feed */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          {/* List Header & Filters */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            {/* Status Tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Open", "In Progress", "Resolved"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: statusFilter === tab ? "#2d6a4f" : "#f3f4f6",
                    color: statusFilter === tab ? "white" : "#4b5563",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
              <Search size={13} color="#9ca3af" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search violations…"
                style={{ border: "none", outline: "none", fontSize: 12, color: "#111827", background: "transparent", width: 140 }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
                  <X size={12} color="#9ca3af" />
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: "36px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                No violations found.
              </div>
            ) : (
              filtered.map((v, i) => {
                const sv = severityStyle(v.severity);
                const ss = statusStyle(v.status);
                return (
                  <div
                    key={v.id}
                    style={{
                      padding: "15px 20px",
                      borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: sv.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <AlertTriangle size={18} color={sv.color} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#2d6a4f" }}>{v.id}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{v.type}</span>
                          <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: sv.bg, color: sv.color }}>{v.severity} Risk</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.color }}>
                            {ss.icon}{v.status}
                          </span>
                        </div>

                        <p style={{ fontSize: 12.5, color: "#4b5563", marginTop: 5, lineHeight: 1.45 }}>{v.findings}</p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <p style={{ fontSize: 11.5, color: "#9ca3af" }}>
                            {v.area} · {v.date}
                          </p>

                          {/* Quick Status Action */}
                          <div style={{ display: "flex", gap: 6 }}>
                            {v.status === "Open" && (
                              <button
                                onClick={() => updateStatus(v.id, "In Progress")}
                                style={{ padding: "3px 8px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#ea580c", cursor: "pointer" }}
                              >
                                Mark In Progress
                              </button>
                            )}
                            {v.status !== "Resolved" && (
                              <button
                                onClick={() => updateStatus(v.id, "Resolved")}
                                style={{ padding: "3px 8px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#16a34a", cursor: "pointer" }}
                              >
                                Mark Resolved
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedViolation(v)}
                              style={{ padding: "3px 8px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11, fontWeight: 500, color: "#374151", cursor: "pointer" }}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedViolation && (
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
          <div style={{ background: "white", borderRadius: 14, maxWidth: 480, width: "100%", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 20px", background: "#0f2318", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldAlert size={18} color="#fca5a5" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Hazard Record · {selectedViolation.id}</h3>
              </div>
              <button onClick={() => setSelectedViolation(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{selectedViolation.type}</h4>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{selectedViolation.area} · Logged {selectedViolation.date}</p>
                </div>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 16,
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: severityStyle(selectedViolation.severity).bg,
                  color: severityStyle(selectedViolation.severity).color,
                  height: "fit-content"
                }}>
                  {selectedViolation.severity} Severity
                </span>
              </div>

              <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Observations</p>
                <p style={{ fontSize: 13, color: "#111827", marginTop: 4, lineHeight: 1.45 }}>{selectedViolation.findings}</p>
              </div>

              {selectedViolation.recommendedAction && (
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 12, marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Recommended Corrective Action</p>
                  <p style={{ fontSize: 12.5, color: "#1e40af", marginTop: 4, lineHeight: 1.4 }}>{selectedViolation.recommendedAction}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                {selectedViolation.status !== "Resolved" ? (
                  <button
                    onClick={() => {
                      updateStatus(selectedViolation.id, "Resolved");
                      setSelectedViolation(null);
                    }}
                    style={{ flex: 1, padding: "9px", background: "#16a34a", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Mark as Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateStatus(selectedViolation.id, "Open");
                      setSelectedViolation(null);
                    }}
                    style={{ flex: 1, padding: "9px", background: "#dc2626", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Re-open Violation
                  </button>
                )}
                <button
                  onClick={() => setSelectedViolation(null)}
                  style={{ padding: "9px 16px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
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
