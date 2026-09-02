"use client";
import { BarChart2, Plus, Download, FileText, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const monthlyData = [
  { month: "Nov", inspections: 98,  violations: 42, compliance: 74 },
  { month: "Dec", inspections: 104, violations: 36, compliance: 78 },
  { month: "Jan", inspections: 110, violations: 31, compliance: 81 },
  { month: "Feb", inspections: 108, violations: 29, compliance: 83 },
  { month: "Mar", inspections: 119, violations: 25, compliance: 85 },
  { month: "Apr", inspections: 122, violations: 30, compliance: 84 },
  { month: "May", inspections: 126, violations: 28, compliance: 88 },
];

const reports = [
  { id: "RPT-031", title: "May 2025 Monthly Safety Report",           type: "Monthly",     date: "May 19, 2025", size: "2.4 MB",  status: "Published" },
  { id: "RPT-030", title: "Q1 2025 Compliance Summary",               type: "Quarterly",   date: "Apr 5, 2025",  size: "5.1 MB",  status: "Published" },
  { id: "RPT-029", title: "Ventilation System Audit Report",          type: "Audit",       date: "May 17, 2025", size: "1.8 MB",  status: "Published" },
  { id: "RPT-028", title: "April 2025 Violation Trend Analysis",      type: "Monthly",     date: "May 2, 2025",  size: "1.2 MB",  status: "Published" },
  { id: "RPT-027", title: "Equipment Maintenance Log – Q1 2025",      type: "Operational", date: "Apr 8, 2025",  size: "3.3 MB",  status: "Published" },
  { id: "RPT-026", title: "June 2025 Inspection Schedule (Draft)",    type: "Schedule",    date: "May 19, 2025", size: "0.8 MB",  status: "Draft" },
  { id: "RPT-025", title: "ISO 45001 Gap Analysis – Rajpura Mine",   type: "Compliance",  date: "Mar 22, 2025", size: "4.7 MB",  status: "Published" },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  Monthly:     { bg: "#e8f5ee", color: "#2d6a4f" },
  Quarterly:   { bg: "#eff6ff", color: "#2563eb" },
  Audit:       { bg: "#fdf4ff", color: "#9333ea" },
  Operational: { bg: "#fff7ed", color: "#ea580c" },
  Schedule:    { bg: "#f0fdf4", color: "#16a34a" },
  Compliance:  { bg: "#fefce8", color: "#ca8a04" },
};

export default function ReportsPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Reports</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Generate and view compliance and safety reports.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Generate Report
        </button>
      </div>

      {/* Chart */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Monthly Performance Trends</h3>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Inspections, Violations & Compliance Score – Last 7 months</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Inspections", color: "#2d6a4f" },
              { label: "Violations",  color: "#e63946" },
              { label: "Compliance%", color: "#f4a261" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} barCategoryGap="30%" barGap={4} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }} />
            <Bar dataKey="inspections" fill="#2d6a4f" radius={[3, 3, 0, 0]} />
            <Bar dataKey="violations"  fill="#e63946" radius={[3, 3, 0, 0]} />
            <Bar dataKey="compliance"  fill="#f4a261" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Compliance Score – May", value: "88%",     trend: "↑ 6.4%", positive: true },
          { label: "Total Inspections – May", value: "126",    trend: "↑ 10.2%", positive: true },
          { label: "Open Violations – May",   value: "28",     trend: "↓ 7.1%", positive: false },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginTop: 4 }}>{s.value}</p>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: s.positive ? "#16a34a" : "#dc2626", background: s.positive ? "#dcfce7" : "#fee2e2", padding: "5px 10px", borderRadius: 8 }}>
              <TrendingUp size={11} style={{ display: "inline", marginRight: 3 }} />{s.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Report Library */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Report Library</h3>
        </div>
        {reports.map((r, i) => {
          const tc = typeColors[r.type] || typeColors.Monthly;
          return (
            <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < reports.length - 1 ? "1px solid #f9fafb" : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} color="#6b7280" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.title}</span>
                  {r.status === "Draft" && (
                    <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: "#fff7ed", color: "#ea580c" }}>Draft</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                  <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>{r.type}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af" }}><Calendar size={10} />{r.date}</span>
                  <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{r.size}</span>
                </div>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: "#374151", background: "white", cursor: "pointer" }}>
                <Download size={13} /> Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
