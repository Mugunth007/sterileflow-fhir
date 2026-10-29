import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Play, FastForward, Trash2, Volume2, Sparkles, Stethoscope, Radio } from "lucide-react";
import { ClinicalScenario } from "../types/clinical";

interface LiveVoiceConsoleProps {
  scenarios: ClinicalScenario[];
  selectedScenario: ClinicalScenario;
  onSelectScenario: (scenario: ClinicalScenario) => void;
  transcript: string;
  onTranscriptChange: (newText: string) => void;
  onClearTranscript: () => void;
  isListening: boolean;
  onToggleListening: () => void;
}

export const LiveVoiceConsole: React.FC<LiveVoiceConsoleProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  transcript,
  onTranscriptChange,
  onClearTranscript,
  isListening,
  onToggleListening
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<number | null>(null);

  // Handle stream simulation
  const handleSimulateStream = () => {
    if (isSimulating) {
      if (simulationRef.current) clearInterval(simulationRef.current);
      setIsSimulating(false);
      return;
    }

    onClearTranscript();
    setIsSimulating(true);

    const chunks = selectedScenario.dictationStreamChunks;
    let currentIdx = 0;
    let accumulated = "";

    simulationRef.current = window.setInterval(() => {
      if (currentIdx < chunks.length) {
        accumulated += (accumulated ? " " : "") + chunks[currentIdx];
        onTranscriptChange(accumulated);
        currentIdx++;
      } else {
        if (simulationRef.current) clearInterval(simulationRef.current);
        setIsSimulating(false);
      }
    }, 2000);
  };

  const handleInjectFull = () => {
    if (isSimulating && simulationRef.current) {
      clearInterval(simulationRef.current);
      setIsSimulating(false);
    }
    onTranscriptChange(selectedScenario.fullDictationSample);
  };

  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  return (
    <div className="aceternity-card flex flex-col overflow-hidden">
      
      {/* Console Header Bar */}
      <div className="p-3 border-b border-white/[0.08] bg-neutral-950/40 flex flex-wrap items-center justify-between gap-3">
        
        {/* Scenario Switcher */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Stethoscope className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Case:</span>
          
          <select
            value={selectedScenario.id}
            onChange={(e) => {
              const found = scenarios.find((s) => s.id === e.target.value);
              if (found) onSelectScenario(found);
            }}
            className="bg-neutral-900 border border-white/[0.1] text-cyan-300 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500/80 transition cursor-pointer shadow-inner"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id} className="bg-neutral-950 text-white">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Live Simulation & Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Stream Simulation Button */}
          <button
            onClick={handleSimulateStream}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
              isSimulating
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border-white/[0.08]"
            }`}
            title="Simulate realistic incoming voice chunks over time"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? "text-amber-400 fill-amber-400" : "text-cyan-400"}`} />
            <span>{isSimulating ? "Streaming..." : "Simulate Live"}</span>
          </button>

          {/* Instant Inject Button */}
          <button
            onClick={handleInjectFull}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border border-white/[0.08] transition active:scale-95"
            title="Inject entire surgical transcript immediately"
          >
            <FastForward className="w-3.5 h-3.5 text-neutral-400" />
            <span>Inject Full Case</span>
          </button>

          {/* Microphone Toggle (Web Speech / Wispr Flow PTT) */}
          <button
            onClick={onToggleListening}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 border ${
              isListening
                ? "bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.3)] animate-pulse"
                : "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border-cyan-500/30 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.15)]"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-red-400" />
                <span>Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Mic</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Dictation Input Area */}
      <div className="p-3.5 flex flex-col gap-2 relative">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" />
              Live Procedural Dictation Feed
            </span>

            {isListening && (
              <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" />
                Recording Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-cyan-400 text-xs font-medium px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
              {wordCount} words
            </span>

            {transcript && (
              <button
                onClick={onClearTranscript}
                className="text-neutral-500 hover:text-red-400 text-xs flex items-center gap-1 transition px-1.5 py-0.5 rounded"
                title="Clear transcript"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Textarea with Aceternity glowing focus ring */}
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Speak or dictate procedure notes using Wispr Flow [Hold CapsLock]... or click 'Simulate Live' to run an automated surgical case."
          className="w-full h-28 bg-neutral-950/80 border border-white/[0.08] rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 font-sans leading-relaxed focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition resize-none shadow-inner"
        />

        {/* Audio Wave Visualizer when listening */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 h-3 mt-0.5">
            {[40, 75, 90, 45, 60, 100, 30, 80, 95, 50, 70, 85, 40].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#00F0FF]"
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
