import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { TopCockpitBar } from "./components/TopCockpitBar";
import { WhoChecklistPanel } from "./components/WhoChecklistPanel";
import { LiveVoiceConsole } from "./components/LiveVoiceConsole";
import { OperativeReportViewer } from "./components/OperativeReportViewer";
import { FhirInspector } from "./components/FhirInspector";
import { CLINICAL_SCENARIOS, DEFAULT_WHO_CHECKLIST } from "./data/clinicalScenarios";
import { ClinicalScenario, OperativeMilestone, StructuredOperativeReport, WhoChecklistItem } from "./types/clinical";
import { parseChecklistFromText, extractCodesFromText, detectMilestonesFromText } from "./services/clinicalParser";
import { generateFhirR4Bundle } from "./services/fhirGenerator";

export function App() {
  const [selectedScenario, setSelectedScenario] = useState<ClinicalScenario>(CLINICAL_SCENARIOS[0]);
  const [checklist, setChecklist] = useState<WhoChecklistItem[]>(DEFAULT_WHO_CHECKLIST);
  const [milestones, setMilestones] = useState<OperativeMilestone[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const hasCelebratedTimeout = useRef<boolean>(false);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + " ";
        }
        setTranscript(currentTranscript.trim());
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Microphone Web Speech API is not available in this browser. You can dictate using Wispr Flow (Hold CapsLock) directly into the text box, or use the 'Simulate Live Audio' button!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Could not start speech recognition:", err);
      }
    }
  };

  // Reactive processing on transcript changes
  useEffect(() => {
    if (!transcript) return;

    // 1. Parse Checklist Triggers
    const { updatedChecklist, newlyVerified } = parseChecklistFromText(checklist, transcript);
    if (newlyVerified.length > 0) {
      setChecklist(updatedChecklist);

      // Check if all items complete
      const allChecked = updatedChecklist.every((c) => c.checked);
      if (allChecked && !hasCelebratedTimeout.current) {
        hasCelebratedTimeout.current = true;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#06B6D4", "#F59E0B"]
        });
      }
    }

    // 2. Detect Milestones
    const updatedMilestones = detectMilestonesFromText(transcript, milestones);
    if (updatedMilestones.length !== milestones.length) {
      setMilestones(updatedMilestones);
    }
  }, [transcript]);

  // Derived state: Codes extracted
  const extractedCodes = transcript
    ? extractCodesFromText(transcript)
    : selectedScenario.expectedCodes;

  // Derived state: Report structure
  const report: StructuredOperativeReport = {
    patientMrn: selectedScenario.patient.mrn,
    patientName: selectedScenario.patient.name,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    preOpDiagnosis: selectedScenario.reportTemplate.preOpDiagnosis || selectedScenario.patient.preOpDiagnosis,
    postOpDiagnosis: selectedScenario.reportTemplate.postOpDiagnosis || selectedScenario.patient.preOpDiagnosis,
    procedurePerformed: selectedScenario.reportTemplate.procedurePerformed || selectedScenario.patient.scheduledProcedure,
    surgeon: selectedScenario.reportTemplate.surgeon || selectedScenario.patient.surgeon,
    assistant: selectedScenario.reportTemplate.assistant || "Dr. Kevin Brody, MD",
    anesthesiaType: selectedScenario.reportTemplate.anesthesiaType || "General Endotracheal Anesthesia (GETA)",
    estimatedBloodLoss: selectedScenario.reportTemplate.estimatedBloodLoss || "25 mL",
    specimensRemoved: selectedScenario.reportTemplate.specimensRemoved || ["Surgical tissue specimen sent to pathology"],
    implantsUsed: selectedScenario.reportTemplate.implantsUsed || ["None permanent"],
    spongeNeedleCount: selectedScenario.reportTemplate.spongeNeedleCount || "Correct",
    indications: selectedScenario.reportTemplate.indications || "Patient presented with acute clinical symptoms warranting operative management.",
    findings: selectedScenario.reportTemplate.findings || "Target anatomy identified, pathology isolated without gross complications.",
    techniqueDescription: selectedScenario.reportTemplate.techniqueDescription || "Standard aseptic surgical technique executed according to protocol.",
    complications: selectedScenario.reportTemplate.complications || "None reported.",
    disposition: selectedScenario.reportTemplate.disposition || "Extubated and transferred to PACU in stable condition."
  };

  // Derived state: FHIR R4 Bundle
  const fhirBundle = generateFhirR4Bundle(selectedScenario.patient, report, extractedCodes, milestones);

  // Actions
  const handleSelectScenario = (scenario: ClinicalScenario) => {
    setSelectedScenario(scenario);
    setChecklist(DEFAULT_WHO_CHECKLIST.map((c) => ({ ...c, checked: false, timestamp: undefined })));
    setMilestones([]);
    setTranscript("");
    hasCelebratedTimeout.current = false;
  };

  const handleReset = () => {
    setChecklist(DEFAULT_WHO_CHECKLIST.map((c) => ({ ...c, checked: false, timestamp: undefined })));
    setMilestones([]);
    setTranscript("");
    hasCelebratedTimeout.current = false;
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.checked;
          return {
            ...item,
            checked: nextState,
            timestamp: nextState ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined
          };
        }
        return item;
      })
    );
  };

  const handleCopyReport = () => {
    const formatted = `
OPERATIVE PROCEDURE REPORT
==================================================
PATIENT: ${report.patientName} (MRN: ${report.patientMrn})
DATE: ${report.date}
SURGEON: ${report.surgeon}
ASSISTANT: ${report.assistant}
ANESTHESIA: ${report.anesthesiaType}

PRE-OPERATIVE DIAGNOSIS:
  ${report.preOpDiagnosis}

POST-OPERATIVE DIAGNOSIS:
  ${report.postOpDiagnosis}

PROCEDURE PERFORMED:
  ${report.procedurePerformed}

ESTIMATED BLOOD LOSS (EBL):
  ${report.estimatedBloodLoss}

SPONGE & NEEDLE COUNT:
  ${report.spongeNeedleCount}

SPECIMENS:
  ${report.specimensRemoved.join("\n  ")}

IMPLANTS / HARDWARE:
  ${report.implantsUsed.join("\n  ")}

FINDINGS:
  ${report.findings}

TECHNIQUE & OPERATIVE STEPS:
  ${report.techniqueDescription}

COMPLICATIONS:
  ${report.complications}

POST-OPERATIVE DISPOSITION:
  ${report.disposition}
==================================================
Generated via SterileFlow FHIR (Hands-Free OR Cockpit)
`.trim();

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFhir = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fhirBundle, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sterileflow-fhir-bundle-${selectedScenario.patient.mrn}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#06B6D4", "#10B981"]
    });
  };

  const checkedCount = checklist.filter((c) => c.checked).length;

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Aceternity Ambient Spotlight Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top OR Cockpit Navigation Bar */}
      <TopCockpitBar
        patient={selectedScenario.patient}
        checklistProgress={{ checked: checkedCount, total: checklist.length }}
        onReset={handleReset}
        onCopyReport={handleCopyReport}
        onDownloadFhir={handleDownloadFhir}
        isListening={isListening}
        copied={copied}
      />

      {/* Main OR Workspace Grid */}
      <main className="flex-1 p-3.5 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 max-w-[1920px] mx-auto w-full z-10">
        
        {/* Left Column (3 cols): WHO Surgical Checklist & Intra-Op Milestones */}
        <div className="lg:col-span-3 flex flex-col h-[calc(100vh-5.5rem)]">
          <WhoChecklistPanel
            checklist={checklist}
            onToggleItem={handleToggleChecklist}
            milestones={milestones}
          />
        </div>

        {/* Center Column (5 cols): Live Dictation Feed & Structured Operative Report */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-5.5rem)]">
          {/* Top of center: Live Dictation Feed & Scenario Simulator */}
          <div className="shrink-0">
            <LiveVoiceConsole
              scenarios={CLINICAL_SCENARIOS}
              selectedScenario={selectedScenario}
              onSelectScenario={handleSelectScenario}
              transcript={transcript}
              onTranscriptChange={setTranscript}
              onClearTranscript={() => setTranscript("")}
              isListening={isListening}
              onToggleListening={toggleListening}
            />
          </div>

          {/* Bottom of center: Structured Operative SOAP Report */}
          <div className="flex-1 min-h-0">
            <OperativeReportViewer
              report={report}
              hasContent={Boolean(transcript.trim())}
            />
          </div>
        </div>

        {/* Right Column (4 cols): HL7 FHIR R4 Bundle & Diagnostic Code Inspector */}
        <div className="lg:col-span-4 flex flex-col h-[calc(100vh-5.5rem)]">
          <FhirInspector
            codes={extractedCodes}
            bundle={fhirBundle}
            onDownload={handleDownloadFhir}
          />
        </div>

      </main>

    </div>
  );
}

export default App;
