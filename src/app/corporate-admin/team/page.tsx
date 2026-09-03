"use client";
import { Users, Shield, HardHat, ClipboardCheck, Mail, Phone, BarChart2, Building2 } from "lucide-react";

const executives = [
  { name: "Anita Khanna",    title: "Chief Safety Officer",        dept: "Corporate Safety",  location: "Mumbai HQ",    email: "a.khanna@mineguard.in",    phone: "+91 98100 00001", reports: 12, mines: 5, status: "Active" },
  { name: "Suresh Banerjee", title: "VP – Mining Operations",      dept: "Operations",        location: "Kolkata",      email: "s.banerjee@mineguard.in",  phone: "+91 98100 00002", reports: 8,  mines: 5, status: "Active" },
  { name: "Meera Iyer",      title: "Compliance Director",         dept: "Compliance",        location: "Mumbai HQ",    email: "m.iyer@mineguard.in",      phone: "+91 98100 00003", reports: 6,  mines: 4, status: "Active" },
  { name: "Ravi Kulkarni",   title: "Head of HSE",                dept: "Health & Safety",   location: "Bhopal",       email: "r.kulkarni@mineguard.in",  phone: "+91 98100 00004", reports: 14, mines: 5, status: "Active" },
  { name: "Preethi Rao",     title: "Environmental Lead",          dept: "Environment",       location: "Bengaluru",    email: "p.rao@mineguard.in",       phone: "+91 98100 00005", reports: 5,  mines: 3, status: "Active" },
  { name: "Vikram Desai",    title: "Head of Engineering",         dept: "Engineering",       location: "Pune",         email: "v.desai@mineguard.in",     phone: "+91 98100 00006", reports: 10, mines: 5, status: "On Leave" },
];

const deptColors: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  "Corporate Safety": { bg: "#fee2e2", color: "#dc2626",   icon: <Shield size={13} /> },
  "Operations":       { bg: "#eff6ff", color: "#2563eb",   icon: <HardHat size={13} /> },
  "Compliance":       { bg: "#fdf4ff", color: "#9333ea",   icon: <ClipboardCheck size={13} /> },
  "Health & Safety":  { bg: "#fff0f0", color: "#e63946",   icon: <Shield size={13} /> },
  "Environment":      { bg: "#f0fdf4", color: "#16a34a",   icon: <BarChart2 size={13} /> },
  "Engineering":      { bg: "#fff7ed", color: "#ea580c",   icon: <Building2 size={13} /> },
};

export default function TeamPage() {
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Corporate HSE & Operations Leadership</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>National executive oversight for environmental, health, safety, and regulatory compliance.</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Executive Staff", value: executives.length,                            color: "#2d6a4f", bg: "#e8f5ee" },
          { label: "Total Direct Reports", value: executives.reduce((s, e) => s + e.reports, 0), color: "#2563eb", bg: "#eff6ff" },
          { label: "Subsidiaries & Sites", value: 5,                                             color: "#7c3aed", bg: "#fdf4ff" },
          { label: "Currently On Duty",value: executives.filter(e => e.status === "Active").length, color: "#16a34a", bg: "#dcfce7" },
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

      {/* Team Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {executives.map(exec => {
          const dc = deptColors[exec.dept] || { bg: "#f3f4f6", color: "#374151", icon: <Users size={13} /> };
          return (
            <div
              key={exec.name}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                gap: 16,
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
              {/* Avatar */}
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg, #1a3d28 0%, #2d6a4f 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(26,61,40,0.25)" }}>
                <span style={{ color: "white", fontSize: 16, fontWeight: 800 }}>
                  {exec.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{exec.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>{exec.title}</p>
                  </div>
                  <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 800, background: exec.status === "Active" ? "#dcfce7" : "#fff7ed", color: exec.status === "Active" ? "#16a34a" : "#ea580c", whiteSpace: "nowrap" }}>
                    {exec.status}
                  </span>
                </div>

                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: dc.bg, color: dc.color }}>
                      {dc.icon} {exec.dept}
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>📍 {exec.location}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 2, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--text-secondary)" }}><Mail size={11} color="var(--text-muted)" />{exec.email}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--text-secondary)" }}><Phone size={11} color="var(--text-muted)" />{exec.phone}</span>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 20, paddingTop: 12, borderTop: "1px solid var(--surface-2)" }}>
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Direct Reports</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#2d6a4f", margin: "2px 0 0" }}>{exec.reports}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Mine Assets</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#2563eb", margin: "2px 0 0" }}>{exec.mines}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
