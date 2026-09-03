"use client";

import {
  LayoutDashboard, Mountain, ShieldCheck, BarChart2, Users, Settings,
  ChevronDown, Globe, LogOut, Compass, BrainCircuit, Scale,
  TrendingUp, Activity, Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/LanguageContext";
import HeaderNavActions from "@/components/HeaderNavActions";
import HeaderProfileMenu from "@/components/HeaderProfileMenu";
import HeaderCollierySelector from "@/components/HeaderCollierySelector";

const navSections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, key: "nav.dashboard", defaultLabel: "Dashboard", href: "/corporate-admin" },
    ]
  },
  {
    label: "Operations",
    items: [
      { icon: Mountain, key: "nav.mines", defaultLabel: "Mines", href: "/corporate-admin/mines" },
      { icon: Scale, key: "nav.assignment", defaultLabel: "Manager Cadre", href: "/corporate-admin/manager-assignment" },
      { icon: Compass, key: "nav.gis", defaultLabel: "GIS Map", href: "/corporate-admin/gis-map" },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { icon: BrainCircuit, key: "nav.ai", defaultLabel: "AI Analytics", href: "/corporate-admin/ai-analytics" },
      { icon: ShieldCheck, key: "nav.compliance", defaultLabel: "Compliance", href: "/corporate-admin/compliance" },
      { icon: BarChart2, key: "nav.reports", defaultLabel: "Reports", href: "/corporate-admin/reports" },
    ]
  },
  {
    label: "Administration",
    items: [
      { icon: Users, key: "nav.team", defaultLabel: "Team", href: "/corporate-admin/team" },
      { icon: Settings, key: "nav.settings", defaultLabel: "Settings", href: "/corporate-admin/settings" },
    ]
  }
];

export default function CorporateAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font-sans)" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 232,
        minHeight: "100vh",
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(82,183,136,0.10)",
              border: "1px solid rgba(82,183,136,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(82,183,136,0.12)",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}>
              <img src="/icon.png" alt="MineGuard" style={{ width: 28, height: 28, objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", margin: 0, lineHeight: 1.2 }}>
                MINEGUARD
              </p>
              <p style={{
                color: "#52b788", fontSize: 9.5, fontWeight: 700,
                letterSpacing: "0.10em", margin: "2px 0 0 0",
                textTransform: "uppercase"
              }}>
                Corporate Admin
              </p>
            </div>
          </Link>
        </div>

        {/* System Status */}
        <div style={{
          margin: "10px 12px 4px",
          padding: "7px 10px",
          background: "rgba(82,183,136,0.07)",
          border: "1px solid rgba(82,183,136,0.15)",
          borderRadius: 8,
          display: "flex", alignItems: "center", gap: 7,
          flexShrink: 0,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: "#52b788",
            animation: "pulseDot 2s infinite", flexShrink: 0
          }} />
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>All Systems Operational</span>
          <Activity size={11} color="#52b788" style={{ marginLeft: "auto" }} />
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
                const active = pathname === href || (href !== "/corporate-admin" && pathname.startsWith(href));
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
                      position: "relative",
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
          {/* Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, #2d6a4f 0%, #1a3d28 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(82,183,136,0.20)",
            }}>
              <span style={{ color: "#74c69d", fontSize: 11, fontWeight: 800 }}>CA</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{t("profile.corp_admin", "Corp. Admin")}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, margin: 0 }}>{t("profile.administrator", "Administrator")}</p>
            </div>
          </div>
          <Link href="/login" style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 11px", borderRadius: 8,
            color: "rgba(255,255,255,0.40)", fontSize: 12.5, fontWeight: 500,
            textDecoration: "none", transition: "all 0.15s ease",
          }}>
            <LogOut size={14} strokeWidth={1.8} />
            <span>{t("nav.logout", "Sign out")}</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{
          padding: "0 28px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "white",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 1px 0 var(--border), 0 2px 12px rgba(0,0,0,0.04)",
          gap: 16,
        }}>
          <div style={{ animation: mounted ? "fadeInLeft 0.4s ease" : "none" }}>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>
              {t("title.corporate_overview", "Corporate Overview")}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              {t("subtitle.corporate_overview", "Portfolio-wide safety & compliance across all mines")}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Interactive Colliery Selector */}
            <HeaderCollierySelector
              currentMine="All Mines Portfolio"
              variant="button"
            />

            <HeaderNavActions />

            {/* Interactive Profile Menu */}
            <HeaderProfileMenu
              role="corporate"
              name="Corp. Admin"
              subtitle="Administrator"
              allocatedMine="All Mines Portfolio"
            />
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}