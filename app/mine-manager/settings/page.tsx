"use client";

import React, { useState, useEffect } from "react";
import {
  User, Building2, Bell, Shield, Sliders, Volume2, Save,
  CheckCircle2, Smartphone, Key, Lock, RefreshCw, AlertTriangle,
  Zap, Check, Gauge, HardHat, FileBadge, Radio
} from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "colliery" | "telemetry" | "security" | "notifications">("profile");

  // Officer Profile
  const [session, setSession] = useState({
    name: "Er. Rajesh Sharma",
    email: "r.sharma@mineguard.in",
    phone: "9876543210",
    designation: "First Class Mine Manager (FCC)",
    dgmsCertNo: "DGMS/FCC/2018/8841",
    allocatedMine: "Rajpura Coal Mine (SECL)"
  });

  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));

  // Telemetry Thresholds
  const [methaneLimit, setMethaneLimit] = useState(1.0); // %
  const [coLimit, setCoLimit] = useState(25); // ppm
  const [minAirVelocity, setMinAirVelocity] = useState(0.5); // m/s
  const [autoPowerTrip, setAutoPowerTrip] = useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(15);
  const [auditLogging, setAuditLogging] = useState(true);

  // Notifications
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    smsCritical: true,
    pushAlarms: true,
    shiftReportDigest: true,
    sirenTestActive: false
  });

  const [saved, setSaved] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  useEffect(() => {
    try {
      const sess = storageService.getCurrentSession();
      if (sess) {
        setSession(prev => ({
          ...prev,
          name: sess.name || prev.name,
          email: sess.email || prev.email,
          phone: sess.phone || prev.phone,
          designation: sess.designation || prev.designation,
          allocatedMine: sess.allocatedMine || prev.allocatedMine
        }));
        setColliery(getCollieryProfile(sess.allocatedMine));
      }

      const storedSettings = localStorage.getItem("mineguard_settings");
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.methaneLimit) setMethaneLimit(parsed.methaneLimit);
        if (parsed.coLimit) setCoLimit(parsed.coLimit);
        if (parsed.minAirVelocity) setMinAirVelocity(parsed.minAirVelocity);
        if (parsed.autoPowerTrip !== undefined) setAutoPowerTrip(parsed.autoPowerTrip);
        if (parsed.twoFactorEnabled !== undefined) setTwoFactorEnabled(parsed.twoFactorEnabled);
        if (parsed.notifs) setNotifs(parsed.notifs);
      }
    } catch (e) {}
  }, []);

  const handleSaveAll = () => {
    try {
      const settingsPayload = {
        session,
        methaneLimit,
        coLimit,
        minAirVelocity,
        autoPowerTrip,
        twoFactorEnabled,
        autoLockMinutes,
        notifs
      };
      localStorage.setItem("mineguard_settings", JSON.stringify(settingsPayload));
    } catch (e) {}

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testAudioSiren = () => {
    setSirenPlaying(true);
    try {
      if (typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext)) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (err) {}

    setTimeout(() => setSirenPlaying(false), 800);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 900, margin: "0 auto", position: "relative" }}>
      {/* Toast Notification */}
      {saved && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#52b788" />
          <span>Settings & Colliery Telemetry Parameters updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
            Colliery Configuration & Officer Settings
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
            Statutory profile management, telemetry sensor threshold tuning, and DGMS cybersecurity preferences.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 20px",
            background: "#2d6a4f", color: "white", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
            transition: "background 0.15s"
          }}
        >
          <Save size={15} /> Save Changes
        </button>
      </div>

      {/* Modern Navigation Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10,
        marginBottom: 24, border: "1px solid #e2e8f0"
      }}>
        {[
          { id: "profile", label: "Officer Profile", icon: User },
          { id: "colliery", label: "Colliery Beat", icon: Building2 },
          { id: "telemetry", label: "Sensor Alarms", icon: Sliders },
          { id: "security", label: "Security & 2FA", icon: Shield },
          { id: "notifications", label: "Emergency Sirens", icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "9px 12px",
                borderRadius: 7,
                border: "none",
                background: isActive ? "white" : "transparent",
                color: isActive ? "#1b4332" : "#64748b",
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s"
              }}
            >
              <Icon size={14} color={isActive ? "#2d6a4f" : "#94a3b8"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OFFICER PROFILE ── */}
      {activeTab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              <HardHat size={16} color="#2d6a4f" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Statutory Mine Official Identity</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={session.name}
                    onChange={e => setSession({ ...session, name: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Statutory Designation
                  </label>
                  <input
                    type="text"
                    value={session.designation}
                    onChange={e => setSession({ ...session, designation: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Official NIC / Ministry Email
                  </label>
                  <input
                    type="email"
                    value={session.email}
                    readOnly
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#f8fafc", color: "#64748b" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Registered Mobile Number (10 Digits)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={session.phone}
                    onChange={e => setSession({ ...session, phone: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  DGMS Statutory Certificate of Competency No.
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="text"
                    value={session.dgmsCertNo}
                    onChange={e => setSession({ ...session, dgmsCertNo: e.target.value })}
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                  <span style={{ padding: "8px 12px", background: "#f0fdf4", color: "#16a34a", borderRadius: 6, fontSize: 11.5, fontWeight: 700, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={13} /> Verified by DGMS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: COLLIERY BEAT CONFIGURATION ── */}
      {activeTab === "colliery" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={16} color="#2563eb" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Allocated Beat & Seam Parameters</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  Active Operational Colliery
                </label>
                <input
                  type="text"
                  value={session.allocatedMine}
                  readOnly
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #93c5fd", fontSize: 13.5, fontWeight: 700, color: "#1e3a8a", background: "#eff6ff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    CIL Subsidiary & Coalfield
                  </label>
                  <input
                    type="text"
                    value={`${colliery.subsidiary} · ${colliery.coalfield}`}
                    readOnly
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#f8fafc", color: "#475569" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Mining Method & Gassiness Classification
                  </label>
                  <input
                    type="text"
                    value={`${colliery.type} · ${colliery.gassiness}`}
                    readOnly
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#f8fafc", color: "#475569" }}
                  />
                </div>
              </div>

              <div style={{ padding: "14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <AlertTriangle size={18} color="#ea580c" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                  <strong>Statutory Notice (CMR Reg 8):</strong> Re-assignment of allocated mine beats is governed by the Coal India Corporate Safety Directorate. To request transfer of command, contact the Regional Mining Inspectorate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SENSOR ALARMS & TELEMETRY ── */}
      {activeTab === "telemetry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Gauge size={16} color="#059669" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Continuous Tele-Monitoring Trip Limits (CMR 153)</span>
              </div>
              <span style={{ fontSize: 11.5, background: "#ecfdf5", color: "#059669", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>
                Live SCADA Connected
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Methane Slider */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Methane (CH₄) Trip Threshold</span>
                    <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0" }}>Power is cut automatically when percentage exceeds this statutory level.</p>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: methaneLimit >= 1.0 ? "#dc2626" : "#2d6a4f" }}>
                    {methaneLimit.toFixed(2)}% CH₄
                  </span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="1.50"
                  step="0.05"
                  value={methaneLimit}
                  onChange={e => setMethaneLimit(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#2d6a4f", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  <span>0.50% (Strict)</span>
                  <span>0.75% (CMR 153 Alert)</span>
                  <span>1.00% (Trip Cutoff)</span>
                  <span>1.50% (Dangerous)</span>
                </div>
              </div>

              {/* Carbon Monoxide */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Carbon Monoxide (CO) Early Heating Alert</span>
                    <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0" }}>Detects spontaneous combustion in goaf and pillars.</p>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: coLimit >= 30 ? "#ea580c" : "#2d6a4f" }}>
                    {coLimit} ppm
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={coLimit}
                  onChange={e => setCoLimit(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#2d6a4f", cursor: "pointer" }}
                />
              </div>

              {/* Auto Power Trip Toggle */}
              <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Hardware Electrical Interlock Relay</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>Instantly de-energizes all non-flameproof substations on telemetry spike.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoPowerTrip(!autoPowerTrip)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: autoPowerTrip ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: autoPowerTrip ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: SECURITY & 2FA ── */}
      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={16} color="#7c3aed" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Authentication & Two-Factor Enforcement</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Two-Factor Authentication (2FA) Required on Login</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>Dispatches statutory 6-digit cryptographic OTP to verified mobile.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: twoFactorEnabled ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: twoFactorEnabled ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Automated Inactivity Screen Lock</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>Locks safety console if left unattended at control desk.</p>
                </div>
                <select
                  value={autoLockMinutes}
                  onChange={e => setAutoLockMinutes(Number(e.target.value))}
                  style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12.5 }}
                >
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: EMERGENCY NOTIFICATIONS & SIRENS ── */}
      {activeTab === "notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Volume2 size={16} color="#dc2626" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Acoustic Siren & Emergency Broadcast Testing</span>
              </div>
              <button
                type="button"
                onClick={testAudioSiren}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
                  background: sirenPlaying ? "#b91c1c" : "#dc2626", color: "white",
                  border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(220,38,38,0.3)"
                }}
              >
                <Radio size={13} /> {sirenPlaying ? "Broadcasting Chirp..." : "Test Audio Siren"}
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              {[
                { key: "smsCritical", label: "Priority Flash SMS to Shift In-Charge", desc: "Sent instantly to overman and electrical supervisor on major alert" },
                { key: "emailAlerts", label: "Statutory DGMS Email Non-Compliance Digest", desc: "Daily automatic log dispatched at the conclusion of Shift C" },
                { key: "pushAlarms", label: "Browser Audio Alarm on Methane > 1.0%", desc: "Triggers loud acoustic siren on safety station control monitor" },
                { key: "shiftReportDigest", label: "Automated Shift Handover Digest", desc: "Summary of equipment status, active actions, and gas trends" },
              ].map(item => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.label}</p>
                    <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs[item.key as keyof typeof notifs] as boolean}
                    onChange={e => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: "#2d6a4f", cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
