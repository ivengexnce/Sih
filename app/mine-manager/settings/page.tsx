"use client";

import { useState, useEffect } from "react";
import { Settings, Bell, Shield, User, Database, Globe, Lock, ChevronRight, Save, Building2 } from "lucide-react";
import { storageService } from "@/lib/storage";
import { getCollieryProfile, CollieryProfile } from "@/lib/collieryData";

export default function SettingsPage() {
  const [session, setSession] = useState({
    name: "Rajesh Sharma",
    email: "r.sharma@mineguard.in",
    phone: "+91 98765 43210",
    designation: "First Class Mine Manager",
    allocatedMine: "Rajpura Coal Mine (SECL)"
  });
  const [colliery, setColliery] = useState<CollieryProfile>(getCollieryProfile("rajpura"));
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const [twoFactor, setTwoFactor] = useState(true);

  useEffect(() => {
    try {
      const sess = storageService.getCurrentSession();
      if (sess) {
        setSession({
          name: sess.name || "Rajesh Sharma",
          email: sess.email || "r.sharma@mineguard.in",
          phone: "+91 98765 43210",
          designation: sess.designation || "First Class Mine Manager",
          allocatedMine: sess.allocatedMine || "Rajpura Coal Mine (SECL)"
        });
        setColliery(getCollieryProfile(sess.allocatedMine));
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 740 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Portal Settings & Colliery Profile</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
          Manage your statutory account credentials and allocated colliery beat configuration.
        </p>
      </div>

      {saved && (
        <div style={{ padding: "12px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 9, marginBottom: 20, fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
          ✓ Profile settings saved successfully to local and cloud storage!
        </div>
      )}

      {/* User Profile Card */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <User size={16} color="#2d6a4f" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Officer Identification</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
            <input
              type="text"
              value={session.name}
              onChange={e => setSession({ ...session, name: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa" }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Official Email Address</label>
            <input
              type="email"
              value={session.email}
              readOnly
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#6b7280", background: "#f3f4f6" }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Official Designation</label>
            <input
              type="text"
              value={session.designation}
              onChange={e => setSession({ ...session, designation: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#111827", background: "#fafafa" }}
            />
          </div>
        </div>
      </div>

      {/* Allocated Colliery Profile */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={16} color="#2563eb" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Allocated Colliery Site</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Statutory Allocated Mine</label>
            <input
              type="text"
              value={session.allocatedMine}
              readOnly
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #93c5fd", borderRadius: 8, fontSize: 13, color: "#1e3a8a", background: "#eff6ff", fontWeight: 700 }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Subsidiary & Coalfield</label>
              <input
                type="text"
                value={`${colliery.subsidiary} · ${colliery.coalfield}`}
                readOnly
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#6b7280", background: "#f3f4f6" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Mine Type & Gassiness Degree</label>
              <input
                type="text"
                value={`${colliery.type} · ${colliery.gassiness}`}
                readOnly
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#6b7280", background: "#f3f4f6" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={16} color="#d97706" />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Critical Gas & Telemetry Notifications</span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {[
            { key: "email", label: "Email Alerts for Violations", desc: "Instant alert on high-severity DGMS infractions" },
            { key: "push",  label: "Live CH₄/CO Threshold Alerts", desc: "Push notification when sensor crosses 1.0% CH₄ or 25 ppm CO" },
            { key: "sms",   label: "SMS Emergency Evacuation Alerts", desc: "Flash SMS to statutory mine managers during strata or gas alerts" },
          ].map(n => (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f9fafb" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{n.label}</p>
                <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{n.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[n.key as keyof typeof notifications]}
                onChange={e => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: "#2d6a4f", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
      >
        <Save size={15} /> Save Changes
      </button>
    </div>
  );
}
