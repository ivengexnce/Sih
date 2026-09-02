"use client";

import React, { useState, useEffect } from "react";
import {
  User, Building2, Bell, Shield, Sliders, Volume2, Save,
  CheckCircle2, Smartphone, Key, Lock, RefreshCw, AlertTriangle,
  Zap, Check, Gauge, HardHat, FileBadge, Radio, Download, Clock,
  Wind, Flame, ShieldAlert, Cpu
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

  // Shift & Handover Timing
  const [shiftDigest, setShiftDigest] = useState(true);
  const [selectedShift, setSelectedShift] = useState("Shift A (06:00 - 14:00)");

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
        if (parsed.session) setSession(parsed.session);
      }
    } catch (e) {}
  }, []);

  const handleCollieryChange = (newMineName: string) => {
    const updated = { ...session, allocatedMine: newMineName };
    setSession(updated);
    const prof = getCollieryProfile(newMineName);
    setColliery(prof);
    try {
      const sess = storageService.getCurrentSession();
      if (sess) {
        storageService.saveCurrentSession({ ...sess, allocatedMine: newMineName });
      }
    } catch (e) {}
  };

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

      const sess = storageService.getCurrentSession();
      if (sess) {
        storageService.saveCurrentSession({
          ...sess,
          name: session.name,
          designation: session.designation,
          allocatedMine: session.allocatedMine,
          phone: session.phone
        });
      }
    } catch (e) {}

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportConfig = () => {
    const payload = {
      session,
      colliery,
      telemetry: { methaneLimit, coLimit, minAirVelocity, autoPowerTrip },
      security: { twoFactorEnabled, autoLockMinutes, auditLogging },
      notifications: notifs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mineguard_colliery_settings_${session.allocatedMine.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 940, margin: "0 auto", position: "relative" }}>
      {/* Toast Notification */}
      {saved && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#52b788" />
          <span>Settings & Colliery Telemetry Parameters synchronized!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "#2d6a4f", background: "#e8f5ee", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>
              First Class Colliery Manager
            </span>
            <span style={{ fontSize: 11.5, color: "#64748b" }}>Statutory Command Console</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0", letterSpacing: "-0.01em" }}>
            Colliery Configuration & Officer Settings
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0 0" }}>
            Statutory credentials, real-time telemetry trip thresholds, gassiness parameters, and cybersecurity controls.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleExportConfig}
            title="Export Local Settings to JSON"
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
              background: "white", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 8,
              fontSize: 12.5, fontWeight: 600, cursor: "pointer"
            }}
          >
            <Download size={14} /> Export Config
          </button>
          <button
            onClick={handleSaveAll}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
              background: "#2d6a4f", color: "white", border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
              transition: "background 0.15s"
            }}
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10,
        marginBottom: 22, border: "1px solid #e2e8f0"
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
                padding: "9px 10px",
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
          {/* Officer Hero Banner */}
          <div style={{
            background: "linear-gradient(135deg, #091d12 0%, #1a3d28 100%)",
            borderRadius: 14,
            padding: "20px 24px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(9,29,18,0.2)",
            border: "1px solid rgba(82,183,136,0.25)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(82,183,136,0.2)",
                border: "2px solid #52b788",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <HardHat size={28} color="#86efac" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{session.name}</h3>
                  <span style={{ fontSize: 10.5, padding: "2px 8px", background: "#52b788", color: "#091d12", borderRadius: 10, fontWeight: 800 }}>
                    FCC LICENSED
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", margin: "3px 0 0 0" }}>
                  {session.designation} · {session.allocatedMine}
                </p>
                <p style={{ fontSize: 11.5, color: "#86efac", margin: "4px 0 0 0" }}>
                  DGMS Cert: <strong>{session.dgmsCertNo}</strong>
                </p>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Jurisdiction</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#86efac", margin: "2px 0 0 0" }}>{colliery.subsidiary} Sector</p>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
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
                  Official Email Address
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
                  Verified Mobile (10 Digits)
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
                DGMS First Class Manager's Certificate of Competency (FCC)
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="text"
                  value={session.dgmsCertNo}
                  onChange={e => setSession({ ...session, dgmsCertNo: e.target.value })}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
                <span style={{ padding: "8px 12px", background: "#f0fdf4", color: "#16a34a", borderRadius: 6, fontSize: 12, fontWeight: 700, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} /> DGMS Validated
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: COLLIERY BEAT ── */}
      {activeTab === "colliery" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                Switch Active Operational Colliery Beat
              </label>
              <select
                value={session.allocatedMine}
                onChange={e => handleCollieryChange(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #93c5fd", fontSize: 13.5, fontWeight: 700, color: "#1e3a8a", background: "#eff6ff" }}
              >
                <option value="Rajpura Coal Mine (SECL)">Rajpura Coal Mine (SECL - Underground Level 3)</option>
                <option value="Moonidih Coal Washery & Mine (BCCL)">Moonidih Coal Mine (BCCL - Jharia Coalfield)</option>
                <option value="Gevra Mega Open Cast (SECL)">Gevra Mega Open Cast (SECL - Korba Coalfield)</option>
                <option value="Raniganj Deep Horizon (ECL)">Raniganj Deep Horizon (ECL - Raniganj Coalfield)</option>
                <option value="Talcher Underground (MCL)">Talcher Underground (MCL - Mahanadi Coalfield)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Subsidiary & Coalfield</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "4px 0 0 0" }}>{colliery.subsidiary} · {colliery.coalfield}</p>
              </div>

              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Mining Method</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "4px 0 0 0" }}>{colliery.type}</p>
              </div>

              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Gassiness Classification</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "4px 0 0 0" }}>{colliery.gassiness}</p>
              </div>
            </div>

            {/* Shift Timings */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>
                Active Production Shift & Handover Schedule
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { name: "Shift A (Morning)", time: "06:00 - 14:00 IST", overman: "Overman R. Pandey" },
                  { name: "Shift B (Evening)", time: "14:00 - 22:00 IST", overman: "Overman S. Soren" },
                  { name: "Shift C (Night)",   time: "22:00 - 06:00 IST", overman: "Overman M. Kujur" },
                ].map(s => (
                  <div key={s.name} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>{s.name}</p>
                    <p style={{ margin: "2px 0", fontSize: 11.5, color: "#64748b" }}>{s.time}</p>
                    <span style={{ fontSize: 11, color: "#2d6a4f", fontWeight: 600 }}>{s.overman}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: TELEMETRY SENSORS & ALARMS ── */}
      {activeTab === "telemetry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>
                  Statutory Gas & Ventilation Trip Parameters (CMR Reg 153)
                </h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>
                  Fine-tune automatic power trip relay triggers and alert levels.
                </p>
              </div>
              <span style={{ fontSize: 11.5, background: "#ecfdf5", color: "#059669", padding: "3px 10px", borderRadius: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} /> SCADA Linked
              </span>
            </div>

            {/* Methane Slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Continuous Methane (CH₄) Power Trip Limit</span>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0" }}>
                    Standard DGMS CMR 153 limit is 1.00% CH₄. Values &gt; 1.25% trigger mandatory evacuation.
                  </p>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: methaneLimit >= 1.0 ? "#dc2626" : "#2d6a4f" }}>
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
                <span>0.75% (Alert)</span>
                <span>1.00% (Trip Cutoff)</span>
                <span>1.50% (High Risk)</span>
              </div>
            </div>

            {/* Carbon Monoxide Slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Carbon Monoxide (CO) Spontaneous Combustion Alert</span>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0" }}>
                    Threshold to detect early oxidation in old goaf workings.
                  </p>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: coLimit >= 30 ? "#ea580c" : "#2d6a4f" }}>
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

            {/* Air Velocity Slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Minimum Return Airway Velocity</span>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0" }}>
                    CMR Reg 158 mandates adequate airflow at the last ventilation connection.
                  </p>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: minAirVelocity < 0.5 ? "#dc2626" : "#2d6a4f" }}>
                  {minAirVelocity.toFixed(2)} m/s
                </span>
              </div>
              <input
                type="range"
                min="0.25"
                max="1.50"
                step="0.05"
                value={minAirVelocity}
                onChange={e => setMinAirVelocity(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#2d6a4f", cursor: "pointer" }}
              />
            </div>

            {/* Hardware Interlock Relay Toggle */}
            <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Hardware Electrical Substation Interlock</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                  Instantly trips underground feeder breaker on gas spikes exceeding cutoff limit.
                </p>
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
      )}

      {/* ── TAB 4: SECURITY & 2FA ── */}
      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px 0" }}>
              Authentication & Session Cybersecurity
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Mandatory 2FA OTP for Shift Command</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                  Dispatches cryptographically signed 6-digit statutory OTP to registered phone ({session.phone}).
                </p>
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
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Control Desk Inactivity Lock</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                  Automatically locks colliery telemetry consoles when left unattended.
                </p>
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
      )}

      {/* ── TAB 5: EMERGENCY SIRENS & BROADCASTS ── */}
      {activeTab === "notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>Colliery Acoustic Siren & Broadcast Testing</h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>Test synthesized audio siren and verify statutory notification routes.</p>
              </div>
              <button
                type="button"
                onClick={testAudioSiren}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: sirenPlaying ? "#b91c1c" : "#dc2626", color: "white",
                  border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(220,38,38,0.3)"
                }}
              >
                <Radio size={13} /> {sirenPlaying ? "Broadcasting Chirp..." : "Test Audio Siren"}
              </button>
            </div>

            {[
              { key: "smsCritical", label: "Priority Flash SMS to Shift Overman & Safety Cadres", desc: "Instantly alerts electrical supervisor and ventilation officer on major breach" },
              { key: "emailAlerts", label: "Statutory Daily DGMS Non-Compliance Digest", desc: "Automated report compiled and emailed at 23:59 IST" },
              { key: "pushAlarms", label: "Browser Loud Acoustic Alarm on Methane > 1.0%", desc: "Triggers siren tone directly on control room terminal" },
              { key: "shiftReportDigest", label: "Overman Shift Change Handover Summary", desc: "Dispatched to incoming shift supervisor with active hazard queue" },
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
      )}
    </div>
  );
}
