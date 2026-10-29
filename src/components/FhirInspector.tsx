import React, { useState } from "react";
import { Code2, Download, Copy, Check, CheckCircle, ExternalLink, ShieldCheck, Database, Layers } from "lucide-react";
import { ClinicalCode } from "../types/clinical";
import { FhirBundle } from "../services/fhirGenerator";

interface FhirInspectorProps {
  codes: ClinicalCode[];
  bundle: FhirBundle;
  onDownload: () => void;
}

export const FhirInspector: React.FC<FhirInspectorProps> = ({
  codes,
  bundle,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<"codes" | "resources" | "json">("codes");
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(bundle, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSystemBadgeColor = (system: string) => {
    switch (system) {
      case "ICD-10-CM":
        return "bg-rose-500/10 text-rose-300 border-rose-500/25";
      case "CPT":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/25";
      case "SNOMED-CT":
        return "bg-purple-500/10 text-purple-300 border-purple-500/25";
      case "RxNorm":
        return "bg-amber-500/10 text-amber-300 border-amber-500/25";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <div className="aceternity-card flex flex-col h-full overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-3.5 border-b border-white/[0.08] bg-neutral-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Database className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-neutral-100 tracking-wider uppercase">
            HL7 FHIR R4 & Diagnostic Codes
          </h2>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            FHIR R4 Conforming
          </span>
        </div>
      </div>

      {/* Aceternity Pill Tabs */}
      <div className="p-2 border-b border-white/[0.06] bg-neutral-950/60">
        <div className="grid grid-cols-3 gap-1 bg-neutral-900/80 p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab("codes")}
            className={`py-1.5 px-2 text-center rounded-lg text-xs font-medium transition duration-200 ${
              activeTab === "codes"
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.1] font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Codes ({codes.length})
          </button>
          
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-1.5 px-2 text-center rounded-lg text-xs font-medium transition duration-200 ${
              activeTab === "resources"
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.1] font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Resources ({bundle.entry.length})
          </button>
          
          <button
            onClick={() => setActiveTab("json")}
            className={`py-1.5 px-2 text-center rounded-lg text-xs font-medium transition duration-200 ${
              activeTab === "json"
                ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.1] font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Raw JSON
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5">
        
        {/* Tab 1: Diagnostic Codes View */}
        {activeTab === "codes" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 font-medium">
              <span>Auto-Mapped Ontologies</span>
              <span>Match Confidence</span>
            </div>

            {codes.length === 0 ? (
              <p className="text-xs text-neutral-500 text-center py-8">
                No clinical codes extracted yet. Dictate surgical case to trigger real-time mapping.
              </p>
            ) : (
              codes.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06] hover:border-white/[0.12] transition duration-200 flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getSystemBadgeColor(c.system)}`}>
                        {c.system}
                      </span>
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {c.code}
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-wider">
                        ({c.category})
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                      {c.display}
                    </p>
                  </div>
                  
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {Math.round(c.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: FHIR Resource Summary Cards */}
        {activeTab === "resources" && (
          <div className="space-y-2.5">
            {bundle.entry.map((e, idx) => {
              const res = e.resource;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-white/[0.06] hover:border-cyan-500/30 transition duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      {res.resourceType}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      id: {res.id}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300 mt-1 pl-4 border-l-2 border-white/[0.08] space-y-0.5">
                    {res.status && (
                      <p><span className="text-neutral-500">status:</span> <span className="text-emerald-400 font-semibold">{res.status}</span></p>
                    )}
                    {res.code?.text && (
                      <p><span className="text-neutral-500">code:</span> {res.code.text}</p>
                    )}
                    {res.valueQuantity && (
                      <p><span className="text-neutral-500">value:</span> {res.valueQuantity.value} {res.valueQuantity.unit}</p>
                    )}
                    {res.medicationCodeableConcept && (
                      <p><span className="text-neutral-500">medication:</span> {res.medicationCodeableConcept.coding?.[0]?.display}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Raw FHIR JSON View */}
        {activeTab === "json" && (
          <div className="relative">
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-white/[0.08] transition active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              
              <button
                onClick={onDownload}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-medium transition active:scale-95"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
            
            <pre className="bg-neutral-950/90 p-3.5 rounded-xl border border-white/[0.08] text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
              {jsonString}
            </pre>
          </div>
        )}

      </div>

      {/* Footer Conformance Bar */}
      <div className="p-2.5 bg-neutral-950/80 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>US Core FHIR R4 Bundle Profile</span>
        </span>
        <button
          onClick={onDownload}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
        >
          <span>Download JSON</span>
          <Download className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
