"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Search, Filter, Clock, CheckCircle } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

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
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));
    } catch (e) {}
  }, []);

  const open     = violations.filter(v => v.status === "Open").length;
  const inProg   = violations.filter(v => v.status === "In Progress").length;
  const resolved = violations.filter(v => v.status === "Resolved").length;
  const high     = violations.filter(v => v.severity === "High").length;
  const filtered = violations.filter(v =>
    !query || [v.type, v.area, v.id, v.desc, v.status, v.severity].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

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
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#e63946", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Log Violation
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
              <div style={{ width: `${(c.value / violations.length) * 100}%`, height: "100%", background: c.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 14 }}>

        {/* Violation Log */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Violation Log</h3>
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
                <div key={v.id} style={{ padding: "14px 20px", borderBottom: i < violations.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}>
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
          {typeEntries.map(([type, count], i) => (
            <div key={type} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, color: "#374151" }}>{type}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{count}</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / maxCount) * 100}%`, background: i === 0 ? "#e63946" : i === 1 ? "#f4a261" : "#6b7280", borderRadius: 4, transition: "width 0.3s" }} />
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
