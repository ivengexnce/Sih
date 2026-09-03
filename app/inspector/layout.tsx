"use client";

import {
  LayoutDashboard, HardHat, ClipboardCheck, AlertTriangle, ListChecks,
  Bell, ChevronDown, LogOut, Settings, MapPin, CheckCircle2, ShieldCheck, X, Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import { useTranslation } from "@/app/components/LanguageContext";

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", defaultLabel: "Dashboard",   href: "/inspector" },
  { icon: ClipboardCheck,  key: "nav.inspections", defaultLabel: "Inspections", href: "/inspector/inspections" },
  { icon: AlertTriangle,   key: "nav.violations",  defaultLabel: "Violations",  href: "/inspector/violations" },
  { icon: ListChecks,      key: "nav.actions",     defaultLabel: "Actions",     href: "/inspector/actions" },
  { icon: Settings,        key: "nav.settings",    defaultLabel: "Settings",    href: "/inspector/settings" },
];

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  "/inspector": {
    title: "Field Inspector Dashboard 🚧",
    subtitle: "Real-time safety inspections, hazard tracking, and compliance enforcement.",
  },
  "/inspector/inspections": {
    title: "Safety Inspections 📋",
    subtitle: "Conduct, schedule, and review mine section safety checklists.",
  },
  "/inspector/violations": {
    title: "Hazard & Violation Reports ⚠️",
    subtitle: "Log incidents, monitor hazards, and enforce safety compliance.",
  },
  "/inspector/actions": {
    title: "Corrective Actions 🛠️",
    subtitle: "Track assigned remediation items and safety verification tasks.",
  },
  "/inspector/settings": {
    title: "Inspector Profile & Settings ⚙️",
    subtitle: "Manage personal credentials, notifications, and site assignments.",
  },
};

const notifications = [
  { id: 1, title: "CO₂ Level Elevated", area: "Underground Level 3", time: "10m ago", high: true },
  { id: 2, title: "Inspection Scheduled", area: "Pit Area – Section A", time: "45m ago", high: false },
  { id: 3, title: "Overdue Action", area: "Workshop Bay 3 Extinguishers", time: "2h ago", high: true },
];

export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const [allocatedMine, setAllocatedMine] = useState("Rajpura Coal Mine");
  const [officerName, setOfficerName] = useState("Inspector Smith");

  useEffect(() => {
    try {
      const u = storageService.getCurrentSession();
      if (u) {
        if (u.allocatedMine) setAllocatedMine(u.allocatedMine);
        if (u.name) setOfficerName(u.name);
      }
    } catch (e) {}
  }, []);

  const currentMeta = routeMeta[pathname] || {
    title: "Field Operations 🚧",
    subtitle: "Log reports, track violations, and schedule inspections.",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faf9", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, minHeight: "100vh", background: "#0f2318", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo */}
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
              <p style={{ color: "#52b788", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.05em", margin: "2px 0 0 0" }}>SAFETY INSPECTOR</p>
            </div>
          </Link>
        </div>

        {/* Status Pill */}
        <div style={{ margin: "14px 14px 4px", padding: "8px 12px", background: "rgba(82,183,136,0.12)", border: "1px solid rgba(82,183,136,0.25)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#52b788", boxShadow: "0 0 8px #52b788" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#e8f5ee", fontSize: 11, fontWeight: 600 }}>{officerName}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {allocatedMine}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {navItems.map(({ icon: Icon, key, defaultLabel, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  background: active ? "#1a3d28" : "transparent",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  marginBottom: 3,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  borderLeft: active ? "3px solid #52b788" : "3px solid transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} color={active ? "#52b788" : "currentColor"} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t(key, defaultLabel)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer & Sign out */}
        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              color: "rgba(255,255,255,0.55)",
              fontSize: 13.5,
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.15s",
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 30 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{currentMeta.title}</h1>
            <p style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>{currentMeta.subtitle}</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Assigned Mine Chip */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
              <MapPin size={13} color="#16a34a" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>{allocatedMine} · Assigned Beat</span>
            </div>

            {/* Interactive Notifications & Multilingual Switcher */}
            <HeaderNavActions />

            {/* Profile Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 10px", borderRadius: 24, border: "1px solid #e5e7eb", background: "#fafafa" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a3d28", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HardHat size={16} color="#52b788" />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", lineHeight: 1.1 }}>J. Smith</p>
                <p style={{ fontSize: 10.5, color: "#6b7280" }}>Safety Inspector #092</p>
              </div>
              <ChevronDown size={13} color="#9ca3af" />
            </div>
          </div>
        </header>

        {/* Content area */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
