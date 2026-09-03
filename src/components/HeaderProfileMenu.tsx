"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HardHat, User, Settings, LogOut, ShieldCheck, ChevronDown,
  Building2, ArrowRightLeft, Check, ExternalLink, Activity
} from "lucide-react";
import { useTranslation } from "./LanguageContext";
import { storageService } from "@/lib/storage";

interface HeaderProfileMenuProps {
  role: "inspector" | "manager" | "corporate";
  name: string;
  subtitle: string;
  allocatedMine?: string;
  initials?: string;
}

export default function HeaderProfileMenu({
  role,
  name,
  subtitle,
  allocatedMine,
  initials
}: HeaderProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    try {
      storageService.clearSession();
    } catch (e) {}
    setOpen(false);
    router.push("/login");
  };

  const handleSwitchRole = (targetRole: string, href: string) => {
    try {
      if (targetRole === "corporate") {
        storageService.setOfficerSession({
          name: "Corporate Director",
          officialId: "CIL-DIR-001",
          role: "corporate",
          allocatedMine: "All Mines Portfolio",
          dgmsCertified: true,
          subsidiary: "CIL HQ"
        });
      } else if (targetRole === "manager") {
        storageService.setOfficerSession({
          name: "Er. Rajesh Sharma",
          officialId: "MGR-0441",
          role: "manager",
          allocatedMine: "SECL Gevra Mega Opencast",
          dgmsCertified: true,
          subsidiary: "SECL"
        });
      } else {
        storageService.setOfficerSession({
          name: "Inspector A. Smith",
          officialId: "INS-092",
          role: "inspector",
          allocatedMine: "Rajpura Coal Mine",
          dgmsCertified: true,
          subsidiary: "DGMS Eastern"
        });
      }
    } catch (e) {}
    setOpen(false);
    router.push(href);
  };

  const settingsHref =
    role === "corporate"
      ? "/corporate-admin/settings"
      : role === "manager"
      ? "/mine-manager/settings"
      : "/inspector/settings";

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      {/* ── Profile Pill Button ── */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-label="User Profile Menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px 5px 6px",
          border: `1.5px solid ${open ? "#2d6a4f" : "var(--border)"}`,
          borderRadius: 24,
          background: open ? "#f0fdf4" : "var(--surface-1, #fafafa)",
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: open ? "0 0 0 3px rgba(82,183,136,0.18)" : "var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))",
          fontFamily: "inherit",
          textAlign: "left"
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a3d28 0%, #2d6a4f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}
        >
          {role === "corporate" ? (
            <span style={{ color: "#74c69d", fontSize: 11, fontWeight: 900 }}>CA</span>
          ) : role === "manager" ? (
            <span style={{ color: "#74c69d", fontSize: 11, fontWeight: 900 }}>{initials || "MM"}</span>
          ) : (
            <HardHat size={15} color="#52b788" />
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "var(--text-primary, #111827)",
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 140
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: 10,
              color: "var(--text-muted, #6b7280)",
              margin: 0,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 140
            }}
          >
            {t(subtitle)}
          </p>
        </div>

        <ChevronDown
          size={13}
          color="#6b7280"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            marginLeft: 2,
            flexShrink: 0
          }}
        />
      </button>

      {/* ── Dropdown Modal Menu ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 0,
            width: 280,
            background: "white",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05)",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeInDown 0.2s ease"
          }}
        >
          {/* Header Card */}
          <div
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #09170e 0%, #12281a 100%)",
              color: "white"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(82,183,136,0.15)",
                  border: "1px solid rgba(82,183,136,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {role === "corporate" ? (
                  <span style={{ color: "#74c69d", fontSize: 13, fontWeight: 900 }}>CA</span>
                ) : (
                  <HardHat size={20} color="#52b788" />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, margin: 0, color: "white", lineHeight: 1.2 }}>
                  {name}
                </p>
                <p style={{ fontSize: 10.5, color: "#86efac", margin: "2px 0 0 0" }}>
                  {t(subtitle)}
                </p>
              </div>
            </div>

            {/* Statutory Certification Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 20,
                background: "rgba(82,183,136,0.12)",
                border: "1px solid rgba(82,183,136,0.25)",
                fontSize: 10,
                fontWeight: 700,
                color: "#74c69d"
              }}
            >
              <ShieldCheck size={11} color="#74c69d" />
              <span>{t("DGMS Statutory Authorization", "DGMS Statutory Authorization")}</span>
            </div>

            {allocatedMine && (
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  margin: "8px 0 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                📍 {allocatedMine}
              </p>
            )}
          </div>

          {/* Menu Options */}
          <div style={{ padding: "8px 6px" }}>
            <Link
              href={settingsHref}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#374151",
                textDecoration: "none",
                transition: "background 0.15s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings size={15} color="#6b7280" />
              <span>{t("Profile & Settings", "Profile & Settings")}</span>
            </Link>

            {/* Quick Portal Switcher */}
            <div style={{ margin: "6px 0", borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  letterSpacing: "0.04em",
                  padding: "4px 12px 2px"
                }}
              >
                {t("Switch Portal Role", "Switch Portal Role")}
              </p>

              {role !== "inspector" && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole("inspector", "/inspector")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <HardHat size={14} color="#16a34a" />
                    {t("Field Inspector", "Field Inspector")}
                  </span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>INS-092</span>
                </button>
              )}

              {role !== "manager" && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole("manager", "/mine-manager")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Building2 size={14} color="#2563eb" />
                    {t("Mine Manager", "Mine Manager")}
                  </span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>MGR-0441</span>
                </button>
              )}

              {role !== "corporate" && (
                <button
                  type="button"
                  onClick={() => handleSwitchRole("corporate", "/corporate-admin")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShieldCheck size={14} color="#8b5cf6" />
                    {t("Corporate Admin", "Corporate Admin")}
                  </span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>HQ</span>
                </button>
              )}
            </div>

            {/* Sign Out */}
            <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 4, paddingTop: 4 }}>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#dc2626",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <LogOut size={15} color="#dc2626" />
                <span>{t("nav.logout", "Sign out")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
