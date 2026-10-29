import { ClinicalScenario, WhoChecklistItem } from "../types/clinical";

export const DEFAULT_WHO_CHECKLIST: WhoChecklistItem[] = [
  {
    id: "item_pt_id",
    stage: "before_incision",
    label: "Patient identity, surgical site, side, & consent confirmed",
    checked: false,
    voiceTrigger: ["patient identity", "site confirmed", "consent confirmed", "patient verified", "identity confirmed"]
  },
  {
    id: "item_site_mark",
    stage: "before_incision",
    label: "Surgical site marking visible & validated",
    checked: false,
    voiceTrigger: ["site marked", "marking visible", "site verified", "right side", "left side"]
  },
  {
    id: "item_anesthesia_check",
    stage: "before_incision",
    label: "Anesthesia machine & medication safety check complete",
    checked: false,
    voiceTrigger: ["anesthesia check complete", "airway secure", "anesthesia ready", "vitals stable"]
  },
  {
    id: "item_pulse_ox",
    stage: "before_incision",
    label: "Pulse oximeter on patient & functioning properly (SpO2 > 98%)",
    checked: false,
    voiceTrigger: ["pulse oximeter", "oxygen saturation", "oximeter functional", "spo2 normal"]
  },
  {
    id: "item_antibiotics",
    stage: "before_incision",
    label: "Prophylactic antibiotic administered within 60 min (Cefazolin 2g IV)",
    checked: false,
    voiceTrigger: ["antibiotic given", "cefazolin administered", "antibiotic infused", "cefazolin 2 grams", "antibiotics complete"]
  },
  {
    id: "item_allergies",
    stage: "before_incision",
    label: "Patient allergy profile reviewed with surgical & anesthesia team",
    checked: false,
    voiceTrigger: ["allergies reviewed", "no known allergies", "penicillin allergy", "allergy confirmed"]
  },
  {
    id: "item_critical_steps",
    stage: "before_incision",
    label: "Surgeon reviews anticipated critical steps, duration & EBL (<100 cc)",
    checked: false,
    voiceTrigger: ["critical steps reviewed", "anticipated blood loss", "ebl minimal", "time out verified", "timeout complete"]
  },
  {
    id: "item_sterility",
    stage: "before_incision",
    label: "Sterile field & autoclave indicator strips verified by scrub nurse",
    checked: false,
    voiceTrigger: ["sterility verified", "indicators dark", "sterile field confirmed", "trays sterile"]
  }
];

export const CLINICAL_SCENARIOS: ClinicalScenario[] = [
  {
    id: "lap_chole",
    title: "Laparoscopic Cholecystectomy (General Surgery)",
    specialty: "General & Minimally Invasive Surgery",
    patient: {
      id: "pt_90214",
      mrn: "MRN-784920",
      name: "Eleanor Vance",
      age: 48,
      gender: "Female",
      allergies: ["Penicillin", "Sulfa drugs"],
      bloodType: "A+",
      scheduledProcedure: "Laparoscopic Cholecystectomy with Cholangiogram",
      preOpDiagnosis: "Acute cholecystitis with cholelithiasis",
      icd10PreOp: "K80.00",
      cptCode: "47562",
      surgeon: "Dr. Sarah Lin, MD, FACS",
      anesthesiologist: "Dr. Robert Chen, MD",
      circulatingNurse: "Mark Davies, RN",
      scrubTech: "Amina Patel, CST",
      orRoom: "OR-4 (Laparoscopic Suite)"
    },
    fullDictationSample: 
      "Initiating surgical timeout for Eleanor Vance, MRN 784920. Patient identity, consent, and right upper quadrant surgical site confirmed. Penicillin allergy acknowledged. Anesthesia check complete and Cefazolin substituted with Clindamycin 900mg IV infused 20 minutes ago. Sterility indicators verified. Proceeding with initial subumbilical incision. Insufflation achieved to 15 mmHg without complication. Four laparoscopic trocars placed under direct vision. Examination reveals acutely inflamed, tense gallbladder with surrounding pericholecystic adhesions. Careful blunt dissection performed to clear Calot's triangle. Critical view of safety unequivocally achieved with two and only two structures entering gallbladder. Cystic duct doubly clipped with titanium clips proximally, single clip distally, and transected. Cystic artery similarly identified, clipped, and transected. Gallbladder dissected off liver bed using electrocautery. Hemostasis achieved on liver bed with electrocautery and Surgicel. Specimen placed in Endocatch bag and extracted through umbilical port. Sponge and needle count reported correct. Estimated blood loss 25 cc. Patient tolerated procedure well, transferred to PACU in stable condition.",
    dictationStreamChunks: [
      "Initiating surgical timeout for Eleanor Vance, MRN 784920. Patient identity, consent, and right upper quadrant site confirmed.",
      "Penicillin allergy acknowledged. Anesthesia check complete and Clindamycin 900mg IV infused 20 minutes ago.",
      "Sterility indicators verified. Timeout complete. Proceeding with initial subumbilical incision at 08:15.",
      "Insufflation established to 15 mmHg. Four ports placed under direct visualization.",
      "Acutely inflamed gallbladder identified. Calot's triangle dissected until Critical View of Safety is established.",
      "Cystic duct clipped and divided. Cystic artery clipped and divided. Gallbladder dissected from liver bed.",
      "Liver bed hemostasis confirmed. Specimen retrieved via Endocatch bag. Estimated blood loss 25 cc.",
      "Sponge and needle counts verified correct. Trocar sites closed with 4-0 Monocryl. Patient stable to PACU."
    ],
    expectedCodes: [
      { code: "K80.00", system: "ICD-10-CM", display: "Calculus of gallbladder with acute cholecystitis without obstruction", category: "diagnosis", confidence: 0.99 },
      { code: "K82.9", system: "ICD-10-CM", display: "Disease of gallbladder, unspecified", category: "diagnosis", confidence: 0.92 },
      { code: "47562", system: "CPT", display: "Laparoscopy, surgical; cholecystectomy", category: "procedure", confidence: 0.98 },
      { code: "0FT44ZZ", system: "SNOMED-CT", display: "Resection of Gallbladder, Percutaneous Endoscopic Approach", category: "procedure", confidence: 0.95 },
      { code: "197500", system: "RxNorm", display: "Clindamycin 900 MG Injection", category: "medication", confidence: 0.97 }
    ],
    reportTemplate: {
      preOpDiagnosis: "Acute cholecystitis with cholelithiasis",
      postOpDiagnosis: "Severe acute gangrenous cholecystitis with cholelithiasis, resolved without perforation",
      procedurePerformed: "Laparoscopic cholecystectomy with critical view of safety dissection",
      surgeon: "Dr. Sarah Lin, MD, FACS",
      assistant: "Dr. Marcus Brody, MD (PGY-4)",
      anesthesiaType: "General endotracheal anesthesia (GETA)",
      estimatedBloodLoss: "25 mL",
      specimensRemoved: ["Intact gallbladder containing multiple cholesterol calculi sent to Pathology"],
      implantsUsed: ["Hem-o-lok & titanium vascular clips (5 total)"],
      spongeNeedleCount: "Correct",
      indications: "A 48-year-old female presenting with severe RUQ pain, positive Murphy's sign, leukocytosis (WBC 14.8), and ultrasound confirmation of gallbladder distention and cholelithiasis.",
      findings: "Thickened, hyperemic gallbladder wall with dense omental adhesions. No bile spillage. Calot's triangle anatomy clearly defined with critical view of safety. Common bile duct visualized and uninvolved.",
      techniqueDescription: "After successful general anesthesia, patient prepped and draped in standard sterile fashion. Veress needle entry at umbilicus, pneumoperitoneum achieved to 15 mmHg. 10mm umbilical port placed, followed by three 5mm ports under laparoscopic guidance. Omental adhesions divided. Dissection of cystic duct and artery performed, followed by clip ligation and division. Gallbladder removed off liver bed with cautery. Bed irrigated, perfect hemostasis noted. Port sites closed.",
      complications: "None. No bile leak, no visceral injury.",
      disposition: "Extubated in OR, transferred to Post-Anesthesia Care Unit (PACU) in stable condition, plan for same-day discharge."
    }
  },
  {
    id: "total_knee",
    title: "Right Total Knee Arthroplasty (Orthopedic Surgery)",
    specialty: "Orthopedic Joint Reconstruction",
    patient: {
      id: "pt_88312",
      mrn: "MRN-649102",
      name: "David Kowalski",
      age: 67,
      gender: "Male",
      allergies: ["No Known Drug Allergies (NKDA)"],
      bloodType: "O+",
      scheduledProcedure: "Right Total Knee Arthroplasty (TKA)",
      preOpDiagnosis: "Primary osteoarthritis of right knee",
      icd10PreOp: "M17.11",
      cptCode: "27447",
      surgeon: "Dr. James Sterling, MD",
      anesthesiologist: "Dr. Elena Rostova, MD",
      circulatingNurse: "David Miller, RN",
      scrubTech: "Rachel Green, CST",
      orRoom: "OR-2 (Laminar Flow Orthopedic Suite)"
    },
    fullDictationSample: 
      "Conducting surgical safety pause for David Kowalski, MRN 649102. Right knee total joint replacement confirmed. Surgical site marked on right patella. NKDA verified. Cefazolin 2g IV administered 35 minutes prior. Tourniquet placed on right upper thigh and inflated to 250 mmHg after limb exsanguination with Esmarch bandage. Midline anterior skin incision made, followed by medial parapatellar arthrotomy. Extensive tri-compartmental osteophytes excised. Measured resection technique utilized for distal femoral and proximal tibial bone cuts. Trial components seated with excellent stability and full extension to 0 degrees and flexion to 125 degrees. Surfaces pulsatile-lavaged and dried. Stryker Triathlon cruciate-retaining implants cemented into place: Size 5 femoral component, Size 4 tibial baseplate with 11mm polyethylene bearing insert. Cement allowed to cure under sustained compression. Tourniquet deflated after 42 minutes with meticulous bipolar cautery hemostasis. Layered closure performed over deep drain. Estimated blood loss 50 cc. Patient transferred to recovery in stable condition with neurovascular status intact.",
    dictationStreamChunks: [
      "Conducting surgical pause for David Kowalski, MRN 649102. Right knee total arthroplasty confirmed. Site marked.",
      "NKDA verified. Cefazolin 2g IV infused. Tourniquet applied to right thigh and inflated to 250 mmHg.",
      "Midline anterior skin incision and medial parapatellar arthrotomy executed. Cruciate ligament excised.",
      "Distal femoral and proximal tibial resection cuts performed. Trial sizing confirms excellent coronal alignment.",
      "Cement preparation underway. Triathlon Cruciate-Retaining Size 5 Femur, Size 4 Tibial tray, 11mm poly implanted.",
      "Cement cured under axial pressure. Tourniquet deflated at 42 minutes. Hemostasis secured.",
      "Sponge, needle, and instrument count confirmed correct. Layered closure with barbed suture. EBL 50 cc."
    ],
    expectedCodes: [
      { code: "M17.11", system: "ICD-10-CM", display: "Unilateral primary osteoarthritis, right knee", category: "diagnosis", confidence: 0.99 },
      { code: "27447", system: "CPT", display: "Arthroplasty, knee, condyle and plateau; medial and lateral compartments with or without patella resurfacing", category: "procedure", confidence: 0.98 },
      { code: "0SRD0JZ", system: "SNOMED-CT", display: "Replacement of Right Knee Joint with Synthetic Substitute", category: "procedure", confidence: 0.96 },
      { code: "309090", system: "RxNorm", display: "Cefazolin 2000 MG Injection", category: "medication", confidence: 0.98 }
    ],
    reportTemplate: {
      preOpDiagnosis: "End-stage primary tricompartmental osteoarthritis of right knee",
      postOpDiagnosis: "Same, status post uncomplicated right total knee arthroplasty",
      procedurePerformed: "Right total knee arthroplasty (cemented, cruciate-retaining)",
      surgeon: "Dr. James Sterling, MD",
      assistant: "Dr. Kevin Patel, MD (Fellow)",
      anesthesiaType: "Spinal anesthesia with adductor canal block and sedation",
      estimatedBloodLoss: "50 mL",
      specimensRemoved: ["Resected femoral condyles, tibial plateau, and osteophytes sent to surgical pathology"],
      implantsUsed: [
        "Stryker Triathlon Femoral Component Size 5 Right (Lot #89211)",
        "Stryker Triathlon Tibial Tray Size 4 (Lot #89212)",
        "Stryker X3 Polyethylene Insert 11mm (Lot #89213)"
      ],
      spongeNeedleCount: "Correct",
      indications: "67-year-old active male with debilitating right knee pain failing conservative therapy including intra-articular steroid injections and physical therapy.",
      findings: "Severe grade IV chondromalacia with bone-on-bone contact in the medial and patellofemoral compartments. Dense medial osteophytes and contracted medial collateral ligament.",
      techniqueDescription: "Standard sterile prep and drape under laminar airflow. Medial parapatellar approach. Femoral intramedullary guide used, tibial extramedullary guide used. Precision bone cuts made. High-viscosity bone cement pressurized. Implants impacted and maintained under axial alignment. Tourniquet release showed dry bed.",
      complications: "None. Distal pulses (Dorsalis pedis and posterior tibial) 2+ bilaterally upon emergence.",
      disposition: "Admitted to orthopedic inpatient floor for physical therapy post-op Day 0 mobilization."
    }
  },
  {
    id: "er_chest_tube",
    title: "Emergent Tube Thoracostomy (ER Trauma Resuscitation)",
    specialty: "Trauma & Critical Care Surgery",
    patient: {
      id: "pt_77190",
      mrn: "MRN-331089",
      name: "Marcus Reynolds",
      age: 31,
      gender: "Male",
      allergies: ["Latex"],
      bloodType: "B-",
      scheduledProcedure: "Emergent Left Tube Thoracostomy (Chest Tube Insertion)",
      preOpDiagnosis: "Traumatic left hemopneumothorax secondary to blunt thoracic trauma",
      icd10PreOp: "S27.2XXA",
      cptCode: "32551",
      surgeon: "Dr. Maya Torres, MD (Trauma Attending)",
      anesthesiologist: "Dr. Alan Cruz, MD",
      circulatingNurse: "Jessica Taylor, RN",
      scrubTech: "Carlos Gomez, CST",
      orRoom: "Trauma Resuscitation Bay 1"
    },
    fullDictationSample: 
      "Emergency trauma procedure for Marcus Reynolds, MRN 331089, admitted following motor vehicle collision with steering wheel impact. Rapid clinical assessment shows decreased left breath sounds, hyperresonance, and oxygen desaturation to 88 percent. Pre-procedure ultrasound FAST exam confirms absent lung sliding on left side indicative of tension pneumothorax. Patient consent waived due to emergent life-threatening status. Latex allergy protocol observed. Left lateral chest wall prepped with ChloraPrep. Local infiltration with 10 cc of 1 percent lidocaine with epinephrine into fifth intercostal space along mid-axillary line. Transverse 2 cm incision made over superior border of sixth rib. Kelly clamp utilized for blunt dissection through intercostal musculature and parietal pleura. Immediate rush of air and 350 cc of dark non-clotted blood evacuated. Digital exploration performed confirming intrathoracic entry and absent diaphragmatic injury. A 32 French curved chest tube placed apically and posteriorly without resistance. Tube connected to Pleurovac suction at negative 20 cm water. Excellent column swing and tidal respiration noted. Tube secured with 0-silk mattress suture. Immediate improvement in oxygen saturation to 99 percent and restoration of bilateral breath sounds. Estimated blood loss 350 cc. Patient stabilized and transferred to CT suite for pan-scan trauma protocol.",
    dictationStreamChunks: [
      "Emergency procedure for Marcus Reynolds, MRN 331089. Blunt thoracic trauma with left tension hemopneumothorax.",
      "Latex allergy confirmed. Site prepped at 5th intercostal space left mid-axillary line.",
      "10 cc Lidocaine infiltrated. 2 cm skin incision over 6th rib margin.",
      "Blunt dissection into pleural cavity. Immediate rush of air and 350 cc dark blood drained.",
      "Digital sweep confirms intrapleural positioning. 32 French chest tube inserted apically.",
      "Tube connected to underwater seal at -20 cm H2O. Good tidaling confirmed.",
      "Secured with 0-silk suture and occlusive dressing. SpO2 restored to 99 percent. Stable for CT scan."
    ],
    expectedCodes: [
      { code: "S27.2XXA", system: "ICD-10-CM", display: "Traumatic hemopneumothorax, initial encounter", category: "diagnosis", confidence: 0.99 },
      { code: "S27.0XXA", system: "ICD-10-CM", display: "Traumatic pneumothorax, initial encounter", category: "diagnosis", confidence: 0.94 },
      { code: "32551", system: "CPT", display: "Tube thoracostomy, includes water seal (e.g., for abscess, hemothorax, empyema), when performed", category: "procedure", confidence: 0.98 },
      { code: "0W9B30Z", system: "SNOMED-CT", display: "Drainage of Left Pleural Cavity with Drainage Device, Percutaneous Approach", category: "procedure", confidence: 0.95 },
      { code: "197806", system: "RxNorm", display: "Lidocaine 10 MG/ML Injectable Solution", category: "medication", confidence: 0.97 }
    ],
    reportTemplate: {
      preOpDiagnosis: "Traumatic left tension hemopneumothorax with respiratory distress",
      postOpDiagnosis: "Resolved left tension hemopneumothorax status post tube thoracostomy",
      procedurePerformed: "Emergent left tube thoracostomy (32 Fr chest tube)",
      surgeon: "Dr. Maya Torres, MD (Trauma Attending)",
      assistant: "Dr. Nathan Cole, MD (Trauma Fellow)",
      anesthesiaType: "Local anesthesia (1% Lidocaine) with conscious procedural sedation",
      estimatedBloodLoss: "350 mL (drained hemothorax)",
      specimensRemoved: ["Pleural fluid sent for urgent hematocrit and cell count"],
      implantsUsed: ["Argyle 32 Fr Thoracic Catheter (Lot #44920)"],
      spongeNeedleCount: "Correct",
      indications: "31-year-old unrestrained driver involved in high-speed MVC presenting with respiratory failure, tracheal deviation, and left-sided absent breath sounds.",
      findings: "Under high tension, significant decompression of air followed by immediate evacuation of 350 cc acute non-clotted hemothorax. Rapid hemodynamic stabilization upon decompression.",
      techniqueDescription: "Emergency prep and sterile drape. Fifth intercostal space identified along anterior axillary line. Local anesthesia infiltrated down to pleura. 2 cm skin incision made. Blunt clamp dissection created tract directly above rib border to avoid neurovascular bundle. Pleura entered bluntly, finger inserted to confirm intrapleural placement and clear lung adhesions. Tube placed toward apex and connected to water seal. Tube sutured and taped.",
      complications: "None. No persistent air leak, no visceral parenchymal laceration.",
      disposition: "Vital signs normalized: BP 124/78, HR 88, SpO2 99% on room air. Escorted directly to multi-slice trauma CT."
    }
  }
];
