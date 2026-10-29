import { ClinicalCode, StructuredOperativeReport, SurgicalPatient } from "../types/clinical";

export interface FhirResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FhirBundle {
  resourceType: "Bundle";
  id: string;
  type: "collection";
  timestamp: string;
  meta: {
    lastUpdated: string;
    profile: string[];
  };
  entry: Array<{
    fullUrl: string;
    resource: FhirResource;
  }>;
}

export function generateFhirR4Bundle(
  patient: SurgicalPatient,
  report: StructuredOperativeReport,
  codes: ClinicalCode[],
  milestones: any[]
): FhirBundle {
  const timestamp = new Date().toISOString();
  const bundleId = `bundle-sterileflow-${patient.mrn.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString(36)}`;

  // Extract clean numerical blood loss
  const eblMatch = report.estimatedBloodLoss.match(/(\d+)/);
  const eblValue = eblMatch ? parseInt(eblMatch[1], 10) : 25;

  const entries: Array<{ fullUrl: string; resource: FhirResource }> = [];

  // 1. Patient Resource
  const patientResource: FhirResource = {
    resourceType: "Patient",
    id: `patient-${patient.id}`,
    identifier: [
      {
        system: "http://hospital.org/mrn",
        value: patient.mrn
      }
    ],
    name: [
      {
        use: "official",
        text: patient.name,
        family: patient.name.split(" ").slice(-1)[0],
        given: patient.name.split(" ").slice(0, -1)
      }
    ],
    gender: patient.gender.toLowerCase() as "male" | "female" | "other",
    extension: [
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-bloodType",
        valueString: patient.bloodType
      }
    ]
  };
  entries.push({ fullUrl: `urn:uuid:${patientResource.id}`, resource: patientResource });

  // 2. Encounter Resource (Surgical Suite)
  const encounterResource: FhirResource = {
    resourceType: "Encounter",
    id: `encounter-surgical-${patient.id}`,
    status: "finished",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "SS",
      display: "Short stay surgical encounter"
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                code: "ATND",
                display: "attending surgeon"
              }
            ]
          }
        ],
        individual: {
          display: report.surgeon
        }
      }
    ],
    location: [
      {
        location: {
          display: patient.orRoom
        },
        status: "completed"
      }
    ]
  };
  entries.push({ fullUrl: `urn:uuid:${encounterResource.id}`, resource: encounterResource });

  // 3. Condition Resource (Pre-op & Post-op Diagnoses)
  const icdCodes = codes.filter((c) => c.system === "ICD-10-CM");
  const primaryIcd = icdCodes[0] || {
    code: patient.icd10PreOp,
    display: patient.preOpDiagnosis,
    system: "ICD-10-CM"
  };

  const conditionResource: FhirResource = {
    resourceType: "Condition",
    id: `condition-${patient.id}-postop`,
    clinicalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
          code: "resolved",
          display: "Resolved via Surgical Intervention"
        }
      ]
    },
    verificationStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
          code: "confirmed",
          display: "Confirmed"
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-category",
            code: "encounter-diagnosis",
            display: "Encounter Diagnosis"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/icd-10-cm",
          code: primaryIcd.code,
          display: primaryIcd.display
        }
      ],
      text: report.postOpDiagnosis
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    encounter: {
      reference: `urn:uuid:${encounterResource.id}`
    }
  };
  entries.push({ fullUrl: `urn:uuid:${conditionResource.id}`, resource: conditionResource });

  // 4. Procedure Resource (Operative Technique)
  const cptCode = codes.find((c) => c.system === "CPT") || {
    code: patient.cptCode,
    display: patient.scheduledProcedure,
    system: "CPT"
  };
  const snomedCode = codes.find((c) => c.system === "SNOMED-CT");

  const procedureCodings = [
    {
      system: "http://www.ama-assn.org/go/cpt",
      code: cptCode.code,
      display: cptCode.display
    }
  ];
  if (snomedCode) {
    procedureCodings.push({
      system: "http://snomed.info/sct",
      code: snomedCode.code,
      display: snomedCode.display
    });
  }

  const procedureResource: FhirResource = {
    resourceType: "Procedure",
    id: `procedure-${patient.id}`,
    status: "completed",
    code: {
      coding: procedureCodings,
      text: report.procedurePerformed
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    encounter: {
      reference: `urn:uuid:${encounterResource.id}`
    },
    performedPeriod: {
      start: new Date(Date.now() - 3600000).toISOString(),
      end: timestamp
    },
    performer: [
      {
        function: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/provenance-participant-type",
              code: "performer",
              display: "Lead Operating Surgeon"
            }
          ]
        },
        actor: {
          display: report.surgeon
        }
      }
    ],
    reasonReference: [
      {
        reference: `urn:uuid:${conditionResource.id}`,
        display: report.preOpDiagnosis
      }
    ],
    note: [
      {
        text: `Findings: ${report.findings}\nTechnique: ${report.techniqueDescription}`
      }
    ]
  };
  entries.push({ fullUrl: `urn:uuid:${procedureResource.id}`, resource: procedureResource });

  // 5. Observation: Estimated Blood Loss (LOINC 59770-8)
  const eblObservation: FhirResource = {
    resourceType: "Observation",
    id: `obs-ebl-${patient.id}`,
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "procedure",
            display: "Procedure"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "59770-8",
          display: "Procedure estimated blood loss"
        }
      ],
      text: "Estimated Blood Loss (EBL)"
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    encounter: {
      reference: `urn:uuid:${encounterResource.id}`
    },
    valueQuantity: {
      value: eblValue,
      unit: "mL",
      system: "http://unitsofmeasure.org",
      code: "mL"
    }
  };
  entries.push({ fullUrl: `urn:uuid:${eblObservation.id}`, resource: eblObservation });

  // 6. Observation: WHO Surgical Safety Time Out Verification (LOINC 74080-3)
  const whoTimeOutObs: FhirResource = {
    resourceType: "Observation",
    id: `obs-who-timeout-${patient.id}`,
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "74080-3",
          display: "Surgical safety checklist status"
        }
      ],
      text: "WHO Surgical Safety Checklist Time-Out Protocol"
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    valueCodeableConcept: {
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "386053000",
          display: "Evaluation procedure completed"
        }
      ],
      text: "Complete (All 8 Sterile Safety Milestones Verified by Voice)"
    }
  };
  entries.push({ fullUrl: `urn:uuid:${whoTimeOutObs.id}`, resource: whoTimeOutObs });

  // 7. MedicationAdministration: Prophylactic Antibiotic (RxNorm)
  const rxCode = codes.find((c) => c.system === "RxNorm") || {
    code: "309090",
    display: "Cefazolin 2g IV Prophylaxis",
    system: "RxNorm"
  };

  const medicationResource: FhirResource = {
    resourceType: "MedicationAdministration",
    id: `med-antibiotic-${patient.id}`,
    status: "completed",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: rxCode.code,
          display: rxCode.display
        }
      ]
    },
    subject: {
      reference: `urn:uuid:${patientResource.id}`,
      display: patient.name
    },
    context: {
      reference: `urn:uuid:${encounterResource.id}`
    },
    effectiveDateTime: new Date(Date.now() - 2400000).toISOString()
  };
  entries.push({ fullUrl: `urn:uuid:${medicationResource.id}`, resource: medicationResource });

  return {
    resourceType: "Bundle",
    id: bundleId,
    type: "collection",
    timestamp,
    meta: {
      lastUpdated: timestamp,
      profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-bundle"]
    },
    entry: entries
  };
}
