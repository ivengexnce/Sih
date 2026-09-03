"use client";

import {
  LayoutDashboard, Mountain, ClipboardCheck, AlertTriangle, ListChecks,
  BarChart2, Users, Wrench, FileText, Settings, ChevronDown, Calendar,
  Compass, BrainCircuit, Scan, Activity, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import HeaderNavActions from "@/components/HeaderNavActions";
import { useTranslation } from "@/components/LanguageContext";

const navSections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, key: "nav.dashboard", defaultLabel: "Dashboard", href: "/mine-manager" },
    ]
  },
  {
    label: "Mine Operations",
    items: [
      { icon: Mountain, key: "nav.mines", defaultLabel: "Mines", href: "/mine-manager/mines" },
      { icon: Compass, key: "nav.gis", defaultLabel: "GIS Map", href: "/mine-manager/gis-map" },
      { icon: ClipboardCheck, key: "nav.inspections", defaultLabel: "Inspections", href: "/mine-manager/inspections" },
      { icon: AlertTriangle, key: "nav.violations", defaultLabel: "Violations", href: "/mine-manager/violations" },
      { icon: ListChecks, key: "nav.actions", defaultLabel: "Actions", href: "/mine-manager/actions" },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { icon: BrainCircuit, key: "nav.ai", defaultLabel: "AI Analytics", href: "/mine-manager/ai-analytics" },
      { icon: Scan, key: "nav.ocr", defaultLabel: "OCR Digitizer", href: "/mine-manager/ocr-digitizer" },
      { icon: BarChart2, key: "nav.reports", defaultLabel: "Reports", href: "/mine-manager/reports" },
    ]
  },
  {
    label: "Resources",
    items: [
      { icon: Users, key: "nav.team", defaultLabel: "Team", href: "/mine-manager/team" },
      { icon: Wrench, key: "nav.equipment", defaultLabel: "Equipment", href: "/mine-manager/equipment" },
      { icon: FileText, key: "nav.documents", defaultLabel: "Documents", href: "/mine-manager/documents" },
      { icon: Settings, key: "nav.settings", defaultLabel: "Settings", href: "/mine-manager/settings" },
    ]
  },
];

export default function MineManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine (SECL)");
  const [managerName, setManagerName] = useState("Mine Manager");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const initials = managerName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "MM";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font-sans)" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 236,
        background: "linear-gradient(180deg, #0c1e12 0%, #0f2318 40%, #0d1d10 100%)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "2px 0 20px rgba(0,0,0,0.25)",
        overflowY: "auto",
        overflowX: "hidden",
      }}>

        {/* Logo */}
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(82,183,136,0.10)",
              border: "1px solid rgba(82,183,136,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(82,183,136,0.12)",
              flexShrink: 0,
            }}>
              <img src="/icon.png" alt="MineGuard" style={{ width: 28, height: 28, objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", margin: 0, lineHeight: 1.2 }}>
                MINEGUARD
              </p>
              <p style={{ color: "#52b788", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.10em", margin: "2px 0 0 0" }}>
                Mine Manager
              </p>
            </div>
          </Link>
        </div>

        {/* Mine context chip */}
        <div style={{
          margin: "10px 12px 4px",
          padding: "8px 10px",
          background: "rgba(82,183,136,0.07)",
          border: "1px solid rgba(82,183,136,0.14)",
          borderRadius: 8,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#52b788",
              animation: "pulseDot 2s infinite", flexShrink: 0
            }} />
            <span style={{ fontSize: 9.5, color: "#52b788", fontWeight: 700, letterSpacing: "0.06em" }}>ACTIVE MINE</span>
          </div>
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: 11.5, fontWeight: 600,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {allocatedMine}
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto", overflowX: "hidden" }}>
          {navSections.map(section => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <p style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.20)",
                padding: "10px 4px 4px",
              }}>
                {section.label}
              </p>
              {section.items.map(({ icon: Icon, key, defaultLabel, href }) => {
                const active = pathname === href || (href !== "/mine-manager" && pathname.startsWith(href));
                return (
                  <Link
                    key={key}
                    href={href}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "8.5px 11px",
                      borderRadius: 8,
                      color: active ? "white" : "rgba(255,255,255,0.58)",
                      background: active ? "rgba(26,61,40,0.9)" : "transparent",
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      marginBottom: 1, textDecoration: "none",
                      transition: "all 0.15s ease",
                      borderLeft: active ? "3px solid #52b788" : "3px solid transparent",
                      boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={active ? 2.4 : 1.8}
                      color={active ? "#52b788" : "currentColor"}
                      style={{ flexShrink: 0 }}
                    />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t(key, defaultLabel)}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "10px 10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 10px", marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #2d6a4f 0%, #1a3d28 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(82,183,136,0.20)",
            }}>
              <span style={{ color: "#74c69d", fontSize: 11, fontWeight: 800 }}>{initials}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{managerName}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t("Mine Manager", "Mine Manager")}
              </p>
            </div>
          </div>
          <Link href="/login" style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "7px 11px", borderRadius: 8,
            color: "rgba(255,255,255,0.38)", fontSize: 12.5, fontWeight: 500,
            textDecoration: "none", transition: "all 0.15s ease",
          }}>
            <LogOut size={13} strokeWidth={1.8} />
            <span>{t("nav.logout", "Sign out")}</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          padding: "0 28px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 1px 0 var(--border), 0 2px 12px rgba(0,0,0,0.04)",
          gap: 16, flexShrink: 0,
        }}>
          <div style={{ animation: mounted ? "fadeInLeft 0.4s ease" : "none" }}>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>
              {t("title.welcome", "Welcome back")}, {managerName} 👋
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              {allocatedMine} · {t("Ongoing Operations", "Ongoing Operations")}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Mine selector */}
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 12px",
              border: "1px solid var(--border)", borderRadius: 8,
              background: "white", cursor: "pointer",
              fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)",
              maxWidth: 220, overflow: "hidden",
            }}>
              <Mountain size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{allocatedMine}</span>
              <ChevronDown size={13} color="var(--text-faint)" style={{ flexShrink: 0 }} />
            </div>

            <HeaderNavActions />

            {/* Date range */}
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 12px",
              border: "1px solid var(--border)", borderRadius: 8,
              background: "white", fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
            }}>
              <Calendar size={13} color="var(--text-faint)" />
              <span>{dateRange}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: "22px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
