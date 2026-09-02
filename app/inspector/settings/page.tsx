"use client";

import {
  Bell, Lock, User, ChevronRight, Save, ShieldCheck,
  CheckCircle, HardHat, QrCode, Cpu, BatteryCharging,
  Wifi, Sparkles, KeyRound, X
} from "lucide-react";
import { useState } from "react";

export default function InspectorSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    highRisk: true,
  });
  const [twoFactor, setTwoFactor] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile Form state
  const [name, setName] = useState("J. Smith");
  const [email, setEmail] = useState("j.smith@mineguard.in");
  const [phone, setPhone] = useState("+91 97654 32109");
  const [station, setStation] = useState("Rajpura Coal Mine – Sector 4");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 780 }}>
      {/* Toast */}
      {saved && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0f2318",
          color: "white",
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
        }}>
          <CheckCircle size={16} color="#52b788" />
          Settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Inspector Profile & Credentials</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Field credentials, equipment calibration records, and alert preferences.</p>
      </div>

      {/* Digital Inspector Badge Card */}
      <div style={{
        background: "linear-gradient(135deg, #0f2318 0%, #1a3d28 100%)",
        borderRadius: 14,
        padding: "20px 24px",
        color: "white",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 16px rgba(15,35,24,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "rgba(82,183,136,0.2)",
            border: "2px solid #52b788",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <HardHat size={28} color="#86efac" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{name}</h3>
              <span style={{ fontSize: 10.5, padding: "2px 8px", background: "#52b788", color: "#0f2318", borderRadius: 10, fontWeight: 700 }}>
                CERTIFIED
              </span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              ID: <strong>EMP-10042</strong> · DGMS Mining Safety Inspector #INSP-2021-88
            </p>
            <p style={{ fontSize: 11.5, color: "#86efac", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={13} /> Clearance: Underground Tier 3 & Surface Blasting Zones
            </p>
          </div>
        </div>

        {/* Mock QR Verification */}
        <div style={{ background: "white", padding: 8, borderRadius: 8, textAlign: "center" }}>
          <QrCode size={48} color="#0f2318" />
          <p style={{ fontSize: 8.5, fontWeight: 700, color: "#0f2318", marginTop: 2 }}>VERIFY ID</p>
        </div>
      </div>

      {/* Equipment Health & Field Hardware */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Cpu size={16} color="#2d6a4f" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Field Hardware & Device Health</span>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Multi-Gas Detector", stat: "Calibrated", sub: "Valid till Nov 2025", color: "#16a34a", bg: "#f0fdf4" },
            { label: "Inspection Tablet", stat: "Battery 92%", sub: "Local DB Synced", color: "#2563eb", bg: "#eff6ff" },
            { label: "Thermal Imaging Unit", stat: "Ready", sub: "Firmware v4.12", color: "#16a34a", bg: "#f0fdf4" },
          ].map(eq => (
            <div key={eq.label} style={{ padding: "12px", borderRadius: 8, background: eq.bg, border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{eq.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: eq.color, marginTop: 4 }}>{eq.stat}</p>
              <p style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>{eq.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <User size={16} color="#2d6a4f" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Inspector Contact & Assignment</span>
        </div>
        <div style={{ padding: "18px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Phone Number</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Primary Mine Station</label>
              <input
                value={station}
                onChange={e => setStation(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={16} color="#ea580c" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Field Alerts & Notification Channels</span>
        </div>
        <div style={{ padding: "14px 20px" }}>
          {[
            { key: "highRisk", label: "Critical High Risk SMS Alerts", desc: "Instant SMS for CO2 spikes, seismic warnings, or rock-burst indicators" },
            { key: "email",    label: "Inspection Dispatch Email",      desc: "Receive daily checklist schedule and signed compliance reports" },
            { key: "push",     label: "Tablet Push Notifications",     desc: "Sound alert on field tablet when corrective actions are updated" },
            { key: "sms",      label: "Toolbox Meeting Reminders",      desc: "SMS alert 15 minutes before shift morning briefings" },
          ].map(n => {
            const active = notifications[n.key as keyof typeof notifications];
            return (
              <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f9fafb" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{n.label}</p>
                  <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{n.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !active }))}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    background: active ? "#2d6a4f" : "#d1d5db",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute",
                    top: 2,
                    left: active ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={16} color="#dc2626" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Device Security & Authentication</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Two-Factor Authentication (Biometric / OTP)</p>
              <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>Mandatory for logging regulatory citations and hazard certificates</p>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactor(!twoFactor)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: twoFactor ? "#2d6a4f" : "#d1d5db",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute",
                top: 2,
                left: twoFactor ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 14px",
              background: "#f9fafb",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <KeyRound size={15} color="#6b7280" /> Change Security Password
            </span>
            <ChevronRight size={14} color="#9ca3af" />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "12px 24px",
          background: "#2d6a4f",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
        }}
      >
        <Save size={16} /> Save Changes
      </button>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{ background: "white", borderRadius: 14, maxWidth: 420, width: "100%", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 20px", background: "#0f2318", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={16} color="#52b788" />
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Update Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setPasswordSuccess(true);
              setTimeout(() => {
                setPasswordSuccess(false);
                setShowPasswordModal(false);
              }, 2000);
            }} style={{ padding: 20 }}>
              {passwordSuccess && (
                <div style={{ padding: "10px", background: "#dcfce7", color: "#16a34a", fontSize: 12.5, fontWeight: 600, borderRadius: 6, marginBottom: 14, border: "1px solid #86efac" }}>
                  ✓ Password changed successfully!
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Current Password</label>
                <input type="password" required placeholder="••••••••" style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>New Password</label>
                <input type="password" required placeholder="••••••••" style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: "9px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: "9px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
