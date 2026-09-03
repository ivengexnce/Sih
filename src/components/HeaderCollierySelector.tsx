"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mountain, MapPin, ChevronDown, Check, Globe, AlertTriangle } from "lucide-react";
import { COLLIERY_DATABASE, CollieryProfile } from "@/lib/collieryData";
import { storageService } from "@/lib/storage";
import { useTranslation } from "./LanguageContext";

interface HeaderCollierySelectorProps {
  currentMine: string;
  onSelectMine?: (mineName: string) => void;
  variant?: "chip" | "button";
}

export default function HeaderCollierySelector({
  currentMine,
  onSelectMine,
  variant = "chip"
}: HeaderCollierySelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const activeMineName = currentMine || "Rajpura Coal Mine";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (name: string) => {
    try {
      storageService.setAllocatedMine(name);
      const session = storageService.getOfficerSession();
      if (session) {
        session.allocatedMine = name;
        storageService.setOfficerSession(session);
      }
    } catch (e) {}

    if (onSelectMine) {
      onSelectMine(name);
    } else {
      window.location.reload();
    }
    setOpen(false);
  };

  const collieries: CollieryProfile[] = Object.values(COLLIERY_DATABASE);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {variant === "chip" ? (
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          title="Click to switch active colliery"
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: open ? "#dcfce7" : "#f0fdf4",
            border: `1.5px solid ${open ? "#16a34a" : "#bbf7d0"}`,
            borderRadius: 20,
            cursor: "pointer",
            maxWidth: 240,
            transition: "all 0.15s ease",
            fontFamily: "inherit",
            textAlign: "left"
          }}
        >
          <MapPin size={13} color="#16a34a" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#15803d",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {activeMineName}
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#16a34a",
              flexShrink: 0,
              animation: "pulseDot 2s infinite"
            }}
          />
          <ChevronDown
            size={12}
            color="#15803d"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
              flexShrink: 0
            }}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          title="Click to switch active colliery"
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 12px",
            border: `1.5px solid ${open ? "#2d6a4f" : "var(--border)"}`,
            borderRadius: 8,
            background: open ? "#f0fdf4" : "white",
            cursor: "pointer",
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--text-secondary)",
            maxWidth: 240,
            overflow: "hidden",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
            textAlign: "left"
          }}
        >
          <Mountain size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1
            }}
          >
            {activeMineName}
          </span>
          <ChevronDown
            size={13}
            color="var(--text-faint)"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
              flexShrink: 0
            }}
          />
        </button>
      )}

      {/* ── Colliery Dropdown Menu ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 0,
            width: 320,
            background: "white",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 18px 45px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.05)",
            zIndex: 1000,
            overflow: "hidden",
            animation: "fadeInDown 0.18s ease"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px 14px",
              background: "#0d2015",
              borderBottom: "1px solid #1a3d28",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Globe size={14} color="#52b788" />
              <span style={{ fontSize: 12, fontWeight: 800, color: "white" }}>
                {t("CIL Monitored Collieries", "CIL Monitored Collieries")}
              </span>
            </div>
            <span style={{ fontSize: 10, color: "#86efac", fontWeight: 700 }}>
              {collieries.length} Mines Active
            </span>
          </div>

          {/* List */}
          <div style={{ maxHeight: 280, overflowY: "auto", padding: "6px" }}>
            {collieries.map(c => {
              const isSelected =
                c.name.toLowerCase() === activeMineName.toLowerCase() ||
                c.cleanName.toLowerCase() === activeMineName.toLowerCase();

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c.name)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 7,
                    border: "none",
                    background: isSelected ? "#f0fdf4" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s ease"
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: isSelected ? 800 : 600,
                          color: isSelected ? "#15803d" : "#111827",
                          margin: 0,
                          lineHeight: 1.25,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {c.name}
                      </p>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: 4,
                          background: c.subsidiary === "SECL" ? "#dbeafe" : "#fef3c7",
                          color: c.subsidiary === "SECL" ? "#1d4ed8" : "#b45309"
                        }}
                      >
                        {c.subsidiary}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, color: "#6b7280", margin: "2px 0 0 0" }}>
                      {c.type} · {c.state} · {c.complianceScore}% Statutory Compliance
                    </p>
                  </div>

                  {isSelected ? (
                    <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                  ) : c.riskLevel === "High" ? (
                    <AlertTriangle size={12} color="#dc2626" style={{ flexShrink: 0 }} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
