"use client";
import { Shield, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

const mines = [
  { name: "Rajpura Coal Mine",    score: 88, category: "B+",  iso: true,  dgms: true,  env: false, ppe: true,  ventilation: true,  fire: false, trend: +6 },
  { name: "Naya Khadan Mine",     score: 72, category: "C",   iso: false, dgms: true,  env: false, ppe: false, ventilation: false, fire: true,  trend: -3 },
  { name: "Sundargarh Limestone", score: 91, category: "A",   iso: true,  dgms: true,  env: true,  ppe: true,  ventilation: true,  fire: true,  trend: +4 },
  { name: "Khetri Copper Mine",   score: 79, category: "B-",  iso: false, dgms: true,  env: false, ppe: true,  ventilation: false, fire: true,  trend: -1 },
];

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const history: Record<string, number[]> = {
  "Rajpura Coal Mine":    [76, 79, 82, 84, 85, 88],
  "Naya Khadan Mine":     [80, 77, 75, 78, 73, 72],
  "Sundargarh Limestone": [86, 87, 88, 89, 90, 91],
  "Khetri Copper Mine":   [82, 80, 80, 79, 79, 79],
};

const Check = ({ v }: { v: boolean }) => v
  ? <CheckCircle size={15} color="#16a34a" />
  : <XCircle size={15} color="#dc2626" />;

const scoreColor = (s: number) => s >= 85 ? "#16a34a" : s >= 75 ? "#ea580c" : "#dc2626";
const scoreBg    = (s: number) => s >= 85 ? "#dcfce7" : s >= 75 ? "#fff7ed" : "#fee2e2";

export default function CompliancePage() {
  const avg = Math.round(mines.reduce((s, m) => s + m.score, 0) / mines.length);
  const compliant = mines.filter(m => m.score >= 85).length;

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>National Compliance Surveillance</h2>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Enterprise-wide DGMS, ISO 45001, and environmental compliance metrics across all coalfields.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Portfolio Average",  value: `${avg}%`,     color: avg >= 85 ? "#16a34a" : "#ea580c", bg: avg >= 85 ? "#dcfce7" : "#fff7ed", icon: <Shield size={18} color="white" />, iconBg: avg >= 85 ? "#16a34a" : "#ea580c" },
          { label: "Fully Compliant",   value: compliant,     color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={18} color="white" />, iconBg: "#16a34a" },
          { label: "Needs Attention",   value: mines.length - compliant, color: "#dc2626", bg: "#fee2e2", icon: <AlertCircle size={18} color="white" />, iconBg: "#dc2626" },
          { label: "ISO 45001 Certified",value: mines.filter(m => m.iso).length, color: "#2563eb", bg: "#eff6ff", icon: <Shield size={18} color="white" />, iconBg: "#2563eb" },
        ].map(c => (
          <div
            key={c.label}
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.22s ease",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{c.label}</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>{c.value}</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${c.iconBg} 0%, ${c.iconBg}cc 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${c.iconBg}50`,
              }}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Score Heatmap Table */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 20, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>Subsidiary Compliance Matrix</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>Check marks indicate areas that passed the last statutory DGMS audit.</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {["Mine Site", "Score", "Category", "ISO 45001", "DGMS CMR", "Environment", "PPE Protocol", "Ventilation", "Fire Safety", "Trend"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontWeight: 700, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mines.map((m, i) => (
              <tr
                key={m.name}
                style={{ borderBottom: i < mines.length - 1 ? "1px solid var(--surface-2)" : "none", transition: "background 0.12s ease" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-1)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "white")}
              >
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{m.name}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ height: 32, width: 32, borderRadius: 8, background: scoreBg(m.score), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: scoreColor(m.score) }}>{m.score}</span>
                    </div>
                    <div style={{ flex: 1, maxWidth: 80, height: 5, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.score}%`, background: scoreColor(m.score), borderRadius: 3, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11.5, fontWeight: 800, background: scoreBg(m.score), color: scoreColor(m.score) }}>{m.category}</span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.iso} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.dgms} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.env} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.ppe} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.ventilation} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.fire} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 4, color: m.trend >= 0 ? "#16a34a" : "#dc2626" }}>
                    <TrendingUp size={13} /> {m.trend > 0 ? "+" : ""}{m.trend}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6-month sparkline per mine */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: 20, boxShadow: "var(--shadow-xs)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px", color: "var(--text-primary)" }}>6-Month Compliance Trajectory</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {mines.map(mine => {
            const data = history[mine.name] || [];
            const max = 100, min = 50;
            const points = data.map((v, i) => `${(i / (data.length - 1)) * 260},${((max - v) / (max - min)) * 60}`).join(" ");
            const areaPoints = `${points} 260,60 0,60`;
            const color = scoreColor(mine.score);
            return (
              <div key={mine.name} style={{ padding: "16px 18px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface-1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{mine.name}</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: color }}>{mine.score}%</span>
                </div>
                <svg viewBox="0 0 260 60" style={{ width: "100%", height: 55, overflow: "visible" }}>
                  <defs>
                    <linearGradient id={`grad-${mine.name.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon points={areaPoints} fill={`url(#grad-${mine.name.replace(/\s+/g, "")})`} />
                  <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {data.map((v, i) => (
                    <circle key={i} cx={(i / (data.length - 1)) * 260} cy={((max - v) / (max - min)) * 60} r="3" fill={color} />
                  ))}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {months.map(m => <span key={m} style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{m}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
