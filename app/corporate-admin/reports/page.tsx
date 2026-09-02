"use client";
import { BarChart2, Download, FileText, Calendar, TrendingUp, Mountain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

const quarterlyData = [
  { q: "Q3 '24", compliance: 78, violations: 156, inspections: 382 },
  { q: "Q4 '24", compliance: 81, violations: 138, inspections: 410 },
  { q: "Q1 '25", compliance: 83, violations: 122, inspections: 436 },
  { q: "Q2 '25 (partial)", compliance: 84, violations: 119, inspections: 452 },
];

const perMineData = [
  { mine: "Rajpura",    score: 88 },
  { mine: "Naya Khadan",score: 72 },
  { mine: "Sundargarh", score: 91 },
  { mine: "Khetri",     score: 79 },
];

const reports = [
  { id: "CORP-018", title: "Q1 2025 Corporate Safety Summary",            type: "Quarterly",   date: "Apr 10, 2025", size: "8.2 MB", mines: 5 },
  { id: "CORP-017", title: "Annual ISO 45001 Audit Report – FY 2024-25",  type: "Annual",      date: "Mar 31, 2025", size: "14.6 MB",mines: 5 },
  { id: "CORP-016", title: "Q4 2024 Compliance Overview",                 type: "Quarterly",   date: "Jan 8, 2025",  size: "7.9 MB", mines: 5 },
  { id: "CORP-015", title: "May 2025 Cross-Site Violation Trends",        type: "Monthly",     date: "May 19, 2025", size: "3.1 MB", mines: 4 },
  { id: "CORP-014", title: "Environmental Impact Summary – H1 2024",      type: "Compliance",  date: "Jul 15, 2024", size: "5.7 MB", mines: 3 },
  { id: "CORP-013", title: "DGMS Regulatory Filing – FY 2024-25",        type: "Regulatory",  date: "Mar 25, 2025", size: "2.4 MB", mines: 5 },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  Quarterly:   { bg: "#eff6ff", color: "#2563eb" },
  Annual:      { bg: "#fdf4ff", color: "#9333ea" },
  Monthly:     { bg: "#e8f5ee", color: "#2d6a4f" },
  Compliance:  { bg: "#fefce8", color: "#ca8a04" },
  Regulatory:  { bg: "#fff7ed", color: "#ea580c" },
};

export default function ReportsPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Corporate Reports</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Portfolio-wide reports and analytics across all mine assets.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#1a3d28", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Generate Report
        </button>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Quarterly Trend */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Quarterly Performance</h3>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Compliance, Violations & Inspections – last 4 quarters</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={quarterlyData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="q" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }} />
              <Line dataKey="compliance"  stroke="#2d6a4f" strokeWidth={2.5} dot={{ r: 4, fill: "#2d6a4f", strokeWidth: 0 }} name="Compliance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Per-Mine Compliance */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Compliance by Site</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={perMineData} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mine" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }} />
              <Bar dataKey="score" fill="#2d6a4f" radius={[4, 4, 0, 0]} name="Compliance Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Library */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Corporate Report Library</h3>
        </div>
        {reports.map((r, i) => {
          const tc = typeColors[r.type] || typeColors.Monthly;
          return (
            <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < reports.length - 1 ? "1px solid #f9fafb" : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} color="#6b7280" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.title}</p>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>{r.type}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af" }}><Calendar size={10} />{r.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af" }}><Mountain size={10} />{r.mines} mine{r.mines > 1 ? "s" : ""}</span>
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
