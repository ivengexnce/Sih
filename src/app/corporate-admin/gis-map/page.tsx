"use client";

import { useState } from "react";
import GisMineMap from "@/components/GisMineMap";
import { Compass, Globe, ShieldCheck, MapPin } from "lucide-react";

export default function CorporateGisPage() {
  const [mode, setMode] = useState<"colliery" | "corporate">("corporate");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={20} color="#2d6a4f" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>
              {mode === "corporate" ? "National Coalfield GIS Surveillance" : "Geospatial Mine Mapping (GIS)"}
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            {mode === "corporate"
              ? "Pan-India geospatial monitoring across CIL subsidiaries (SECL, BCCL, NCL, MCL, ECL, CCL, WCL)."
              : "Interactive satellite and topographic mapping across Coal India subsidiaries and colliery working benches."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", background: "#f3f4f6", padding: 3, borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <button
              onClick={() => setMode("corporate")}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === "corporate" ? "#2d6a4f" : "transparent",
                color: mode === "corporate" ? "white" : "#4b5563"
              }}
            >
              National View
            </button>
            <button
              onClick={() => setMode("colliery")}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === "colliery" ? "#2d6a4f" : "transparent",
                color: mode === "colliery" ? "white" : "#4b5563"
              }}
            >
              Colliery View
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>
              {mode === "corporate" ? "All 8 Coal Subsidiaries Linked" : "12 Telemetry Nodes Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Map Component */}
      <GisMineMap mode={mode} />
    </div>
  );
}
