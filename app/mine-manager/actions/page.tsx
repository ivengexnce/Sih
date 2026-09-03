"use client";
import { useState, useEffect } from "react";
import { ListChecks, Plus, Clock, CheckCircle, AlertTriangle, User, Calendar } from "lucide-react";
import { useTranslation } from "@/app/components/LanguageContext";

type Action = { id: string; title: string; assignee: string; due: string; priority: string; category: string; relatedTo: string };
type Column = { status: string; color: string; bg: string; icon: React.ReactNode; items: Action[] };

const actions: Column[] = [
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
  const { t } = useTranslation();
  const [columnsData, setColumnsData] = useState(actions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("Er. S. Mehta");
  const [status, setStatus] = useState("On Track");
  const [priority, setPriority] = useState("High");
  const [category, setCategory] = useState("Ventilation");
  const [due, setDue] = useState("May 28, 2025");
  const [relatedTo, setRelatedTo] = useState("DGMS Directive");

  // Load custom actions injected from OCR digitizer or previous sessions
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      if (stored) {
        const customActions: Action[] = JSON.parse(stored);
        if (customActions.length > 0) {
          setColumnsData(prev => prev.map(col => {
            if (col.status === "Due Soon") {
              return { ...col, items: [...customActions, ...col.items] };
            }
            return col;
          }));
        }
      }
    } catch (e) {}
  }, []);

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAction: Action = {
      id: `ACT-${Math.floor(60 + Math.random() * 940)}`,
      title: title.trim(),
      assignee,
      due,
      priority,
      category,
      relatedTo: relatedTo.trim() || "—"
    };

    setColumnsData(prev => prev.map(col => {
      if (col.status === status) {
        return { ...col, items: [newAction, ...col.items] };
      }
      return col;
    }));

    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("mineguard_custom_actions", JSON.stringify([newAction, ...existing]));
    } catch (err) {}

    setShowAddModal(false);
    setTitle("");
    setToastMsg(`Action ${newAction.id} successfully added to "${status}" queue!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const totals = columnsData.map(col => col.items.length);
  const total  = totals.reduce((a, b) => a + b, 0);

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

      {/* Add Action Modal */}
      {showAddModal && (
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
                  <ListChecks size={18} color="#2d6a4f" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>Create Corrective Safety Action</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                  Action / Task Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Calibrate CH₄ Telemetry Sensors at Section L-3 Heading 4"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Assigned Colliery Officer <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="Er. S. Mehta (Ventilation)">Er. S. Mehta (Ventilation Officer)</option>
                    <option value="Er. R. Sharma (Safety)">Er. R. Sharma (Colliery Safety Officer)</option>
                    <option value="Er. K. Patel (Mechanical)">Er. K. Patel (Chief Mechanical Engr)</option>
                    <option value="Er. P. Gupta (Electrical)">Er. P. Gupta (Electrical Superintendant)</option>
                    <option value="Deepak Kumar (Shift Boss)">Deepak Kumar (Shift Overman)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Workflow Column <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="On Track">On Track (Normal Queue)</option>
                    <option value="Due Soon">Due Soon (Urgent 72 Hours)</option>
                    <option value="Overdue">Overdue (Immediate Priority)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Priority Level <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="High">High (Statutory Requirement)</option>
                    <option value="Medium">Medium (Operational Hazard)</option>
                    <option value="Low">Low (General Compliance)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Category <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value="Ventilation">Ventilation & Gases</option>
                    <option value="Fire Safety">Fire Safety & Heatings</option>
                    <option value="Equipment">HEMM & Machinery</option>
                    <option value="Electrical">Electrical Earthing</option>
                    <option value="Strata Control">Roof Bolting / Strata</option>
                    <option value="Emergency">Emergency Readiness</option>
                    <option value="PPE">Personal Protective Equipment</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Due Date <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={due}
                    onChange={e => setDue(e.target.value)}
                    placeholder="e.g. May 30, 2025"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 4 }}>
                    Related Ref / Violation ID
                  </label>
                  <input
                    type="text"
                    value={relatedTo}
                    onChange={e => setRelatedTo(e.target.value)}
                    placeholder="e.g. VIO-128 or CMR-153"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #cbd5e1", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#2d6a4f", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={15} /> Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Actions & Tasks</h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Track corrective actions across all safety areas.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(45,106,79,0.25)" }}
        >
          <Plus size={14} /> {t("btn.add_action", "Add Action")}
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 28 }}>
        <div>
          <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Total</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{total}</p>
        </div>
        <div style={{ width: "100%", maxWidth: 400, height: 12, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", display: "flex" }}>
          {columnsData.map(col => (
            <div key={col.status} style={{ height: "100%", width: `${(col.items.length / total) * 100}%`, background: col.color }} />
          ))}
        </div>
        {columnsData.map(col => (
          <div key={col.status} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
            <span style={{ fontSize: 12.5, color: "#374151" }}>{col.status}: <strong>{col.items.length}</strong></span>
          </div>
        ))}
      </div>

      {/* Kanban Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {columnsData.map(col => (
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
