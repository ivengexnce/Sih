"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Search, Filter, Clock, CheckCircle } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";
import { useTranslation } from "@/components/LanguageContext";

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
  const [activeTab, setActiveTab] = useState("All");
  const [violationsList, setViolationsList] = useState(violations);
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [newType, setNewType] = useState("PPE Non-Compliance");
  const [newArea, setNewArea] = useState("Pit Area");
  const [newSeverity, setNewSeverity] = useState("High");
  const [newDesc, setNewDesc] = useState("");
  const [newReporter, setNewReporter] = useState("Er. Rajesh Sharma");

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));

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

  const filtered = violationsList.filter(v => {
    const matchesTab =
      activeTab === "All" ? true :
      activeTab === "High" ? v.severity === "High" :
      v.status === activeTab;
    const matchesQuery = !query || [v.type, v.area, v.id, v.desc, v.status, v.severity].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );
    return matchesTab && matchesQuery;
  });

  const localByType: Record<string, number> = {};
  violationsList.forEach(v => { localByType[v.type] = (localByType[v.type] || 0) + 1; });
  const localTypeEntries = Object.entries(localByType).sort((a, b) => b[1] - a[1]);
  const localMaxCount = localTypeEntries[0]?.[1] ?? 1;

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 12, border: "1px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600,
          animation: "toastPop 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Log Violation Interactive Modal */}
      {showLogModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5,15,8,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "white", borderRadius: 16, width: "100%", maxWidth: 520,
            padding: "24px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            border: "1px solid var(--border)",
            animation: "fadeInScale 0.25s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={18} color="#dc2626" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Log Statutory Hazard / Violation</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Immediate DGMS CMR 2017 Notification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateViolation} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Hazard / Violation Category <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
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
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Colliery Beat / Area <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newArea}
                    onChange={e => setNewArea(e.target.value)}
                    placeholder="e.g. Pit Area - Sec B"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Severity Level <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="High">High / Imminent Danger</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="Low">Low / Minor Observation</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Hazard Description & Observations <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  required
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Detail the non-compliance, equipment numbers, workers involved, and immediate corrective directives issued..."
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, resize: "vertical", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Reporting Safety Officer
                </label>
                <input
                  type="text"
                  value={newReporter}
                  onChange={e => setNewReporter(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-1)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#dc2626", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(220,38,38,0.25)" }}
                >
                  <Plus size={15} /> Submit Violation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Hazard & Violation Reports · {colliery.cleanName}
          </h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>
            Active non-compliances, CAPA tracking and DGMS statutory audits for {colliery.cleanName}.
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
            background: "#dc2626", color: "white", border: "none",
            borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(220,38,38,0.25)",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={15} /> {t("btn.log_violation", "Log Violation")}
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Open Violations",    value: open,     color: "#dc2626", bg: "#fee2e2", tab: "Open" },
          { label: "In Remediation",     value: inProg,   color: "#ea580c", bg: "#fff7ed", tab: "In Progress" },
          { label: "Resolved / Closed",  value: resolved, color: "#16a34a", bg: "#dcfce7", tab: "Resolved" },
          { label: "High Severity",      value: high,     color: "#dc2626", bg: "#fff0f0", tab: "High" },
        ].map(c => (
          <div
            key={c.label}
            onClick={() => setActiveTab(activeTab === c.tab ? "All" : c.tab)}
            style={{
              background: "white",
              border: `1.5px solid ${activeTab === c.tab ? c.color : "var(--border)"}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
              boxShadow: activeTab === c.tab ? `0 4px 16px ${c.color}25` : "var(--shadow-xs)"
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.6 }} />
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 4px" }}>{c.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
            <div style={{ height: 4, marginTop: 10, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(c.value / Math.max(violationsList.length, 1)) * 100}%`, height: "100%", background: c.color, borderRadius: 2, transition: "width 0.8s ease" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 14 }}>

        {/* Violation Log */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>Violation Log ({filtered.length})</h3>
              {activeTab !== "All" && (
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "var(--surface-2)", color: "var(--text-secondary)", fontWeight: 700 }}>
                  Filtering: {activeTab}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {activeTab !== "All" && (
                <button
                  onClick={() => setActiveTab("All")}
                  style={{ background: "none", border: "none", fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, cursor: "pointer" }}
                >
                  Clear filter
                </button>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12.5, background: "var(--surface-1)" }}>
                <Search size={13} color="var(--text-muted)" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search violations…"
                  style={{ border: "none", outline: "none", fontSize: 12, color: "var(--text-primary)", background: "transparent", width: 140 }}
                />
              </div>
            </div>
          </div>

          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                <AlertTriangle size={24} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No violations match your filter criteria.</p>
              </div>
            ) : (
              filtered.map((v, i) => {
                const ss = statusStyle(v.status);
                const sv = severityStyle(v.severity);
                return (
                  <div
                    key={v.id}
                    style={{
                      padding: "14px 18px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--surface-2)" : "none",
                      transition: "background 0.12s ease",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-1)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "white")}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: v.severity === "High" ? "#fee2e2" : v.severity === "Medium" ? "#fff7ed" : "#f0fdf4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <AlertTriangle size={16} color={v.severity === "High" ? "#dc2626" : v.severity === "Medium" ? "#ea580c" : "#16a34a"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: "#2d6a4f" }}>{v.id}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{v.type}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: sv.bg, color: sv.color, border: sv.border as any, marginLeft: "auto" }}>
                          {v.severity}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: ss.bg, color: ss.color }}>
                          {ss.icon}{v.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 5px", lineHeight: 1.45 }}>{v.desc}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                        {v.area} · <strong style={{ color: "var(--text-secondary)" }}>{v.reporter}</strong> · {v.date}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* By Type Breakdown */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow-xs)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px", color: "var(--text-primary)" }}>Violations by Category</h3>
          {localTypeEntries.map(([type, count], i) => (
            <div key={type} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{type}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{count}</span>
              </div>
              <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(count / localMaxCount) * 100}%`,
                  background: i === 0 ? "#dc2626" : i === 1 ? "#ea580c" : "#2d6a4f",
                  borderRadius: 4, transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 22, padding: "14px 16px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fdba74" }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "#9a3412", margin: "0 0 4px" }}>⚠️ DGMS CMR Statutory Notice</p>
            <p style={{ fontSize: 12, color: "#7c2d12", margin: 0, lineHeight: 1.5 }}>
              <strong>{high} high-severity violations</strong> remain active. Compliance officer verification is mandated within 24 hours under DGMS circular guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
