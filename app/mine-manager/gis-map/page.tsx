"use client";

import GisMineMap from "@/app/components/GisMineMap";
import { Compass, MapPin, Layers, Satellite, ShieldCheck, AlertOctagon } from "lucide-react";

export default function MineManagerGisPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Compass size={20} color="#2d6a4f" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>Geospatial Mine Mapping (GIS)</h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Interactive satellite and topographic mapping across Coal India subsidiaries and colliery working benches.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>12 Telemetry Nodes Online</span>
        </div>
      </div>

      {/* Embedded Map Component */}
      <GisMineMap mode="colliery" />
    </div>
  );
}
