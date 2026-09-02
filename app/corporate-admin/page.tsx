"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import {
  Mountain, ShieldCheck, FileText, AlertTriangle, TrendingUp, TrendingDown,
  Info, ArrowRight, BrainCircuit, Sparkles, Globe, Compass, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import AiRiskModal, { AiRiskTarget } from "@/app/components/AiRiskModal";

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

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* AI Intelligence Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #07130b 0%, #0f2318 60%, #1a3d28 100%)",
        border: "1px solid rgba(82,183,136,0.3)",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BrainCircuit size={24} color="#86efac" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ color: "white", fontSize: 17, fontWeight: 800 }}>National Coalfield AI Risk Surveillance</h2>
              <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.3)", borderRadius: 12, color: "#86efac", fontWeight: 700 }}>
                Ensemble 97.67%
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, marginTop: 2 }}>
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
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(220,38,38,0.3)"
            }}
          >
            <ShieldAlert size={14} /> Audit Jharia Deep (BCCL)
          </button>

          <Link
            href="/corporate-admin/gis-map"
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
            <Compass size={14} color="#86efac" /> National GIS Map <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { icon: <Mountain size={18} color="#2d6a4f" />, label: "Total Active Mines", value: "6", change: "+1 this month", positive: true, spark: sparkData.mines, color: "#2d6a4f" },
          { icon: <ShieldCheck size={18} color="#2d6a4f" />, label: "Portfolio Compliance", value: "88%", change: "+3.2% vs last qtr", positive: true, spark: sparkData.compliance, color: "#52b788" },
          { icon: <AlertTriangle size={18} color="#e63946" />, label: "Critical Hazard Alerts", value: "22", change: "-12% vs last wk", positive: true, spark: sparkData.violations, color: "#e63946" },
          { icon: <FileText size={18} color="#2d6a4f" />, label: "DGMS Audits Conducted", value: "134", change: "+8 this week", positive: true, spark: sparkData.inspections, color: "#2d6a4f" },
        ].map((card, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{card.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginTop: 4 }}>{card.value}</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {card.icon}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
              <span style={{ fontSize: 11.5, color: card.positive ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{card.change}</span>
              <Sparkline data={card.spark} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Trend + Risk Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Subsidiary Compliance Index</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>(2026 Trend)</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#2d6a4f" }}>88% Portfolio Avg</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={complianceData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="score" stroke="#2d6a4f" strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>AI Risk Cluster Breakdown</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
              <PieChart width={130} height={130}>
                <Pie data={riskDist} cx={60} cy={60} innerRadius={42} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                  {riskDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>6</span>
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
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Flagship Mine Safety Telemetry</h3>
            <Link href="/corporate-admin/mines" style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            {minePerformance.map((mine, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < minePerformance.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{mine.name}</p>
                  <p style={{ fontSize: 11.5, color: "#6b7280" }}>Depth: {mine.depth} · Workers: {mine.workers}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right", minWidth: 60 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: mine.compliance >= 85 ? "#16a34a" : "#dc2626" }}>{mine.compliance}%</span>
                  </div>
                  <button
                    onClick={() => setSelectedAiTarget(mine)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      color: "#15803d",
                      fontWeight: 700,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 6,
                      cursor: "pointer",
                      padding: "4px 8px"
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
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Priority Safety Incidents</h3>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>Live CIL Feed</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {violations.map((v, i) => (
              <div key={i} style={{ padding: "10px 12px", background: "#fafafa", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{v.mine}</span>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: v.severity === "High" ? "#fee2e2" : "#fff7ed", color: v.severity === "High" ? "#dc2626" : "#ea580c", fontWeight: 700 }}>
                    {v.severity}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#4b5563" }}>{v.type}</p>
                <p style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{v.date}</p>
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
