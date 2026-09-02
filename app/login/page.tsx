"use client";

import React, { useState, useEffect } from "react";
import { storageService, OfficerProfile } from "@/lib/storage";

/* ─── Design tokens ─────────────────────────────────────── */
const C = {
  bg: "#050d07",
  panel: "#060d08",
  surface: "#0b1610",
  surfaceUp: "#0f1d13",
  surfaceHigh: "#142018",
  border: "#192c1f",
  borderMid: "#274035",
  borderFocus: "#52b788",
  accent: "#52b788",
  accentBright: "#74dba8",
  accentDim: "rgba(82,183,136,0.10)",
  accentGlow: "rgba(82,183,136,0.20)",
  accentStrong: "rgba(82,183,136,0.35)",
  text: "#eef7f1",
  textSub: "#8ecba6",
  textMuted: "#4e7a60",
  textDim: "#2e5040",
  warning: "#f0c040",
  warningDim: "rgba(240,192,64,0.10)",
  error: "#f87171",
  errorDim: "rgba(248,113,113,0.10)",
};

const MINES = [
  { id: "gevra", name: "SECL Gevra Mega Opencast", state: "Chhattisgarh", type: "52.5 MTPA Flagship" },
  { id: "kusmunda", name: "SECL Kusmunda Colliery", state: "Chhattisgarh", type: "50 MTPA Opencast" },
  { id: "dipka", name: "SECL Dipka Opencast Mine", state: "Chhattisgarh", type: "35 MTPA Opencast" },
  { id: "jharia", name: "BCCL Jharia Deep Colliery", state: "Jharkhand", type: "Gassy Seam Degree III" },
  { id: "moonidih", name: "BCCL Moonidih Mechanized Mine", state: "Jharkhand", type: "Longwall Face Degree III" },
  { id: "singrauli", name: "NCL Singrauli Project", state: "Madhya Pradesh", type: "High-Capacity Opencast" },
  { id: "bhubaneswari", name: "MCL Bhubaneswari OCP", state: "Odisha", type: "28 MTPA Pit Area" },
  { id: "raniganj", name: "ECL Raniganj Deep (Chinakoori)", state: "West Bengal", type: "Deep Underground 620m" },
  { id: "piparwar", name: "CCL Piparwar Colliery", state: "Jharkhand", type: "16 MTPA In-Pit CHP" },
  { id: "umrer", name: "WCL Umrer Colliery", state: "Maharashtra", type: "3.5 MTPA Opencast" },
];

/* ─── Shaft / mine cross-section viz ────────────────────── */
function MineViz() {
  const CX = 160, CY = 290;

  const strata: [number, number, string][] = [
    [0, 68, "#0c1b10"],
    [68, 82, "#0a1610"],
    [150, 102, "#07110a"],
    [252, 88, "#050d07"],
    [340, 112, "#030a05"],
    [452, 168, "#020704"],
  ];

  const veins: [number, number, number, number, string, number][] = [
    [16, 156, 80, 232, "#c9921e", 0.38],
    [202, 164, 260, 220, "#c9921e", 0.30],
    [30, 260, 98, 328, "#52b788", 0.35],
    [220, 272, 275, 332, "#52b788", 0.28],
    [44, 358, 128, 428, "#c9921e", 0.44],
    [182, 375, 255, 440, "#c9921e", 0.34],
    [58, 465, 142, 538, "#52b788", 0.26],
  ];

  const sensorNodes: [number, number, string, number][] = [
    [72, 108, "#52b788", 0],
    [228, 192, "#52b788", 1.4],
    [55, 296, "#f0c040", 0.7],
    [245, 365, "#52b788", 2.2],
    [82, 460, "#f0c040", 0.35],
    [212, 502, "#52b788", 1.8],
  ];

  const depthMarkers: [number, string][] = [
    [152, "—120 m"],
    [252, "—210 m"],
    [342, "—310 m"],
    [454, "—420 m"],
  ];

  return (
    <svg viewBox="0 0 320 620" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#091408" />
          <stop offset="100%" stopColor="#020604" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#52b788" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#52b788" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#52b788" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="innerH" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#52b788" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#52b788" stopOpacity="0" />
        </radialGradient>
        <filter id="sg2" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="22" result="big" />
          <feGaussianBlur stdDeviation="7" result="med" in="SourceGraphic" />
          <feMerge>
            <feMergeNode in="big" />
            <feMergeNode in="med" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {strata.map(([y, h, fill], i) => (
        <rect key={i} x={0} y={y} width={320} height={h} fill={fill} />
      ))}

      {[68, 150, 252, 340, 452].map((y, i) => (
        <line key={i} x1={0} y1={y} x2={320} y2={y}
          stroke="#182a1e" strokeWidth={0.5} strokeDasharray="5 9" />
      ))}

      {veins.map(([x1, y1, x2, y2, c, o], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={c} strokeWidth={2} strokeOpacity={o} strokeDasharray="6 4" />
      ))}

      <ellipse cx={CX} cy={CY} rx={148} ry={148} fill="url(#halo)">
        <animate attributeName="opacity" values="0.65;1;0.65" dur="5.5s" repeatCount="indefinite" />
      </ellipse>

      <circle cx={CX} cy={CY} r={108}
        fill="none" stroke="#52b788" strokeWidth={0.4}
        strokeOpacity={0.13} strokeDasharray="2 16">
        <animateTransform attributeName="transform" type="rotate"
          from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`}
          dur="32s" repeatCount="indefinite" />
      </circle>

      <circle cx={CX} cy={CY} r={82}
        fill="none" stroke="#52b788" strokeWidth={0.6} strokeOpacity={0.20}>
        <animate attributeName="r" values="76;86;76" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="strokeOpacity" values="0.20;0.06;0.20" dur="4.5s" repeatCount="indefinite" />
      </circle>

      <circle cx={CX} cy={CY} r={60}
        fill="none" stroke="#52b788" strokeWidth={0.9}
        strokeOpacity={0.25} strokeDasharray="3 7">
        <animate attributeName="strokeDashoffset" values="0;-40" dur="9s" repeatCount="indefinite" />
      </circle>

      <circle cx={CX} cy={CY} r={50} fill="url(#innerH)">
        <animate attributeName="opacity" values="0.55;0.9;0.55" dur="3.8s" repeatCount="indefinite" />
      </circle>

      {[0, 90, 180, 270].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <line key={i}
          x1={CX + Math.cos(a) * 54} y1={CY + Math.sin(a) * 54}
          x2={CX + Math.cos(a) * 64} y2={CY + Math.sin(a) * 64}
          stroke="#52b788" strokeWidth={1} strokeOpacity={0.35} />;
      })}

      {[45, 135, 225, 315].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <line key={i}
          x1={CX + Math.cos(a) * 58} y1={CY + Math.sin(a) * 58}
          x2={CX + Math.cos(a) * 66} y2={CY + Math.sin(a) * 66}
          stroke="#52b788" strokeWidth={0.6} strokeOpacity={0.20} />;
      })}

      <line x1={30} y1={CY} x2={290} y2={CY}
        stroke="#52b788" strokeWidth={0.3} strokeOpacity={0.10} strokeDasharray="3 11" />

      <image
        href="/logo.webp"
        x={CX - 56} y={CY - 56}
        width={112} height={112}
        preserveAspectRatio="xMidYMid meet"
        opacity={0.38}
        filter="url(#lglow)"
        style={{ mixBlendMode: "screen" }}
      />

      <rect x={146} y={0} width={28} height={620} fill="url(#sg)" />
      <line x1={146} y1={0} x2={146} y2={620} stroke="#1e3224" strokeWidth={1} />
      <line x1={174} y1={0} x2={174} y2={620} stroke="#1e3224" strokeWidth={1} />
      <line x1={152} y1={0} x2={152} y2={620} stroke="#14211a" strokeWidth={0.5} />
      <line x1={168} y1={0} x2={168} y2={620} stroke="#14211a" strokeWidth={0.5} />

      <g>
        <rect x={149} y={2} width={22} height={30} rx={2}
          fill="#0c1a0e" stroke="#2e4c36" strokeWidth={0.9}>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,588; 0,588; 0,0"
            keyTimes="0;0.43;0.57;1" dur="9.5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.42 0 0.58 1;0 0 1 1;0.42 0 0.58 1" />
        </rect>
        <circle cx={160} cy={15} r={3.5} fill="#52b788" opacity={0.9} filter="url(#sg2)">
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,588; 0,588; 0,0"
            keyTimes="0;0.43;0.57;1" dur="9.5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.42 0 0.58 1;0 0 1 1;0.42 0 0.58 1" />
          <animate attributeName="opacity" values="0.9;0.35;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>

      {sensorNodes.map(([x, y, c, d], i) => (
        <g key={i} filter="url(#sg2)">
          <circle cx={x} cy={y} r={5} fill="none" stroke={c} strokeWidth={0.6}>
            <animate attributeName="r" values="5;24;5" dur="3.4s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3.4s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={3.8} fill={c} opacity={0.88} />
          <circle cx={x} cy={y} r={1.6} fill="#fff" opacity={0.95} />
        </g>
      ))}

      {depthMarkers.map(([y, label], i) => (
        <g key={i}>
          <line x1={184} y1={y} x2={208} y2={y} stroke="#263d2c" strokeWidth={0.7} />
          <text x={212} y={y + 4} fill="#2e5040" fontSize={8.5} fontFamily="monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Reusable field label ──────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 11 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        color: C.textSub, letterSpacing: "0.025em", marginBottom: 5,
      }}>
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 3, fontWeight: 700 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── Text input ────────────────────────────────────────── */
interface TextInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onRightClick?: () => void;
  required?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

function TextInput({
  type = "text",
  placeholder,
  value,
  onChange,
  iconLeft,
  iconRight,
  onRightClick,
  required,
  maxLength,
  autoFocus,
  style = {}
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {iconLeft && (
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          color: focused ? C.accent : C.textMuted,
          display: "flex", pointerEvents: "none", transition: "color 0.15s",
        }}>{iconLeft}</span>
      )}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: `9.5px ${iconRight ? "40px" : "12px"} 9.5px ${iconLeft ? "38px" : "12px"}`,
          background: focused ? C.surfaceHigh : C.surfaceUp,
          border: `1.5px solid ${focused ? C.borderFocus : C.borderMid}`,
          borderRadius: 9, color: C.text, fontSize: 13, outline: "none",
          transition: "all 0.15s",
          boxShadow: focused ? `0 0 0 3px ${C.accentGlow}, inset 0 1px 0 rgba(82,183,136,0.06)` : "none",
          ...style,
        }}
      />
      {iconRight && (
        <button type="button" onClick={onRightClick} style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: C.textMuted, display: "flex", padding: 2,
        }}>{iconRight}</button>
      )}
    </div>
  );
}

/* ─── SVG icon helpers ──────────────────────────────────── */
const Ico = {
  phone: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  mail: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  lock: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><rect x={3} y={11} width={18} height={11} rx={2} /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
  user: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>,
  pin: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx={12} cy={10} r={3} /></svg>,
  id: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round"><rect x={2} y={4} width={20} height={16} rx={2} /><line x1={8} y1={10} x2={16} y2={10} /><line x1={8} y1={14} x2={14} y2={14} /></svg>,
  eye: (open: boolean) => open
    ? <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} /></svg>
    : <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1={1} y1={1} x2={23} y2={23} /></svg>,
  arr: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>,
  spin: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M21 12a9 9 0 11-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite" /></path></svg>,
  chev: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>,
  shield: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  hard: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M2 18h20M6 18V9a6 6 0 0112 0v9" /><path d="M10 18v-3a2 2 0 014 0v3" /></svg>,
  clip: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
  warn: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2={12.01} y2={17} /></svg>,
  globe: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><line x1={2} y1={12} x2={22} y2={12} /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>,
  check: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>,
  alert: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12.01} y2={16} /></svg>,
};

/* ─── Persona Dock ──────────────────────────────────────── */
/* ─── PERSONAS data ─────────────────────────────────────── */
const PERSONAS = [
  {
    label: "Corp. Director",
    sub: "HQ National",
    desc: "Pan-India oversight across all CIL subsidiaries",
    iconImg: "/icons/corporate.webp",
    role: "corporate" as const,
    mine: "All CIL Subsidiaries (National Scope)",
    href: "/corporate-admin",
    color: "#52b788",
  },
  {
    label: "Er. Sharma",
    sub: "Gevra 52.5 MTPA",
    desc: "First Class Manager · SECL Gevra Mega Opencast",
    iconImg: "/icons/manager.webp",
    role: "manager" as const,
    mine: "SECL Gevra Mega Opencast",
    href: "/mine-manager",
    color: "#52b788",
  },
  {
    label: "Er. Choudhury",
    sub: "Jharia Deep Deg-III",
    desc: "First Class Manager · BCCL Jharia Deep Colliery",
    iconImg: "/icons/underground.webp",
    role: "manager" as const,
    mine: "BCCL Jharia Deep Colliery",
    href: "/mine-manager",
    color: "#52b788",
  },
  {
    label: "Insp. Smith",
    sub: "Safety Beat",
    desc: "Statutory Safety Inspector · SECL Gevra",
    iconImg: "/icons/inspector.webp",
    role: "inspector" as const,
    mine: "SECL Gevra Mega Opencast",
    href: "/inspector",
    color: "#f0c040",
  },
];

/* ─── Persona Dock ──────────────────────────────────────── */
interface PersonaDockProps {
  onPersonaClick: (
    role: "corporate" | "manager" | "inspector",
    mine: string,
    href: string
  ) => void;
}

function PersonaDock({ onPersonaClick }: PersonaDockProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    setOpen(false);
    const p = PERSONAS[idx];
    onPersonaClick(p.role, p.mine, p.href);
  };

  const active = activeIdx !== null ? PERSONAS[activeIdx] : null;

  return (
    <>
      <style>{`
        /* ── dock root ── */
        .pd-root {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* ── trigger pill ── */
        .pd-trigger {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 18px 8px 14px;
          background: rgba(11, 22, 16, 0.96);
          border: 1px solid #274035;
          border-radius: 26px;
          cursor: pointer;
          user-select: none;
          box-shadow: 0 4px 24px rgba(0,0,0,0.6), 0 0 16px rgba(82,183,136,0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .pd-trigger:hover,
        .pd-trigger.open {
          border-color: #52b788;
          box-shadow: 0 4px 24px rgba(0,0,0,0.6), 0 0 20px rgba(82,183,136,0.22);
        }
        .pd-trigger-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #52b788;
          box-shadow: 0 0 8px #52b788;
          flex-shrink: 0;
        }
        .pd-trigger-label {
          font-size: 11.5px;
          font-weight: 800;
          color: #52b788;
          letter-spacing: 0.05em;
        }

        /* active persona chip inside trigger */
        .pd-active-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px 3px 7px;
          background: rgba(82,183,136,0.15);
          border: 1px solid rgba(82,183,136,0.35);
          border-radius: 14px;
          font-size: 11px;
          font-weight: 600;
          color: #74dba8;
          white-space: nowrap;
        }

        /* hamburger lines → X */
        .pd-ham {
          display: flex;
          flex-direction: column;
          gap: 3.5px;
          width: 16px;
          flex-shrink: 0;
        }
        .pd-ham span {
          display: block;
          height: 1.5px;
          background: #52b788;
          border-radius: 2px;
          transform-origin: center;
          transition: transform 0.22s, opacity 0.18s, width 0.18s;
        }
        .pd-ham.open span:nth-child(1) {
          transform: translateY(5px) rotate(45deg);
        }
        .pd-ham.open span:nth-child(2) {
          opacity: 0; width: 0;
        }
        .pd-ham.open span:nth-child(3) {
          transform: translateY(-5px) rotate(-45deg);
        }

        /* ── dropdown card panel ── */
        .pd-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          width: 340px;
          max-width: 92vw;
          background: rgba(9, 18, 12, 0.98);
          border: 1px solid #274035;
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(82,183,136,0.12);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transform-origin: top center;
          animation: pd-drop-in 0.18s cubic-bezier(0.34, 1.26, 0.64, 1);
        }
        @keyframes pd-drop-in {
          from { opacity: 0; transform: translateX(-50%) scaleY(0.88) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) scaleY(1)    translateY(0);    }
        }
        .pd-menu-header {
          font-size: 9.5px;
          font-weight: 800;
          color: #4e7a60;
          letter-spacing: 0.08em;
          padding: 2px 6px 6px;
          border-bottom: 1px solid #192c1f;
          margin-bottom: 2px;
        }

        /* ── persona cards ── */
        .pd-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #192c1f;
          background: #0b1610;
          cursor: pointer;
          transition: border-color 0.13s, background 0.13s;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .pd-card:hover {
          border-color: #52b788;
          background: rgba(82,183,136,0.07);
        }
        .pd-card.active {
          border-color: #52b788;
          background: rgba(82,183,136,0.12);
        }
        .pd-card-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(82,183,136,0.10);
          border: 1px solid #274035;
          border-radius: 10px;
        }
        .pd-card.active .pd-card-icon {
          background: rgba(82,183,136,0.18);
          border-color: rgba(82,183,136,0.45);
        }
        .pd-card-body { flex: 1; min-width: 0; }
        .pd-card-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #eef7f1;
          margin-bottom: 1px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pd-card-sub {
          font-size: 10px;
          font-weight: 600;
          color: #52b788;
        }
        .pd-card-desc {
          font-size: 10.5px;
          color: #4e7a60;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pd-card-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          background: rgba(82,183,136,0.15);
          color: #52b788;
          border: 1px solid rgba(82,183,136,0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pd-card-badge.warn {
          background: rgba(240,192,64,0.12);
          color: #f0c040;
          border-color: rgba(240,192,64,0.28);
        }
        .pd-card-check {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #52b788;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .pd-menu { width: 96vw; }
          .pd-trigger-label { font-size: 10px; }
        }
      `}</style>

      <div className="pd-root">
        {/* ── trigger pill ── */}
        <div
          className={`pd-trigger${open ? " open" : ""}`}
          onClick={() => setOpen(o => !o)}
          role="button"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="pd-trigger-dot" />
          <span className="pd-trigger-label">DEMO PERSONAS</span>

          {/* show active persona chip when closed */}
          {active && !open && (
            <span className="pd-active-chip">
              <img src={active.iconImg} alt={active.label} style={{ width: 18, height: 18, objectFit: "contain", borderRadius: 4 }} />
              {active.label}
              <span style={{ fontSize: 9.5, color: "#4e7a60" }}>({active.sub})</span>
            </span>
          )}

          {/* hamburger / X */}
          <div className={`pd-ham${open ? " open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* ── dropdown ── */}
        {open && (
          <div className="pd-menu" role="menu">
            <div className="pd-menu-header">SELECT A DEMO PERSONA TO PREVIEW</div>

            {PERSONAS.map((p, i) => {
              const isActive = activeIdx === i;
              const isInspector = p.role === "inspector";
              return (
                <button
                  key={p.label}
                  type="button"
                  className={`pd-card${isActive ? " active" : ""}`}
                  onClick={() => handleSelect(i)}
                  role="menuitem"
                >
                  <div className="pd-card-icon">
                    <img src={p.iconImg} alt={p.label} style={{ width: 34, height: 34, objectFit: "contain" }} />
                  </div>
                  <div className="pd-card-body">
                    <div className="pd-card-name">
                      {p.label}
                      <span className="pd-card-sub">{p.sub}</span>
                    </div>
                    <div className="pd-card-desc">{p.desc}</div>
                  </div>
                  <span className={`pd-card-badge${isInspector ? " warn" : ""}`}>
                    {p.role === "corporate" ? "CORP" : p.role === "manager" ? "MGR" : "INSP"}
                  </span>
                  {isActive && (
                    <div className="pd-card-check" aria-label="Active">
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#040d06" strokeWidth={3} strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Statutory Indian Mobile Protocol Validator ────────── */
function validateIndianMobile(rawPhone: string): { valid: boolean; error?: string; cleanNumber?: string; rawDigits?: string } {
  if (!rawPhone || !rawPhone.trim()) {
    return { valid: false, error: "Enter Valid Phone Number" };
  }

  // Remove country code (+91 or 91) if entered and any formatting spaces/dashes
  let digits = rawPhone.trim().replace(/^(\+91|91)/, "").replace(/\D/g, "");

  // 1. Strict 10-digit check
  if (digits.length !== 10) {
    return { valid: false, error: "Enter Valid Phone Number" };
  }

  // 2. Real Indian mobile numbering plan (starts with 6, 7, 8, or 9)
  if (!/^[6-9]/.test(digits)) {
    return { valid: false, error: "Enter Valid Phone Number" };
  }

  // 3. Reject dummy repetitive digits (e.g. 9999999999, 8888888888, 0000000000)
  if (/^(\d)\1{9}$/.test(digits)) {
    return { valid: false, error: "Enter Valid Phone Number" };
  }

  // 4. Reject trivial sequential test numbers (e.g. 1234567890)
  if (digits === "1234567890" || digits === "0123456789") {
    return { valid: false, error: "Enter Valid Phone Number" };
  }

  return {
    valid: true,
    cleanNumber: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
    rawDigits: digits
  };
}

/* ─── Statutory Two-Factor Verification Component ───────── */
interface TwoFactorVerificationProps {
  verifyMethod: "phone" | "email";
  onSwitchMethod: (m: "phone" | "email") => void;
  maskedRecipient: string;
  generatedOtp: string;
  otpCode: string;
  onOtpChange: (c: string) => void;
  countdown: number;
  onResendOtp: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  errorMsg: string;
  successMsg: string;
  role: string;
  officerName: string;
}

function TwoFactorVerification({
  verifyMethod,
  onSwitchMethod,
  maskedRecipient,
  generatedOtp,
  otpCode,
  onOtpChange,
  countdown,
  onResendOtp,
  onSubmit,
  onBack,
  loading,
  errorMsg,
  successMsg,
  role,
  officerName,
}: TwoFactorVerificationProps) {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h2 style={{
            color: C.text, fontSize: 22, fontWeight: 800,
            letterSpacing: "-0.02em", lineHeight: 1, margin: 0,
          }}>
            2FA Verification
          </h2>
          <span style={{
            display: "inline-block", fontSize: 9.5, fontWeight: 700,
            color: C.accent, background: C.accentDim,
            border: `1px solid ${C.accentStrong}`,
            padding: "2px 8px", borderRadius: 20, textTransform: "uppercase",
          }}>
            CMR 2017 SECURE
          </span>
        </div>
        <p style={{ color: C.textSub, fontSize: 12.5, margin: "4px 0 0 0" }}>
          Statutory clearance for <strong>{officerName}</strong> ({role.toUpperCase()}).
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "9px 12px", borderRadius: 8, marginBottom: 12,
          background: C.errorDim, border: `1px solid rgba(248,113,113,0.25)`,
          color: "#fca5a5", fontSize: 12.5,
        }}>
          {Ico.alert}{errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "9px 12px", borderRadius: 8, marginBottom: 12,
          background: "rgba(82,183,136,0.08)",
          border: `1px solid rgba(82,183,136,0.30)`,
          color: C.accentBright, fontSize: 12.5,
        }}>
          {Ico.check}{successMsg}
        </div>
      )}

      {/* Verification Channel Switcher (Phone vs Email) */}
      <div style={{
        display: "flex", background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: 3, marginBottom: 14, gap: 4
      }}>
        <button
          type="button"
          onClick={() => onSwitchMethod("phone")}
          style={{
            flex: 1, padding: "8px 10px", borderRadius: 7,
            background: verifyMethod === "phone" ? C.accent : "transparent",
            color: verifyMethod === "phone" ? "#040d06" : C.textMuted,
            fontSize: 12.5, fontWeight: 700, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s",
            boxShadow: verifyMethod === "phone" ? `0 2px 10px ${C.accentGlow}` : "none",
          }}
        >
          <span>{Ico.phone}</span>
          <span>Mobile Phone OTP</span>
        </button>
        <button
          type="button"
          onClick={() => onSwitchMethod("email")}
          style={{
            flex: 1, padding: "8px 10px", borderRadius: 7,
            background: verifyMethod === "email" ? C.accent : "transparent",
            color: verifyMethod === "email" ? "#040d06" : C.textMuted,
            fontSize: 12.5, fontWeight: 700, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s",
            boxShadow: verifyMethod === "email" ? `0 2px 10px ${C.accentGlow}` : "none",
          }}
        >
          <span>{Ico.mail}</span>
          <span>Govt. Email OTP</span>
        </button>
      </div>

      {/* Target Recipient Card */}
      <div style={{
        padding: "12px 14px", background: C.surfaceUp, border: `1px solid ${C.borderMid}`,
        borderRadius: 10, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: C.accentDim,
            border: `1px solid ${C.accentStrong}`, display: "flex", alignItems: "center", justifyContent: "center",
            color: C.accent
          }}>
            {verifyMethod === "phone" ? Ico.phone : Ico.mail}
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: C.textMuted, textTransform: "uppercase", fontWeight: 700 }}>
              {verifyMethod === "phone" ? "SMS Dispatched to" : "Govt. Email Dispatched to"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 1 }}>
              {maskedRecipient}
            </div>
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, color: C.accentBright,
          background: C.accentDim, padding: "3px 8px", borderRadius: 10, border: `1px solid ${C.accentStrong}`
        }}>
          ACTIVE
        </span>
      </div>

      {/* Simulated OTP Token Box with 1-Click Auto-Fill */}
      <div style={{
        padding: "10px 12px", background: "rgba(82,183,136,0.08)",
        border: `1px solid rgba(82,183,136,0.25)`, borderRadius: 9,
        marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ color: C.accent, display: "flex" }}>{Ico.lock}</span>
          <span style={{ fontSize: 12, color: C.textSub }}>
            Simulated OTP: <strong style={{ color: C.accentBright, letterSpacing: "0.15em", fontSize: 13 }}>{generatedOtp}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOtpChange(generatedOtp)}
          style={{
            background: C.accent, color: "#040d06", border: "none",
            borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 800,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}
        >
          ⚡ Auto-fill
        </button>
      </div>

      {/* OTP Form */}
      <form onSubmit={onSubmit}>
        <Field label="Enter 6-digit statutory OTP code">
          <TextInput
            required
            autoFocus
            maxLength={6}
            placeholder="••••••"
            value={otpCode}
            onChange={e => onOtpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
            iconLeft={Ico.shield}
          />
        </Field>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 16px" }}>
          <span style={{ fontSize: 11.5, color: C.textMuted }}>
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "OTP expired"}
          </span>
          <button
            type="button"
            onClick={onResendOtp}
            disabled={countdown > 0}
            style={{
              background: "none", border: "none", color: countdown > 0 ? C.textDim : C.accent,
              fontSize: 11.5, fontWeight: 700, cursor: countdown > 0 ? "default" : "pointer",
              padding: 0
            }}
          >
            Resend code
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || otpCode.length < 6}
          style={{
            width: "100%", padding: "12px 14px",
            background: loading || otpCode.length < 6
              ? C.surfaceHigh
              : `linear-gradient(135deg, ${C.accentBright} 0%, ${C.accent} 60%, #3da572 100%)`,
            color: loading || otpCode.length < 6 ? C.textMuted : "#040d06",
            border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 800,
            cursor: loading || otpCode.length < 6 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: loading || otpCode.length < 6 ? "none" : `0 4px 20px rgba(82,183,136,0.28)`
          }}
        >
          {loading ? <>{Ico.spin} Verifying security token…</> : <>Verify & Authorize Portal Access {Ico.arr}</>}
        </button>

        <button
          type="button"
          onClick={onBack}
          style={{
            width: "100%", marginTop: 12, padding: "8px", background: "none",
            border: "none", color: C.textMuted, fontSize: 12, fontWeight: 600,
            cursor: "pointer"
          }}
        >
          ← Back to sign in credentials
        </button>
      </form>
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"corporate" | "manager" | "inspector">("manager");
  const [signinMethod, setSigninMethod] = useState<"email" | "phone">("email");
  const [signinPhone, setSigninPhone] = useState("9876543210");
  const [email, setEmail] = useState("manager@secl.gov.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authId, setAuthId] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [mine, setMine] = useState("SECL Gevra Mega Opencast");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Two-Factor Authentication (2FA) State ──
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<"phone" | "email">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("749215");
  const [countdown, setCountdown] = useState(45);
  const [pendingSession, setPendingSession] = useState<{
    officerSession: OfficerProfile;
    targetRoute: string;
    targetMine: string;
  } | null>(null);

  // ── OTP Timer Countdown ──
  useEffect(() => {
    let timer: any;
    if (isVerifying && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isVerifying, countdown]);

  const handleRoleSelect = (newRole: "corporate" | "manager" | "inspector") => {
    setRole(newRole);
    if (newRole === "corporate") {
      setEmail("director@coalindia.in");
      setPhone("+91 98111 20490");
      setSigninPhone("9811120490");
    } else if (newRole === "manager") {
      setEmail("manager@secl.gov.in");
      setPhone("+91 98765 43210");
      setSigninPhone("9876543210");
    } else {
      setEmail("inspector@dgms.gov.in");
      setPhone("+91 87654 32109");
      setSigninPhone("8765432109");
    }
  };

  const roleConf = [
    { id: "corporate" as const, label: "Corporate Admin", sub: "All India", icon: Ico.shield },
    { id: "manager" as const, label: "Mine Manager", sub: "Single mine", icon: Ico.hard },
    { id: "inspector" as const, label: "Safety Inspector", sub: "Single mine", icon: Ico.clip },
  ];

  const selMine = MINES.find(m => m.name === mine);
  const appointedManager = (mode === "signup" && role === "manager")
    ? storageService.getAppointedManagerForMine(mine)
    : undefined;

  /* ── form submit → triggers 2FA ONLY IF PASSWORD IS VALID ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. REGISTRATION PROTOCOL CHECKS
    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Registration protocol: Full name & designation is mandatory.");
        return;
      }

      if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
        setErrorMsg("Registration protocol: Please provide a valid institutional email address.");
        return;
      }

      // STRICT 10-DIGIT REAL MOBILE PROTOCOL
      const phoneValidation = validateIndianMobile(signupPhone);
      if (!phoneValidation.valid) {
        setErrorMsg(phoneValidation.error || "Enter Valid Phone Number");
        return;
      }

      if (!authId.trim()) {
        setErrorMsg("Compliance protocol: Statutory DGMS Certificate / Authorization ID is mandatory.");
        return;
      }

      if (!signupPass || signupPass.length < 6) {
        setErrorMsg("Security protocol: Registration password must be at least 6 characters long.");
        return;
      }
    }

    // 2. SIGNIN PASSWORD PROTOCOL (ONLY PROCEED TO 2FA IF PASSWORD IS CORRECT)
    if (mode === "signin") {
      if (!password || !password.trim()) {
        setErrorMsg("Password is required. Please enter your password to proceed.");
        return;
      }

      const inputQuery = (email || "").trim().toLowerCase();
      const queryDigits = inputQuery.replace(/^(\+91|91)/, "").replace(/\D/g, "");

      // Look up existing registered accounts
      const officers = storageService.getAllOfficers();
      const matched = officers.find(o => {
        const oEmail = (o.email || "").trim().toLowerCase();
        const oPhoneDigits = (o.phone || "").replace(/^(\+91|91)/, "").replace(/\D/g, "");
        return oEmail === inputQuery || (queryDigits.length === 10 && oPhoneDigits === queryDigits);
      });

      // Default demo role passwords & standard fallbacks
      const validDemoPasswords: Record<string, string[]> = {
        corporate: ["director123", "admin123", "cil2024", "mineguard"],
        manager: ["manager123", "gevra123", "secl2024", "mineguard"],
        inspector: ["inspector123", "dgms123", "safety2024", "mineguard"],
      };

      const acceptedPasswords = [
        ...(validDemoPasswords[role] || []),
        matched?.password,
      ].filter(Boolean) as string[];

      const isPasswordCorrect = acceptedPasswords.includes(password.trim());

      if (!isPasswordCorrect) {
        setErrorMsg(
          `Incorrect password for ${roleConf.find(r => r.id === role)?.label}. Demo password is: ${role}123 (or your registered password).`
        );
        return; // STRICT BLOCK: DOES NOT PROCEED TO 2FA!
      }
    }

    // ONLY REACHED IF PASSWORD & REGISTRATION PROTOCOLS ARE 100% VALID
    setLoading(true);

    const targetMine = role === "corporate" ? "All CIL Subsidiaries (National Scope)" : mine;
    const targetRoute = role === "corporate" ? "/corporate-admin" : role === "inspector" ? "/inspector" : "/mine-manager";

    const verifiedPhone = mode === "signup"
      ? validateIndianMobile(signupPhone).cleanNumber!
      : (phone || (role === "corporate" ? "+91 98111 20490" : role === "manager" ? "+91 98765 43210" : "+91 87654 32109"));

    const officerSession: OfficerProfile = {
      name: mode === "signup" ? fullName.trim() : (role === "corporate" ? "Corporate Director" : role === "manager" ? "Er. Rajesh Sharma" : "Inspector A. Smith"),
      email: mode === "signup" ? signupEmail.trim() : (email || (role === "corporate" ? "director@coalindia.in" : role === "manager" ? "manager@secl.gov.in" : "inspector@dgms.gov.in")),
      phone: verifiedPhone,
      password: mode === "signup" ? signupPass : password,
      role,
      securityRole: role === "corporate" ? "Corporate Safety Directorate" : role === "manager" ? "First Class Colliery Manager" : "Statutory Safety Inspector",
      allocatedMine: targetMine,
      designation: role === "corporate" ? "Director (Technical/Safety)" : role === "manager" ? "First Class Mine Manager" : "Safety Inspector",
      officialId: authId || (role === "corporate" ? "CIL-DIR-9021" : role === "manager" ? "DGMS-FCC-7721" : "DGMS-INSP-4011"),
      registeredAt: new Date().toISOString(),
    };

    // Generate statutory 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCode("");
    setCountdown(45);
    setPendingSession({ officerSession, targetRoute, targetMine });

    setTimeout(() => {
      setLoading(false);
      setIsVerifying(true);
    }, 450);
  };

  /* ── verify 2FA code ── */
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim() !== generatedOtp) {
      setErrorMsg("Invalid OTP code. Please enter the valid 6-digit verification code.");
      return;
    }

    if (!pendingSession) return;

    setErrorMsg("");
    setLoading(true);

    try {
      storageService.saveCurrentSession(pendingSession.officerSession);
      storageService.setActiveAllocatedMine(pendingSession.targetMine);
      if (mode === "signup") {
        storageService.saveAccount({
          fullName: pendingSession.officerSession.name,
          email: pendingSession.officerSession.email,
          phone: pendingSession.officerSession.phone,
          password: pendingSession.officerSession.password,
          role: pendingSession.officerSession.role,
          securityRole: pendingSession.officerSession.securityRole,
          allocatedMine: pendingSession.targetMine,
          designation: pendingSession.officerSession.designation,
          registeredAt: pendingSession.officerSession.registeredAt,
        });
      }
    } catch (err) {
      console.error("Storage error:", err);
    }

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(mode === "signup"
        ? `Identity verified! Welcome, ${fullName}. Portal clearance granted.`
        : `Identity verified! Authenticated as ${pendingSession.officerSession.name}. Redirecting…`);
      setTimeout(() => { window.location.href = pendingSession.targetRoute; }, 600);
    }, 600);
  };

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCode("");
    setCountdown(45);
    setErrorMsg("");
    setSuccessMsg(`New 2FA code dispatched via ${verifyMethod === "phone" ? "Mobile SMS" : "Govt Email"}.`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSwitchVerifyMethod = (method: "phone" | "email") => {
    setVerifyMethod(method);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCode("");
    setCountdown(45);
    setErrorMsg("");
  };

  const getMaskedRecipient = () => {
    if (verifyMethod === "phone") {
      const p = (mode === "signup" ? signupPhone : phone) || "+91 98765 43210";
      const clean = p.replace(/\s+/g, "");
      if (clean.length < 8) return p;
      return clean.slice(0, 5) + " •••• " + clean.slice(-2);
    } else {
      const em = (mode === "signup" ? signupEmail : email) || (role === "corporate" ? "director@coalindia.in" : role === "manager" ? "manager@secl.gov.in" : "inspector@dgms.gov.in");
      const [u, d] = em.split("@");
      if (!u || !d) return em;
      return `${u[0]}•••••${u.slice(-1)}@${d}`;
    }
  };

  /* ── demo quick-access ── */
  const handleDemoClick = (roleType: "corporate" | "manager" | "inspector", targetMine: string, href: string) => {
    const session: OfficerProfile = {
      name: roleType === "corporate" ? "Corporate Director" : roleType === "manager" ? "Er. Rajesh Sharma" : "Inspector A. Smith",
      email: roleType === "corporate" ? "director@coalindia.in" : roleType === "manager" ? "manager@secl.gov.in" : "inspector@dgms.gov.in",
      role: roleType,
      securityRole: roleType === "corporate" ? "Corporate Safety Directorate" : roleType === "manager" ? "First Class Colliery Manager" : "Statutory Safety Inspector",
      allocatedMine: targetMine,
      designation: roleType === "corporate" ? "Director (Technical/Safety)" : roleType === "manager" ? "First Class Mine Manager" : "Safety Inspector",
      officialId: roleType === "corporate" ? "CIL-DIR-9021" : roleType === "manager" ? "DGMS-FCC-7721" : "DGMS-INSP-4011",
    };
    storageService.saveCurrentSession(session);
    storageService.setActiveAllocatedMine(targetMine);
    window.location.href = href;
  };

  /* ── pill badge helper ── */
  const Pill = ({ children, color = C.accent }: { children: React.ReactNode; color?: string }) => (
    <span style={{
      display: "inline-block", fontSize: 9.5, fontWeight: 700,
      letterSpacing: "0.04em", padding: "2px 7px", borderRadius: 20,
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>{children}</span>
  );

  /* ════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: C.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: C.text,
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .login-root {
          min-height: 100vh; height: 100vh;
          display: flex; overflow: hidden;
          background: ${C.bg};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: ${C.text};
        }
        .login-visual {
          width: 44%; flex-shrink: 0;
          position: relative; overflow: hidden;
          border-right: 1px solid ${C.border};
          background: ${C.panel};
          display: flex; flex-direction: column;
          height: 100vh;
        }
        .login-form-panel {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 24px 28px 70px;
          overflow-y: auto;
          height: 100vh; box-sizing: border-box;
          background: radial-gradient(ellipse at 60% 40%, rgba(82,183,136,0.04) 0%, transparent 70%);
        }
        .login-form-container {
          width: 100%; max-width: 430px;
          margin: auto 0; padding-top: 10px;
        }
        .mobile-brand-bar { display: none; }

        @media (max-width: 960px) {
          .login-root   { height: auto !important; overflow: auto !important; }
          .login-visual { display: none !important; }
          .login-form-panel {
            padding: 24px 16px 50px !important;
            height: auto !important; min-height: 100vh !important;
          }
          .login-form-container { margin: 0 auto !important; }
          .mobile-brand-bar {
            display: flex !important;
            align-items: center; gap: 12px;
            margin-bottom: 20px; padding-bottom: 16px;
            border-bottom: 1px solid ${C.border};
          }
        }
        @media (max-width: 520px) {
          .signup-row-2col  { grid-template-columns: 1fr !important; gap: 10px !important; }
          .role-selector-3col { gap: 6px !important; }
          .role-btn-inner   { padding: 8px 4px !important; }
        }
      `}</style>

      {/* ══════════════════════════
          LEFT — visualisation panel
          ══════════════════════════ */}
      <div className="login-visual">
        <div style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
          <MineViz />
        </div>

        {/* gradient fades */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, ${C.panel} 0%, transparent 18%, transparent 54%, ${C.panel} 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to right, transparent 48%, ${C.panel} 100%)`,
        }} />

        {/* content overlay */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          height: "100%", padding: "26px 32px", boxSizing: "border-box",
        }}>
          {/* wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, rgba(82,183,136,0.18) 0%, rgba(82,183,136,0.06) 100%)",
              border: `1.5px solid rgba(82,183,136,0.38)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 4px 18px rgba(0,0,0,0.35), 0 0 16px rgba(82,183,136,0.15)",
            }}>
              <img src="/logo.webp" alt="MineGuard"
                style={{ width: 38, height: 38, objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                MineGuard
              </div>
              <div style={{ color: C.textSub, fontSize: 12.5, fontWeight: 600, marginTop: 2, letterSpacing: "0.01em" }}>
                Coal India · Smart Governance
              </div>
            </div>
          </div>

          {/* bottom content */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(82,183,136,0.08)",
              border: `1px solid ${C.borderMid}`,
              borderRadius: 20, padding: "4px 12px 4px 8px",
              marginBottom: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: C.accent, flexShrink: 0,
                boxShadow: `0 0 8px ${C.accent}`,
              }} />
              <span style={{ color: C.textSub, fontSize: 9.5, fontFamily: "monospace", letterSpacing: "0.04em" }}>
                DGMS CMR 2017 · REG. 27 COMPLIANT
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 900, lineHeight: 1.2,
              letterSpacing: "-0.025em", marginBottom: 8, color: C.text,
            }}>
              Statutory mine<br />
              allocation &{" "}
              <span style={{ color: C.accent }}>AI governance.</span>
            </h1>

            <p style={{
              color: C.textSub, fontSize: 12, lineHeight: 1.55,
              maxWidth: 320, marginBottom: 16,
            }}>
              One statutory manager per colliery. Real-time IoT hazard monitoring across all CIL subsidiaries.
            </p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              borderRadius: 12, overflow: "hidden",
              border: `1px solid ${C.border}`,
            }}>
              {[
                { v: "97.67%", l: "Model accuracy", c: C.accent },
                { v: "1 / Mine", l: "Mgr allocation", c: C.accent },
                { v: "Pan-India", l: "Corp. oversight", c: C.warning },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "10px 8px", textAlign: "center",
                  background: i === 1 ? C.surfaceHigh : C.surfaceUp,
                  borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{
                    color: s.c, fontWeight: 800, fontSize: 15,
                    letterSpacing: "-0.02em", marginBottom: 2,
                  }}>{s.v}</div>
                  <div style={{ color: C.textMuted, fontSize: 9.5 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <p style={{
              marginTop: 10, color: C.textDim, fontSize: 9.5,
              lineHeight: 1.4, fontFamily: "monospace",
            }}>
              Ministry of Coal · Coal India Limited · DGMS Framework
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════
          RIGHT — form panel
          ══════════════════════════ */}
      <div className="login-form-panel">
        <div className="login-form-container">

          {/* mobile header */}
          <div className="mobile-brand-bar">
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(82,183,136,0.18) 0%, rgba(82,183,136,0.06) 100%)",
              border: `1.5px solid rgba(82,183,136,0.38)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.35), 0 0 14px rgba(82,183,136,0.15)",
            }}>
              <img src="/logo.webp" alt="MineGuard" style={{ width: 34, height: 34, objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.text, fontWeight: 900, fontSize: 19, letterSpacing: "-0.02em" }}>MineGuard</span>
                <Pill color={C.accent}>CMR 2017</Pill>
              </div>
              <p style={{ color: C.textSub, fontSize: 12, fontWeight: 600, margin: "2px 0 0 0" }}>Coal India · Smart Governance</p>
            </div>
          </div>

          {isVerifying ? (
            <TwoFactorVerification
              verifyMethod={verifyMethod}
              onSwitchMethod={handleSwitchVerifyMethod}
              maskedRecipient={getMaskedRecipient()}
              generatedOtp={generatedOtp}
              otpCode={otpCode}
              onOtpChange={setOtpCode}
              countdown={countdown}
              onResendOtp={handleResendOtp}
              onSubmit={handleVerifyOtp}
              onBack={() => { setIsVerifying(false); setErrorMsg(""); }}
              loading={loading}
              errorMsg={errorMsg}
              successMsg={successMsg}
              role={role}
              officerName={pendingSession?.officerSession.name || fullName || (role === "corporate" ? "Corporate Director" : role === "manager" ? "Er. Rajesh Sharma" : "Inspector A. Smith")}
            />
          ) : (
            <>
              {/* heading */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h2 style={{
                    color: C.text, fontSize: 22, fontWeight: 800,
                    letterSpacing: "-0.02em", lineHeight: 1, margin: 0,
                  }}>
                    {mode === "signin" ? "Officer sign in" : "New registration"}
                  </h2>
                  <Pill color={C.accent}>SECURE</Pill>
                </div>
                <p style={{ color: C.textSub, fontSize: 12.5, margin: "4px 0 0 0" }}>
                  {mode === "signin"
                    ? "Access your allocated mine portal."
                    : "Register as a statutory officer."}
                </p>
              </div>

              {/* mode toggle */}
              <div style={{
                display: "flex",
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: 3, marginBottom: 14, gap: 4,
              }}>
                {([
                  { id: "signin" as const, label: "Sign in" },
                  { id: "signup" as const, label: "Register" },
                ] as const).map(m => (
                  <button key={m.id} type="button"
                    onClick={() => { setMode(m.id); setErrorMsg(""); setSuccessMsg(""); }}
                    style={{
                      flex: 1, padding: "8px 10px", borderRadius: 7,
                      background: mode === m.id ? C.accent : "transparent",
                      color: mode === m.id ? "#040d06" : C.textMuted,
                      fontSize: 12.5, fontWeight: 700, border: "none", cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow: mode === m.id ? `0 2px 10px ${C.accentGlow}` : "none",
                    }}>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* alerts */}
              {errorMsg && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 8, marginBottom: 12,
                  background: C.errorDim, border: `1px solid rgba(248,113,113,0.25)`,
                  color: "#fca5a5", fontSize: 12.5,
                }}>
                  {Ico.alert}{errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 8, marginBottom: 12,
                  background: "rgba(82,183,136,0.08)",
                  border: `1px solid rgba(82,183,136,0.30)`,
                  color: C.accentBright, fontSize: 12.5,
                }}>
                  {Ico.check}{successMsg}
                </div>
              )}

              {/* ── role selector ── */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  color: C.textSub, letterSpacing: "0.025em", marginBottom: 7,
                }}>Operational role</label>
                <div className="role-selector-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
                  {roleConf.map(r => {
                    const act = role === r.id;
                    return (
                      <button key={r.id} type="button" onClick={() => handleRoleSelect(r.id)}
                        className="role-btn-inner"
                        style={{
                          padding: "10px 6px 9px", borderRadius: 10, cursor: "pointer",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                          background: act ? "rgba(82,183,136,0.10)" : C.surfaceUp,
                          border: `1.5px solid ${act ? C.accent : C.border}`,
                          transition: "all 0.13s",
                          boxShadow: act ? `0 0 0 1px ${C.accentGlow}, 0 4px 14px rgba(82,183,136,0.08)` : "none",
                          outline: "none",
                        }}>
                        <span style={{ color: act ? C.accent : C.textMuted, display: "flex", transition: "color 0.13s" }}>
                          {r.icon}
                        </span>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: act ? C.text : C.textSub, textAlign: "center" }}>
                          {r.label}
                        </span>
                        <span style={{
                          fontSize: 9.5, fontWeight: 600,
                          color: act ? C.accent : C.textMuted,
                          background: act ? "rgba(82,183,136,0.12)" : "transparent",
                          padding: "1px 6px", borderRadius: 20,
                          border: act ? `1px solid rgba(82,183,136,0.25)` : "1px solid transparent",
                          transition: "all 0.13s", textAlign: "center",
                        }}>{r.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── form ── */}
              <form onSubmit={handleSubmit}>

                {mode === "signup" && (
                  <Field label="Full name & designation" required>
                    <TextInput
                      required
                      placeholder="Er. Rajesh Kumar Sharma"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      iconLeft={Ico.user} />
                  </Field>
                )}

                {mode === "signup" && (
                  <div className="signup-row-2col"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>
                        Govt. email <span style={{ color: "#ef4444", marginLeft: 3, fontWeight: 700 }}>*</span>
                      </label>
                      <TextInput
                        type="email" required
                        placeholder="name@coalindia.in"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        iconLeft={Ico.mail} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: C.textSub, marginBottom: 6 }}>
                        Registered mobile <span style={{ color: "#ef4444", marginLeft: 3, fontWeight: 700 }}>*</span>
                      </label>
                      <TextInput
                        type="tel" required
                        maxLength={10}
                        placeholder="9876543210"
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        iconLeft={Ico.phone} />
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <Field label="DGMS Statutory Auth ID" required>
                    <TextInput
                      required
                      placeholder={role === "corporate" ? "CIL-DIR-9021" : role === "manager" ? "DGMS-FCC-7721" : "DGMS-INSP-4011"}
                      value={authId}
                      onChange={e => setAuthId(e.target.value)}
                      iconLeft={Ico.id} />
                  </Field>
                )}

                {mode === "signin" && (
                  <Field label="Official email or registered mobile (+91)" required>
                    <TextInput
                      placeholder={role === "corporate" ? "director@coalindia.in or +91 98111 20490" : role === "manager" ? "manager@secl.gov.in or +91 98765 43210" : "inspector@dgms.gov.in or +91 87654 32109"}
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (e.target.value.includes("+91") || /^\d+$/.test(e.target.value.replace(/\s+/g, ""))) {
                          setPhone(e.target.value);
                        }
                      }}
                      iconLeft={Ico.user} />
                  </Field>
                )}

                <Field label={mode === "signin" ? "Password" : "Create statutory password (min 6 chars)"} required>
                  <TextInput
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={mode === "signin" ? password : signupPass}
                    onChange={e => mode === "signin" ? setPassword(e.target.value) : setSignupPass(e.target.value)}
                    iconLeft={Ico.lock}
                    iconRight={Ico.eye(showPw)}
                    onRightClick={() => setShowPw(!showPw)} />
                  {mounted && mode === "signin" && (
                    <div suppressHydrationWarning style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.textSub }}>
                        Demo password: <strong style={{ color: C.accentBright, letterSpacing: "0.02em" }}>{role}123</strong>
                      </span>
                      <span style={{ fontSize: 10, color: C.accent, background: C.accentDim, padding: "1px 6px", borderRadius: 4, fontWeight: 700, border: `1px solid ${C.accentStrong}` }}>
                        PASSWORD VERIFIED 2FA
                      </span>
                    </div>
                  )}
                </Field>

                {/* mine / scope selector */}
                {role !== "corporate" ? (
                  <Field label="Allocated mine / colliery" required>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
                        color: C.accent, display: "flex", pointerEvents: "none",
                      }}>{Ico.pin}</span>
                      <select value={mine} onChange={e => setMine(e.target.value)} style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "12px 38px 12px 42px",
                        background: C.surfaceUp,
                        border: `1.5px solid ${C.borderFocus}`,
                        borderRadius: 10, color: C.text, fontSize: 13,
                        outline: "none", cursor: "pointer", appearance: "none",
                      }}>
                        {MINES.map(m => (
                          <option key={m.id} value={m.name}
                            style={{ background: "#0c160e", color: "#eef7f1" }}>
                            {m.name} · {m.state}
                          </option>
                        ))}
                      </select>
                      <span style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        color: C.textMuted, pointerEvents: "none",
                      }}>{Ico.chev}</span>
                    </div>

                    {selMine && (
                      <div style={{
                        marginTop: 6, padding: "7px 12px",
                        background: "rgba(82,183,136,0.07)",
                        border: `1px solid ${C.borderMid}`,
                        borderRadius: 7, display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{ color: C.accent, display: "flex" }}>
                          <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor"><circle cx={12} cy={12} r={5} /></svg>
                        </span>
                        <span style={{ fontSize: 11.5, color: C.textSub }}>
                          {selMine.type} &nbsp;·&nbsp; {selMine.state}
                        </span>
                      </div>
                    )}

                    {appointedManager && (
                      <div style={{
                        marginTop: 10, padding: "11px 14px",
                        background: "rgba(240,192,64,0.10)",
                        border: `1.5px solid rgba(240,192,64,0.30)`,
                        borderRadius: 9,
                        display: "flex", alignItems: "flex-start", gap: 10,
                      }}>
                        <span style={{ color: C.warning, flexShrink: 0, marginTop: 1 }}>{Ico.warn}</span>
                        <div>
                          <div style={{ color: C.warning, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                            CMR 2017 Reg. 27 Statutory Conflict Alert
                          </div>
                          <div style={{ color: "#d9c57d", fontSize: 11, lineHeight: 1.45 }}>
                            <strong>{mine}</strong> currently has an appointed statutory Mine Manager:{" "}
                            <strong>{appointedManager.name}</strong> ({appointedManager.officialId || appointedManager.certType}).
                            <br />
                            Under CMR 2017 Regulation 27, only <strong>one manager</strong> can hold legal charge.
                            Registering here will log an appointment succession / transfer application for Corporate Director review.
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                ) : (
                  <div style={{
                    padding: "13px 15px", marginBottom: 18,
                    background: "rgba(82,183,136,0.07)",
                    border: `1px solid ${C.borderMid}`,
                    borderRadius: 11,
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}>
                    <span style={{ color: C.accent, flexShrink: 0, marginTop: 1 }}>{Ico.globe}</span>
                    <div>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
                        Pan-India access scope
                      </div>
                      <div style={{ color: C.textSub, fontSize: 12, lineHeight: 1.5 }}>
                        Corporate directors oversee all 8 CIL subsidiaries across India.
                      </div>
                    </div>
                  </div>
                )}

                {/* CMR notice — signup only, no conflict */}
                {mode === "signup" && !appointedManager && (
                  <div style={{
                    padding: "9px 12px", marginBottom: 12,
                    background: C.warningDim,
                    border: `1px solid rgba(240,192,64,0.22)`,
                    borderRadius: 9,
                    display: "flex", alignItems: "flex-start", gap: 9,
                  }}>
                    <span style={{ color: C.warning, flexShrink: 0, marginTop: 1 }}>{Ico.warn}</span>
                    <div>
                      <div style={{ color: C.warning, fontSize: 11.5, fontWeight: 700, marginBottom: 2 }}>
                        CMR 2017 Reg. 27 — Statutory mandate
                      </div>
                      <div style={{ color: "#c8b264", fontSize: 11, lineHeight: 1.45 }}>
                        Only one statutory Mine Manager per colliery. Your credentials will be registered with the Colliery Safety Directorate.
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "12px 14px",
                  background: loading
                    ? C.surfaceHigh
                    : `linear-gradient(135deg, ${C.accentBright} 0%, ${C.accent} 60%, #3da572 100%)`,
                  color: loading ? C.textMuted : "#040d06",
                  border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  letterSpacing: "-0.01em",
                  transition: "opacity 0.15s, transform 0.1s",
                  boxShadow: loading ? "none" : `0 4px 20px rgba(82,183,136,0.28), 0 1px 4px rgba(0,0,0,0.4)`,
                }}
                  onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
                  onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {loading
                    ? <>{Ico.spin} Initializing 2FA gateway…</>
                    : <>{mode === "signin" ? "Proceed to 2FA verification" : "Verify & register officer"} {Ico.arr}</>}
                </button>
              </form>

              {/* ── quick demo access ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 10px" }}>
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>
                  QUICK DEMO ACCESS
                </span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>
                {[
                  { href: "/corporate-admin", iconImg: "/icons/corporate.webp", label: "Corporate HQ", sub: "All mines", role: "corporate" as const, mine: "All CIL Subsidiaries (National Scope)" },
                  { href: "/mine-manager", iconImg: "/icons/manager.webp", label: "Mine manager", sub: "Gevra OCP", role: "manager" as const, mine: "SECL Gevra Mega Opencast" },
                  { href: "/inspector", iconImg: "/icons/inspector.webp", label: "Safety beat", sub: "Inspector view", role: "inspector" as const, mine: "SECL Gevra Mega Opencast" },
                ].map(d => (
                  <button
                    key={d.href}
                    type="button"
                    onClick={() => handleDemoClick(d.role, d.mine, d.href)}
                    style={{
                      padding: "12px 8px 11px",
                      background: C.surfaceUp,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                      transition: "border-color 0.12s, background 0.12s, transform 0.1s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.background = C.surfaceHigh;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = C.surfaceUp;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "rgba(82,183,136,0.12)",
                      border: `1px solid rgba(82,183,136,0.30)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25)"
                    }}>
                      <img src={d.iconImg} alt={d.label} style={{ width: 32, height: 32, objectFit: "contain" }} />
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: C.text, textAlign: "center", lineHeight: 1.2 }}>{d.label}</span>
                    <span style={{ fontSize: 10.5, color: C.textMuted, textAlign: "center" }}>{d.sub}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <p style={{
            marginTop: 20, textAlign: "center",
            color: C.textDim, fontSize: 10.5, lineHeight: 1.6,
          }}>
            Secured under DGMS CMR 2017 · Ministry of Coal directives.<br />
            Unauthorised access is a criminal offence under the Mines Act 1952.
          </p>
        </div>
      </div>

      {/* ══════════════════════════
          Floating Persona Dock
          ══════════════════════════ */}
      <PersonaDock onPersonaClick={handleDemoClick} />
    </div>
  );
}