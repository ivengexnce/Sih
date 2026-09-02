"use client";

import React, { useState } from "react";
import {
  BrainCircuit, Sparkles, TrendingUp, AlertTriangle, ShieldCheck,
  Building2, ArrowRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area
} from "recharts";

const subsidiaryRiskScores = [
  { sub: "BCCL (Jharia)", riskScore: 82, gassyCount: 14, predictedHighRisk: 4 },
  { sub: "ECL (Raniganj)", riskScore: 78, gassyCount: 18, predictedHighRisk: 5 },
  { sub: "SECL (Korba)", riskScore: 28, gassyCount: 4, predictedHighRisk: 1 },
  { sub: "NCL (Singrauli)", riskScore: 22, gassyCount: 2, predictedHighRisk: 0 },
  { sub: "MCL (Talcher)", riskScore: 45, gassyCount: 6, predictedHighRisk: 2 },
  { sub: "WCL (Nagpur)", riskScore: 52, gassyCount: 8, predictedHighRisk: 2 },
  { sub: "CCL (Karanpura)", riskScore: 40, gassyCount: 5, predictedHighRisk: 1 },
];

export default function CorporateAiAnalyticsPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrainCircuit size={22} color="#2d6a4f" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>Subsidiary-Wide AI Risk Intelligence</h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Cross-subsidiary predictive hazard clustering and DGMS compliance forecast across Coal India Limited.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
          <Sparkles size={14} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>AI Confidence: 94.8%</span>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "High-Risk Collieries", val: "15 of 324", color: "#dc2626", sub: "Predicted via Random Forest" },
          { label: "Degree-III Gassy Pits", val: "57 Mines", color: "#ea580c", sub: "Mandatory Tele-monitoring" },
          { label: "Spontaneous Heatings", val: "8 Active", color: "#f59e0b", sub: "Graham's ratio flagged" },
          { label: "DGMS Audit Readiness", val: "91.4%", color: "#16a34a", sub: "+3.2% vs last quarter" },
        ].map(k => (
          <div key={k.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: k.color, marginTop: 4 }}>{k.val}</p>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Chart Card */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Subsidiary Risk Index vs Gassy Mines Count</h3>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>Random Forest classification aggregated by subsidiary</p>

        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subsidiaryRiskScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="sub" tick={{ fontSize: 11, fill: "#4b5563" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="riskScore" fill="#0f2318" radius={[4, 4, 0, 0]} name="Predicted Risk Score (0-100)" />
              <Bar dataKey="gassyCount" fill="#52b788" radius={[4, 4, 0, 0]} name="Degree II/III Gassy Mines" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
