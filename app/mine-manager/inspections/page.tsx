"use client";
import { useState, useEffect } from "react";
import { ClipboardCheck, Plus, Search, Filter, ChevronRight, CheckCircle, XCircle, AlertCircle, Calendar, User } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

const inspections = [
  { id: "INS-041", area: "Pit Area – Section A", inspector: "R. Sharma",  date: "May 19, 2025", time: "10:15 AM", status: "Compliant",     severity: "Low",    findings: 2  },
  { id: "INS-040", area: "Workshop – Bay 3",     inspector: "P. Gupta",   date: "May 19, 2025", time: "09:31 AM", status: "Non-Compliant", severity: "High",   findings: 7  },
  { id: "INS-039", area: "Conveyor Belt – Line 2",inspector: "R. Sharma", date: "May 18, 2025", time: "05:45 PM", status: "Compliant",     severity: "Low",    findings: 1  },
  { id: "INS-038", area: "Electrical Room",      inspector: "S. Mehta",   date: "May 18, 2025", time: "03:08 PM", status: "Partial",       severity: "Medium", findings: 4  },
  { id: "INS-037", area: "Explosives Magazine",  inspector: "K. Patel",   date: "May 17, 2025", time: "11:00 AM", status: "Compliant",     severity: "Low",    findings: 0  },
  { id: "INS-036", area: "Ventilation Shaft",    inspector: "P. Gupta",   date: "May 17, 2025", time: "08:30 AM", status: "Non-Compliant", severity: "High",   findings: 9  },
  { id: "INS-035", area: "Worker Rest Area",     inspector: "S. Mehta",   date: "May 16, 2025", time: "02:15 PM", status: "Compliant",     severity: "Low",    findings: 1  },
  { id: "INS-034", area: "Crusher Plant",        inspector: "R. Sharma",  date: "May 15, 2025", time: "04:00 PM", status: "Partial",       severity: "Medium", findings: 3  },
];

const upcoming = [
  { area: "Main Haul Road",       inspector: "R. Sharma",  date: "May 20, 2025", time: "09:00 AM" },
  { area: "Coal Handling Plant",  inspector: "K. Patel",   date: "May 21, 2025", time: "10:30 AM" },
  { area: "Explosives Magazine",  inspector: "S. Mehta",   date: "May 22, 2025", time: "08:00 AM" },
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

export default function InspectionsPage() {
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setColliery(getCollieryProfile(mine));
    } catch (e) {}
  }, []);

  const compliant    = inspections.filter(i => i.status === "Compliant").length;
  const nonCompliant = inspections.filter(i => i.status === "Non-Compliant").length;
  const partial      = inspections.filter(i => i.status === "Partial").length;
  const filtered     = inspections.filter(ins =>
    !query || [ins.id, ins.area, ins.inspector, ins.status, ins.severity].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

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
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Schedule Inspection
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total This Month", value: inspections.length, color: "#2d6a4f", bg: "#f0fdf4", icon: <ClipboardCheck size={18} color="#2d6a4f" /> },
          { label: "Compliant",        value: compliant,    color: "#16a34a", bg: "#f0fdf4", icon: <CheckCircle size={18} color="#16a34a" /> },
          { label: "Non-Compliant",    value: nonCompliant, color: "#dc2626", bg: "#fee2e2", icon: <XCircle size={18} color="#dc2626" /> },
          { label: "Partial",          value: partial,      color: "#ea580c", bg: "#fff7ed", icon: <AlertCircle size={18} color="#ea580c" /> },
        ].map(card => (
          <div key={card.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
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
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Inspections</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5 }}>
                <Search size={13} color="#9ca3af" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search inspections…" style={{ border: "none", outline: "none", fontSize: 12.5, color: "#374151", background: "transparent", width: 150 }} />
              </div>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["ID", "Area", "Inspector", "Date", "Severity", "Findings", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#6b7280", textAlign: "left", letterSpacing: "0.03em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins, i) => {
                const ss = statusStyle(ins.status);
                const sv = severityStyle(ins.severity);
                return (
                  <tr key={ins.id} style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12.5, fontWeight: 600, color: "#2d6a4f" }}>{ins.id}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{ins.area}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#2d6a4f" }}>
                          {ins.inspector.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span style={{ fontSize: 12.5, color: "#374151" }}>{ins.inspector}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{ins.date}<br /><span style={{ fontSize: 11 }}>{ins.time}</span></td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: sv.bg, color: sv.color }}>{ins.severity}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: ins.findings > 4 ? "#dc2626" : "#374151" }}>{ins.findings}</td>
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

        {/* Upcoming Inspections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Upcoming Inspections</h3>
            {upcoming.map((u, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < upcoming.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={16} color="#2d6a4f" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{u.area}</p>
                  <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <User size={11} /> {u.inspector} · {u.date} {u.time}
                  </p>
                </div>
                <ChevronRight size={14} color="#9ca3af" style={{ marginLeft: "auto", alignSelf: "center" }} />
              </div>
            ))}
          </div>

          {/* Compliance Summary */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Compliance Rate</h3>
            {[
              { label: "Compliant",     count: compliant,    total: inspections.length, color: "#52b788" },
              { label: "Partial",       count: partial,      total: inspections.length, color: "#f4a261" },
              { label: "Non-Compliant", count: nonCompliant, total: inspections.length, color: "#e63946" },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, color: "#374151" }}>{row.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{Math.round((row.count / row.total) * 100)}%</span>
                </div>
                <div style={{ height: 7, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(row.count / row.total) * 100}%`, background: row.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
