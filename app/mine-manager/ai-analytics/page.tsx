"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, BrainCircuit, Activity, AlertTriangle, CheckCircle,
  Wind, Flame, ShieldAlert, Sliders, RefreshCw, Layers, ArrowRight,
  Zap, Cpu, BarChart3, Gauge, Radio
} from "lucide-react";
import { predictSectionRisk, detectSensorAnomaly, fetchLiveTelemetryStream } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area,
  BarChart, Bar, Cell
} from "recharts";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

const sampleTrendData = [
  { time: "10:00", ch4: 0.22, co: 12, air: 1.4 },
  { time: "10:15", ch4: 0.25, co: 14, air: 1.3 },
  { time: "10:30", ch4: 0.42, co: 18, air: 1.1 },
  { time: "10:45", ch4: 0.78, co: 26, air: 0.9 },
  { time: "11:00", ch4: 1.15, co: 38, air: 0.6 },
  { time: "11:15", ch4: 1.38, co: 52, air: 0.35 },
  { time: "11:30", ch4: 0.95, co: 32, air: 0.8 },
];

const featureImportanceData = [
  { feature: "Gassiness Degree", weight: 33.4, fill: "#2d6a4f" },
  { feature: "Carbon Monoxide", weight: 23.8, fill: "#16a34a" },
  { feature: "Open Violations", weight: 13.3, fill: "#52b788" },
  { feature: "Methane CH4", weight: 12.9, fill: "#e63946" },
  { feature: "Gas Dispersion Index", weight: 9.0, fill: "#f4a261" },
  { feature: "Ventilation Velocity", weight: 4.5, fill: "#3b82f6" },
];

const scenarios = [
  {
    name: "Methane Surge (Heading 4)",
    desc: "Severe gas accumulation at active face",
    icon: Flame,
    color: "#fee2e2",
    border: "#fca5a5",
    textColor: "#dc2626",
    params: { depth: 380, gassiness: 3, violations: 5, days: 14, ch4: 1.42, co: 48, vent: 0.38 }
  },
  {
    name: "Spontaneous Coal Heating",
    desc: "Elevated CO with Graham's ratio spike",
    icon: AlertTriangle,
    color: "#fff7ed",
    border: "#fdba74",
    textColor: "#ea580c",
    params: { depth: 420, gassiness: 3, violations: 3, days: 8, ch4: 0.55, co: 62, vent: 0.90 }
  },
  {
    name: "Auxiliary Fan Failure",
    desc: "Ventilation starvation (< 0.5 m/s)",
    icon: Wind,
    color: "#eff6ff",
    border: "#bfdbfe",
    textColor: "#2563eb",
    params: { depth: 290, gassiness: 2, violations: 7, days: 22, ch4: 0.85, co: 22, vent: 0.22 }
  },
  {
    name: "Normal Shift Baseline",
    desc: "All sensors within DGMS standards",
    icon: CheckCircle,
    color: "#f0fdf4",
    border: "#bbf7d0",
    textColor: "#16a34a",
    params: { depth: 140, gassiness: 1, violations: 1, days: 4, ch4: 0.12, co: 8, vent: 1.65 }
  }
];

export default function AiAnalyticsPage() {
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [depth, setDepth] = useState(185);
  const [gassiness, setGassiness] = useState(2);
  const [violations, setViolations] = useState(6);
  const [daysSinceInsp, setDaysSinceInsp] = useState(10);
  const [ch4, setCh4] = useState(0.45);
  const [co, setCo] = useState(18);
  const [ventilation, setVentilation] = useState(1.8);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const [streamData, setStreamData] = useState<any[]>([]);

  const handleRunPrediction = async (customParams?: any) => {
    setLoading(true);
    const p = customParams || {
      depth_m: depth,
      gassiness_degree: gassiness,
      open_violations: violations,
      days_since_last_inspection: daysSinceInsp,
      ch4_pct: ch4,
      co_ppm: co,
      ventilation_velocity_ms: ventilation
    };
    const res = await predictSectionRisk(p);
    setPredictionResult(res);
    setLoading(false);
  };

  const applyScenario = (sc: typeof scenarios[0]) => {
    setDepth(sc.params.depth);
    setGassiness(sc.params.gassiness);
    setViolations(sc.params.violations);
    setDaysSinceInsp(sc.params.days);
    setCh4(sc.params.ch4);
    setCo(sc.params.co);
    setVentilation(sc.params.vent);

    handleRunPrediction({
      depth_m: sc.params.depth,
      gassiness_degree: sc.params.gassiness,
      open_violations: sc.params.violations,
      days_since_last_inspection: sc.params.days,
      ch4_pct: sc.params.ch4,
      co_ppm: sc.params.co,
      ventilation_velocity_ms: sc.params.vent
    });
  };

  useEffect(() => {
    try {
      const mine = storageService.getActiveAllocatedMine();
      const prof = getCollieryProfile(mine);
      setColliery(prof);
      setDepth(prof.seamDepthM);
      setGassiness(prof.gassiness === "Degree III" ? 3 : prof.gassiness === "Degree II" ? 2 : 1);
      setViolations(prof.openViolations);
      setCh4(prof.ch4Current);
      setCo(prof.coCurrent);
      setVentilation(prof.ventilationVelocity);

      const initialStream = prof.sections.slice(0, 4).map(sec => ({
        section: sec.name,
        ch4: sec.ch4 ?? prof.ch4Current,
        co: sec.co ?? prof.coCurrent,
        air: sec.ventilation ?? prof.ventilationVelocity,
        temp: 29.5,
        status: sec.risk === "High" ? "Critical" : sec.risk === "Medium" ? "Warning" : "Normal",
        alert: sec.risk === "High" ? `Elevated hazard level in ${sec.name}` : "Within statutory thresholds"
      }));
      setStreamData(initialStream);

      handleRunPrediction({
        depth_m: prof.seamDepthM,
        gassiness_degree: prof.gassiness === "Degree III" ? 3 : prof.gassiness === "Degree II" ? 2 : 1,
        open_violations: prof.openViolations,
        days_since_last_inspection: 8,
        ch4_pct: prof.ch4Current,
        co_ppm: prof.coCurrent,
        ventilation_velocity_ms: prof.ventilationVelocity
      });
    } catch (e) {}

    const interval = setInterval(async () => {
      const data = await fetchLiveTelemetryStream();
      if (data && data.stream) {
        setStreamData(data.stream);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Executive Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #07130b 0%, #0f2318 50%, #1a3d28 100%)",
        border: "1px solid rgba(82,183,136,0.3)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 2 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BrainCircuit size={22} color="#86efac" />
              </div>
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>
                  AI Risk & Predictive Operations Intelligence · {colliery.cleanName}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                  Sub-surface Multi-Gas Telemetry & DGMS Risk Modeling for {colliery.cleanName} ({colliery.subsidiary})
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Model Test Accuracy</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#86efac" }}>97.67%</p>
            </div>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Inference Latency</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: "white" }}>18ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Scenario Presets */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Zap size={16} color="#2d6a4f" />
          <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Operational Scenario Simulations
          </h3>
          <span style={{ fontSize: 11, color: "#6b7280" }}>Click to simulate actual colliery emergency events</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {scenarios.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <button
                key={i}
                onClick={() => applyScenario(sc)}
                style={{
                  textAlign: "left",
                  padding: "13px 15px",
                  borderRadius: 12,
                  background: sc.color,
                  border: `1.5px solid ${sc.border}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease-in-out"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Icon size={16} color={sc.textColor} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: sc.textColor }}>{sc.name}</span>
                </div>
                <p style={{ fontSize: 11.5, color: "#4b5563" }}>{sc.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Simulator + Live Prediction Result */}
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Simulator Controls */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sliders size={17} color="#2d6a4f" />
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#111827" }}>Colliery Section Risk Parameter Tuning</h3>
            </div>
            <span style={{ fontSize: 11, padding: "3px 9px", background: "#f3f4f6", borderRadius: 12, color: "#4b5563", fontWeight: 600 }}>
              DGMS CMR 2017 Rules Active
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Depth */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Seam Depth</span>
                <span style={{ fontWeight: 700, color: "#2d6a4f" }}>{depth} meters</span>
              </div>
              <input type="range" min="40" max="680" step="10" value={depth} onChange={e => setDepth(Number(e.target.value))} style={{ width: "100%", accentColor: "#2d6a4f" }} />
            </div>

            {/* Gassiness Degree */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Gassiness Classification</span>
                <span style={{ fontWeight: 700, color: gassiness === 3 ? "#dc2626" : gassiness === 2 ? "#ea580c" : "#16a34a" }}>
                  Degree {gassiness} {gassiness === 3 ? "(High Gas)" : ""}
                </span>
              </div>
              <input type="range" min="1" max="3" step="1" value={gassiness} onChange={e => setGassiness(Number(e.target.value))} style={{ width: "100%", accentColor: "#2d6a4f" }} />
            </div>

            {/* Methane CH4 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Methane (CH₄)</span>
                <span style={{ fontWeight: 700, color: ch4 >= 1.25 ? "#dc2626" : ch4 >= 0.8 ? "#ea580c" : "#16a34a" }}>{ch4}%</span>
              </div>
              <input type="range" min="0.05" max="2.2" step="0.05" value={ch4} onChange={e => setCh4(Number(e.target.value))} style={{ width: "100%", accentColor: ch4 >= 1.0 ? "#dc2626" : "#2d6a4f" }} />
            </div>

            {/* Carbon Monoxide CO */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Carbon Monoxide (CO)</span>
                <span style={{ fontWeight: 700, color: co >= 40 ? "#dc2626" : co >= 22 ? "#ea580c" : "#16a34a" }}>{co} ppm</span>
              </div>
              <input type="range" min="2" max="85" step="1" value={co} onChange={e => setCo(Number(e.target.value))} style={{ width: "100%", accentColor: co >= 40 ? "#dc2626" : "#2d6a4f" }} />
            </div>

            {/* Ventilation Velocity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Ventilation Velocity</span>
                <span style={{ fontWeight: 700, color: ventilation < 0.5 ? "#dc2626" : "#16a34a" }}>{ventilation} m/s</span>
              </div>
              <input type="range" min="0.1" max="4.0" step="0.05" value={ventilation} onChange={e => setVentilation(Number(e.target.value))} style={{ width: "100%", accentColor: "#2d6a4f" }} />
            </div>

            {/* Open Violations */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Open Violation Backlog</span>
                <span style={{ fontWeight: 700, color: violations >= 5 ? "#dc2626" : "#2d6a4f" }}>{violations} items</span>
              </div>
              <input type="range" min="0" max="14" step="1" value={violations} onChange={e => setViolations(Number(e.target.value))} style={{ width: "100%", accentColor: "#2d6a4f" }} />
            </div>
          </div>

          <button
            onClick={() => handleRunPrediction()}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "12px",
              background: "#0f2318",
              color: "#86efac",
              border: "none",
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(15,35,24,0.2)"
            }}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Cpu size={17} />}
            Execute Ensemble Model Prediction
          </button>
        </div>

        {/* Prediction Results Display */}
        {predictionResult && (
          <div style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Inference Output</span>
                <span style={{ fontSize: 11, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 9px", borderRadius: 10, color: "#15803d", fontWeight: 700 }}>
                  Confidence: {predictionResult.confidence}%
                </span>
              </div>

              {/* Big Status Badge */}
              <div style={{
                padding: "16px",
                borderRadius: 12,
                background: predictionResult.predicted_risk === "High" ? "#fee2e2" : predictionResult.predicted_risk === "Medium" ? "#fff7ed" : "#dcfce7",
                border: `1.5px solid ${predictionResult.predicted_risk === "High" ? "#fca5a5" : predictionResult.predicted_risk === "Medium" ? "#fed7aa" : "#86efac"}`,
                textAlign: "center",
                marginBottom: 14
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase" }}>Classified Risk Category</p>
                <h3 style={{
                  fontSize: 27,
                  fontWeight: 800,
                  color: predictionResult.predicted_risk === "High" ? "#dc2626" : predictionResult.predicted_risk === "Medium" ? "#ea580c" : "#16a34a",
                  marginTop: 2
                }}>
                  {predictionResult.predicted_risk} Risk Colliery
                </h3>
              </div>

              {/* Factors */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 6 }}>Root-Cause Risk Drivers</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {predictionResult.primary_risk_factors.map((f: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: "#374151", display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ color: "#dc2626", fontWeight: 700 }}>•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Actions */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#15803d", textTransform: "uppercase", marginBottom: 4 }}>DGMS Statutory Action Directive</p>
                <p style={{ fontSize: 12.5, color: "#166534", lineHeight: 1.4, fontWeight: 500 }}>
                  {predictionResult.recommended_dgms_actions[0]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Importance & Telemetry Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 16 }}>
        {/* Feature Importance Bar Chart */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Model Feature Importance (SHAP Surrogate)</h3>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Contribution %</span>
          </div>

          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} domain={[0, 40]} unit="%" axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => [`${v}%`, "Feature Weight"]} />
                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                  {featureImportanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live IoT ETMS Telemetry Stream */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Radio size={16} color="#16a34a" className="animate-pulse" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Sub-surface ETMS Telemetry Stream</h3>
            </div>
            <span style={{ fontSize: 11, padding: "2px 8px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, color: "#16a34a", fontWeight: 600 }}>
              Live 6s Refresh
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {streamData.map((node, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${node.status === "Critical" ? "#fca5a5" : "#e5e7eb"}`,
                  background: node.status === "Critical" ? "#fef2f2" : "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <h4 style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{node.section}</h4>
                    {node.status === "Critical" && (
                      <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, background: "#dc2626", color: "white", fontWeight: 700 }}>
                        HAZARD
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: node.status === "Critical" ? "#dc2626" : "#6b7280", marginTop: 1 }}>
                    {node.alert}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12, textAlign: "right" }}>
                  <div>
                    <p style={{ fontSize: 9.5, color: "#9ca3af" }}>CH₄</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: node.ch4 >= 1.0 ? "#dc2626" : "#111827" }}>{node.ch4}%</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 9.5, color: "#9ca3af" }}>CO</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: node.co >= 35 ? "#dc2626" : "#111827" }}>{node.co} ppm</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 9.5, color: "#9ca3af" }}>AIR</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: node.air < 0.5 ? "#dc2626" : "#111827" }}>{node.air} m/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
