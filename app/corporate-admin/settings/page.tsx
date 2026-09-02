"use client";

import React, { useState, useEffect } from "react";
import {
  Building2, Shield, Sliders, Bell, Database, Key, Globe,
  CheckCircle2, AlertTriangle, Save, RefreshCw, Download, Upload,
  Cpu, Lock, Server, Check, Activity, Users, FileText, ChevronRight
} from "lucide-react";

export default function CorporateSettingsPage() {
  const [activeTab, setActiveTab] = useState<"organization" | "governance" | "ai_engine" | "dgms_sync" | "audit_logs">("organization");
  const [saved, setSaved] = useState(false);

  // 1. Organization & Subsidiaries
  const [orgData, setOrgData] = useState({
    orgName: "Coal India Limited (CIL) - Safety Directorate",
    adminName: "Dr. Vikramaditya Sen, IAS",
    adminEmail: "v.sen.director@coalindia.gov.in",
    adminPhone: "9810123456",
    headquarters: "Coal Bhawan, Premise 04-MAR, Action Area 1A, New Town, Kolkata 700156",
    activeSubsidiaries: ["SECL", "BCCL", "CCL", "MCL", "ECL", "WCL", "NCL"],
    defaultCurrency: "INR (₹)",
    fiscalYearStart: "April 1st",
    activeBeatCount: 42
  });

  // 2. Security & Governance
  const [govData, setGovData] = useState({
    enforce2FA: true,
    sessionTimeoutMins: 15,
    maxLoginAttempts: 3,
    ipWhitelisting: true,
    ipRange: "10.142.0.0/16, 164.100.0.0/16 (Govt NIC)",
    autoLockScreen: true,
    requirePasswordChangeDays: 90
  });

  // 3. AI Risk Engine & Analytics
  const [aiData, setAiData] = useState({
    modelEnsemble: "MineGuard Neural-Risk v4.2 (DGMS CMR Fine-Tuned)",
    ingestionIntervalSec: 15,
    confidenceThresholdPct: 88,
    ocrEngine: "Tesseract 5.3 + EasyOCR Multi-Scale Ensemble",
    autoEscalateSeverity: true,
    escalationHours: 24,
    anomalyDetectionSensors: ["CH4", "CO", "Air Velocity", "Strata Vibration", "Haul Road Radar"]
  });

  // 4. DGMS Regulatory Gateway
  const [dgmsData, setDgmsData] = useState({
    apiEndpoint: "https://dgms.gov.in/api/v2/incident-exchange",
    gatewayKey: "dgms_live_sec_89f0291ba48c4091e8",
    autoSubmitFormIV: true,
    complianceAuditCron: "Daily at 23:59 IST",
    lastSuccessfulSync: "Today, 02:45 AM (All 42 mines synced)"
  });

  // 5. Live Audit Trail
  const [auditLogs, setAuditLogs] = useState([
    { id: "AUD-9912", timestamp: "Today, 03:14 AM", user: "Dr. Vikramaditya Sen", action: "Updated CMR 153 Methane alarm threshold to 1.0%", ip: "164.100.24.11 (NIC-Kolkata)", status: "Verified" },
    { id: "AUD-9911", timestamp: "Yesterday, 18:30 PM", user: "Corporate Admin", action: "Assigned Mine Manager Rajesh Sharma to Rajpura Mine", ip: "164.100.24.11 (NIC-Kolkata)", status: "Verified" },
    { id: "AUD-9910", timestamp: "May 19, 2025", user: "Safety Directorate", action: "Synced DGMS Circular 02/2024 compliance mandates", ip: "10.142.8.44 (DGMS-Dhanbad Gateway)", status: "System" },
    { id: "AUD-9909", timestamp: "May 18, 2025", user: "Dr. Vikramaditya Sen", action: "Enforced mandatory 10-digit mobile 2FA protocol", ip: "164.100.24.11 (NIC-Kolkata)", status: "Verified" },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mineguard_corp_settings");
      if (stored) {
        const p = JSON.parse(stored);
        if (p.orgData) setOrgData(p.orgData);
        if (p.govData) setGovData(p.govData);
        if (p.aiData) setAiData(p.aiData);
        if (p.dgmsData) setDgmsData(p.dgmsData);
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("mineguard_corp_settings", JSON.stringify({ orgData, govData, aiData, dgmsData }));
      
      const newLog = {
        id: `AUD-${Math.floor(9913 + Math.random() * 80)}`,
        timestamp: "Just now",
        user: orgData.adminName,
        action: `Modified corporate ${activeTab} configurations`,
        ip: "164.100.24.11 (NIC-Kolkata)",
        status: "Verified"
      };
      setAuditLogs([newLog, ...auditLogs]);
    } catch (e) {}

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportConfig = () => {
    const configBlob = new Blob([JSON.stringify({ orgData, govData, aiData, dgmsData }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(configBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mineguard_corporate_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 960, margin: "0 auto", position: "relative" }}>
      {/* Toast Notification */}
      {saved && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#52b788" />
          <span>Corporate & Subsidiary Governance parameters saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "#2d6a4f", background: "#e8f5ee", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>
              Enterprise HQ Suite
            </span>
            <span style={{ fontSize: 11.5, color: "#64748b" }}>CIL Apex Safety Authority</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "4px 0 0 0", letterSpacing: "-0.01em" }}>
            Corporate Governance & System Configuration
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0 0" }}>
            Cross-subsidiary policy enforcement, DGMS statutory gateway sync, AI model thresholds, and security parameters.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleExportConfig}
            title="Export JSON Configuration"
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
              background: "white", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 8,
              fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}
          >
            <Download size={14} /> Export Config
          </button>
          <button
            onClick={handleSave}
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

      {/* Modern Navigation Tabs */}
      <div style={{
        display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10,
        marginBottom: 22, border: "1px solid #e2e8f0"
      }}>
        {[
          { id: "organization", label: "Organization & CIL", icon: Building2 },
          { id: "governance",   label: "Security & Policy",  icon: Shield },
          { id: "ai_engine",    label: "AI Risk Models",     icon: Cpu },
          { id: "dgms_sync",    label: "DGMS Gateway",       icon: Server },
          { id: "audit_logs",   label: "Immutable Audit Log",icon: Activity },
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

      {/* ── TAB 1: ORGANIZATION & SUBSIDIARIES ── */}
      {activeTab === "organization" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Building2 size={16} color="#2d6a4f" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Apex Directorate Profile</span>
              </div>
              <span style={{ fontSize: 11.5, background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                42 Collieries Under Jurisdiction
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Directorate / Ministry Entity
                  </label>
                  <input
                    type="text"
                    value={orgData.orgName}
                    onChange={e => setOrgData({ ...orgData, orgName: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Apex Safety Director
                  </label>
                  <input
                    type="text"
                    value={orgData.adminName}
                    onChange={e => setOrgData({ ...orgData, adminName: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Govt. Email Address
                  </label>
                  <input
                    type="email"
                    value={orgData.adminEmail}
                    onChange={e => setOrgData({ ...orgData, adminEmail: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Registered Mobile (Emergency Hotlink)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={orgData.adminPhone}
                    onChange={e => setOrgData({ ...orgData, adminPhone: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  National Headquarters Address
                </label>
                <input
                  type="text"
                  value={orgData.headquarters}
                  onChange={e => setOrgData({ ...orgData, headquarters: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              {/* Monitored Coal Subsidiaries Badges */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 8 }}>
                  Active CIL Subsidiaries Supervised
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {orgData.activeSubsidiaries.map(sub => (
                    <div key={sub} style={{
                      padding: "6px 14px", borderRadius: 8, background: "#f0fdf4",
                      border: "1px solid #bbf7d0", color: "#166534", fontSize: 12.5,
                      fontWeight: 700, display: "flex", alignItems: "center", gap: 6
                    }}>
                      <Check size={13} /> {sub}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GOVERNANCE & SECURITY ── */}
      {activeTab === "governance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={16} color="#7c3aed" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Corporate Security & Access Control</span>
            </div>

            <div style={{ padding: "20px" }}>
              {/* 2FA Enforcement */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Mandatory 10-Digit Mobile 2FA for All Staff</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                    Enforces one-time statutory password delivery and verifies valid Indian mobile series (6/7/8/9).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGovData({ ...govData, enforce2FA: !govData.enforce2FA })}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: govData.enforce2FA ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: govData.enforce2FA ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>

              {/* IP Whitelisting */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>National Informatics Centre (NIC) IP Boundary</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>Restricts apex administration consoles to authorized government intranet CIDRs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGovData({ ...govData, ipWhitelisting: !govData.ipWhitelisting })}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: govData.ipWhitelisting ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: govData.ipWhitelisting ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>

              <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Session Inactivity Auto-Lock
                  </label>
                  <select
                    value={govData.sessionTimeoutMins}
                    onChange={e => setGovData({ ...govData, sessionTimeoutMins: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value={5}>5 Minutes (Maximum Security)</option>
                    <option value={15}>15 Minutes (Recommended)</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Max Failed Password Attempts
                  </label>
                  <select
                    value={govData.maxLoginAttempts}
                    onChange={e => setGovData({ ...govData, maxLoginAttempts: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value={3}>3 Attempts (Account Temporarily Locked)</option>
                    <option value={5}>5 Attempts</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: AI RISK ENGINE & ANALYTICS ── */}
      {activeTab === "ai_engine" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Cpu size={16} color="#0284c7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Neural Risk Prediction & Computer Vision</span>
              </div>
              <span style={{ fontSize: 11.5, background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                TensorRT Accel Active
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  Active Predictive Hazard Neural Network
                </label>
                <select
                  value={aiData.modelEnsemble}
                  onChange={e => setAiData({ ...aiData, modelEnsemble: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="MineGuard Neural-Risk v4.2 (DGMS CMR Fine-Tuned)">MineGuard Neural-Risk v4.2 (DGMS CMR Fine-Tuned - Recommended)</option>
                  <option value="CIL Safety Ensemble v3.8 (High Precision Gas Tracking)">CIL Safety Ensemble v3.8 (High Precision Gas Tracking)</option>
                  <option value="Underground Multi-Modal Vision & Telemetry v2.1">Underground Multi-Modal Vision & Telemetry v2.1</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Cross-Site Telemetry Ingestion Frequency
                  </label>
                  <select
                    value={aiData.ingestionIntervalSec}
                    onChange={e => setAiData({ ...aiData, ingestionIntervalSec: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value={10}>10 Seconds (Real-time Methane & Airflow)</option>
                    <option value={15}>15 Seconds (Standard Operations)</option>
                    <option value={30}>30 Seconds (Bandwidth Optimized)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                    Minimum Model Confidence Score Threshold
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                    <input
                      type="range"
                      min="70"
                      max="98"
                      value={aiData.confidenceThresholdPct}
                      onChange={e => setAiData({ ...aiData, confidenceThresholdPct: Number(e.target.value) })}
                      style={{ flex: 1, accentColor: "#2d6a4f" }}
                    />
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#2d6a4f" }}>{aiData.confidenceThresholdPct}%</span>
                  </div>
                </div>
              </div>

              {/* Auto Escalation */}
              <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Autonomous 24-Hour Severity Escalation</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                    Unresolved Level-1 violations automatically escalate to Chief Inspector Dhanbad after 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiData({ ...aiData, autoEscalateSeverity: !aiData.autoEscalateSeverity })}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: aiData.autoEscalateSeverity ? "#2d6a4f" : "#cbd5e1",
                    position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3, left: aiData.autoEscalateSeverity ? 23 : 3,
                    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: DGMS REGULATORY GATEWAY ── */}
      {activeTab === "dgms_sync" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Server size={16} color="#d97706" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>DGMS Dhanbad Central Data Exchange</span>
              </div>
              <span style={{ fontSize: 11.5, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                SSL TLS 1.3 Certified
              </span>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  Statutory API Ingestion Endpoint
                </label>
                <input
                  type="text"
                  value={dgmsData.apiEndpoint}
                  onChange={e => setDgmsData({ ...dgmsData, apiEndpoint: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 5 }}>
                  Cryptographic Directorate Gateway Key
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="password"
                    value={dgmsData.gatewayKey}
                    readOnly
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, background: "#f8fafc", color: "#64748b" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    }}
                    style={{ padding: "9px 14px", borderRadius: 8, background: "#f1f5f9", border: "1px solid #cbd5e1", fontSize: 12, fontWeight: 700, color: "#334155", cursor: "pointer" }}
                  >
                    Ping Gateway
                  </button>
                </div>
              </div>

              <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span style={{ fontSize: 12.5, color: "#166534", fontWeight: 600 }}>
                  Active link verified: {dgmsData.lastSuccessfulSync}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: IMMUTABLE AUDIT LOG ── */}
      {activeTab === "audit_logs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={16} color="#475569" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Apex Compliance & Command Audit Trail</span>
              </div>
              <span style={{ fontSize: 11.5, color: "#64748b" }}>Read-Only Cryptographic Log</span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Log ID", "Timestamp", "Executive Officer", "Statutory Action Executed", "Origin IP"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#64748b", textAlign: "left", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={log.id} style={{ borderTop: "1px solid #f1f5f9", fontSize: 12.5 }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2d6a4f" }}>{log.id}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{log.timestamp}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{log.user}</td>
                    <td style={{ padding: "12px 16px", color: "#334155" }}>{log.action}</td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 11.5, fontFamily: "monospace" }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
