"use client";

import {
  LayoutDashboard, HardHat, ClipboardCheck, AlertTriangle, ListChecks,
  ChevronDown, LogOut, Settings, MapPin, Activity, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import { useTranslation } from "@/components/LanguageContext";
import HeaderNavActions from "@/components/HeaderNavActions";

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard",   defaultLabel: "Dashboard",   href: "/inspector" },
  { icon: ClipboardCheck,  key: "nav.inspections", defaultLabel: "Inspections", href: "/inspector/inspections" },
  { icon: AlertTriangle,   key: "nav.violations",  defaultLabel: "Violations",  href: "/inspector/violations" },
  { icon: ListChecks,      key: "nav.actions",     defaultLabel: "Actions",     href: "/inspector/actions" },
  { icon: Settings,        key: "nav.settings",    defaultLabel: "Settings",    href: "/inspector/settings" },
];

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  "/inspector":              { title: "Field Inspector Dashboard", subtitle: "Real-time safety inspections, hazard tracking & compliance enforcement." },
  "/inspector/inspections":  { title: "Safety Inspections",       subtitle: "Conduct, schedule and review mine section safety checklists." },
  "/inspector/violations":   { title: "Hazard & Violation Reports", subtitle: "Log incidents, monitor hazards and enforce safety compliance." },
  "/inspector/actions":      { title: "Corrective Actions",       subtitle: "Track assigned remediation items and safety verification tasks." },
  "/inspector/settings":     { title: "Inspector Profile & Settings", subtitle: "Manage personal credentials, notifications and site assignments." },
};

export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine");
  const [officerName, setOfficerName] = useState("Inspector");
  const [officerId, setOfficerId] = useState("INS-092");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const u = storageService.getCurrentSession();
      if (u) {
        if (u.allocatedMine) setAllocatedMine(u.allocatedMine);
        if (u.name) setOfficerName(u.name);
      }
    } catch (e) {}
  }, []);

  const currentMeta = routeMeta[pathname] || { title: "Field Operations", subtitle: "Log reports, track violations and schedule inspections." };
  const initials = officerName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "IN";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-bg)", fontFamily: "var(--font-sans)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 224,
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
                Safety Inspector
              </p>
            </div>
          </Link>
        </div>

        {/* Inspector identity card */}
        <div style={{
          margin: "10px 12px 4px",
          padding: "10px 11px",
          background: "rgba(82,183,136,0.08)",
          border: "1px solid rgba(82,183,136,0.18)",
          borderRadius: 9,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #2d6a4f 0%, #1a3d28 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <HardHat size={15} color="#74c69d" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {officerName}
              </p>
              <p style={{ color: "#52b788", fontSize: 10, fontWeight: 600, margin: 0 }}>{officerId}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: "#52b788",
              animation: "pulseDot 2s infinite", flexShrink: 0
            }} />
            <span style={{
              fontSize: 9.5, color: "rgba(255,255,255,0.45)", fontWeight: 600,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {allocatedMine}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto", overflowX: "hidden" }}>
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.20)",
            padding: "2px 4px 6px",
          }}>
            Field Operations
          </p>
          {navItems.map(({ icon: Icon, key, defaultLabel, href }) => {
            const active = pathname === href || (href !== "/inspector" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 11px",
                  borderRadius: 8,
                  color: active ? "white" : "rgba(255,255,255,0.58)",
                  background: active ? "rgba(26,61,40,0.9)" : "transparent",
                  fontSize: 13.5, fontWeight: active ? 700 : 500,
                  marginBottom: 2, textDecoration: "none",
                  transition: "all 0.15s ease",
                  borderLeft: active ? "3px solid #52b788" : "3px solid transparent",
                  boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
                }}
              >
                <Icon
                  size={16}
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

          {/* Compliance status */}
          <div style={{
            marginTop: 16, padding: "10px 11px",
            background: "rgba(22,163,74,0.08)",
            border: "1px solid rgba(22,163,74,0.18)",
            borderRadius: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <ShieldCheck size={12} color="#52b788" />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                {t("Today's Status", "Today's Status")}
              </span>
            </div>
            <p style={{ color: "#74c69d", fontSize: 12, fontWeight: 700, margin: "0 0 2px" }}>{t("3 / 5 Completed", "3 / 5 Completed")}</p>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "#52b788", borderRadius: 3 }} />
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div style={{ padding: "10px 10px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <Link href="/login" style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 11px", borderRadius: 8,
            color: "rgba(255,255,255,0.38)", fontSize: 12.5, fontWeight: 500,
            textDecoration: "none", transition: "all 0.15s ease",
          }}>
            <LogOut size={13} strokeWidth={1.8} />
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
          gap: 16, flexShrink: 0,
        }}>
          <div style={{ animation: mounted ? "fadeInLeft 0.4s ease" : "none" }}>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>
              {t(currentMeta.title)}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              {t(currentMeta.subtitle)}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Location chip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 20, cursor: "pointer",
              maxWidth: 220,
            }}>
              <MapPin size={13} color="#16a34a" style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: 12, fontWeight: 700, color: "#15803d",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>
                {allocatedMine}
              </span>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: "#16a34a",
                flexShrink: 0, animation: "pulseDot 2s infinite"
              }} />
            </div>

            <HeaderNavActions />

            {/* Profile */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px 5px 6px",
              border: "1px solid var(--border)", borderRadius: 24,
              background: "var(--surface-1)", cursor: "pointer",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #1a3d28 0%, #2d6a4f 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <HardHat size={15} color="#52b788" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>{officerName}</p>
                <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>Safety Inspector · {officerId}</p>
              </div>
              <ChevronDown size={13} color="var(--text-faint)" />
            </div>
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
