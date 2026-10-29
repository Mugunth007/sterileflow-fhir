# SterileFlow FHIR 🩺⚡
> **The Hands-Free Sterile Cockpit & Real-Time Voice-to-FHIR EHR Bridge**  
> *Submitted for "No Hands: The Wispr Challenge" — Track 1: Builders (WeMakeDevs x Wispr Flow)*

---

## 🌟 The Problem: The "No Hands" Sterile Imperative

In surgical operating rooms, cardiac catheterization labs, dental operatories, and emergency trauma bays, clinicians face an uncompromising physical law: **once you are scrubbed in and sterile, you cannot touch a keyboard, mouse, or screen without contaminating the sterile field.**

Currently, this creates two massive problems:
1. **Critical Delays & Safety Hazards**: Surgeries are delayed while nursing staff frantically try to type details, verify the WHO Surgical Safety checklist, and record implant serial numbers while managing instruments.
2. **"Pajama Time" & EHR Burnout**: Surgeons spend 2 to 3 hours every night at a terminal manually re-typing operative reports and looking up diagnostic billing codes from memory, leading to widespread physician burnout and documentation errors.

**Wispr Flow solves this completely.** Because voice requires **no hands**, a surgeon can orchestrate safety timeouts, log operative milestones, and dictate clinical findings in real time right at the operating table.

---

## 🚀 What SterileFlow FHIR Does

**SterileFlow FHIR** turns voice dictation into an operating-room-grade heads-up cockpit that:

1. **Conducts the WHO Surgical Safety Time-Out by Voice**: 
   Verifies patient identity, surgical marking, allergy review, antibiotic timing (Cefazolin 2g IV), and sterility indicators completely hands-free.
2. **Logs Real-Time Intra-Operative Milestones**: 
   Automatically detects and timestamps critical events (Incision, Critical View of Safety, Implants/Hardware placed, Specimen retrieval, Sponge & Needle count correct, Layered closure).
3. **Synthesizes Instant Structured Operative Reports (SOAP / Brief Op Note)**: 
   Converts spoken dictation into formatted Pre/Post-Op diagnoses, findings, surgical technique, and post-op disposition.
4. **Auto-Compiles Validated HL7 FHIR R4 Bundles & ICD-10 Coding**:
   Simultaneously maps spoken diagnoses to **ICD-10-CM**, procedures to **CPT / SNOMED-CT**, medications to **RxNorm**, and compiles a production-ready **HL7 FHIR R4 Collection Bundle** (`Encounter`, `Procedure`, `Condition`, `Observation: EBL`, `MedicationAdministration`) ready for one-click hospital EHR export.

---

## 🛠️ Architecture & Clinical Standards

```
Voice Input (Wispr Flow / Microphone)
                  ↓
       SterileFlow NLP Engine
                  ↓
   ┌──────────────┼──────────────┐
   ↓              ↓              ↓
WHO Time-Out  Intra-Op Log   Clinical SOAP
   ↓              ↓              ↓
   └──────────────┬──────────────┘
                  ↓
    HL7 FHIR R4 Compilation
(ICD-10-CM • CPT • SNOMED-CT • RxNorm • LOINC)
                  ↓
   Downloadable US Core FHIR Bundle
```

* **Frontend**: React 18 / 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
* **Clinical Ontologies**:
  * **ICD-10-CM**: Diagnostic coding (`K80.00`, `M17.11`, `S27.2XXA`).
  * **CPT / SNOMED-CT**: Procedure coding (`47562`, `27447`, `32551`).
  * **RxNorm**: Medications (`309090` Cefazolin, `197500` Clindamycin, `197806` Lidocaine).
  * **LOINC**: Observations (`59770-8` Estimated Blood Loss, `74080-3` Surgical checklist).
* **Interoperability**: Standard HL7 FHIR R4 JSON collection bundle.

---

## 🎬 2-Minute Demo Video Walkthrough Script

When recording your submission video for WeMakeDevs:

1. **0:00 - 0:25 (The Problem)**:
   * *"Hi, I'm Mugunth. In operating rooms and sterile procedures, surgeons wear sterile gloves. They cannot touch a keyboard without contaminating the field and endangering patient safety. That's why I built SterileFlow FHIR with Wispr Flow."*
2. **0:25 - 0:55 (The Voice Time-Out)**:
   * Click **"Simulate Live Audio"** (or hold CapsLock with Wispr Flow and say: *"Initiating surgical timeout for Eleanor Vance. Patient identity, consent, and site confirmed. Penicillin allergy acknowledged. Clindamycin 900mg IV infused."*).
   * Show the **WHO Surgical Time-Out** checklist automatically checking off items with green verified badges and celebratory confetti!
3. **0:55 - 1:30 (Intra-Op Dictation & Clinical Report)**:
   * Show the timeline logging **Initial Incision**, **Critical View of Safety**, and **Estimated Blood Loss 25 cc**.
   * Show the center panel instantly assembling the structured **Operative Note**.
4. **1:30 - 2:00 (The FHIR & ICD-10 Powerhouse)**:
   * Switch to the right panel.
   * Highlight the auto-extracted **ICD-10-CM code (`K80.00`)**, **CPT code (`47562`)**, and **RxNorm code (`197500`)**.
   * Click the **"Raw FHIR JSON"** tab and click **"Download FHIR R4"** to show the generated JSON file ready for hospital EHR import.
   * *"SterileFlow FHIR proves that with Wispr Flow, doctors never have to touch a keyboard again."*

---

## 🚀 Running the App Locally

```bash
cd sterileflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
