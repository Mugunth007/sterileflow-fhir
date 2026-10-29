import React from "react";
import { FileText, CheckCircle2, AlertCircle, Droplets, Layers, Scissors, UserCheck, Stethoscope } from "lucide-react";
import { StructuredOperativeReport } from "../types/clinical";

interface OperativeReportViewerProps {
  report: StructuredOperativeReport;
  hasContent: boolean;
}

export const OperativeReportViewer: React.FC<OperativeReportViewerProps> = ({
  report,
  hasContent
}) => {
  return (
    <div className="aceternity-card flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-3.5 border-b border-white/[0.08] bg-neutral-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-neutral-100 tracking-wider uppercase">
            Structured Operative Note (SOAP / Brief Op)
          </h2>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px] font-semibold">
            EBL: {report.estimatedBloodLoss || "Pending"}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Counts: {report.spongeNeedleCount}
          </span>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-neutral-300">
        
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-neutral-500">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center mb-3 text-neutral-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <p className="font-semibold text-neutral-300 text-sm">Awaiting Clinical Dictation</p>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">
              Speak or click "Simulate Live" above to auto-synthesize this operative note with real-time ICD-10 & FHIR bindings.
            </p>
          </div>
        ) : (
          <>
            {/* Header Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-950/60 border border-white/[0.06] text-xs">
              <div>
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Pre-Op Diagnosis</span>
                <span className="text-neutral-100 font-semibold">{report.preOpDiagnosis}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Post-Op Diagnosis</span>
                <span className="text-emerald-300 font-semibold">{report.postOpDiagnosis}</span>
              </div>
              <div className="md:col-span-2 pt-1 border-t border-white/[0.04]">
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Procedure Performed</span>
                <span className="text-cyan-300 font-semibold text-sm">{report.procedurePerformed}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Surgical Team</span>
                <span className="text-neutral-200">{report.surgeon} | {report.assistant}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Anesthesia</span>
                <span className="text-neutral-200">{report.anesthesiaType}</span>
              </div>
            </div>

            {/* Operative Findings */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1.5">
                <Scissors className="w-3.5 h-3.5" />
                Surgical Findings
              </h3>
              <p className="bg-neutral-950/50 p-3 rounded-xl border border-white/[0.06] text-neutral-200 leading-relaxed">
                {report.findings}
              </p>
            </div>

            {/* Technique Description */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5" />
                Technique & Operative Steps
              </h3>
              <p className="bg-neutral-950/50 p-3 rounded-xl border border-white/[0.06] text-neutral-200 leading-relaxed font-sans">
                {report.techniqueDescription}
              </p>
            </div>

            {/* Specimens & Implants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Specimens Removed
                </h4>
                <ul className="bg-neutral-950/50 p-3 rounded-xl border border-white/[0.06] space-y-1 text-neutral-300">
                  {report.specimensRemoved.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Implants / Prosthetics Logged
                </h4>
                <ul className="bg-neutral-950/50 p-3 rounded-xl border border-white/[0.06] space-y-1 font-mono text-[11px]">
                  {report.implantsUsed.map((imp, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Complications & Post-Op Plan */}
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-white/[0.06] space-y-2">
              <div>
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Complications</span>
                <span className="text-emerald-400 font-semibold">{report.complications}</span>
              </div>
              <div className="pt-1 border-t border-white/[0.04]">
                <span className="text-neutral-500 font-medium block text-[11px] uppercase tracking-wider">Post-Op Plan & Disposition</span>
                <span className="text-neutral-200">{report.disposition}</span>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
