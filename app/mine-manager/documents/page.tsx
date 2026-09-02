"use client";
import { FileText, Plus, Search, Download, Folder, Calendar, Shield, FileCheck, BookOpen } from "lucide-react";
import { useState } from "react";

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
  const [query, setQuery] = useState("");
  const filtered = documents.filter(d =>
    !query || [d.name, d.category, d.author, d.status, d.id].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    )
  );
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Documents</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Access safety manuals, compliance documents, and procedures.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Upload Document
        </button>
      </div>

      {/* Category Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {categories.map(c => (
          <div key={c.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {c.icon}
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: c.color, marginTop: 3 }}>{c.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Document Table */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>All Documents</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5 }}>
              <Search size={13} color="#9ca3af" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documents…" style={{ border: "none", outline: "none", fontSize: 12.5, color: "#374151", background: "transparent", width: 160 }} />
            </div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["ID", "Document Name", "Category", "Last Updated", "Author", "Size", "Status", ""].map(h => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#6b7280", textAlign: "left", letterSpacing: "0.03em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => {
              const cc = catColors[doc.category];
              const sc = statusStyle(doc.status);
              return (
                <tr key={doc.id} style={{ borderTop: "1px solid #f3f4f6", cursor: "pointer" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#2d6a4f" }}>{doc.id}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Folder size={15} color="#9ca3af" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: cc.bg, color: cc.color }}>{doc.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 5 }}>
                    <Calendar size={11} /> {doc.updated}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#374151" }}>{doc.author}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#6b7280" }}>{doc.size}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: sc.bg, color: sc.color }}>{doc.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2d6a4f", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
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
