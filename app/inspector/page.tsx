"use client";

import {
  ClipboardCheck, AlertTriangle, ListChecks, PlusCircle, ArrowRight,
  TrendingUp, TrendingDown, Clock, CheckCircle2, AlertOctagon, MapPin,
  ShieldCheck, Activity, Calendar, User, Eye, Sparkles, BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip, PieChart, Pie, Cell
} from "recharts";
import AiRiskModal, { AiRiskTarget } from "@/app/components/AiRiskModal";

// Trend data
const inspectionTrend = [
  { day: "Mon", inspections: 6, violations: 2 },
  { day: "Tue", inspections: 8, violations: 4 },
  { day: "Wed", inspections: 5, violations: 1 },
  { day: "Thu", inspections: 9, violations: 3 },
  { day: "Fri", inspections: 7, violations: 2 },
  { day: "Sat", inspections: 11, violations: 5 },
  { day: "Sun", inspections: 8, violations: 1 },
];

const severityDistribution = [
  { name: "High Severity",   value: 4, color: "#dc2626" },
  { name: "Medium Severity", value: 6, color: "#ea580c" },
  { name: "Low Severity",    value: 8, color: "#16a34a" },
];

const hazardCategories = [
  { name: "PPE Non-Compliance",       count: 7, total: 10, color: "#dc2626" },
  { name: "Ventilation & Gas Levels", count: 4, total: 10, color: "#ea580c" },
  { name: "Machine & Conveyor Guard", count: 3, total: 10, color: "#f59e0b" },
  { name: "Fire Safety & Extinguishers", count: 2, total: 10, color: "#2563eb" },
  { name: "Housekeeping & Spillages", count: 2, total: 10, color: "#16a34a" },
];

const sparklines = {
  inspections: [4, 6, 5, 8, 7, 9, 8],
  violations:  [3, 5, 2, 4, 3, 5, 2],
  actions:     [8, 7, 6, 9, 8, 6, 5],
  score:       [86, 88, 87, 89, 91, 90, 93],
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function InspectorDashboard() {
  const [schedule, setSchedule] = useState([
    { id: "S1", time: "09:00 AM", area: "Pit Area – Section A", type: "Shift Safety Audit", status: "Completed", highRisk: false },
    { id: "S2", time: "11:30 AM", area: "Workshop – Bay 3", type: "Fire & Exit Audit", status: "In Progress", highRisk: true },
    { id: "S3", time: "01:30 PM", area: "Underground Level 2", type: "Ventilation & Methane Check", status: "Pending", highRisk: true },
    { id: "S4", time: "03:15 PM", area: "Conveyor Belt – Line 2", type: "Emergency Pull-Cord Test", status: "Scheduled", highRisk: false },
  ]);

  const toggleScheduleStatus = (id: string) => {
    setSchedule(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus = s.status === "Completed" ? "Pending" : s.status === "Pending" ? "In Progress" : "Completed";
      return { ...s, status: nextStatus };
    }));
  };

  const [selectedAiTarget, setSelectedAiTarget] = useState<AiRiskTarget | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f2318 0%, #1a3d28 100%)",
        borderRadius: 14,
        padding: "20px 24px",
        color: "white",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14,
        boxShadow: "0 4px 14px rgba(15,35,24,0.15)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Good morning, Inspector Smith 👋</span>
            <span style={{ fontSize: 11, padding: "2px 8px", background: "rgba(82,183,136,0.25)", color: "#86efac", borderRadius: 12, fontWeight: 600 }}>Shift Active</span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", maxWidth: 580 }}>
            You have <strong style={{ color: "white" }}>3 pending inspections</strong> and <strong style={{ color: "#fca5a5" }}>2 high-severity violations</strong> requiring field verification today at Rajpura Coal Mine.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedAiTarget({
              name: "Underground Level 3 (Shift Audit)",
              depth: "380m",
              compliance: 58,
              risk: "High",
              workers: 40,
              ch4: 1.35,
              co: 48,
              air: 0.38,
              violations: 5
            })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 14px",
              background: "rgba(134,239,172,0.15)",
              border: "1px solid rgba(134,239,172,0.35)",
              color: "#86efac",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <BrainCircuit size={15} /> AI Pre-Shift Check
          </button>
          <Link
            href="/inspector/inspections"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              background: "#52b788",
              color: "#0f2318",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.15s",
            }}
          >
            <ClipboardCheck size={16} /> Start Inspection
          </Link>
          <Link
            href="/inspector/violations"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              background: "rgba(220,38,38,0.2)",
              border: "1px solid rgba(220,38,38,0.5)",
              color: "#fca5a5",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <AlertTriangle size={16} /> Log Hazard
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Today's Inspections", value: "4 / 6", sub: "+16.5% vs yesterday", pos: true, color: "#2d6a4f", spark: sparklines.inspections, icon: <ClipboardCheck size={18} color="white" /> },
          { label: "Open Violations",      value: "5",     sub: "2 High Priority",       pos: false, color: "#dc2626", spark: sparklines.violations, icon: <AlertTriangle size={18} color="white" /> },
          { label: "Pending Actions",      value: "7",     sub: "3 Overdue tasks",       pos: false, color: "#ea580c", spark: sparklines.actions, icon: <ListChecks size={18} color="white" /> },
          { label: "Section Safety Score", value: "93%",   sub: "+4.2% this week",       pos: true, color: "#16a34a", spark: sparklines.score, icon: <ShieldCheck size={18} color="white" /> },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: kpi.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {kpi.icon}
              </div>
              <MiniSparkline data={kpi.spark} color={kpi.color} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{kpi.label}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 3 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{kpi.value}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: kpi.pos ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 2 }}>
                  {kpi.pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {kpi.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Analytics & Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1.1fr", gap: 16, marginBottom: 20 }}>
        {/* Weekly Trend Chart */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Weekly Activity & Violation Trends</h3>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Inspections completed vs. hazards discovered</p>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#2d6a4f", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d6a4f" }} /> Inspections
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#dc2626", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} /> Violations
              </span>
            </div>
          </div>

          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inspectionTrend} margin={{ top: 8, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="inspColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vioColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                />
                <Area type="monotone" dataKey="inspections" stroke="#2d6a4f" strokeWidth={2.5} fillOpacity={1} fill="url(#inspColor)" />
                <Area type="monotone" dataKey="violations" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#vioColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Severity Donut */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Severity Breakdown</h3>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>18 Hazards Total</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 130, height: 130, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    innerRadius={42}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityDistribution.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1 }}>18</p>
                <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 600 }}>HAZARDS</p>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {severityDistribution.map(item => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 12, color: "#4b5563" }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/inspector/violations"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              color: "#2d6a4f",
              textDecoration: "none",
              paddingTop: 10,
              borderTop: "1px solid #f3f4f6",
            }}
          >
            Manage all violation tickets <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Schedule & Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* Today's Schedule with toggle */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Today's Inspection Schedule</h3>
              <p style={{ fontSize: 12, color: "#6b7280" }}>Click status to toggle completion in the field</p>
            </div>
            <Link href="/inspector/inspections" style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
              Full Schedule <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {schedule.map(s => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1px solid ${s.status === "Completed" ? "#e5e7eb" : s.highRisk ? "#fca5a5" : "#e5e7eb"}`,
                  background: s.status === "Completed" ? "#f9fafb" : s.highRisk ? "#fff5f5" : "white",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 48, fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
                    {s.time}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.area}</span>
                      {s.highRisk && (
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626", fontWeight: 700 }}>
                          High Risk
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{s.type}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleScheduleStatus(s.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 16,
                    fontSize: 11.5,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: s.status === "Completed" ? "#dcfce7" : s.status === "In Progress" ? "#fef3c7" : "#f3f4f6",
                    color: s.status === "Completed" ? "#16a34a" : s.status === "In Progress" ? "#d97706" : "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {s.status === "Completed" && <CheckCircle2 size={12} />}
                  {s.status === "In Progress" && <Activity size={12} />}
                  {s.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Categories & Quick Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Category breakdown bar */}
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Frequent Hazard Types</h3>
            {hazardCategories.map(cat => (
              <div key={cat.name} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#374151", fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontWeight: 700, color: cat.color }}>{cat.count} cases</span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(cat.count / cat.total) * 100}%`, background: cat.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Nav Card */}
          <div style={{ background: "#0f2318", borderRadius: 12, padding: "18px 20px", color: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Sparkles size={16} color="#52b788" />
              <h4 style={{ fontSize: 13.5, fontWeight: 700 }}>Field Checklist Quick Access</h4>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 14, lineHeight: 1.4 }}>
              Review the complete corrective action queue or submit an emergency alert.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href="/inspector/actions"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "#2d6a4f",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Action Queue (7)
              </Link>
              <Link
                href="/inspector/violations"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                New Hazard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Risk Modal */}
      <AiRiskModal target={selectedAiTarget} onClose={() => setSelectedAiTarget(null)} />
    </div>
  );
}
