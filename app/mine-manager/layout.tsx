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
import HeaderNavActions from "@/app/components/HeaderNavActions";

import { useTranslation } from "@/app/components/LanguageContext";

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", defaultLabel: "Dashboard",   href: "/mine-manager" },
  { icon: Mountain,        key: "nav.mines",     defaultLabel: "Mines",       href: "/mine-manager/mines" },
  { icon: Compass,         key: "nav.gis",       defaultLabel: "GIS Map",     href: "/mine-manager/gis-map" },
  { icon: BrainCircuit,    key: "nav.ai",        defaultLabel: "AI Analytics", href: "/mine-manager/ai-analytics" },
  { icon: Scan,            key: "nav.ocr",       defaultLabel: "OCR Digitizer", href: "/mine-manager/ocr-digitizer" },
  { icon: ClipboardCheck,  key: "nav.inspections", defaultLabel: "Inspections", href: "/mine-manager/inspections" },
  { icon: AlertTriangle,   key: "nav.violations",  defaultLabel: "Violations",  href: "/mine-manager/violations" },
  { icon: ListChecks,      key: "nav.actions",     defaultLabel: "Actions",     href: "/mine-manager/actions" },
  { icon: BarChart2,       key: "nav.reports",     defaultLabel: "Reports",     href: "/mine-manager/reports" },
  { icon: Users,           key: "nav.team",        defaultLabel: "Team",        href: "/mine-manager/team" },
  { icon: Wrench,          key: "nav.equipment",   defaultLabel: "Equipment",   href: "/mine-manager/equipment" },
  { icon: FileText,        key: "nav.documents",   defaultLabel: "Documents",   href: "/mine-manager/documents" },
  { icon: Settings,        key: "nav.settings",    defaultLabel: "Settings",    href: "/mine-manager/settings" },
];

export default function MineManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
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
      <aside style={{ width: 228, minHeight: "100vh", background: "#0f2318", display: "flex", flexDirection: "column", flexShrink: 0 }}>
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
              <p style={{ color: "#52b788", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em", margin: "2px 0 0 0" }}>MINE MANAGER</p>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map(({ icon: Icon, key, defaultLabel, href }) => {
            const active = pathname === href;
            const translatedLabel = t(key, defaultLabel);
            return (
              <Link key={key} href={href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                color: active ? "white" : "rgba(255,255,255,0.65)",
                background: active ? "#1a3d28" : "transparent",
                fontSize: 13, fontWeight: active ? 700 : 500, marginBottom: 2,
                textDecoration: "none", transition: "background 0.15s"
              }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{translatedLabel}</span>
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
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{t("title.welcome", "Welcome back")}, {managerName} 👋</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{t("title.status_overview", "Here's the status of")} {allocatedMine} {t("title.and_operations", "and ongoing operations.")}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer" }}>
              <Mountain size={14} color="#6b7280" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{allocatedMine}</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
            {/* Interactive Notifications & Multilingual Switcher */}
            <HeaderNavActions />

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
