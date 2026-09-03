"use client";
import { useState, useEffect } from "react";
import { Wrench, Plus, Search, AlertTriangle, CheckCircle, Clock, Gauge, Zap, Truck, Cog } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";
import { useTranslation } from "@/components/LanguageContext";

const equipment = [
  { id: "EQ-001", name: "CAT 789D Haul Truck",         type: "Transport",    location: "Pit Area",         status: "Operational",   uptime: 94, lastService: "May 10, 2025", nextService: "Jun 10, 2025", operator: "Deepak Kumar",  fuel: 82, hours: 12420 },
  { id: "EQ-002", name: "Komatsu PC2000 Excavator",    type: "Excavation",   location: "Pit Area – Sec A", status: "Operational",   uptime: 88, lastService: "Apr 28, 2025", nextService: "May 28, 2025", operator: "Anil Singh",    fuel: 65, hours: 8750  },
  { id: "EQ-003", name: "Joy 12CM30 Continuous Miner", type: "Mining",       location: "Underground L3",   status: "Maintenance",   uptime: 71, lastService: "May 19, 2025", nextService: "May 26, 2025", operator: "—",             fuel: 0,  hours: 6210  },
  { id: "EQ-004", name: "Atlas Copco Drill Rig",       type: "Drilling",     location: "Blasting Zone",    status: "Operational",   uptime: 91, lastService: "May 5, 2025",  nextService: "Jun 5, 2025",  operator: "Deepak Kumar",  fuel: 77, hours: 4380  },
  { id: "EQ-005", name: "Sandvik TH663 Truck",         type: "Transport",    location: "Haul Road",        status: "Idle",          uptime: 60, lastService: "May 15, 2025", nextService: "Jun 15, 2025", operator: "—",             fuel: 45, hours: 9870  },
  { id: "EQ-006", name: "McLanahan Jaw Crusher",       type: "Processing",   location: "Crusher Plant",    status: "Out of Service",uptime: 0,  lastService: "May 12, 2025", nextService: "TBD",          operator: "—",             fuel: 0,  hours: 15640 },
  { id: "EQ-007", name: "FLSmidth Belt Conveyor",      type: "Processing",   location: "Conveyor Area",    status: "Operational",   uptime: 97, lastService: "May 1, 2025",  nextService: "Jun 1, 2025",  operator: "Anil Singh",    fuel: 0,  hours: 22100 },
  { id: "EQ-008", name: "Sullair Air Compressor",      type: "Utilities",    location: "Surface",          status: "Maintenance",   uptime: 55, lastService: "May 19, 2025", nextService: "May 24, 2025", operator: "—",             fuel: 0,  hours: 11200 },
];

const statusConfig = {
  "Operational":    { color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={13} color="#16a34a" /> },
  "Maintenance":    { color: "#ea580c", bg: "#fff7ed", icon: <Clock size={13} color="#ea580c" /> },
  "Idle":           { color: "#6b7280", bg: "#f3f4f6", icon: <Gauge size={13} color="#6b7280" /> },
  "Out of Service": { color: "#dc2626", bg: "#fee2e2", icon: <AlertTriangle size={13} color="#dc2626" /> },
};

const typeIcons: Record<string, React.ReactNode> = {
  Transport:   <Truck size={15} color="#2d6a4f" />,
  Excavation:  <Cog size={15} color="#2563eb" />,
  Mining:      <Wrench size={15} color="#7c3aed" />,
  Drilling:    <Zap size={15} color="#ea580c" />,
  Processing:  <Cog size={15} color="#16a34a" />,
  Utilities:   <Gauge size={15} color="#6b7280" />,
};

export default function EquipmentPage() {
  const { t } = useTranslation();
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [equipmentList, setEquipmentList] = useState(equipment);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [type, setType] = useState("Transport");
  const [location, setLocation] = useState("Pit Area – Bench 2");
  const [status, setStatus] = useState("Operational");
  const [operator, setOperator] = useState("Deepak Kumar");
  const [fuel, setFuel] = useState(85);
  const [hours, setHours] = useState(4200);

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));

      const stored = localStorage.getItem("mineguard_custom_equipment");
      if (stored) {
        const parsed = JSON.parse(stored);
        setEquipmentList([...parsed, ...equipment]);
      }
    } catch (e) {}
  }, []);

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEq = {
      id: `EQ-0${Math.floor(10 + Math.random() * 90)}`,
      name: name.trim(),
      type,
      location: location.trim(),
      status,
      uptime: status === "Operational" ? 95 : status === "Maintenance" ? 65 : status === "Idle" ? 50 : 0,
      lastService: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      nextService: "Jun 20, 2025",
      operator: operator.trim() || "—",
      fuel: Number(fuel) || 80,
      hours: Number(hours) || 1200
    };

    const updated = [newEq, ...equipmentList];
    setEquipmentList(updated);

    try {
      const stored = localStorage.getItem("mineguard_custom_equipment");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("mineguard_custom_equipment", JSON.stringify([newEq, ...existing]));
    } catch (err) {}

    setShowModal(false);
    setName("");
    setToastMsg(`Equipment ${newEq.id} (${newEq.name}) successfully added to active colliery fleet!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const counts = { Operational: 0, Maintenance: 0, Idle: 0, "Out of Service": 0 };
  equipmentList.forEach(e => { counts[e.status as keyof typeof counts]++; });
  const avgUptime = Math.round(equipmentList.filter(e => e.status === "Operational").reduce((s, e) => s + e.uptime, 0) / Math.max(counts.Operational, 1));
  const filtered  = equipmentList.filter(eq => {
    const matchesTab = activeTab === "All" || eq.status === activeTab;
    const matchesQuery = !query || [eq.name, eq.type, eq.location, eq.status, eq.operator, eq.id].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );
    return matchesTab && matchesQuery;
  });

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

      {/* Add Equipment Modal */}
      {showModal && (
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
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(82,183,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench size={18} color="#2d6a4f" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Register Heavy Machinery</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>HEMM Telemetry & Maintenance Profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipment} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Equipment Model & Asset Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. BEML BH100 Dump Truck or Joy 12CM30 Miner"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Machinery Category <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="Transport">Transport (Haul / Dump Trucks)</option>
                    <option value="Excavation">Excavation (Shovels / Excavators)</option>
                    <option value="Mining">Mining (Continuous Miners / LHDs)</option>
                    <option value="Drilling">Drilling (Blast Hole Drill Rigs)</option>
                    <option value="Processing">Processing (Crushers / Conveyors)</option>
                    <option value="Utilities">Utilities (Air Compressors / Pumps)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Operational Status <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="Operational">Operational (Active Duty)</option>
                    <option value="Maintenance">Maintenance (Workshop)</option>
                    <option value="Idle">Idle (Standby)</option>
                    <option value="Out of Service">Out of Service (Breakdown)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Assigned Mine Section <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Pit Area – Sec A"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Designated Operator
                  </label>
                  <input
                    type="text"
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                    placeholder="e.g. Anil Singh"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Telemetry Fuel / Battery %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={fuel}
                    onChange={e => setFuel(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Total Engine Hours
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-1)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#2d6a4f", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(45,106,79,0.3)" }}
                >
                  <Plus size={15} /> Add to Fleet
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
            Heavy Machinery & Fleet · {colliery.cleanName}
          </h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>
            Real-time equipment availability, telemetry, and uptime for {colliery.cleanName} ({colliery.subsidiary}).
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,79,0.25)", transition: "all 0.15s ease" }}
        >
          <Plus size={15} /> {t("btn.add_equipment", "Add Equipment")}
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Operational",    value: counts.Operational,      color: "#16a34a", bg: "#dcfce7", tab: "Operational" },
          { label: "Maintenance",    value: counts.Maintenance,      color: "#ea580c", bg: "#fff7ed", tab: "Maintenance" },
          { label: "Idle Standby",   value: counts.Idle,             color: "#6b7280", bg: "#f3f4f6", tab: "Idle" },
          { label: "Out of Service", value: counts["Out of Service"], color: "#dc2626", bg: "#fee2e2", tab: "Out of Service" },
          { label: "Fleet Uptime",   value: `${avgUptime}%`,         color: "#2d6a4f", bg: "#e8f5ee", tab: "All" },
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
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 4px" }}>{c.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1.1 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Fleet Table */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>Active Fleet Telemetry ({filtered.length})</h3>
            {activeTab !== "All" && (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 12, background: "var(--surface-2)", color: "var(--text-secondary)", fontWeight: 700 }}>
                Filtering: {activeTab}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search equipment…" style={{ border: "none", outline: "none", fontSize: 12, color: "var(--text-primary)", background: "transparent", width: 160 }} />
            </div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {["Asset ID", "Equipment Name", "Category", "Assigned Section", "Operator", "Uptime %", "Engine Hours", "Last Service", "Telemetry Status"].map(h => (
                <th key={h} style={{ padding: "12px 14px", fontWeight: 700, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq, i) => {
              const sc = statusConfig[eq.status as keyof typeof statusConfig] || { color: "#6b7280", bg: "#f3f4f6", icon: null };
              return (
                <tr
                  key={eq.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--surface-2)" : "none", transition: "background 0.12s ease", cursor: "pointer" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-1)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "white")}
                >
                  <td style={{ padding: "13px 14px", fontSize: 12, fontWeight: 800, color: "#2d6a4f" }}>{eq.id}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{eq.name}</td>
                  <td style={{ padding: "13px 14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "var(--text-secondary)" }}>
                      {typeIcons[eq.type]} {eq.type}
                    </span>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12.5, color: "var(--text-muted)" }}>{eq.location}</td>
                  <td style={{ padding: "13px 14px", fontSize: 12.5, color: eq.operator === "—" ? "var(--text-faint)" : "var(--text-primary)", fontWeight: eq.operator === "—" ? 400 : 600 }}>{eq.operator}</td>
                  <td style={{ padding: "13px 14px", minWidth: 90 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: eq.uptime > 80 ? "#16a34a" : eq.uptime > 50 ? "#ea580c" : "#dc2626" }}>{eq.uptime}%</span>
                      </div>
                      <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${eq.uptime}%`, background: eq.uptime > 80 ? "#52b788" : eq.uptime > 50 ? "#f4a261" : "#dc2626", borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 600 }}>{eq.hours.toLocaleString()} h</td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "var(--text-muted)" }}>{eq.lastService}</td>
                  <td style={{ padding: "13px 14px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: sc.bg, color: sc.color }}>
                      {sc.icon} {eq.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
