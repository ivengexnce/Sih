"use client";

import { useState } from "react";
import { Mountain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, MapPin, Users, ChevronRight, BrainCircuit, Globe, Building } from "lucide-react";
import AiRiskModal, { AiRiskTarget } from "@/components/AiRiskModal";

const CIL_ALL_MINES = [
  {
    name: "SECL Gevra Mega Opencast", subsidiary: "SECL", location: "Korba, Chhattisgarh", type: "Opencast", status: "Active", compliance: 94, violations: 3, inspections: 184, workers: 3850, risk: "Low",
    manager: "Er. Rajesh Kumar Sharma", output: "52.5 MTPA", color: "#2d6a4f", ch4: 0.12, co: 8, air: 3.2, depth: "120m"
  },
  {
    name: "BCCL Jharia Deep Colliery", subsidiary: "BCCL", location: "Dhanbad, Jharkhand", type: "Underground (Degree III)", status: "Active", compliance: 74, violations: 12, inspections: 142, workers: 2140, risk: "High",
    manager: "Er. A. K. Choudhury", output: "4.2 MTPA", color: "#dc2626", ch4: 1.35, co: 44, air: 0.95, depth: "380m"
  },
  {
    name: "NCL Singrauli (Jayant OCP)", subsidiary: "NCL", location: "Singrauli, MP", type: "Opencast", status: "Active", compliance: 93, violations: 4, inspections: 165, workers: 2900, risk: "Low",
    manager: "Er. Rameshwar Dayal", output: "25.0 MTPA", color: "#2563eb", ch4: 0.10, co: 9, air: 3.5, depth: "165m"
  },
  {
    name: "SECL Kusmunda Colliery", subsidiary: "SECL", location: "Korba, Chhattisgarh", type: "Opencast", status: "Active", compliance: 92, violations: 5, inspections: 150, workers: 3100, risk: "Low",
    manager: "Er. M. K. Sahu", output: "50.0 MTPA", color: "#2d6a4f", ch4: 0.09, co: 7, air: 3.4, depth: "135m"
  },
  {
    name: "MCL Bhubaneswari OCP", subsidiary: "MCL", location: "Talcher, Odisha", type: "Opencast", status: "Active", compliance: 88, violations: 7, inspections: 130, workers: 2450, risk: "Medium",
    manager: "Er. S. Mohapatra", output: "28.0 MTPA", color: "#ea580c", ch4: 0.14, co: 11, air: 2.9, depth: "95m"
  },
  {
    name: "ECL Raniganj Deep (Chinakoori)", subsidiary: "ECL", location: "Burdwan, West Bengal", type: "Deep Underground (Degree III)", status: "Active", compliance: 79, violations: 9, inspections: 112, workers: 1780, risk: "High",
    manager: "Er. S. K. Banerjee", output: "1.8 MTPA", color: "#dc2626", ch4: 1.28, co: 36, air: 1.10, depth: "620m"
  },
  {
    name: "SECL Rajpura Coal Mine", subsidiary: "SECL", location: "Bisrampur, Chhattisgarh", type: "Underground + Opencast", status: "Active", compliance: 88, violations: 6, inspections: 126, workers: 1450, risk: "Medium",
    manager: "Er. Rajesh Sharma", output: "12.0 MTPA", color: "#2d6a4f", ch4: 0.45, co: 18, air: 1.80, depth: "185m"
  },
  {
    name: "CCL Piparwar Colliery", subsidiary: "CCL", location: "North Karanpura, Jharkhand", type: "Opencast & In-Pit CHP", status: "Active", compliance: 90, violations: 4, inspections: 118, workers: 1920, risk: "Low",
    manager: "Er. V. K. Mishra", output: "16.0 MTPA", color: "#16a34a", ch4: 0.08, co: 6, air: 3.1, depth: "110m"
  },
  {
    name: "WCL Umrer Colliery", subsidiary: "WCL", location: "Nagpur, Maharashtra", type: "Opencast", status: "Active", compliance: 89, violations: 5, inspections: 95, workers: 1200, risk: "Low",
    manager: "Er. P. B. Deshmukh", output: "3.5 MTPA", color: "#2563eb", ch4: 0.06, co: 5, air: 3.6, depth: "80m"
  },
];

const riskStyle = (r: string) => {
  if (r === "Low") return { color: "#16a34a", bg: "#dcfce7" };
  if (r === "High") return { color: "#dc2626", bg: "#fee2e2" };
  if (r === "Medium") return { color: "#ea580c", bg: "#fff7ed" };
  return { color: "#6b7280", bg: "#f3f4f6" };
};

export default function CorporateMinesPage() {
  const [selectedAiTarget, setSelectedAiTarget] = useState<AiRiskTarget | null>(null);
  const [filterSub, setFilterSub] = useState("All");

  const filteredMines = filterSub === "All"
    ? CIL_ALL_MINES
    : CIL_ALL_MINES.filter(m => m.subsidiary === filterSub);

  const active = filteredMines.filter(m => m.status === "Active").length;
  const totalWorkers = filteredMines.reduce((s, m) => s + m.workers, 0);
  const avgCompliance = Math.round(filteredMines.reduce((s, m) => s + m.compliance, 0) / (filteredMines.length || 1));
  const highRisk = filteredMines.filter(m => m.risk === "High").length;

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Building size={22} color="#1d4ed8" />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              National Colliery Registry (Pan-India Scope)
            </h2>
            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
              Corporate Admin View (All CIL Subsidiaries)
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "4px 0 0" }}>
            Full portfolio oversight across Coal India subsidiaries: SECL, BCCL, NCL, MCL, ECL, CCL, and WCL.
          </p>
        </div>

        {/* Subsidiary Filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "SECL", "BCCL", "NCL", "MCL", "ECL", "CCL", "WCL"].map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSub(sub)}
              style={{
                padding: "6px 13px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: "1.5px solid",
                borderColor: filterSub === sub ? "#1d4ed8" : "var(--border)",
                background: filterSub === sub ? "#1d4ed8" : "white",
                color: filterSub === sub ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                boxShadow: filterSub === sub ? "0 2px 8px rgba(29,78,216,0.25)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Monitored Collieries", value: active, color: "#1d4ed8", bg: "#eff6ff" },
          { label: "Total Workforce (CIL)", value: totalWorkers.toLocaleString(), color: "#2563eb", bg: "#eff6ff" },
          { label: "National Avg Compliance", value: `${avgCompliance}%`, color: "#16a34a", bg: "#dcfce7" },
          { label: "High Risk Collieries", value: highRisk, color: "#dc2626", bg: "#fee2e2" },
        ].map(c => (
          <div
            key={c.label}
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "16px 18px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-xs)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)")}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.6 }} />
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{c.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Mine Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 16 }}>
        {filteredMines.map(mine => {
          const rs = riskStyle(mine.risk);
          return (
            <div
              key={mine.name}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              {/* Top banner */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${mine.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Mountain size={20} color={mine.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{mine.name}</h3>
                    <p style={{ fontSize: 11.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, margin: "3px 0 0" }}>
                      <MapPin size={11} /> {mine.location} · <strong style={{ color: "#1d4ed8" }}>{mine.subsidiary}</strong>
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 800, background: "#dcfce7", color: "#16a34a" }}>
                    {mine.status}
                  </span>
                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 800, background: rs.bg, color: rs.color }}>
                    {mine.risk} Risk
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ padding: "16px 18px" }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>DGMS Compliance Score</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: mine.compliance >= 85 ? "#16a34a" : mine.compliance >= 75 ? "#ea580c" : "#dc2626" }}>{mine.compliance}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${mine.compliance}%`, background: mine.compliance >= 85 ? "#52b788" : mine.compliance >= 75 ? "#f4a261" : "#e63946", borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
                  {[
                    { label: "Inspections", value: mine.inspections },
                    { label: "Violations", value: mine.violations },
                    { label: "Manpower", value: mine.workers },
                    { label: "Capacity", value: mine.output },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", padding: "8px 4px", background: "var(--surface-1)", borderRadius: 8, border: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 9.5, color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontWeight: 700 }}>{s.label}</p>
                      <p style={{ fontSize: 12.5, fontWeight: 800, color: "var(--text-primary)", margin: "2px 0 0 0" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    Statutory Head: <strong style={{ color: "var(--text-primary)" }}>{mine.manager}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedAiTarget({
                      name: mine.name,
                      depth: mine.depth,
                      compliance: mine.compliance,
                      risk: mine.risk as any,
                      workers: mine.workers,
                      ch4: mine.ch4,
                      co: mine.co,
                      air: mine.air,
                      violations: mine.violations
                    })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: "#1d4ed8",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: 7,
                      padding: "6px 12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "#1d4ed8";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "#eff6ff";
                      (e.currentTarget as HTMLElement).style.color = "#1d4ed8";
                    }}
                  >
                    <BrainCircuit size={13} />
                    AI Diagnostic
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Risk Modal */}
      <AiRiskModal
        target={selectedAiTarget}
        onClose={() => setSelectedAiTarget(null)}
      />
    </div>
  );
}
