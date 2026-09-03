"use client";

import { useState, useEffect } from "react";
import { storageService, AttendanceRecord } from "@/lib/storage";
import { ScanFace, CheckCircle, Camera, Users, Target, ShieldCheck, X } from "lucide-react";

export default function InspectorFacialAttendancePage() {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const syncAttendance = () => {
    try {
      setRecentScans(storageService.getAttendance());
    } catch (e) {}
  };

  useEffect(() => {
    syncAttendance();
    window.addEventListener("storage", syncAttendance);
    window.addEventListener("focus", syncAttendance);
    return () => {
      window.removeEventListener("storage", syncAttendance);
      window.removeEventListener("focus", syncAttendance);
    };
  }, []);

  const handleStartScan = () => {
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const completeScan = () => {
    setScanning(false);
    setScanProgress(0);

    // Generate mock worker data
    const mockWorkers = [
      { id: "WRK-8291", name: "Ramesh Singh" },
      { id: "WRK-3024", name: "Sunil Kumar" },
      { id: "WRK-5102", name: "Vikram Das" },
      { id: "WRK-9921", name: "Prakash Mahato" }
    ];
    
    const w = mockWorkers[Math.floor(Math.random() * mockWorkers.length)];

    const record: AttendanceRecord = {
      id: `ATT-${Math.floor(Math.random() * 10000)}`,
      workerName: w.name,
      workerId: w.id,
      shift: "Morning (08:00 - 16:00)",
      location: "Pit Area A - Gate 2",
      timestamp: new Date().toISOString(),
      status: "Present",
      scannedBy: "INS-092"
    };

    storageService.saveAttendance(record);
    setRecentScans([record, ...recentScans]);

    setToastMsg(`${w.name} (${w.id}) marked Present!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", position: "relative" }}>
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

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Biometric Attendance Scanner</h2>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>Facial recognition gate sync for on-site crew.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        
        {/* Scanner Module */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, boxShadow: "var(--shadow-sm)" }}>
          <div style={{
            position: "relative", width: 280, height: 280, borderRadius: "50%",
            background: scanning ? "rgba(82,183,136,0.1)" : "rgba(243,244,246,0.5)",
            border: scanning ? "2px solid #52b788" : "2px dashed #d1d5db",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", transition: "all 0.3s ease",
            boxShadow: scanning ? "0 0 40px rgba(82,183,136,0.2)" : "none"
          }}>
            {scanning && (
              <>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, transparent, rgba(82,183,136,0.3))", animation: "scanLine 1.5s infinite linear" }} />
                <Target size={120} color="rgba(82,183,136,0.5)" style={{ animation: "pulseDot 1s infinite" }} />
                <div style={{ position: "absolute", bottom: 20, fontSize: 11, fontWeight: 800, color: "#2d6a4f", letterSpacing: "0.1em" }}>
                  ANALYZING {scanProgress}%
                </div>
              </>
            )}
            {!scanning && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 0.5 }}>
                <ScanFace size={64} color="#4b5563" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#4b5563" }}>STANDBY MODE</span>
              </div>
            )}
          </div>

          <button
            onClick={scanning ? undefined : handleStartScan}
            style={{
              marginTop: 30, padding: "12px 32px", borderRadius: 12, border: "none",
              background: scanning ? "#9ca3af" : "#2d6a4f", color: "white",
              fontSize: 14, fontWeight: 800, letterSpacing: "0.05em",
              cursor: scanning ? "not-allowed" : "pointer",
              boxShadow: scanning ? "none" : "0 8px 20px rgba(45,106,79,0.3)",
              display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s"
            }}
          >
            {scanning ? <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid white", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} /> : <Camera size={18} />}
            {scanning ? "SCANNING BIOMETRICS..." : "INITIALIZE SCANNER"}
          </button>
        </div>

        {/* History / Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Stat */}
          <div style={{ background: "linear-gradient(135deg, #0f2318 0%, #1a3d28 100%)", borderRadius: 16, padding: 20, color: "white", boxShadow: "0 10px 20px rgba(15,35,24,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ShieldCheck size={16} color="#86efac" />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>SHIFT TURNOUT</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{recentScans.length}</span>
              <span style={{ fontSize: 13, color: "#86efac", fontWeight: 700 }}>/ 120 Logged</span>
            </div>
          </div>

          {/* Recent Log */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, background: "#fafafa" }}>
              <Users size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>Recent Scans</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px 16px" }}>
              {recentScans.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 12 }}>No scans recorded in this session.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentScans.slice(0, 10).map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{r.workerName}</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{r.workerId} · {new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div style={{ padding: "4px 10px", borderRadius: 20, background: "#dcfce7", color: "#16a34a", fontSize: 10, fontWeight: 800 }}>
                        {r.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
