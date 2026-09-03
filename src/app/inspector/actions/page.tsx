"use client";

import {
  ListChecks, CheckCircle, Clock, AlertTriangle, User,
  Calendar, Plus, Search, Filter, X, CheckSquare, Trash2
} from "lucide-react";
import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  relatedTo: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

const initialTasks: Task[] = [
  { id: "ACT-043", title: "Verify repair of ventilation fan at Underground Level 3",   relatedTo: "VIO-124", due: "May 20, 2025", priority: "High",   done: false },
  { id: "ACT-047", title: "Confirm fire drill completed – all sections",                relatedTo: "INS-038", due: "May 22, 2025", priority: "High",   done: false },
  { id: "ACT-044", title: "Re-inspect gas detection sensors after calibration",         relatedTo: "VIO-124", due: "May 20, 2025", priority: "High",   done: false },
  { id: "ACT-046", title: "Review and counter-sign fortnightly compliance report",     relatedTo: "—",       due: "May 21, 2025", priority: "Medium", done: false },
  { id: "ACT-039", title: "Inspect fixed electrical wiring in junction box panel",     relatedTo: "VIO-122", due: "May 21, 2025", priority: "High",   done: false },
  { id: "ACT-045", title: "Validate replacement of fire extinguishers – Workshop Bay 3",relatedTo: "VIO-127", due: "May 21, 2025", priority: "High",   done: false },
  { id: "ACT-040", title: "Verify first aid kit restocking at 4 surface stations",     relatedTo: "—",       due: "May 22, 2025", priority: "Medium", done: false },
  { id: "ACT-036", title: "Check new signage installation at Level 3 entry points",    relatedTo: "INS-036", due: "May 24, 2025", priority: "Medium", done: true  },
  { id: "ACT-048", title: "Attend weekly toolbox talk – crew supervisors",             relatedTo: "—",       due: "May 26, 2025", priority: "Low",    done: true  },
];

const priorityStyle = (p: string) => {
  if (p === "High")   return { color: "#dc2626", bg: "#fee2e2" };
  if (p === "Medium") return { color: "#ea580c", bg: "#fff7ed" };
  return                     { color: "#16a34a", bg: "#dcfce7" };
};

export default function InspectorActionsPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Pending" | "High" | "Completed">("All");
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync tasks from static initialTasks + custom actions in localStorage
  const syncTasks = () => {
    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      const customActions = stored ? JSON.parse(stored) : [];

      const mappedCustom: Task[] = customActions.map((a: any) => ({
        id: a.id,
        title: a.title,
        relatedTo: a.relatedTo || "—",
        due: a.due,
        priority: a.priority || "Medium",
        done: a.status === "On Track"
      }));

      // Deduplicate by ID
      const taskMap = new Map<string, Task>();
      mappedCustom.forEach(t => taskMap.set(t.id, t));
      initialTasks.forEach(t => {
        if (!taskMap.has(t.id)) taskMap.set(t.id, t);
      });

      setTasks(Array.from(taskMap.values()));
    } catch (e) {}
  };

  useEffect(() => {
    syncTasks();
    window.addEventListener("storage", syncTasks);
    window.addEventListener("focus", syncTasks);
    return () => {
      window.removeEventListener("storage", syncTasks);
      window.removeEventListener("focus", syncTasks);
    };
  }, []);

  // New Action Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newDue, setNewDue] = useState("May 22, 2025");
  const [newRelated, setNewRelated] = useState("VIO-128");

  const toggle = (id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, done: !t.done } : t));
      const target = updated.find(t => t.id === id);
      if (target) {
        try {
          const stored = localStorage.getItem("mineguard_custom_actions");
          const existing = stored ? JSON.parse(stored) : [];
          const customIdx = existing.findIndex((a: any) => a.id === id);
          if (customIdx >= 0) {
            existing[customIdx].status = target.done ? "On Track" : "Due Soon";
            localStorage.setItem("mineguard_custom_actions", JSON.stringify(existing));
          }
        } catch (e) {}
      }
      return updated;
    });
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      if (stored) {
        const existing = JSON.parse(stored);
        const filtered = existing.filter((a: any) => a.id !== id);
        localStorage.setItem("mineguard_custom_actions", JSON.stringify(filtered));
      }
    } catch (e) {}
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newId = `ACT-${Math.floor(100 + Math.random() * 899)}`;
    const newTaskItem = {
      id: newId,
      title: newTitle.trim(),
      assignee: "Field Safety Inspector",
      due: newDue,
      priority: newPriority,
      category: "Inspection Follow-up",
      relatedTo: newRelated || "—",
      status: "Due Soon"
    };

    try {
      const stored = localStorage.getItem("mineguard_custom_actions");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("mineguard_custom_actions", JSON.stringify([newTaskItem, ...existing.filter((a: any) => a.id !== newId)]));
    } catch (err) {}

    syncTasks();
    setShowModal(false);
    setNewTitle("");
    setToastMsg(`Action ${newId} created successfully and synchronized with Mine Manager!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const done    = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const high    = tasks.filter(t => t.priority === "High" && !t.done).length;
  const progressPct = Math.round((done / (tasks.length || 1)) * 100);

  const filteredTasks = tasks.filter(t => {
    const matchesTab =
      filterTab === "All" ||
      (filterTab === "Pending" && !t.done) ||
      (filterTab === "High" && t.priority === "High" && !t.done) ||
      (filterTab === "Completed" && t.done);

    const matchesQuery = !query || [t.id, t.title, t.relatedTo, t.priority].some(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );

    return matchesTab && matchesQuery;
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0f2318",
          color: "white",
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
          animation: "toastPop 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <CheckCircle size={16} color="#52b788" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Assigned Corrective Actions</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Remediation checklist and compliance verification assignments.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            background: "#2d6a4f",
            color: "white",
            border: "none",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={15} /> Add Action Item
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Tasks",   value: tasks.length, color: "#2d6a4f", bg: "#e8f5ee", tab: "All" },
          { label: "Pending Tasks", value: pending,      color: "#ea580c", bg: "#fff7ed", tab: "Pending" },
          { label: "High Priority", value: high,         color: "#dc2626", bg: "#fee2e2", tab: "High" },
          { label: "Completed",     value: done,         color: "#16a34a", bg: "#dcfce7", tab: "Completed" },
        ].map(c => (
          <div
            key={c.label}
            onClick={() => setFilterTab(c.tab as any)}
            style={{
              background: "white",
              border: `1.5px solid ${filterTab === c.tab ? c.color : "var(--border)"}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
              boxShadow: filterTab === c.tab ? `0 4px 16px ${c.color}25` : "var(--shadow-xs)"
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.6 }} />
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{c.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar Card */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, boxShadow: "var(--shadow-xs)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckSquare size={16} color="#2d6a4f" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>Resolution Progress</span>
        </div>
        <div style={{ flex: 1, height: 8, background: "var(--surface-2)", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: "#52b788", borderRadius: 5, transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#2d6a4f", whiteSpace: "nowrap" }}>
          {done}/{tasks.length} ({progressPct}%)
        </span>
      </div>

      {/* Task List Container */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        {/* Controls Bar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "All", label: `All (${tasks.length})` },
              { id: "Pending", label: `Pending (${pending})` },
              { id: "High", label: `High Priority (${high})` },
              { id: "Completed", label: `Completed (${done})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: filterTab === tab.id ? "#2d6a4f" : "#f3f4f6",
                  color: filterTab === tab.id ? "white" : "#4b5563",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
            <Search size={13} color="#9ca3af" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search action items…"
              style={{ border: "none", outline: "none", fontSize: 12, color: "#111827", background: "transparent", width: 150 }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
                <X size={12} color="#9ca3af" />
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: "36px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              No tasks match your filter.
            </div>
          ) : (
            filteredTasks.map((task, i) => {
              const ps = priorityStyle(task.priority);
              return (
                <div
                  key={`${task.id}-${i}`}
                  onClick={() => toggle(task.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "14px 20px",
                    borderBottom: i < filteredTasks.length - 1 ? "1px solid #f9fafb" : "none",
                    cursor: "pointer",
                    background: task.done ? "#fafafa" : "white",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => !task.done && (e.currentTarget.style.background = "#fcfdfc")}
                  onMouseLeave={e => !task.done && (e.currentTarget.style.background = "white")}
                >
                  {/* Interactive Checkbox */}
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: task.done ? "#52b788" : "white",
                      border: `2px solid ${task.done ? "#52b788" : "#d1d5db"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      transition: "all 0.15s",
                    }}
                  >
                    {task.done && <CheckCircle size={14} color="white" />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#2d6a4f" }}>{task.id}</span>
                      <span style={{ padding: "2px 7px", borderRadius: 12, fontSize: 10.5, fontWeight: 700, background: ps.bg, color: ps.color }}>
                        {task.priority} Priority
                      </span>
                      {task.relatedTo !== "—" && (
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>
                          re: <strong style={{ color: "#4b5563" }}>{task.relatedTo}</strong>
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: task.done ? "#9ca3af" : "#111827",
                      textDecoration: task.done ? "line-through" : "none",
                      marginTop: 4,
                      lineHeight: 1.45,
                    }}>
                      {task.title}
                    </p>

                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af", marginTop: 5 }}>
                      <Calendar size={11} /> Due {task.due}
                    </span>
                  </div>

                  <button
                    onClick={(e) => deleteTask(task.id, e)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#d1d5db" }}
                    title="Delete task"
                    onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#d1d5db")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: New Action Item */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}>
          <div style={{ background: "white", borderRadius: 14, maxWidth: 460, width: "100%", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "16px 20px", background: "#0f2318", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} color="#52b788" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Add Corrective Action</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTask} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Action Item Title</label>
                <textarea
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Conduct secondary acoustic test on haul truck CAT 789D"
                  required
                  rows={2}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa" }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Related To</label>
                  <input
                    value={newRelated}
                    onChange={e => setNewRelated(e.target.value)}
                    placeholder="e.g. VIO-128 or —"
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Due Date</label>
                <input
                  value={newDue}
                  onChange={e => setNewDue(e.target.value)}
                  placeholder="e.g. May 22, 2025"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, background: "#fafafa", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: "10px", background: "#2d6a4f", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
