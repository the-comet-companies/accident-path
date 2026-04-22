# DEV-12: Tool Template + Static Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete tools section — Zod schema, 11 CMS files, tools index page, tool detail page template, and ToolEngine placeholder — enabling static generation of all 11 tool pages with full content but no live interactivity (reserved for DEV-15).

**Architecture:** Tools follow the hub/detail pattern of `/guides` and `/accidents`. The index page is a server component with a hardcoded featured 2-col row plus a 9-card grid — no client hub component needed. Detail pages use `generateStaticParams` + a 2-col layout with a `'use client'` ToolEngine placeholder. All content is JSON-driven and Zod-validated at build time via the existing `loadAndValidate`/`loadAll` helpers.

**Tech Stack:** Next.js 14 App Router (server components + `generateStaticParams`), TypeScript strict, Tailwind CSS, Zod, JSON content files in `content/tools/`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `types/tool.ts` | Zod schemas + TypeScript types |
| Modify | `lib/cms.ts` | Add `getTool` / `getAllTools` entries |
| Modify | `lib/seo.ts` | Add `softwareApplicationSchema` helper |
| Create | `content/tools/statute-countdown.json` | Featured tool #1 |
| Create | `content/tools/accident-case-quiz.json` | Featured tool #2 |
| Create | `content/tools/urgency-checker.json` | Grid tool |
| Create | `content/tools/evidence-checklist.json` | Grid tool |
| Create | `content/tools/injury-journal.json` | Grid tool |
| Create | `content/tools/lost-wages-estimator.json` | Grid tool |
| Create | `content/tools/insurance-call-prep.json` | Grid tool |
| Create | `content/tools/record-request.json` | Grid tool |
| Create | `content/tools/settlement-readiness.json` | Grid tool |
| Create | `content/tools/lawyer-type-matcher.json` | Grid tool |
| Create | `content/tools/state-next-steps.json` | Grid tool |
| Create | `app/tools/page.tsx` | Index — featured 2-col + 9-card grid |
| Create | `components/tools/ToolEngine.tsx` | Placeholder `'use client'` widget |
| Create | `app/tools/[slug]/page.tsx` | Detail page with 2-col layout |

---

### Task 1: Zod Schema (`types/tool.ts`)

**Files:**
- Create: `types/tool.ts`

- [ ] **Step 1: Create the file with the exact schema from the spec**

```typescript
import { z } from 'zod'

export const ToolStepSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
})

export const ToolConfigSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  disclaimer: z.string(),
  steps: z.array(ToolStepSchema).min(2),
  supportingContent: z.array(z.object({
    heading: z.string(),
    content: z.string().min(150),
    tips: z.array(z.string()).optional(),
  })).min(4),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string().min(50),
  })).min(3),
  relatedTools: z.array(z.string()),
  relatedGuides: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
})

export type ToolConfig = z.infer<typeof ToolConfigSchema>
export type ToolStep = z.infer<typeof ToolStepSchema>
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/tool.ts
git commit -m "feat: add ToolConfig and ToolStep Zod schemas"
```

---

### Task 2: CMS + SEO Additions (`lib/cms.ts`, `lib/seo.ts`)

**Files:**
- Modify: `lib/cms.ts`
- Modify: `lib/seo.ts`

- [ ] **Step 1: Add tool loader entries to `lib/cms.ts`**

Add the import at the top with the other type imports:

```typescript
import { ToolConfigSchema, type ToolConfig } from '@/types/tool'
```

Add these two entries inside the `cms` export object (after the existing `getGuide`/`getAllGuides` lines):

```typescript
getTool: (slug: string) => loadAndValidate<ToolConfig>('tools', slug, ToolConfigSchema),
getAllTools: () => loadAll<ToolConfig>('tools', ToolConfigSchema),
```

The final `cms` object should look like:

```typescript
export const cms = {
  getAccident: (slug: string) => loadAndValidate<AccidentType>('accidents', slug, AccidentTypeSchema),
  getAllAccidents: () => loadAll<AccidentType>('accidents', AccidentTypeSchema),
  getInjury: (slug: string) => loadAndValidate<InjuryType>('injuries', slug, InjuryTypeSchema),
  getAllInjuries: () => loadAll<InjuryType>('injuries', InjuryTypeSchema),
  getState: (slug: string) => loadAndValidate<StateData>('states', slug, StateDataSchema),
  getAllStates: () => loadAll<StateData>('states', StateDataSchema),
  getCity: (slug: string) => loadAndValidate<CityData>('cities', slug, CityDataSchema),
  getAllCities: () => loadAll<CityData>('cities', CityDataSchema),
  getCitiesByState: (stateSlug: string) => loadAll<CityData>('cities', CityDataSchema).filter(c => c.stateSlug === stateSlug),
  getGuide: (slug: string) => loadAndValidate<Guide>('guides', slug, GuideSchema),
  getAllGuides: () => loadAll<Guide>('guides', GuideSchema),
  getTool: (slug: string) => loadAndValidate<ToolConfig>('tools', slug, ToolConfigSchema),
  getAllTools: () => loadAll<ToolConfig>('tools', ToolConfigSchema),
}
```

- [ ] **Step 2: Add `softwareApplicationSchema` to `lib/seo.ts`**

Append this export to the end of `lib/seo.ts` (after `faqSchema`):

```typescript
// ─── SoftwareApplication ─────────────────────────────────────────────────────

export interface SoftwareApplicationSchemaInput {
  name: string
  description: string
  url: string
  applicationCategory?: string
}

export function softwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'LegalService',
}: SoftwareApplicationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'AccidentPath',
      url: BASE_URL,
    },
  }
}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/cms.ts lib/seo.ts
git commit -m "feat: add getTool/getAllTools to cms and softwareApplicationSchema to seo"
```

---

### Task 3: Featured Tool Content (`statute-countdown.json`, `accident-case-quiz.json`)

**Files:**
- Create: `content/tools/statute-countdown.json`
- Create: `content/tools/accident-case-quiz.json`

- [ ] **Step 1: Create `content/tools/` directory and write `statute-countdown.json`**

```bash
mkdir -p content/tools
```

Write `content/tools/statute-countdown.json`:

```json
{
  "slug": "statute-countdown",
  "title": "Statute of Limitations Countdown",
  "metaTitle": "Statute of Limitations Countdown — CA & AZ",
  "metaDescription": "Find out how much time you may have left to file a personal injury claim in California or Arizona. Enter your accident date and get your estimated deadline.",
  "description": "The statute of limitations sets a strict legal deadline on your right to pursue compensation after an accident. This tool helps you understand how much time may remain and what steps you should consider before your deadline approaches.",
  "disclaimer": "This tool provides estimated deadline information for educational purposes only. It is not legal advice. Deadlines vary based on your specific circumstances, including who was at fault and whether government entities are involved. Consult an attorney to understand your actual filing deadline.",
  "steps": [
    {
      "id": "accident-date",
      "question": "When did your accident happen?",
      "type": "date"
    },
    {
      "id": "accident-type",
      "question": "What type of accident was it?",
      "type": "select"
    },
    {
      "id": "state",
      "question": "Which state did the accident occur in?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "What Is the Statute of Limitations?",
      "content": "The statute of limitations is a legal deadline that limits how long you have to file a lawsuit after an injury. Once this deadline passes, courts will generally refuse to hear your case, regardless of how strong your evidence is or how serious your injuries were. This rule exists to ensure that cases are resolved while evidence and witness memories are still fresh and reliable.",
      "tips": [
        "The clock typically starts on the date of the accident — not when you first notice symptoms",
        "Missing the deadline usually means losing your right to compensation permanently",
        "Some circumstances can pause or extend the deadline — consult an attorney to be sure"
      ]
    },
    {
      "heading": "California Statute of Limitations for Injury Claims",
      "content": "In California, most personal injury claims — including car accidents, slip and falls, and dog bites — have a two-year statute of limitations starting from the date of injury. However, claims against government entities in California have a much shorter window: you must file a government tort claim within six months of the incident before you can sue. Minors and victims who were not immediately aware of their injuries may have different deadlines under the discovery rule.",
      "tips": [
        "Standard personal injury: 2 years from the date of injury",
        "Government entity claims: 6-month administrative claim deadline",
        "Delayed discovery: clock may start when injury was discovered or should have been"
      ]
    },
    {
      "heading": "Arizona Statute of Limitations for Injury Claims",
      "content": "Arizona also sets a two-year statute of limitations for most personal injury claims arising from accidents. Similar to California, claims involving government entities require timely notice — typically within 180 days for state agencies and 60 days for city or county entities. If the injured party was a minor at the time of the accident, the clock may not begin running until they reach the age of majority.",
      "tips": [
        "Standard personal injury: 2 years from the date of injury",
        "City and county claims: notice may be required within 60 days",
        "Minors: limitations period may begin at age 18"
      ]
    },
    {
      "heading": "What Happens If You Miss the Filing Deadline?",
      "content": "If you attempt to file a lawsuit after the statute of limitations has expired, the defendant will almost certainly file a motion to dismiss, and the court will grant it. This means you lose your right to pursue compensation through the courts permanently — even if the other party was clearly at fault and your injuries were severe. Insurance companies track these deadlines carefully, and missing the deadline eliminates much of your negotiating leverage even in settlement discussions.",
      "tips": [
        "Missing the deadline typically bars your case in court with no exceptions",
        "Even pre-litigation insurance negotiations are affected by an expired deadline",
        "Do not wait until close to the deadline to consult an attorney"
      ]
    },
    {
      "heading": "Exceptions That May Extend Your Deadline",
      "content": "Certain circumstances may toll — or pause — the statute of limitations in California and Arizona. Common examples include cases where the injured party was a minor at the time of the accident, where the defendant left the state and was unavailable to be served, or where the injury was not discovered until later (the 'discovery rule'). Fraud by the defendant may also toll the clock. These exceptions are narrow and require legal analysis specific to your situation — do not assume an extension applies without consulting an attorney."
    }
  ],
  "faq": [
    {
      "question": "How long do I have to file a personal injury claim in California?",
      "answer": "In California, the general statute of limitations for personal injury claims is two years from the date of injury. Claims against government entities have a much shorter deadline — typically six months to file an administrative tort claim."
    },
    {
      "question": "How long do I have to file a personal injury claim in Arizona?",
      "answer": "Arizona's general personal injury statute of limitations is two years from the date of the accident or injury. For claims against government entities, notice requirements are often 60 to 180 days depending on the entity involved."
    },
    {
      "question": "What is the discovery rule and how does it affect my deadline?",
      "answer": "The discovery rule provides that the statute of limitations begins when you discovered — or reasonably should have discovered — your injury, rather than on the date of the accident. This can apply when injuries such as internal damage or traumatic brain injury are not immediately apparent."
    },
    {
      "question": "Does the statute of limitations pause if I was injured as a minor?",
      "answer": "In both California and Arizona, the statute of limitations for personal injury claims is generally tolled — or paused — when the injured person was a minor at the time of the accident, and may not begin running until they reach the age of majority."
    }
  ],
  "relatedTools": ["accident-case-quiz", "evidence-checklist", "lawyer-type-matcher"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "pedestrian"]
}
```

- [ ] **Step 2: Write `content/tools/accident-case-quiz.json`**

```json
{
  "slug": "accident-case-quiz",
  "title": "What Kind of Accident Case Do I Have?",
  "metaTitle": "What Kind of Accident Case Do I Have? — Free Quiz",
  "metaDescription": "Answer a few questions about your accident to learn what type of case you may have and what educational next steps typically apply to your situation.",
  "description": "Different accidents give rise to different types of personal injury claims, each with its own rules, timelines, and considerations. This educational quiz helps you understand the general category of your situation and points you toward the most relevant guidance — it is not a substitute for legal advice.",
  "disclaimer": "This quiz provides general educational information only. It is not legal advice and does not evaluate the merits of any potential legal claim. Results are for informational purposes only. Consult a licensed attorney to understand your specific legal situation.",
  "steps": [
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "what-happened",
      "question": "Which of the following best describes what happened?",
      "type": "multiselect"
    },
    {
      "id": "injuries",
      "question": "Which injuries did you sustain? (Select all that apply)",
      "type": "checklist"
    },
    {
      "id": "timeline",
      "question": "When did the accident happen?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "Types of Personal Injury Cases",
      "content": "Personal injury law covers a wide range of accidents and incidents, from car crashes and slip-and-fall accidents to workplace injuries and dog bites. The type of case you have determines which laws apply, who might be liable, what damages you may be able to seek, and how long you have to take action. Understanding your case type is an important first step toward knowing what resources and professional guidance are most relevant to your situation.",
      "tips": [
        "Motor vehicle accidents are among the most common personal injury cases",
        "Premises liability covers slip-and-falls at businesses, homes, and public spaces",
        "Product liability may apply if a defective product caused your injury"
      ]
    },
    {
      "heading": "How Motor Vehicle Accident Cases Work",
      "content": "Car, truck, motorcycle, bicycle, and pedestrian accident cases typically involve claims of negligence — meaning that another party failed to exercise reasonable care and that failure caused your injuries. In California and Arizona, the at-fault driver's insurance is generally responsible for compensating victims. The severity of your injuries, available insurance coverage, and the clarity of fault all affect how a motor vehicle accident case may proceed. Consulting with an attorney early helps preserve evidence and protect your rights.",
      "tips": [
        "Gather the other driver's insurance information at the scene if possible",
        "Seek medical care promptly — delays can be used to question injury severity",
        "Document all costs: medical bills, lost income, transportation to appointments"
      ]
    },
    {
      "heading": "Premises Liability and Slip-and-Fall Cases",
      "content": "When an injury occurs on someone else's property — a store, restaurant, apartment building, or private home — premises liability law may apply. Property owners have a duty to maintain reasonably safe conditions for visitors. To have a viable premises liability claim, you generally need to show that a hazardous condition existed, that the property owner knew or should have known about it, and that it caused your injury. These cases often hinge on evidence like incident reports, surveillance footage, and medical records.",
      "tips": [
        "Report the incident to the property manager and request a written incident report",
        "Photograph the hazard, the area, and your injuries immediately if you are able",
        "Seek medical care the same day — it documents the injury's connection to the incident"
      ]
    },
    {
      "heading": "Dog Bites and Animal Attacks",
      "content": "California follows strict liability for dog bites, meaning an owner is liable for injuries caused by their dog even if the dog has never bitten anyone before. Arizona follows a similar strict liability rule. Dog bite cases may involve medical expenses, scarring, psychological trauma, and lost income. Identifying the dog's owner and gathering documentation of the incident promptly is important. Animal control reports and witness accounts can strengthen a claim.",
      "tips": [
        "Seek medical attention immediately — dog bites carry infection risk",
        "Identify the dog owner and request proof of rabies vaccination",
        "File a report with local animal control to create an official record"
      ]
    },
    {
      "heading": "When to Consult a Personal Injury Attorney",
      "content": "While many minor accidents are resolved directly with insurance companies, more serious injuries, disputed liability, or claims involving significant medical expenses often benefit from legal representation. A personal injury attorney can evaluate the strength of your claim, handle communications with insurance adjusters, preserve evidence, and help you understand the full range of damages you may be entitled to seek. Most personal injury attorneys offer free initial consultations and work on contingency, meaning no upfront fees.",
      "tips": [
        "Consult an attorney before giving a recorded statement to any insurance company",
        "An attorney can identify liable parties you may not have considered",
        "Early consultation helps preserve evidence that can be lost over time"
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the difference between a personal injury claim and a lawsuit?",
      "answer": "A personal injury claim typically refers to a demand for compensation made directly to an insurance company, while a lawsuit is a formal legal action filed in court. Most personal injury cases are resolved through insurance claims or settlement negotiations without ever going to trial."
    },
    {
      "question": "How do I know if I have a strong personal injury case?",
      "answer": "The strength of a personal injury case generally depends on whether another party was at fault, the severity and documentation of your injuries, available insurance coverage, and how well your damages are documented. An attorney can evaluate these factors for your specific situation."
    },
    {
      "question": "Can I have more than one type of claim from the same accident?",
      "answer": "Yes. A single accident can give rise to multiple claims — for example, a car accident caused by a defective brake part might support both a negligence claim against the driver and a product liability claim against the manufacturer."
    }
  ],
  "relatedTools": ["statute-countdown", "evidence-checklist", "lawyer-type-matcher"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "slip-fall", "dog-bite"]
}
```

- [ ] **Step 3: Run build to verify Zod validates the new JSON files**

```bash
npm run build
```

Expected: build succeeds; if Zod validation fails, the error will name the field and constraint that failed — fix the JSON and re-run.

- [ ] **Step 4: Commit**

```bash
git add content/tools/statute-countdown.json content/tools/accident-case-quiz.json
git commit -m "feat: add featured tool CMS content — statute-countdown and accident-case-quiz"
```

---

### Task 4: Content Batch 2 (`urgency-checker.json`, `evidence-checklist.json`, `injury-journal.json`)

**Files:**
- Create: `content/tools/urgency-checker.json`
- Create: `content/tools/evidence-checklist.json`
- Create: `content/tools/injury-journal.json`

- [ ] **Step 1: Write `content/tools/urgency-checker.json`**

```json
{
  "slug": "urgency-checker",
  "title": "Do I Need Medical Care Now?",
  "metaTitle": "Do I Need Medical Care Now? — Accident Urgency Check",
  "metaDescription": "Answer questions about your accident and symptoms to understand whether seeking medical attention soon may be beneficial for your health and your legal claim.",
  "description": "After an accident, adrenaline and shock can mask serious injuries. This educational tool helps you think through your symptoms and circumstances so you can make an informed decision about seeking medical care — and understand why prompt evaluation matters for your health and your options.",
  "disclaimer": "This tool is for educational purposes only. It is not medical advice. If you are experiencing a medical emergency, call 911 immediately. Always consult a qualified healthcare provider for any medical concerns following an accident.",
  "steps": [
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "symptoms",
      "question": "Are you experiencing any of the following? (Select all that apply)",
      "type": "checklist"
    },
    {
      "id": "when",
      "question": "When did the accident happen?",
      "type": "select"
    },
    {
      "id": "seen-doctor",
      "question": "Have you seen a doctor since the accident?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "Why Delayed Symptoms Are Common After Accidents",
      "content": "The human body releases adrenaline and cortisol immediately following a traumatic event, which can mask pain signals for hours or even days. Conditions such as whiplash, traumatic brain injury, internal bleeding, and soft tissue injuries frequently do not produce obvious symptoms at the scene of an accident. By the time pain or dysfunction becomes apparent, the injury may have worsened — and the delay in seeking care may be used by insurance companies to argue that your injuries were not caused by the accident.",
      "tips": [
        "Neck and back pain from whiplash can appear 24 to 72 hours after a collision",
        "Concussion symptoms including confusion and headache may not emerge immediately",
        "Internal abdominal injuries can be life-threatening with minimal initial symptoms"
      ]
    },
    {
      "heading": "Symptoms That Require Immediate Emergency Care",
      "content": "Certain symptoms following an accident require immediate emergency medical attention — do not wait. These include loss of consciousness or confusion, severe head or neck pain, chest pain or difficulty breathing, numbness or tingling in the extremities, abdominal pain or tenderness, uncontrolled bleeding, and visible bone deformity. If you or anyone at the accident scene is experiencing these symptoms, call 911 or go directly to an emergency room without delay.",
      "tips": [
        "Loss of consciousness, even brief, warrants immediate emergency evaluation",
        "Chest pain after impact may indicate internal trauma — do not self-diagnose",
        "Never drive yourself to the ER if you have any neurological symptoms"
      ]
    },
    {
      "heading": "The Medical and Legal Importance of Prompt Evaluation",
      "content": "Seeing a doctor promptly after an accident serves two purposes: it protects your health by identifying injuries early, and it creates a documented medical record that connects your injuries to the accident. Insurance adjusters and defense attorneys look closely at gaps in medical care. A significant delay between the accident and your first doctor visit can be presented as evidence that your injuries were not serious or were caused by something else. Even if you feel relatively well, a same-day or next-day evaluation is generally advisable.",
      "tips": [
        "Document every symptom at your medical visit — even minor ones",
        "Tell the treating provider the exact date, time, and circumstances of the accident",
        "Follow through with all recommended follow-up appointments"
      ]
    },
    {
      "heading": "What to Tell the Doctor After an Accident",
      "content": "When you see a doctor after an accident, provide a complete account of how the accident happened and every symptom you are experiencing — even those that seem minor. Tell the provider about any pre-existing conditions so they can distinguish new injuries from prior ones. Do not downplay your pain out of politeness or concern about cost. Your medical records are a primary source of evidence in any insurance or legal proceeding, and incomplete records can limit your options. Ask for copies of all records and imaging reports."
    }
  ],
  "faq": [
    {
      "question": "Should I go to the emergency room or urgent care after a car accident?",
      "answer": "If you have any symptoms suggesting serious injury — head pain, loss of consciousness, chest pain, numbness, or difficulty breathing — go to an emergency room immediately. For less urgent symptoms, an urgent care clinic or primary care provider can conduct an initial evaluation and refer you for imaging or specialist care if needed."
    },
    {
      "question": "What if I feel fine after the accident?",
      "answer": "Feeling fine immediately after an accident does not mean you are uninjured. Adrenaline can suppress pain, and many significant injuries — including whiplash, concussion, and soft tissue damage — develop symptoms gradually over the following hours or days. A medical evaluation within 24 to 72 hours is generally recommended even if you feel well."
    },
    {
      "question": "Does seeking medical care affect my insurance claim?",
      "answer": "Yes — in a positive way. Prompt medical care creates a documented record that ties your injuries to the accident. Gaps in care or delays in treatment can be used by insurance companies to dispute the severity or cause of your injuries. Consistent medical documentation typically supports a stronger claim."
    }
  ],
  "relatedTools": ["injury-journal", "evidence-checklist", "accident-case-quiz"],
  "relatedGuides": ["after-car-accident"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "pedestrian", "slip-fall"]
}
```

- [ ] **Step 2: Write `content/tools/evidence-checklist.json`**

```json
{
  "slug": "evidence-checklist",
  "title": "Evidence Collection Checklist",
  "metaTitle": "Evidence Collection Checklist — Accident Victims",
  "metaDescription": "Get a customized evidence checklist for your accident type. Know what to gather, photograph, and request before critical evidence disappears or becomes unavailable.",
  "description": "The evidence you collect — or fail to collect — in the hours and days after an accident can significantly affect your options. This checklist helps you understand what types of evidence typically matter for your situation and prioritizes them so you know where to focus first.",
  "disclaimer": "This checklist provides educational information about common types of evidence in personal injury cases. It is not legal advice. The specific evidence that matters in your case depends on your individual circumstances. Consult an attorney for guidance tailored to your situation.",
  "steps": [
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "location-type",
      "question": "Where did the accident occur?",
      "type": "select"
    },
    {
      "id": "witnesses",
      "question": "Were there witnesses at the scene?",
      "type": "select"
    },
    {
      "id": "police-report",
      "question": "Was a police report filed?",
      "type": "select"
    },
    {
      "id": "photos",
      "question": "Did you take photos at the scene?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "Why Evidence Collection Matters Immediately After an Accident",
      "content": "Evidence in accident cases can disappear quickly. Skid marks fade, surveillance footage gets overwritten, witnesses scatter, and physical conditions at the scene change. Vehicle damage gets repaired. Businesses claim they have no camera footage. The window for gathering the most critical evidence is often just 24 to 72 hours. Understanding what to look for — and acting promptly — can make a meaningful difference in your ability to document what happened.",
      "tips": [
        "Photograph the scene before anything is moved if it is safe to do so",
        "Surveillance footage at businesses is often overwritten within 24 to 48 hours",
        "Preserving a damaged vehicle before repairs is critical for product liability claims"
      ]
    },
    {
      "heading": "Scene and Physical Evidence",
      "content": "At the scene of the accident, photograph everything you can safely reach: all vehicles involved (from multiple angles including damage, license plates, and position on the road), road conditions, skid marks, traffic signals, signage, weather conditions, and any visible hazards that contributed to the accident. If you were injured in a fall, photograph the exact location of the hazard — a wet floor, cracked pavement, missing handrail, or uneven surface — before it is corrected. More photos are always better than fewer.",
      "tips": [
        "Photograph your own injuries at the scene and daily for several weeks after",
        "Note street names, cross streets, and landmarks so the exact location is documented",
        "If there is a business nearby, ask if they have outdoor cameras that captured the event"
      ]
    },
    {
      "heading": "Documents and Records to Request",
      "content": "Key documents in an accident case include the official police report (typically available 3 to 10 days after the incident through the filing agency), medical records and bills for all treatment received, the other party's insurance information and policy documents, your own insurance declarations page, any incident reports filed with a business or property owner, and employment records documenting missed work. Requesting records proactively — rather than waiting to see if they become relevant — is advisable, as some records have fees and processing time.",
      "tips": [
        "Request the police report from the specific agency that responded (city police, county sheriff, CHP)",
        "Ask your medical providers for itemized billing statements, not just summary totals",
        "Request incident reports in writing so there is a record of your request"
      ]
    },
    {
      "heading": "Witness Information and Statements",
      "content": "Witness accounts can be among the most persuasive evidence in an accident case, particularly when liability is disputed. At the scene, ask anyone who saw the accident for their name, phone number, and a brief description of what they observed. Do not pressure witnesses, but do capture their contact information before they leave. If a witness is willing to provide a written statement or speak with your attorney, that can be valuable. Witnesses can also include bystanders who arrived after the accident but observed the scene or your injuries.",
      "tips": [
        "Get full name and at least one phone number from each witness immediately",
        "Note what each witness told you they saw — details are easier to recall immediately",
        "Witnesses to your injuries and their visible severity are also valuable, not just those who saw the impact"
      ]
    },
    {
      "heading": "Digital and Electronic Evidence",
      "content": "Modern accident cases increasingly involve digital evidence. Dashcam footage from your vehicle or nearby vehicles can be decisive. Rideshare app data (Uber, Lyft) records trip details and driver behavior. Red light camera and traffic monitoring footage may exist. Businesses along the route may have external security cameras. Your own phone records may confirm that the other driver was distracted. Surveillance footage in particular is time-sensitive — send a written preservation request to any business that may have relevant camera footage as soon as possible after the accident."
    }
  ],
  "faq": [
    {
      "question": "How do I get the official police report from my accident?",
      "answer": "You can typically request a copy of the police report from the law enforcement agency that responded — city police department, county sheriff, or the California Highway Patrol (CHP). Reports are usually available 3 to 10 days after the incident. In California, you can often request them online through the agency's records portal or in person. There is usually a small fee."
    },
    {
      "question": "What should I do if a business claims to have no surveillance footage?",
      "answer": "Send a written preservation request to the business — by certified mail if possible — immediately after the accident, before footage is overwritten. State the date, time, and location of the incident and request that all footage from relevant cameras be preserved. If you have an attorney, they can send a formal preservation letter on your behalf, which creates a legal obligation to retain the evidence."
    },
    {
      "question": "Is it too late to gather evidence if it has been a few days since the accident?",
      "answer": "Some evidence will already be lost, but much can still be obtained. Police reports, medical records, employment records, witness contact information, and your own photographs of injuries taken in the days following the accident are still valuable. An attorney can send formal preservation letters and subpoena records that you may not be able to access on your own."
    }
  ],
  "relatedTools": ["accident-case-quiz", "record-request", "insurance-call-prep"],
  "relatedGuides": ["after-car-accident", "getting-your-police-report"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle", "pedestrian"]
}
```

- [ ] **Step 3: Write `content/tools/injury-journal.json`**

```json
{
  "slug": "injury-journal",
  "title": "Injury & Treatment Journal",
  "metaTitle": "Injury & Treatment Journal — Track Your Recovery",
  "metaDescription": "Track daily symptoms, pain levels, and treatments after your accident. A complete injury journal supports your medical record and helps document your recovery.",
  "description": "Documenting your injuries consistently from the day of the accident through your recovery creates a powerful record of how your life has been affected. This tool guides you through what to track each day — symptoms, pain levels, treatments, limitations, and impact on daily activities — information that may be valuable to medical providers, insurers, and attorneys.",
  "disclaimer": "This journal is an educational tool to help you organize and document your personal experience after an accident. It is not a medical record and is not a substitute for professional medical care. Consult your healthcare providers about your treatment. Consult a licensed attorney for legal guidance.",
  "steps": [
    {
      "id": "injury-type",
      "question": "What type of injuries are you tracking?",
      "type": "checklist"
    },
    {
      "id": "pain-level",
      "question": "What is your overall pain level today? (1 = minimal, 10 = severe)",
      "type": "number"
    },
    {
      "id": "symptoms",
      "question": "Which symptoms are you experiencing today? (Select all that apply)",
      "type": "checklist"
    },
    {
      "id": "treatments",
      "question": "What treatments or appointments did you have today?",
      "type": "checklist"
    }
  ],
  "supportingContent": [
    {
      "heading": "Why a Daily Injury Journal Matters After an Accident",
      "content": "When an insurance company or attorney evaluates a personal injury claim, one of the key questions is: how did this accident affect the injured person's daily life? A contemporaneous journal — one written at the time events occurred, not reconstructed from memory months later — provides compelling evidence of pain, suffering, and functional limitations. Courts and insurance adjusters give considerable weight to detailed, consistent records kept from the time of the accident through recovery.",
      "tips": [
        "Start your journal the same day as the accident, even if your entries are brief",
        "Write entries daily — even short entries are better than nothing",
        "Note specific activities you could not do that you could do before the accident"
      ]
    },
    {
      "heading": "What to Record Each Day",
      "content": "Each daily entry should include your pain level on a scale of 1 to 10, any new or ongoing symptoms (headache, dizziness, neck stiffness, back pain, numbness, difficulty sleeping), medical appointments and provider names, medications taken and any side effects, physical therapy or other treatments, activities you were unable to perform due to pain or limitation (driving, cooking, exercising, playing with children), how the injury is affecting your work, and any emotional or psychological impact such as anxiety, depression, or sleep disruption.",
      "tips": [
        "Use consistent pain scale language so your entries are comparable over time",
        "Record the names and specialties of every healthcare provider you see",
        "Note when you had to ask others for help with tasks you normally do independently"
      ]
    },
    {
      "heading": "Documenting Activity Limitations and Lost Enjoyment",
      "content": "In personal injury cases, damages are not limited to medical bills and lost wages — they can also include compensation for pain and suffering, loss of enjoyment of life, and emotional distress. A detailed record of activities you have been unable to do since the accident — hobbies, exercise, family activities, social engagements, sexual activity, parenting tasks — helps document these non-economic losses. Specific, concrete examples are more persuasive than general statements, so describe what you missed and why it mattered to you.",
      "tips": [
        "List specific events you had to skip — a child's soccer game, a vacation, a gym routine",
        "Note when you had a particularly bad day and what made it difficult",
        "Photograph visible injuries such as bruising, swelling, and scars regularly"
      ]
    },
    {
      "heading": "Keeping Your Journal Accurate and Credible",
      "content": "Your injury journal is most valuable when it is honest and consistent. Avoid exaggerating symptoms, which can undermine your credibility if your journal is reviewed by an opposing party. Also avoid minimizing symptoms out of habit — many accident victims downplay their pain even in private notes. Write what you actually experienced each day. If you had a good day, say so — a record that shows ups and downs is more believable than one that is uniformly dire, and genuine good days do not diminish the validity of your bad ones."
    }
  ],
  "faq": [
    {
      "question": "Can my injury journal be used as evidence in my case?",
      "answer": "Yes. A contemporaneous injury journal can be used as evidence to document the nature, severity, and duration of your pain and limitations. It may be reviewed by insurance adjusters, used in mediation, or submitted as evidence in litigation. Writing honest, detailed, dated entries from the start of your injury is advisable."
    },
    {
      "question": "Should I share my injury journal with my attorney?",
      "answer": "Yes. Sharing your injury journal with your attorney helps them understand the full picture of how the accident has affected you, supports calculation of non-economic damages like pain and suffering, and may identify information gaps to address. Your attorney can advise you on how to use it most effectively."
    },
    {
      "question": "How long should I keep my injury journal?",
      "answer": "Keep your injury journal until your case is fully resolved — whether through settlement, trial, or the expiration of the limitations period. Even after you feel recovered, the journal documents the duration and course of your injuries, which is relevant to damages. Store digital copies in a secure backup location."
    }
  ],
  "relatedTools": ["urgency-checker", "lost-wages-estimator", "settlement-readiness"],
  "relatedGuides": ["after-car-accident"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle"]
}
```

- [ ] **Step 4: Run build to validate all three new JSON files**

```bash
npm run build
```

Expected: build succeeds. Fix any Zod validation errors before continuing.

- [ ] **Step 5: Commit**

```bash
git add content/tools/urgency-checker.json content/tools/evidence-checklist.json content/tools/injury-journal.json
git commit -m "feat: add tool CMS content — urgency-checker, evidence-checklist, injury-journal"
```

---

### Task 5: Content Batch 3 (`lost-wages-estimator.json`, `insurance-call-prep.json`, `record-request.json`)

**Files:**
- Create: `content/tools/lost-wages-estimator.json`
- Create: `content/tools/insurance-call-prep.json`
- Create: `content/tools/record-request.json`

- [ ] **Step 1: Write `content/tools/lost-wages-estimator.json`**

```json
{
  "slug": "lost-wages-estimator",
  "title": "Lost Wages Estimator",
  "metaTitle": "Lost Wages Estimator — Accident Income Loss Calculator",
  "metaDescription": "Estimate income you may have lost due to accident injuries. Understand what documentation supports a lost wages claim before consulting with an attorney.",
  "description": "An injury that keeps you out of work — or limits your ability to work — can have serious financial consequences. This educational tool helps you understand the components of a lost wages claim, estimate potential losses, and identify the documentation you will need to support a claim.",
  "disclaimer": "This estimator provides rough calculations for educational purposes only. Actual lost wage claims depend on employment records, medical documentation, the nature of your employment, and applicable law. Consult a licensed attorney and your accountant for guidance specific to your situation.",
  "steps": [
    {
      "id": "employment-type",
      "question": "What is your employment status?",
      "type": "select"
    },
    {
      "id": "income",
      "question": "What is your income amount? (hourly rate or annual salary)",
      "type": "number"
    },
    {
      "id": "days-missed",
      "question": "How many days of work have you missed due to your injuries?",
      "type": "number"
    },
    {
      "id": "reduced-hours",
      "question": "Have you returned to work with reduced hours or capacity?",
      "type": "select"
    },
    {
      "id": "ongoing",
      "question": "Are you still unable to return to full work capacity?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "What Are Lost Wages in a Personal Injury Case?",
      "content": "Lost wages — also called lost income or lost earnings — refer to the income you have lost because your injuries prevented you from working. This includes wages you would have earned from your regular job, self-employment income, gig work income, bonuses you missed, vacation or sick days you were forced to use, and income lost due to reduced work capacity even if you returned to work. In serious cases, lost future earning capacity may also be recoverable if your injuries affect your ability to work long-term.",
      "tips": [
        "Lost wages cover all income types: W-2 wages, self-employment income, and gig work",
        "Vacation or sick leave used due to the injury may be includable",
        "Reduced earning capacity — working fewer hours or a lower-paying job — is also compensable"
      ]
    },
    {
      "heading": "Documentation Required to Support a Lost Wages Claim",
      "content": "To support a lost wages claim, you typically need documentation showing your pre-accident income, proof of the days or hours you missed, and medical evidence confirming that your injuries prevented you from working. Common documents include pay stubs, W-2 forms, tax returns (especially for self-employed individuals), a letter from your employer confirming missed time and your regular pay rate, and a note from your treating physician stating that your condition prevented you from working. Self-employed individuals often need additional documentation such as invoices, contracts, or client correspondence showing lost business.",
      "tips": [
        "Gather at least three months of pay stubs before the accident as baseline income proof",
        "Ask your employer to provide a written statement of your pay rate and missed days",
        "Keep records of all business income you lost if you are self-employed or a freelancer"
      ]
    },
    {
      "heading": "Lost Earning Capacity vs. Lost Wages",
      "content": "Lost wages and lost earning capacity are distinct concepts in personal injury law. Lost wages refers to specific income you have already lost due to time missed from work. Lost earning capacity refers to the reduction in your ability to earn income in the future as a result of your injuries — for example, if you can no longer perform your previous job and must take a lower-paying position, or if chronic pain or disability will limit your earning power for years to come. Claims for future earning capacity typically require expert testimony from vocational rehabilitation specialists and economists.",
      "tips": [
        "Document how your injuries have changed your ability to do your specific job duties",
        "Note any promotions, raises, or career opportunities you missed due to your injury",
        "Future earning capacity claims are common in cases involving serious or permanent injuries"
      ]
    },
    {
      "heading": "Special Considerations for Self-Employed and Gig Workers",
      "content": "Calculating lost wages for self-employed individuals, freelancers, and gig workers is more complex than for traditional employees, but lost income is still recoverable. The key is demonstrating your typical earnings through tax returns, bank statements, invoices, contracts, client communications, and platform earning records (such as Uber, DoorDash, or Upwork statements). Lost gig income may require showing your historical earnings over the same period in prior years as a baseline. An attorney or accountant experienced with self-employment income can help structure this documentation effectively."
    }
  ],
  "faq": [
    {
      "question": "Can I recover lost wages if I used sick leave or vacation time while I was injured?",
      "answer": "In many personal injury cases, yes. If you were forced to use accrued sick days or vacation time because of your injuries, the value of that leave — which you otherwise would have had available — may be recoverable as part of your lost wages claim. Keep records of how much leave you used and when."
    },
    {
      "question": "What if I am self-employed and my income varies from month to month?",
      "answer": "Self-employed claimants typically use prior year tax returns, bank statements, and invoices to establish their average monthly income as a baseline. A comparison to the same period in prior years can help demonstrate income lost during recovery. An attorney can help structure this evidence for your specific situation."
    },
    {
      "question": "How are lost wages calculated for part-time workers?",
      "answer": "Lost wages for part-time workers are typically calculated based on your actual hourly rate and the hours you would have worked during the period you were unable to work. Pay stubs and employer documentation showing your typical schedule and rate are the key evidence. Lost overtime and tips may also be included if they were a regular part of your income."
    }
  ],
  "relatedTools": ["injury-journal", "settlement-readiness", "record-request"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle"]
}
```

- [ ] **Step 2: Write `content/tools/insurance-call-prep.json`**

```json
{
  "slug": "insurance-call-prep",
  "title": "Insurance Call Prep Tool",
  "metaTitle": "Insurance Call Prep Tool — Accident Victims Guide",
  "metaDescription": "Prepare for your insurance call with a customized script, key questions to ask, information to gather, and common mistakes to avoid before you dial.",
  "description": "Calls with insurance adjusters after an accident can feel high-stakes — because they are. What you say and how you say it matters. This tool helps you organize what to have on hand, what questions to ask, and what to avoid saying, so you can approach the call with more confidence.",
  "disclaimer": "This tool provides general educational information about common insurance claim practices. It is not legal advice. Insurance policies and claims processes vary significantly. Before giving any recorded statement to any insurance company, consider consulting a licensed personal injury attorney.",
  "steps": [
    {
      "id": "caller-type",
      "question": "Who are you calling?",
      "type": "select"
    },
    {
      "id": "call-purpose",
      "question": "What is the purpose of your call?",
      "type": "select"
    },
    {
      "id": "info-available",
      "question": "What information do you currently have available? (Select all that apply)",
      "type": "checklist"
    }
  ],
  "supportingContent": [
    {
      "heading": "Your Insurance vs. the Other Party's Insurance",
      "content": "There are two very different types of insurance calls you may need to make after an accident. Calls to your own insurance company are governed by your contractual obligations — you generally must report the accident promptly and cooperate with your own insurer. Calls to the other party's insurance company are a different matter: you have no contractual obligation to their adjuster, they represent the adverse party's interests, and you are not required to give a recorded statement. Understanding which type of call you are making shapes everything about how you should approach it.",
      "tips": [
        "Report to your own insurer promptly — your policy requires timely notice",
        "You are generally not required to give a recorded statement to the other driver's insurer",
        "Ask for the adjuster's name, direct number, and claim number at the start of every call"
      ]
    },
    {
      "heading": "Information to Have Ready Before You Call",
      "content": "Before calling any insurance company, gather: your policy number and declarations page, the official police report number (if available), the other driver's name, license plate, and insurance information, the names and contact information of any witnesses, photos of the damage and scene, a chronological summary of events (written beforehand so you stay consistent), your medical provider names and any treatment you have received, and a list of any expenses you have incurred. Being organized prevents you from providing incomplete information or making inconsistent statements across multiple calls.",
      "tips": [
        "Write a brief factual summary of the accident before the call and stick to it",
        "Do not guess about details you do not know — 'I do not know' is a valid answer",
        "Take notes during every call: date, time, adjuster's name, what was said"
      ]
    },
    {
      "heading": "What Not to Say to an Insurance Adjuster",
      "content": "Insurance adjusters are trained to gather information that can be used to minimize or deny your claim. Avoid these common mistakes: do not apologize or say anything that could be interpreted as admitting fault; do not say you are 'feeling fine' or 'okay' — these statements are used to dispute injury severity; do not agree to a recorded statement without first consulting an attorney, especially for the other driver's insurer; do not accept a settlement offer without understanding the full extent of your injuries and damages; and do not speculate about the cause of the accident or about your own injuries.",
      "tips": [
        "Never say 'I feel fine' — it can be used to dispute your injuries later",
        "Stick to facts you know with certainty; avoid speculating",
        "You can always say 'I need to call you back' if you feel unprepared or pressured"
      ]
    },
    {
      "heading": "Handling Lowball Settlement Offers",
      "content": "Insurance companies often make early, low settlement offers to injured parties who have not yet fully understood their injuries, medical costs, or legal options. Once you accept a settlement and sign a release, you typically cannot seek additional compensation — even if your injuries turn out to be more serious than expected. Before accepting any settlement offer, ensure your medical treatment is complete or that you have reached maximum medical improvement, that you have documented all your economic losses, and that you have consulted with a personal injury attorney who can evaluate whether the offer reflects the actual value of your claim."
    }
  ],
  "faq": [
    {
      "question": "Do I have to give a recorded statement to the other driver's insurance company?",
      "answer": "In most cases, no. You are generally not required to give a recorded statement to the adverse party's insurance company. They represent the other driver's interests, not yours. You may politely decline and state that you prefer to have the matter handled in writing or through your attorney. Your own insurance company may require a statement under your policy obligations."
    },
    {
      "question": "What should I do if the adjuster pressures me to settle quickly?",
      "answer": "Do not feel pressured to accept an early offer. Early settlement offers are often below the true value of a claim, particularly before the full extent of your injuries is known. You have the right to take time to consult an attorney, complete your medical treatment, and fully document your damages before making any settlement decisions."
    },
    {
      "question": "Should I get a lawyer before talking to insurance companies?",
      "answer": "Consulting a personal injury attorney before giving any recorded statement — particularly to the other party's insurer — is generally advisable in cases involving significant injuries, disputed liability, or complex circumstances. Most personal injury attorneys offer free initial consultations, and their guidance can protect your claim from early missteps."
    }
  ],
  "relatedTools": ["evidence-checklist", "record-request", "accident-case-quiz"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "uber-lyft", "bicycle"]
}
```

- [ ] **Step 3: Write `content/tools/record-request.json`**

```json
{
  "slug": "record-request",
  "title": "Record Request Checklist",
  "metaTitle": "Record Request Checklist — After an Accident",
  "metaDescription": "Know which records to request after your accident, who to contact for each, and the typical timelines and costs involved in gathering your documentation.",
  "description": "Building a complete documentary record after an accident is one of the most important things you can do to protect your options. This checklist identifies the types of records commonly needed in personal injury cases, who has them, and how to request them before deadlines pass or records are destroyed.",
  "disclaimer": "This checklist provides general educational information about record types commonly relevant in personal injury cases. It is not legal advice. The specific records that matter in your case depend on your individual circumstances. An attorney can advise you on which records to prioritize.",
  "steps": [
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "records-needed",
      "question": "Which types of records are you looking to obtain? (Select all that apply)",
      "type": "checklist"
    }
  ],
  "supportingContent": [
    {
      "heading": "Police and Accident Reports",
      "content": "The official accident or incident report filed by law enforcement is one of the most important documents in a personal injury case. It contains the officer's observations, the parties' contact and insurance information, any citations issued, witness information, and the officer's preliminary assessment of what occurred. In California, you can request a copy from the responding agency — city police department, county sheriff, or California Highway Patrol — typically 3 to 10 days after the incident. In Arizona, reports are available through the Arizona Department of Public Safety or the local agency. There is typically a fee, and you can request the report in person, by mail, or online.",
      "tips": [
        "Request the report from the specific agency that responded, not a generic portal",
        "If you were involved in a hit-and-run, request any supplemental reports filed as investigation continues",
        "Your attorney can also request certified copies directly from law enforcement"
      ]
    },
    {
      "heading": "Medical Records and Bills",
      "content": "Complete medical records from every provider who treated your accident-related injuries are essential. This includes emergency room records, hospital admission records, imaging reports (X-rays, CT scans, MRI), treating physician notes, specialist consultations, physical therapy records, chiropractic records, mental health treatment records, and all associated billing statements. Request itemized bills rather than summary statements — itemized bills show each service rendered and its cost, which is more useful for documenting damages. Most providers charge a fee for records; submit a written HIPAA-compliant request to each provider.",
      "tips": [
        "Request records from every provider, even those you saw only once",
        "Ask for both the narrative clinical notes and the billing records",
        "Keep copies of all records in a secure location and provide copies to your attorney"
      ]
    },
    {
      "heading": "Employment and Income Records",
      "content": "To document lost wages, you need records showing both your pre-accident income and the income you lost due to missed work. Key documents include recent pay stubs (covering at least three months before the accident), W-2 forms or 1099 forms from the prior one to two years, a letter from your employer confirming your position, pay rate, and dates of absence, and documentation of any bonuses, commissions, or benefits you missed. Self-employed individuals should gather tax returns, bank statements, client invoices, and contracts showing typical earnings.",
      "tips": [
        "Request a formal letter from your employer on company letterhead confirming your absence",
        "Gather documentation of overtime, tips, and commissions if they were part of your regular income",
        "Two years of tax returns provides a strong baseline for self-employment income claims"
      ]
    },
    {
      "heading": "Sending Preservation Requests for Time-Sensitive Evidence",
      "content": "Some records are deleted or overwritten on short retention schedules and must be formally preserved before they are lost. Surveillance and security camera footage at businesses and intersections is often overwritten within 24 to 72 hours. Dashcam footage from rideshare or delivery vehicles may also be on a short retention cycle. Red light and traffic camera footage is typically controlled by city or state transportation agencies. To preserve this evidence, send a written preservation letter — by certified mail or via attorney — to the business or agency immediately after the accident, clearly describing the footage you need, the date and time, and requesting that it not be destroyed."
    }
  ],
  "faq": [
    {
      "question": "How long does it take to get my medical records?",
      "answer": "Under HIPAA, healthcare providers have 30 days to respond to a records request, with the option of a 30-day extension. Some providers respond faster; large hospital systems may take the full 30 days. Request records as early as possible to allow time for delays, especially if you have a case timeline or statute of limitations approaching."
    },
    {
      "question": "What is a HIPAA authorization form and do I need one?",
      "answer": "A HIPAA authorization form is a document that grants permission for a healthcare provider to release your medical records to a specified recipient — such as you, your attorney, or an insurance company. Most providers have their own forms; you sign and submit the form along with your records request. Your attorney will also typically have you sign a general HIPAA authorization that allows them to request records on your behalf."
    },
    {
      "question": "Can I get records from a business that does not want to provide them?",
      "answer": "If a business refuses to voluntarily provide records or surveillance footage, your attorney can issue a subpoena compelling production if litigation has been filed. Before litigation, a formal preservation letter from an attorney may prompt compliance. Police agencies can sometimes obtain certain records through their investigation that are not otherwise publicly available."
    }
  ],
  "relatedTools": ["evidence-checklist", "insurance-call-prep", "settlement-readiness"],
  "relatedGuides": ["after-car-accident", "getting-your-police-report"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle", "pedestrian"]
}
```

- [ ] **Step 4: Run build to validate all three new JSON files**

```bash
npm run build
```

Expected: build succeeds. Fix Zod validation errors if any.

- [ ] **Step 5: Commit**

```bash
git add content/tools/lost-wages-estimator.json content/tools/insurance-call-prep.json content/tools/record-request.json
git commit -m "feat: add tool CMS content — lost-wages-estimator, insurance-call-prep, record-request"
```

---

### Task 6: Content Batch 4 (`settlement-readiness.json`, `lawyer-type-matcher.json`, `state-next-steps.json`)

**Files:**
- Create: `content/tools/settlement-readiness.json`
- Create: `content/tools/lawyer-type-matcher.json`
- Create: `content/tools/state-next-steps.json`

- [ ] **Step 1: Write `content/tools/settlement-readiness.json`**

```json
{
  "slug": "settlement-readiness",
  "title": "Settlement Readiness Checklist",
  "metaTitle": "Settlement Readiness Checklist — Are You Ready?",
  "metaDescription": "Assess whether you may be ready to discuss settlement. Identify what documentation you should have in place before entering any settlement conversation.",
  "description": "Settling a personal injury claim before you are ready can result in compensation that does not reflect your actual losses. This educational checklist helps you identify whether the most important elements are typically in place before settlement discussions begin — and what may still be missing.",
  "disclaimer": "This checklist provides general educational information about settlement preparation and is not legal advice. The right time to settle depends on your individual medical situation, case facts, and legal circumstances. Consult a licensed personal injury attorney before accepting any settlement offer.",
  "steps": [
    {
      "id": "medical-status",
      "question": "What is the current status of your medical treatment?",
      "type": "select"
    },
    {
      "id": "records-gathered",
      "question": "Which of the following records do you currently have? (Select all that apply)",
      "type": "checklist"
    },
    {
      "id": "wages-documented",
      "question": "Have you documented your lost wages and other economic losses?",
      "type": "select"
    },
    {
      "id": "attorney-consulted",
      "question": "Have you consulted with a personal injury attorney?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "Why Settling Too Early Can Undermine Your Claim",
      "content": "Insurance companies often present early settlement offers that seem reasonable but do not account for the full extent of your injuries, long-term medical needs, or future lost income. Once you sign a settlement release, you typically waive your right to seek additional compensation — even if your injuries turn out to be more serious than initially apparent. Settling before you have reached maximum medical improvement and documented all your losses means you may be giving up rights you cannot reclaim. Most personal injury attorneys counsel clients not to settle until medical treatment is complete or the prognosis is clearly established.",
      "tips": [
        "Do not accept an offer until your medical treatment is complete or maximum improvement is reached",
        "Signing a release is permanent — you cannot reopen a claim after settling",
        "A quick settlement offer often signals that the insurer believes your claim is worth more"
      ]
    },
    {
      "heading": "What Does 'Maximum Medical Improvement' Mean?",
      "content": "Maximum medical improvement (MMI) is the point at which your treating physicians determine that your condition has stabilized and further significant improvement is unlikely, even with continued treatment. Reaching MMI does not mean you are fully recovered — it means your condition has plateaued. Settling before MMI carries significant risk because the full cost of your future medical needs, ongoing limitations, and long-term impact on your life may not yet be known. An attorney can advise you on how MMI applies to your specific injuries and prognosis.",
      "tips": [
        "Ask your treating physician directly whether you have reached maximum medical improvement",
        "Get any long-term care recommendations from your doctor in writing",
        "Permanent impairment or disability ratings may be part of your MMI evaluation"
      ]
    },
    {
      "heading": "The Full Picture: Economic and Non-Economic Damages",
      "content": "A complete settlement should account for all categories of recoverable damages: medical bills (past and future), lost wages (past and future earning capacity), property damage, out-of-pocket expenses, pain and suffering, loss of enjoyment of life, emotional distress, and — in cases involving egregious conduct — potentially punitive damages. Many accident victims focus only on their medical bills and miss other significant components. A personal injury attorney can help you identify and document all applicable damages before you enter settlement negotiations.",
      "tips": [
        "Non-economic damages like pain and suffering can exceed medical bills in serious cases",
        "Future medical costs require a medical expert's estimate, not your own projection",
        "Document every out-of-pocket expense: transportation, equipment, home modifications"
      ]
    },
    {
      "heading": "Should You Hire an Attorney Before Settling?",
      "content": "Studies and industry experience consistently show that personal injury claimants represented by attorneys typically recover more — even after legal fees — than those who negotiate on their own. An attorney can identify damages you may have overlooked, negotiate from a position of legal knowledge, prevent common mistakes in the settlement process, and advise you on the tax implications of different components of a settlement award. Most personal injury attorneys work on contingency, meaning no upfront fees — they are paid only if they recover money for you."
    }
  ],
  "faq": [
    {
      "question": "How do I know if a settlement offer is fair?",
      "answer": "Evaluating a settlement offer requires knowing the full value of your claim — which includes all past and future medical costs, lost income, pain and suffering, and other damages. Insurance adjusters calculate settlements based on their own formulas; an experienced personal injury attorney can independently evaluate the offer against the actual value of your claim and advise you on whether to accept, counter, or continue negotiating."
    },
    {
      "question": "What happens after I sign a settlement agreement?",
      "answer": "After signing a settlement release, you receive the agreed payment and your claim is closed. You permanently waive your right to seek additional compensation from the settling parties for that incident — even if your injuries worsen, you discover additional damages, or you incur future medical expenses related to the same accident. This is why it is so important to be confident your damages are fully documented before signing."
    },
    {
      "question": "Can I negotiate a higher settlement amount?",
      "answer": "Yes. Initial offers from insurance companies are typically negotiable. You or your attorney can counter with a demand letter documenting your damages and explaining why a higher amount is warranted. Multiple rounds of negotiation are common. Having strong documentation — medical records, wage loss evidence, and a detailed account of how the injury has affected your life — strengthens your negotiating position significantly."
    }
  ],
  "relatedTools": ["lost-wages-estimator", "injury-journal", "record-request"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle"]
}
```

- [ ] **Step 2: Write `content/tools/lawyer-type-matcher.json`**

```json
{
  "slug": "lawyer-type-matcher",
  "title": "Lawyer Type Matcher",
  "metaTitle": "Lawyer Type Matcher — Find Your Attorney Specialty",
  "metaDescription": "Answer a few questions to learn what type of personal injury attorney typically handles cases like yours in California and Arizona, for educational purposes.",
  "description": "Not all personal injury attorneys handle every type of case. Some specialize in motor vehicle accidents, others in premises liability, workers' compensation, product liability, or wrongful death. This educational tool helps you understand what type of attorney is typically best suited to cases like yours — so you know what to look for when consulting legal counsel.",
  "disclaimer": "This tool provides general educational information to help you understand attorney specializations. It does not constitute a legal referral or recommendation. AccidentPath does not evaluate the qualifications of specific attorneys. Consult a licensed personal injury attorney to discuss your individual situation.",
  "steps": [
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "injuries",
      "question": "What types of injuries did you sustain? (Select all that apply)",
      "type": "checklist"
    },
    {
      "id": "employment-status",
      "question": "Were you injured while working or on the job?",
      "type": "select"
    },
    {
      "id": "at-fault",
      "question": "Was another party clearly at fault for your accident?",
      "type": "select"
    }
  ],
  "supportingContent": [
    {
      "heading": "Motor Vehicle Accident Attorneys",
      "content": "Attorneys who specialize in motor vehicle accidents — including car crashes, truck accidents, motorcycle collisions, bicycle accidents, and pedestrian knockdowns — handle claims against at-fault drivers, commercial carriers, and their insurers. These attorneys are experienced in accident reconstruction, insurance policy interpretation, negotiating with claims adjusters, and litigating in personal injury courts. In cases involving commercial trucking, federal regulations (FMCSA rules) may apply, and attorneys with trucking-specific experience are particularly valuable.",
      "tips": [
        "For truck accidents, seek attorneys with specific commercial trucking litigation experience",
        "Rideshare accident cases (Uber, Lyft) involve unique insurance layer complexities",
        "Motorcycle and bicycle cases often involve higher injury severity and may require specialist attorneys"
      ]
    },
    {
      "heading": "Premises Liability Attorneys",
      "content": "Premises liability cases involve injuries that occur on someone else's property due to unsafe conditions — slip-and-falls, inadequate lighting, broken stairs, dog bites, swimming pool accidents, or negligent security. These attorneys are experienced with property owner duties of care, notice requirements (proving the owner knew or should have known of the hazard), and working with accident reconstruction experts and medical experts. Premises liability cases involving government-owned property (public sidewalks, parks, government buildings) may require special procedural steps such as government tort claims.",
      "tips": [
        "Government property cases often have 6-month administrative claim deadlines",
        "Security inadequacy cases may involve criminal history research about the property",
        "Landlord liability for tenant injuries is a distinct subspecialty within premises liability"
      ]
    },
    {
      "heading": "Workers' Compensation and Workplace Injury Attorneys",
      "content": "If you were injured while working, your case may involve the workers' compensation system rather than — or in addition to — a personal injury claim. Workers' compensation provides benefits for work-related injuries without requiring you to prove fault, but benefits are limited. If a third party (other than your employer) caused your workplace injury, a separate personal injury claim may also be possible. Workers' compensation attorneys specialize in navigating the administrative system, disputing denied claims, and maximizing your benefits. They work alongside — not instead of — personal injury attorneys when third-party claims exist.",
      "tips": [
        "Workers' compensation and personal injury claims can sometimes proceed simultaneously",
        "Report workplace injuries to your employer immediately — delays can jeopardize your claim",
        "A third-party claim may be available if your injury involved a contractor, driver, or defective equipment"
      ]
    },
    {
      "heading": "Product Liability and Defective Product Attorneys",
      "content": "When a defective product — a faulty vehicle part, dangerous medication, defective equipment, or unsafe consumer product — causes an injury, product liability law may hold the manufacturer, distributor, or retailer responsible. Product liability cases are highly technical, often requiring engineering experts, product testing, recall history research, and complex litigation against large corporations. Attorneys who specialize in product liability typically have experience with class actions, multi-district litigation (MDL), and working with technical expert witnesses."
    }
  ],
  "faq": [
    {
      "question": "Do I need a specialist attorney or can any personal injury attorney handle my case?",
      "answer": "Many personal injury attorneys handle a broad range of accident types, and general experience is often sufficient for straightforward cases. However, cases involving commercial trucking, complex product liability, serious brain or spinal injuries, or government entities often benefit from attorneys with specific experience in those areas. During your initial consultation, ask about the attorney's experience with cases similar to yours."
    },
    {
      "question": "What should I look for when choosing a personal injury attorney?",
      "answer": "Look for an attorney with experience handling cases similar to yours, a clear contingency fee agreement (typically 33–40% of any recovery), responsiveness and clear communication, a track record of both settlements and trial verdicts, and state bar membership in good standing. Free initial consultations are standard in personal injury — use them to assess whether the attorney is a good fit."
    },
    {
      "question": "What is a contingency fee and how does it work?",
      "answer": "A contingency fee means the attorney only receives a fee if they recover money for you. The fee is a percentage of your settlement or verdict — typically between 33% and 40%, though this varies by attorney and case complexity. If there is no recovery, you owe no attorney's fees, though you may still be responsible for case costs (filing fees, expert fees, etc.). Always confirm the fee arrangement in writing before signing an engagement agreement."
    }
  ],
  "relatedTools": ["accident-case-quiz", "statute-countdown", "settlement-readiness"],
  "relatedGuides": ["after-car-accident"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle", "dog-bite"]
}
```

- [ ] **Step 3: Write `content/tools/state-next-steps.json`**

```json
{
  "slug": "state-next-steps",
  "title": "State-Specific Next Steps",
  "metaTitle": "State-Specific Next Steps — CA & AZ Accident Guide",
  "metaDescription": "Get state-specific guidance on deadlines, next steps, and important rules for accident victims in California and Arizona. Educational information only.",
  "description": "Personal injury rules and deadlines differ between California and Arizona. This tool helps you understand the key differences — filing deadlines, no-fault insurance rules, comparative fault standards, and government claim requirements — so you know what state-specific factors may be relevant to your situation.",
  "disclaimer": "This tool provides general educational information about California and Arizona personal injury rules. It is not legal advice. Laws change, and their application depends on your specific facts and circumstances. Consult a licensed personal injury attorney in the applicable state for guidance on your individual situation.",
  "steps": [
    {
      "id": "state",
      "question": "Which state did the accident occur in?",
      "type": "select"
    },
    {
      "id": "accident-type",
      "question": "What type of accident were you involved in?",
      "type": "select"
    },
    {
      "id": "accident-date",
      "question": "When did the accident happen?",
      "type": "date"
    }
  ],
  "supportingContent": [
    {
      "heading": "California: Key Rules for Accident Victims",
      "content": "California is a fault-based (tort) state for auto insurance, meaning the at-fault party's insurance is responsible for damages. California follows a pure comparative fault rule — you can recover compensation even if you were partially at fault, but your recovery is reduced by your percentage of fault. The statute of limitations for personal injury claims is generally two years from the date of injury. Claims against government entities require a formal government tort claim within six months. California requires all drivers to carry minimum liability insurance of $15,000 per person and $30,000 per occurrence.",
      "tips": [
        "Pure comparative fault means even 99% at-fault parties can seek some recovery",
        "Government tort claims have a strict 6-month deadline — do not confuse with the 2-year lawsuit deadline",
        "California's Uninsured Motorist (UM) coverage protects you from drivers without insurance"
      ]
    },
    {
      "heading": "Arizona: Key Rules for Accident Victims",
      "content": "Arizona is also a fault-based state for auto insurance. Like California, Arizona follows pure comparative fault — partial fault on your part reduces your recovery proportionally but does not bar you from suing. The general personal injury statute of limitations in Arizona is also two years from the date of injury. Claims against cities and counties typically require notice within 60 days; claims against state agencies require notice within 180 days. Arizona's minimum required auto liability coverage is $25,000 per person and $50,000 per occurrence.",
      "tips": [
        "Arizona's government claim deadlines are stricter than California's — 60 days for cities and counties",
        "Arizona has no personal injury protection (PIP) requirement, unlike some no-fault states",
        "Uninsured motorist coverage is important in Arizona given high rates of uninsured drivers"
      ]
    },
    {
      "heading": "Claims Against Government Entities: Critical Deadlines",
      "content": "When your accident involves a government-owned vehicle, government employee, or a hazard on government property (a pothole, a broken traffic light, a dangerous sidewalk), special claim procedures apply before you can sue. In California, you must file a government tort claim with the relevant agency within six months of the date of injury. In Arizona, the deadline is 180 days for state agencies and 60 days for cities and counties. Missing these administrative claim deadlines can bar your lawsuit entirely — they are separate from and shorter than the general two-year statute of limitations.",
      "tips": [
        "File immediately if a government vehicle or property is involved — do not wait",
        "The government entity's response (or failure to respond) triggers additional deadlines",
        "An attorney experienced with government claims is strongly recommended for these cases"
      ]
    },
    {
      "heading": "How Comparative Fault Affects Your Claim",
      "content": "Both California and Arizona follow the 'pure comparative fault' rule, which means that your compensation is reduced by your share of fault for the accident — but you are not completely barred from recovery even if you were significantly at fault. For example, if you are found 30% at fault and your damages are $100,000, you would recover $70,000. Insurance adjusters may try to assign you a higher percentage of fault to reduce the amount they owe. Having strong evidence — including a police report, witness accounts, and photos — is important to counter attempts to unfairly allocate fault to you."
    }
  ],
  "faq": [
    {
      "question": "Does it matter which state the accident happened in if I live in a different state?",
      "answer": "Yes. Personal injury claims are generally governed by the law of the state where the accident occurred, not where you live. This includes which statute of limitations applies, fault rules, and government claim requirements. If you were injured in California or Arizona but live elsewhere, the applicable deadlines and procedures are those of the state where the accident occurred."
    },
    {
      "question": "What is the difference between a fault state and a no-fault state for insurance?",
      "answer": "In fault states like California and Arizona, the at-fault driver's insurance is responsible for compensating victims. In no-fault states, each driver's own insurance covers their injuries regardless of fault. California and Arizona are both fault states — meaning you can pursue a claim against the at-fault party and their insurer, rather than being limited to your own coverage."
    },
    {
      "question": "What is comparative fault and how does it affect how much I can recover?",
      "answer": "Comparative fault means that if you share some responsibility for the accident, your recovery is reduced by your percentage of fault. Under California's and Arizona's pure comparative fault system, you can still recover compensation even if you were more than 50% at fault — your award is simply reduced proportionally. For example, 25% fault on your part reduces a $100,000 recovery to $75,000."
    }
  ],
  "relatedTools": ["statute-countdown", "accident-case-quiz", "lawyer-type-matcher"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "pedestrian", "slip-fall"]
}
```

- [ ] **Step 4: Run build to validate all three new JSON files**

```bash
npm run build
```

Expected: build succeeds. Fix Zod validation errors if any.

- [ ] **Step 5: Commit**

```bash
git add content/tools/settlement-readiness.json content/tools/lawyer-type-matcher.json content/tools/state-next-steps.json
git commit -m "feat: add tool CMS content — settlement-readiness, lawyer-type-matcher, state-next-steps"
```

---

### Task 7: Tools Index Page (`app/tools/page.tsx`)

**Files:**
- Create: `app/tools/page.tsx`

The index page hardcodes the two featured slugs and filters the rest. No client hub component needed — static layout rendered directly in the server component.

- [ ] **Step 1: Create `app/tools/` directory (if needed) and write `app/tools/page.tsx`**

```bash
mkdir -p app/tools
```

Write `app/tools/page.tsx`:

```tsx
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Free Accident & Injury Tools — California & Arizona',
  description:
    'Free interactive tools for accident victims: evidence checklists, lost wages estimator, statute of limitations countdown, insurance call prep, and more.',
  canonical: '/tools',
})

const FEATURED_SLUGS = ['statute-countdown', 'accident-case-quiz']

export default function ToolsPage() {
  const tools = cms.getAllTools()
  const featuredTools = tools.filter(t => FEATURED_SLUGS.includes(t.slug))
  const gridTools = tools.filter(t => !FEATURED_SLUGS.includes(t.slug))

  return (
    <div className="bg-surface-page min-h-screen">
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Free Tools' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Free Tools
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Free Accident &amp; Injury Tools
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Interactive tools to help you collect evidence, understand your timeline, prepare for
            insurance calls, and more — free, no account required.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> Attorney-reviewed content
          </div>
          <p className="mt-2 text-primary-400 text-xs">
            These tools provide educational information only and do not constitute legal advice.
          </p>
        </div>
      </div>

      {/* Card wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">

          {/* Featured tools — 2-col */}
          {featuredTools.length > 0 && (
            <div className="p-6 lg:p-8">
              <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
                Most Useful
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredTools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group block bg-primary-900 rounded-xl p-6 hover:bg-primary-800 transition-colors"
                  >
                    <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold font-sans mb-3">
                      <span aria-hidden="true">★</span> Most Useful
                    </div>
                    <h2 className="font-sans font-bold text-white text-lg leading-snug mb-2 group-hover:text-amber-100 transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-primary-300 text-sm leading-relaxed mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-400 text-xs">
                        {tool.steps.length} {tool.steps.length === 1 ? 'step' : 'steps'}
                      </span>
                      <span className="text-amber-400 text-sm font-semibold font-sans group-hover:underline">
                        Try It Free →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {featuredTools.length > 0 && gridTools.length > 0 && (
            <div className="border-t border-neutral-100" />
          )}

          {/* Grid tools — 3-col */}
          {gridTools.length > 0 && (
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gridTools.map(tool => (
                  <div
                    key={tool.slug}
                    className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-5 hover:border-primary-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-info flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <h2 className="font-sans font-semibold text-neutral-950 text-sm leading-snug">
                        {tool.title}
                      </h2>
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-xs">
                        {tool.steps.length} {tool.steps.length === 1 ? 'step' : 'steps'}
                      </span>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-xs font-semibold font-sans transition-colors"
                      >
                        Try Tool →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tools.length === 0 && (
            <p className="text-neutral-500 text-center py-16 text-sm">
              Tools are being prepared. Check back soon.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/tools/page.tsx
git commit -m "feat: add tools index page — featured 2-col row and 9-card grid"
```

---

### Task 8: ToolEngine Placeholder (`components/tools/ToolEngine.tsx`)

**Files:**
- Create: `components/tools/ToolEngine.tsx`

- [ ] **Step 1: Create `components/tools/` directory (if needed) and write `ToolEngine.tsx`**

```bash
mkdir -p components/tools
```

Write `components/tools/ToolEngine.tsx`:

```tsx
'use client'

import type { ToolConfig } from '@/types/tool'

const TYPE_LABELS: Record<string, string> = {
  select: 'Multiple choice',
  multiselect: 'Multiple select',
  checklist: 'Checklist',
  number: 'Number input',
  text: 'Text input',
  date: 'Date input',
}

interface Props {
  tool: ToolConfig
}

export function ToolEngine({ tool }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>

      {/* Step list */}
      <div className="flex flex-col gap-4">
        {tool.steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-surface-card p-4"
          >
            <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold font-sans">{index + 1}</span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p className="font-sans font-medium text-neutral-950 text-sm leading-snug">
                {step.question}
              </p>
              <p className="text-neutral-400 text-xs">{TYPE_LABELS[step.type] ?? step.type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Greyed-out CTA */}
      <div className="flex flex-col items-start gap-2 opacity-50 pointer-events-none select-none">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-900 text-white text-sm font-semibold font-sans"
        >
          Start Tool →
        </button>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-info text-primary-700 text-xs font-semibold font-sans">
          Launching soon
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/tools/ToolEngine.tsx
git commit -m "feat: add ToolEngine placeholder client component"
```

---

### Task 9: Tool Detail Page (`app/tools/[slug]/page.tsx`)

**Files:**
- Create: `app/tools/[slug]/page.tsx`

- [ ] **Step 1: Create `app/tools/[slug]/` directory (if needed)**

```bash
mkdir -p "app/tools/[slug]"
```

- [ ] **Step 2: Write `app/tools/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Shield, Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { ToolConfig } from '@/types/tool'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { softwareApplicationSchema, faqSchema } from '@/lib/seo'
import { ToolEngine } from '@/components/tools/ToolEngine'

export async function generateStaticParams() {
  return cms.getAllTools().map(t => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const tool = cms.getTool(slug)
    return buildMetaTags({
      title: tool.metaTitle,
      description: tool.metaDescription,
      canonical: `/tools/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let tool: ToolConfig
  try {
    tool = cms.getTool(slug)
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={softwareApplicationSchema({
          name: tool.title,
          description: tool.description,
          url: `/tools/${tool.slug}`,
        })}
        id="software-schema"
      />
      <SchemaOrg
        schema={faqSchema(tool.faq)}
        id="faq-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Free Tools', href: '/tools' },
              { label: tool.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {tool.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {tool.description}
            </p>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">{tool.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-10">

              {/* Tool engine placeholder */}
              <ToolEngine tool={tool} />

              {/* Supporting content */}
              {tool.supportingContent.map((section, index) => (
                <section key={index} aria-labelledby={`section-${index}`}>
                  <h2
                    id={`section-${index}`}
                    className="font-sans font-bold text-2xl text-neutral-950 mb-4"
                  >
                    {section.heading}
                  </h2>
                  <p className="text-neutral-600 leading-relaxed text-base font-serif mb-5">
                    {section.content}
                  </p>
                  {section.tips && section.tips.length > 0 && (
                    <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                      <ul className="flex flex-col gap-2.5">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2.5">
                            <ArrowRight
                              className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-primary-800 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))}

              {/* FAQ accordion */}
              {tool.faq.length > 0 && (
                <section aria-labelledby="faq-heading">
                  <h2
                    id="faq-heading"
                    className="font-sans font-bold text-2xl text-neutral-950 mb-4"
                  >
                    Frequently Asked Questions
                  </h2>
                  <div className="flex flex-col gap-2">
                    {tool.faq.map((item, index) => (
                      <details
                        key={index}
                        className="group rounded-xl border border-neutral-100 bg-surface-card"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-sans font-semibold text-sm text-neutral-950 list-none">
                          {item.question}
                          <ArrowRight
                            className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-open:rotate-90"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="px-5 pb-4">
                          <p className="text-neutral-600 text-sm leading-relaxed font-serif">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Related accident type pills */}
              {tool.relatedAccidents.length > 0 && (
                <section aria-labelledby="related-accidents-heading">
                  <h2
                    id="related-accidents-heading"
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    Related Accident Types
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.relatedAccidents.map(accSlug => (
                      <Link
                        key={accSlug}
                        href={`/accidents/${accSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                      >
                        {accSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <CTAButton href="/find-help" size="md">
                Get Free Guidance
              </CTAButton>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* In This Tool — step nav */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  In This Tool
                </h3>
                <nav aria-label="Tool steps">
                  <ol className="flex flex-col gap-2">
                    {tool.steps.map((step, index) => (
                      <li key={step.id} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-neutral-500 leading-snug">
                          {step.question}
                        </span>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* CTA card */}
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                <Shield className="w-8 h-8 text-primary-500 mb-3" aria-hidden="true" />
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-2">
                  Get Personalized Guidance
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Answer a few questions about your situation and receive a personalized next-steps
                  checklist. Free, no obligation.
                </p>
                <CTAButton href="/find-help" size="sm" fullWidth>
                  Start Free Check
                </CTAButton>
              </div>

              {/* Related Tools */}
              {tool.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Tools
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedTools.map(toolSlug => (
                      <li key={toolSlug}>
                        <Link
                          href={`/tools/${toolSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <Wrench className="w-3 h-3 shrink-0 text-neutral-400" aria-hidden="true" />
                          {toolSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Guides */}
              {tool.relatedGuides.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Guides
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedGuides.map(guideSlug => (
                      <li key={guideSlug}>
                        <Link
                          href={`/guides/${guideSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {guideSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="default" />
    </>
  )
}
```

- [ ] **Step 3: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/tools/[slug]/page.tsx"
git commit -m "feat: add tool detail page with 2-col layout, ToolEngine, FAQ accordion, and sidebar"
```

---

### Task 10: Full Build Verification

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: all 11 tool pages generated with `generateStaticParams`, no TypeScript errors, no Zod validation failures. Build output should show 11 `/tools/[slug]` routes plus `/tools`.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no lint errors. Fix any reported issues before proceeding.

- [ ] **Step 3: Verify all 11 tool routes appear in build output**

Look for lines like:
```
○ /tools
○ /tools/accident-case-quiz
○ /tools/evidence-checklist
○ /tools/injury-journal
○ /tools/insurance-call-prep
○ /tools/lawyer-type-matcher
○ /tools/lost-wages-estimator
○ /tools/record-request
○ /tools/settlement-readiness
○ /tools/state-next-steps
○ /tools/statute-countdown
○ /tools/urgency-checker
```

If any routes are missing, check `content/tools/` for missing JSON files and that `cms.getAllTools()` is loading the correct directory.

- [ ] **Step 4: Final commit if any lint fixes were needed**

```bash
git add -p
git commit -m "fix: address lint issues in tools section"
```

---

## Spec Coverage Check

| Spec Requirement | Covered In |
|-----------------|------------|
| `/tools/page.tsx` index page | Task 7 |
| `/tools/[slug]/page.tsx` detail page | Task 9 |
| `ToolEngine` placeholder with disclaimer banner + step list + greyed CTA | Task 8 |
| `types/tool.ts` Zod schema (exact fields from spec) | Task 1 |
| `lib/cms.ts` — `getTool` / `getAllTools` | Task 2 |
| `SoftwareApplication` schema via `SchemaOrg` | Task 9 (two SchemaOrg blocks: software + FAQ) |
| FAQ `<details>`/`<summary>` accordion | Task 9 |
| All 11 CMS files with Zod-compliant content | Tasks 3–6 |
| Compliance disclaimers on every page | Tasks 3–6 (disclaimer field), Task 7 (hero), Task 9 (hero + DisclaimerBanner) |
| Featured 2-col dark cards (statute-countdown, accident-case-quiz) | Task 7 |
| 9-tool 3-col grid | Task 7 |
| `generateStaticParams` on detail page | Task 9 |
| Sidebar: step nav + CTA card + relatedTools + relatedGuides | Task 9 |
| `relatedAccidents` pill links | Task 9 |
| `metaTitle` ≤70, `metaDescription` 120–160 | Tasks 3–6 (validated by Zod at build time) |
| `supportingContent` ≥4 sections × ≥150 chars each | Tasks 3–6 (validated by Zod at build time) |
| `faq` ≥3 items × `answer` ≥50 chars | Tasks 3–6 (validated by Zod at build time) |
