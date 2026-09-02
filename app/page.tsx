"use client";

import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  LayoutDashboard, Mountain, ClipboardCheck, AlertTriangle,
  ListChecks, BarChart2, Users, Wrench, FileText, Settings,
  Bell, ChevronDown, TrendingUp, TrendingDown, ArrowRight,
  Calendar, CalendarCheck, UserPlus, BarChart3,
  PlusCircle, ShieldAlert, Info
} from "lucide-react";

const complianceData = [
  { day: "May 13", v: 52 }, { day: "May 14", v: 58 }, { day: "May 15", v: 75 },
  { day: "May 16", v: 60 }, { day: "May 17", v: 76 }, { day: "May 18", v: 80 },
  { day: "May 19", v: 88 },
];

const statSparklines = {
  inspections: [40,55,48,60,72,68,80,75,90,88,100,126],
  violations:  [42,38,44,50,35,30,28,32,26,30,28,28],
  actions:     [22,18,20,17,19,16,18,15,17,16,16,16],
  highrisk:    [28,25,22,26,20,24,20,22,18,20,18,18],
  compliance:  [60,65,70,68,72,78,75,80,82,85,84,88],
};

const riskData = [
  { name: "High Risk",   value: 6, color: "#e63946" },
  { name: "Medium Risk", value: 7, color: "#f4a261" },
  { name: "Low Risk",    value: 5, color: "#52b788" },
];

const actionsData = [
  { name: "Overdue",  value: 6, color: "#e63946" },
  { name: "Due Soon", value: 7, color: "#f4a261" },
  { name: "On Track", value: 3, color: "#52b788" },
];

const violationsData = [
  { name: "PPE Non-Compliance", count: 12 },
  { name: "Fire Safety",        count: 8 },
  { name: "Housekeeping",       count: 6 },
  { name: "Equipment",          count: 4 },
  { name: "Ventilation",        count: 3 },
];

const violationColors = ["#e63946","#f4a261","#f4a261","#52b788","#52b788"];

const recentInspections = [
  { area: "Pit Area",        date: "May 19, 2025", time: "10:15 AM", status: "Compliant" },
  { area: "Workshop",        date: "May 19, 2025", time: "09:31 AM", status: "Non-Compliant" },
  { area: "Conveyor Belt",   date: "May 18, 2025", time: "05:45 PM", status: "Compliant" },
  { area: "Electrical Room", date: "May 18, 2025", time: "03:08 PM", status: "Partial" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   active: true },
  { icon: Mountain,        label: "Mines" },
  { icon: ClipboardCheck,  label: "Inspections" },
  { icon: AlertTriangle,   label: "Violations" },
  { icon: ListChecks,      label: "Actions" },
  { icon: BarChart2,       label: "Reports" },
  { icon: Users,           label: "Team" },
  { icon: Wrench,          label: "Equipment" },
  { icon: FileText,        label: "Documents" },
  { icon: Settings,        label: "Settings" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ x: i, y: v }));
  const id = `sp${color.replace("#","")}`;
  return (
    <ResponsiveContainer width="100%" height={42}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.8}
          fill={`url(#${id})`} dot={false} />
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginTop: 2 }}>{value}</p>
          <p style={{ fontSize: 11.5, marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}>
            {positive ? <TrendingUp size={12} color="#16a34a" /> : <TrendingDown size={12} color="#dc2626" />}
            <span style={{ color: positive ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{change}</span>
            <span style={{ color: "#9ca3af" }}>vs last 7 days</span>
          </p>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

function DonutChart({ data, center }: { data: { name: string; value: number; color: string }[]; center: { value: number; label: string } }) {
  return (
    <div style={{ position: "relative" as const, width: 140, height: 140, flexShrink: 0 }}>
      <PieChart width={140} height={140}>
        <Pie data={data} cx={65} cy={65} innerRadius={46} outerRadius={65}
          dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      <div style={{ position: "absolute" as const, inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{center.value}</span>
        <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 500 }}>{center.label}</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, color: "#4b5563", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{count}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf9" }}>

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
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em" }}>MINE MANAGER</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ icon: Icon, label, active }) => (
            <a key={label} href="#" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, cursor: "pointer",
              color: active ? "white" : "rgba(255,255,255,0.55)",
              background: active ? "#1a3d28" : "transparent",
              fontSize: 13.5, fontWeight: 500, marginBottom: 2,
              textDecoration: "none", transition: "background 0.15s"
            }}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div style={{ padding: "14px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>MM</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontSize: 12.5, fontWeight: 600 }}>Mine Manager</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Rajpura Coal Mine</p>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.35)" />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Welcome back, Mine Manager 👋</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Here&apos;s the status of Rajpura Coal Mine and ongoing operations.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" }}>
              <Mountain size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Rajpura Coal Mine</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
            <div style={{ position: "relative" as const }}>
              <div style={{ width: 38, height: 38, border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "white" }}>
                <Bell size={16} color="#374151" />
              </div>
              <div style={{ position: "absolute" as const, top: -4, right: -4, width: 18, height: 18, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>8</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" }}>
              <Calendar size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>May 12 – May 19, 2025</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "22px 28px", overflowY: "auto" as const, flex: 1 }}>

          {/* Stat Cards Row */}
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Total Inspections" value="126" change="10.2%" positive={true} sparkData={statSparklines.inspections} sparkColor="#52b788" iconBg="#2d6a4f" />
            <StatCard icon={<AlertTriangle size={18} color="white" />} label="Open Violations" value="28" change="7.1%" positive={false} sparkData={statSparklines.violations} sparkColor="#f4a261" iconBg="#d97706" />
            <StatCard icon={<ListChecks size={18} color="white" />} label="Pending Actions" value="16" change="3.1%" positive={false} sparkData={statSparklines.actions} sparkColor="#6b7280" iconBg="#6b7280" />
            <StatCard icon={<ShieldAlert size={18} color="white" />} label="High Risk Issues" value="18" change="5.6%" positive={false} sparkData={statSparklines.highrisk} sparkColor="#e63946" iconBg="#e63946" />
            <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Compliance Score" value="88%" change="6.4%" positive={true} sparkData={statSparklines.compliance} sparkColor="#52b788" iconBg="#2d6a4f" />
          </div>

          {/* Middle Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1.1fr", gap: 14, marginBottom: 20 }}>

            {/* Compliance Trend */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Compliance Trend</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>(Last 7 Days)</span>
                  <Info size={13} color="#9ca3af" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2d6a4f" }}>88%</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={complianceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} ticks={[0,25,50,75,100]} />
                  <Tooltip formatter={(v) => [`${v}%`, "Compliance"]} contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
                  <Line type="monotone" dataKey="v" stroke="#2d6a4f" strokeWidth={2.5} dot={{ fill: "#2d6a4f", r: 4, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Summary */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Risk Summary</span>
                <Info size={13} color="#9ca3af" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DonutChart data={riskData} center={{ value: 18, label: "Total Risks" }} />
                <div style={{ flex: 1 }}>
                  {riskData.map(d => <LegendRow key={d.name} color={d.color} label={d.name} count={d.value} />)}
                </div>
              </div>
            </div>

            {/* Mines Overview */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Mines Overview</span>
                <Info size={13} color="#9ca3af" />
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {/* India map SVG */}
                <div style={{ flex: 1, position: "relative" as const }}>
                  <svg viewBox="0 0 200 240" style={{ width: "100%", height: 150 }}>
                    <path d="M100,8 L135,22 L155,52 L162,82 L148,106 L140,128 L154,152 L146,180 L130,198 L110,214 L100,220 L90,214 L70,198 L54,180 L46,152 L60,128 L52,106 L38,82 L45,52 L65,22 Z"
                      fill="#e8f5ee" stroke="#2d6a4f" strokeWidth="1.5"/>
                    {[
                      {cx:90,cy:60,c:"#e63946"},{cx:115,cy:90,c:"#e63946"},{cx:82,cy:110,c:"#f4a261"},
                      {cx:105,cy:120,c:"#f4a261"},{cx:92,cy:148,c:"#52b788"},{cx:78,cy:80,c:"#e63946"},
                    ].map((d,i) => (
                      <circle key={i} cx={d.cx} cy={d.cy} r="6" fill={d.c} stroke="white" strokeWidth="2"/>
                    ))}
                  </svg>
                </div>
                <div>
                  <LegendRow color="#e63946" label="High Risk"   count={3} />
                  <LegendRow color="#f4a261" label="Medium Risk" count={2} />
                  <LegendRow color="#52b788" label="Low Risk"    count={1} />
                </div>
              </div>
              <button style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All Mines <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.9fr", gap: 14, marginBottom: 20 }}>

            {/* Recent Inspections */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Inspections</h3>
              {recentInspections.map((insp, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < recentInspections.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600 }}>Inspection – {insp.area}</p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{insp.date} &nbsp;|&nbsp; {insp.time}</p>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20,
                    fontSize: 12, fontWeight: 600,
                    background: insp.status === "Compliant" ? "#dcfce7" : insp.status === "Non-Compliant" ? "#fee2e2" : "#fff7ed",
                    color: insp.status === "Compliant" ? "#16a34a" : insp.status === "Non-Compliant" ? "#dc2626" : "#ea580c",
                    border: insp.status === "Compliant" ? "none" : insp.status === "Non-Compliant" ? "1px solid #fca5a5" : "1px solid #fdba74"
                  }}>
                    {insp.status}
                  </span>
                </div>
              ))}
              <button style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All Inspections <ArrowRight size={13} />
              </button>
            </div>

            {/* Top Violations */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Top Violations</h3>
              {violationsData.map((v, i) => (
                <div key={v.name} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, color: "#374151" }}>{v.name}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{v.count}</span>
                  </div>
                  <div style={{ height: 7, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(v.count / 12) * 100}%`, background: violationColors[i], borderRadius: 4 }} />
                  </div>
                </div>
              ))}
              <button style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All Violations <ArrowRight size={13} />
              </button>
            </div>

            {/* Actions Summary */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Actions Summary</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DonutChart data={actionsData} center={{ value: 16, label: "Pending" }} />
                <div style={{ flex: 1 }}>
                  {actionsData.map(d => <LegendRow key={d.name} color={d.color} label={d.name} count={d.value} />)}
                </div>
              </div>
              <button style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All Actions <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick Actions + Equipment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Quick Actions */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h3>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: CalendarCheck, label: "Schedule Inspection" },
                  { icon: AlertTriangle, label: "Add Violation" },
                  { icon: UserPlus,      label: "Assign Action" },
                  { icon: BarChart3,     label: "View Reports" },
                  { icon: PlusCircle,    label: "Raise Request" },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8, padding: "16px 10px", background: "white", border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", flex: 1, transition: "border-color 0.15s" }}>
                    <div style={{ width: 44, height: 44, background: "#2d6a4f", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color="white" strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, textAlign: "center" as const, lineHeight: 1.3 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Status */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Equipment Status</h3>
                <Info size={13} color="#9ca3af" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { label: "Operational",    pct: 78, color: "#52b788", emoji: "🚛" },
                  { label: "Maintenance",    pct: 15, color: "#f4a261", emoji: "🔧" },
                  { label: "Idle",           pct: 5,  color: "#6b7280", emoji: "⏸️" },
                  { label: "Out of Service", pct: 2,  color: "#e63946", emoji: "❌" },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" as const }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{item.emoji}</div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.pct}%</p>
                    <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                View All Equipment <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
