"use client";

import {
  LayoutDashboard, HardHat, ClipboardCheck, AlertTriangle, ListChecks,
  Bell, ChevronDown, LogOut, Settings, MapPin, CheckCircle2, ShieldCheck, X, Globe
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/inspector" },
  { icon: ClipboardCheck,  label: "Inspections", href: "/inspector/inspections" },
  { icon: AlertTriangle,   label: "Violations",  href: "/inspector/violations" },
  { icon: ListChecks,      label: "Actions",     href: "/inspector/actions" },
  { icon: Settings,        label: "Settings",    href: "/inspector/settings" },
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const [lang, setLang] = useState("en");
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/logo.webp" alt="MineGuard Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.2 }}>MINEGUARD</p>
              <p style={{ color: "#52b788", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>SAFETY INSPECTOR</p>
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
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  background: active ? "#1a3d28" : "transparent",
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  marginBottom: 3,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  borderLeft: active ? "3px solid #52b788" : "3px solid transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} color={active ? "#52b788" : "currentColor"} />
                <span>{label}</span>
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

            {/* Multilingual Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "#1f2937"
              }}
            >
              <Globe size={13} color="#2d6a4f" />
              <span>{lang === "en" ? "EN 🇬🇧" : "हिंदी 🇮🇳"}</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0);
                }}
                style={{ width: 38, height: 38, border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer", position: "relative" }}
                title="Notifications"
              >
                <Bell size={16} color="#374151" />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 17, height: 17, background: "#dc2626", color: "white", borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{ position: "absolute", right: 0, top: 46, width: 300, background: "white", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <X size={14} color="#9ca3af" />
                    </button>
                  </div>
                  <div>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f9fafb", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.high ? "#dc2626" : "#2563eb", marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{n.title}</p>
                          <p style={{ fontSize: 11.5, color: "#6b7280" }}>{n.area}</p>
                          <p style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
