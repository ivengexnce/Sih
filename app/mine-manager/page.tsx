"use client";

import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  ClipboardCheck, AlertTriangle, ListChecks, ArrowRight,
  TrendingUp, TrendingDown, Info, CalendarCheck, UserPlus, BarChart3,
  PlusCircle, ShieldAlert, BrainCircuit, Sparkles, Activity, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AiRiskModal, { AiRiskTarget } from "@/app/components/AiRiskModal";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

// Data
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

// Components
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
        <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.8} fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ icon, label, value, change, positive, sparkData, sparkColor, iconBg }: any) {
  return (
    <div style={{ background: "white", borderRadius: 12, padding: "18px 18px 14px", border: "1px solid #e5e7eb", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
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

function DonutChart({ data, center }: any) {
  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <PieChart width={140} height={140}>
        <Pie data={data} cx={65} cy={65} innerRadius={46} outerRadius={65} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
          {data.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{center.value}</span>
        <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 500 }}>{center.label}</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, count }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, color: "#4b5563", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{count}</span>
    </div>
  );
}

export default function Dashboard() {
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine (SECL)");
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [selectedAiTarget, setSelectedAiTarget] = useState<AiRiskTarget | null>(null);

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      setAllocatedMine(mine);
      setColliery(getCollieryProfile(mine));
    } catch (e) {}
  }, []);

  const highestRiskSection = colliery.sections.find(s => s.risk === "High") || colliery.sections[0];

  return (
    <>
      {/* Stat Cards Row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Total Inspections" value={`${colliery.inspections.length + 120}`} change="10.2%" positive={true} sparkData={statSparklines.inspections} sparkColor="#52b788" iconBg="#2d6a4f" />
        <StatCard icon={<AlertTriangle size={18} color="white" />} label="Open Violations" value={`${colliery.openViolations}`} change="7.1%" positive={false} sparkData={statSparklines.violations} sparkColor="#f4a261" iconBg="#d97706" />
        <StatCard icon={<ListChecks size={18} color="white" />} label="Pending Actions" value={`${colliery.violations.length}`} change="3.1%" positive={false} sparkData={statSparklines.actions} sparkColor="#6b7280" iconBg="#6b7280" />
        <StatCard icon={<ShieldAlert size={18} color="white" />} label="Colliery Risk" value={colliery.riskLevel} change={colliery.riskLevel === "High" ? "Critical" : "Stable"} positive={colliery.riskLevel !== "High"} sparkData={statSparklines.highrisk} sparkColor={colliery.riskLevel === "High" ? "#e63946" : "#52b788"} iconBg={colliery.riskLevel === "High" ? "#e63946" : "#2d6a4f"} />
        <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Compliance Score" value={`${colliery.complianceScore}%`} change="6.4%" positive={true} sparkData={statSparklines.compliance} sparkColor="#52b788" iconBg="#2d6a4f" />
      </div>

      {/* AI Safety Risk Intelligence Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f2318 0%, #1a3d28 100%)",
        border: "1px solid rgba(82,183,136,0.3)",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(82,183,136,0.2)", border: "1px solid rgba(82,183,136,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BrainCircuit size={22} color="#86efac" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ color: "white", fontSize: 15, fontWeight: 700 }}>AI Predictive Risk Intelligence · {colliery.cleanName}</h3>
              <span style={{ fontSize: 10.5, padding: "2px 7px", background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.3)", borderRadius: 10, color: "#86efac", fontWeight: 700 }}>
                {colliery.subsidiary} Model
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
              Colliery Hazard Index: <strong style={{ color: colliery.riskLevel === "High" ? "#fca5a5" : "#86efac" }}>{colliery.riskScore} / 100 ({colliery.riskLevel} Risk)</strong> · 72h Failure Forecast: <strong style={{ color: colliery.riskLevel === "High" ? "#fca5a5" : "#86efac" }}>{colliery.failureProb72h}% Probability</strong> · {colliery.sections.filter(s => s.risk === "High").length} High-Risk Working Faces
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setSelectedAiTarget({
              name: highestRiskSection.name,
              depth: highestRiskSection.depth,
              compliance: highestRiskSection.compliance,
              risk: highestRiskSection.risk,
              workers: highestRiskSection.workers,
              ch4: highestRiskSection.ch4 || colliery.ch4Current,
              co: highestRiskSection.co || colliery.coCurrent,
              air: highestRiskSection.ventilation || colliery.ventilationVelocity,
              violations: colliery.openViolations
            })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              background: colliery.riskLevel === "High" ? "#dc2626" : "#2d6a4f",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          >
            <ShieldAlert size={14} /> Audit High-Risk Face ({highestRiskSection.name.slice(0, 16)})
          </button>

          <Link
            href="/mine-manager/ai-analytics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            <Sparkles size={14} color="#86efac" /> AI Risk Studio <ArrowRight size={13} />
          </Link>
        </div>
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
            <div style={{ flex: 1, position: "relative" }}>
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
          <Link href="/mine-manager/mines" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
            View All Mines <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.9fr", gap: 14, marginBottom: 20 }}>
        {/* Recent Inspections */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Statutory Inspections</h3>
          {colliery.inspections.map((insp, i) => (
            <div key={insp.id || i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < colliery.inspections.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{insp.area}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{insp.date} &nbsp;|&nbsp; {insp.time} · {insp.inspector}</p>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20,
                fontSize: 11.5, fontWeight: 600,
                background: insp.status === "Compliant" ? "#dcfce7" : insp.status === "Non-Compliant" ? "#fee2e2" : "#fff7ed",
                color: insp.status === "Compliant" ? "#16a34a" : insp.status === "Non-Compliant" ? "#dc2626" : "#ea580c",
                border: insp.status === "Compliant" ? "none" : insp.status === "Non-Compliant" ? "1px solid #fca5a5" : "1px solid #fdba74"
              }}>
                {insp.status} ({insp.score}%)
              </span>
            </div>
          ))}
          <Link href="/mine-manager/inspections" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
            View All Inspections <ArrowRight size={13} />
          </Link>
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
          <Link href="/mine-manager/violations" style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
            View All Violations <ArrowRight size={13} />
          </Link>
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
          <Link href="/mine-manager/actions" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
            View All Actions <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Quick Actions + Equipment */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { icon: CalendarCheck, label: "Schedule Inspection", href: "/mine-manager/inspections" },
              { icon: AlertTriangle, label: "Add Violation",        href: "/mine-manager/violations" },
              { icon: UserPlus,      label: "Assign Action",        href: "/mine-manager/actions" },
              { icon: BarChart3,     label: "View Reports",         href: "/mine-manager/reports" },
              { icon: PlusCircle,    label: "Team & Personnel",     href: "/mine-manager/team" },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 10px", background: "white", border: "1px solid #e5e7eb", borderRadius: 12, cursor: "pointer", flex: 1, textDecoration: "none" }}>
                <div style={{ width: 44, height: 44, background: "#2d6a4f", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color="white" strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

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
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.emoji}</div>
                <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.pct}%</p>
                <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/mine-manager/equipment" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none" }}>
            View All Equipment <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* AI Risk Modal */}
      <AiRiskModal target={selectedAiTarget} onClose={() => setSelectedAiTarget(null)} />
    </>
  );
}
