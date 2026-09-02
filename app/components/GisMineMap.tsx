"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Layers, ZoomIn, ZoomOut, Compass, ShieldAlert,
  Flame, Wind, Activity, ArrowRight, Eye, ChevronRight, X, Sparkles,
  Globe, Search, Navigation, Filter, Info, ShieldCheck, Cpu
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import AiRiskModal, { AiRiskTarget } from "@/app/components/AiRiskModal";
import { storageService } from "@/lib/storage";

export type MinePin = {
  id: string;
  name: string;
  subsidiary: string;
  state: string;
  coalfield: string;
  type: "Opencast" | "Underground";
  lat: number;
  lng: number;
  compliance: number;
  violations: number;
  risk: "High" | "Medium" | "Low";
  depth_m: number;
  capacity_mtpa: number;
  manpower: number;
  gassiness: "Degree I" | "Degree II" | "Degree III";
  ch4_current: number;
  co_current: number;
  description: string;
};

// 18 REAL COAL INDIA LIMITED MINES WITH ACCURATE WGS-84 GEOGRAPHIC COORDINATES
export const REAL_CIL_MINES: MinePin[] = [
  {
    id: "MINE-01",
    name: "Gevra Opencast Project",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Korba Coalfield",
    type: "Opencast",
    lat: 22.3486,
    lng: 82.5935,
    compliance: 94.2,
    violations: 3,
    risk: "Low",
    depth_m: 120,
    capacity_mtpa: 52.5,
    manpower: 3850,
    gassiness: "Degree I",
    ch4_current: 0.12,
    co_current: 8,
    description: "Asia's largest opencast coal project. Mega pit producing over 50 MTPA using heavy draglines and surface miners."
  },
  {
    id: "MINE-02",
    name: "Kusmunda Colliery",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Korba Coalfield",
    type: "Opencast",
    lat: 22.3361,
    lng: 82.6842,
    compliance: 91.8,
    violations: 5,
    risk: "Low",
    depth_m: 145,
    capacity_mtpa: 50.0,
    manpower: 3420,
    gassiness: "Degree I",
    ch4_current: 0.15,
    co_current: 11,
    description: "Major flagship surface mine adjacent to Hasdeo river basin in Korba coal belt."
  },
  {
    id: "MINE-03",
    name: "Dipka Opencast Mine",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Korba Coalfield",
    type: "Opencast",
    lat: 22.3167,
    lng: 82.5500,
    compliance: 92.4,
    violations: 4,
    risk: "Low",
    depth_m: 135,
    capacity_mtpa: 35.0,
    manpower: 2900,
    gassiness: "Degree I",
    ch4_current: 0.14,
    co_current: 9,
    description: "High-capacity continuous surface mining pit with automated silo rail-loading systems."
  },
  {
    id: "MINE-04",
    name: "Rajpura Coal Mine",
    subsidiary: "SECL",
    state: "Chhattisgarh",
    coalfield: "Bisrampur Coalfield",
    type: "Underground",
    lat: 23.2840,
    lng: 83.1520,
    compliance: 88.0,
    violations: 6,
    risk: "Medium",
    depth_m: 185,
    capacity_mtpa: 12.0,
    manpower: 1450,
    gassiness: "Degree II",
    ch4_current: 0.45,
    co_current: 18,
    description: "Statutory Model Mine equipped with continuous environmental telemetry and ventilation monitoring."
  },
  {
    id: "MINE-05",
    name: "Jharia Deep Colliery",
    subsidiary: "BCCL",
    state: "Jharkhand",
    coalfield: "Jharia Coalfield",
    type: "Underground",
    lat: 23.7420,
    lng: 86.4110,
    compliance: 82.4,
    violations: 8,
    risk: "High",
    depth_m: 380,
    capacity_mtpa: 4.2,
    manpower: 2140,
    gassiness: "Degree III",
    ch4_current: 1.35,
    co_current: 44,
    description: "Prime coking coal repository. Gassy Degree III seam with history of spontaneous heating and sub-surface fires."
  },
  {
    id: "MINE-06",
    name: "Moonidih Mechanized Mine",
    subsidiary: "BCCL",
    state: "Jharkhand",
    coalfield: "Jharia Coalfield",
    type: "Underground",
    lat: 23.7380,
    lng: 86.3530,
    compliance: 81.0,
    violations: 9,
    risk: "High",
    depth_m: 510,
    capacity_mtpa: 2.5,
    manpower: 2800,
    gassiness: "Degree III",
    ch4_current: 1.42,
    co_current: 42,
    description: "Deep underground mechanized longwall colliery operating with methane degasification systems."
  },
  {
    id: "MINE-07",
    name: "Jayant Opencast Colliery",
    subsidiary: "NCL",
    state: "Madhya Pradesh",
    coalfield: "Singrauli Coalfield",
    type: "Opencast",
    lat: 24.1130,
    lng: 82.6710,
    compliance: 93.0,
    violations: 4,
    risk: "Low",
    depth_m: 165,
    capacity_mtpa: 25.0,
    manpower: 2900,
    gassiness: "Degree I",
    ch4_current: 0.10,
    co_current: 9,
    description: "Northern Coalfields flagship pit feeding Singrauli Super Thermal Power Stations."
  },
  {
    id: "MINE-08",
    name: "Nigahi Coal Project",
    subsidiary: "NCL",
    state: "Madhya Pradesh",
    coalfield: "Singrauli Coalfield",
    type: "Opencast",
    lat: 24.1350,
    lng: 82.6280,
    compliance: 95.5,
    violations: 2,
    risk: "Low",
    depth_m: 180,
    capacity_mtpa: 21.0,
    manpower: 2650,
    gassiness: "Degree I",
    ch4_current: 0.08,
    co_current: 6,
    description: "Advanced opencast mine with GPS-enabled fleet management and overland belt conveyors."
  },
  {
    id: "MINE-09",
    name: "Dudhichua Project",
    subsidiary: "NCL",
    state: "Madhya Pradesh",
    coalfield: "Singrauli Coalfield",
    type: "Opencast",
    lat: 24.1320,
    lng: 82.7210,
    compliance: 94.0,
    violations: 3,
    risk: "Low",
    depth_m: 175,
    capacity_mtpa: 20.0,
    manpower: 2400,
    gassiness: "Degree I",
    ch4_current: 0.09,
    co_current: 7,
    description: "Inter-state open pit located on MP-UP border supplying coal directly to NTPC Vindhyachal."
  },
  {
    id: "MINE-10",
    name: "Bhubaneswari OCP",
    subsidiary: "MCL",
    state: "Odisha",
    coalfield: "Talcher Coalfield",
    type: "Opencast",
    lat: 20.9520,
    lng: 85.1950,
    compliance: 92.5,
    violations: 4,
    risk: "Medium",
    depth_m: 110,
    capacity_mtpa: 28.0,
    manpower: 1980,
    gassiness: "Degree I",
    ch4_current: 0.18,
    co_current: 14,
    description: "High-volume surface mine operating in the Brahmani river basin of Talcher coalfield."
  },
  {
    id: "MINE-11",
    name: "Ananta Colliery",
    subsidiary: "MCL",
    state: "Odisha",
    coalfield: "Talcher Coalfield",
    type: "Opencast",
    lat: 20.9230,
    lng: 85.1610,
    compliance: 89.0,
    violations: 6,
    risk: "Medium",
    depth_m: 95,
    capacity_mtpa: 15.0,
    manpower: 1720,
    gassiness: "Degree I",
    ch4_current: 0.22,
    co_current: 16,
    description: "Strategic thermal coal pit supplying key power plants in eastern and southern grid."
  },
  {
    id: "MINE-12",
    name: "Belpahar Colliery",
    subsidiary: "MCL",
    state: "Odisha",
    coalfield: "Ib Valley Coalfield",
    type: "Opencast",
    lat: 21.8210,
    lng: 83.8640,
    compliance: 91.2,
    violations: 4,
    risk: "Low",
    depth_m: 105,
    capacity_mtpa: 10.0,
    manpower: 1350,
    gassiness: "Degree I",
    ch4_current: 0.12,
    co_current: 10,
    description: "Ib Valley coal basin pit utilizing surface continuous cutting techniques."
  },
  {
    id: "MINE-13",
    name: "Raniganj Deep (Chinakoori)",
    subsidiary: "ECL",
    state: "West Bengal",
    coalfield: "Raniganj Coalfield",
    type: "Underground",
    lat: 23.6820,
    lng: 86.8480,
    compliance: 79.5,
    violations: 11,
    risk: "High",
    depth_m: 620,
    capacity_mtpa: 1.8,
    manpower: 1850,
    gassiness: "Degree III",
    ch4_current: 1.48,
    co_current: 48,
    description: "Historically India's deepest coal mine. Degree III gassy seam requiring strict CMR Reg 169 compliance."
  },
  {
    id: "MINE-14",
    name: "Rajmahal Open Cast",
    subsidiary: "ECL",
    state: "Jharkhand",
    coalfield: "Rajmahal Coalfield",
    type: "Opencast",
    lat: 25.0340,
    lng: 87.3820,
    compliance: 88.5,
    violations: 5,
    risk: "Medium",
    depth_m: 130,
    capacity_mtpa: 17.0,
    manpower: 2100,
    gassiness: "Degree I",
    ch4_current: 0.14,
    co_current: 12,
    description: "Major captive supplier for Farakka and Kahalgaon Super Thermal Power Stations."
  },
  {
    id: "MINE-15",
    name: "Piparwar Colliery",
    subsidiary: "CCL",
    state: "Jharkhand",
    coalfield: "North Karanpura Coalfield",
    type: "Opencast",
    lat: 23.7140,
    lng: 85.0480,
    compliance: 91.0,
    violations: 4,
    risk: "Low",
    depth_m: 140,
    capacity_mtpa: 16.0,
    manpower: 1650,
    gassiness: "Degree I",
    ch4_current: 0.11,
    co_current: 9,
    description: "Pioneered in-pit crushing and conveying in Indian coal mining."
  },
  {
    id: "MINE-16",
    name: "Ashoka OCP",
    subsidiary: "CCL",
    state: "Jharkhand",
    coalfield: "North Karanpura Coalfield",
    type: "Opencast",
    lat: 23.7290,
    lng: 85.0680,
    compliance: 90.5,
    violations: 5,
    risk: "Low",
    depth_m: 130,
    capacity_mtpa: 14.0,
    manpower: 1520,
    gassiness: "Degree I",
    ch4_current: 0.13,
    co_current: 11,
    description: "Modernized opencast project in the Damodar river drainage basin."
  },
  {
    id: "MINE-17",
    name: "Umrer Colliery",
    subsidiary: "WCL",
    state: "Maharashtra",
    coalfield: "Nagpur Coalfield",
    type: "Opencast",
    lat: 20.8540,
    lng: 79.3240,
    compliance: 90.2,
    violations: 5,
    risk: "Medium",
    depth_m: 125,
    capacity_mtpa: 3.5,
    manpower: 1420,
    gassiness: "Degree I",
    ch4_current: 0.16,
    co_current: 15,
    description: "Western Coalfields key unit supplying thermal power plants in Vidarbha region."
  },
  {
    id: "MINE-18",
    name: "Gondegaon Mine",
    subsidiary: "WCL",
    state: "Maharashtra",
    coalfield: "Nagpur Coalfield",
    type: "Opencast",
    lat: 21.2820,
    lng: 79.2310,
    compliance: 92.0,
    violations: 3,
    risk: "Low",
    depth_m: 115,
    capacity_mtpa: 4.2,
    manpower: 1380,
    gassiness: "Degree I",
    ch4_current: 0.12,
    co_current: 10,
    description: "Surface coal operation providing vital supply to Western Maharashtra grid."
  }
];

// GEOLOGICAL COAL BASIN POLYGONS (Damodar, Mahanadi, Singrauli, Wardha)
const COAL_BASINS = [
  {
    name: "Damodar Valley Basin (Jharia / Raniganj / Karanpura)",
    color: "#e63946",
    coords: [
      [23.55, 84.80],
      [23.85, 84.95],
      [23.90, 86.60],
      [23.75, 87.10],
      [23.50, 86.80],
      [23.45, 85.50]
    ]
  },
  {
    name: "Mahanadi-Korba Basin (Korba / Talcher / Ib Valley)",
    color: "#2a9d8f",
    coords: [
      [22.55, 82.20],
      [22.60, 83.20],
      [21.20, 85.50],
      [20.70, 85.30],
      [21.60, 83.40],
      [22.10, 82.30]
    ]
  },
  {
    name: "Son-Singrauli Basin (Singrauli / Son Valley)",
    color: "#f4a261",
    coords: [
      [24.30, 82.40],
      [24.35, 82.90],
      [23.95, 82.95],
      [23.90, 82.45]
    ]
  },
  {
    name: "Wardha-Nagpur Basin (WCL Fields)",
    color: "#9d4edd",
    coords: [
      [21.45, 78.90],
      [21.50, 79.50],
      [20.60, 79.60],
      [20.55, 79.00]
    ]
  }
];

export default function GisMineMap({ mode = "corporate" }: { mode?: "corporate" | "colliery" }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerGroupRef = useRef<any>(null);
  const basinsLayerGroupRef = useRef<any>(null);

  const [selectedSub, setSelectedSub] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePin, setActivePin] = useState<MinePin | null>(REAL_CIL_MINES[0]); // Gevra Opencast default
  const [layerType, setLayerType] = useState<"Satellite" | "Dark" | "Streets" | "Topo">("Satellite");
  const [aiModalTarget, setAiModalTarget] = useState<AiRiskTarget | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({ lat: "22.3486", lng: "82.5935" });

  // Filtered mines based on user controls
  const filteredMines = REAL_CIL_MINES.filter(m => {
    const subMatch = selectedSub === "All" || m.subsidiary === selectedSub;
    const typeMatch = selectedType === "All" || m.type === selectedType;
    const riskMatch = selectedRisk === "All" || m.risk === selectedRisk;
    const searchMatch = !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.coalfield.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subsidiary.toLowerCase().includes(searchQuery.toLowerCase());
    return subMatch && typeMatch && riskMatch && searchMatch;
  });

  // TILE URLS
  const tileConfigs: Record<string, { url: string; attribution: string; maxZoom: number }> = {
    Satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; High-Resolution Satellite World Imagery",
      maxZoom: 19
    },
    Dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO Dark Matter",
      maxZoom: 19
    },
    Streets: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    },
    Topo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenTopoMap contributors",
      maxZoom: 17
    }
  };

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Dynamic initial center: Focus on manager's allocated colliery if mode === 'colliery'
      let initialCenter: [number, number] = [22.8, 83.0];
      let initialZoom = 6;

      if (mode === "colliery") {
        try {
          const allocated = storageService.getActiveAllocatedMine();
          const matched = REAL_CIL_MINES.find(m =>
            m.name.toLowerCase().includes(allocated.toLowerCase()) ||
            allocated.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()) ||
            (allocated.toLowerCase().includes(m.subsidiary.toLowerCase()) && allocated.toLowerCase().includes(m.coalfield.split(" ")[0].toLowerCase()))
          );
          if (matched) {
            initialCenter = [matched.lat, matched.lng];
            initialZoom = 13;
            setActivePin(matched);
            setSelectedSub(matched.subsidiary);
          }
        } catch (e) {}
      }

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: true
      });

      // Custom Zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Track cursor coordinates
      map.on("mousemove", (e: any) => {
        setCursorCoords({
          lat: e.latlng.lat.toFixed(4),
          lng: e.latlng.lng.toFixed(4)
        });
      });

      // Tile Layer
      const currentConfig = tileConfigs[layerType] || tileConfigs.Satellite;
      const tileLayer = L.tileLayer(currentConfig.url, {
        attribution: currentConfig.attribution,
        maxZoom: currentConfig.maxZoom
      }).addTo(map);

      // Layer groups for markers & basins
      const markersLayer = L.layerGroup().addTo(map);
      const basinsLayer = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      (map as any)._currentTileLayer = tileLayer;
      markersLayerGroupRef.current = markersLayer;
      basinsLayerGroupRef.current = basinsLayer;

      if (isMounted) {
        setIsMapReady(true);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when layerType switches
  useEffect(() => {
    async function updateTile() {
      if (!mapInstanceRef.current) return;
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      if (map._currentTileLayer) {
        map.removeLayer(map._currentTileLayer);
      }

      const cfg = tileConfigs[layerType] || tileConfigs.Satellite;
      const newTile = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom
      }).addTo(map);

      map._currentTileLayer = newTile;
    }
    updateTile();
  }, [layerType]);

  // Render Real Markers and Basin Polygons
  useEffect(() => {
    async function renderFeatures() {
      if (!mapInstanceRef.current || !markersLayerGroupRef.current || !basinsLayerGroupRef.current) return;
      const L = (await import("leaflet")).default;

      const markersGroup = markersLayerGroupRef.current;
      const basinsGroup = basinsLayerGroupRef.current;

      markersGroup.clearLayers();
      basinsGroup.clearLayers();

      // Render Coal Basin Polygons
      COAL_BASINS.forEach(basin => {
        const poly = L.polygon(basin.coords as any, {
          color: basin.color,
          weight: 2,
          opacity: 0.8,
          fillColor: basin.color,
          fillOpacity: 0.12,
          dashArray: "6, 6"
        });
        poly.bindTooltip(`<strong>${basin.name}</strong><br>Stratigraphic Coal Deposit Zone`, {
          sticky: true,
          className: "basin-tooltip"
        });
        basinsGroup.addLayer(poly);
      });

      // Render Real Mine Markers with Custom HTML Pin & Glowing Halos
      filteredMines.forEach(mine => {
        const isHigh = mine.risk === "High";
        const isMed = mine.risk === "Medium";
        const haloColor = isHigh ? "#ef4444" : isMed ? "#f59e0b" : "#10b981";
        const pinBg = isHigh ? "#7f1d1d" : isMed ? "#78350f" : "#064e3b";

        const customIcon = L.divIcon({
          className: "custom-mine-pin",
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              <!-- Pulsing Radar Glow Ring -->
              <span style="position: absolute; inset: 0; border-radius: 50%; background: ${haloColor}; opacity: 0.45; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <!-- Outer Border Ring -->
              <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; border: 2px solid ${haloColor}; background: ${pinBg}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${haloColor};">
                <span style="font-size: 10px; font-weight: 800; color: white;">${mine.subsidiary}</span>
              </span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([mine.lat, mine.lng], { icon: customIcon });

        // Popup Content
        const popupHtml = `
          <div style="font-family: 'Inter', sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${pinBg}; color: white;">
                ${mine.subsidiary} · ${mine.coalfield}
              </span>
              <span style="font-size: 10.5px; font-weight: 700; color: ${haloColor};">
                ${mine.risk} Risk
              </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #111827;">${mine.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #6b7280;">${mine.state} · ${mine.type} (${mine.depth_m}m)</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: #f9fafb; padding: 6px; border-radius: 6px; margin-bottom: 8px;">
              <div><strong>CH₄:</strong> ${mine.ch4_current}%</div>
              <div><strong>CO:</strong> ${mine.co_current} ppm</div>
              <div><strong>Capacity:</strong> ${mine.capacity_mtpa} MT</div>
              <div><strong>Compliance:</strong> ${mine.compliance}%</div>
            </div>
            <p style="margin: 0; font-size: 10.5px; color: #2563eb; font-weight: 600;">Click card below for AI Risk Audit & Satellite Zoom</p>
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on("click", () => {
          setActivePin(mine);
        });

        markersGroup.addLayer(marker);
      });
    }

    if (isMapReady) {
      renderFeatures();
    }
  }, [isMapReady, filteredMines]);

  // Fly to selected mine
  const flyToMine = (mine: MinePin, targetZoom = 14) => {
    setActivePin(mine);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([mine.lat, mine.lng], targetZoom, {
        duration: 1.4,
        easeLinearity: 0.25
      });
    }
  };

  // Fly to Region Overview
  const flyToRegion = (lat: number, lng: number, zoomLevel: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoomLevel, {
        duration: 1.2
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Top Filter and Controls Bar */}
      <div style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        {/* Row 1: Search & Quick Region Jumper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          {/* Live Search */}
          <div style={{ position: "relative", minWidth: 280, flex: "1 1 300px" }}>
            <Search size={15} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search real mine name, subsidiary, coalfield, or state..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 12.5,
                color: "#111827",
                outline: "none",
                background: "#f9fafb"
              }}
            />
          </div>

          {/* Region Quick-Jump Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Quick Focus:</span>
            <button
              onClick={() => flyToRegion(22.8, 83.0, 6)}
              style={{ padding: "6px 11px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 11.5, fontWeight: 600, color: "#374151", cursor: "pointer" }}
            >
              🇮🇳 All India Grid
            </button>
            <button
              onClick={() => flyToRegion(22.3486, 82.5935, 13)}
              style={{ padding: "6px 11px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6, fontSize: 11.5, fontWeight: 600, color: "#065f46", cursor: "pointer" }}
            >
              🚜 Korba (Gevra Pit)
            </button>
            <button
              onClick={() => flyToRegion(23.7420, 86.4110, 13)}
              style={{ padding: "6px 11px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: 11.5, fontWeight: 600, color: "#991b1b", cursor: "pointer" }}
            >
              🔥 Jharia Basin (BCCL)
            </button>
            <button
              onClick={() => flyToRegion(24.1320, 82.6710, 12)}
              style={{ padding: "6px 11px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, fontSize: 11.5, fontWeight: 600, color: "#92400e", cursor: "pointer" }}
            >
              ⚡ Singrauli Hub (NCL)
            </button>
            <button
              onClick={() => flyToRegion(20.9520, 85.1950, 12)}
              style={{ padding: "6px 11px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 11.5, fontWeight: 600, color: "#1e40af", cursor: "pointer" }}
            >
              🏭 Talcher Basin (MCL)
            </button>
          </div>
        </div>

        {/* Row 2: Subsidiary Pills & Layer Switcher */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
          {/* Subsidiary Filter Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", marginRight: 4 }}>Subsidiary:</span>
            {["All", "SECL", "BCCL", "NCL", "MCL", "ECL", "CCL", "WCL"].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: "none",
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: selectedSub === sub ? "#0f2318" : "#f3f4f6",
                  color: selectedSub === sub ? "#86efac" : "#4b5563",
                  transition: "all 0.15s"
                }}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* REAL MAP TILE LAYER SWITCHER */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", marginRight: 4 }}>Map Imagery:</span>
            {[
              { id: "Satellite", label: "🛰️ Satellite (ESRI)" },
              { id: "Dark", label: "🗺️ Tactical Dark" },
              { id: "Streets", label: "🌐 OpenStreetMap" },
              { id: "Topo", label: "🏔️ Topographic" },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLayerType(l.id as any)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: layerType === l.id ? "1.5px solid #2563eb" : "1px solid #e5e7eb",
                  background: layerType === l.id ? "#eff6ff" : "white",
                  color: layerType === l.id ? "#1d4ed8" : "#4b5563",
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Real Map Container */}
      <div style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        height: 600,
        background: "#0a1124"
      }}>
        {/* LEAFLET MAP ELEMENT */}
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%", zIndex: 1 }} />

        {/* TOP OVERLAY CHIP: Real Coordinates & Telemetry */}
        <div style={{
          position: "absolute",
          top: 14,
          left: 14,
          zIndex: 10,
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "white",
          fontSize: 11.5,
          fontFamily: "monospace"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span style={{ fontWeight: 700, color: "#86efac" }}>REAL CIL GIS v3.0 · WGS-84</span>
          </div>
          <span>|</span>
          <span>Lat: {cursorCoords.lat}° N</span>
          <span>Lng: {cursorCoords.lng}° E</span>
          <span>|</span>
          <span style={{ color: "#93c5fd" }}>{filteredMines.length} Collieries Plotted</span>
        </div>

        {/* MAP LEGEND OVERLAY (Bottom-Left) */}
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 14,
          zIndex: 10,
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "white",
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", fontSize: 10, letterSpacing: "0.04em" }}>
            Stratigraphic Risk Code
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }} />
            <span>High Risk (Degree III Gassy Seams)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
            <span>Medium Risk (Degree II / Deep Pits)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span>Low Risk (Degree I Surface Pits)</span>
          </div>
        </div>
      </div>

      {/* SELECTED MINE DETAILED AUDIT & SATELLITE FOCUS CARD */}
      {activePin && (
        <div style={{
          marginTop: 18,
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: "20px 24px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          {/* Left: Colliery Identity */}
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: activePin.risk === "High" ? "#fee2e2" : activePin.risk === "Medium" ? "#fef3c7" : "#dcfce7",
                color: activePin.risk === "High" ? "#991b1b" : activePin.risk === "Medium" ? "#92400e" : "#166534",
                fontSize: 11,
                fontWeight: 700
              }}>
                {activePin.subsidiary} · {activePin.risk} Risk Colliery
              </span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {activePin.coalfield}, {activePin.state}
              </span>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 6px 0" }}>
              {activePin.name}
            </h3>
            <p style={{ fontSize: 12.5, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>
              {activePin.description}
            </p>
          </div>

          {/* Center: Live Subsurface Gas & Physical Telemetry */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 100 }}>
              <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600 }}>CH₄ METHANE</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: activePin.ch4_current > 1.0 ? "#dc2626" : "#059669" }}>
                {activePin.ch4_current}%
              </div>
              <div style={{ fontSize: 9.5, color: "#9ca3af" }}>DGMS Limit: 1.25%</div>
            </div>

            <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 100 }}>
              <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600 }}>CO GAS</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: activePin.co_current > 25 ? "#dc2626" : "#059669" }}>
                {activePin.co_current} ppm
              </div>
              <div style={{ fontSize: 9.5, color: "#9ca3af" }}>DGMS Limit: 50 ppm</div>
            </div>

            <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 100 }}>
              <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600 }}>ANNUAL CAPACITY</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>
                {activePin.capacity_mtpa} MT
              </div>
              <div style={{ fontSize: 9.5, color: "#9ca3af" }}>{activePin.type}</div>
            </div>

            <div style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", minWidth: 100 }}>
              <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 600 }}>COMPLIANCE</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: activePin.compliance >= 90 ? "#059669" : "#d97706" }}>
                {activePin.compliance}%
              </div>
              <div style={{ fontSize: 9.5, color: "#9ca3af" }}>{activePin.violations} Open Violations</div>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => {
                setAiModalTarget({
                  name: `${activePin.name} (${activePin.subsidiary})`,
                  ch4: activePin.ch4_current,
                  co: activePin.co_current,
                  air: 1.2,
                  depth: activePin.depth_m,
                  workers: activePin.manpower,
                  violations: activePin.violations,
                  compliance: activePin.compliance,
                  risk: activePin.risk
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 8,
                background: "#0f2318",
                color: "#86efac",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(15,35,24,0.25)"
              }}
            >
              <Cpu size={15} color="#86efac" />
              Launch AI Risk Diagnostic
            </button>

            <button
              onClick={() => flyToMine(activePin, 15)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                borderRadius: 8,
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <Eye size={14} color="#1d4ed8" />
              Zoom to High-Res Pit View
            </button>
          </div>
        </div>
      )}

      {/* REAL CIL COLLIERIES DIRECTORY GRID */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
            Plotted Coal India Limited Real Collieries ({filteredMines.length})
          </h3>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Click any colliery to fly camera and inspect satellite imagery
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
          {filteredMines.map(mine => {
            const isSelected = activePin?.id === mine.id;
            return (
              <div
                key={mine.id}
                onClick={() => flyToMine(mine, 13)}
                style={{
                  padding: "12px 14px",
                  background: isSelected ? "#f0fdf4" : "white",
                  border: `1.5px solid ${isSelected ? "#16a34a" : "#e5e7eb"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: isSelected ? "0 4px 12px rgba(22,163,74,0.15)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? "#15803d" : "#374151" }}>
                    {mine.subsidiary} · {mine.coalfield}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: mine.risk === "High" ? "#fee2e2" : mine.risk === "Medium" ? "#fef3c7" : "#dcfce7",
                    color: mine.risk === "High" ? "#991b1b" : mine.risk === "Medium" ? "#92400e" : "#166534"
                  }}>
                    {mine.risk}
                  </span>
                </div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", margin: "0 0 4px 0" }}>
                  {mine.name}
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b7280" }}>
                  <span>{mine.state} ({mine.type})</span>
                  <span>{mine.capacity_mtpa} MTPA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI RISK DIAGNOSTIC MODAL */}
      <AiRiskModal
        target={aiModalTarget}
        onClose={() => setAiModalTarget(null)}
      />
    </div>
  );
}
