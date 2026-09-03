"use client";

import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  ClipboardCheck, AlertTriangle, ListChecks, ArrowRight,
  TrendingUp, TrendingDown, Info, CalendarCheck, UserPlus, BarChart3,
  PlusCircle, ShieldAlert, BrainCircuit, Sparkles, Activity, CheckCircle,
  Wrench, UploadCloud, FileText
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AiRiskModal, { AiRiskTarget } from "@/components/AiRiskModal";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";
import { useTranslation } from "@/components/LanguageContext";

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

// ── Premium Sub-Components ──────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ x: i, y: v }));
  const id = `sp${color.replace("#","")}`;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.30} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ icon, label, value, change, positive, sparkData, sparkColor, iconBg }: any) {
  return (
    <div style={{
      background: "white",
      borderRadius: 14, padding: "18px 18px 14px",
      border: "1px solid var(--border)",
      flex: 1, minWidth: 0,
      transition: "all 0.22s ease",
      position: "relative", overflow: "hidden",
      cursor: "default",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,183,136,0.20)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
    }}
    >
      {/* bottom accent bar on hover */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: sparkColor, opacity: 0.7, borderRadius: "0 0 14px 14px" }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 2 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: `linear-gradient(135deg, ${iconBg} 0%, ${iconBg}cc 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 4px 14px ${iconBg}50`,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, margin: "0 0 5px", color: "var(--text-primary)", letterSpacing: "-0.02em", animation: "countUp 0.5s ease" }}>{value}</p>
          <p style={{ fontSize: 11.5, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            {positive ? <TrendingUp size={12} color="#16a34a" /> : <TrendingDown size={12} color="#dc2626" />}
            <span style={{ color: positive ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{change}</span>
            <span style={{ color: "var(--text-faint)" }}>vs last 7 days</span>
          </p>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

function DonutChart({ data, center }: any) {
  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <PieChart width={130} height={130}>
        <Pie data={data} cx={60} cy={60} innerRadius={42} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={2} stroke="white">
          {data.map((d: any, i: number) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>{center.value}</span>
        <span style={{ fontSize: 9.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{center.label}</span>
      </div>
    </div>
  );
}

function LegendRow({ color, label, count }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}80` }} />
      <span style={{ fontSize: 12.5, color: "var(--text-secondary)", flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{count}</span>
    </div>
  );
}

export default function Dashboard() {
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine (SECL)");
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [selectedAiTarget, setSelectedAiTarget] = useState<AiRiskTarget | null>(null);
  const [liveInspections, setLiveInspections] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const mine = storageService.getActiveAllocatedMine();
      setAllocatedMine(mine);
      setColliery(getCollieryProfile(mine));

      unsubscribe = storageService.subscribeToInspections((docs) => {
        if (docs && docs.length > 0) {
          const mapped = docs.map((d) => {
            const dateStr = d.createdAt || d.timestamp || d.submittedAt;
            let formattedDate = "Today";
            let formattedTime = "10:00 AM";
            if (dateStr) {
              try {
                const dt = new Date(dateStr);
                if (!isNaN(dt.getTime())) {
                  formattedDate = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  formattedTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                }
              } catch {}
            }
            const rawStatus = (d.status || d.escalationStatus || "").toUpperCase();
            let status: "Compliant" | "Non-Compliant" | "Partial" = "Compliant";
            if (rawStatus.includes("NON") || rawStatus.includes("REJECT") || (d.severity && d.severity.toUpperCase() === "HIGH")) {
              status = "Non-Compliant";
            } else if (rawStatus.includes("PARTIAL") || rawStatus.includes("REVIEW") || rawStatus.includes("PENDING")) {
              status = "Partial";
            }

            return {
              id: d.inspectionId || d.id,
              area: d.area || d.setup?.area || d.section || "Pit Section",
              date: formattedDate,
              time: formattedTime,
              status,
              inspector: d.inspectorName || d.inspectorEmail || d.inspector || "Statutory Inspector",
              score: status === "Compliant" ? 96 : status === "Partial" ? 82 : 68,
            };
          });
          setLiveInspections(mapped);
        }
      }, mine);
    } catch (e) {}

    return () => {
      unsubscribe();
    };
  }, []);

  const highestRiskSection = colliery.sections.find(s => s.risk === "High") || colliery.sections[0];

  return (
    <>
      {/* Stat Cards Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Total Inspections" value={`${colliery.inspections.length + 120}`} change="+10.2%" positive={true}  sparkData={statSparklines.inspections} sparkColor="#52b788" iconBg="#2d6a4f" />
        <StatCard icon={<AlertTriangle size={18} color="white" />}  label="Open Violations"  value={`${colliery.openViolations}`}           change="7.1%"  positive={false} sparkData={statSparklines.violations}  sparkColor="#f59e0b" iconBg="#d97706" />
        <StatCard icon={<ListChecks size={18} color="white" />}     label="Pending Actions"  value={`${colliery.violations.length}`}         change="3.1%"  positive={false} sparkData={statSparklines.actions}     sparkColor="#6b7280" iconBg="#4b5563" />
        <StatCard icon={<ShieldAlert size={18} color="white" />}    label="Colliery Risk"    value={colliery.riskLevel}                      change={colliery.riskLevel === "High" ? "Critical" : "Stable"} positive={colliery.riskLevel !== "High"} sparkData={statSparklines.highrisk} sparkColor={colliery.riskLevel === "High" ? "#e63946" : "#52b788"} iconBg={colliery.riskLevel === "High" ? "#dc2626" : "#2d6a4f"} />
        <StatCard icon={<ClipboardCheck size={18} color="white" />} label="Compliance Score"  value={`${colliery.complianceScore}%`}          change="+6.4%" positive={true}  sparkData={statSparklines.compliance}  sparkColor="#52b788" iconBg="#2d6a4f" />
      </div>

      {/* AI Safety Risk Intelligence Banner */}
      <div style={{
        background: "linear-gradient(135deg, #060f08 0%, #0f2318 50%, #1a3d28 100%)",
        border: "1px solid rgba(82,183,136,0.25)",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "0 6px 24px rgba(0,0,0,0.20), 0 0 40px rgba(82,183,136,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: "rgba(82,183,136,0.15)",
            border: "1px solid rgba(82,183,136,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(82,183,136,0.20)",
            animation: "breathe 3s infinite ease-in-out",
          }}>
            <BrainCircuit size={22} color="#86efac" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <h3 style={{ color: "white", fontSize: 15, fontWeight: 800, margin: 0 }}>AI Predictive Risk · {colliery.cleanName}</h3>
              <span style={{
                fontSize: 10, padding: "2px 8px",
                background: "rgba(134,239,172,0.12)",
                border: "1px solid rgba(134,239,172,0.28)",
                borderRadius: 10, color: "#86efac", fontWeight: 800, letterSpacing: "0.04em"
              }}>
                {colliery.subsidiary} XAI
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 11.5, margin: 0 }}>
              Hazard Index: <strong style={{ color: colliery.riskLevel === "High" ? "#fca5a5" : "#86efac" }}>{colliery.riskScore}/100 ({colliery.riskLevel})</strong>
              {" · "}72h Forecast: <strong style={{ color: colliery.riskLevel === "High" ? "#fca5a5" : "#86efac" }}>{colliery.failureProb72h}%</strong>
              {" · "}{colliery.sections.filter(s => s.risk === "High").length} High-Risk Faces
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
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 2px", color: "var(--text-primary)" }}>Compliance Trend</p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0 }}>Last 7 days performance</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#2d6a4f", letterSpacing: "-0.02em" }}>88%</span>
              <p style={{ fontSize: 10.5, color: "#16a34a", margin: 0, fontWeight: 700 }}>↑ +6.4% vs prev week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={complianceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} ticks={[0,50,100]} />
              <Tooltip formatter={(v) => [`${v}%`, "Compliance"]} contentStyle={{ fontSize: 12, border: "1px solid var(--border)", borderRadius: 10, boxShadow: "var(--shadow-md)" }} />
              <Area type="monotone" dataKey="v" stroke="#2d6a4f" strokeWidth={2.5} fill="url(#compGrad)" dot={{ fill: "#2d6a4f", r: 3.5, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#52b788" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Summary */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: "var(--text-primary)" }}>Risk Distribution</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <DonutChart data={riskData} center={{ value: 18, label: "Risks" }} />
            <div style={{ flex: 1 }}>
              {riskData.map(d => <LegendRow key={d.name} color={d.color} label={d.name} count={d.value} />)}
            </div>
          </div>
        </div>

        {/* Mines Overview */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "var(--text-primary)" }}>Section Map</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg viewBox="0 0 200 240" style={{ width: "100%", height: 138 }}>
                <path d="M100,8 L135,22 L155,52 L162,82 L148,106 L140,128 L154,152 L146,180 L130,198 L110,214 L100,220 L90,214 L70,198 L54,180 L46,152 L60,128 L52,106 L38,82 L45,52 L65,22 Z"
                  fill="#e8f5ee" stroke="#2d6a4f" strokeWidth="1.5"/>
                {[
                  {cx:90,cy:60,c:"#dc2626"},{cx:115,cy:90,c:"#dc2626"},{cx:82,cy:110,c:"#f59e0b"},
                  {cx:105,cy:120,c:"#f59e0b"},{cx:92,cy:148,c:"#52b788"},{cx:78,cy:80,c:"#dc2626"},
                ].map((d,i) => (
                  <circle key={i} cx={d.cx} cy={d.cy} r="7" fill={d.c} stroke="white" strokeWidth="2.5"
                    style={{ filter: `drop-shadow(0 2px 4px ${d.c}80)` }}/>
                ))}
              </svg>
            </div>
            <div>
              <LegendRow color="#dc2626" label="High Risk"   count={3} />
              <LegendRow color="#f59e0b" label="Medium Risk" count={2} />
              <LegendRow color="#52b788" label="Low Risk"    count={1} />
            </div>
          </div>
          <Link href="/mine-manager/mines" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>
            View All Mines <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.9fr", gap: 14, marginBottom: 20 }}>
        {/* Recent Inspections */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Recent Inspections</p>
            <Link href="/mine-manager/inspections" style={{ fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>All <ArrowRight size={11} /></Link>
          </div>
          {(liveInspections.length > 0 ? liveInspections.slice(0, 4) : colliery.inspections).map((insp, i, arr) => (
            <div key={insp.id || i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--surface-2)" : "none",
              transition: "background 0.12s",
            }}>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px" }}>{insp.area}</p>
                <p style={{ fontSize: 10.5, color: "var(--text-faint)", margin: 0 }}>{insp.date} · {insp.inspector}</p>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 20,
                fontSize: 11, fontWeight: 700,
                background: insp.status === "Compliant" ? "#dcfce7" : insp.status === "Non-Compliant" ? "#fee2e2" : "#fff7ed",
                color: insp.status === "Compliant" ? "#16a34a" : insp.status === "Non-Compliant" ? "#dc2626" : "#ea580c",
              }}>
                {insp.status} ({insp.score || 90}%)
              </span>
            </div>
          ))}
        </div>

        {/* Top Violations */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Top Violations</p>
            <Link href="/mine-manager/violations" style={{ fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>All <ArrowRight size={11} /></Link>
          </div>
          {violationsData.map((v, i) => (
            <div key={v.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v.name}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: violationColors[i] }}>{v.count}</span>
              </div>
              <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${(v.count / 12) * 100}%`,
                  background: violationColors[i], borderRadius: 4,
                  transition: "width 0.8s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Actions Summary */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Actions</p>
            <Link href="/mine-manager/actions" style={{ fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>All <ArrowRight size={11} /></Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DonutChart data={actionsData} center={{ value: 16, label: "Pending" }} />
            <div style={{ flex: 1 }}>
              {actionsData.map(d => <LegendRow key={d.name} color={d.color} label={d.name} count={d.value} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Equipment */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: "var(--text-primary)" }}>Quick Actions</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { icon: CalendarCheck, label: "Schedule Inspection", href: "/mine-manager/inspections?schedule=true", color: "#2d6a4f", glow: "rgba(45,106,79,0.30)" },
              { icon: AlertTriangle, label: "Add Violation",        href: "/mine-manager/violations",              color: "#dc2626", glow: "rgba(220,38,38,0.25)" },
              { icon: UserPlus,      label: "Assign Action",        href: "/mine-manager/actions",                  color: "#2563eb", glow: "rgba(37,99,235,0.25)" },
              { icon: BarChart3,     label: "View Reports",         href: "/mine-manager/reports",                  color: "#7c3aed", glow: "rgba(124,58,237,0.25)" },
              { icon: UploadCloud,   label: "Upload Docs",          href: "/mine-manager/documents",                color: "#0891b2", glow: "rgba(8,145,178,0.25)" },
            ].map(({ icon: Icon, label, href, color, glow }) => (
              <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 8px", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 12, cursor: "pointer", flex: 1, textDecoration: "none", transition: "all 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${glow}`; (e.currentTarget as HTMLElement).style.borderColor = color + "40"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <div style={{ width: 42, height: 42, background: color, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${glow}` }}>
                  <Icon size={18} color="white" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 10.5, color: "var(--text-secondary)", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Equipment Status</p>
            <Link href="/mine-manager/equipment" style={{ fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>All <ArrowRight size={11} /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {[
              { label: "Operational",    pct: 78, color: "#52b788", bg: "#f0fdf4", border: "#bbf7d0", icon: "🚛" },
              { label: "Maintenance",    pct: 15, color: "#ea580c", bg: "#fff7ed", border: "#fdba74", icon: "🔧" },
              { label: "Idle",           pct: 5,  color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: "⏸️" },
              { label: "Out of Service", pct: 2,  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "❌" },
            ].map(item => (
              <div key={item.label} style={{
                textAlign: "center", padding: "12px 8px",
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 10,
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: item.color, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{item.pct}%</p>
                <div style={{ height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Risk Modal */}
      <AiRiskModal target={selectedAiTarget} onClose={() => setSelectedAiTarget(null)} />
    </>
  );
}
