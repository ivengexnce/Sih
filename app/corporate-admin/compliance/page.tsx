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
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Compliance</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Company-wide compliance metrics across all mine sites.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Portfolio Avg",  value: `${avg}%`,     color: avg >= 85 ? "#16a34a" : "#ea580c", bg: avg >= 85 ? "#dcfce7" : "#fff7ed" },
          { label: "Fully Compliant",value: compliant,     color: "#16a34a", bg: "#dcfce7" },
          { label: "Needs Attention",value: mines.length - compliant, color: "#dc2626", bg: "#fee2e2" },
          { label: "ISO 45001 Sites",value: mines.filter(m => m.iso).length, color: "#2563eb", bg: "#eff6ff" },
        ].map(c => (
          <div key={c.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 20px" }}>
            <p style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.color, marginTop: 4 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Score Heatmap Table */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Compliance Matrix</h3>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Check marks indicate areas that passed the last audit.</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Mine Site", "Score", "Category", "ISO 45001", "DGMS", "Environment", "PPE", "Ventilation", "Fire Safety", "Trend"].map(h => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#6b7280", textAlign: "left", letterSpacing: "0.03em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mines.map((m, i) => (
              <tr key={m.name} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{m.name}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ height: 32, width: 32, borderRadius: 8, background: scoreBg(m.score), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(m.score) }}>{m.score}</span>
                    </div>
                    <div style={{ flex: 1, maxWidth: 80, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.score}%`, background: scoreColor(m.score), borderRadius: 3 }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: scoreBg(m.score), color: scoreColor(m.score) }}>{m.category}</span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.iso} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.dgms} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.env} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.ppe} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.ventilation} /></td>
                <td style={{ padding: "14px 16px", textAlign: "center" }}><Check v={m.fire} /></td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, color: m.trend >= 0 ? "#16a34a" : "#dc2626" }}>
                    <TrendingUp size={13} /> {m.trend > 0 ? "+" : ""}{m.trend}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6-month sparkline per mine */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>6-Month Compliance Trends</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          {mines.map(mine => {
            const data = history[mine.name] || [];
            const max = 100, min = 50;
            const points = data.map((v, i) => `${(i / (data.length - 1)) * 260},${((max - v) / (max - min)) * 60}`).join(" ");
            return (
              <div key={mine.name} style={{ padding: "14px 16px", border: "1px solid #f3f4f6", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{mine.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(mine.score) }}>{mine.score}%</span>
                </div>
                <svg viewBox="0 0 260 60" style={{ width: "100%", height: 50 }}>
                  <polyline points={points} fill="none" stroke={scoreColor(mine.score)} strokeWidth="2" />
                  {data.map((v, i) => (
                    <circle key={i} cx={(i / (data.length - 1)) * 260} cy={((max - v) / (max - min)) * 60} r="3" fill={scoreColor(mine.score)} />
                  ))}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {months.map(m => <span key={m} style={{ fontSize: 10, color: "#9ca3af" }}>{m}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
