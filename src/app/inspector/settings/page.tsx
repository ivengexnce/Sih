"use client";

import React, { useState, useEffect } from "react";
import {
  HardHat, QrCode, Cpu, BatteryCharging, Wifi, Sparkles, KeyRound,
  ShieldCheck, AlertTriangle, Save, CheckCircle2, Sliders, Bell,
  FileCheck, Radio, RefreshCw, Download, Database, Check, Phone, Mail
} from "lucide-react";
import { storageService } from "@/lib/storage";

export default function InspectorSettingsPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "hardware" | "regulations" | "dispatch" | "offline_sync">("credentials");
  const [saved, setSaved] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);

  // 1. Field Credentials
  const [inspector, setInspector] = useState({
    name: "Er. J. Smith, M.Tech (Mining)",
    empId: "INSP-DGMS-10042",
    warrantNo: "DGMS/EZ/SZ/2021-88",
    email: "j.smith@mineguard.in",
    phone: "9765432109",
    assignedBeat: "Rajpura Coal Mine – Sector 4 (Underground L-3 & Pit Sec A)",
    jurisdictionCadre: "Senior Inspector of Mines (Safety & Health)",
    warrantExpiry: "March 31, 2028"
  });

  // 2. Portable IoT Hardware Calibration
  const [hardware, setHardware] = useState({
    gasDetectorModel: "Industrial Scientific MX6 iBrid (Intrinsically Safe Ex ia)",
    lastGasCalibration: "May 12, 2025",
    nextGasDue: "Jun 12, 2025 (Within Grace Period)",
    thermalCamera: "FLIR GF77a Gas Find IR Camera",
    anemometerCalibrated: true,
    radioChannel: "Channel 4 (VHF 156.800 MHz - Colliery Distress)",
    batteryHealthPct: 94
  });

  // 3. Statutory Checklist Preferences
  const [rules, setRules] = useState({
    enforceCMR2017: true,
    mandatoryPhotoEvidence: true,
    autoDraftStopWorkNotice: true,
    strictVentilationCheck: true,
    minAirVelocityThreshold: 0.5,
    maxPermissibleMethane: 0.75
  });

  // 4. Emergency Dispatch & Geofencing
  const [dispatch, setDispatch] = useState({
    blastingRadiusMeters: 500,
    emergencySmsBroadcast: true,
    pushAudioAlarm: true,
    autoGeofenceTracking: true
  });

  // 5. Offline Cache
  const [offlineDraftCount, setOfflineDraftCount] = useState(3);
  const [lastSyncTime, setLastSyncTime] = useState("Today, 02:55 AM");

  useEffect(() => {
    try {
      const sess = storageService.getCurrentSession();
      if (sess?.name) setInspector(p => ({ ...p, name: sess.name || p.name }));
      if (sess?.allocatedMine) setInspector(p => ({ ...p, assignedBeat: sess.allocatedMine }));

      const stored = localStorage.getItem("mineguard_inspector_settings");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.inspector) setInspector(p.inspector);
        if (p.hardware) setHardware(p.hardware);
        if (p.rules) setRules(p.rules);
        if (p.dispatch) setDispatch(p.dispatch);
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("mineguard_inspector_settings", JSON.stringify({ inspector, hardware, rules, dispatch }));
    } catch (e) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTriggerSync = () => {
    setOfflineDraftCount(0);
    setLastSyncTime("Just now (All 3 offline inspection records uploaded)");
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
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (err) {}
    setTimeout(() => setSirenPlaying(false), 700);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 940, margin: "0 auto", position: "relative" }}>
      {/* Toast */}
      {saved && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#52b788" />
          <span>Inspector profile and statutory field parameters updated!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "#2d6a4f", background: "#e8f5ee", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>
              Field Inspection Suite
            </span>
            <span style={{ fontSize: 11.5, color: "#64748b" }}>DGMS Mines Act 1952 Enforcement</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0", letterSpacing: "-0.01em" }}>
            Inspector Profile, Hardware & Statutory Settings
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0 0" }}>
            Statutory warrant credentials, IoT multi-gas sensor calibration, and CMR 2017 field protocol configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
            background: "#2d6a4f", color: "white", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
            transition: "background 0.15s"
          }}
        >
          <Save size={15} /> Save Settings
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10,
        marginBottom: 20, border: "1px solid #e2e8f0"
      }}>
        {[
          { id: "credentials", label: "Statutory Badge", icon: HardHat },
          { id: "hardware",    label: "IoT Calibrations",icon: Cpu },
          { id: "regulations", label: "CMR 2017 Rules",  icon: FileCheck },
          { id: "dispatch",    label: "Sirens & Alerts", icon: Bell },
          { id: "offline_sync",label: "Offline Sync",    icon: Database },
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

      {/* ── TAB 1: CREDENTIALS & DIGITAL BADGE ── */}
      {activeTab === "credentials" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Digital Badge Hero */}
          <div style={{
            background: "linear-gradient(135deg, #091d12 0%, #173824 100%)",
            borderRadius: 14,
            padding: "22px 26px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 24px rgba(9,29,18,0.25)",
            border: "1px solid rgba(82,183,136,0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "rgba(82,183,136,0.2)",
                border: "2.5px solid #52b788",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(82,183,136,0.3)"
              }}>
                <HardHat size={32} color="#86efac" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{inspector.name}</h3>
                  <span style={{ fontSize: 11, padding: "2px 8px", background: "#52b788", color: "#091d12", borderRadius: 10, fontWeight: 800 }}>
                    DGMS AUTHORIZED
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", margin: "3px 0 0 0" }}>
                  Emp ID: <strong>{inspector.empId}</strong> · Warrant: <strong>{inspector.warrantNo}</strong>
                </p>
                <p style={{ fontSize: 11.5, color: "#86efac", margin: "4px 0 0 0" }}>
                  Assigned Beat: {inspector.assignedBeat}
                </p>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Warrant Valid Until</span>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#86efac", margin: "2px 0 0 0" }}>{inspector.warrantExpiry}</p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>Inspector Full Name</label>
                <input
                  type="text"
                  value={inspector.name}
                  onChange={e => setInspector({ ...inspector, name: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>Official Email</label>
                <input
                  type="email"
                  value={inspector.email}
                  onChange={e => setInspector({ ...inspector, email: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>Registered 10-Digit Mobile</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={inspector.phone}
                  onChange={e => setInspector({ ...inspector, phone: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>Assigned Colliery Beat</label>
                <input
                  type="text"
                  value={inspector.assignedBeat}
                  onChange={e => setInspector({ ...inspector, assignedBeat: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PORTABLE IOT HARDWARE ── */}
      {activeTab === "hardware" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px 0" }}>
              Intrinsically Safe Handheld Equipment Calibration
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div style={{ padding: "14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", margin: "0 0 4px 0" }}>Multi-Gas Detector Model</p>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{hardware.gasDetectorModel}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#64748b", marginTop: 8 }}>
                  <span>Last Bump Test: <strong>{hardware.lastGasCalibration}</strong></span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>Next: {hardware.nextGasDue}</span>
                </div>
              </div>

              <div style={{ padding: "14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", margin: "0 0 4px 0" }}>Thermal Infrared Optical Device</p>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{hardware.thermalCamera}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#64748b", marginTop: 8 }}>
                  <span>Firmware: <strong>v2.8.4 (Ex Certified)</strong></span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>Battery: {hardware.batteryHealthPct}%</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                Emergency VHF Radio Distress Channel
              </label>
              <input
                type="text"
                value={hardware.radioChannel}
                onChange={e => setHardware({ ...hardware, radioChannel: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CMR 2017 REGULATIONS ── */}
      {activeTab === "regulations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px 0" }}>
              Statutory Inspection Enforcement Rules
            </h3>

            {[
              { key: "enforceCMR2017", label: "Automated CMR 2017 Regulation Cross-Mapping", desc: "Maps hazards to Coal Mines Regulations 2017 clauses (Reg 153, 158, 104)" },
              { key: "mandatoryPhotoEvidence", label: "Mandatory Geotagged Photo for High-Severity Infractions", desc: "Requires at least 1 verified camera image before logging high-risk violation" },
              { key: "autoDraftStopWorkNotice", label: "Auto-Draft Provisional Prohibition Notice (Sec 22 Mines Act)", desc: "Generates legal draft when toxic methane or spontaneous heating crosses limit" },
              { key: "strictVentilationCheck", label: "Strict Underground Air Velocity Threshold (< 0.5 m/s Trigger)", desc: "Flags auxiliary fan duct failures immediately" },
            ].map(item => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{item.label}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRules({ ...rules, [item.key]: !rules[item.key as keyof typeof rules] })}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: rules[item.key as keyof typeof rules] ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: rules[item.key as keyof typeof rules] ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: SIRENS & DISPATCH ── */}
      {activeTab === "dispatch" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>Evacuation Siren & Blasting Perimeter</h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>Test local acoustic siren and configure safety broadcast radiuses.</p>
              </div>
              <button
                type="button"
                onClick={testAudioSiren}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: sirenPlaying ? "#b91c1c" : "#dc2626", color: "white",
                  border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                <Radio size={13} /> {sirenPlaying ? "Siren Active..." : "Test Audio Siren"}
              </button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                Controlled Blasting Exclusion Radius: <strong>{dispatch.blastingRadiusMeters} meters</strong>
              </label>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={dispatch.blastingRadiusMeters}
                onChange={e => setDispatch({ ...dispatch, blastingRadiusMeters: Number(e.target.value) })}
                style={{ width: "100%", accentColor: "#dc2626" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: OFFLINE SYNC ── */}
      {activeTab === "offline_sync" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>Offline Field Inspection Cache</h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>Allows logging inspections deep underground without cellular signal.</p>
              </div>
              <button
                type="button"
                onClick={handleTriggerSync}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: "#2d6a4f", color: "white", border: "none", borderRadius: 8,
                  fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                <RefreshCw size={13} /> Force Sync to DGMS
              </button>
            </div>

            <div style={{ padding: "14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Pending Local Inspection Drafts:</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: offlineDraftCount > 0 ? "#ea580c" : "#16a34a" }}>
                  {offlineDraftCount} Drafts
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "#64748b", margin: "6px 0 0 0" }}>Last Gateway Synchronization: {lastSyncTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
