"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Globe, Check, AlertTriangle, Clock, ShieldAlert,
  FileText, Wrench, X, CheckCheck, Trash2, ChevronDown, CheckCircle
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  severity: "critical" | "warning" | "info" | "maintenance";
  unread: boolean;
  category: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Methane Spike (1.15% CH₄)",
    desc: "Section L-3 Heading 4 return airway split exceeded 1.0% threshold. Power interlock trip activated under CMR Reg 153.",
    time: "4 mins ago",
    severity: "critical",
    unread: true,
    category: "Telemetry"
  },
  {
    id: "notif-2",
    title: "DGMS Circular 02/2024 Deadline Approaching",
    desc: "Continuous tele-monitoring compliance report submission required before statutory deadline.",
    time: "2 hours ago",
    severity: "warning",
    unread: true,
    category: "Regulatory"
  },
  {
    id: "notif-3",
    title: "Dumper #CAT-789D Thermal Warning",
    desc: "Rear differential temperature logged 88°C on Haul Road 2. Dispatched to Workshop Bay 3.",
    time: "5 hours ago",
    severity: "maintenance",
    unread: true,
    category: "Fleet"
  },
  {
    id: "notif-4",
    title: "DGMS Form IV Inspection Dispatched",
    desc: "Statutory notice of spontaneous combustion inquiry acknowledged by Regional Inspector Sitarampur.",
    time: "Yesterday",
    severity: "info",
    unread: false,
    category: "Statutory"
  },
  {
    id: "notif-5",
    title: "Ventilation Survey Completed",
    desc: "Auxiliary fan velocity verified at 0.65 m/s across underground face workings. Within safe parameters.",
    time: "Yesterday",
    severity: "info",
    unread: false,
    category: "Audit"
  }
];

const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧", desc: "National Statutory Scope" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳", desc: "Coal Belt (SECL, BCCL, CCL, NCL, WCL)" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳", desc: "Eastern Coalfields (ECL, Raniganj)" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳", desc: "Mahanadi Coalfields (MCL, Talcher)" }
];

export default function HeaderNavActions() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Load persisted language
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("mineguard_language");
      if (savedLang) setCurrentLang(savedLang);
    } catch (e) {}
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleSelectLang = (code: string) => {
    setCurrentLang(code);
    setLangOpen(false);
    try {
      localStorage.setItem("mineguard_language", code);
      // Dispatch custom event for immediate translation listener if active
      window.dispatchEvent(new CustomEvent("mineguard_lang_changed", { detail: { lang: code } }));
    } catch (e) {}
  };

  const selectedLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const displayedNotifs = filterUnreadOnly ? notifications.filter(n => n.unread) : notifications;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* ── NOTIFICATIONS BELL BUTTON & DROPDOWN ── */}
      <div style={{ position: "relative" }} ref={notifRef}>
        <button
          onClick={() => {
            setNotifOpen(!notifOpen);
            setLangOpen(false);
          }}
          title="Notifications & Statutory Alerts"
          style={{
            width: 38,
            height: 38,
            border: `1.5px solid ${notifOpen ? "#2d6a4f" : "#e5e7eb"}`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: notifOpen ? "#f0fdf4" : "white",
            transition: "all 0.15s",
            position: "relative"
          }}
        >
          <Bell size={16} color={notifOpen ? "#2d6a4f" : "#374151"} />
          {unreadCount > 0 && (
            <div style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              background: "#dc2626",
              color: "white",
              borderRadius: 10,
              fontSize: 10.5,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              boxShadow: "0 2px 4px rgba(220,38,38,0.3)"
            }}>
              {unreadCount}
            </div>
          )}
        </button>

        {/* Floating Notification Panel */}
        {notifOpen && (
          <div style={{
            position: "absolute",
            top: 46,
            right: 0,
            width: 380,
            background: "white",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
            zIndex: 9999,
            overflow: "hidden",
            animation: "fadeIn 0.15s ease-out"
          }}>
            {/* Header */}
            <div style={{
              padding: "12px 16px",
              background: "#0f2318",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={15} color="#86efac" />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Statutory Alerts & Broadcasts</span>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#86efac",
                    borderRadius: 4,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
              padding: "6px 12px",
              fontSize: 12
            }}>
              <button
                onClick={() => setFilterUnreadOnly(false)}
                style={{
                  background: !filterUnreadOnly ? "#e2e8f0" : "transparent",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: !filterUnreadOnly ? 700 : 500,
                  color: "#334155",
                  cursor: "pointer"
                }}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilterUnreadOnly(true)}
                style={{
                  background: filterUnreadOnly ? "#e2e8f0" : "transparent",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: filterUnreadOnly ? 700 : 500,
                  color: "#334155",
                  cursor: "pointer"
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notifications List */}
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {displayedNotifs.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "#94a3b8" }}>
                  <CheckCircle size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>All clear! No alerts.</p>
                </div>
              ) : (
                displayedNotifs.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f1f5f9",
                      background: n.unread ? "#f0fdf4" : "white",
                      transition: "background 0.1s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: n.severity === "critical" ? "#dc2626" : n.severity === "warning" ? "#ea580c" : "#16a34a"
                        }} />
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>
                          {n.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDismiss(n.id)}
                        title="Dismiss"
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 2 }}
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 4px", lineHeight: 1.35 }}>
                      {n.desc}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "#94a3b8" }}>
                      <span style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, fontWeight: 600, color: "#64748b" }}>
                        {n.category}
                      </span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "9px 16px",
              background: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#2d6a4f"
            }}>
              Connected to DGMS Statutory Incident Exchange
            </div>
          </div>
        )}
      </div>

      {/* ── MULTILINGUAL SWITCHER BUTTON & DROPDOWN ── */}
      <div style={{ position: "relative" }} ref={langRef}>
        <button
          onClick={() => {
            setLangOpen(!langOpen);
            setNotifOpen(false);
          }}
          title="Switch Language / भाषा बदलें"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            border: `1.5px solid ${langOpen ? "#2d6a4f" : "#e5e7eb"}`,
            borderRadius: 8,
            background: langOpen ? "#f0fdf4" : "#f9fafb",
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 700,
            color: "#1f2937",
            transition: "all 0.15s"
          }}
        >
          <Globe size={14} color="#2d6a4f" />
          <span>{selectedLangObj.native} {selectedLangObj.flag}</span>
          <ChevronDown size={12} color="#6b7280" />
        </button>

        {/* Floating Language Menu */}
        {langOpen && (
          <div style={{
            position: "absolute",
            top: 46,
            right: 0,
            width: 250,
            background: "white",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
            zIndex: 9999,
            overflow: "hidden",
            padding: "6px 0"
          }}>
            <div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
              Select Colliery Language
            </div>

            {LANGUAGES.map(lang => {
              const isSelected = currentLang === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleSelectLang(lang.code)}
                  style={{
                    padding: "9px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    background: isSelected ? "#f0fdf4" : "white",
                    transition: "background 0.1s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontSize: 16 }}>{lang.flag}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: isSelected ? 800 : 600, color: isSelected ? "#1b4332" : "#1e293b" }}>
                        {lang.native} ({lang.label})
                      </p>
                      <p style={{ margin: 0, fontSize: 10.5, color: "#64748b" }}>
                        {lang.desc}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check size={15} color="#16a34a" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
