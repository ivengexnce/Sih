"use client";

import { useState } from "react";
import {
  LayoutDashboard, Mountain, ShieldCheck, BarChart2,
  Users, Settings, Bell, ChevronDown, TrendingUp,
  TrendingDown, ArrowRight, Info, LogOut, AlertTriangle,
  CheckCircle, XCircle, Globe, FileText
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",  active: true,  href: "/corporate-admin" },
  { icon: Mountain,        label: "Mines",       active: false, href: "/corporate-admin/mines" },
  { icon: ShieldCheck,     label: "Compliance",  active: false, href: "/corporate-admin/compliance" },
  { icon: BarChart2,       label: "Reports",     active: false, href: "/corporate-admin/reports" },
  { icon: Users,           label: "Team",        active: false, href: "/corporate-admin/team" },
  { icon: Settings,        label: "Settings",    active: false, href: "#" },
];

const complianceData = [
  { month: "Jan", score: 72 }, { month: "Feb", score: 75 },
  { month: "Mar", score: 78 }, { month: "Apr", score: 74 },
  { month: "May", score: 80 }, { month: "Jun", score: 83 },
  { month: "Jul", score: 81 }, { month: "Aug", score: 85 },
  { month: "Sep", score: 88 },
];

const minePerformance = [
  { name: "Rajpura",  compliance: 88, risk: "Low" },
  { name: "Dhanbad",  compliance: 74, risk: "High" },
  { name: "Korba",    compliance: 91, risk: "Low" },
  { name: "Singrauli",compliance: 67, risk: "High" },
  { name: "Talcher",  compliance: 82, risk: "Medium" },
  { name: "Gevra",    compliance: 79, risk: "Medium" },
];

const riskDist = [
  { name: "High",   value: 3, color: "#e63946" },
  { name: "Medium", value: 2, color: "#f4a261" },
  { name: "Low",    value: 1, color: "#52b788" },
];

const violations = [
  { mine: "Dhanbad Coal Mine",   type: "PPE Non-Compliance",  severity: "High",   date: "Sep 2, 2026" },
  { mine: "Singrauli Block",     type: "Fire Safety",         severity: "High",   date: "Sep 1, 2026" },
  { mine: "Talcher Central",     type: "Housekeeping",        severity: "Medium", date: "Aug 31, 2026" },
  { mine: "Gevra East",          type: "Equipment Check",     severity: "Low",    date: "Aug 30, 2026" },
];

const sparkData = {
  mines:       [4,5,5,6,6,6,6,6,6,6,6,6],
  compliance:  [68,70,72,74,76,78,80,82,84,86,87,88],
  violations:  [42,38,44,50,35,30,32,26,30,28,24,22],
  inspections: [80,95,88,100,112,108,120,115,125,118,128,134],
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ x: i, y: v }));
  const id = `ca${color.replace("#","")}`;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.8} fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ icon, label, value, change, positive, sparkData, sparkColor, iconBg }:
  { icon: React.ReactNode; label: string; value: string; change: string;
    positive: boolean; sparkData: number[]; sparkColor: string; iconBg: string }) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "18px 18px 14px", border: "1px solid #e5e7eb", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginTop: 2 }}>{value}</p>
          <p style={{ fontSize: 11.5, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
            {positive ? <TrendingUp size={12} color="#16a34a" /> : <TrendingDown size={12} color="#dc2626" />}
            <span style={{ color: positive ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{change}</span>
            <span style={{ color: "#9ca3af" }}>vs last month</span>
          </p>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

export default function CorporateAdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf9", fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 216, minHeight: "100vh", background: "#0f2318", display: "flex", flexDirection: "column" as const, flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#52b788", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 16L10 4L17 16H3Z" fill="white" fillOpacity="0.9"/>
                <path d="M7 16L10 10L13 16H7Z" fill="white" fillOpacity="0.45"/>
              </svg>
            </div>
            <div>
              <p style={{ color: "white", fontSize: 13.5, fontWeight: 700, letterSpacing: "0.04em" }}>SAFE MINES</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em" }}>CORPORATE ADMIN</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ icon: Icon, label, active, href }) => (
            <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: active ? "white" : "rgba(255,255,255,0.55)", background: active ? "#1a3d28" : "transparent", fontSize: 13.5, fontWeight: 500, marginBottom: 2, textDecoration: "none" }}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <a href="/login" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
            <LogOut size={16} strokeWidth={1.8} />
            <span>Sign out</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" as const }}>

        {/* Topbar */}
        <header style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Corporate Overview 🏢</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Portfolio-wide safety and compliance across all mines.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white" }}>
              <Globe size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>All Mines</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
            <div style={{ position: "relative" as const }}>
              <div style={{ width: 38, height: 38, border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer" }}>
                <Bell size={16} color="#374151" />
              </div>
              <div style={{ position: "absolute" as const, top: -4, right: -4, width: 18, height: 18, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>5</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1a3d28", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>CA</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Corp. Admin</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>Administrator</p>
              </div>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
          </div>
        </header>

        <div style={{ padding: "22px 28px", overflowY: "auto" as const, flex: 1 }}>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <StatCard icon={<Mountain size={18} color="white" />} label="Total Mines" value="6" change="1 added" positive={true} sparkData={sparkData.mines} sparkColor="#52b788" iconBg="#2d6a4f" />
            <StatCard icon={<ShieldCheck size={18} color="white" />} label="Avg Compliance" value="88%" change="4.2%" positive={true} sparkData={sparkData.compliance} sparkColor="#52b788" iconBg="#2d6a4f" />
            <StatCard icon={<AlertTriangle size={18} color="white" />} label="Open Violations" value="22" change="8.3%" positive={false} sparkData={sparkData.violations} sparkColor="#e63946" iconBg="#e63946" />
            <StatCard icon={<FileText size={18} color="white" />} label="Inspections" value="134" change="12.6%" positive={true} sparkData={sparkData.inspections} sparkColor="#52b788" iconBg="#2d6a4f" />
          </div>

          {/* Middle row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 20 }}>

            {/* Compliance Trend */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Portfolio Compliance Trend</span>
                  <Info size={13} color="#9ca3af" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2d6a4f" }}>88%</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={complianceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, "Compliance"]} contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="#2d6a4f" strokeWidth={2.5} dot={{ fill: "#2d6a4f", r: 4, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Distribution */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Risk Distribution</span>
                <Info size={13} color="#9ca3af" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative" as const, width: 130, height: 130, flexShrink: 0 }}>
                  <PieChart width={130} height={130}>
                    <Pie data={riskDist} cx={60} cy={60} innerRadius={42} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                      {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                  <div style={{ position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>6</span>
                    <span style={{ fontSize: 10, color: "#6b7280" }}>Mines</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {riskDist.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: d.color }} />
                      <span style={{ fontSize: 12.5, color: "#4b5563", flex: 1 }}>{d.name} Risk</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mine Performance Table + Violations */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>

            {/* Mine Performance */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Mine Performance</h3>
                <button style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  View All <ArrowRight size={13} />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: 0 }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>MINE</p>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>COMPLIANCE</p>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, paddingBottom: 8, borderBottom: "1px solid #f3f4f6", textAlign: "right" as const }}>RISK</p>
                {minePerformance.map((mine, i) => (
                  <>
                    <p key={`n${i}`} style={{ fontSize: 13, fontWeight: 600, padding: "11px 0", borderBottom: "1px solid #f3f4f6" }}>{mine.name}</p>
                    <div key={`c${i}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 8px 11px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${mine.compliance}%`, background: mine.compliance >= 85 ? "#52b788" : mine.compliance >= 75 ? "#f4a261" : "#e63946", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", minWidth: 32 }}>{mine.compliance}%</span>
                    </div>
                    <div key={`r${i}`} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: mine.risk === "High" ? "#fee2e2" : mine.risk === "Medium" ? "#fff7ed" : "#dcfce7", color: mine.risk === "High" ? "#dc2626" : mine.risk === "Medium" ? "#ea580c" : "#16a34a" }}>{mine.risk}</span>
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* Recent Violations */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Violations</h3>
                <button style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  View All <ArrowRight size={13} />
                </button>
              </div>
              {violations.map((v, i) => (
                <div key={i} style={{ padding: "11px 0", borderBottom: i < violations.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{v.type}</p>
                      <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{v.mine}</p>
                      <p style={{ fontSize: 11, color: "#b0b8c1", marginTop: 1 }}>{v.date}</p>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: v.severity === "High" ? "#fee2e2" : v.severity === "Medium" ? "#fff7ed" : "#dcfce7", color: v.severity === "High" ? "#dc2626" : v.severity === "Medium" ? "#ea580c" : "#16a34a", flexShrink: 0 }}>{v.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
