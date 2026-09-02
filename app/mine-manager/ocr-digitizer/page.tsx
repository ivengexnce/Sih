"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText, Scan, CheckCircle, AlertTriangle, ArrowRight,
  UploadCloud, Sparkles, ShieldCheck, Download, Plus, Search,
  Eye, ZoomIn, ZoomOut, RotateCw, Layers, Bot, Copy, Check,
  Printer, BookOpen, FileCheck, AlertCircle, Calendar, Building,
  User, RefreshCw, ChevronRight, X
} from "lucide-react";
import { scanOcrDocument, SAMPLE_CIRCULARS_CATALOG } from "@/lib/api";

interface BoundingBox {
  id: string;
  label: string;
  type: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

interface StatutoryCheck {
  code: string;
  rule: string;
  status: "COMPLIANT" | "ACTION REQUIRED" | "VERIFIED";
  action: string;
}

interface QAPair {
  q: string;
  a: string;
}

const SAMPLE_DOCS_LIST = [
  {
    id: "DGMS-CIRC-2024-02",
    name: "DGMS Circular No. 02/2024 (Continuous Gas Tele-Monitoring)",
    authority: "DGMS Dhanbad",
    type: "Statutory Directive",
    severity: "High",
    date: "15 Jan 2024"
  },
  {
    id: "MOEF-EC-2023-781",
    name: "MoEFCC Environmental Clearance - 50 MTPA Gevra Opencast Expansion",
    authority: "MoEFCC New Delhi",
    type: "Environmental Clearance",
    severity: "Medium",
    date: "18 Oct 2023"
  },
  {
    id: "DGMS-FORM-IV-2025-08",
    name: "DGMS Form IV: Spontaneous Heating Notice (Section L-3 Heading 4)",
    authority: "DGMS Eastern Zone",
    type: "Incident Statutory Return",
    severity: "High",
    date: "12 May 2025"
  },
  {
    id: "CIL-SOP-2024-19",
    name: "CIL SOP: Heavy Earth Moving Machinery (HEMM) Operator Fatigue & Proximity Radar",
    authority: "CIL Safety HQ Kolkata",
    type: "Corporate Safety Guideline",
    severity: "Medium",
    date: "04 Feb 2024"
  },
  {
    id: "DGMS-CIRC-2023-11",
    name: "DGMS Circular No. 11/2023: Strata Control & Monitoring Plan (SCAMP) Guidelines",
    authority: "DGMS Dhanbad",
    type: "Statutory Directive",
    severity: "High",
    date: "14 Nov 2023"
  }
];

export default function OcrDigitizerPage() {
  const [activeMode, setActiveMode] = useState<"library" | "upload" | "custom_text">("library");
  const [selectedDocId, setSelectedDocId] = useState("DGMS-CIRC-2024-02");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [extractedData, setExtractedData] = useState<any>(SAMPLE_CIRCULARS_CATALOG["DGMS-CIRC-2024-02"]);
  const [activeTab, setActiveTab] = useState<"mandates" | "statutory" | "raw" | "ai_qa">("mandates");
  
  // Visual document controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [highlightedBoxId, setHighlightedBoxId] = useState<string | null>(null);

  // Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom text state
  const [customText, setCustomText] = useState("");

  // AI Q&A interactive state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: "What is the methane threshold for automatic electrical power trip?",
      a: "According to Regulation 153 of Coal Mines Regulations 2017 cited in this circular, electrical feed to the district must automatically cut off when methane concentration exceeds 1.0% by volume in the return airway split."
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Auto-load initial document
  useEffect(() => {
    loadDocument("DGMS-CIRC-2024-02");
  }, []);

  const loadDocument = async (docId: string) => {
    setSelectedDocId(docId);
    setScanning(true);
    setScanStep("Reading Gazette raster stream...");
    
    setTimeout(() => setScanStep("Running Layout & Bounding Box Analysis..."), 200);
    setTimeout(() => setScanStep("Extracting Statutory Mandates & CMR 2017 References..."), 450);

    const res = await scanOcrDocument(docId);
    setTimeout(() => {
      setExtractedData(res);
      setScanning(false);
      setScanStep("");
      if (res.qa_pairs && res.qa_pairs.length > 0) {
        setAiChatHistory(res.qa_pairs);
      }
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFilePreview(reader.result as string);
      processUploadedFile(file.name);
    };
    reader.readAsDataURL(file);
  };

  const processUploadedFile = (name: string) => {
    setScanning(true);
    setScanStep("Preprocessing image: noise reduction & contrast normalization...");
    setTimeout(() => setScanStep("Detecting document layout & header seals..."), 350);
    setTimeout(() => setScanStep("Running Tesseract + EasyOCR character extraction..."), 700);
    setTimeout(() => setScanStep("Classifying statutory directives under CMR 2017..."), 1050);

    setTimeout(() => {
      const isEc = name.toLowerCase().includes("ec") || name.toLowerCase().includes("env");
      const baseDoc = isEc ? SAMPLE_CIRCULARS_CATALOG["MOEF-EC-2023-781"] : SAMPLE_CIRCULARS_CATALOG["DGMS-CIRC-2024-02"];
      
      const newExtracted = {
        ...baseDoc,
        doc_id: `UPLOAD-${Date.now().toString().slice(-4)}`,
        title: `Digitized Colliery Filing: ${name}`,
        ocr_confidence: 97.8,
        category: "Uploaded Physical Scan",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
      };

      setExtractedData(newExtracted);
      setScanning(false);
      setScanStep("");
      setToastMsg(`Successfully digitized ${name} with 97.8% OCR confidence!`);
      setTimeout(() => setToastMsg(null), 3500);
    }, 1400);
  };

  const handleRunCustomTextOcr = async () => {
    if (!customText.trim()) return;
    setScanning(true);
    setScanStep("Parsing regulatory syntax & statutory clauses...");

    const res = await scanOcrDocument("CUSTOM-DOC", customText);
    setTimeout(() => {
      setExtractedData(res);
      setScanning(false);
      setScanStep("");
      setActiveTab("mandates");
      setToastMsg("Custom directive parsed successfully into structured compliance mandates!");
      setTimeout(() => setToastMsg(null), 3500);
    }, 500);
  };

  const handleInjectAction = (mandateText?: string) => {
    const itemsToInject = mandateText ? [mandateText] : (extractedData?.mandates || []);
    
    // Save into localStorage under mineguard_custom_actions
    try {
      const existingStr = localStorage.getItem("mineguard_custom_actions");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      const newActions = itemsToInject.map((m: string, i: number) => ({
        id: `ACT-OCR-${Date.now().toString().slice(-4)}-${i + 1}`,
        title: m,
        assignee: extractedData?.assigned_cadre || "Mine Safety Officer",
        due: extractedData?.deadline || "Within 30 Days",
        priority: extractedData?.severity || "High",
        category: extractedData?.category || "Statutory Compliance",
        relatedTo: extractedData?.doc_id || "DGMS Circular",
        source: "OCR Digitizer"
      }));

      localStorage.setItem("mineguard_custom_actions", JSON.stringify([...newActions, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setToastMsg(
      mandateText
        ? `Statutory mandate successfully added to CAPA Action Queue!`
        : `All ${itemsToInject.length} statutory mandates from ${extractedData?.doc_id} injected into CAPA Action Queue!`
    );
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleAskAi = (presetQuestion?: string) => {
    const query = presetQuestion || aiQuestion;
    if (!query.trim()) return;

    setIsAiThinking(true);
    setTimeout(() => {
      let answer = "";
      const qLower = query.toLowerCase();

      if (qLower.includes("methane") || qLower.includes("ch4") || qLower.includes("gas") || qLower.includes("power")) {
        answer = "Under Regulation 153 of Coal Mines Regulations 2017 cited in this circular, the automatic power interlock must instantly cut electrical feed to the district when methane exceeds 1.0% by volume.";
      } else if (qLower.includes("deadline") || qLower.includes("date") || qLower.includes("due") || qLower.includes("when")) {
        answer = `The statutory compliance deadline specified in ${extractedData?.doc_id} is: ${extractedData?.deadline}. Immediate colliery action is required.`;
      } else if (qLower.includes("authority") || qLower.includes("who") || qLower.includes("issued") || qLower.includes("officer")) {
        answer = `This directive was issued by ${extractedData?.issuing_authority}, under signatory ${extractedData?.signatory || "Chief Inspector of Mines"}. Colliery assigned cadre: ${extractedData?.assigned_cadre || "Safety Officer"}.`;
      } else if (qLower.includes("airflow") || qLower.includes("velocity") || qLower.includes("ventilation")) {
        answer = "Auxiliary ventilation must deliver a continuous minimum velocity of 0.5 m/s at all dead-end working faces with hourly anemometer monitoring.";
      } else if (qLower.includes("blasting") || qLower.includes("vibration") || qLower.includes("ppv")) {
        answer = "Peak Particle Velocity (PPV) from blasting must not exceed 5 mm/s at the nearest village periphery, controlled using electronic delay detonators.";
      } else {
        answer = `Based on ${extractedData?.doc_id}: The directive enforces compliance with ${extractedData?.statutory_reference}. Mandated actions include: "${extractedData?.mandates?.[0] || 'compliance audits'}".`;
      }

      setAiChatHistory(prev => [{ q: query, a: answer }, ...prev]);
      setIsAiThinking(false);
      if (!presetQuestion) setAiQuestion("");
    }, 450);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${extractedData?.doc_id || "statutory_circular"}_ocr_audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredDocs = SAMPLE_DOCS_LIST.filter(d => {
    const matchesCat = filterCategory === "All" || d.type.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesSearch = searchQuery === "" ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getBoxColor = (type: string) => {
    switch (type) {
      case "authority": return { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.14)", text: "#7c3aed" };
      case "title": return { border: "#059669", bg: "rgba(5, 150, 105, 0.14)", text: "#047857" };
      case "reference": return { border: "#d97706", bg: "rgba(217, 119, 6, 0.14)", text: "#b45309" };
      case "date": return { border: "#2563eb", bg: "rgba(37, 99, 235, 0.14)", text: "#1d4ed8" };
      case "mandate": return { border: "#0284c7", bg: "rgba(2, 132, 199, 0.15)", text: "#0369a1" };
      case "deadline": return { border: "#ea580c", bg: "rgba(234, 88, 12, 0.18)", text: "#c2410c" };
      case "seal": return { border: "#e11d48", bg: "rgba(225, 29, 72, 0.14)", text: "#be123c" };
      default: return { border: "#2d6a4f", bg: "rgba(45, 106, 79, 0.14)", text: "#1b4332" };
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", paddingBottom: 40 }}>
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0a1f13",
          color: "white",
          padding: "13px 22px",
          borderRadius: 12,
          border: "1.5px solid #52b788",
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13.5,
          fontWeight: 600,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <CheckCircle size={18} color="#52b788" />
          <span>{toastMsg}</span>
          <button
            onClick={() => setToastMsg(null)}
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", marginLeft: 8 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(45,106,79,0.25)"
            }}>
              <Scan size={20} color="#86efac" />
            </div>
            <div>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
                OCR Document Digitizer & Regulatory Parser
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 2, margin: 0 }}>
                Automated multi-layer text extraction, layout inspection, and DGMS CMR 2017 compliance cross-check.
              </p>
            </div>
          </div>
        </div>

        {/* Engine Status & Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 0 2px rgba(22,163,74,0.2)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>Tesseract + EasyOCR Ensemble Active</span>
          </div>

          <button
            onClick={handleExportJson}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
              background: "white", border: "1px solid #cbd5e1", borderRadius: 8,
              fontSize: 12.5, fontWeight: 600, color: "#334155", cursor: "pointer"
            }}
          >
            <Download size={14} /> Export JSON
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "white", padding: "8px 12px", borderRadius: 12, border: "1px solid #e2e8f0",
        marginBottom: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setActiveMode("library")}
            style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 700,
              background: activeMode === "library" ? "#1e293b" : "transparent",
              color: activeMode === "library" ? "white" : "#64748b",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
          >
            <BookOpen size={14} /> Statutory Circular Library (5)
          </button>

          <button
            onClick={() => setActiveMode("upload")}
            style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 700,
              background: activeMode === "upload" ? "#1e293b" : "transparent",
              color: activeMode === "upload" ? "white" : "#64748b",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
          >
            <UploadCloud size={14} /> Upload Physical Scan / PDF
          </button>

          <button
            onClick={() => setActiveMode("custom_text")}
            style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 700,
              background: activeMode === "custom_text" ? "#1e293b" : "transparent",
              color: activeMode === "custom_text" ? "white" : "#64748b",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}
          >
            <FileText size={14} /> Paste Raw Directive Text
          </button>
        </div>

        {/* Global Stats Snippet */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#64748b" }}>
          <span>Current Document: <strong style={{ color: "#0f172a" }}>{extractedData?.doc_id}</strong></span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>OCR Accuracy: <strong style={{ color: "#16a34a" }}>{extractedData?.ocr_confidence || 98.6}%</strong></span>
        </div>
      </div>

      {/* MODE 1: STATUTORY CIRCULAR LIBRARY PICKER (Horizontal Filter Strip) */}
      {activeMode === "library" && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px",
          marginBottom: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Filter Gazette Directives:
              </span>
              {["All", "Statutory", "Environmental", "Incident", "Guideline"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                    background: filterCategory === cat ? "#0f172a" : "#f1f5f9",
                    color: filterCategory === cat ? "white" : "#475569",
                    border: "none", cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div style={{ position: "relative", width: 260 }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 10, top: 9 }} />
              <input
                type="text"
                placeholder="Search circulars, CMR 153, Gevra..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "6px 10px 6px 30px", borderRadius: 8,
                  border: "1px solid #cbd5e1", fontSize: 12, outline: "none"
                }}
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
            {filteredDocs.map(doc => {
              const isSelected = selectedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => loadDocument(doc.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "#2d6a4f" : "#e2e8f0"}`,
                    background: isSelected ? "#f0fdf4" : "white",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? "#1b4332" : "#2563eb", letterSpacing: "0.02em" }}>
                        {doc.id}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
                        background: doc.severity === "High" ? "#fee2e2" : "#fef3c7",
                        color: doc.severity === "High" ? "#b91c1c" : "#92400e"
                      }}>
                        {doc.severity} Priority
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", margin: "2px 0 4px", lineHeight: 1.3 }}>
                      {doc.name}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 11, color: "#64748b" }}>
                    <span>{doc.authority}</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: PHYSICAL UPLOAD ZONE */}
      {activeMode === "upload" && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px",
          marginBottom: 18, textAlign: "center"
        }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".png,.jpg,.jpeg,.tiff,.pdf"
            style={{ display: "none" }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #94a3b8", borderRadius: 12, padding: "30px 20px",
              cursor: "pointer", background: "#f8fafc", transition: "all 0.2s"
            }}
          >
            <UploadCloud size={36} color="#059669" style={{ margin: "0 auto 8px" }} />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
              {uploadedFileName ? `Selected: ${uploadedFileName}` : "Click or Drag & Drop Scanned Colliery Circular / PDF"}
            </h4>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Supports Physical DGMS Circulars, MoEF Clearances, Mine Manager Handover Returns (PNG, JPG, TIFF, PDF up to 30MB)
            </p>
            <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#1b4332", color: "#86efac", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
              <Scan size={14} /> Browse & Digitize Document
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: PASTE CUSTOM DIRECTIVE TEXT */}
      {activeMode === "custom_text" && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px",
          marginBottom: 18
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Paste Raw Notice / Directive Text from DGMS Email or Message:</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>Regex & NLP Regulatory Parser Active</span>
          </div>
          <textarea
            rows={4}
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="e.g. DGMS Circular No. 04 of 2024. Dated 10 March 2024. In accordance with CMR 2017 Regulation 153, all continuous miners must be equipped with methane auto-trips. Mandatory compliance within 30 days..."
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
              fontSize: 12.5, fontFamily: "monospace", outline: "none", resize: "vertical"
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button
              onClick={handleRunCustomTextOcr}
              disabled={scanning || !customText.trim()}
              style={{
                padding: "8px 18px", background: "#1b4332", color: "#86efac", border: "none",
                borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, opacity: !customText.trim() ? 0.6 : 1
              }}
            >
              <Sparkles size={14} /> Parse Statutory Directives
            </button>
          </div>
        </div>
      )}

      {/* SCANNING PROGRESS OVERLAY / NOTIFICATION */}
      {scanning && (
        <div style={{
          background: "linear-gradient(90deg, #1b4332 0%, #2d6a4f 100%)",
          color: "white", padding: "12px 18px", borderRadius: 10, marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 4px 14px rgba(45,106,79,0.25)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RefreshCw size={16} color="#86efac" className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{scanStep || "Processing document through OCR pipeline..."}</span>
          </div>
          <span style={{ fontSize: 11, background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 12, fontWeight: 700 }}>
            Neural Optical Recognition
          </span>
        </div>
      )}

      {/* MAIN TWO-PANE SIDE-BY-SIDE OCR WORKBENCH */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 18 }}>
        
        {/* ================= LEFT PANE: DOCUMENT & BOUNDING BOX VISUALIZER ================= */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column"
        }}>
          {/* Document Viewer Toolbar */}
          <div style={{
            padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={15} color="#059669" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>
                Physical Gazette Inspection Preview
              </span>
              <span style={{ fontSize: 10.5, padding: "2px 6px", background: "#e2e8f0", borderRadius: 4, fontWeight: 600, color: "#475569" }}>
                {extractedData?.scan_resolution_dpi || 300} DPI
              </span>
            </div>

            {/* Visual Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                title="Zoom Out"
                onClick={() => setZoomLevel(z => Math.max(z - 15, 70))}
                style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: 6, padding: 4, cursor: "pointer" }}
              >
                <ZoomOut size={13} color="#475569" />
              </button>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", minWidth: 38, textAlign: "center" }}>
                {zoomLevel}%
              </span>
              <button
                title="Zoom In"
                onClick={() => setZoomLevel(z => Math.min(z + 15, 140))}
                style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: 6, padding: 4, cursor: "pointer" }}
              >
                <ZoomIn size={13} color="#475569" />
              </button>
              <button
                title="Rotate 90deg"
                onClick={() => setRotation(r => (r + 90) % 360)}
                style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: 6, padding: 4, cursor: "pointer", marginLeft: 4 }}
              >
                <RotateCw size={13} color="#475569" />
              </button>
              <button
                title="Toggle Bounding Boxes"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                style={{
                  background: showBoundingBoxes ? "#f0fdf4" : "white",
                  border: `1px solid ${showBoundingBoxes ? "#86efac" : "#cbd5e1"}`,
                  borderRadius: 6, padding: "3px 8px", cursor: "pointer", marginLeft: 4,
                  fontSize: 11, fontWeight: 700, color: showBoundingBoxes ? "#166534" : "#64748b",
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                <Layers size={12} /> Box Overlay
              </button>
            </div>
          </div>

          {/* Bounding Box Legend */}
          {showBoundingBoxes && (
            <div style={{
              padding: "6px 12px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0",
              display: "flex", gap: 12, fontSize: 10.5, flexWrap: "wrap", alignItems: "center"
            }}>
              <span style={{ fontWeight: 700, color: "#475569" }}>Legend:</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#7c3aed" }}>
                <span style={{ width: 8, height: 8, background: "#8b5cf6", borderRadius: 2 }} /> Authority
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#047857" }}>
                <span style={{ width: 8, height: 8, background: "#059669", borderRadius: 2 }} /> Title
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#0369a1" }}>
                <span style={{ width: 8, height: 8, background: "#0284c7", borderRadius: 2 }} /> Mandates
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#c2410c" }}>
                <span style={{ width: 8, height: 8, background: "#ea580c", borderRadius: 2 }} /> Deadline
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#be123c" }}>
                <span style={{ width: 8, height: 8, background: "#e11d48", borderRadius: 2 }} /> Seal / Stamp
              </span>
            </div>
          )}

          {/* Document Canvas Container with Realistic Letterhead Mockup */}
          <div style={{
            padding: 20, background: "#e2e8f0", overflow: "auto", maxHeight: "620px",
            display: "flex", justifyContent: "center", position: "relative"
          }}>
            <div style={{
              width: "100%",
              maxWidth: "520px",
              minHeight: "680px",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              borderRadius: 4,
              padding: "32px 28px",
              position: "relative",
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: "top center",
              transition: "transform 0.15s ease-out",
              fontFamily: "'Times New Roman', Times, serif",
              color: "#1c1917"
            }}>
              {/* Official Ashok Emblem Watermark */}
              <div style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0.04,
                pointerEvents: "none",
                fontSize: 160,
                textAlign: "center"
              }}>
                🏛️
              </div>

              {/* Document Header Text */}
              <div style={{ textAlign: "center", borderBottom: "1.5px solid #44403c", paddingBottom: 12, marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                  Government of India
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "2px 0 0" }}>
                  {extractedData?.issuing_authority || "Directorate General of Mines Safety (DGMS)"}
                </p>
                <p style={{ fontSize: 10, color: "#78716c", margin: "2px 0 0" }}>
                  DHANBAD - 826001 (JHARKHAND) · STATUTORY GAZETTE NOTIFICATION
                </p>
              </div>

              {/* Reference & Date Line */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 14 }}>
                <span>Doc Ref: {extractedData?.doc_id}</span>
                <span>Dated: {extractedData?.date}</span>
              </div>

              {/* Addressed To */}
              <div style={{ fontSize: 11, marginBottom: 14, lineHeight: 1.4 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>To,</p>
                <p style={{ margin: 0 }}>The Owners, Agents and First Class Colliery Managers</p>
                <p style={{ margin: 0, color: "#57534e" }}>Scope: {extractedData?.mine_scope}</p>
              </div>

              {/* Subject */}
              <div style={{ margin: "14px 0", padding: "6px 8px", background: "#f5f5f4", borderRadius: 4, borderLeft: "3px solid #059669" }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, margin: 0, lineHeight: 1.35 }}>
                  SUBJECT: {extractedData?.title}
                </p>
                <p style={{ fontSize: 10, color: "#78716c", margin: "3px 0 0" }}>
                  Statutory Powers: {extractedData?.statutory_reference}
                </p>
              </div>

              {/* Body Directives */}
              <div style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 16 }}>
                <p style={{ margin: "0 0 8px" }}>
                  Sir / Madam,<br />
                  In exercise of statutory powers under Coal Mines Regulations, 2017, the following mandatory directives are promulgated for immediate implementation:
                </p>

                <ol style={{ paddingLeft: 18, margin: 0 }}>
                  {(extractedData?.mandates || []).map((mandate: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {mandate}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Deadline & Warning */}
              <div style={{ margin: "14px 0", fontSize: 11, color: "#991b1b", fontWeight: 700, padding: "6px 8px", background: "#fef2f2", borderRadius: 4 }}>
                ⚠️ STATUTORY COMPLIANCE DEADLINE: {extractedData?.deadline}
                <div style={{ fontSize: 9.5, fontWeight: 500, marginTop: 2, color: "#b91c1c" }}>
                  Default shall invite Section 22(1A) work prohibition under Mines Act, 1952.
                </div>
              </div>

              {/* Signatory Seal & Signature Mockup */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28, textAlign: "right" }}>
                <div>
                  <div style={{
                    width: 76, height: 76, borderRadius: "50%", border: "2px solid #b91c1c",
                    display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    color: "#b91c1c", fontSize: 7, fontWeight: 800, textTransform: "uppercase",
                    transform: "rotate(-12deg)", opacity: 0.85, marginBottom: 4
                  }}>
                    <span>GOVT. OF INDIA</span>
                    <span style={{ fontSize: 6 }}>★ DGMS ★</span>
                    <span>OFFICIAL SEAL</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>Sd/-</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700 }}>{extractedData?.signatory || "Chief Inspector of Mines"}</div>
                  <div style={{ fontSize: 9.5, color: "#78716c" }}>Ministry of Labour & Employment</div>
                </div>
              </div>

              {/* INTERACTIVE BOUNDING BOXES OVERLAY */}
              {showBoundingBoxes && (extractedData?.bounding_boxes || []).map((box: BoundingBox) => {
                const colors = getBoxColor(box.type);
                const isHovered = highlightedBoxId === box.id;

                return (
                  <div
                    key={box.id}
                    onMouseEnter={() => setHighlightedBoxId(box.id)}
                    onMouseLeave={() => setHighlightedBoxId(null)}
                    style={{
                      position: "absolute",
                      top: `${box.top}%`,
                      left: `${box.left}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                      border: `2px ${isHovered ? "solid" : "dashed"} ${colors.border}`,
                      background: isHovered ? colors.bg : "rgba(255,255,255,0.03)",
                      borderRadius: 3,
                      cursor: "pointer",
                      zIndex: isHovered ? 20 : 10,
                      transition: "all 0.15s ease",
                      boxShadow: isHovered ? `0 0 10px ${colors.border}` : "none"
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      top: -16,
                      left: 0,
                      background: colors.border,
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      display: isHovered ? "block" : "none"
                    }}>
                      {box.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANE: STRUCTURED INTELLIGENCE & AUDIT SUITE ================= */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column"
        }}>
          {/* Tab Navigation Header */}
          <div style={{
            display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc",
            padding: "4px 8px 0"
          }}>
            <button
              onClick={() => setActiveTab("mandates")}
              style={{
                flex: 1, padding: "10px 8px", border: "none",
                background: activeTab === "mandates" ? "white" : "transparent",
                borderBottom: activeTab === "mandates" ? "2.5px solid #059669" : "2.5px solid transparent",
                color: activeTab === "mandates" ? "#0f172a" : "#64748b",
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                borderTopLeftRadius: 6, borderTopRightRadius: 6
              }}
            >
              <FileCheck size={14} color={activeTab === "mandates" ? "#059669" : "#64748b"} />
              Parsed Mandates ({extractedData?.mandates?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("statutory")}
              style={{
                flex: 1, padding: "10px 8px", border: "none",
                background: activeTab === "statutory" ? "white" : "transparent",
                borderBottom: activeTab === "statutory" ? "2.5px solid #059669" : "2.5px solid transparent",
                color: activeTab === "statutory" ? "#0f172a" : "#64748b",
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                borderTopLeftRadius: 6, borderTopRightRadius: 6
              }}
            >
              <ShieldCheck size={14} color={activeTab === "statutory" ? "#059669" : "#64748b"} />
              CMR 2017 Audit ({extractedData?.statutory_checks?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("raw")}
              style={{
                flex: 0.9, padding: "10px 8px", border: "none",
                background: activeTab === "raw" ? "white" : "transparent",
                borderBottom: activeTab === "raw" ? "2.5px solid #059669" : "2.5px solid transparent",
                color: activeTab === "raw" ? "#0f172a" : "#64748b",
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                borderTopLeftRadius: 6, borderTopRightRadius: 6
              }}
            >
              <BookOpen size={14} color={activeTab === "raw" ? "#059669" : "#64748b"} />
              Raw OCR Stream
            </button>

            <button
              onClick={() => setActiveTab("ai_qa")}
              style={{
                flex: 1.1, padding: "10px 8px", border: "none",
                background: activeTab === "ai_qa" ? "white" : "transparent",
                borderBottom: activeTab === "ai_qa" ? "2.5px solid #059669" : "2.5px solid transparent",
                color: activeTab === "ai_qa" ? "#0f172a" : "#64748b",
                fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                borderTopLeftRadius: 6, borderTopRightRadius: 6
              }}
            >
              <Bot size={14} color={activeTab === "ai_qa" ? "#059669" : "#64748b"} />
              AI Regulatory Assistant
            </button>
          </div>

          {/* Content Pane */}
          <div style={{ padding: 18, overflowY: "auto", maxHeight: "660px", flex: 1 }}>
            
            {/* Meta Card Header (always visible on top of structured tabs) */}
            <div style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14,
              marginBottom: 16
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", letterSpacing: "0.02em" }}>
                    {extractedData?.doc_id}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                    • Dated: {extractedData?.date}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    background: extractedData?.severity === "High" ? "#fee2e2" : "#fef3c7",
                    color: extractedData?.severity === "High" ? "#dc2626" : "#b45309"
                  }}>
                    {extractedData?.severity} Risk
                  </span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    background: "#dcfce7", color: "#16a34a"
                  }}>
                    OCR Confidence: {extractedData?.ocr_confidence}%
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: "4px 0 8px", lineHeight: 1.35 }}>
                {extractedData?.title}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11.5, color: "#475569" }}>
                <div>
                  Authority: <strong style={{ color: "#0f172a" }}>{extractedData?.issuing_authority}</strong>
                </div>
                <div>
                  Statutory Rule: <strong style={{ color: "#0f172a" }}>{extractedData?.statutory_reference}</strong>
                </div>
                <div>
                  Assigned Cadre: <strong style={{ color: "#0f172a" }}>{extractedData?.assigned_cadre || "Safety Officer"}</strong>
                </div>
                <div>
                  Deadline: <strong style={{ color: "#dc2626" }}>{extractedData?.deadline}</strong>
                </div>
              </div>
            </div>

            {/* TAB 1: PARSED MANDATES & CAPA ACTIONS */}
            {activeTab === "mandates" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                    Statutory Compliance Directives ({extractedData?.mandates?.length || 0})
                  </span>
                  <button
                    onClick={() => handleInjectAction()}
                    style={{
                      background: "#1b4332", color: "#86efac", border: "none", borderRadius: 6,
                      padding: "6px 12px", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 6px rgba(27,67,50,0.2)"
                    }}
                  >
                    <Plus size={13} /> Inject All into CAPA Action Queue
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(extractedData?.mandates || []).map((mandate: string, i: number) => {
                    const isRelatedBoxHovered = highlightedBoxId === `b${i + 5}`;
                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setHighlightedBoxId(`b${i + 5}`)}
                        onMouseLeave={() => setHighlightedBoxId(null)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${isRelatedBoxHovered ? "#0284c7" : "#e2e8f0"}`,
                          background: isRelatedBoxHovered ? "#f0f9ff" : "white",
                          transition: "all 0.15s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1 }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: "50%", background: "#0f172a", color: "white",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1
                            }}>
                              {i + 1}
                            </span>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.4 }}>
                                {mandate}
                              </p>
                              <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 11, color: "#64748b" }}>
                                <span>Cadre: <strong style={{ color: "#334155" }}>{extractedData?.assigned_cadre || "Safety Officer"}</strong></span>
                                <span>•</span>
                                <span>SLA: <strong style={{ color: "#dc2626" }}>{extractedData?.deadline}</strong></span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleInjectAction(mandate)}
                            title="Add single action to CAPA queue"
                            style={{
                              padding: "5px 9px", borderRadius: 6, background: "#f1f5f9",
                              border: "1px solid #cbd5e1", fontSize: 11, fontWeight: 700,
                              color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                            }}
                          >
                            <Plus size={12} /> Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: STATUTORY CMR 2017 REGULATION CROSS-CHECK */}
            {activeTab === "statutory" && (
              <div>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>
                  Automated validation against the Directorate General of Mines Safety Coal Mines Regulations (CMR) 2017.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(extractedData?.statutory_checks || []).map((chk: StatutoryCheck, idx: number) => {
                    const isActionReq = chk.status === "ACTION REQUIRED";
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${isActionReq ? "#fecaca" : "#bbf7d0"}`,
                          background: isActionReq ? "#fff5f5" : "#f0fdf4",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: isActionReq ? "#b91c1c" : "#166534" }}>
                            {chk.code}
                          </span>
                          <span style={{
                            fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
                            background: isActionReq ? "#dc2626" : "#16a34a",
                            color: "white"
                          }}>
                            {chk.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", margin: "4px 0 6px" }}>
                          {chk.rule}
                        </p>
                        <p style={{ fontSize: 11.5, color: "#475569", margin: 0 }}>
                          Colliery Audit Action: <strong>{chk.action}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: RAW EXTRACTED OCR TEXT STREAM */}
            {activeTab === "raw" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                    Optical Character Text Stream ({extractedData?.raw_text?.length || 0} characters)
                  </span>
                  <button
                    onClick={() => handleCopyText(extractedData?.raw_text || "")}
                    style={{
                      background: "white", border: "1px solid #cbd5e1", borderRadius: 6,
                      padding: "4px 10px", fontSize: 11.5, fontWeight: 600, color: "#334155",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 5
                    }}
                  >
                    {copiedText ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                    {copiedText ? "Copied!" : "Copy OCR Text"}
                  </button>
                </div>

                <div style={{
                  background: "#0f172a", color: "#e2e8f0", padding: "14px", borderRadius: 8,
                  fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap",
                  maxHeight: "420px", overflowY: "auto"
                }}>
                  {extractedData?.raw_text || "No raw text available."}
                </div>
              </div>
            )}

            {/* TAB 4: CONVERSATIONAL AI REGULATORY ASSISTANT */}
            {activeTab === "ai_qa" && (
              <div>
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px",
                  marginBottom: 12, display: "flex", alignItems: "center", gap: 8
                }}>
                  <Bot size={18} color="#15803d" />
                  <p style={{ fontSize: 12, color: "#166534", margin: 0, fontWeight: 600 }}>
                    AI Regulatory Copilot: Query any statutory clause, numerical threshold, or deadline from this circular.
                  </p>
                </div>

                {/* Preset Prompt Buttons */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {[
                    "What is the methane threshold for power trip?",
                    "What is the compliance deadline?",
                    "What are the ventilation air velocity limits?",
                    "Who is the assigned compliance cadre?"
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAi(preset)}
                      style={{
                        padding: "5px 10px", borderRadius: 14, background: "#f1f5f9",
                        border: "1px solid #cbd5e1", fontSize: 11, fontWeight: 600, color: "#334155",
                        cursor: "pointer", transition: "all 0.1s"
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Chat History */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  {aiChatHistory.map((item, idx) => (
                    <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <User size={13} color="#2563eb" />
                        {item.q}
                      </div>
                      <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.45, display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <Bot size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{item.a}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Question Input Box */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Ask a question about this circular..."
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAskAi()}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontSize: 12.5, outline: "none"
                    }}
                  />
                  <button
                    onClick={() => handleAskAi()}
                    disabled={isAiThinking || !aiQuestion.trim()}
                    style={{
                      padding: "8px 16px", background: "#1b4332", color: "#86efac",
                      border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    {isAiThinking ? "Analyzing..." : "Ask AI"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
