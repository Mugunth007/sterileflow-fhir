import { ClinicalCode, OperativeMilestone, StructuredOperativeReport, WhoChecklistItem } from "../types/clinical";

const KNOWN_MEDICAL_CODES: ClinicalCode[] = [
  // Gallbladder / GI
  { code: "K80.00", system: "ICD-10-CM", display: "Calculus of gallbladder with acute cholecystitis without obstruction", category: "diagnosis", confidence: 0.99 },
  { code: "K81.0", system: "ICD-10-CM", display: "Acute cholecystitis", category: "diagnosis", confidence: 0.95 },
  { code: "47562", system: "CPT", display: "Laparoscopy, surgical; cholecystectomy", category: "procedure", confidence: 0.98 },
  { code: "47563", system: "CPT", display: "Laparoscopy, surgical; cholecystectomy with cholangiography", category: "procedure", confidence: 0.96 },
  { code: "0FT44ZZ", system: "SNOMED-CT", display: "Resection of Gallbladder, Percutaneous Endoscopic Approach", category: "procedure", confidence: 0.94 },

  // Orthopedics
  { code: "M17.11", system: "ICD-10-CM", display: "Unilateral primary osteoarthritis, right knee", category: "diagnosis", confidence: 0.99 },
  { code: "M17.12", system: "ICD-10-CM", display: "Unilateral primary osteoarthritis, left knee", category: "diagnosis", confidence: 0.99 },
  { code: "27447", system: "CPT", display: "Arthroplasty, knee, condyle and plateau; medial and lateral compartments", category: "procedure", confidence: 0.98 },
  { code: "0SRD0JZ", system: "SNOMED-CT", display: "Replacement of Right Knee Joint with Synthetic Substitute", category: "procedure", confidence: 0.96 },

  // Trauma / Thoracic
  { code: "S27.2XXA", system: "ICD-10-CM", display: "Traumatic hemopneumothorax, initial encounter", category: "diagnosis", confidence: 0.99 },
  { code: "S27.0XXA", system: "ICD-10-CM", display: "Traumatic pneumothorax, initial encounter", category: "diagnosis", confidence: 0.96 },
  { code: "32551", system: "CPT", display: "Tube thoracostomy, includes water seal", category: "procedure", confidence: 0.98 },
  { code: "0W9B30Z", system: "SNOMED-CT", display: "Drainage of Left Pleural Cavity with Drainage Device, Percutaneous Approach", category: "procedure", confidence: 0.95 },

  // Medications
  { code: "309090", system: "RxNorm", display: "Cefazolin 2000 MG Injection (Ancef)", category: "medication", confidence: 0.98 },
  { code: "197500", system: "RxNorm", display: "Clindamycin 900 MG Injection", category: "medication", confidence: 0.97 },
  { code: "197806", system: "RxNorm", display: "Lidocaine 10 MG/ML Injectable Solution (1%)", category: "medication", confidence: 0.97 },
  { code: "854873", system: "RxNorm", display: "Propofol 10 MG/ML Injectable Emulsion", category: "medication", confidence: 0.95 },
  { code: "1191", system: "RxNorm", display: "Aspirin 81 MG Chewable Tablet", category: "medication", confidence: 0.92 }
];

export function parseChecklistFromText(
  checklist: WhoChecklistItem[],
  spokenText: string
): { updatedChecklist: WhoChecklistItem[]; newlyVerified: WhoChecklistItem[] } {
  const lower = spokenText.toLowerCase();
  const newlyVerified: WhoChecklistItem[] = [];

  const updatedChecklist = checklist.map((item) => {
    if (item.checked) return item;

    const matched = item.voiceTrigger.some((trigger) => lower.includes(trigger.toLowerCase()));
    if (matched) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const verified = {
        ...item,
        checked: true,
        timestamp: timeStr,
        verifiedBy: "Dr. Lin (Voice Confirmed)"
      };
      newlyVerified.push(verified);
      return verified;
    }
    return item;
  });

  return { updatedChecklist, newlyVerified };
}

export function extractCodesFromText(spokenText: string): ClinicalCode[] {
  const lower = spokenText.toLowerCase();
  const matchedCodes: ClinicalCode[] = [];

  // Keyword to code heuristics
  if (lower.includes("cholecyst") || lower.includes("gallbladder") || lower.includes("calot") || lower.includes("cystic duct")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[0]); // K80.00
    matchedCodes.push(KNOWN_MEDICAL_CODES[2]); // CPT 47562
    matchedCodes.push(KNOWN_MEDICAL_CODES[4]); // SNOMED 0FT44ZZ
  }

  if (lower.includes("knee") || lower.includes("arthroplasty") || lower.includes("triathlon") || lower.includes("osteoarthritis") || lower.includes("femoral component")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[5]); // M17.11
    matchedCodes.push(KNOWN_MEDICAL_CODES[7]); // CPT 27447
    matchedCodes.push(KNOWN_MEDICAL_CODES[8]); // SNOMED 0SRD0JZ
  }

  if (lower.includes("chest tube") || lower.includes("thoracostomy") || lower.includes("hemopneumothorax") || lower.includes("pleural") || lower.includes("pleurovac")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[9]); // S27.2XXA
    matchedCodes.push(KNOWN_MEDICAL_CODES[11]); // CPT 32551
    matchedCodes.push(KNOWN_MEDICAL_CODES[12]); // SNOMED 0W9B30Z
  }

  // Medications
  if (lower.includes("cefazolin") || lower.includes("ancef")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[13]);
  }
  if (lower.includes("clindamycin")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[14]);
  }
  if (lower.includes("lidocaine")) {
    matchedCodes.push(KNOWN_MEDICAL_CODES[15]);
  }

  // Deduplicate by code
  const unique = new Map<string, ClinicalCode>();
  for (const c of matchedCodes) {
    unique.set(c.code, c);
  }
  return Array.from(unique.values());
}

export function detectMilestonesFromText(
  spokenText: string,
  existingMilestones: OperativeMilestone[]
): OperativeMilestone[] {
  const lower = spokenText.toLowerCase();
  const newMilestones: OperativeMilestone[] = [...existingMilestones];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const existingTypes = new Set(existingMilestones.map((m) => m.type));

  if (!existingTypes.has("timeout") && (lower.includes("timeout") || lower.includes("time out") || lower.includes("surgical safety pause"))) {
    newMilestones.push({
      id: `m_${Date.now()}_timeout`,
      timestamp: timeStr,
      elapsedMinutes: 0,
      type: "timeout",
      title: "Surgical Time Out Verified",
      details: "Patient identity, site marking, antibiotic timing, & consent confirmed hands-free."
    });
  }

  if (!existingTypes.has("incision") && (lower.includes("incision") || lower.includes("cut made") || lower.includes("trocar placed") || lower.includes("prepped and draped"))) {
    newMilestones.push({
      id: `m_${Date.now()}_incision`,
      timestamp: timeStr,
      elapsedMinutes: 4,
      type: "incision",
      title: "Initial Surgical Incision",
      details: "Skin incised; sterile field entered under direct vision."
    });
  }

  if (!existingTypes.has("critical_view") && (lower.includes("critical view") || lower.includes("calot") || lower.includes("resection cuts") || lower.includes("pleura entered"))) {
    newMilestones.push({
      id: `m_${Date.now()}_critical`,
      timestamp: timeStr,
      elapsedMinutes: 18,
      type: "critical_view",
      title: "Critical Anatomical Milestone",
      details: "Critical View of Safety achieved / target anatomical structure isolated."
    });
  }

  if (!existingTypes.has("implant") && (lower.includes("implant") || lower.includes("triathlon") || lower.includes("clipped") || lower.includes("chest tube placed"))) {
    newMilestones.push({
      id: `m_${Date.now()}_implant`,
      timestamp: timeStr,
      elapsedMinutes: 32,
      type: "implant",
      title: "Hardware / Implant / Drainage Placed",
      details: "Prosthetic implants or permanent ligations verified and secured."
    });
  }

  if (!existingTypes.has("specimen") && (lower.includes("specimen") || lower.includes("endocatch") || lower.includes("pathology") || lower.includes("blood drained"))) {
    newMilestones.push({
      id: `m_${Date.now()}_specimen`,
      timestamp: timeStr,
      elapsedMinutes: 41,
      type: "specimen",
      title: "Specimen Tagged for Pathology",
      details: "Tissue resected intact, inspected, and routed to Pathology lab."
    });
  }

  if (!existingTypes.has("closure") && (lower.includes("closing") || lower.includes("suture") || lower.includes("sponge count correct") || lower.includes("pacu") || lower.includes("monocryl"))) {
    newMilestones.push({
      id: `m_${Date.now()}_closure`,
      timestamp: timeStr,
      elapsedMinutes: 52,
      type: "closure",
      title: "Count Correct & Layered Closure",
      details: "Sponge & instrument counts verified 100% correct; skin closed."
    });
  }

  return newMilestones;
}
