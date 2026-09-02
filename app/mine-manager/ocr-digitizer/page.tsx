"use client";

import React, { useState } from "react";
import {
  FileText, Scan, CheckCircle, AlertTriangle, ArrowRight,
  UploadCloud, Sparkles, ShieldCheck, Download, Plus
} from "lucide-react";
import { scanOcrDocument } from "@/lib/api";

const sampleDocs = [
  { id: "DGMS-CIRC-2024-02", name: "DGMS Circular No. 02 of 2024 (Continuous Gas Tele-Monitoring)", authority: "DGMS Dhanbad", type: "Statutory Directive" },
  { id: "MOEF-EC-2023-781", name: "MoEFCC Environmental Clearance - 50 MTPA Gevra Project", authority: "MoEFCC New Delhi", type: "Environmental Clearance" },
  { id: "DGMS-FORM-IV-2025-08", name: "DGMS Form IV: Spontaneous Heating Notice (Heading 4)", authority: "DGMS Eastern Zone", type: "Incident Statutory Return" }
];

export default function OcrDigitizerPage() {
  const [selectedDocId, setSelectedDocId] = useState(sampleDocs[0].id);
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRunOcr = async () => {
    setScanning(true);
    const res = await scanOcrDocument(selectedDocId);
    setExtractedData(res);
    setScanning(false);
  };

  const handleInjectAction = () => {
    setToastMsg(`Statutory mandates from ${extractedData.doc_id} injected into CAPA Action Queue!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Toast */}
      {toastMsg && (
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
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Scan size={22} color="#2d6a4f" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>OCR Document Digitizer & Regulatory Parser</h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Automated text extraction from physical DGMS circulars, statutory approvals, and environmental clearances.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
          <Sparkles size={14} color="#16a34a" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>OCR Engine: Active</span>
        </div>
      </div>

      {/* Two Column Layout: Document Picker + Extracted Data */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 16 }}>
        {/* Left: Document Selector / Upload */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Select Sample Document to Scan</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {sampleDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocId(doc.id);
                  setExtractedData(null);
                }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${selectedDocId === doc.id ? "#2d6a4f" : "#e5e7eb"}`,
                  background: selectedDocId === doc.id ? "#f0fdf4" : "white",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2d6a4f" }}>{doc.id}</span>
                  <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 10, background: "#f3f4f6", color: "#6b7280" }}>{doc.type}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 4 }}>{doc.name}</p>
                <p style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{doc.authority}</p>
              </div>
            ))}
          </div>

          {/* Upload Area Mock */}
          <div style={{ border: "2px dashed #d1d5db", borderRadius: 10, padding: 22, textAlign: "center", background: "#fafafa", marginBottom: 16 }}>
            <UploadCloud size={28} color="#9ca3af" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Drag & Drop Physical Document or PDF</p>
            <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>Supports Scanned PNG, JPG, TIFF, PDF (Max 25MB)</p>
          </div>

          <button
            onClick={handleRunOcr}
            disabled={scanning}
            style={{
              width: "100%",
              padding: "11px",
              background: "#0f2318",
              color: "#86efac",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <Scan size={16} /> {scanning ? "Scanning Document with OCR..." : "Extract Statutory Metadata (OCR)"}
          </button>
        </div>

        {/* Right: Extracted Structured Data */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Structured Statutory Output</h3>
            {extractedData && (
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#dcfce7", color: "#16a34a", fontWeight: 700 }}>
                Confidence: {extractedData.ocr_confidence}%
              </span>
            )}
          </div>

          {extractedData ? (
            <div>
              <div style={{ padding: "14px", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2d6a4f" }}>{extractedData.doc_id}</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>Dated: {extractedData.date}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{extractedData.title}</h4>
                <p style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>
                  Authority: <strong>{extractedData.issuing_authority}</strong>
                </p>
                <p style={{ fontSize: 12, color: "#4b5563" }}>
                  Statutory Reference: <strong>{extractedData.statutory_reference}</strong>
                </p>
              </div>

              {/* Mandates */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", marginBottom: 8 }}>
                  Parsed Regulatory Mandates ({extractedData.mandates.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {extractedData.mandates.map((m: string, i: number) => (
                    <div key={i} style={{ padding: "9px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12.5, color: "#166534", display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontWeight: 700 }}>{i + 1}.</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleInjectAction}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#2d6a4f",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  <Plus size={14} /> Inject into CAPA Action Queue
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#9ca3af" }}>
              <Scan size={36} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
              <p style={{ fontSize: 13, fontWeight: 600 }}>No document scanned yet.</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Select a document on the left and click "Extract Statutory Metadata".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
