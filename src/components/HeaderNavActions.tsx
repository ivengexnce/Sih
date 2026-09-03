"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Globe, Check, AlertTriangle, ShieldAlert,
  FileText, Wrench, X, CheckCheck, ChevronDown, CheckCircle,
  Volume2, Wind, Activity, Clock, Sparkles
} from "lucide-react";
import { useTranslation, LANGUAGES, LanguageCode, AiText } from "./LanguageContext";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  severity: "critical" | "warning" | "info";
  unread: boolean;
  category: "Ventilation" | "DGMS Compliance" | "Equipment" | "Statutory" | "Audit";
}

const CATEGORY_ICONS: Record<NotificationItem["category"], React.ReactNode> = {
  Ventilation:       <Wind size={13} />,
  "DGMS Compliance": <ShieldAlert size={13} />,
  Equipment:         <Wrench size={13} />,
  Statutory:         <FileText size={13} />,
  Audit:             <Activity size={13} />,
};

const SEV_CONFIG = {
  critical: { bar: "#dc2626", dot: "#dc2626", badge: "#fee2e2", badgeText: "#dc2626", label: "Critical" },
  warning:  { bar: "#ea580c", dot: "#f59e0b", badge: "#fff7ed", badgeText: "#ea580c", label: "Warning"  },
  info:     { bar: "#2563eb", dot: "#2563eb", badge: "#eff6ff", badgeText: "#2563eb", label: "Info"     },
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Continuous Methane Spike (1.15% CH₄)",
    desc: "Underground Seam 3, Face 4 sensor tripped statutory alert. Airflow diverted to auxiliary duct.",
    time: "4m ago", severity: "critical", unread: true, category: "Ventilation"
  },
  {
    id: "notif-2",
    title: "DGMS Circular 02/2024 SLA Notice",
    desc: "Mandatory strata control & SCAMP review due in 48 hours for all Degree-III gassy mines.",
    time: "28m ago", severity: "warning", unread: true, category: "DGMS Compliance"
  },
  {
    id: "notif-3",
    title: "CAT 777D Haul Truck Engine Temp",
    desc: "Dumper #D-04 telemetry reports transmission fluid heating above 98°C at Ramp 2.",
    time: "2h ago", severity: "warning", unread: true, category: "Equipment"
  },
  {
    id: "notif-4",
    title: "DGMS Form IV Incident Inquiry",
    desc: "Statutory notice of spontaneous combustion inquiry acknowledged by Regional Inspector Sitarampur.",
    time: "Yesterday", severity: "info", unread: false, category: "Statutory"
  },
  {
    id: "notif-5",
    title: "Ventilation Survey Completed",
    desc: "Auxiliary fan velocity verified at 0.65 m/s across underground face workings. Within safe parameters.",
    time: "Yesterday", severity: "info", unread: false, category: "Audit"
  }
];

export default function HeaderNavActions({ hideNotifications = false }: { hideNotifications?: boolean } = {}) {
  const { currentLang, setLanguage, t, translateText } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "info" | "danger" } | null>(null);

  const [aiTranslating, setAiTranslating] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      setAiTranslating(!!e.detail?.active);
    };
    window.addEventListener("mineguard_ai_translating", handler);
    return () => window.removeEventListener("mineguard_ai_translating", handler);
  }, []);

  const notifRef = useRef<HTMLDivElement>(null);
  const langRef  = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (langRef.current  && !langRef.current.contains(e.target as Node))  setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;
  const displayedNotifs = filterUnreadOnly ? notifications.filter(n => n.unread) : notifications;

  const showToast = (text: string, type: "success" | "info" | "danger" = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg({ text, type });
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3200);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast(t("notif.marked_all_read", "All notifications marked as read!"), "success");
  };

  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAlertClick = async (n: NotificationItem) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
    const titleTranslated = await translateText(n.title);
    showToast(`${t("notif.acknowledged", "Acknowledged")}: ${titleTranslated}`, "info");
  };

  const handleTriggerTestAlert = () => {
    const newAlert: NotificationItem = {
      id: `test-${Date.now()}`,
      title: "🚨 SCADA Telemetry Simulated Alarm",
      desc: "Instant live notification broadcast: Methane sensor #MS-04 verified at 1.05% CH₄.",
      time: "Just now", severity: "critical", unread: true, category: "Ventilation"
    };
    setNotifications(prev => [newAlert, ...prev]);
    showToast(t("notif.test_fired", "New critical notification dispatched!"), "danger");
  };

  const handleSelectLang = (code: LanguageCode) => {
    setLanguage(code);
    setLangOpen(false);
    const selected = LANGUAGES.find(l => l.code === code);
    showToast(`${t("lang.switched_to", "Language switched to")} ${selected?.native}`, "success");
  };

  const selectedLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const toastBg: Record<string, string> = {
    success: "#f0fdf4",
    info: "#eff6ff",
    danger: "#fff1f2",
  };
  const toastColor: Record<string, string> = {
    success: "#15803d",
    info: "#1d4ed8",
    danger: "#be123c",
  };
  const toastBorder: Record<string, string> = {
    success: "#bbf7d0",
    info: "#bfdbfe",
    danger: "#fecdd3",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>

      {/* ── Premium Toast ── */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          display: "flex", alignItems: "center", gap: 10,
          padding: "11px 16px",
          background: toastBg[toastMsg.type],
          color: toastColor[toastMsg.type],
          border: `1px solid ${toastBorder[toastMsg.type]}`,
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          zIndex: 9_999_999,
          fontSize: 13, fontWeight: 600,
          maxWidth: 360,
          animation: "toastPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <CheckCircle size={15} />
          <span style={{ flex: 1 }}>{toastMsg.text}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.6, color: "inherit" }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── NOTIFICATION BELL ── */}
      {!hideNotifications && (
        <div style={{ position: "relative" }} ref={notifRef}>
        <button
          type="button"
          onClick={() => { setNotifOpen(o => !o); setLangOpen(false); }}
          title={t("notif.tooltip", "Notifications & Statutory Alerts")}
          style={{
            width: 38, height: 38,
            border: `1.5px solid ${notifOpen ? "#2d6a4f" : "#e5e7eb"}`,
            borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            background: notifOpen ? "#f0fdf4" : "white",
            transition: "all 0.15s ease",
            position: "relative",
            boxShadow: notifOpen ? "0 0 0 3px rgba(82,183,136,0.15)" : "var(--shadow-xs)",
          }}
        >
          <Bell size={16} color={notifOpen ? "#1a3d28" : "#374151"} strokeWidth={notifOpen ? 2.4 : 2} />
          {unreadCount > 0 && (
            <div style={{
              position: "absolute", top: -5, right: -5,
              minWidth: 18, height: 18, padding: "0 4px",
              background: "#dc2626", color: "white",
              borderRadius: 10, fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(220,38,38,0.4)",
              animation: "pulseDanger 1.5s infinite",
            }}>
              {unreadCount}
            </div>
          )}
        </button>

        {/* Notification Panel */}
        {notifOpen && (
          <div style={{
            position: "absolute", top: 46, right: 0,
            width: 380,
            background: "white",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.06)",
            zIndex: 999_999,
            overflow: "hidden",
            animation: "fadeInDown 0.22s ease",
          }}>

            {/* Panel Header */}
            <div style={{
              padding: "14px 16px 12px",
              background: "linear-gradient(135deg, #071309 0%, #0f2318 60%, #162e1e 100%)",
              borderBottom: "1px solid rgba(82,183,136,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "rgba(82,183,136,0.15)", border: "1px solid rgba(82,183,136,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bell size={14} color="#74c69d" />
                  </div>
                  <div>
                    <p style={{ color: "white", fontSize: 13, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                      {t("notif.panel_title", "Statutory Alerts")}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 10.5, margin: 0 }}>
                      DGMS Incident Exchange · Live
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#52b788",
                    animation: "pulseDot 2s infinite",
                  }} />
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>LIVE</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={handleTriggerTestAlert}
                  style={{
                    background: "rgba(220,38,38,0.20)", border: "1px solid rgba(220,38,38,0.35)",
                    color: "#fca5a5", borderRadius: 6,
                    padding: "4px 9px", fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Volume2 size={11} /> {t("notif.test", "Test Alert")}
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{
                      background: "rgba(82,183,136,0.15)", border: "1px solid rgba(82,183,136,0.28)",
                      color: "#86efac", borderRadius: 6,
                      padding: "4px 9px", fontSize: 10.5, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <CheckCheck size={11} /> {t("notif.mark_read", "Mark all read")}
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: "flex", gap: 4,
              padding: "8px 12px",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafafa",
            }}>
              {[
                { label: `${t("notif.all", "All")} (${notifications.length})`, active: !filterUnreadOnly, onClick: () => setFilterUnreadOnly(false) },
                { label: `${t("notif.unread", "Unread")} (${unreadCount})`, active: filterUnreadOnly, onClick: () => setFilterUnreadOnly(true) },
              ].map(tab => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={tab.onClick}
                  style={{
                    padding: "5px 12px", borderRadius: 6, border: "none",
                    fontSize: 12, fontWeight: tab.active ? 700 : 500,
                    background: tab.active ? "white" : "transparent",
                    color: tab.active ? "#0f2318" : "#64748b",
                    cursor: "pointer",
                    boxShadow: tab.active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div style={{ maxHeight: 348, overflowY: "auto" }}>
              {displayedNotifs.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>
                    <CheckCircle size={24} color="#16a34a" />
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                    {t("notif.all_clear", "All clear!")}
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending alerts</p>
                </div>
              ) : (
                displayedNotifs.map((n, idx) => {
                  const sev = SEV_CONFIG[n.severity];
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleAlertClick(n)}
                      style={{
                        display: "flex",
                        borderBottom: "1px solid #f1f5f9",
                        background: n.unread ? "#fffdf7" : "white",
                        transition: "background 0.12s",
                        cursor: "pointer",
                        animation: `fadeInUp 0.3s ease ${idx * 0.04}s both`,
                      }}
                    >
                      {/* Severity bar */}
                      <div style={{
                        width: 3, minHeight: "100%",
                        background: sev.bar,
                        flexShrink: 0,
                        opacity: n.unread ? 1 : 0.4,
                      }} />

                      <div style={{ padding: "11px 12px 11px 11px", flex: 1, minWidth: 0 }}>
                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                            {n.unread && (
                              <div style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: sev.dot, flexShrink: 0,
                              }} />
                            )}
                            <span style={{
                              fontSize: 12.5, fontWeight: n.unread ? 700 : 600,
                              color: "#0f172a", lineHeight: 1.25,
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              <AiText text={n.title} />
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleDismiss(n.id, e)}
                            title={t("notif.dismiss", "Dismiss")}
                            style={{
                              background: "none", border: "none",
                              color: "#cbd5e1", cursor: "pointer",
                              padding: 2, borderRadius: 4, flexShrink: 0,
                              display: "flex", alignItems: "center",
                              transition: "color 0.1s",
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Description */}
                        <p style={{
                          fontSize: 11.5, color: "#475569",
                          margin: "0 0 6px", lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as any,
                          overflow: "hidden",
                        }}>
                          <AiText text={n.desc} />
                        </p>

                        {/* Footer row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "2px 8px",
                            background: sev.badge,
                            color: sev.badgeText,
                            borderRadius: 5, fontSize: 10.5, fontWeight: 700,
                          }}>
                            {CATEGORY_ICONS[n.category]}
                            <AiText text={n.category} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#94a3b8", fontSize: 10.5 }}>
                            <Clock size={10} />
                            {n.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Panel Footer */}
            <div style={{
              padding: "9px 16px",
              background: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#52b788", animation: "pulseDot 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#2d6a4f" }}>
                {t("notif.footer", "Connected to DGMS Statutory Incident Exchange")}
              </span>
            </div>
          </div>
        )}
      </div>
      )}

      {/* ── AI TRANSLATION STATUS PILL ── */}
      {currentLang !== "en" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 11px",
            borderRadius: 8,
            background: "linear-gradient(135deg, rgba(82,183,136,0.14) 0%, rgba(45,106,79,0.08) 100%)",
            border: "1px solid rgba(82,183,136,0.30)",
            fontSize: 11.5,
            fontWeight: 800,
            color: "#2d6a4f",
            cursor: "default",
          }}
          title={aiTranslating ? "AI Translation in progress..." : `AI Real-Time Translation Active (${selectedLangObj.label})`}
        >
          <Sparkles size={12} color="#2d6a4f" />
          <span>{aiTranslating ? "AI Translating..." : `AI ${selectedLangObj.label}`}</span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: aiTranslating ? "#ea580c" : "#16a34a",
              animation: aiTranslating ? "pulseDanger 1s infinite" : "pulseDot 2s infinite",
            }}
          />
        </div>
      )}

      {/* ── LANGUAGE SWITCHER ── */}
      <div style={{ position: "relative" }} ref={langRef}>
        <button
          type="button"
          onClick={() => { setLangOpen(o => !o); setNotifOpen(false); }}
          title={t("lang.tooltip", "Switch Language / भाषा बदलें")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px",
            border: `1.5px solid ${langOpen ? "#2d6a4f" : "#e5e7eb"}`,
            borderRadius: 9, background: langOpen ? "#f0fdf4" : "white",
            cursor: "pointer", fontSize: 12.5, fontWeight: 700,
            color: "#1f2937", transition: "all 0.15s ease",
            boxShadow: langOpen ? "0 0 0 3px rgba(82,183,136,0.15)" : "var(--shadow-xs)",
          }}
        >
          <Globe size={14} color="#2d6a4f" />
          <span>{selectedLangObj.native} {selectedLangObj.flag}</span>
          <ChevronDown
            size={12} color="#6b7280"
            style={{ transform: langOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}
          />
        </button>

        {/* Language Dropdown */}
        {langOpen && (
          <div style={{
            position: "absolute", top: 46, right: 0,
            width: 290, maxHeight: 420, overflowY: "auto",
            background: "white",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.06)",
            zIndex: 999_999,
            overflow: "hidden",
            animation: "fadeInDown 0.22s ease",
          }}>
            {/* Header */}
            <div style={{
              padding: "12px 16px 10px",
              background: "linear-gradient(135deg, #071309 0%, #0f2318 100%)",
              borderBottom: "1px solid rgba(82,183,136,0.12)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Globe size={14} color="#74c69d" />
              <p style={{ color: "white", fontSize: 12.5, fontWeight: 700, margin: 0 }}>
                {t("lang.select_portal", "Portal Language")}
              </p>
            </div>

            {/* Language list */}
            <div style={{ overflowY: "auto", maxHeight: 320 }}>
              {LANGUAGES.map((lang, idx) => {
                const isSelected = currentLang === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    style={{
                      padding: "10px 14px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer",
                      background: isSelected ? "#f0fdf4" : "white",
                      borderBottom: idx < LANGUAGES.length - 1 ? "1px solid #f8fafc" : "none",
                      transition: "background 0.1s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{lang.flag}</span>
                      <div>
                        <p style={{
                          margin: 0, fontSize: 13, fontWeight: isSelected ? 800 : 600,
                          color: isSelected ? "#14532d" : "#1e293b",
                        }}>
                          {lang.native} <span style={{ fontWeight: 500, color: "#64748b", fontSize: 11.5 }}>({lang.label})</span>
                        </p>
                        <p style={{ margin: 0, fontSize: 10.5, color: "#94a3b8" }}>{lang.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={12} color="#16a34a" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}