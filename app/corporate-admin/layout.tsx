"use client";

import {
  LayoutDashboard, Mountain, ShieldCheck, BarChart2, Users, Settings,
  Bell, ChevronDown, Globe, LogOut, Compass, BrainCircuit, Scale
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",       href: "/corporate-admin" },
  { icon: Mountain,        label: "Mines",           href: "/corporate-admin/mines" },
  { icon: Scale,           label: "Manager Cadre",   href: "/corporate-admin/manager-assignment" },
  { icon: Compass,         label: "GIS Map",         href: "/corporate-admin/gis-map" },
  { icon: BrainCircuit,    label: "AI Analytics",    href: "/corporate-admin/ai-analytics" },
  { icon: ShieldCheck,     label: "Compliance",      href: "/corporate-admin/compliance" },
  { icon: BarChart2,       label: "Reports",         href: "/corporate-admin/reports" },
  { icon: Users,           label: "Team",            href: "/corporate-admin/team" },
  { icon: Settings,        label: "Settings",        href: "/corporate-admin/settings" },
];

export default function CorporateAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf9", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 216, minHeight: "100vh", background: "#0f2318", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: "rgba(82,183,136,0.12)",
              border: "1px solid rgba(82,183,136,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}>
              <img src="/logo.webp" alt="MineGuard Logo" style={{ width: 30, height: 30, objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, letterSpacing: "0.03em", margin: 0, lineHeight: 1.2 }}>MINEGUARD</p>
              <p style={{ color: "#52b788", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em", margin: "2px 0 0 0" }}>CORPORATE ADMIN</p>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: active ? "white" : "rgba(255,255,255,0.55)", background: active ? "#1a3d28" : "transparent", fontSize: 13.5, fontWeight: 500, marginBottom: 2, textDecoration: "none" }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, color: "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
            <LogOut size={16} strokeWidth={1.8} />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Topbar */}
        <header style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Corporate Overview</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Portfolio-wide safety and compliance across all mines.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white" }}>
              <Globe size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>All Mines</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ width: 38, height: 38, border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer" }}>
                <Bell size={16} color="#374151" />
              </div>
              <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>5</span>
              </div>
            </div>

            {/* Multilingual Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: 600,
                color: "#1f2937"
              }}
            >
              <Globe size={14} color="#2d6a4f" />
              <span>{lang === "en" ? "EN 🇬🇧" : "हिंदी 🇮🇳"}</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1a3d28", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>CA</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Corp. Admin</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>Administrator</p>
              </div>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
          </div>
        </header>

        {/* Content area */}
        <div style={{ padding: "22px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
