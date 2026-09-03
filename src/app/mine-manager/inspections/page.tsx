"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardCheck, Plus, Search, Filter, ChevronRight, CheckCircle,
  XCircle, AlertCircle, Calendar, User, Clock, ShieldCheck, FileText,
  AlertTriangle, X, CheckCircle2, ChevronDown
} from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

export interface StatutoryInspection {
  id: string;
  area: string;
  inspector: string;
  date: string;
  time: string;
  status: "Compliant" | "Non-Compliant" | "Partial";
  severity: "High" | "Medium" | "Low";
  findings: number;
  category?: string;
  notes?: string;
}

export interface UpcomingInspection {
  id?: string;
  area: string;
  inspector: string;
  date: string;
  time: string;
  shift?: string;
  category?: string;
  priority?: "High" | "Medium" | "Low";
  notes?: string;
  status?: string;
}

const defaultInspections: StatutoryInspection[] = [
  { id: "INS-041", area: "Pit Area – Section A", inspector: "R. Sharma",  date: "May 19, 2025", time: "10:15 AM", status: "Compliant",     severity: "Low",    findings: 2, category: "Strata Control", notes: "Rock bolting verified. No roof sag detected." },
  { id: "INS-040", area: "Workshop – Bay 3",     inspector: "P. Gupta",   date: "May 19, 2025", time: "09:31 AM", status: "Non-Compliant", severity: "High",   findings: 7, category: "Fire Safety", notes: "Fire extinguisher expired. Machine guard unlatched." },
  { id: "INS-039", area: "Conveyor Belt – Line 2",inspector: "R. Sharma", date: "May 18, 2025", time: "05:45 PM", status: "Compliant",     severity: "Low",    findings: 1, category: "HEMM & Haulage", notes: "Emergency stop pull-cords tested functional." },
  { id: "INS-038", area: "Electrical Room",      inspector: "S. Mehta",   date: "May 18, 2025", time: "03:08 PM", status: "Partial",       severity: "Medium", findings: 4, category: "Electrical Flameproof", notes: "Junction box cover bolts loosely torqued." },
  { id: "INS-037", area: "Explosives Magazine",  inspector: "K. Patel",   date: "May 17, 2025", time: "11:00 AM", status: "Compliant",     severity: "Low",    findings: 0, category: "Explosives Handling", notes: "Zero discrepancies in explosive count and license log." },
  { id: "INS-036", area: "Ventilation Shaft",    inspector: "P. Gupta",   date: "May 17, 2025", time: "08:30 AM", status: "Non-Compliant", severity: "High",   findings: 9, category: "Ventilation & Gas", notes: "Return airflow reduced by 18%; methane buildup risk." },
  { id: "INS-035", area: "Worker Rest Area",     inspector: "S. Mehta",   date: "May 16, 2025", time: "02:15 PM", status: "Compliant",     severity: "Low",    findings: 1, category: "General Occupational", notes: "Drinking water dispenser filter changed." },
  { id: "INS-034", area: "Crusher Plant",        inspector: "R. Sharma",  date: "May 15, 2025", time: "04:00 PM", status: "Partial",       severity: "Medium", findings: 3, category: "HEMM & Haulage", notes: "Dust suppression water nozzle partially clogged." },
];

const defaultUpcoming: UpcomingInspection[] = [
  { id: "SCH-001", area: "Main Haul Road",       inspector: "R. Sharma",  date: "May 20, 2025", time: "09:00 AM", shift: "Morning Shift (08:00 AM)", category: "HEMM & Haul Road Integrity", priority: "Low", notes: "Check berm heights and water tanker spraying schedule." },
  { id: "SCH-002", area: "Coal Handling Plant",  inspector: "K. Patel",   date: "May 21, 2025", time: "10:30 AM", shift: "General Shift (10:00 AM)", category: "Conveyor & Dust Control", priority: "Medium", notes: "Transfer point chute dust curtain verification." },
  { id: "SCH-003", area: "Explosives Magazine",  inspector: "S. Mehta",   date: "May 22, 2025", time: "08:00 AM", shift: "Morning Shift (08:00 AM)", category: "DGMS Magazine Statutory Audit", priority: "High", notes: "Pre-blast seismic log and magazine cooling system check." },
];

const statusStyle = (s: string) => {
  if (s === "Compliant")     return { bg: "#dcfce7", color: "#16a34a", border: "none" };
  if (s === "Non-Compliant") return { bg: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" };
  return                            { bg: "#fff7ed", color: "#ea580c", border: "1px solid #fdba74" };
};

const severityStyle = (s: string) => {
  if (s === "High")   return { bg: "#fee2e2", color: "#dc2626" };
  if (s === "Medium") return { bg: "#fff7ed", color: "#ea580c" };
  return                     { bg: "#f0fdf4", color: "#16a34a" };
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "Compliant")     return <CheckCircle size={13} color="#16a34a" />;
  if (status === "Non-Compliant") return <XCircle     size={13} color="#dc2626" />;
  return <AlertCircle size={13} color="#ea580c" />;
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

export default function InspectionsPage() {
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [query, setQuery] = useState("");
  const [inspectionsList, setInspectionsList] = useState<StatutoryInspection[]>([]);
  const [upcomingList, setUpcomingList] = useState<UpcomingInspection[]>(defaultUpcoming);

  // Modal and Interactive States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: "inspection" | "upcoming";
    data: any;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerScheduleModal = useCallback(() => {
    setShowScheduleModal(true);
  }, []);

  // Schedule Form States
  const [formArea, setFormArea] = useState("Pit Area – Section A");
  const [customArea, setCustomArea] = useState("");
  const [formInspector, setFormInspector] = useState("R. Sharma");
  const [customInspector, setCustomInspector] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formShift, setFormShift] = useState("Morning Shift (08:00 AM – 04:00 PM)");
  const [formTime, setFormTime] = useState("09:00 AM");
  const [formCategory, setFormCategory] = useState("DGMS CMR 2017 Comprehensive Statutory Audit");
  const [formPriority, setFormPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const mine = storageService.getActiveAllocatedMine();
      const profile = getCollieryProfile(mine);
      setColliery(profile);

      // Subscribe to real-time live inspections from Cloud Firestore
      unsubscribe = storageService.subscribeToInspections((liveDocs) => {
        const mapped = (liveDocs || []).map((d) => {
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
          let status: "Compliant" | "Non-Compliant" | "Partial" = "Compliant";
          if (rawStatus.includes("NON") || rawStatus.includes("REJECT") || (d.severity && d.severity.toUpperCase() === "HIGH")) {
            status = "Non-Compliant";
          } else if (rawStatus.includes("PARTIAL") || rawStatus.includes("REVIEW") || rawStatus.includes("PENDING")) {
            status = "Partial";
          }

          const sevRaw = (d.severity || d.observation?.severity || "Low").toUpperCase();
          let severity: "High" | "Medium" | "Low" = "Low";
          if (sevRaw === "HIGH" || sevRaw === "CRITICAL") severity = "High";
          else if (sevRaw === "MEDIUM") severity = "Medium";

          return {
            id: d.inspectionId || d.id || `INS-${Math.floor(100 + Math.random() * 900)}`,
            area: d.area || d.setup?.area || d.section || "Pit Area",
            inspector: d.inspectorName || d.inspectorEmail || d.inspector || "Statutory Inspector",
            date: d.date || formattedDate,
            time: d.time || formattedTime,
            status,
            severity,
            findings: d.findings !== undefined ? d.findings : (d.evidence?.length || (status === "Compliant" ? 0 : 1)),
            category: d.category || d.observation?.category || d.setup?.inspectionType || "Safety Compliance",
            notes: d.description || d.observation?.description || d.notes || "Inspection uploaded from MineGuard App.",
          };
        });

        setInspectionsList(mapped);
      }, mine);

      // Load custom scheduled inspections
      const stored = localStorage.getItem("mineguard_scheduled_inspections");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUpcomingList([...parsed, ...defaultUpcoming]);
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoDate = tomorrow.toISOString().split("T")[0];
      setFormDate(isoDate);

      // Fallback check
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("schedule") === "true" || params.get("action") === "schedule") {
          setShowScheduleModal(true);
        }
      }
    } catch (e) {
      console.warn("Error initializing inspections page:", e);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveArea = formArea === "Other" ? (customArea.trim() || "Unspecified Section") : formArea;
    const effectiveInspector = formInspector === "Other" ? (customInspector.trim() || "Statutory Inspector") : formInspector;

    // Format display date
    let displayDate = formDate;
    try {
      if (formDate) {
        const d = new Date(formDate + "T00:00:00");
        displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    } catch (err) {
      displayDate = "May 25, 2025";
    }

    const newScheduled: UpcomingInspection = {
      id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      area: effectiveArea,
      inspector: effectiveInspector,
      date: displayDate,
      time: formTime,
      shift: formShift,
      category: formCategory,
      priority: formPriority,
      notes: formNotes.trim() || "Statutory inspection scheduled under DGMS CMR 2017 mandate.",
      status: "Scheduled"
    };

    const updatedUpcoming = [newScheduled, ...upcomingList];
    setUpcomingList(updatedUpcoming);

    // Save to localStorage for persistent state across navigation
    try {
      const existingStored = localStorage.getItem("mineguard_scheduled_inspections");
      const parsedStored = existingStored ? JSON.parse(existingStored) : [];
      localStorage.setItem("mineguard_scheduled_inspections", JSON.stringify([newScheduled, ...parsedStored]));
    } catch (err) {}

    // Reset and close modal
    setShowScheduleModal(false);
    setFormNotes("");
    setCustomArea("");
    setCustomInspector("");

    // Show confirmation toast
    setToastMsg(`Inspection scheduled for ${newScheduled.area} on ${newScheduled.date}! Assigned to ${newScheduled.inspector}.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const compliant    = inspectionsList.filter(i => i.status === "Compliant").length;
  const nonCompliant = inspectionsList.filter(i => i.status === "Non-Compliant").length;
  const partial      = inspectionsList.filter(i => i.status === "Partial").length;
  const filtered     = inspectionsList.filter(ins =>
    !query || [ins.id, ins.area, ins.inspector, ins.status, ins.severity, ins.category || ""].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", position: "relative" }}>
      <Suspense fallback={null}>
        <ScheduleParamWatcher onTrigger={triggerScheduleModal} />
      </Suspense>

      {/* Floating Success Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0a1f13",
          color: "white",
          padding: "14px 22px",
          borderRadius: 12,
          border: "1px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          fontWeight: 600,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <CheckCircle2 size={18} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            Statutory Inspections · {colliery.cleanName}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Field inspection schedule and DGMS checklist logs for {colliery.cleanName} ({colliery.subsidiary}).
          </p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          id="schedule-inspection-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            background: "#2d6a4f",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
            transition: "all 0.15s ease",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#1b4332")}
          onMouseOut={e => (e.currentTarget.style.background = "#2d6a4f")}
        >
          <Plus size={15} /> Schedule Inspection
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Audits",      value: inspectionsList.length, color: "#2d6a4f", bg: "#f0fdf4", icon: <ClipboardCheck size={18} color="#2d6a4f" /> },
          { label: "Fully Compliant",   value: compliant,             color: "#16a34a", bg: "#f0fdf4", icon: <CheckCircle size={18} color="#16a34a" /> },
          { label: "Non-Compliant",     value: nonCompliant,          color: "#dc2626", bg: "#fee2e2", icon: <XCircle size={18} color="#dc2626" /> },
          { label: "Scheduled Ahead",   value: upcomingList.length,   color: "#2563eb", bg: "#eff6ff", icon: <Calendar size={18} color="#2563eb" /> },
        ].map(card => (
          <div key={card.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{card.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: card.color, lineHeight: 1.2, marginTop: 2 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14 }}>

        {/* Inspections Table */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Recent Statutory Inspections</h3>
              <p style={{ fontSize: 11.5, color: "#6b7280", margin: "2px 0 0 0" }}>Click on any record to view audit details & compliance report</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, background: "#f9fafb" }}>
                <Search size={13} color="#9ca3af" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search inspections…"
                  style={{ border: "none", outline: "none", fontSize: 12.5, color: "#374151", background: "transparent", width: 160 }}
                />
              </div>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Area / Section", "Inspector", "Date & Time", "Severity", "Findings", "Status"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", fontSize: 11, fontWeight: 600, color: "#6b7280", textAlign: "left", letterSpacing: "0.03em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins) => {
                const ss = statusStyle(ins.status);
                const sv = severityStyle(ins.severity);
                return (
                  <tr
                    key={ins.id}
                    onClick={() => setSelectedItem({ type: "inspection", data: ins })}
                    style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer", transition: "background 0.1s ease" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseOut={e => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 700, color: "#2d6a4f" }}>{ins.id}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                      {ins.area}
                      {ins.category && <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>{ins.category}</div>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#2d6a4f" }}>
                          {ins.inspector.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 500 }}>{ins.inspector}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{ins.date}<br /><span style={{ fontSize: 11, color: "#9ca3af" }}>{ins.time}</span></td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: sv.bg, color: sv.color }}>{ins.severity}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: ins.findings > 4 ? "#dc2626" : ins.findings > 0 ? "#ea580c" : "#16a34a" }}>
                      {ins.findings}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: ss.bg, color: ss.color, border: ss.border as any }}>
                        <StatusIcon status={ins.status} /> {ins.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Sidebar: Upcoming & Compliance Rate */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Upcoming Inspections Card */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={17} color="#2d6a4f" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Upcoming Inspections</h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#2d6a4f", fontSize: 11.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Plus size={12} /> Schedule
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {upcomingList.map((u, i) => (
                <div
                  key={u.id || i}
                  onClick={() => setSelectedItem({ type: "upcoming", data: u })}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 0.1s ease",
                    borderBottom: i < upcomingList.length - 1 ? "1px solid #f3f4f6" : "none"
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Calendar size={16} color="#2d6a4f" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.area}
                      </p>
                      {u.priority && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 10,
                          background: u.priority === "High" ? "#fee2e2" : u.priority === "Medium" ? "#fff7ed" : "#f0fdf4",
                          color: u.priority === "High" ? "#dc2626" : u.priority === "Medium" ? "#ea580c" : "#16a34a",
                        }}>
                          {u.priority}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <User size={11} /> {u.inspector} · {u.date} {u.time}
                    </p>
                    {u.category && (
                      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.category}
                      </p>
                    )}
                  </div>
                  <ChevronRight size={14} color="#9ca3af" style={{ marginLeft: "auto", alignSelf: "center", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Summary */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "#111827" }}>Compliance Breakdown</h3>
            {[
              { label: "Compliant",     count: compliant,    total: inspectionsList.length, color: "#52b788" },
              { label: "Partial",       count: partial,      total: inspectionsList.length, color: "#f4a261" },
              { label: "Non-Compliant", count: nonCompliant, total: inspectionsList.length, color: "#e63946" },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{row.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                    {row.total ? Math.round((row.count / row.total) * 100) : 0}% ({row.count})
                  </span>
                </div>
                <div style={{ height: 7, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${row.total ? (row.count / row.total) * 100 : 0}%`, background: row.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHEDULE INSPECTION MODAL */}
      {showScheduleModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: "white",
            borderRadius: 14,
            width: "100%",
            maxWidth: 540,
            maxHeight: "92vh",
            overflowY: "auto",
            padding: "24px 28px",
            boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0"
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={20} color="#2d6a4f" />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>Schedule Statutory Inspection</h3>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>
                    DGMS CMR 2017 Pre-Shift / Statutory Audit Assignment
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleScheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Working Section */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Working Section / Colliery Area <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={formArea}
                  onChange={e => setFormArea(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "white", outline: "none" }}
                >
                  {colliery.sections && colliery.sections.map(sec => (
                    <option key={sec.name} value={sec.name}>{sec.name} (Risk: {sec.risk})</option>
                  ))}
                  <option value="Pit Area – Section A">Pit Area – Section A</option>
                  <option value="Workshop – Bay 3">Workshop – Bay 3</option>
                  <option value="Conveyor Belt – Line 2">Conveyor Belt – Line 2</option>
                  <option value="Explosives Magazine">Explosives Magazine</option>
                  <option value="Ventilation Shaft & Fan House">Ventilation Shaft & Fan House</option>
                  <option value="Main Haul Road">Main Haul Road</option>
                  <option value="Coal Handling Plant (CHP)">Coal Handling Plant (CHP)</option>
                  <option value="Substation & Switchgear Room">Substation & Switchgear Room</option>
                  <option value="Other">Other / Custom Section...</option>
                </select>
                {formArea === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Enter specific mine section or bench ID..."
                    value={customArea}
                    onChange={e => setCustomArea(e.target.value)}
                    style={{ width: "100%", marginTop: 8, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                )}
              </div>

              {/* Statutory Inspector & Regulatory Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Assigned Inspector <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formInspector}
                    onChange={e => setFormInspector(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "white" }}
                  >
                    <option value="R. Sharma">Er. R. Sharma (Safety Officer)</option>
                    <option value="P. Gupta">Er. P. Gupta (Ventilation Officer)</option>
                    <option value="S. Mehta">Er. S. Mehta (Electrical Supervisor)</option>
                    <option value="K. Patel">Er. K. Patel (Blasting Officer)</option>
                    <option value="Deepak Kumar">Deepak Kumar (HEMM Lead)</option>
                    <option value="Other">Custom Inspector...</option>
                  </select>
                  {formInspector === "Other" && (
                    <input
                      type="text"
                      required
                      placeholder="Inspector name & title..."
                      value={customInspector}
                      onChange={e => setCustomInspector(e.target.value)}
                      style={{ width: "100%", marginTop: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    />
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Priority Level <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as any)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "white" }}
                  >
                    <option value="Low">Low / Routine Audit</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High / Immediate Mandate</option>
                  </select>
                </div>
              </div>

              {/* Inspection Date & Shift */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Audit Date <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Scheduled Time / Shift <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      value={formShift}
                      onChange={e => {
                        setFormShift(e.target.value);
                        if (e.target.value.includes("08:00")) setFormTime("08:00 AM");
                        else if (e.target.value.includes("10:00")) setFormTime("10:00 AM");
                        else if (e.target.value.includes("02:00") || e.target.value.includes("14:00")) setFormTime("02:00 PM");
                        else if (e.target.value.includes("22:00") || e.target.value.includes("Night")) setFormTime("10:00 PM");
                      }}
                      style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12.5, background: "white" }}
                    >
                      <option value="Morning Shift (08:00 AM – 04:00 PM)">Morning (Shift 1)</option>
                      <option value="General Shift (10:00 AM – 06:00 PM)">General Shift</option>
                      <option value="Afternoon Shift (02:00 PM – 10:00 PM)">Afternoon (Shift 2)</option>
                      <option value="Night Shift (10:00 PM – 06:00 AM)">Night (Shift 3)</option>
                    </select>
                    <input
                      type="text"
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      style={{ width: 90, padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Audit Category */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  DGMS Audit Scope / Discipline <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "white" }}
                >
                  <option value="DGMS CMR 2017 Comprehensive Statutory Audit">DGMS CMR 2017 Comprehensive Statutory Audit</option>
                  <option value="Ventilation, Air Velocity & Toxic Gas Check (CH4/CO)">Ventilation, Air Velocity & Toxic Gas Check (CH4/CO)</option>
                  <option value="Roof Strata, Pillar Stability & Support System Audit">Roof Strata, Pillar Stability & Support System Audit</option>
                  <option value="Heavy Earth Moving Machinery (HEMM) & Haul Road Integrity">Heavy Earth Moving Machinery (HEMM) & Haul Road Integrity</option>
                  <option value="Explosives Magazine & Pre-Blast Verification">Explosives Magazine & Pre-Blast Verification</option>
                  <option value="Electrical Substations & Flame-Proof Switchgear Audit">Electrical Substations & Flame-Proof Switchgear Audit</option>
                </select>
              </div>

              {/* Special Directives / Checklist Notes */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Special Directives & Checklist Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="e.g. Inspect emergency pull-cords on conveyor, measure air velocity at return regulator, verify gas monitor calibration..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, resize: "vertical" }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-schedule-inspection"
                  style={{
                    padding: "9px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2d6a4f",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 2px 6px rgba(45,106,79,0.3)"
                  }}
                >
                  <CheckCircle2 size={15} /> Confirm & Schedule Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTION DETAILS VIEW MODAL */}
      {selectedItem && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: "white",
            borderRadius: 14,
            width: "100%",
            maxWidth: 500,
            padding: "24px 28px",
            boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={18} color="#2d6a4f" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                    {selectedItem.type === "inspection" ? `Audit Report ${selectedItem.data.id}` : `Scheduled Inspection ${selectedItem.data.id || "Upcoming"}`}
                  </h3>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>{colliery.cleanName} · {colliery.subsidiary}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px", background: "#f8fafc", borderRadius: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Working Area</span>
                  <p style={{ fontWeight: 600, color: "#0f172a", margin: "2px 0 0 0" }}>{selectedItem.data.area}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Statutory Inspector</span>
                  <p style={{ fontWeight: 600, color: "#0f172a", margin: "2px 0 0 0" }}>{selectedItem.data.inspector}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Date & Schedule</span>
                  <p style={{ fontWeight: 600, color: "#0f172a", margin: "2px 0 0 0" }}>{selectedItem.data.date} ({selectedItem.data.time})</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Audit Category</span>
                  <p style={{ fontWeight: 600, color: "#0f172a", margin: "2px 0 0 0" }}>{selectedItem.data.category || "Statutory General"}</p>
                </div>
              </div>

              {selectedItem.data.notes && (
                <div style={{ padding: "10px 12px", background: "#f1f5f9", borderRadius: 8 }}>
                  <span style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>Directives / Field Notes</span>
                  <p style={{ margin: "4px 0 0 0", color: "#1e293b", lineHeight: 1.4 }}>{selectedItem.data.notes}</p>
                </div>
              )}

              {selectedItem.type === "inspection" && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                  <span style={{ color: "#64748b" }}>Compliance Outcome:</span>
                  <span style={{ fontWeight: 700, color: selectedItem.data.status === "Compliant" ? "#16a34a" : "#dc2626" }}>
                    {selectedItem.data.status} ({selectedItem.data.findings} Findings)
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#2d6a4f", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
