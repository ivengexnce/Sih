"use client";

import { useState, useEffect } from "react";
import { storageService, AttendanceRecord } from "@/lib/storage";
import { ScanFace, Users, Clock, AlertTriangle, CheckCircle, Search, Filter, Calendar } from "lucide-react";

export default function MineManagerAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Present" | "Absent" | "Late">("All");

  const syncAttendance = () => {
    try {
      const data = storageService.getAttendance();
      setAttendance(data);
    } catch (e) {}
  };

  useEffect(() => {
    syncAttendance();
    window.addEventListener("storage", syncAttendance);
    window.addEventListener("focus", syncAttendance);
    return () => {
      window.removeEventListener("storage", syncAttendance);
      window.removeEventListener("focus", syncAttendance);
    };
  }, []);

  const total = attendance.length;
  const present = attendance.filter(a => a.status === "Present").length;
  const absent = attendance.filter(a => a.status === "Absent").length;
  const late = attendance.filter(a => a.status === "Late").length;
  const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;

  const filtered = attendance.filter(a => {
    const matchesFilter = filter === "All" || a.status === filter;
    const matchesQuery = !query || a.workerName.toLowerCase().includes(query.toLowerCase()) || a.workerId.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Worker Attendance Logs</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Facial recognition attendance synced from field inspectors.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(82,183,136,0.1)", borderRadius: 8, color: "#2d6a4f", fontSize: 12, fontWeight: 700 }}>
          <ScanFace size={14} /> LIVE BIOMETRIC SYNC
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Shift Roster", value: total.toString(), icon: <Users size={16} color="#2d6a4f" />, bg: "#e8f5ee" },
          { label: "Present Today", value: present.toString(), icon: <CheckCircle size={16} color="#16a34a" />, bg: "#dcfce7" },
          { label: "Marked Late", value: late.toString(), icon: <Clock size={16} color="#ea580c" />, bg: "#fff7ed" },
          { label: "Absentees", value: absent.toString(), icon: <AlertTriangle size={16} color="#dc2626" />, bg: "#fee2e2" },
        ].map((k, i) => (
          <div key={i} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "var(--shadow-xs)" }}>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{k.label}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{k.value}</p>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {k.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>Shift Turnout</div>
        <div style={{ flex: 1, height: 8, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${presentPct}%`, height: "100%", background: "#52b788", transition: "width 1s ease" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#2d6a4f" }}>{presentPct}%</div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafafa" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Present", "Late", "Absent"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: filter === f ? "#2d6a4f" : "transparent",
                  color: filter === f ? "white" : "#4b5563",
                  transition: "all 0.15s"
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1.5px solid var(--border)", borderRadius: 8, background: "white" }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or ID..."
              style={{ border: "none", outline: "none", fontSize: 12, width: 180 }}
            />
          </div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No attendance records found. Wait for inspectors to run facial sync.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Worker ID</th>
                  <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Name</th>
                  <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Location</th>
                  <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Time</th>
                  <th style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={`${a.id}-${i}`} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "#fcfdfc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px", fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{a.workerId}</td>
                    <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#4b5563" }}>{a.workerName}</td>
                    <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#4b5563" }}>{a.location}</td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#6b7280" }}>{new Date(a.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                        background: a.status === "Present" ? "#dcfce7" : a.status === "Late" ? "#fff7ed" : "#fee2e2",
                        color: a.status === "Present" ? "#16a34a" : a.status === "Late" ? "#ea580c" : "#dc2626"
                      }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
