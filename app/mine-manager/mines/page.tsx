"use client";

import { useState, useEffect } from "react";
import {
  Mountain, MapPin, AlertTriangle, CheckCircle, Users, Gauge,
  Activity, ChevronRight, Clock, BrainCircuit, Sparkles, ShieldAlert, Cpu
} from "lucide-react";
import AiRiskModal, { AiRiskTarget } from "@/app/components/AiRiskModal";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile, WorkingSection } from "@/lib/collieryData";

const riskStyle = (r: string) => {
  if (r === "High") return { color: "#dc2626", bg: "#fee2e2", dot: "#e63946" };
  if (r === "Medium") return { color: "#ea580c", bg: "#fff7ed", dot: "#f4a261" };
  return { color: "#16a34a", bg: "#dcfce7", dot: "#52b788" };
};

const statusStyle = (s: string) => {
  if (s === "Active") return { color: "#16a34a", bg: "#dcfce7" };
  if (s === "Restricted") return { color: "#dc2626", bg: "#fee2e2" };
  return { color: "#6b7280", bg: "#f3f4f6" };
};

const complianceColor = (c: number) => c >= 85 ? "#16a34a" : c >= 70 ? "#ea580c" : "#dc2626";
const complianceBg = (c: number) => c >= 85 ? "#52b788" : c >= 70 ? "#f4a261" : "#e63946";

export default function MineManagerMinesPage() {
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

  const totalWorkers = colliery.sections.reduce((s, sec) => s + sec.workers, 0);
  const activeSections = colliery.sections.filter(s => s.status === "Active").length;
  const restrictedSections = colliery.sections.filter(s => s.status === "Restricted").length;
  const avgCompliance = Math.round(colliery.sections.reduce((s, sec) => s + sec.compliance, 0) / (colliery.sections.length || 1));
  const highRiskAreas = colliery.sections.filter(s => s.risk === "High").length;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header with Allocated Mine Info */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Mountain size={22} color="#2d6a4f" />
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            {colliery.cleanName}
          </h2>
          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: "#dcfce7", color: "#16a34a" }}>
            Allocated Colliery
          </span>
          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: "#eff6ff", color: "#1d4ed8" }}>
            {colliery.subsidiary} · {colliery.gassiness}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={13} color="#9ca3af" />
          {colliery.coalfield}, {colliery.state} &nbsp;·&nbsp; {colliery.type} ({colliery.capacityMtpa} MTPA Capacity) &nbsp;·&nbsp;
          Seam Depth: {colliery.seamDepthM}m
        </p>
      </div>

      {/* Colliery KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Deployed Manpower", value: totalWorkers || colliery.manpower, color: "#2563eb", bg: "#eff6ff", icon: <Users size={17} color="#2563eb" /> },
          { label: "Active Working Faces", value: activeSections, color: "#16a34a", bg: "#dcfce7", icon: <Activity size={17} color="#16a34a" /> },
          { label: "Restricted Sections", value: restrictedSections, color: "#dc2626", bg: "#fee2e2", icon: <AlertTriangle size={17} color="#dc2626" /> },
          { label: "Average Compliance", value: `${avgCompliance}%`, color: complianceColor(avgCompliance), bg: avgCompliance >= 85 ? "#dcfce7" : "#fff7ed", icon: <CheckCircle size={17} color={complianceColor(avgCompliance)} /> },
          { label: "High-Risk Working Faces", value: highRiskAreas, color: "#dc2626", bg: "#fee2e2", icon: <ShieldAlert size={17} color="#dc2626" /> },
        ].map(c => (
          <div key={c.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: c.color, lineHeight: 1.2, marginTop: 2 }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Cards Grid (Specific to Allocated Colliery) */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
            Working Sections & Surface Facilities ({colliery.sections.length})
          </h3>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Underground and opencast surveillance zones for {colliery.cleanName}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
          {colliery.sections.map(sec => {
            const rs = riskStyle(sec.risk);
            const ss = statusStyle(sec.status);
            return (
              <div key={sec.name} style={{
                background: "white",
                border: `1px solid ${sec.status === "Restricted" ? "#fca5a5" : "#e5e7eb"}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: sec.status === "Restricted" ? "0 0 0 2px #fee2e2" : "none",
              }}>
                {/* Section header */}
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", margin: 0 }}>{sec.name}</p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                      <Gauge size={11} /> Depth: {sec.depth}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: ss.bg, color: ss.color }}>
                      {sec.status}
                    </span>
                    <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: rs.bg, color: rs.color }}>
                      {sec.risk} Risk
                    </span>
                  </div>
                </div>

                {/* Compliance bar */}
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #f9fafb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#6b7280" }}>Statutory Compliance</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: complianceColor(sec.compliance) }}>{sec.compliance}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${sec.compliance}%`, background: complianceBg(sec.compliance), borderRadius: 4 }} />
                  </div>
                </div>

                {/* Subsurface Sensor Telemetry */}
                <div style={{ padding: "8px 16px", background: "#fcfdfd", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <div>
                    <span style={{ color: "#6b7280" }}>CH₄: </span>
                    <strong style={{ color: (sec.ch4 || 0) > 1.0 ? "#dc2626" : "#059669" }}>{sec.ch4 ?? 0.12}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>CO: </span>
                    <strong style={{ color: (sec.co || 0) > 25 ? "#dc2626" : "#059669" }}>{sec.co ?? 8} ppm</strong>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Air: </span>
                    <strong>{sec.ventilation ?? 2.4} m/s</strong>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #f9fafb", display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Users size={12} color="#6b7280" />
                    <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{sec.workers}</span>
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>workers</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={12} color="#6b7280" />
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{sec.lastInspected}</span>
                  </div>
                </div>

                {/* Hazards list */}
                <div style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                    {sec.hazards.map(h => (
                      <span key={h} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10.5, background: "#fff7ed", color: "#92400e", border: "1px solid #fde68a" }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>
                      Sup: <span style={{ color: sec.supervisor === "—" ? "#dc2626" : "#374151", fontWeight: 600 }}>{sec.supervisor === "—" ? "Unassigned" : sec.supervisor}</span>
                    </span>
                    <button
                      onClick={() => setSelectedAiTarget({
                        name: `${sec.name} (${colliery.cleanName})`,
                        depth: sec.depth,
                        compliance: sec.compliance,
                        risk: sec.risk,
                        workers: sec.workers,
                        ch4: sec.ch4 || colliery.ch4Current,
                        co: sec.co || colliery.coCurrent,
                        air: sec.ventilation || colliery.ventilationVelocity,
                        violations: colliery.openViolations
                      })}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "#2d6a4f",
                        background: "#e8f5ee",
                        border: "1px solid rgba(45,106,79,0.25)",
                        borderRadius: 6,
                        padding: "5px 10px",
                        cursor: "pointer"
                      }}
                    >
                      <BrainCircuit size={13} color="#2d6a4f" />
                      Run AI Analysis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Risk Diagnostic Modal */}
      <AiRiskModal
        target={selectedAiTarget}
        onClose={() => setSelectedAiTarget(null)}
      />
    </div>
  );
}
