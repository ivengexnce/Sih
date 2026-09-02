"use client";

import {
  LayoutDashboard, Mountain, ClipboardCheck, AlertTriangle, ListChecks,
  BarChart2, Users, Wrench, FileText, Settings, Bell, ChevronDown, Calendar,
  Compass, BrainCircuit, Scan, Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/mine-manager" },
  { icon: Mountain,        label: "Mines",       href: "/mine-manager/mines" },
  { icon: Compass,         label: "GIS Map",     href: "/mine-manager/gis-map" },
  { icon: BrainCircuit,    label: "AI Analytics", href: "/mine-manager/ai-analytics" },
  { icon: Scan,            label: "OCR Digitizer", href: "/mine-manager/ocr-digitizer" },
  { icon: ClipboardCheck,  label: "Inspections", href: "/mine-manager/inspections" },
  { icon: AlertTriangle,   label: "Violations",  href: "/mine-manager/violations" },
  { icon: ListChecks,      label: "Actions",     href: "/mine-manager/actions" },
  { icon: BarChart2,       label: "Reports",     href: "/mine-manager/reports" },
  { icon: Users,           label: "Team",        href: "/mine-manager/team" },
  { icon: Wrench,          label: "Equipment",   href: "/mine-manager/equipment" },
  { icon: FileText,        label: "Documents",   href: "/mine-manager/documents" },
  { icon: Settings,        label: "Settings",    href: "/mine-manager/settings" },
];

export default function MineManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine (SECL)");
  const [managerName, setManagerName] = useState("Mine Manager");

  useEffect(() => {
    try {
      const u = storageService.getCurrentSession();
      if (u) {
        if (u.allocatedMine) setAllocatedMine(u.allocatedMine);
        if (u.name) setManagerName(u.name);
      }
    } catch (e) {}
  }, []);

  const today = new Date();
  const fmt = (d: Date) => d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 6);
  const dateRange = `${fmt(weekAgo)} – ${fmt(today)}`;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf9" }}>
      {/* Sidebar */}
      <aside style={{ width: 216, minHeight: "100vh", background: "#0f2318", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/logo.webp" alt="MineGuard Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 13.5, fontWeight: 700, letterSpacing: "0.04em" }}>MINEGUARD</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em" }}>MINE MANAGER</p>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link key={label} href={href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                color: active ? "white" : "rgba(255,255,255,0.55)",
                background: active ? "#1a3d28" : "transparent",
                fontSize: 13.5, fontWeight: 500, marginBottom: 2,
                textDecoration: "none", transition: "background 0.15s"
              }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "14px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>MM</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontSize: 12.5, fontWeight: 600 }}>{managerName}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {allocatedMine}
            </p>
          </div>
          <Link href="/login" style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>
             <ChevronDown size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Global Topbar */}
        <header style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Welcome back, {managerName} 👋</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Here's the status of {allocatedMine} and ongoing operations.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" }}>
              <Mountain size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{allocatedMine}</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ width: 38, height: 38, border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "white" }}>
                <Bell size={16} color="#374151" />
              </div>
              <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>8</span>
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

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" }}>
              <Calendar size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{dateRange}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "22px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
