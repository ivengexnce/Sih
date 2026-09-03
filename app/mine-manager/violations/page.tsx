"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Search, Filter, Clock, CheckCircle } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";
import { useTranslation } from "@/app/components/LanguageContext";

const violations = [
  { id: "VIO-128", type: "PPE Non-Compliance",       area: "Pit Area",           reporter: "R. Sharma",  date: "May 19, 2025", severity: "High",   status: "Open",     desc: "3 workers observed without helmets in active blasting zone." },
  { id: "VIO-127", type: "Fire Safety",              area: "Workshop Bay 3",     reporter: "P. Gupta",   date: "May 19, 2025", severity: "High",   status: "Open",     desc: "Fire extinguisher expired. Emergency exit partially blocked." },
  { id: "VIO-126", type: "Housekeeping",             area: "Conveyor Area",      reporter: "R. Sharma",  date: "May 18, 2025", severity: "Low",    status: "Resolved", desc: "Oil spill near conveyor belt drive unit not cleaned up." },
  { id: "VIO-125", type: "Equipment Safety",         area: "Crusher Plant",      reporter: "K. Patel",   date: "May 18, 2025", severity: "Medium", status: "In Progress", desc: "Guards missing on rotating drum of crusher machine." },
  { id: "VIO-124", type: "Ventilation",              area: "Underground Level 3",reporter: "S. Mehta",   date: "May 17, 2025", severity: "High",   status: "Open",     desc: "CO₂ levels elevated beyond permissible limit (2200 ppm)." },
  { id: "VIO-123", type: "PPE Non-Compliance",       area: "Blasting Site",      reporter: "K. Patel",   date: "May 17, 2025", severity: "Medium", status: "Resolved", desc: "Ear protection not worn during controlled detonation." },
  { id: "VIO-122", type: "Electrical Hazard",        area: "Electrical Room",    reporter: "S. Mehta",   date: "May 16, 2025", severity: "High",   status: "In Progress", desc: "Exposed live wire in junction box panel near compressors." },
  { id: "VIO-121", type: "Housekeeping",             area: "Worker Rest Area",   reporter: "R. Sharma",  date: "May 15, 2025", severity: "Low",    status: "Resolved", desc: "Waste material accumulation exceeding permitted limits." },
];

const byType: Record<string, number> = {};
violations.forEach(v => { byType[v.type] = (byType[v.type] || 0) + 1; });
const typeEntries = Object.entries(byType).sort((a, b) => b[1] - a[1]);
const maxCount = typeEntries[0]?.[1] ?? 1;

const severityStyle = (s: string) => {
  if (s === "High")   return { bg: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" };
  if (s === "Medium") return { bg: "#fff7ed", color: "#ea580c", border: "1px solid #fdba74" };
  return                     { bg: "#f0fdf4", color: "#16a34a", border: "none" };
};

const statusStyle = (s: string) => {
  if (s === "Open")        return { bg: "#fee2e2", color: "#dc2626", icon: <AlertTriangle size={11} /> };
  if (s === "In Progress") return { bg: "#fff7ed", color: "#ea580c", icon: <Clock size={11} /> };
  return                          { bg: "#dcfce7", color: "#16a34a", icon: <CheckCircle size={11} /> };
};

export default function ViolationsPage() {
  const { t } = useTranslation();
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [query, setQuery] = useState("");
  const [violationsList, setViolationsList] = useState(violations);
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New violation form fields
  const [newType, setNewType] = useState("PPE Non-Compliance");
  const [newArea, setNewArea] = useState("Pit Area");
  const [newSeverity, setNewSeverity] = useState("High");
  const [newDesc, setNewDesc] = useState("");
  const [newReporter, setNewReporter] = useState("Er. Rajesh Sharma");

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));

      // Load any stored custom violations
      const stored = localStorage.getItem("mineguard_custom_violations");
      if (stored) {
        const parsed = JSON.parse(stored);
        setViolationsList([...parsed, ...violations]);
      }

      const sess = storageService.getCurrentSession();
      if (sess?.name) setNewReporter(sess.name);
    } catch (e) {}
  }, []);

  const handleCreateViolation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newVio = {
      id: `VIO-${Math.floor(130 + Math.random() * 870)}`,
      type: newType,
      area: newArea,
      reporter: newReporter,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      severity: newSeverity,
      status: "Open",
      desc: newDesc.trim()
    };

    const updated = [newVio, ...violationsList];
    setViolationsList(updated);

    try {
      const stored = localStorage.getItem("mineguard_custom_violations");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("mineguard_custom_violations", JSON.stringify([newVio, ...existing]));
    } catch (err) {}

    setShowLogModal(false);
    setNewDesc("");
    setToastMsg(`Violation ${newVio.id} successfully logged and flagged for CAPA remediation!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const open     = violationsList.filter(v => v.status === "Open").length;
  const inProg   = violationsList.filter(v => v.status === "In Progress").length;
  const resolved = violationsList.filter(v => v.status === "Resolved").length;
  const high     = violationsList.filter(v => v.severity === "High").length;
  const filtered = violationsList.filter(v =>
    !query || [v.type, v.area, v.id, v.desc, v.status, v.severity].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  const localByType: Record<string, number> = {};
  violationsList.forEach(v => { localByType[v.type] = (localByType[v.type] || 0) + 1; });
  const localTypeEntries = Object.entries(localByType).sort((a, b) => b[1] - a[1]);
  const localMaxCount = localTypeEntries[0]?.[1] ?? 1;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Log Violation Interactive Modal */}
      {showLogModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white", borderRadius: 14, width: "100%", maxWidth: 520,
            padding: "24px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={18} color="#dc2626" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>Log Statutory Hazard / Violation</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateViolation} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Hazard / Violation Category <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="PPE Non-Compliance">PPE Non-Compliance (Helmets, Safety Boots, Dust Masks)</option>
                  <option value="Ventilation">Ventilation (Air Velocity &lt; 0.5 m/s, Methane / CO Rise)</option>
                  <option value="Fire Safety">Fire Safety (Extinguishers, Flammable Gas, Heating)</option>
                  <option value="Electrical Hazard">Electrical Hazard (Live cables, earthing, flameproof casing)</option>
                  <option value="Equipment Safety">Equipment Safety (HEMM Radar, machine guards, brakes)</option>
                  <option value="Strata Control">Strata Control (Roof bolting, tell-tale indicators, bench slope)</option>
                  <option value="Housekeeping">Housekeeping (Obstructions, spillage, lighting)</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Colliery Beat / Area <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newArea}
                    onChange={e => setNewArea(e.target.value)}
                    placeholder="e.g. Pit Area - Sec B"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Severity Level <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="High">High (Immediate Risk / Prohibition)</option>
                    <option value="Medium">Medium (Correction within 48h)</option>
                    <option value="Low">Low (Standard Maintenance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Detailed Observation & Statutory Breach <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe the safety violation, personnel involved, and statutory regulation violated (e.g. CMR 2017 Regulation 153)..."
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Reporting Officer
                </label>
                <input
                  type="text"
                  value={newReporter}
                  onChange={e => setNewReporter(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#e63946", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={15} /> Submit Violation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            Hazard & Violation Reports · {colliery.cleanName}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Active non-compliances and hazard tracking for {colliery.cleanName} ({colliery.subsidiary}).
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#e63946", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(230,57,70,0.25)" }}
        >
          <Plus size={14} /> {t("btn.log_violation", "Log Violation")}
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Open",        value: open,     color: "#dc2626", bg: "#fee2e2" },
          { label: "In Progress", value: inProg,   color: "#ea580c", bg: "#fff7ed" },
          { label: "Resolved",    value: resolved,  color: "#16a34a", bg: "#dcfce7" },
          { label: "High Severity", value: high,   color: "#dc2626", bg: "#fff0f0" },
        ].map(c => (
          <div key={c.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
            <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{c.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</p>
            <div style={{ height: 4, marginTop: 10, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(c.value / Math.max(violationsList.length, 1)) * 100}%`, height: "100%", background: c.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 14 }}>

        {/* Violation Log */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Violation Log ({violationsList.length})</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5 }}>
                <Search size={13} color="#9ca3af" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search violations…"
                  style={{ border: "none", outline: "none", fontSize: 12.5, color: "#374151", background: "transparent", width: 140 }}
                />
              </div>
            </div>
          </div>
          <div>
            {filtered.length === 0 && (
              <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No violations match your search.</div>
            )}
            {filtered.map((v, i) => {
              const ss = statusStyle(v.status);
              const sv = severityStyle(v.severity);
              return (
                <div key={v.id} style={{ padding: "14px 20px", borderBottom: i < violationsList.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: v.severity === "High" ? "#fee2e2" : v.severity === "Medium" ? "#fff7ed" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <AlertTriangle size={16} color={v.severity === "High" ? "#dc2626" : v.severity === "Medium" ? "#ea580c" : "#16a34a"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#2d6a4f" }}>{v.id}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{v.type}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: sv.bg, color: sv.color, border: sv.border as any, marginLeft: "auto" }}>{v.severity}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: ss.bg, color: ss.color }}>{ss.icon}{v.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.5 }}>{v.desc}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 5 }}>{v.area} · {v.reporter} · {v.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Type Chart */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Violations by Type</h3>
          {localTypeEntries.map(([type, count], i) => (
            <div key={type} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, color: "#374151" }}>{type}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{count}</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / localMaxCount) * 100}%`, background: i === 0 ? "#e63946" : i === 1 ? "#f4a261" : "#6b7280", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: "14px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fdba74" }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>⚠ Action Required</p>
            <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>
              {high} high-severity violations are open and require immediate corrective action within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
