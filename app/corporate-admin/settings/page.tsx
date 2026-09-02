"use client";
import { Settings, Bell, Lock, User, Database, ChevronRight, Save, Globe } from "lucide-react";
import { useState } from "react";

export default function CorporateSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: true, push: true });
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Settings</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Manage your account preferences and corporate configuration.</p>
      </div>

      {saved && (
        <div style={{ padding: "12px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 9, marginBottom: 20, fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Profile */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <User size={16} color="#2d6a4f" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Profile</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {[
            { label: "Full Name",    value: "Corporate Admin",          type: "text" },
            { label: "Email",        value: "admin@mineguard.in",       type: "email" },
            { label: "Role",         value: "Corporate Administrator",  type: "text" },
            { label: "Organisation", value: "MineGuard Operations Ltd", type: "text" },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{s.label}</label>
              <input type={s.type} defaultValue={s.value} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Globe size={16} color="#2563eb" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Portfolio Settings</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {[
            { label: "Default Mine View",     value: "All Mines", type: "text" },
            { label: "Reporting Currency",    value: "INR (₹)",   type: "text" },
            { label: "Default Date Range",    value: "Last 30 days", type: "text" },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{s.label}</label>
              <input type={s.type} defaultValue={s.value} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={16} color="#ea580c" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Notifications</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {([
            { key: "email", label: "Email Alerts",  desc: "Get notified by email for critical compliance events" },
            { key: "sms",   label: "SMS Alerts",    desc: "Receive SMS for high-severity cross-site violations" },
            { key: "push",  label: "Push Alerts",   desc: "Real-time browser push notifications" },
          ] as const).map(n => (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f9fafb" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{n.label}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{n.desc}</p>
              </div>
              <button onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: notifications[n.key] ? "#2d6a4f" : "#d1d5db", position: "relative", transition: "background 0.2s" }}>
                <span style={{ position: "absolute", top: 2, left: notifications[n.key] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={16} color="#dc2626" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Security</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Two-Factor Authentication</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Required for all admin accounts</p>
            </div>
            <button onClick={() => setTwoFactor(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: twoFactor ? "#2d6a4f" : "#d1d5db", position: "relative", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: 2, left: twoFactor ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", fontWeight: 500, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "9px 14px", cursor: "pointer", width: "100%", justifyContent: "space-between" }}>
            Change Password <ChevronRight size={14} color="#9ca3af" />
          </button>
        </div>
      </div>

      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", background: "#1a3d28", color: "white", border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
        <Save size={15} /> Save Changes
      </button>
    </div>
  );
}
