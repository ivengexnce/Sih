"use client";
import { useState, useEffect } from "react";
import { BarChart2, Plus, Download, FileText, TrendingUp, Calendar, ArrowRight, CheckCircle, Clock, Sparkles, Loader2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTranslation } from "@/app/components/LanguageContext";

const monthlyData = [
  { month: "Nov", inspections: 98,  violations: 42, compliance: 74 },
  { month: "Dec", inspections: 104, violations: 36, compliance: 78 },
  { month: "Jan", inspections: 110, violations: 31, compliance: 81 },
  { month: "Feb", inspections: 108, violations: 29, compliance: 83 },
  { month: "Mar", inspections: 119, violations: 25, compliance: 85 },
  { month: "Apr", inspections: 122, violations: 30, compliance: 84 },
  { month: "May", inspections: 126, violations: 28, compliance: 88 },
];

const reports = [
  { id: "RPT-031", title: "May 2025 Monthly Safety Report",           type: "Monthly",     date: "May 19, 2025", size: "2.4 MB",  status: "Published" },
  { id: "RPT-030", title: "Q1 2025 Compliance Summary",               type: "Quarterly",   date: "Apr 5, 2025",  size: "5.1 MB",  status: "Published" },
  { id: "RPT-029", title: "Ventilation System Audit Report",          type: "Audit",       date: "May 17, 2025", size: "1.8 MB",  status: "Published" },
  { id: "RPT-028", title: "April 2025 Violation Trend Analysis",      type: "Monthly",     date: "May 2, 2025",  size: "1.2 MB",  status: "Published" },
  { id: "RPT-027", title: "Equipment Maintenance Log – Q1 2025",      type: "Operational", date: "Apr 8, 2025",  size: "3.3 MB",  status: "Published" },
  { id: "RPT-026", title: "June 2025 Inspection Schedule (Draft)",    type: "Schedule",    date: "May 19, 2025", size: "0.8 MB",  status: "Draft" },
  { id: "RPT-025", title: "ISO 45001 Gap Analysis – Rajpura Mine",   type: "Compliance",  date: "Mar 22, 2025", size: "4.7 MB",  status: "Published" },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  Monthly:     { bg: "#e8f5ee", color: "#2d6a4f" },
  Quarterly:   { bg: "#eff6ff", color: "#2563eb" },
  Audit:       { bg: "#fdf4ff", color: "#9333ea" },
  Operational: { bg: "#fff7ed", color: "#ea580c" },
  Schedule:    { bg: "#f0fdf4", color: "#16a34a" },
  Compliance:  { bg: "#fefce8", color: "#ca8a04" },
};

export default function ReportsPage() {
  const { t } = useTranslation();
  const [reportsList, setReportsList] = useState(reports);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("May 2025 Statutory DGMS Safety Audit");
  const [reportType, setReportType] = useState("Monthly");
  const [section, setSection] = useState("All Colliery Sections");
  const [format, setFormat] = useState("PDF");
  const [includeTelemetry, setIncludeTelemetry] = useState(true);

  // Load any previously generated reports
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mineguard_custom_reports");
      if (stored) {
        const parsed = JSON.parse(stored);
        setReportsList([...parsed, ...reports]);
      }
    } catch (e) {}
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    const steps = [
      "Querying Real-Time Sensor Telemetry (CH₄, CO, Air Velocity)...",
      "Compiling Active CMR 2017 Regulatory Non-Compliances...",
      "Generating Statistical Variance & Safety KPIs...",
      "Embedding Official DGMS Digitally Verified Watermark...",
      "Finalizing Statutory Compliance Return..."
    ];

    let stepIdx = 0;
    setGenStep(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setGenStep(steps[stepIdx]);
      } else {
        clearInterval(interval);
        setGenerating(false);

        const newRpt = {
          id: `RPT-0${Math.floor(32 + Math.random() * 68)}`,
          title: title.trim(),
          type: reportType,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          size: `${(1.2 + Math.random() * 3.5).toFixed(1)} MB`,
          status: "Published"
        };

        const updated = [newRpt, ...reportsList];
        setReportsList(updated);

        try {
          const stored = localStorage.getItem("mineguard_custom_reports");
          const existing = stored ? JSON.parse(stored) : [];
          localStorage.setItem("mineguard_custom_reports", JSON.stringify([newRpt, ...existing]));
        } catch (err) {}

        setShowModal(false);
        setToastMsg(`Report ${newRpt.id} generated and ready for statutory dispatch!`);
        setTimeout(() => setToastMsg(null), 3500);
      }
    }, 600);
  };

  const handleDownload = (r: typeof reports[0]) => {
    const reportSummary = `=====================================================
GOVERNMENT OF INDIA - MINISTRY OF COAL
DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
MINEGUARD STATUTORY AUDIT REPORT: ${r.id}
=====================================================
Title: ${r.title}
Classification: ${r.type} Report
Date of Generation: ${r.date}
Colliery: Rajpura Coal Mine (SECL)
Statutory Status: ${r.status}
Attestation: Verified by Mine Manager & Safety Officer under CMR 2017

--- SUMMARY OF OBSERVATIONS ---
1. Continuous Airflow Monitoring: 0.65 m/s (COMPLIANT with Reg 153)
2. Ambient Methane Level: 0.22% CH4 (Safe threshold < 0.75%)
3. Carbon Monoxide Level: 12 ppm (Safe threshold < 50 ppm)
4. Heavy Earth Moving Machinery: 88% Uptime (CAT Haul Fleet Verified)
5. Zero fatal accidents logged in current statutory period.
=====================================================`;

    const blob = new Blob([reportSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${r.id}_${r.type}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMsg(`Downloaded statutory report ${r.id}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Generate Report Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white", borderRadius: 14, width: "100%", maxWidth: 540,
            padding: "24px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={18} color="#2d6a4f" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>Generate Statutory Safety Report</h3>
              </div>
              <button
                type="button"
                disabled={generating}
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {generating ? (
              <div style={{ padding: "30px 20px", textAlign: "center" }}>
                <Loader2 size={36} color="#2d6a4f" style={{ animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Compiling Statutory Safety Package</h4>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontStyle: "italic" }}>{genStep}</p>
                <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 20, overflow: "hidden" }}>
                  <div style={{ width: "85%", height: "100%", background: "#2d6a4f", borderRadius: 3, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Report Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. May 2025 Monthly Safety & Gas Telemetry Return"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                      Report Classification <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    >
                      <option value="Monthly">Monthly Safety Return</option>
                      <option value="Quarterly">Quarterly Compliance Summary</option>
                      <option value="Audit">DGMS CMR 2017 Audit</option>
                      <option value="Operational">Equipment Maintenance Log</option>
                      <option value="Compliance">Statutory Form IV Incident Return</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                      Export Format <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                    >
                      <option value="PDF">Standard PDF (.pdf)</option>
                      <option value="Excel">Microsoft Excel (.xlsx)</option>
                      <option value="Print">Direct Statutory Print Format</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Colliery Beat & Coverage Area
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155", cursor: "pointer", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={includeTelemetry}
                      onChange={e => setIncludeTelemetry(e.target.checked)}
                      style={{ accentColor: "#2d6a4f" }}
                    />
                    Include Continuous Tele-Monitoring Data (CMR 153 Airflow & Gas Logs)
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#2d6a4f", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Sparkles size={15} /> Compile & Generate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Reports</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Generate and view compliance and safety reports.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,0.25)" }}
        >
          <Plus size={14} /> {t("btn.generate_report", "Generate Report")}
        </button>
      </div>

      {/* Chart */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Monthly Performance Trends</h3>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Inspections, Violations & Compliance Score – Last 7 months</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Inspections", color: "#2d6a4f" },
              { label: "Violations",  color: "#e63946" },
              { label: "Compliance%", color: "#f4a261" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} barCategoryGap="30%" barGap={4} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8 }} />
            <Bar dataKey="inspections" fill="#2d6a4f" radius={[3, 3, 0, 0]} />
            <Bar dataKey="violations"  fill="#e63946" radius={[3, 3, 0, 0]} />
            <Bar dataKey="compliance"  fill="#f4a261" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Compliance Score – May", value: "88%",     trend: "↑ 6.4%", positive: true },
          { label: "Total Inspections – May", value: "126",    trend: "↑ 10.2%", positive: true },
          { label: "Open Violations – May",   value: "28",     trend: "↓ 7.1%", positive: false },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginTop: 4 }}>{s.value}</p>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: s.positive ? "#16a34a" : "#dc2626", background: s.positive ? "#dcfce7" : "#fee2e2", padding: "5px 10px", borderRadius: 8 }}>
              <TrendingUp size={11} style={{ display: "inline", marginRight: 3 }} />{s.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Report Library */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Report Library ({reportsList.length})</h3>
          <span style={{ fontSize: 11.5, color: "#6b7280" }}>Attested under DGMS Regulation 153</span>
        </div>
        {reportsList.map((r, i) => {
          const tc = typeColors[r.type] || typeColors.Monthly;
          return (
            <div key={r.id} style={{ padding: "14px 20px", borderBottom: i < reportsList.length - 1 ? "1px solid #f9fafb" : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={18} color="#6b7280" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{r.title}</span>
                  {r.status === "Draft" && (
                    <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: "#fff7ed", color: "#ea580c" }}>Draft</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                  <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>{r.type}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af" }}><Calendar size={10} />{r.date}</span>
                  <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{r.size}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(r)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, fontWeight: 600, color: "#374151", background: "white", cursor: "pointer", transition: "all 0.15s" }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
