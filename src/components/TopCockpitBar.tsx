import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Download, Copy, RotateCcw, AlertTriangle, Sparkles, Mic } from "lucide-react";
import { SurgicalPatient } from "../types/clinical";

interface TopCockpitBarProps {
  patient: SurgicalPatient;
  checklistProgress: { checked: number; total: number };
  onReset: () => void;
  onCopyReport: () => void;
  onDownloadFhir: () => void;
  isListening: boolean;
  copied: boolean;
}

export const TopCockpitBar: React.FC<TopCockpitBarProps> = ({
  patient,
  checklistProgress,
  onReset,
  onCopyReport,
  onDownloadFhir,
  isListening,
  copied
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isChecklistComplete = checklistProgress.checked === checklistProgress.total;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Aceternity Logo & Sterile Status */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-950 border border-white/[0.1] text-cyan-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                SterileFlow
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  FHIR
                </span>
              </h1>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
                Sterile Cockpit
              </div>
            </div>
            
            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span className="text-neutral-300 font-medium">{patient.orRoom}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-cyan-400/90 font-medium truncate max-w-[240px] sm:max-w-none">
                {patient.scheduledProcedure}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Frosted Glass Patient Badge */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-neutral-900/50 backdrop-blur-md text-xs shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Patient:</span>
            <span className="font-semibold text-neutral-100">{patient.name}</span>
            <span className="text-neutral-500 font-mono text-[11px]">({patient.mrn})</span>
          </div>
          
          <div className="h-3.5 w-px bg-white/[0.08]" />
          
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Demographics:</span>
            <span className="text-neutral-300 font-medium">{patient.age}y {patient.gender}</span>
          </div>

          <div className="h-3.5 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Allergies:</span>
            {patient.allergies.length > 0 && patient.allergies[0] !== "No Known Drug Allergies (NKDA)" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25 font-semibold text-[11px] shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                {patient.allergies.join(", ")}
              </span>
            ) : (
              <span className="text-neutral-400 font-mono text-[11px]">NKDA</span>
            )}
          </div>
        </div>

        {/* Right: Controls & Shimmer Action */}
        <div className="flex items-center gap-2.5">
          
          {/* OR Elapsed Timer Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 text-xs">
            <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">OR Timer</span>
            <span className="font-mono text-cyan-400 font-semibold tabular-nums tracking-wider">
              {formatTimer(seconds)}
            </span>
          </div>

          {/* Time Out Progress Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            isChecklistComplete
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
              : "bg-amber-500/10 border-amber-500/25 text-amber-300"
          }`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${isChecklistComplete ? "text-emerald-400" : "text-amber-400"}`} />
            <span>Time-Out {checklistProgress.checked}/{checklistProgress.total}</span>
          </div>

          {/* Copy Report Note Button */}
          <button
            onClick={onCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/[0.08] bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 transition active:scale-95 shadow-sm"
            title="Copy Formatted Clinical Operative Note"
          >
            <Copy className="w-3.5 h-3.5 text-neutral-400" />
            <span>{copied ? "Copied!" : "Copy Note"}</span>
          </button>

          {/* Aceternity Shimmer Button: Download FHIR */}
          <button
            onClick={onDownloadFhir}
            className="relative inline-flex h-9 overflow-hidden rounded-xl p-[1px] focus:outline-none transition hover:scale-[1.02] active:scale-[0.98]"
            title="Download Validated HL7 FHIR R4 JSON Bundle"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00F0FF_0%,#10B981_50%,#00F0FF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-3xl gap-1.5 border border-white/[0.1]">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download FHIR R4</span>
            </span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-neutral-400 hover:text-white border border-white/[0.08] bg-neutral-900/60 hover:bg-neutral-800 transition active:scale-95"
            title="Reset Procedure Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
