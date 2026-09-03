"use client";
import { useState, useEffect } from "react";
import { ListChecks, Plus, Clock, CheckCircle, AlertTriangle, User, Calendar } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

type Action = { id: string; title: string; assignee: string; due: string; priority: string; category: string; relatedTo: string; status?: string };
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

  // Sync custom actions with storage and handle cross-tab updates
  const syncActions = () => {
    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      const customActions: Action[] = stored ? JSON.parse(stored) : [];

      // Deduplicate custom actions by id
      const uniqueCustomMap = new Map<string, Action>();
      customActions.forEach(a => {
        if (a && a.id) uniqueCustomMap.set(a.id, a);
      });
      const uniqueCustom = Array.from(uniqueCustomMap.values());

      setColumnsData(
        actions.map(col => {
          const colItems = [...col.items];
          const existingIds = new Set(colItems.map(i => i.id));
          const colCustom = uniqueCustom.filter(
            a => (a.status || "Due Soon") === col.status && !existingIds.has(a.id)
          );
          return { ...col, items: [...colCustom, ...colItems] };
        })
      );
    } catch (e) {}
  };

  useEffect(() => {
    syncActions();
    window.addEventListener("storage", syncActions);
    window.addEventListener("focus", syncActions);
    return () => {
      window.removeEventListener("storage", syncActions);
      window.removeEventListener("focus", syncActions);
    };
  }, []);

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAction: Action = {
      id: `ACT-${Math.floor(100 + Math.random() * 899)}`,
      title: title.trim(),
      assignee,
      due,
      priority,
      category,
      relatedTo: relatedTo.trim() || "—",
      status
    };

    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      const existing: Action[] = stored ? JSON.parse(stored) : [];
      const updated = [newAction, ...existing.filter(item => item.id !== newAction.id)];
      localStorage.setItem("mineguard_custom_actions", JSON.stringify(updated));
    } catch (err) {}

    syncActions();

    setShowAddModal(false);
    setTitle("");
    setToastMsg(`Action ${newAction.id} successfully added to "${status}" queue!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const totals = columnsData.map(col => col.items.length);
  const total  = totals.reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#0a1f13", color: "white",
          padding: "12px 20px", borderRadius: 12, border: "1px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: 99999, display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600,
          animation: "toastPop 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Add Action Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(5,15,8,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 16,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "white", borderRadius: 16, width: "100%", maxWidth: 520,
            padding: "24px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            border: "1px solid var(--border)",
            animation: "fadeInScale 0.25s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(82,183,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ListChecks size={18} color="#2d6a4f" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Create Corrective Safety Action</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Statutory DGMS Remediation Item</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                  Action / Task Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Calibrate CH₄ Telemetry Sensors at Section L-3 Heading 4"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Assigned Colliery Officer <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="Er. S. Mehta (Ventilation)">Er. S. Mehta (Ventilation Officer)</option>
                    <option value="Er. R. Sharma (Safety)">Er. R. Sharma (Colliery Safety Officer)</option>
                    <option value="Er. K. Patel (Mechanical)">Er. K. Patel (Chief Mechanical Engr)</option>
                    <option value="Er. P. Gupta (Electrical)">Er. P. Gupta (Electrical Superintendant)</option>
                    <option value="Deepak Kumar (Shift Boss)">Deepak Kumar (Shift Overman)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Workflow Column <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="Overdue">Overdue (Critical Backlog)</option>
                    <option value="Due Soon">Due Soon (This Week)</option>
                    <option value="On Track">On Track (In Compliance)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Priority Level <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="High">High (Immediate Mandate)</option>
                    <option value="Medium">Medium (Routine Priority)</option>
                    <option value="Low">Low (Administrative)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Domain Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, background: "white" }}
                  >
                    <option value="Ventilation">Ventilation & Air Quality</option>
                    <option value="Fire Safety">Fire Safety & Suppression</option>
                    <option value="Equipment">HEMM Machinery Guarding</option>
                    <option value="Electrical">Electrical Switchgear & Flameproof</option>
                    <option value="Emergency">Emergency Readiness & Drills</option>
                    <option value="Training">Toolbox Talks & PPE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Target Completion Date
                  </label>
                  <input
                    type="text"
                    value={due}
                    onChange={e => setDue(e.target.value)}
                    placeholder="e.g. May 28, 2025"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 5 }}>
                    Related Violation / Directive
                  </label>
                  <input
                    type="text"
                    value={relatedTo}
                    onChange={e => setRelatedTo(e.target.value)}
                    placeholder="e.g. VIO-128 or CMR-153"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface-1)", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#2d6a4f", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(45,106,79,0.3)" }}
                >
                  <Plus size={15} /> Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Corrective Actions & CAPA</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Track remediation items and audit assignments across all colliery safety domains.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,79,0.25)", transition: "all 0.15s ease" }}
        >
          <Plus size={15} /> {t("btn.add_action", "Add Action")}
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", boxShadow: "var(--shadow-xs)" }}>
        <div>
          <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 2px" }}>Total Actions</p>
          <p style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{total}</p>
        </div>
        <div style={{ flex: 1, minWidth: 180, height: 10, background: "var(--surface-2)", borderRadius: 6, overflow: "hidden", display: "flex" }}>
          {columnsData.map(col => (
            <div key={col.status} style={{ height: "100%", width: `${(col.items.length / total) * 100}%`, background: col.color, transition: "width 0.4s ease" }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {columnsData.map(col => (
            <div key={col.status} style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: col.color }} />
              <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{col.status}: <strong style={{ color: "var(--text-primary)" }}>{col.items.length}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {columnsData.map(col => (
          <div key={col.status} style={{ background: "var(--surface-1)", borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: col.bg }}>
              {col.icon}
              <span style={{ fontSize: 13.5, fontWeight: 800, color: col.color }}>{col.status}</span>
              <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 800, color: col.color, background: "white", padding: "2px 8px", borderRadius: 20, boxShadow: "var(--shadow-xs)" }}>{col.items.length}</span>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.map((item, itemIdx) => {
                const ps = priorityStyle(item.priority);
                return (
                  <div
                    key={`${item.id}-${itemIdx}`}
                    style={{
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.15s ease",
                      boxShadow: "var(--shadow-xs)"
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
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: ps.color }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#2d6a4f" }}>{item.id}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10.5, fontWeight: 800, background: ps.bg, color: ps.color }}>{item.priority}</span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 8, margin: "0 0 8px" }}>{item.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--text-secondary)" }}>
                        <User size={11} color="var(--text-muted)" /> {item.assignee}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--text-secondary)" }}>
                        <Calendar size={11} color="var(--text-muted)" /> {item.due}
                      </span>
                    </div>
                    {item.relatedTo !== "—" && (
                      <div style={{ marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>Related: {item.relatedTo}</span>
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10.5, background: "var(--surface-2)", color: "var(--text-secondary)", fontWeight: 700 }}>{item.category}</span>
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
