import React from "react";
import { CheckCircle2, Circle, ShieldCheck, Clock, Check, Sparkles, ChevronRight } from "lucide-react";
import { OperativeMilestone, WhoChecklistItem } from "../types/clinical";

interface WhoChecklistPanelProps {
  checklist: WhoChecklistItem[];
  onToggleItem: (id: string) => void;
  milestones: OperativeMilestone[];
}

export const WhoChecklistPanel: React.FC<WhoChecklistPanelProps> = ({
  checklist,
  onToggleItem,
  milestones
}) => {
  const checkedCount = checklist.filter((c) => c.checked).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);
  const isComplete = checkedCount === totalCount;

  return (
    <div className="aceternity-card flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-3.5 border-b border-white/[0.08] bg-neutral-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-neutral-100 tracking-wider uppercase">
            WHO Surgical Time-Out
          </h2>
        </div>
        
        <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
          isComplete 
            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            : "bg-white/[0.04] text-neutral-300 border-white/[0.08]"
        }`}>
          {checkedCount}/{totalCount} Verified
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-neutral-950/60 border-b border-white/[0.06]">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-neutral-400 text-[11px]">Safety Protocol Execution</span>
          <span className="font-mono text-cyan-400 font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-800/80 h-1.5 rounded-full overflow-hidden p-[1px]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isComplete
                ? "bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_#10B981]"
                : "bg-gradient-to-r from-cyan-500 to-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {isComplete && (
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1.5 font-medium animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Time-out complete. Sterile incision authorized.</span>
          </p>
        )}
      </div>

      {/* Checklist Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {checklist.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`group flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                item.checked
                  ? "bg-emerald-500/5 border-emerald-500/30 hover:bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                  : "bg-neutral-900/40 border-white/[0.06] hover:bg-neutral-900/80 hover:border-white/[0.12]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.checked ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug tracking-tight font-medium transition ${
                  item.checked ? "text-emerald-100 font-semibold" : "text-neutral-300"
                }`}>
                  {item.label}
                </p>
                
                {item.checked && item.timestamp && (
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-400/90 font-mono">
                    <span>✓ Verified at {item.timestamp}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400">Voice Trigger</span>
                  </div>
                )}
                
                {!item.checked && (
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    Trigger phrase: <span className="text-cyan-400/90 font-medium">"{item.voiceTrigger[0]}"</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Intra-operative Milestones Feed */}
      <div className="border-t border-white/[0.08] bg-neutral-950/70 p-3 max-h-48 overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Intra-Op Milestones
          </h3>
        </div>

        {milestones.length === 0 ? (
          <p className="text-[11px] text-neutral-500 italic py-1">
            Dictate procedure events (incision, dissection, counts, closure) to auto-log timestamps.
          </p>
        ) : (
          <div className="space-y-1.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-2 text-xs p-2 rounded-xl bg-neutral-900/60 border border-white/[0.06] hover:border-white/[0.12] transition"
              >
                <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded-md shrink-0">
                  {m.timestamp}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-100 text-[11px] truncate">{m.title}</p>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">{m.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
