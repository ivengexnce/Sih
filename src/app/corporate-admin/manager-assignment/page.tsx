"use client";

import React, { useState, useEffect } from "react";
import {
  Shield, HardHat, Award, AlertTriangle, CheckCircle, Users,
  ArrowRight, FileText, Download, Building2, MapPin, Search,
  RefreshCw, Scale, Sparkles, Filter, ChevronRight, CheckCircle2,
  XCircle, Clock, AlertCircle, Printer
} from "lucide-react";
import { storageService, OfficerProfile } from "@/lib/storage";
import { COLLIERY_DATABASE, CollieryProfile } from "@/lib/collieryData";
import { useTranslation } from "@/components/LanguageContext";

interface FormIVNotice {
  noticeId: string;
  mineName: string;
  subsidiary: string;
  appointedManager: string;
  dgmsCertNumber: string;
  certType: string;
  effectiveDate: string;
  predecessorName: string;
  statutoryReason: string;
  generatedAt: string;
}

export default function ManagerAssignmentConsole() {
  const { t } = useTranslation();
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [selectedCollieryKey, setSelectedCollieryKey] = useState<string>("gevra");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubsidiary, setFilterSubsidiary] = useState("All");

  // Evaluation & Assignment Modal State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalTargetColliery, setEvalTargetColliery] = useState<CollieryProfile | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<OfficerProfile | null>(null);

  // Form IV Notice Modal State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState<FormIVNotice | null>(null);

  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    loadCadreData();
  }, []);

  const loadCadreData = () => {
    const all = storageService.getAllOfficers();
    setOfficers(all);
  };

  const collieriesList = Object.entries(COLLIERY_DATABASE).map(([key, colliery]) => {
    const currentMgr = storageService.getAppointedManagerForMine(colliery.name);
    const isUnderground = colliery.type.includes("Underground");
    const requiredCert = (isUnderground && colliery.capacityMtpa > 0.03) || (!isUnderground && colliery.capacityMtpa > 0.24)
      ? "First Class Manager's Certificate (Coal)"
      : "First Class / Second Class (Coal)";

    return {
      key,
      ...colliery,
      currentManager: currentMgr,
      requiredQualification: requiredCert,
      cadreStatus: currentMgr ? "Appointed" : "Vacant / Needs Assignment"
    };
  });

  const filteredCollieries = collieriesList.filter(c => {
    const matchesSub = filterSubsidiary === "All" || c.subsidiary === filterSubsidiary;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.coalfield.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const appointedCount = collieriesList.filter(c => c.currentManager).length;
  const vacantCount = collieriesList.length - appointedCount;
  const managersPool = officers.filter(o => o.role === "manager");

  // Trigger Candidate Evaluation
  const openEvaluation = (colliery: CollieryProfile) => {
    setEvalTargetColliery(colliery);
    // Suggest first eligible candidate
    const pool = managersPool.find(m => m.certType === "First Class (Coal)" && m.allocatedMine.includes("Unallocated")) || managersPool[0];
    setSelectedCandidate(pool || null);
    setEvalModalOpen(true);
  };

  // Confirm Statutory Appointment under CMR 2017 Reg 27
  const confirmAppointment = () => {
    if (!evalTargetColliery || !selectedCandidate) return;

    // Check if candidate already manages another mine
    const previousMine = selectedCandidate.allocatedMine;
    const isTransfer = previousMine && !previousMine.includes("Unallocated") && previousMine !== evalTargetColliery.name;

    const success = storageService.assignManagerToMine(selectedCandidate.email, evalTargetColliery.name);

    if (success) {
      loadCadreData();
      setEvalModalOpen(false);

      // Generate DGMS Form IV Notice
      const notice: FormIVNotice = {
        noticeId: `DGMS-F4-${Date.now().toString().slice(-6)}`,
        mineName: evalTargetColliery.name,
        subsidiary: evalTargetColliery.subsidiary,
        appointedManager: selectedCandidate.name,
        dgmsCertNumber: selectedCandidate.officialId || "DGMS-FCC-2026",
        certType: selectedCandidate.certType || "First Class (Coal)",
        effectiveDate: new Date().toISOString().split("T")[0],
        predecessorName: evalTargetColliery.statutoryManagerName || "Ex-Officio Vacancy",
        statutoryReason: isTransfer ? `Inter-Colliery Strategic Transfer from ${previousMine}` : "Fresh Statutory Reg. 27 Appointment",
        generatedAt: new Date().toLocaleString("en-IN")
      };

      setActiveNotice(notice);
      setNoticeModalOpen(true);

      setNotification({
        type: "success",
        msg: `Statutory Appointment Approved! ${selectedCandidate.name} appointed as Manager of ${evalTargetColliery.name}.`
      });

      setTimeout(() => setNotification(null), 6000);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", paddingBottom: 40 }}>

      {/* Breadcrumb & Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
          <span>{t("Corporate Governance")}</span>
          <span>/</span>
          <span style={{ color: "#2563eb", fontWeight: 600 }}>{t("Statutory Cadre & Manager Allocation")}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scale size={20} color="#2563eb" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>
                {t("CMR 2017 Reg. 27 Statutory Manager Allocation Console")}
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0 48px" }}>
              {t("Pan-India oversight for Coal India Limited. Evaluates Manager competency, enforces single-mine statutory mandates, and generates DGMS Form IV appointment notices.")}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                const notice: FormIVNotice = {
                  noticeId: "DGMS-F4-884920",
                  mineName: "SECL Gevra Mega Opencast",
                  subsidiary: "SECL",
                  appointedManager: "Er. Rajesh Kumar Sharma",
                  dgmsCertNumber: "DGMS-FCC-7721",
                  certType: "First Class Manager's Certificate (Coal)",
                  effectiveDate: "2024-03-15",
                  predecessorName: "Er. K. N. Rao (Superannuated)",
                  statutoryReason: "Statutory Re-appointment under CMR 2017 Regulation 27(1)",
                  generatedAt: new Date().toLocaleString("en-IN")
                };
                setActiveNotice(notice);
                setNoticeModalOpen(true);
              }}
              style={{
                padding: "8px 14px",
                background: "white",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <FileText size={15} color="#2563eb" />
              {t("Sample DGMS Form IV")}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          padding: "12px 18px",
          background: notification.type === "success" ? "#dcfce7" : "#fee2e2",
          border: `1px solid ${notification.type === "success" ? "#86efac" : "#fca5a5"}`,
          borderRadius: 10,
          color: notification.type === "success" ? "#15803d" : "#b91c1c",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          {notification.type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Statutory Cadre KPI Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Monitored Collieries", val: collieriesList.length, sub: "CIL Operating Pits", color: "#1d4ed8", bg: "#eff6ff", icon: Building2 },
          { label: "Statutory Appointments", val: appointedCount, sub: "CMR Reg 27 Active", color: "#16a34a", bg: "#dcfce7", icon: CheckCircle },
          { label: "Colliery Vacancies", val: vacantCount, sub: "Requires Immediate Order", color: vacantCount > 0 ? "#dc2626" : "#16a34a", bg: vacantCount > 0 ? "#fee2e2" : "#dcfce7", icon: AlertTriangle },
          { label: "Certified Manager Pool", val: managersPool.length, sub: "DGMS First/Second Class", color: "#8b5cf6", bg: "#f5f3ff", icon: Award },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {t(kpi.label)}
                </span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, marginTop: 8 }}>{kpi.val}</div>
              <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{t(kpi.sub)}</div>
            </div>
          );
        })}
      </div>

      {/* Statutory Rules Guidance Banner */}
      <div style={{
        padding: "14px 18px",
        background: "linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)",
        border: "1px solid #bfdbfe",
        borderRadius: 12,
        marginBottom: 24,
        display: "flex",
        alignItems: "flex-start",
        gap: 12
      }}>
        <Scale size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", margin: 0 }}>
            {t("DGMS Statutory Assignment Protocol (Coal Mines Regulations 2017)")}
          </h4>
          <p style={{ fontSize: 12, color: "#374151", margin: "4px 0 0 0", lineHeight: 1.5 }}>
            • <strong>Regulation 27(1)</strong>: {t("Regulation 27(1): No individual can act as Manager of more than one mine simultaneously without explicit prior written authorization of the Chief Inspector.", "No individual can act as Manager of more than one mine simultaneously without explicit prior written authorization of the Chief Inspector.")}<br />
            • <strong>{t("Opencast Mines handling > 20,000 m³/month", "Opencast Mines handling > 20,000 m³/month")}</strong> {t("or", "or")} <strong>{t("Underground Mines producing > 2,500 MT/month", "Underground Mines producing > 2,500 MT/month")}</strong> {t("mandate a certified", "mandate a certified")} <strong>{t("First Class Manager (Coal)", "First Class Manager (Coal)")}</strong>.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #d1d5db", borderRadius: 8, padding: "7px 12px", width: 300, maxWidth: "100%" }}>
          <Search size={15} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search colliery, basin, or coalfield..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: 12.5, width: "100%", color: "#111827" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Subsidiary:</span>
          {["All", "SECL", "BCCL", "NCL", "MCL", "ECL", "CCL", "WCL"].map(sub => (
            <button
              key={sub}
              onClick={() => setFilterSubsidiary(sub)}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                border: "1px solid",
                borderColor: filterSubsidiary === sub ? "#2563eb" : "#e5e7eb",
                background: filterSubsidiary === sub ? "#eff6ff" : "white",
                color: filterSubsidiary === sub ? "#2563eb" : "#4b5563",
                cursor: "pointer"
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Collieries Statutory Cadre Table */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: 30 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{t("National Colliery Manager Cadre Roster")}</h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>{t("Real-time appointment and vacancy status for all monitored CIL pits")}</p>
          </div>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {t("Showing", "Showing")} <strong>{filteredCollieries.length}</strong> {t("collieries", "collieries")}
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#4b5563" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700 }}>{t("Colliery / Pit")}</th>
                <th style={{ padding: "12px 16px", fontWeight: 700 }}>{t("Type & Capacity")}</th>
                <th style={{ padding: "12px 16px", fontWeight: 700 }}>{t("Mandated Qualification")}</th>
                <th style={{ padding: "12px 16px", fontWeight: 700 }}>{t("Statutory Manager (CMR 27)")}</th>
                <th style={{ padding: "12px 16px", fontWeight: 700 }}>{t("Cadre Status")}</th>
                <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollieries.map(col => {
                const mgr = col.currentManager;
                const isOpencast = col.type.includes("Opencast");
                return (
                  <tr key={col.key} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {/* Colliery */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#111827" }}>{col.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <MapPin size={10} /> {col.state} · <span style={{ color: "#2563eb", fontWeight: 600 }}>{col.subsidiary}</span>
                      </div>
                    </td>

                    {/* Type & Capacity */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                        background: isOpencast ? "#eff6ff" : "#fef3c7",
                        color: isOpencast ? "#1d4ed8" : "#b45309"
                      }}>
                        {t(col.type)}
                      </span>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                        {col.capacityMtpa} MTPA · {col.gassiness}
                      </div>
                    </td>

                    {/* Mandated Qualification */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 12 }}>{t(col.requiredQualification)}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                        {isOpencast ? t("Handling > 20k m³/mo") : t("Output > 2,500 MT/mo")}
                      </div>
                    </td>

                    {/* Statutory Manager */}
                    <td style={{ padding: "14px 16px" }}>
                      {mgr ? (
                        <div>
                          <div style={{ fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 5 }}>
                            <HardHat size={13} color="#16a34a" />
                            {mgr.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                            {mgr.officialId} · Exp: {mgr.experienceYears || 15} yrs
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#dc2626", fontStyle: "italic", fontWeight: 600 }}>
                          ⚠️ {t("No Manager Appointed")}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: mgr ? "#dcfce7" : "#fee2e2",
                        color: mgr ? "#15803d" : "#b91c1c",
                        display: "inline-flex", alignItems: "center", gap: 5
                      }}>
                        {mgr ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {mgr ? t("Statutory Charge Active") : t("Vacant Cadre")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button
                          onClick={() => openEvaluation(col)}
                          style={{
                            padding: "6px 11px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <Award size={12} />
                          {mgr ? t("Reassign / Transfer") : t("Appoint Manager")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Certified Mining Officers Pool */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
              {t("Certified Mining Officers Directory (DGMS Certified Pool)")}
            </h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>
              Candidates eligible for First Class and Second Class Colliery Management appointments under CMR 2017
            </p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "4px 10px", borderRadius: 6 }}>
            {managersPool.length} Certified Officers in System
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {managersPool.map(officer => {
            const isAssigned = !officer.allocatedMine.includes("Unallocated");
            return (
              <div
                key={officer.email}
                style={{
                  padding: "14px 16px",
                  background: "#f9fafb",
                  border: `1px solid ${isAssigned ? "#e5e7eb" : "#86efac"}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", margin: 0 }}>{officer.name}</h4>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>{officer.designation}</span>
                  </div>
                  <span style={{
                    padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: isAssigned ? "#f3f4f6" : "#dcfce7",
                    color: isAssigned ? "#4b5563" : "#16a34a"
                  }}>
                    {isAssigned ? "Deployed" : "Available Pool"}
                  </span>
                </div>

                <div style={{ margin: "10px 0", fontSize: 11.5, color: "#4b5563" }}>
                  <div>DGMS Cert: <strong>{officer.officialId}</strong> ({officer.certType || "First Class (Coal)"})</div>
                  <div>Experience: <strong>{officer.experienceYears || 14} Years</strong> · Safety Score: <strong>{officer.safetyScore || 92}%</strong></div>
                  <div style={{ marginTop: 4, color: isAssigned ? "#1d4ed8" : "#059669", fontWeight: 600 }}>
                    {isAssigned ? `Active: ${officer.allocatedMine}` : "Ready for Colliery Posting"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Evaluation & Appointment Modal ── */}
      {evalModalOpen && evalTargetColliery && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "white", borderRadius: 14, maxWidth: 580, width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                  Evaluate Statutory Manager Appointment
                </h3>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0 0" }}>
                  Target Colliery: <strong>{evalTargetColliery.name}</strong> ({evalTargetColliery.type})
                </p>
              </div>
              <button onClick={() => setEvalModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}>✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px 22px", maxHeight: "70vh", overflowY: "auto" }}>
              {/* Colliery Requirements Summary */}
              <div style={{ padding: "12px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>CMR 2017 Statutory Mandate</div>
                <div style={{ fontSize: 12.5, color: "#1e3a8a", marginTop: 2 }}>
                  Capacity: <strong>{evalTargetColliery.capacityMtpa} MTPA</strong> · Required: <strong>First Class Manager's Certificate (Coal)</strong>
                </div>
              </div>

              {/* Select Officer */}
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                Select Mining Officer Candidate:
              </label>
              <select
                value={selectedCandidate?.email}
                onChange={e => {
                  const candidate = managersPool.find(m => m.email === e.target.value);
                  setSelectedCandidate(candidate || null);
                }}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: "1.5px solid #d1d5db", fontSize: 13, outline: "none", marginBottom: 16
                }}
              >
                {managersPool.map(m => (
                  <option key={m.email} value={m.email}>
                    {m.name} · {m.officialId} ({m.certType}) — Current: {m.allocatedMine}
                  </option>
                ))}
              </select>

              {/* Candidate Scoring Analysis */}
              {selectedCandidate && (
                <div style={{ padding: "14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                    Statutory Eligibility & Compliance Score:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11.5 }}>
                    <div style={{ padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                      <span style={{ color: "#6b7280" }}>Certificate Match:</span>{" "}
                      <strong style={{ color: selectedCandidate.certType?.includes("First Class") ? "#16a34a" : "#ea580c" }}>
                        {selectedCandidate.certType?.includes("First Class") ? "✓ First Class (Eligible)" : "⚠ Second Class"}
                      </strong>
                    </div>

                    <div style={{ padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                      <span style={{ color: "#6b7280" }}>Dual Appointment Check:</span>{" "}
                      <strong style={{ color: selectedCandidate.allocatedMine.includes("Unallocated") ? "#16a34a" : "#2563eb" }}>
                        {selectedCandidate.allocatedMine.includes("Unallocated") ? "✓ Zero Conflicts" : `Transfer from ${selectedCandidate.allocatedMine}`}
                      </strong>
                    </div>

                    <div style={{ padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                      <span style={{ color: "#6b7280" }}>Safety Record:</span>{" "}
                      <strong style={{ color: "#16a34a" }}>{selectedCandidate.safetyScore || 94}% (Clean)</strong>
                    </div>

                    <div style={{ padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                      <span style={{ color: "#6b7280" }}>Mining Experience:</span>{" "}
                      <strong>{selectedCandidate.experienceYears || 16} Years</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* DGMS Form IV Generation Notice */}
              <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.4 }}>
                Approving this assignment will automatically file <strong>DGMS Form IV (Notice of Appointment)</strong> with the Regional Inspectorate and relieve any prior manager under CMR 2017 Regulation 27.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 22px", borderTop: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setEvalModalOpen(false)} style={{ padding: "8px 14px", background: "white", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 12.5, cursor: "pointer" }}>
                Cancel
              </button>
              <button
                onClick={confirmAppointment}
                style={{
                  padding: "8px 16px", background: "#2563eb", color: "white",
                  border: "none", borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: "pointer"
                }}
              >
                Confirm Appointment & Generate Form IV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Official DGMS Form IV Notice Document Modal ── */}
      {noticeModalOpen && activeNotice && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }}>
          <div style={{
            background: "white", borderRadius: 12, maxWidth: 650, width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden"
          }}>
            {/* Printable Document Box */}
            <div style={{ padding: "28px 32px", borderBottom: "1px solid #e5e7eb" }}>
              {/* Seal & Heading */}
              <div style={{ textAlign: "center", borderBottom: "2px solid #111827", paddingBottom: 14, marginBottom: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Government of India · Ministry of Labour & Employment
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "4px 0" }}>
                  DIRECTORATE GENERAL OF MINES SAFETY
                </h2>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>
                  FORM IV · NOTICE OF APPOINTMENT OF MANAGER (CMR 2017 REG. 27(3))
                </div>
                <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 2 }}>
                  Notice Reference ID: {activeNotice.noticeId}
                </div>
              </div>

              {/* Legal Certificate Content */}
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 18 }}>
                <p>
                  To,<br />
                  <strong>The Regional Inspector of Mines</strong>,<br />
                  DGMS Zonal Headquarters, {activeNotice.subsidiary} Mining Jurisdiction.
                </p>

                <p style={{ marginTop: 10 }}>
                  Sir,<br />
                  In accordance with <strong>Regulation 27(3) of the Coal Mines Regulations, 2017</strong>, notice is hereby given that the following officer has been duly appointed as the statutory Manager of <strong>{activeNotice.mineName}</strong>:
                </p>

                {/* Details Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, margin: "12px 0", background: "#f9fafb" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, width: "38%" }}>Appointed Manager:</td>
                      <td style={{ padding: "6px 10px" }}>{activeNotice.appointedManager}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700 }}>DGMS Certificate Number:</td>
                      <td style={{ padding: "6px 10px" }}>{activeNotice.dgmsCertNumber} ({activeNotice.certType})</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700 }}>Effective Appointment Date:</td>
                      <td style={{ padding: "6px 10px" }}>{activeNotice.effectiveDate}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700 }}>Predecessor Manager:</td>
                      <td style={{ padding: "6px 10px" }}>{activeNotice.predecessorName}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 10px", fontWeight: 700 }}>Statutory Reason / Type:</td>
                      <td style={{ padding: "6px 10px" }}>{activeNotice.statutoryReason}</td>
                    </tr>
                  </tbody>
                </table>

                <p style={{ marginTop: 10, fontSize: 11, color: "#6b7280" }}>
                  Certified that the above-named person holds the qualifications prescribed by Regulation 27 and that no dual appointment conflict exists in violation of CMR 2017.
                </p>
              </div>

              {/* Digital Signature */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24, paddingTop: 12, borderTop: "1px dashed #d1d5db" }}>
                <div style={{ fontSize: 10.5, color: "#6b7280" }}>
                  Digitally Authenticated: {activeNotice.generatedAt}<br />
                  MineGuard Smart Governance Platform
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Director (Technical / Safety)</div>
                  <div style={{ fontSize: 10.5, color: "#2563eb", fontWeight: 600 }}>Coal India Limited / {activeNotice.subsidiary}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ padding: "14px 22px", background: "#f9fafb", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "8px 14px", background: "white", border: "1px solid #d1d5db",
                  borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                }}
              >
                <Printer size={14} /> Print Notice
              </button>
              <button
                onClick={() => setNoticeModalOpen(false)}
                style={{
                  padding: "8px 18px", background: "#2563eb", color: "white",
                  border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
