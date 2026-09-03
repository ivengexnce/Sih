"use client";
import { useState, useEffect } from "react";
import { FileText, Plus, Search, Download, Folder, Calendar, Shield, FileCheck, BookOpen, CheckCircle, UploadCloud, X } from "lucide-react";
import { storageService } from "@/lib/storage";
import { useTranslation } from "@/components/LanguageContext";

const categories = [
  { label: "Safety Manuals",  icon: <Shield size={20} color="#2d6a4f" />,   count: 14, bg: "#e8f5ee", color: "#2d6a4f" },
  { label: "Compliance Docs", icon: <FileCheck size={20} color="#2563eb" />, count: 9,  bg: "#eff6ff", color: "#2563eb" },
  { label: "Procedures",      icon: <BookOpen size={20} color="#7c3aed" />,  count: 22, bg: "#fdf4ff", color: "#7c3aed" },
  { label: "Inspection Forms",icon: <FileText size={20} color="#ea580c" />,  count: 18, bg: "#fff7ed", color: "#ea580c" },
];

const documents = [
  { id: "DOC-094", name: "Site Emergency Response Plan v3.2",          category: "Safety Manuals",  updated: "May 10, 2025", size: "3.2 MB", author: "R. Sharma",  status: "Current"  },
  { id: "DOC-093", name: "PPE Usage Handbook – Coal Mining",           category: "Safety Manuals",  updated: "Apr 20, 2025", size: "1.8 MB", author: "P. Gupta",   status: "Current"  },
  { id: "DOC-092", name: "ISO 45001 Compliance Checklist – Q2 2025",  category: "Compliance Docs", updated: "May 15, 2025", size: "0.9 MB", author: "S. Mehta",   status: "Current"  },
  { id: "DOC-091", name: "Blasting & Explosives Safety Procedure",    category: "Procedures",      updated: "Mar 5, 2025",  size: "2.4 MB", author: "K. Patel",   status: "Current"  },
  { id: "DOC-090", name: "Standard Inspection Form – Surface Area",   category: "Inspection Forms",updated: "May 1, 2025",  size: "0.5 MB", author: "R. Sharma",  status: "Current"  },
  { id: "DOC-089", name: "Ventilation & Air Quality Protocol v2.0",   category: "Procedures",      updated: "Feb 14, 2025", size: "1.6 MB", author: "S. Mehta",   status: "Under Review" },
  { id: "DOC-088", name: "DGMS Annual Return – FY 2024-25",           category: "Compliance Docs", updated: "Apr 30, 2025", size: "4.1 MB", author: "P. Gupta",   status: "Current"  },
  { id: "DOC-087", name: "Equipment Pre-Shift Inspection Checklist",  category: "Inspection Forms",updated: "May 12, 2025", size: "0.4 MB", author: "K. Patel",   status: "Current"  },
];

const catColors: Record<string, { bg: string; color: string }> = {
  "Safety Manuals":  { bg: "#e8f5ee", color: "#2d6a4f" },
  "Compliance Docs": { bg: "#eff6ff", color: "#2563eb" },
  "Procedures":      { bg: "#fdf4ff", color: "#7c3aed" },
  "Inspection Forms":{ bg: "#fff7ed", color: "#ea580c" },
};

const statusStyle = (s: string) => s === "Current"
  ? { bg: "#dcfce7", color: "#16a34a" }
  : { bg: "#fff7ed", color: "#ea580c" };

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [documentsList, setDocumentsList] = useState(documents);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Safety Manuals");
  const [author, setAuthor] = useState("Er. Rajesh Sharma");
  const [status, setStatus] = useState("Current");
  const [fileSize, setFileSize] = useState("1.4 MB");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mineguard_custom_documents");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDocumentsList([...parsed, ...documents]);
      }
      const sess = storageService.getCurrentSession();
      if (sess?.name) setAuthor(sess.name);
    } catch (e) {}
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${mb} MB`);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc = {
      id: `DOC-0${Math.floor(95 + Math.random() * 85)}`,
      name: name.trim(),
      category,
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: fileSize,
      author: author.trim() || "Er. Rajesh Sharma",
      status
    };

    const updated = [newDoc, ...documentsList];
    setDocumentsList(updated);

    try {
      const stored = localStorage.getItem("mineguard_custom_documents");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("mineguard_custom_documents", JSON.stringify([newDoc, ...existing]));
    } catch (err) {}

    setShowModal(false);
    setName("");
    setSelectedFileName(null);
    setToastMsg(`Document ${newDoc.id} (${newDoc.name}) uploaded to repository!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDownload = (doc: typeof documents[0]) => {
    const docContent = `=====================================================
MINEGUARD REPOSITORY - OFFICIAL STATUTORY DOCUMENT
=====================================================
Document ID: ${doc.id}
Document Title: ${doc.name}
Category: ${doc.category}
Uploaded / Verified By: ${doc.author}
Status: ${doc.status}
Effective Date: ${doc.updated}
Colliery Jurisdiction: Rajpura Coal Mine (SECL)

Statutory Compliance Notice:
This document has been archived in compliance with Directorate General 
of Mines Safety (DGMS) circulars, the Mines Act 1952, and Coal Mines 
Regulations 2017. Any modifications must be countersigned by the Manager.
=====================================================`;

    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.id}_${doc.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMsg(`Downloaded document ${doc.id}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Dynamic category counts
  const categoryCounts: Record<string, number> = {};
  documentsList.forEach(d => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  const dynamicCategories = categories.map(c => ({
    ...c,
    count: categoryCounts[c.label] || c.count
  }));

  const filtered = documentsList.filter(d =>
    !query || [d.name, d.category, d.author, d.status, d.id].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 10, border: "1px solid #52b788",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Upload Document Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white", borderRadius: 14, width: "100%", maxWidth: 520,
            padding: "24px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e8f5ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UploadCloud size={18} color="#2d6a4f" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>Upload Colliery Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* File Dropzone */}
              <div style={{
                border: "2px dashed #cbd5e1", borderRadius: 10, padding: "20px 14px",
                textAlign: "center", background: "#f8fafc", cursor: "pointer", position: "relative"
              }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.png,.jpg"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    opacity: 0, cursor: "pointer"
                  }}
                />
                <UploadCloud size={28} color="#2d6a4f" style={{ margin: "0 auto 6px" }} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                  {selectedFileName ? selectedFileName : "Click or drag file here to upload"}
                </p>
                <p style={{ margin: "3px 0 0 0", fontSize: 11.5, color: "#64748b" }}>
                  Supports PDF, DOCX, XLSX up to 50MB
                </p>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Document Name / Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Strata Control & Monitoring Plan (SCAMP) v2.4"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Document Category <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="Safety Manuals">Safety Manuals</option>
                    <option value="Compliance Docs">Compliance Docs</option>
                    <option value="Procedures">Procedures & SOPs</option>
                    <option value="Inspection Forms">Inspection Forms</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Statutory Lifecycle Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="Current">Current (Active)</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Signing / Submitting Officer
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#2d6a4f", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <UploadCloud size={15} /> Save & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Statutory Safety & Compliance Repository</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Access safety manuals, DGMS circulars, SOPs, and shift inspection certificates.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,79,0.25)", transition: "all 0.15s ease" }}
        >
          <Plus size={15} /> {t("btn.upload_document", "Upload Document")}
        </button>
      </div>

      {/* Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {dynamicCategories.map(c => (
          <div
            key={c.label}
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              display: "flex",
              gap: 14,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-xs)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-xs)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.6 }} />
            <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
            <div>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{c.label}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1.1 }}>{c.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Document Table */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>Active Documents ({filtered.length})</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12.5, background: "var(--surface-1)" }}>
              <Search size={13} color="var(--text-muted)" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documents…" style={{ border: "none", outline: "none", fontSize: 12, color: "var(--text-primary)", background: "transparent", width: 160 }} />
            </div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {["Doc ID", "Document Title", "Category", "Last Revised", "Authoring Officer", "File Size", "Lifecycle Status", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontWeight: 700, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => {
              const cc = catColors[doc.category] || { bg: "#f3f4f6", color: "#4b5563" };
              const sc = statusStyle(doc.status);
              return (
                <tr
                  key={doc.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--surface-2)" : "none", transition: "background 0.12s ease", cursor: "pointer" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-1)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "white")}
                >
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 800, color: "#2d6a4f" }}>{doc.id}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Folder size={15} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.color }}>{doc.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                    <Calendar size={11} /> {doc.updated}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 600 }}>{doc.author}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)" }}>{doc.size}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: sc.bg, color: sc.color }}>{doc.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => handleDownload(doc)}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#2d6a4f", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "background 0.15s" }}
                    >
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
