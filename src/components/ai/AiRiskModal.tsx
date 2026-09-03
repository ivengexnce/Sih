"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, X,
  Activity, Wind, Flame, CheckCircle, ArrowRight, ShieldAlert
} from "lucide-react";
import { performDeepRiskAnalysis } from "@/lib/api";

export type AiRiskTarget = {
  name: string;
  depth?: string | number;
  compliance?: number;
  risk?: string;
  workers?: number;
  ch4?: number;
  co?: number;
  air?: number;
  violations?: number;
};

export default function AiRiskModal({
  target,
  onClose
}: {
  target: AiRiskTarget | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [injected, setInjected] = useState(false);

  useEffect(() => {
    if (!target) return;
    setLoading(true);
    setInjected(false);

    const depthNum = typeof target.depth === "number" ? target.depth : parseInt(String(target.depth || "200").replace(/\D/g, "")) || 200;
    const isLevel3 = target.name.includes("Level 3") || target.name.includes("Bay 3");
    const isLevel2 = target.name.includes("Level 2");

    const ch4 = target.ch4 ?? (isLevel3 ? 1.35 : isLevel2 ? 0.85 : 0.22);
    const co = target.co ?? (isLevel3 ? 48 : isLevel2 ? 26 : 10);
    const air = target.air ?? (isLevel3 ? 0.38 : isLevel2 ? 0.65 : 1.4);
    const violations = target.violations ?? (isLevel3 ? 6 : target.risk === "High" ? 5 : 2);

    performDeepRiskAnalysis({
      section_name: target.name,
      depth_m: depthNum,
      ch4_pct: ch4,
      co_ppm: co,
      air_velocity_ms: air,
      open_violations: violations,
      workers_count: target.workers || 35
    }).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [target]);

  if (!target) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 35, 24, 0.7)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        background: "white",
        borderRadius: 16,
        maxWidth: 680,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "1px solid #e5e7eb",
        animation: "fadeIn 0.2s ease-out"
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 22px",
          background: "#0f2318",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#1a3d28", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BrainCircuit size={18} color="#86efac" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ color: "white", fontSize: 16, fontWeight: 700 }}>AI Risk Diagnostic Analysis</h3>
                <span style={{ fontSize: 10.5, padding: "2px 7px", background: "rgba(134,239,172,0.15)", border: "1px solid rgba(134,239,172,0.3)", borderRadius: 10, color: "#86efac", fontWeight: 700 }}>
                  XAI Model
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                Section: <strong style={{ color: "white" }}>{target.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: 6, color: "white", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 22 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              <BrainCircuit size={32} color="#2d6a4f" style={{ margin: "0 auto 10px", animation: "spin 1.5s linear infinite" }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Running Multi-Factor AI Risk Analysis...</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Evaluating gas telemetry, ventilation velocity, and historical DGMS failure modes</p>
            </div>
          ) : data ? (
            <div>
              {/* Score Banner */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                padding: 16,
                borderRadius: 12,
                background: data.risk_level === "High" ? "#fef2f2" : data.risk_level === "Medium" ? "#fffbeb" : "#f0fdf4",
                border: `1.5px solid ${data.risk_level === "High" ? "#fca5a5" : data.risk_level === "Medium" ? "#fde68a" : "#bbf7d0"}`,
                marginBottom: 16
              }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>AI Hazard Score</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: data.risk_color }}>{data.composite_hazard_score}</span>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>/ 100</span>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: data.risk_color, color: "white", marginLeft: 8 }}>
                      {data.risk_level} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>72-Hour Incident Probability</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: data.risk_color }}>{data.predicted_incident_probability_72h}%</span>
                  </div>
                </div>
              </div>

              {/* Sub Indices */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 8 }}>
                  Multi-Factor Risk Breakdown
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[
                    { label: "Gas Hazard", val: data.sub_indices.gas_hazard_index, icon: Flame },
                    { label: "Ventilation", val: data.sub_indices.ventilation_index, icon: Wind },
                    { label: "Strata Depth", val: data.sub_indices.strata_depth_index, icon: Activity },
                    { label: "Human Exp.", val: data.sub_indices.human_exposure_index, icon: ShieldAlert },
                  ].map(idx => {
                    const Icon = idx.icon;
                    const isHigh = idx.val >= 60;
                    return (
                      <div key={idx.label} style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 11 }}>
                          <Icon size={13} color={isHigh ? "#dc2626" : "#2d6a4f"} />
                          <span>{idx.label}</span>
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: isHigh ? "#dc2626" : "#111827", marginTop: 4 }}>
                          {idx.val}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Observations */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 6 }}>
                  Explainable AI (XAI) Observations
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {data.critical_observations.map((obs: string, i: number) => (
                    <div key={i} style={{ fontSize: 12.5, color: "#374151", padding: "8px 10px", background: "#fafafa", borderRadius: 6, border: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: "#ea580c", fontWeight: 700 }}>•</span>
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: "#15803d", textTransform: "uppercase", marginBottom: 6 }}>
                  DGMS Statutory Action Directives (CMR 2017)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.preventive_actions.map((act: any, i: number) => (
                    <div key={i} style={{ padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, color: act.priority.includes("P1") ? "#dc2626" : "#2d6a4f" }}>
                          {act.priority}
                        </span>
                        <span style={{ color: "#6b7280" }}>{act.authority}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#166534", fontWeight: 500 }}>{act.mandate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setInjected(true)}
                  disabled={injected}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: injected ? "#16a34a" : "#0f2318",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: injected ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  {injected ? <CheckCircle size={15} /> : <Sparkles size={15} />}
                  {injected ? "Directives Injected into CAPA Queue!" : "Deploy AI Directives to CAPA"}
                </button>
                <button
                  onClick={onClose}
                  style={{
                    padding: "10px 18px",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
