export type ChecklistStage = "before_anesthesia" | "before_incision" | "before_leaving";

export interface WhoChecklistItem {
  id: string;
  stage: ChecklistStage;
  label: string;
  checked: boolean;
  voiceTrigger: string[];
  timestamp?: string;
  verifiedBy?: string;
}

export interface SurgicalPatient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  allergies: string[];
  bloodType: string;
  scheduledProcedure: string;
  preOpDiagnosis: string;
  icd10PreOp: string;
  cptCode: string;
  surgeon: string;
  anesthesiologist: string;
  circulatingNurse: string;
  scrubTech: string;
  orRoom: string;
}

export interface OperativeMilestone {
  id: string;
  timestamp: string;
  elapsedMinutes: number;
  type: "timeout" | "incision" | "critical_view" | "implant" | "specimen" | "closure" | "observation";
  title: string;
  details: string;
}

export interface ClinicalCode {
  code: string;
  system: "ICD-10-CM" | "CPT" | "SNOMED-CT" | "RxNorm";
  display: string;
  category: "diagnosis" | "procedure" | "medication" | "observation";
  confidence: number;
}

export interface StructuredOperativeReport {
  patientMrn: string;
  patientName: string;
  date: string;
  preOpDiagnosis: string;
  postOpDiagnosis: string;
  procedurePerformed: string;
  surgeon: string;
  assistant: string;
  anesthesiaType: string;
  estimatedBloodLoss: string;
  specimensRemoved: string[];
  implantsUsed: string[];
  spongeNeedleCount: "Correct" | "Pending" | "Incorrect";
  indications: string;
  findings: string;
  techniqueDescription: string;
  complications: string;
  disposition: string;
}

export interface ClinicalScenario {
  id: string;
  title: string;
  specialty: string;
  patient: SurgicalPatient;
  fullDictationSample: string;
  dictationStreamChunks: string[];
  expectedCodes: ClinicalCode[];
  reportTemplate: Partial<StructuredOperativeReport>;
}
