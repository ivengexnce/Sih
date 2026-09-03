"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, X,
  Activity, Wind, Flame, CheckCircle, ShieldAlert, ArrowRight,
  Copy, Check
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

/* Circular gauge component */
function RiskGauge({ score, color }: { score: number; color: string }) {
  const R = 38;
  const circ = 2 * Math.PI * R;
  const filled = (score / 100) * circ;
  return (
    <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={50} cy={50} r={R} fill="none" stroke="#f1f5f9" strokeWidth={10} />
      <circle
        cx={50} cy={50} r={R} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

/* Skeleton shimmer row */
function SkeletonRow({ w = "100%", h = 14 }: { w?: string; h?: number }) {
  return (
    <div style={{
      width: w, height: h,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: 6,
    }} />
  );
}

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!target) return;
    setLoading(true);
    setInjected(false);
    setCopied(false);

    const depthNum = typeof target.depth === "number"
      ? target.depth
      : parseInt(String(target.depth || "200").replace(/\D/g, "")) || 200;
    const isLevel3 = target.name.includes("Level 3") || target.name.includes("Bay 3");
    const isLevel2 = target.name.includes("Level 2");

    const ch4 = target.ch4 ?? (isLevel3 ? 1.35 : isLevel2 ? 0.85 : 0.22);
    const co  = target.co  ?? (isLevel3 ? 48   : isLevel2 ? 26   : 10);
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

  const handleCopyReport = () => {
    if (!data) return;
    const txt = `MineGuard AI Risk Report — ${target?.name}\nHazard Score: ${data.composite_hazard_score}/100 (${data.risk_level} Risk)\n72h Incident Probability: ${data.predicted_incident_probability_72h}%\n\nXAI Observations:\n${data.critical_observations.join("\n")}\n\nDirectives:\n${data.preventive_actions.map((a: any) => `${a.priority}: ${a.mandate}`).join("\n")}`;
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!target) return null;

  const riskColor = data?.risk_color ?? "#ea580c";
  const riskLevel = data?.risk_level ?? "Medium";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(5,15,8,0.72)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9_999, padding: 20,
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "white",
        borderRadius: 18,
        maxWidth: 700, width: "100%",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 4px 20px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.8)",
        animation: "fadeInScale 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        position: "relative",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "18px 22px 16px",
          background: "linear-gradient(135deg, #060f08 0%, #0f2318 60%, #162e1f 100%)",
          borderRadius: "17px 17px 0 0",
          borderBottom: "1px solid rgba(82,183,136,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "rgba(82,183,136,0.12)",
                border: "1px solid rgba(82,183,136,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(82,183,136,0.20)",
              }}>
                <BrainCircuit size={20} color="#74c69d" style={{ animation: loading ? "spin 2s linear infinite" : "none" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ color: "white", fontSize: 16, fontWeight: 800, margin: 0 }}>
                    AI Risk Diagnostic
                  </h3>
                  <span style={{
                    fontSize: 10, padding: "2px 8px",
                    background: "rgba(134,239,172,0.12)",
                    border: "1px solid rgba(134,239,172,0.28)",
                    borderRadius: 10, color: "#86efac", fontWeight: 800,
                    letterSpacing: "0.04em",
                  }}>
                    XAI · CMR 2017
                  </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0 }}>
                  Section: <strong style={{ color: "rgba(255,255,255,0.85)" }}>{target.name}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "6px 8px", color: "rgba(255,255,255,0.7)",
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "22px 22px 20px" }}>
          {loading ? (
            /* Skeleton loading state */
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[0, 1].map(i => (
                  <div key={i} style={{ padding: 16, background: "#f9fafb", borderRadius: 12, border: "1px solid #f3f4f6" }}>
                    <SkeletonRow w="50%" h={11} />
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0f0f0", animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }} />
                      <div style={{ flex: 1 }}>
                        <SkeletonRow w="60%" h={28} />
                        <div style={{ marginTop: 6 }}><SkeletonRow w="40%" h={11} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <SkeletonRow w="40%" h={12} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ padding: 12, background: "#f9fafb", borderRadius: 10 }}>
                      <SkeletonRow w="70%" h={10} />
                      <div style={{ marginTop: 8 }}><SkeletonRow w="50%" h={20} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                    <SkeletonRow w="80%" h={12} />
                    <div style={{ marginTop: 6 }}><SkeletonRow w="60%" h={10} /></div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 20, color: "#94a3b8" }}>
                <p style={{ fontSize: 12.5, fontWeight: 600 }}>Running Multi-Factor AI Risk Analysis…</p>
                <p style={{ fontSize: 11.5, marginTop: 3 }}>Evaluating gas telemetry, ventilation velocity & historical DGMS failure modes</p>
              </div>
            </div>
          ) : data ? (
            <div>
              {/* Score Banner */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12, marginBottom: 18,
              }}>
                {[
                  { label: "AI Hazard Score", valueStr: `${data.composite_hazard_score}`, suffix: "/ 100", extra: `${riskLevel} Risk` },
                  { label: "72-Hour Incident Probability", valueStr: `${data.predicted_incident_probability_72h}%`, suffix: "" },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: riskLevel === "High" ? "#fff1f2" : riskLevel === "Medium" ? "#fffbeb" : "#f0fdf4",
                    border: `1.5px solid ${riskLevel === "High" ? "#fecdd3" : riskLevel === "Medium" ? "#fde68a" : "#bbf7d0"}`,
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      <RiskGauge score={parseFloat(item.valueStr.replace("%",""))} color={riskColor} />
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        transform: "rotate(90deg)",
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: riskColor, lineHeight: 1 }}>{item.valueStr}</span>
                        {item.suffix && <span style={{ fontSize: 9, color: "#6b7280" }}>{item.suffix}</span>}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", margin: "0 0 4px", letterSpacing: "0.05em" }}>
                        {item.label}
                      </p>
                      {item.extra && (
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px", borderRadius: 20,
                          background: riskColor, color: "white",
                          fontSize: 11, fontWeight: 800,
                        }}>
                          {item.extra}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub Indices */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  Multi-Factor Risk Breakdown
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {[
                    { label: "Gas Hazard",   val: data.sub_indices.gas_hazard_index,       icon: Flame },
                    { label: "Ventilation",  val: data.sub_indices.ventilation_index,       icon: Wind },
                    { label: "Strata Depth", val: data.sub_indices.strata_depth_index,      icon: Activity },
                    { label: "Human Exp.",   val: data.sub_indices.human_exposure_index,    icon: ShieldAlert },
                  ].map(idx => {
                    const Icon = idx.icon;
                    const isHigh = idx.val >= 60;
                    const barColor = isHigh ? "#dc2626" : idx.val >= 40 ? "#ea580c" : "#16a34a";
                    return (
                      <div key={idx.label} style={{
                        padding: "12px",
                        background: "#f9fafb", borderRadius: 10,
                        border: "1px solid #f3f4f6",
                        animation: "fadeInUp 0.4s ease",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 11, marginBottom: 6 }}>
                          <Icon size={13} color={barColor} />
                          <span style={{ fontWeight: 600 }}>{idx.label}</span>
                        </div>
                        <p style={{ fontSize: 20, fontWeight: 800, color: barColor, margin: "0 0 6px" }}>
                          {idx.val}%
                        </p>
                        <div style={{ height: 4, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${idx.val}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 0.8s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* XAI Observations */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Explainable AI (XAI) Observations
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {data.critical_observations.map((obs: string, i: number) => (
                    <div key={i} style={{
                      fontSize: 12.5, color: "#374151",
                      padding: "9px 12px",
                      background: "#fafafa",
                      borderRadius: 8, border: "1px solid #f3f4f6",
                      display: "flex", alignItems: "flex-start", gap: 10,
                      animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#fff7ed", border: "1px solid #fdba74",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 1,
                      }}>
                        <AlertTriangle size={11} color="#ea580c" />
                      </div>
                      <span style={{ lineHeight: 1.4 }}>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preventive Actions */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  DGMS Statutory Action Directives (CMR 2017)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.preventive_actions.map((act: any, i: number) => (
                    <div key={i} style={{
                      padding: "11px 14px",
                      background: "linear-gradient(135deg, #f0fdf4 0%, #f7fef5 100%)",
                      border: "1px solid #bbf7d0",
                      borderRadius: 10,
                      display: "flex", alignItems: "flex-start", gap: 10,
                      animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: act.priority.includes("P1") ? "#fee2e2" : "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <ArrowRight size={12} color={act.priority.includes("P1") ? "#dc2626" : "#16a34a"} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 10.5, fontWeight: 800,
                            color: act.priority.includes("P1") ? "#dc2626" : "#2d6a4f",
                          }}>{act.priority}</span>
                          <span style={{ fontSize: 10.5, color: "#6b7280" }}>{act.authority}</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: "#166534", fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                          {act.mandate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setInjected(true)}
                  disabled={injected}
                  style={{
                    flex: 1, padding: "11px 16px",
                    background: injected
                      ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
                      : "linear-gradient(135deg, #0f2318 0%, #1a3d28 100%)",
                    color: "white", border: "none",
                    borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: injected ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    boxShadow: injected ? "0 4px 12px rgba(22,163,74,0.30)" : "0 4px 12px rgba(15,35,24,0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {injected ? <CheckCircle size={16} /> : <Sparkles size={16} />}
                  {injected ? "Directives Injected into CAPA Queue!" : "Deploy AI Directives to CAPA"}
                </button>

                <button
                  onClick={handleCopyReport}
                  title="Copy report to clipboard"
                  style={{
                    padding: "11px 14px",
                    background: copied ? "#f0fdf4" : "#f3f4f6",
                    color: copied ? "#16a34a" : "#374151",
                    border: `1px solid ${copied ? "#bbf7d0" : "#e5e7eb"}`,
                    borderRadius: 10, fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.15s ease",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>

                <button
                  onClick={onClose}
                  style={{
                    padding: "11px 18px",
                    background: "#f3f4f6", color: "#374151",
                    border: "1px solid #e5e7eb", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s ease",
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
