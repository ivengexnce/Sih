"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  Mountain, ShieldCheck, FileText, AlertTriangle, TrendingUp, TrendingDown,
  Info, ArrowRight, BrainCircuit, Sparkles, Globe, Compass, ShieldAlert, ScanFace
} from "lucide-react";
import Link from "next/link";
import AiRiskModal, { AiRiskTarget } from "@/components/AiRiskModal";
import { storageService } from "@/lib/storage";

const complianceData = [
  { month: "Jan", score: 72 }, { month: "Feb", score: 75 },
  { month: "Mar", score: 78 }, { month: "Apr", score: 74 },
  { month: "May", score: 80 }, { month: "Jun", score: 83 },
  { month: "Jul", score: 81 }, { month: "Aug", score: 85 },
  { month: "Sep", score: 88 },
];

const minePerformance = [
  { name: "Rajpura Coal Mine (SECL)",  compliance: 88, risk: "Low",    depth: "380m", workers: 312, violations: 28 },
  { name: "Jharia Deep Mine (BCCL)",   compliance: 74, risk: "High",   depth: "420m", workers: 224, violations: 44 },
  { name: "Korba West (SECL)",         compliance: 91, risk: "Low",    depth: "140m", workers: 180, violations: 12 },
  { name: "Singrauli Project (NCL)",   compliance: 67, risk: "High",   depth: "280m", workers: 268, violations: 35 },
  { name: "Talcher Bhubaneswari (MCL)",compliance: 82, risk: "Medium", depth: "110m", workers: 195, violations: 22 },
  { name: "Gevra Opencast (SECL)",     compliance: 94, risk: "Low",    depth: "120m", workers: 420, violations: 15 },
];

const riskDist = [
  { name: "High",   value: 2, color: "#e63946" },
  { name: "Medium", value: 1, color: "#f4a261" },
  { name: "Low",    value: 3, color: "#52b788" },
];

const violations = [
  { mine: "Jharia Deep Mine",     type: "Spontaneous Coal Heating", severity: "High",   date: "Today, 10:15 AM" },
  { mine: "Singrauli Project",    type: "Auxiliary Fan Failure",    severity: "High",   date: "Yesterday" },
  { mine: "Talcher Bhubaneswari", type: "Air Quality Dust PM10",    severity: "Medium", date: "Sep 1, 2026" },
  { mine: "Gevra Opencast",       type: "Haul Road Berm Grading",   severity: "Low",    date: "Aug 31, 2026" },
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
    <div style={{ width: 80, height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={pts} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CorporateDashboard() {
  const [selectedAiTarget, setSelectedAiTarget] = useState<AiRiskTarget | null>(null);

  // Live Aggregated Data
  const [totalInspections, setTotalInspections] = useState(134);
  const [totalViolations, setTotalViolations] = useState(22);
  const [totalAttendance, setTotalAttendance] = useState(0);

  const syncCorporateData = () => {
    try {
      const scheduled = storageService.getScheduledInspections();
      const past = storageService.getInspections();
      const vio = storageService.getViolations();
      const customVio = storageService.getCustomViolations();
      const att = storageService.getAttendance();

      setTotalInspections(134 + scheduled.length + past.length);
      setTotalViolations(22 + vio.length + customVio.length);
      setTotalAttendance(att.length);
    } catch (e) {}
  };

  useEffect(() => {
    syncCorporateData();
    window.addEventListener("storage", syncCorporateData);
    window.addEventListener("focus", syncCorporateData);
    return () => {
      window.removeEventListener("storage", syncCorporateData);
      window.removeEventListener("focus", syncCorporateData);
    };
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* AI Intelligence Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #040a06 0%, #0f2318 55%, #1a3d28 100%)",
        border: "1px solid rgba(82,183,136,0.22)",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 20,
        boxShadow: "0 12px 36px rgba(0,0,0,0.22), 0 0 60px rgba(82,183,136,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: "rgba(134,239,172,0.12)",
            border: "1px solid rgba(134,239,172,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(82,183,136,0.22)",
            animation: "breathe 3s infinite ease-in-out",
          }}>
            <BrainCircuit size={24} color="#86efac" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h2 style={{ color: "white", fontSize: 17, fontWeight: 900, margin: 0 }}>National Coalfield AI Risk Surveillance</h2>
              <span style={{
                fontSize: 10.5, padding: "2px 9px",
                background: "rgba(134,239,172,0.12)",
                border: "1px solid rgba(134,239,172,0.28)",
                borderRadius: 12, color: "#86efac", fontWeight: 800, letterSpacing: "0.04em"
              }}>
                Ensemble 97.67%
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52b788", animation: "pulseDot 2s infinite" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>LIVE</span>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 12.5, margin: 0 }}>
              Active AI monitoring across Coal India Limited (ECL, BCCL, CCL, WCL, SECL, MCL, NCL) · 2 Mines flagged with high spontaneous combustion risk
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setSelectedAiTarget({
              name: "Jharia Deep Colliery (BCCL)",
              depth: "420m",
              compliance: 74,
              risk: "High",
              workers: 224,
              ch4: 1.45,
              co: 52,
              air: 0.35,
              violations: 44
            })}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 16px",
              background: "#dc2626",
              color: "white", border: "none",
              borderRadius: 9, fontSize: 12.5, fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
              animation: "pulseDanger 2s infinite",
            }}
          >
            <ShieldAlert size={15} /> Audit Jharia Deep (BCCL)
          </button>

          <Link
            href="/corporate-admin/gis-map"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 14px",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 9, fontSize: 12.5, fontWeight: 600,
              textDecoration: "none", transition: "all 0.15s",
            }}
          >
            <Compass size={14} color="#86efac" /> National GIS Map <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: <Mountain size={20} color="white" />, label: "Total Active Mines",    value: "6",    change: "+1 this month",   positive: true,  spark: sparkData.mines,       color: "#2d6a4f", iconBg: "#2d6a4f" },
          { icon: <ShieldCheck size={20} color="white" />, label: "Portfolio Compliance", value: "88%",  change: "+3.2% vs last qtr", positive: true,  spark: sparkData.compliance,  color: "#52b788", iconBg: "#16a34a" },
          { icon: <AlertTriangle size={20} color="white" />, label: "Critical Hazard Alerts", value: totalViolations.toString(), change: "Live sync", positive: false, spark: sparkData.violations, color: "#dc2626", iconBg: "#dc2626" },
          { icon: <FileText size={20} color="white" />, label: "DGMS Audits Conducted", value: totalInspections.toString(),  change: "Live sync",    positive: true,  spark: sparkData.inspections, color: "#2563eb", iconBg: "#2563eb" },
          { icon: <ScanFace size={20} color="white" />, label: "Worker Attendance", value: totalAttendance.toString(),  change: "Live sync",    positive: true,  spark: sparkData.mines, color: "#f59e0b", iconBg: "#f59e0b" },
        ].map((card, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 14,
            border: "1px solid var(--border)",
            padding: "18px 20px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transition: "all 0.22s ease",
            position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: card.color, opacity: 0.6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>{card.label}</p>
                <p style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em", animation: "countUp 0.5s ease" }}>{card.value}</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${card.iconBg} 0%, ${card.iconBg}cc 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${card.iconBg}50`,
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
              <span style={{ fontSize: 11.5, color: card.positive ? "#16a34a" : "#dc2626", fontWeight: 700 }}>{card.change}</span>
              <Sparkline data={card.spark} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Trend + Risk Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 2px", color: "var(--text-primary)" }}>Subsidiary Compliance Index</p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)", margin: 0 }}>2026 Full-Year Trend</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#2d6a4f", letterSpacing: "-0.02em" }}>88%</span>
              <p style={{ fontSize: 10.5, color: "#16a34a", margin: 0, fontWeight: 700 }}>Portfolio Average</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={complianceData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="compGradCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }} />
              <Area type="monotone" dataKey="score" stroke="#2d6a4f" strokeWidth={2.5} fillOpacity={1} fill="url(#compGradCA)" dot={{ fill: "#2d6a4f", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#52b788" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>AI Risk Cluster</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
              <PieChart width={130} height={130}>
                <Pie data={riskDist} cx={60} cy={60} innerRadius={42} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={2} stroke="white">
                  {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)" }}>6</span>
                <span style={{ fontSize: 9.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Mines</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {riskDist.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: d.color, boxShadow: `0 0 6px ${d.color}80` }} />
                  <span style={{ fontSize: 12.5, color: "var(--text-secondary)", flex: 1 }}>{d.name} Risk</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mine Performance Table + Violations */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Flagship Mine Safety Telemetry</p>
            <Link href="/corporate-admin/mines" style={{ fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {minePerformance.map((mine, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 0",
                borderBottom: i < minePerformance.length - 1 ? "1px solid var(--surface-2)" : "none",
                transition: "background 0.12s",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mine.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>Depth: {mine.depth} · {mine.workers} workers</p>
                    <div style={{ height: 4, width: 70, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${mine.compliance}%`,
                        background: mine.compliance >= 85 ? "#52b788" : mine.compliance >= 75 ? "#f59e0b" : "#dc2626",
                        borderRadius: 3, transition: "width 0.8s ease"
                      }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 12 }}>
                  <div style={{
                    padding: "3px 9px", borderRadius: 6,
                    background: mine.risk === "High" ? "#fee2e2" : mine.risk === "Medium" ? "#fff7ed" : "#dcfce7",
                    color: mine.risk === "High" ? "#dc2626" : mine.risk === "Medium" ? "#ea580c" : "#16a34a",
                    fontSize: 10.5, fontWeight: 800,
                  }}>
                    {mine.compliance}% · {mine.risk}
                  </div>
                  <button
                    onClick={() => setSelectedAiTarget(mine)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 11, color: "#15803d", fontWeight: 700,
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 7, cursor: "pointer", padding: "5px 9px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <BrainCircuit size={12} color="#16a34a" /> AI Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Incident Feed */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid var(--border)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Priority Safety Incidents</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52b788", animation: "pulseDot 2s infinite" }} />
              <span style={{ fontSize: 10.5, color: "var(--text-faint)", fontWeight: 700 }}>Live CIL Feed</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {violations.map((v, i) => (
              <div key={i} style={{
                display: "flex",
                borderRadius: 10, border: "1px solid var(--border)",
                overflow: "hidden",
                animation: `fadeInUp 0.3s ease ${i * 0.07}s both`,
              }}>
                <div style={{
                  width: 4,
                  background: v.severity === "High" ? "#dc2626" : v.severity === "Medium" ? "#f59e0b" : "#52b788",
                  flexShrink: 0,
                }} />
                <div style={{ padding: "10px 12px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{v.mine}</span>
                    <span style={{
                      fontSize: 9.5, padding: "2px 7px", borderRadius: 5,
                      background: v.severity === "High" ? "#fee2e2" : v.severity === "Medium" ? "#fff7ed" : "#f0fdf4",
                      color: v.severity === "High" ? "#dc2626" : v.severity === "Medium" ? "#ea580c" : "#16a34a",
                      fontWeight: 800,
                    }}>
                      {v.severity}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 3px" }}>{v.type}</p>
                  <p style={{ fontSize: 10.5, color: "var(--text-faint)", margin: 0 }}>{v.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Risk Modal */}
      <AiRiskModal target={selectedAiTarget} onClose={() => setSelectedAiTarget(null)} />
    </div>
  );
}
