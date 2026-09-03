"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardCheck, Plus, Search, CheckCircle, Clock, AlertCircle,
  Calendar, MapPin, ChevronRight, X, ShieldAlert, CheckSquare,
  FileText, Download, Printer, Filter, AlertTriangle, User,
  Sparkles, CheckCircle2, ArrowRight
} from "lucide-react";
import { storageService } from "@/lib/storage";

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
  shift?: string;
  priority?: "High" | "Medium" | "Low";
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
    time: "08:00 AM",
    deadline: "May 20, 2025",
    status: "Scheduled",
    severity: "Low",
    findingsNote: "Routine scheduled road grading and visibility check.",
  },
  {
    id: "INSP-043",
    area: "Coal Handling Plant",
    mine: "Rajpura Coal Mine",
    assigned: "May 19, 2025",
    time: "10:00 AM",
    deadline: "May 21, 2025",
    status: "Scheduled",
    severity: "Medium",
    findingsNote: "Screening plant acoustic enclosure and dust mitigation audit.",
  },
  {
    id: "INSP-044",
    area: "Explosives Magazine",
    mine: "Rajpura Coal Mine",
    assigned: "May 20, 2025",
    time: "02:00 PM",
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

function ScheduleParamWatcher({ onTrigger }: { onTrigger: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("schedule") === "true" || searchParams.get("action") === "schedule") {
      onTrigger();
    }
  }, [searchParams, onTrigger]);
  return null;
}

export default function InspectorInspectionsPage() {
  const [inspectionsList, setInspectionsList] = useState<Inspection[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"schedule" | "conduct">("schedule");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form States (Schedule / Conduct)
  const [formArea, setFormArea] = useState("Pit Area – Section A");
  const [formStatus, setFormStatus] = useState<"Completed" | "Pending" | "Scheduled">("Scheduled");
  const [formSeverity, setFormSeverity] = useState<"Low" | "Medium" | "High">("Medium");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("09:00 AM");
  const [formShift, setFormShift] = useState("Morning Shift (08:00 AM – 04:00 PM)");
  const [formNotes, setFormNotes] = useState("");
  const [checkPpe, setCheckPpe] = useState(true);
  const [checkVent, setCheckVent] = useState(true);
  const [checkFire, setCheckFire] = useState(true);
  const [checkGuards, setCheckGuards] = useState(true);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDate(tomorrow.toISOString().split("T")[0]);

    const unsubscribe = storageService.subscribeToInspections((liveDocs) => {
      const mapped: Inspection[] = (liveDocs || []).map((d) => {
        const dateStr = d.createdAt || d.timestamp || d.submittedAt;
        let formattedDate = "Today";
        let formattedTime = "10:00 AM";
        if (dateStr) {
          try {
            const dt = new Date(dateStr);
            if (!isNaN(dt.getTime())) {
              formattedDate = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              formattedTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            }
          } catch {}
        }

        const rawStatus = (d.status || d.escalationStatus || "").toUpperCase();
        let status: "Completed" | "Scheduled" | "Pending" | "Overdue" = "Completed";
        if (rawStatus.includes("SCHEDULE")) {
          status = "Scheduled";
        } else if (rawStatus.includes("OVERDUE")) {
          status = "Overdue";
        } else if (rawStatus.includes("PENDING") || rawStatus.includes("REVIEW")) {
          status = "Pending";
        } else {
          status = "Completed";
        }

        const sevRaw = (d.severity || d.observation?.severity || "Low").toUpperCase();
        let severity: "High" | "Medium" | "Low" | "—" = "Low";
        if (sevRaw === "HIGH" || sevRaw === "CRITICAL") severity = "High";
        else if (sevRaw === "MEDIUM") severity = "Medium";

        return {
          id: d.inspectionId || d.id || `INSP-${Math.floor(100 + Math.random() * 900)}`,
          area: d.area || d.setup?.area || d.section || "Pit Area",
          mine: d.mineName || d.mine || d.setup?.mine || "Colliery Sector",
          assigned: d.date || formattedDate,
          time: d.time || formattedTime,
          deadline: d.deadline || formattedDate,
          status,
          severity,
          findingsNote: d.description || d.observation?.description || d.notes || "Recorded via MineGuard App",
          checklist: d.checklist || [
            { item: "DGMS Statutory compliance check", ok: status === "Completed" },
            { item: "Field evidence verification", ok: true },
          ],
          shift: d.shift || d.setup?.shift || "Morning Shift",
        };
      });

      setInspectionsList(mapped);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const openScheduleModal = useCallback(() => {
    setModalMode("schedule");
    setShowModal(true);
  }, []);

  const openConductModal = useCallback(() => {
    setModalMode("conduct");
    setShowModal(true);
  }, []);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INSP-0${inspectionsList.length + 42}`;
    let displayDate = formDate;
    try {
      if (formDate) {
        const d = new Date(formDate + "T00:00:00");
        displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    } catch (err) {
      displayDate = "May 25, 2025";
    }

    if (modalMode === "schedule") {
      const newScheduled: Inspection = {
        id: newId,
        area: formArea,
        mine: "Rajpura Coal Mine",
        assigned: displayDate,
        time: formTime,
        deadline: displayDate,
        status: "Scheduled",
        severity: formSeverity,
        shift: formShift,
        findingsNote: formNotes.trim() || "Statutory inspection scheduled under DGMS CMR 2017 mandate.",
      };
      setInspectionsList([newScheduled, ...inspectionsList]);
      setShowModal(false);
      setToastMsg(`Statutory Inspection ${newId} scheduled for ${formArea} on ${displayDate}!`);
    } else {
      const newConducted: Inspection = {
        id: newId,
        area: formArea,
        mine: "Rajpura Coal Mine",
        assigned: "Today",
        time: "11:45 AM",
        deadline: "Today",
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
      setInspectionsList([newConducted, ...inspectionsList]);
      setShowModal(false);
      setToastMsg(`Inspection ${newId} logged successfully!`);
    }
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
      <Suspense fallback={null}>
        <ScheduleParamWatcher onTrigger={openScheduleModal} />
      </Suspense>

      {/* Floating Success Toast */}
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
          <CheckCircle2 size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Field Safety Inspections
          </h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0 0" }}>
            Conduct safety audits, schedule field checks, and enforce DGMS CMR 2017 compliance.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={openScheduleModal}
            id="schedule-inspection-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              background: "#2d6a4f",
              color: "white",
              border: "none",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#1b4332")}
            onMouseOut={e => (e.currentTarget.style.background = "#2d6a4f")}
          >
            <Calendar size={15} /> Schedule Inspection
          </button>
          <button
            onClick={openConductModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              background: "white",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "var(--shadow-xs)",
              transition: "all 0.15s ease",
            }}
          >
            <Plus size={15} /> Start Inspection Now
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Completed",  value: completed, color: "#16a34a", bg: "#dcfce7", filter: "Completed", icon: <CheckCircle size={18} color="#16a34a" /> },
          { label: "Scheduled",  value: scheduled, color: "#2563eb", bg: "#eff6ff", filter: "Scheduled", icon: <Calendar size={18} color="#2563eb" /> },
          { label: "Pending",    value: pending,   color: "#ea580c", bg: "#fff7ed", filter: "Pending",   icon: <Clock size={18} color="#ea580c" /> },
          { label: "Overdue",    value: overdue,   color: "#dc2626", bg: "#fee2e2", filter: "Overdue",   icon: <AlertCircle size={18} color="#dc2626" /> },
        ].map(c => (
          <div
            key={c.label}
            onClick={() => setActiveTab(activeTab === c.filter ? "All" : c.filter)}
            style={{
              background: activeTab === c.filter ? "white" : "white",
              border: `1.5px solid ${activeTab === c.filter ? c.color : "var(--border)"}`,
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: activeTab === c.filter ? `0 4px 16px ${c.color}25` : "var(--shadow-xs)",
            }}
          >
            <div>
              <p style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 4px" }}>
                {c.label}
              </p>
              <p style={{ fontSize: 26, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1 }}>
                {c.value}
              </p>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: "white",
        borderRadius: 14,
        border: "1px solid var(--border)",
        padding: "14px 18px",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        {/* Tab filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "Scheduled", "Pending", "Completed", "Overdue"].map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 600,
                  border: "none",
                  background: isActive ? "#0f2318" : "var(--surface-2)",
                  color: isActive ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "7px 12px",
          width: 260,
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search inspections..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 12.5,
              width: "100%",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Inspections Table */}
      <div style={{
        background: "white",
        borderRadius: 14,
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-xs)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>Inspection ID & Area</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>Assigned Date</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>Time / Shift</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>Status</th>
              <th style={{ padding: "12px 14px", fontWeight: 700 }}>Severity</th>
              <th style={{ padding: "12px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "36px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                  <ClipboardCheck size={28} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No inspections match the selected filters.</p>
                </td>
              </tr>
            ) : (
              filtered.map((insp, idx) => {
                const stat = statusConfig[insp.status] || { color: "#6b7280", bg: "#f3f4f6", icon: null };
                const isHighSev = insp.severity === "High";
                return (
                  <tr
                    key={insp.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid var(--surface-2)" : "none",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-1)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "white")}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: "rgba(45,106,79,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#2d6a4f", fontWeight: 800, fontSize: 11
                        }}>
                          {insp.id.split("-")[1] || "IN"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
                            {insp.area}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                            {insp.id} · {insp.mine}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 14px", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {insp.assigned}
                    </td>
                    <td style={{ padding: "14px 14px", color: "var(--text-muted)", fontSize: 12 }}>
                      {insp.time} {insp.shift ? `· ${insp.shift.split(" ")[0]}` : ""}
                    </td>
                    <td style={{ padding: "14px 14px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: stat.bg,
                        color: stat.color,
                      }}>
                        {stat.icon}
                        {insp.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 14px" }}>
                      {insp.severity !== "—" ? (
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: isHighSev ? "#fee2e2" : insp.severity === "Medium" ? "#fff7ed" : "#f0fdf4",
                          color: isHighSev ? "#dc2626" : insp.severity === "Medium" ? "#ea580c" : "#16a34a",
                        }}>
                          {insp.severity}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-faint)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedInspection(insp)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "white",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#2d6a4f",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "all 0.15s ease",
                        }}
                      >
                        View Report <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL: SCHEDULE / CONDUCT INSPECTION ── */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5,15,8,0.7)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: 16,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 540,
            width: "100%",
            maxHeight: "92vh",
            overflowY: "auto",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.8)",
            animation: "fadeInScale 0.25s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "16px 22px",
              background: "linear-gradient(135deg, #07130b 0%, #0f2318 60%, #1a3d28 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "15px 15px 0 0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(82,183,136,0.15)", border: "1px solid rgba(82,183,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={18} color="#86efac" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                    {modalMode === "schedule" ? "Schedule Statutory Inspection" : "Conduct Safety Inspection"}
                  </h3>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", margin: 0 }}>
                    DGMS CMR 2017 Compliance Protocol · Rajpura Coal Mine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "white", cursor: "pointer", padding: 6 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--surface-1)", padding: "4px 12px" }}>
              <button
                type="button"
                onClick={() => setModalMode("schedule")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: modalMode === "schedule" ? 700 : 500,
                  background: modalMode === "schedule" ? "white" : "transparent",
                  color: modalMode === "schedule" ? "#0f2318" : "var(--text-muted)",
                  boxShadow: modalMode === "schedule" ? "var(--shadow-xs)" : "none",
                  cursor: "pointer",
                }}
              >
                📅 Schedule Ahead
              </button>
              <button
                type="button"
                onClick={() => setModalMode("conduct")}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: modalMode === "conduct" ? 700 : 500,
                  background: modalMode === "conduct" ? "white" : "transparent",
                  color: modalMode === "conduct" ? "#0f2318" : "var(--text-muted)",
                  boxShadow: modalMode === "conduct" ? "var(--shadow-xs)" : "none",
                  cursor: "pointer",
                }}
              >
                ✍️ Conduct Now
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} style={{ padding: "20px 22px" }}>
              {/* Working Area */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Inspection Section / Working Area <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={formArea}
                  onChange={e => setFormArea(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "white", outline: "none" }}
                >
                  <option value="Pit Area – Section A">Pit Area – Section A</option>
                  <option value="Workshop – Bay 3">Workshop – Bay 3</option>
                  <option value="Underground Level 1">Underground Level 1</option>
                  <option value="Underground Level 2">Underground Level 2</option>
                  <option value="Conveyor Belt – Line 2">Conveyor Belt – Line 2</option>
                  <option value="Crusher Plant">Crusher Plant</option>
                  <option value="Explosives Magazine">Explosives Magazine</option>
                  <option value="Coal Handling Plant">Coal Handling Plant</option>
                  <option value="Ventilation Shaft & Fan House">Ventilation Shaft & Fan House</option>
                </select>
              </div>

              {modalMode === "schedule" ? (
                <>
                  {/* Date & Shift */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Scheduled Date <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formDate}
                        onChange={e => setFormDate(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Inspection Shift <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        value={formShift}
                        onChange={e => {
                          setFormShift(e.target.value);
                          if (e.target.value.includes("08:00")) setFormTime("08:00 AM");
                          else if (e.target.value.includes("10:00")) setFormTime("10:00 AM");
                          else if (e.target.value.includes("02:00") || e.target.value.includes("14:00")) setFormTime("02:00 PM");
                          else setFormTime("10:00 PM");
                        }}
                        style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12.5, background: "white" }}
                      >
                        <option value="Morning Shift (08:00 AM – 04:00 PM)">Morning (Shift 1)</option>
                        <option value="General Shift (10:00 AM – 06:00 PM)">General Shift</option>
                        <option value="Afternoon Shift (02:00 PM – 10:00 PM)">Afternoon (Shift 2)</option>
                        <option value="Night Shift (10:00 PM – 06:00 AM)">Night (Shift 3)</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority & Category */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Priority Level
                      </label>
                      <select
                        value={formSeverity}
                        onChange={e => setFormSeverity(e.target.value as any)}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "white" }}
                      >
                        <option value="Low">Low / Routine Audit</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High / Statutory Mandate</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Scheduled Time
                      </label>
                      <input
                        type="text"
                        value={formTime}
                        onChange={e => setFormTime(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Checklist for Conduct Now */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
                      Standard Statutory Checklist
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "PPE & Hardhats", val: checkPpe, set: setCheckPpe },
                        { label: "Ventilation & Airflow", val: checkVent, set: setCheckVent },
                        { label: "Fire Safety Equipment", val: checkFire, set: setCheckFire },
                        { label: "Machine & Belt Guards", val: checkGuards, set: setCheckGuards },
                      ].map(chk => (
                        <label
                          key={chk.label}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "9px 11px",
                            background: chk.val ? "#f0fdf4" : "#fef2f2",
                            borderRadius: 8,
                            border: `1px solid ${chk.val ? "#bbf7d0" : "#fecaca"}`,
                            cursor: "pointer", fontSize: 12, fontWeight: 600,
                          }}
                        >
                          <input type="checkbox" checked={chk.val} onChange={e => chk.set(e.target.checked)} />
                          {chk.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status & Severity */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Inspection Result
                      </label>
                      <select
                        value={formStatus}
                        onChange={e => setFormStatus(e.target.value as any)}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "white" }}
                      >
                        <option value="Completed">Completed / Passed</option>
                        <option value="Pending">Pending Verification</option>
                        <option value="Scheduled">Scheduled for Later</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                        Severity Finding
                      </label>
                      <select
                        value={formSeverity}
                        onChange={e => setFormSeverity(e.target.value as any)}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, background: "white" }}
                      >
                        <option value="Low">Low / Minor</option>
                        <option value="Medium">Medium Severity</option>
                        <option value="High">High / Critical Hazard</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Directives / Notes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  {modalMode === "schedule" ? "Special Directives & Audit Scope (Optional)" : "Findings & Field Observations"}
                </label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder={modalMode === "schedule"
                    ? "e.g. Inspect emergency pull-cords on conveyor, verify methane sensor calibration..."
                    : "Record field observations, statutory violations, or corrective instructions..."}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical" }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: "11px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 9, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", color: "var(--text-secondary)"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-schedule-btn"
                  style={{
                    flex: 2, padding: "11px",
                    background: "#2d6a4f",
                    color: "white", border: "none",
                    borderRadius: 9, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    boxShadow: "0 4px 14px rgba(45,106,79,0.30)",
                  }}
                >
                  {modalMode === "schedule" ? <Calendar size={15} /> : <CheckCircle2 size={15} />}
                  {modalMode === "schedule" ? "Confirm & Schedule Inspection" : "Submit Inspection Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: INSPECTION REPORT DETAIL ── */}
      {selectedInspection && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5,15,8,0.7)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: 16,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: 16,
            maxWidth: 540,
            width: "100%",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            border: "1px solid var(--border)",
            animation: "fadeInScale 0.25s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <div style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #07130b 0%, #0f2318 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} color="#86efac" />
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
                  Inspection Record · {selectedInspection.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "white", cursor: "pointer", padding: 6 }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {selectedInspection.area}
                  </h4>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "3px 0 0" }}>
                    {selectedInspection.mine} · Logged: {selectedInspection.assigned} ({selectedInspection.time})
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  background: statusConfig[selectedInspection.status]?.bg,
                  color: statusConfig[selectedInspection.status]?.color,
                }}>
                  {selectedInspection.status}
                </span>
              </div>

              {/* Checklist */}
              {selectedInspection.checklist && selectedInspection.checklist.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                    Audited Checklist Items
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedInspection.checklist.map(c => (
                      <div
                        key={c.item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "9px 12px",
                          borderRadius: 8,
                          background: c.ok ? "#f0fdf4" : "#fef2f2",
                          border: `1px solid ${c.ok ? "#bbf7d0" : "#fecaca"}`,
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{c.item}</span>
                        <span style={{ fontWeight: 800, color: c.ok ? "#16a34a" : "#dc2626" }}>
                          {c.ok ? "✓ COMPLIANT" : "✕ VIOLATION"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              <div style={{
                padding: "12px 14px",
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                marginBottom: 20,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", margin: "0 0 4px" }}>
                  Officer Findings & Field Notes
                </p>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                  {selectedInspection.findingsNote || "No remarks filed."}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setSelectedInspection(null)}
                  style={{
                    flex: 1, padding: "10px",
                    background: "#2d6a4f", color: "white",
                    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Close Inspection Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
