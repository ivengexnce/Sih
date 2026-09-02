"use client";

import GisMineMap from "@/app/components/GisMineMap";
import { Compass, Globe, ShieldCheck, MapPin } from "lucide-react";

export default function CorporateGisPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={20} color="#2d6a4f" />
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>National Coalfield GIS Surveillance</h2>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Pan-India geospatial monitoring across CIL subsidiaries (SECL, BCCL, NCL, MCL, ECL, CCL, WCL).
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>All 8 Coal Subsidiaries Linked</span>
        </div>
      </div>

      {/* Embedded Map Component */}
      <GisMineMap mode="corporate" />
    </div>
  );
}
