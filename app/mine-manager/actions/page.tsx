"use client";
import { ListChecks, Plus, Clock, CheckCircle, AlertTriangle, User, Calendar } from "lucide-react";

type Action = { id: string; title: string; assignee: string; due: string; priority: string; category: string; relatedTo: string };

const actions: { status: string; color: string; bg: string; icon: React.ReactNode; items: Action[] }[] = [
  {
    status: "Overdue", color: "#dc2626", bg: "#fee2e2", icon: <AlertTriangle size={14} color="#dc2626" />,
    items: [
      { id: "ACT-045", title: "Replace expired fire extinguishers in Workshop Bay 3",   assignee: "P. Gupta",  due: "May 17, 2025", priority: "High",   category: "Fire Safety",    relatedTo: "VIO-127" },
      { id: "ACT-043", title: "Repair ventilation fan at Underground Level 3",          assignee: "S. Mehta",  due: "May 16, 2025", priority: "High",   category: "Ventilation",    relatedTo: "VIO-124" },
      { id: "ACT-041", title: "Conduct PPE awareness training for pit area crew",       assignee: "R. Sharma", due: "May 15, 2025", priority: "Medium", category: "Training",       relatedTo: "VIO-128" },
      { id: "ACT-039", title: "Fix exposed electrical wiring in junction box panel",    assignee: "K. Patel",  due: "May 14, 2025", priority: "High",   category: "Electrical",     relatedTo: "VIO-122" },
      { id: "ACT-037", title: "Install missing guards on crusher machine drum",         assignee: "R. Sharma", due: "May 13, 2025", priority: "Medium", category: "Equipment",      relatedTo: "VIO-125" },
      { id: "ACT-035", title: "Unblock emergency exit in workshop area",               assignee: "P. Gupta",  due: "May 12, 2025", priority: "High",   category: "Emergency",      relatedTo: "VIO-127" },
    ],
  },
  {
    status: "Due Soon", color: "#ea580c", bg: "#fff7ed", icon: <Clock size={14} color="#ea580c" />,
    items: [
      { id: "ACT-047", title: "Conduct monthly fire drill – all sections",              assignee: "S. Mehta",  due: "May 22, 2025", priority: "High",   category: "Emergency",      relatedTo: "INS-038" },
      { id: "ACT-046", title: "Submit fortnightly compliance report to admin",          assignee: "R. Sharma", due: "May 21, 2025", priority: "Medium", category: "Compliance",     relatedTo: "—" },
      { id: "ACT-044", title: "Service and calibrate gas detection sensors",            assignee: "K. Patel",  due: "May 20, 2025", priority: "High",   category: "Equipment",      relatedTo: "VIO-124" },
      { id: "ACT-042", title: "Update MSDS sheets for all chemicals in storage",       assignee: "P. Gupta",  due: "May 21, 2025", priority: "Low",    category: "Documentation",  relatedTo: "—" },
      { id: "ACT-040", title: "Replenish first aid kits at 4 surface stations",        assignee: "R. Sharma", due: "May 22, 2025", priority: "Medium", category: "First Aid",      relatedTo: "—" },
      { id: "ACT-038", title: "Schedule quarterly equipment maintenance review",        assignee: "S. Mehta",  due: "May 23, 2025", priority: "Low",    category: "Equipment",      relatedTo: "—" },
      { id: "ACT-036", title: "Install signage at all Level 3 entry points",           assignee: "K. Patel",  due: "May 24, 2025", priority: "Medium", category: "Signage",        relatedTo: "INS-036" },
    ],
  },
  {
    status: "On Track", color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle size={14} color="#16a34a" />,
    items: [
      { id: "ACT-048", title: "Organise weekly toolbox talk for crew supervisors",      assignee: "R. Sharma", due: "May 26, 2025", priority: "Low",    category: "Training",       relatedTo: "—" },
      { id: "ACT-049", title: "Review and update emergency evacuation procedures",     assignee: "P. Gupta",  due: "May 28, 2025", priority: "Medium", category: "Emergency",      relatedTo: "—" },
      { id: "ACT-050", title: "Procure replacement PPE stock for Q2",                  assignee: "K. Patel",  due: "May 30, 2025", priority: "Low",    category: "PPE",            relatedTo: "—" },
    ],
  },
];

const priorityStyle = (p: string) => {
  if (p === "High")   return { color: "#dc2626", bg: "#fee2e2" };
  if (p === "Medium") return { color: "#ea580c", bg: "#fff7ed" };
  return                     { color: "#16a34a", bg: "#dcfce7" };
};

export default function ActionsPage() {
  const totals = actions.map(col => col.items.length);
  const total  = totals.reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Actions & Tasks</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Track corrective actions across all safety areas.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Add Action
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 28 }}>
        <div>
          <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Total</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{total}</p>
        </div>
        <div style={{ width: "100%", maxWidth: 400, height: 12, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", display: "flex" }}>
          {actions.map(col => (
            <div key={col.status} style={{ height: "100%", width: `${(col.items.length / total) * 100}%`, background: col.color }} />
          ))}
        </div>
        {actions.map(col => (
          <div key={col.status} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
            <span style={{ fontSize: 12.5, color: "#374151" }}>{col.status}: <strong>{col.items.length}</strong></span>
          </div>
        ))}
      </div>

      {/* Kanban Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {actions.map(col => (
          <div key={col.status} style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8, background: col.bg }}>
              {col.icon}
              <span style={{ fontSize: 13.5, fontWeight: 700, color: col.color }}>{col.status}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: col.color, background: "white", padding: "2px 8px", borderRadius: 20 }}>{col.items.length}</span>
            </div>
            <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {col.items.map(item => {
                const ps = priorityStyle(item.priority);
                return (
                  <div key={item.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#2d6a4f" }}>{item.id}</span>
                      <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 10.5, fontWeight: 600, background: ps.bg, color: ps.color }}>{item.priority}</span>
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", lineHeight: 1.4, marginBottom: 8 }}>{item.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                        <User size={10} /> {item.assignee}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                        <Calendar size={10} /> {item.due}
                      </span>
                    </div>
                    {item.relatedTo !== "—" && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 10.5, color: "#9ca3af", fontStyle: "italic" }}>Related: {item.relatedTo}</span>
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 10.5, background: "#f3f4f6", color: "#374151" }}>{item.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
