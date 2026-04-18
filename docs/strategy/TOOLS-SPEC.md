# Interactive Tools Specification

> Tools are your moat. They provide real utility and better conversion than generic
> "contact us now" pages.

**Important:** Do NOT present these as legal advice engines. Present them as educational
tools and intake aids, with clear disclaimers and escalation to a licensed lawyer.

---

## Tool 1: Accident Case Type Quiz

**Route:** `/tools/accident-case-quiz`
**Purpose:** "What kind of accident case do I have?"

### User Flow
1. Select accident type (car, truck, motorcycle, etc.)
2. Describe what happened (multiple choice options)
3. Select injuries (checklist)
4. Indicate timeline (when did it happen?)
5. Results: educational summary of case type + next steps

### Output
- Case type classification (educational, not legal)
- Relevant accident hub link
- Suggested next steps
- CTA: "Want to discuss with a lawyer who handles [type] cases?"

### Disclaimer
"This quiz provides general educational information. It is not legal advice and does not evaluate the merits of any potential claim."

---

## Tool 2: Urgency Checker

**Route:** `/tools/urgency-checker`
**Purpose:** "Do I need medical care now?"

### User Flow
1. What kind of accident? (select)
2. Are you experiencing any of these symptoms? (checklist of red flags)
3. When did the accident happen?
4. Have you seen a doctor?

### Output
- **Red (Urgent):** "Based on your answers, we strongly encourage you to seek medical attention immediately. Call 911 if needed."
- **Yellow (Soon):** "Your symptoms suggest you should see a doctor within 24-48 hours."
- **Green (Monitor):** "Your symptoms may be mild, but delayed symptoms are common. Consider seeing a doctor within a week."

### Emergency Banner
If ANY red-flag symptom is selected, immediately show: "If you are in immediate danger, call 911 now."

### Disclaimer
"This tool is for educational purposes only. It is not medical advice. Always consult a healthcare provider for medical concerns."

---

## Tool 3: Evidence Checklist Generator

**Route:** `/tools/evidence-checklist`
**Purpose:** Generate a customized evidence collection checklist

### User Flow
1. Select accident type
2. Select location type (road, business, workplace, home)
3. Were there witnesses?
4. Was a police report filed?
5. Do you have photos?

### Output
- Customized checklist based on accident type
- Prioritized items (critical, important, helpful)
- Printable/downloadable PDF
- Tips for each evidence type

### Checklist Items (by category)
**Scene Evidence:** Photos of scene, damage, injuries, conditions
**Documents:** Police report, medical records, insurance info
**Witnesses:** Names, contact info, statements
**Digital:** Dashcam footage, rideshare app data, phone records
**Medical:** Hospital records, doctor notes, pharmacy records
**Financial:** Pay stubs, bills, receipts for expenses

---

## Tool 4: Injury and Treatment Journal

**Route:** `/tools/injury-journal`
**Purpose:** Daily log of symptoms, pain levels, treatment

### Features
- Daily pain level tracker (1-10 scale)
- Symptom checklist (pre-populated by injury type)
- Treatment log (doctor visits, medications, therapy)
- Activity limitations log
- Mood/impact tracker
- Photo upload for visible injuries
- Export to PDF for attorney/doctor

### Data Model
```typescript
interface JournalEntry {
  date: string
  painLevel: number
  symptoms: string[]
  treatments: string[]
  medications: string[]
  limitations: string[]
  notes: string
  photos?: string[]
}
```

### Storage
- Local storage (no account required)
- Optional: Supabase sync with account
- Export to PDF at any time

---

## Tool 5: Lost Wages Estimator

**Route:** `/tools/lost-wages-estimator`
**Purpose:** Estimate lost income from accident injuries

### User Flow
1. Employment type (full-time, part-time, self-employed, gig)
2. Hourly rate or annual salary
3. Days missed from work
4. Reduced hours/capacity?
5. Ongoing inability to work?

### Output
- Estimated lost wages to date
- Projected losses if unable to return
- Types of wage documentation to gather
- Note: "Actual recoverable damages depend on many factors. Consult an attorney."

### Disclaimer
"This estimator provides rough calculations for educational purposes. Actual lost wage claims depend on employment records, medical documentation, and applicable law."

---

## Tool 6: Insurance Call Prep Tool

**Route:** `/tools/insurance-call-prep`
**Purpose:** Prepare for calls with insurance companies

### User Flow
1. Who are you calling? (your insurer, other driver's insurer, health insurer)
2. What's the purpose? (report claim, follow up, dispute)
3. What information do you have? (checklist)

### Output
- Call script template
- List of information to have ready
- Questions to ask
- Things NOT to say (common mistakes)
- Recording consent reminder (state-specific)
- Follow-up checklist

---

## Tool 7: Record Request Checklist

**Route:** `/tools/record-request`
**Purpose:** Know what records to request and from whom

### User Flow
1. Accident type
2. What records do you need? (guided selection)

### Output
- Customized list of records to request
- Who to contact for each
- Template request letters (downloadable)
- Expected timelines
- Cost information

### Record Types
- Police/accident reports
- Medical records (hospital, doctor, imaging)
- Employment records
- Insurance policy documents
- Property damage estimates
- Surveillance/security footage
- Rideshare trip data

---

## Tool 8: Settlement Readiness Checklist

**Route:** `/tools/settlement-readiness`
**Purpose:** "Am I ready to discuss settlement?"

### User Flow
Progressive checklist:
1. Medical treatment complete? (or at maximum improvement?)
2. All records gathered?
3. Lost wages documented?
4. Property damage resolved?
5. Liability clear?
6. Insurance limits known?

### Output
- Readiness score (educational)
- Missing items highlighted
- Next steps for each gap
- CTA: "Consider discussing your situation with an attorney"

---

## Tool 9: Lawyer Type Matcher

**Route:** `/tools/lawyer-type-matcher`
**Purpose:** Help users understand what type of attorney handles their situation

### User Flow
1. What happened? (accident type)
2. How severe? (injury indicators)
3. Any special circumstances? (commercial vehicle, government property, workplace)
4. What state?

### Output
- Type of attorney that typically handles this (educational)
- What to look for in that specialist
- Questions to ask during consultation
- CTA: "We can connect you with attorneys who handle [type] cases"

### Critical Language
"Based on your answers, cases like this are typically handled by [attorney type]. This is general information — every situation is unique."

---

## Tool 10: State-Specific Next-Step Generator

**Route:** `/tools/state-next-steps`
**Purpose:** State-aware guidance on what to do next

### User Flow
1. Select your state
2. Select accident type
3. When did it happen?

### Output
- State-specific statute of limitations warning
- State fault rules (at-fault, no-fault, comparative)
- Required reporting deadlines
- State-specific insurance requirements
- Recommended next steps
- State-specific resources

### Compliance Note
State-specific legal information MUST be reviewed by an attorney in that state. Use a `reviewedBy` and `reviewDate` field for each state's content. Do not publish state content without attorney sign-off.

---

## Tool 11: Statute of Limitations Countdown (NEW)

**Route:** `/tools/statute-countdown`
**Purpose:** "How long do I have to file a claim?"

### Why This Tool

"Statute of limitations for car accident in [state]" is one of the most searched PI queries. No competitor has an interactive countdown tool. This is a high-volume, low-competition keyword with strong conversion intent.

### User Flow

1. Select your state (CA, AZ — expandable)
2. Select accident/claim type (car accident, truck accident, medical malpractice, wrongful death, etc.)
3. Enter the date of the accident
4. Were you a minor at the time?
5. Was a government entity involved?

### Output

- **Countdown timer** showing days remaining until statute expires
- **Key date** displayed prominently: "Your deadline is [Date]"
- **State-specific statute citation** (e.g., "California CCP § 335.1 — 2 years for personal injury")
- **Exceptions listed** (minor tolling, government claims shorter deadlines, discovery rule)
- **Warning levels:**
  - Green (>6 months remaining): "You have time, but don't wait"
  - Yellow (3-6 months): "Your deadline is approaching"
  - Red (<3 months): "URGENT: Your deadline is very close. Consider speaking with an attorney soon."
  - Expired: "The general deadline for your claim type may have passed. Some exceptions may apply — consult an attorney immediately."
- **CTA:** "Want to discuss your timeline with a lawyer?"

### Data Model

```typescript
interface StatuteData {
  state: string
  claimType: string
  generalDeadlineYears: number
  statuteCitation: string
  exceptions: StatuteException[]
  governmentClaimDeadlineDays?: number
  minorTollingAge?: number
}

interface StatuteException {
  condition: string
  effect: string
  citation: string
}
```

### Compliance Notes

- This tool shows GENERAL statutory deadlines only
- Must display: "Statutes of limitations have many exceptions. The deadline for your specific situation may differ. Consult a licensed attorney to understand your exact deadline."
- Government claims have shorter deadlines (6 months in CA) — must highlight prominently
- Discovery rule exceptions for delayed-onset injuries — note but do not calculate
- **Attorney review required** for all state deadline data before launch

### Schema Markup

Use `SoftwareApplication` schema:
```json
{
  "@type": "SoftwareApplication",
  "name": "Statute of Limitations Countdown",
  "applicationCategory": "UtilitiesApplication",
  "description": "Check the deadline to file a personal injury claim in your state"
}
```

### SEO Value

- Primary keyword: "statute of limitations personal injury [state]" (high volume, medium KD)
- Secondary: "how long to file car accident claim california"
- Featured snippet opportunity: clear, direct answer format
- AI Overview citation opportunity: structured state-specific data

---

## Tool Page SEO Requirements (All Tools)

Every tool page must have:

1. **800+ words of supporting content** around the interactive widget (Google cannot index JS tool outputs)
2. **Relevant schema markup** (HowTo, SoftwareApplication where applicable)
3. **FAQ content block** below the tool (targets People Also Ask)
4. **Shareable results URL** (e.g., `/tools/evidence-checklist/results/[hash]`) for link building
5. **Internal links** to 3+ related hub/guide pages

---

## Technical Requirements (All Tools)

### Architecture
```typescript
// Each tool follows this pattern:
interface ToolConfig {
  slug: string
  title: string
  description: string
  disclaimer: string
  steps: ToolStep[]
  outputGenerator: (answers: ToolAnswers) => ToolOutput
}

interface ToolStep {
  id: string
  question: string
  type: 'select' | 'multiselect' | 'checklist' | 'number' | 'text'
  options?: ToolOption[]
  validation?: ValidationRule
}

interface ToolOutput {
  summary: string
  items: OutputItem[]
  cta: CTAConfig
  disclaimer: string
  exportable: boolean
}
```

### Shared Requirements
- [ ] Progressive multi-step UI (one question group per step)
- [ ] Progress indicator
- [ ] "Back" button on every step
- [ ] Mobile-optimized (44x44px touch targets)
- [ ] Disclaimer visible before AND after results
- [ ] Analytics events on each step + completion
- [ ] Export to PDF where applicable
- [ ] No data sent to server until user consents
- [ ] Accessible (keyboard nav, screen reader, ARIA)
- [ ] Fast (no heavy dependencies, client-side logic)
