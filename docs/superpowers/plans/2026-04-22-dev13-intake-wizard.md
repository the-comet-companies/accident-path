# DEV-13: IntakeWizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 9-step, mobile-first intake wizard at `/find-help` that collects accident details, persists to localStorage, submits to Supabase `intake_sessions`, and routes to a personalized results page.

**Architecture:** Client-component wizard (`IntakeWizard.tsx`) orchestrates 9 step components. State lives in `useState<Partial<IntakeForm>>()`, synced to localStorage on every change. On submit, writes to Supabase then navigates to `/find-help/results` (client component that reads localStorage). Logic for urgency scoring and lawyer type suggestion lives in `lib/intake.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4, Supabase `@supabase/supabase-js`, Zod schema already defined in `types/intake.ts`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `lib/intake.ts` | Create | Urgency scoring, lawyer type, analytics helpers, storage key |
| `components/intake/ProgressBar.tsx` | Create | Step X of 9 + percentage bar |
| `components/intake/ConsentCheckbox.tsx` | Create | TCPA consent checkbox with full legal text |
| `components/intake/steps/StepAccidentType.tsx` | Create | Step 1 — grid of clickable type cards (auto-advance on select) |
| `components/intake/steps/StepWhen.tsx` | Create | Step 2 — date input + statute-risk warning |
| `components/intake/steps/StepWhere.tsx` | Create | Step 3 — CA/AZ toggle + city text input |
| `components/intake/steps/StepInjuries.tsx` | Create | Step 4 — multi-select checkboxes |
| `components/intake/steps/StepMedical.tsx` | Create | Step 5 — single-select treatment cards |
| `components/intake/steps/StepPoliceReport.tsx` | Create | Step 6 — Yes/No toggle cards |
| `components/intake/steps/StepInsurance.tsx` | Create | Step 7 — single-select insurance cards |
| `components/intake/steps/StepWorkImpact.tsx` | Create | Step 8 — single-select work impact cards |
| `components/intake/steps/StepContact.tsx` | Create | Step 9 — ConsentCheckbox + name/email/phone + submit |
| `components/intake/IntakeWizard.tsx` | Create | Orchestrator — step routing, localStorage, Supabase submit, analytics |
| `app/find-help/page.tsx` | Create | Entry point — hero + white card wrapper + IntakeWizard |
| `app/find-help/results/page.tsx` | Create | Client component — reads localStorage, shows urgency + lawyer type + resources |
| `app/find-help/thank-you/page.tsx` | Create | Static server component — confirmation + links |

---

## Shared Types (already exist — do NOT recreate)

```typescript
// types/intake.ts — already exists, do not modify
export const IntakeFormSchema = z.object({
  accidentType: z.string(),
  accidentDate: z.string(),
  city: z.string(),
  state: z.enum(['CA', 'AZ']),
  injuries: z.array(z.string()),
  medicalTreatment: z.enum(['none', 'er', 'doctor', 'ongoing', 'surgery']),
  policeReport: z.boolean(),
  insuranceStatus: z.enum(['has_insurance', 'no_insurance', 'unsure']),
  workImpact: z.enum(['none', 'missed_days', 'cant_work', 'reduced_capacity']),
  urgencyFactors: z.array(z.string()),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  consent: z.boolean(),
})
export type IntakeForm = z.infer<typeof IntakeFormSchema>
```

---

## Shared Step Props Interface

Every step component uses this interface. Define it in `lib/intake.ts` and import from there.

```typescript
// in lib/intake.ts
export interface StepProps {
  data: Partial<IntakeForm>
  onChange: (updates: Partial<IntakeForm>) => void
  onNext: () => void
  onBack: () => void
}
```

---

## Task 1: `lib/intake.ts`

**Files:**
- Create: `lib/intake.ts`

- [ ] **Step 1: Write the file**

```typescript
import type { IntakeForm } from '@/types/intake'

export const INTAKE_STORAGE_KEY = 'accident-path-intake-v1'

export interface StepProps {
  data: Partial<IntakeForm>
  onChange: (updates: Partial<IntakeForm>) => void
  onNext: () => void
  onBack: () => void
}

export function monthsAgo(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  )
}

export function computeUrgency(data: Partial<IntakeForm>): 'low' | 'medium' | 'high' {
  let score = 0
  if (data.medicalTreatment === 'surgery' || data.medicalTreatment === 'er') score += 3
  else if (data.medicalTreatment === 'ongoing') score += 2
  if (data.workImpact === 'cant_work') score += 3
  else if (data.workImpact === 'missed_days' || data.workImpact === 'reduced_capacity') score += 1
  if (data.accidentDate) {
    const months = monthsAgo(data.accidentDate)
    if (months > 18) score += 3
    else if (months > 12) score += 2
  }
  if (score >= 5) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

export function suggestLawyerType(data: Partial<IntakeForm>): string {
  const type = (data.accidentType ?? '').toLowerCase()
  if (type.includes('truck')) return 'Commercial Vehicle Accident Attorney'
  if (type.includes('workplace')) return "Workers' Compensation Attorney"
  if (type.includes('dog') || type.includes('bite')) return 'Animal Attack / Personal Injury Attorney'
  if (type.includes('slip') || type.includes('fall')) return 'Premises Liability Attorney'
  if (type.includes('bicycle')) return 'Bicycle Accident Attorney'
  if (type.includes('pedestrian')) return 'Pedestrian Accident Attorney'
  if (type.includes('motorcycle')) return 'Motorcycle Accident Attorney'
  return 'Personal Injury Attorney'
}

export function computeUrgencyFactors(data: Partial<IntakeForm>): string[] {
  const factors: string[] = []
  if (data.medicalTreatment === 'er' || data.medicalTreatment === 'surgery')
    factors.push('serious_medical')
  if (data.workImpact === 'cant_work') factors.push('lost_income')
  if (data.policeReport === false) factors.push('no_police_report')
  if (data.accidentDate && monthsAgo(data.accidentDate) > 18) factors.push('statute_risk')
  return factors
}

export function suggestResources(data: Partial<IntakeForm>): Array<{ label: string; href: string }> {
  const type = (data.accidentType ?? '').toLowerCase()
  const resources: Array<{ label: string; href: string }> = []
  if (type.includes('car')) resources.push({ label: 'What to Do After a Car Accident', href: '/guides/after-car-accident' })
  if (type.includes('truck')) resources.push({ label: 'What to Do After a Truck Accident', href: '/guides/after-truck-accident' })
  if (type.includes('motorcycle')) resources.push({ label: 'What to Do After a Motorcycle Crash', href: '/guides/after-motorcycle-crash' })
  resources.push({ label: 'Dealing With Insurance Adjusters', href: '/guides/dealing-with-insurance-adjusters' })
  resources.push({ label: 'Am I at Fault?', href: '/guides/am-i-at-fault' })
  resources.push({ label: 'Evidence Collection Checklist', href: '/tools/evidence-checklist' })
  return resources.slice(0, 4)
}

// Analytics — gracefully no-ops if gtag not loaded
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return
  // @ts-expect-error gtag injected by GA4 script tag
  window.gtag?.('event', name, params)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors (or only pre-existing errors unrelated to `lib/intake.ts`)

- [ ] **Step 3: Commit**

```bash
git add lib/intake.ts
git commit -m "feat(intake): add intake lib — urgency scoring, lawyer type, analytics helpers"
```

---

## Task 2: ProgressBar + ConsentCheckbox

**Files:**
- Create: `components/intake/ProgressBar.tsx`
- Create: `components/intake/ConsentCheckbox.tsx`

- [ ] **Step 1: Write ProgressBar**

```tsx
// components/intake/ProgressBar.tsx
interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      <div className="flex justify-between text-xs text-primary-300 mb-2 font-sans">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-primary-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write ConsentCheckbox**

```tsx
// components/intake/ConsentCheckbox.tsx
interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ConsentCheckbox({ checked, onChange }: ConsentCheckboxProps) {
  const id = 'tcpa-consent'
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
      <label htmlFor={id} className="flex gap-3 cursor-pointer">
        <div className="shrink-0 mt-0.5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              checked
                ? 'bg-primary-600 border-primary-600'
                : 'bg-white border-neutral-300'
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          By submitting this form, I consent to receive calls, text messages, and emails from
          AccidentPath and its attorney partners regarding my inquiry. I understand that calls may
          be made using automated technology. Message and data rates may apply. I understand this
          service is free and I am not obligated to retain any attorney. I may revoke consent at
          any time by contacting us at{' '}
          <a href="mailto:hello@accidentpath.com" className="underline hover:text-primary-600">
            hello@accidentpath.com
          </a>
          .
        </p>
      </label>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add components/intake/ProgressBar.tsx components/intake/ConsentCheckbox.tsx
git commit -m "feat(intake): add ProgressBar and ConsentCheckbox components"
```

---

## Task 3: Steps 1–4 (AccidentType, When, Where, Injuries)

**Files:**
- Create: `components/intake/steps/StepAccidentType.tsx`
- Create: `components/intake/steps/StepWhen.tsx`
- Create: `components/intake/steps/StepWhere.tsx`
- Create: `components/intake/steps/StepInjuries.tsx`

Shared nav button pattern used in Steps 2–4 (Step 1 auto-advances on click):

```tsx
// inline in each step — back button + continue button
<div className="flex gap-3 mt-8">
  <button
    type="button"
    onClick={onBack}
    className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
  >
    Back
  </button>
  <button
    type="button"
    onClick={onNext}
    disabled={/* step-specific condition */}
    className="flex-2 min-h-[44px] flex-1 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Continue
  </button>
</div>
```

- [ ] **Step 1: Write StepAccidentType**

```tsx
// components/intake/steps/StepAccidentType.tsx
'use client'
import type { StepProps } from '@/lib/intake'

const ACCIDENT_TYPES = [
  'Car Accident',
  'Truck Accident',
  'Motorcycle Crash',
  'Slip & Fall',
  'Workplace Injury',
  'Bicycle Accident',
  'Pedestrian Accident',
  'Dog Bite',
  'Other',
]

export function StepAccidentType({ data, onChange, onNext }: StepProps) {
  function select(type: string) {
    onChange({ accidentType: type })
    onNext()
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        What type of accident happened?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">Select the option that best describes your situation.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACCIDENT_TYPES.map(type => (
          <button
            key={type}
            type="button"
            onClick={() => select(type)}
            className={`text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] font-sans text-sm font-medium ${
              data.accidentType === type
                ? 'border-primary-500 bg-surface-info text-primary-700'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write StepWhen**

```tsx
// components/intake/steps/StepWhen.tsx
'use client'
import { monthsAgo } from '@/lib/intake'
import type { StepProps } from '@/lib/intake'

export function StepWhen({ data, onChange, onNext, onBack }: StepProps) {
  const isOld = data.accidentDate ? monthsAgo(data.accidentDate) > 18 : false
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        When did the accident happen?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        The date affects your legal timeline. California and Arizona both have a 2-year statute of limitations for most personal injury claims.
      </p>
      <input
        type="date"
        value={data.accidentDate ?? ''}
        max={today}
        onChange={e => onChange({ accidentDate: e.target.value })}
        className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-base focus:outline-none focus:border-primary-500 min-h-[44px] bg-white"
      />
      {isOld && (
        <div className="mt-4 p-4 bg-warning-50 border border-warning-500 rounded-xl">
          <p className="text-warning-500 text-sm font-semibold font-sans mb-1">
            <span aria-hidden="true">⚠</span> Time-sensitive situation
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">
            More than 18 months have passed since your accident. You may be approaching your legal deadline. Consider speaking with an attorney as soon as possible. This is educational information only, not legal advice.
          </p>
        </div>
      )}
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.accidentDate}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write StepWhere**

```tsx
// components/intake/steps/StepWhere.tsx
'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const STATES: Array<{ value: IntakeForm['state']; label: string }> = [
  { value: 'CA', label: 'California' },
  { value: 'AZ', label: 'Arizona' },
]

export function StepWhere({ data, onChange, onNext, onBack }: StepProps) {
  const isValid = !!data.state && !!data.city?.trim()

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Where did it happen?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        We currently serve California and Arizona. State laws affect your options.
      </p>

      <fieldset className="mb-5">
        <legend className="text-sm font-semibold font-sans text-neutral-700 mb-2">State</legend>
        <div className="flex gap-3">
          {STATES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange({ state: s.value })}
              className={`flex-1 min-h-[44px] rounded-xl border-2 font-sans font-semibold text-sm transition-colors ${
                data.state === s.value
                  ? 'border-primary-500 bg-surface-info text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="city-input" className="block text-sm font-semibold font-sans text-neutral-700 mb-2">
          City
        </label>
        <input
          id="city-input"
          type="text"
          value={data.city ?? ''}
          onChange={e => onChange({ city: e.target.value })}
          placeholder="e.g. Los Angeles"
          className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-base focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400"
        />
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write StepInjuries**

```tsx
// components/intake/steps/StepInjuries.tsx
'use client'
import type { StepProps } from '@/lib/intake'

const INJURY_OPTIONS = [
  'Head / Brain',
  'Neck / Back',
  'Broken Bones',
  'Soft Tissue (whiplash, sprains)',
  'Burns',
  'Internal Injuries',
  'Emotional / Psychological',
  'None Visible Yet',
]

export function StepInjuries({ data, onChange, onNext, onBack }: StepProps) {
  const selected = data.injuries ?? []

  function toggle(injury: string) {
    if (selected.includes(injury)) {
      onChange({ injuries: selected.filter(i => i !== injury) })
    } else {
      onChange({ injuries: [...selected, injury] })
    }
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        What injuries did you sustain?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">Select all that apply. If unsure, select your best guess.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INJURY_OPTIONS.map(injury => {
          const isSelected = selected.includes(injury)
          return (
            <button
              key={injury}
              type="button"
              onClick={() => toggle(injury)}
              aria-pressed={isSelected}
              className={`text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] font-sans text-sm font-medium flex items-center gap-3 ${
                isSelected
                  ? 'border-primary-500 bg-surface-info text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
              }`}
            >
              <div
                aria-hidden="true"
                className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary-600 border-primary-600' : 'bg-white border-neutral-300'
                }`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {injury}
            </button>
          )
        })}
      </div>
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add components/intake/steps/StepAccidentType.tsx components/intake/steps/StepWhen.tsx components/intake/steps/StepWhere.tsx components/intake/steps/StepInjuries.tsx
git commit -m "feat(intake): add steps 1-4 — accident type, when, where, injuries"
```

---

## Task 4: Steps 5–8 (Medical, PoliceReport, Insurance, WorkImpact)

**Files:**
- Create: `components/intake/steps/StepMedical.tsx`
- Create: `components/intake/steps/StepPoliceReport.tsx`
- Create: `components/intake/steps/StepInsurance.tsx`
- Create: `components/intake/steps/StepWorkImpact.tsx`

Single-select card pattern (reused across all 4 steps):

```tsx
// Each option is a clickable card that sets value and calls onNext automatically
<button
  type="button"
  onClick={() => { onChange({ fieldName: value }); onNext() }}
  className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] font-sans text-sm font-medium ${
    data.fieldName === value
      ? 'border-primary-500 bg-surface-info text-primary-700'
      : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
  }`}
>
  <span className="font-semibold">{label}</span>
  {description && <span className="block text-xs text-neutral-500 mt-0.5">{description}</span>}
</button>
```

- [ ] **Step 1: Write StepMedical**

```tsx
// components/intake/steps/StepMedical.tsx
'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['medicalTreatment']; label: string; description: string }> = [
  { value: 'none', label: 'No treatment yet', description: 'I have not seen a doctor' },
  { value: 'er', label: 'Emergency room visit', description: 'I went to the ER after the accident' },
  { value: 'doctor', label: 'Doctor visit', description: 'I saw a doctor or urgent care' },
  { value: 'ongoing', label: 'Ongoing treatment', description: 'Physical therapy, specialist, etc.' },
  { value: 'surgery', label: 'Surgery required', description: 'I had or need surgery' },
]

export function StepMedical({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Have you received medical treatment?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Medical documentation is important evidence. Select the option that best applies.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ medicalTreatment: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.medicalTreatment === opt.value
                ? 'border-primary-500 bg-surface-info'
                : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            <span className="font-sans font-semibold text-sm text-neutral-950">{opt.label}</span>
            <span className="block font-sans text-xs text-neutral-500 mt-0.5">{opt.description}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        Back
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write StepPoliceReport**

```tsx
// components/intake/steps/StepPoliceReport.tsx
'use client'
import type { StepProps } from '@/lib/intake'

export function StepPoliceReport({ data, onChange, onNext, onBack }: StepProps) {
  function select(val: boolean) {
    onChange({ policeReport: val })
    onNext()
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Was a police report filed?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Police reports are an important piece of evidence in accident cases.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => select(true)}
          className={`flex-1 min-h-[64px] rounded-xl border-2 font-sans font-bold text-lg transition-colors ${
            data.policeReport === true
              ? 'border-primary-500 bg-surface-info text-primary-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => select(false)}
          className={`flex-1 min-h-[64px] rounded-xl border-2 font-sans font-bold text-lg transition-colors ${
            data.policeReport === false
              ? 'border-primary-500 bg-surface-info text-primary-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
          }`}
        >
          No
        </button>
      </div>
      {data.policeReport === false && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-500 rounded-xl">
          <p className="text-amber-700 text-sm font-sans leading-relaxed">
            <strong>Tip:</strong> You may still be able to file a report. Many police departments accept delayed reports within 24–72 hours. Check with your local department for options. This is educational information only, not legal advice.
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        Back
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Write StepInsurance**

```tsx
// components/intake/steps/StepInsurance.tsx
'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['insuranceStatus']; label: string; description: string }> = [
  { value: 'has_insurance', label: 'I have insurance', description: 'Auto, health, or workers\' comp coverage' },
  { value: 'no_insurance', label: 'I don\'t have insurance', description: 'No applicable insurance coverage' },
  { value: 'unsure', label: 'I\'m not sure', description: 'I\'m unsure what coverage applies' },
]

export function StepInsurance({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Do you have insurance coverage?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        This helps us understand what options may be available to you.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ insuranceStatus: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.insuranceStatus === opt.value
                ? 'border-primary-500 bg-surface-info'
                : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            <span className="font-sans font-semibold text-sm text-neutral-950">{opt.label}</span>
            <span className="block font-sans text-xs text-neutral-500 mt-0.5">{opt.description}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        Back
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Write StepWorkImpact**

```tsx
// components/intake/steps/StepWorkImpact.tsx
'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['workImpact']; label: string; description: string }> = [
  { value: 'none', label: 'No work impact', description: 'I was able to return to work as normal' },
  { value: 'missed_days', label: 'Missed some work', description: 'I missed days but have returned' },
  { value: 'reduced_capacity', label: 'Working at reduced capacity', description: 'I\'m back but can\'t do everything' },
  { value: 'cant_work', label: 'Unable to work', description: 'I cannot work due to my injuries' },
]

export function StepWorkImpact({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Has the accident affected your ability to work?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Lost wages may be recoverable. Select the option that best describes your situation.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ workImpact: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.workImpact === opt.value
                ? 'border-primary-500 bg-surface-info'
                : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            <span className="font-sans font-semibold text-sm text-neutral-950">{opt.label}</span>
            <span className="block font-sans text-xs text-neutral-500 mt-0.5">{opt.description}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        Back
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add components/intake/steps/StepMedical.tsx components/intake/steps/StepPoliceReport.tsx components/intake/steps/StepInsurance.tsx components/intake/steps/StepWorkImpact.tsx
git commit -m "feat(intake): add steps 5-8 — medical, police report, insurance, work impact"
```

---

## Task 5: StepContact (Step 9 — Contact Info + Consent)

**Files:**
- Create: `components/intake/steps/StepContact.tsx`

Note: This step has an additional `onSubmit` prop and a `submitting` state passed from the wizard.

```typescript
// Additional props for StepContact beyond StepProps
interface StepContactProps extends StepProps {
  onSubmit: () => Promise<void>
  submitting: boolean
}
```

- [ ] **Step 1: Write StepContact**

```tsx
// components/intake/steps/StepContact.tsx
'use client'
import { ConsentCheckbox } from '@/components/intake/ConsentCheckbox'
import type { StepProps } from '@/lib/intake'

interface StepContactProps extends StepProps {
  onSubmit: () => Promise<void>
  submitting: boolean
}

export function StepContact({ data, onChange, onBack, onSubmit, submitting }: StepContactProps) {
  const consentGiven = data.consent === true
  const canSubmit = consentGiven && !submitting

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Get your personalized results
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Almost done. Please review the consent below, then optionally share your contact info so we can send your results.
      </p>

      {/* Consent — required */}
      <div className="mb-6">
        <ConsentCheckbox
          checked={data.consent === true}
          onChange={val => onChange({ consent: val })}
        />
      </div>

      {/* Contact fields — optional */}
      <div className={`flex flex-col gap-4 transition-opacity ${consentGiven ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <p className="text-xs font-semibold font-sans text-neutral-500 uppercase tracking-wider">
          Contact info (optional — to receive your results by email)
        </p>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            Full Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={data.name ?? ''}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Jane Smith"
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            value={data.email ?? ''}
            onChange={e => onChange({ email: e.target.value })}
            placeholder="jane@example.com"
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold font-sans text-neutral-700 mb-1.5">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={data.phone ?? ''}
            onChange={e => onChange({ phone: e.target.value })}
            placeholder="(555) 000-0000"
            disabled={!consentGiven}
            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-sm focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400 disabled:bg-neutral-50"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'See My Results'}
        </button>
      </div>

      <p className="mt-4 text-xs text-neutral-400 text-center leading-relaxed">
        Your contact info is never sold. By submitting, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</a> and{' '}
        <a href="/terms" className="underline hover:text-neutral-600">Terms of Use</a>.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/intake/steps/StepContact.tsx
git commit -m "feat(intake): add step 9 — contact info with TCPA consent"
```

---

## Task 6: IntakeWizard Orchestrator

**Files:**
- Create: `components/intake/IntakeWizard.tsx`

- [ ] **Step 1: Write IntakeWizard**

```tsx
// components/intake/IntakeWizard.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { IntakeForm } from '@/types/intake'
import { supabase } from '@/lib/supabase'
import { INTAKE_STORAGE_KEY, computeUrgencyFactors, trackEvent } from '@/lib/intake'
import { ProgressBar } from '@/components/intake/ProgressBar'
import { StepAccidentType } from '@/components/intake/steps/StepAccidentType'
import { StepWhen } from '@/components/intake/steps/StepWhen'
import { StepWhere } from '@/components/intake/steps/StepWhere'
import { StepInjuries } from '@/components/intake/steps/StepInjuries'
import { StepMedical } from '@/components/intake/steps/StepMedical'
import { StepPoliceReport } from '@/components/intake/steps/StepPoliceReport'
import { StepInsurance } from '@/components/intake/steps/StepInsurance'
import { StepWorkImpact } from '@/components/intake/steps/StepWorkImpact'
import { StepContact } from '@/components/intake/steps/StepContact'

const TOTAL_STEPS = 9

const STEP_NAMES: Record<number, string> = {
  1: 'accident_type',
  2: 'when',
  3: 'where',
  4: 'injuries',
  5: 'medical',
  6: 'police_report',
  7: 'insurance',
  8: 'work_impact',
  9: 'contact',
}

export function IntakeWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<IntakeForm>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
    if (saved) {
      try { setData(JSON.parse(saved)) } catch { /* ignore corrupt data */ }
    }
    trackEvent('intake_started')
  }, [])

  useEffect(() => {
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const onChange = useCallback((updates: Partial<IntakeForm>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const goNext = useCallback(() => {
    const name = STEP_NAMES[step] ?? ''
    trackEvent('step_completed', { step_number: step, step_name: name })
    setStep(s => Math.min(s + 1, TOTAL_STEPS))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const goBack = useCallback(() => {
    setStep(s => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  async function handleSubmit() {
    setSubmitting(true)
    const urgencyFactors = computeUrgencyFactors(data)
    try {
      await supabase.from('intake_sessions').insert({
        accident_type: data.accidentType ?? null,
        accident_date: data.accidentDate ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        injuries: data.injuries ?? [],
        medical_treatment: data.medicalTreatment ?? null,
        police_report: data.policeReport ?? null,
        insurance_status: data.insuranceStatus ?? null,
        work_impact: data.workImpact ?? null,
        urgency_factors: urgencyFactors,
        name: data.name ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        consent: data.consent ?? false,
        submitted_at: new Date().toISOString(),
      })
    } catch {
      // Don't block the user flow on Supabase errors
    }
    trackEvent('intake_submitted', {
      accident_type: data.accidentType ?? '',
      state: data.state ?? '',
    })
    // Keep data in localStorage for results page
    router.push('/find-help/results')
  }

  const stepProps = { data, onChange, onNext: goNext, onBack: goBack }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      {/* Progress */}
      <div className="mb-8">
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 1 && <StepAccidentType {...stepProps} />}
        {step === 2 && <StepWhen {...stepProps} />}
        {step === 3 && <StepWhere {...stepProps} />}
        {step === 4 && <StepInjuries {...stepProps} />}
        {step === 5 && <StepMedical {...stepProps} />}
        {step === 6 && <StepPoliceReport {...stepProps} />}
        {step === 7 && <StepInsurance {...stepProps} />}
        {step === 8 && <StepWorkImpact {...stepProps} />}
        {step === 9 && (
          <StepContact
            {...stepProps}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/desil/projects/accident-path && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/intake/IntakeWizard.tsx
git commit -m "feat(intake): add IntakeWizard orchestrator — localStorage, Supabase submit, analytics"
```

---

## Task 7: `app/find-help/page.tsx`

**Files:**
- Create: `app/find-help/page.tsx`

Note: This page is a **server component** that renders `IntakeWizard` (the client component). The hero and layout are static server-rendered; only the wizard is client-side.

- [ ] **Step 1: Write find-help page**

```tsx
// app/find-help/page.tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { IntakeWizard } from '@/components/intake/IntakeWizard'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Get Free Accident Guidance — AccidentPath',
  description:
    'Answer a few questions about your accident and get personalized next steps, understand what type of lawyer may help, and find relevant resources — free, no obligation.',
  canonical: '/find-help',
})

export default function FindHelpPage() {
  return (
    <div className="min-h-screen bg-surface-page">
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Get Help' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Free Guidance
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Let&apos;s Find Your Next Steps
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Answer 9 quick questions about your accident and we&apos;ll give you personalized guidance — free, no obligation.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> No account required
          </div>
        </div>
      </div>

      {/* Wizard card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <IntakeWizard />
        </div>
        <div className="mt-6">
          <DisclaimerBanner variant="intake" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run build to verify page generates**

```bash
cd c:/Users/desil/projects/accident-path && npm run build 2>&1 | tail -20
```

Expected: new `/find-help` route appears in the build output. No errors.

- [ ] **Step 3: Commit**

```bash
git add app/find-help/page.tsx
git commit -m "feat(intake): add /find-help entry page with wizard"
```

---

## Task 8: `app/find-help/results/page.tsx`

**Files:**
- Create: `app/find-help/results/page.tsx`

This is a **client component** — it reads localStorage on mount to display personalized results. If no data is found (direct navigation), it shows a fallback CTA to restart the wizard.

Urgency colors:
- `high` → `bg-danger-50 border-danger-500 text-danger-500`
- `medium` → `bg-warning-50 border-warning-500 text-warning-500`
- `low` → `bg-success-50 border-success-500 text-success-500`

- [ ] **Step 1: Write results page**

```tsx
// app/find-help/results/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { IntakeForm } from '@/types/intake'
import {
  INTAKE_STORAGE_KEY,
  computeUrgency,
  suggestLawyerType,
  suggestResources,
  monthsAgo,
} from '@/lib/intake'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'

const URGENCY_CONFIG = {
  high: {
    label: 'High Priority',
    message:
      'Based on what you shared, your situation may be time-sensitive. Consider speaking with a personal injury attorney as soon as possible. This is educational information only, not legal advice.',
    colorClasses: 'bg-danger-50 border-danger-500',
    labelClasses: 'text-danger-500',
  },
  medium: {
    label: 'Moderate Priority',
    message:
      'Your situation warrants attention. There may be important deadlines or documentation steps to take soon. This is educational information only, not legal advice.',
    colorClasses: 'bg-warning-50 border-warning-500',
    labelClasses: 'text-warning-500',
  },
  low: {
    label: 'Standard Priority',
    message:
      'Based on your responses, you appear to have more time to consider your options carefully. That said, earlier action is generally better when it comes to accident claims. This is educational information only, not legal advice.',
    colorClasses: 'bg-success-50 border-success-500',
    labelClasses: 'text-success-500',
  },
}

export default function FindHelpResultsPage() {
  const [data, setData] = useState<Partial<IntakeForm> | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
    if (saved) {
      try { setData(JSON.parse(saved)) } catch { /* ignore */ }
    }
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-neutral-400 font-sans text-sm">Loading your results…</div>
      </div>
    )
  }

  if (!data || !data.accidentType) {
    return (
      <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-sans font-bold text-2xl text-neutral-950 text-center">No results found</h1>
        <p className="text-neutral-500 text-sm text-center max-w-sm">
          It looks like you haven&apos;t completed the intake form yet.
        </p>
        <Link
          href="/find-help"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
        >
          Start the Intake Wizard
        </Link>
      </div>
    )
  }

  const urgency = computeUrgency(data)
  const urgencyConfig = URGENCY_CONFIG[urgency]
  const lawyerType = suggestLawyerType(data)
  const resources = suggestResources(data)
  const isOld = data.accidentDate ? monthsAgo(data.accidentDate) > 18 : false

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Header */}
      <div className="bg-primary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Your Personalized Results
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Here&apos;s What We Found
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Based on what you told us about your {data.accidentType?.toLowerCase()} in {data.city}, {data.state}.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">

        {/* Urgency banner */}
        <div className={`p-5 rounded-2xl border-2 ${urgencyConfig.colorClasses}`}>
          <p className={`font-sans font-bold text-sm mb-1 ${urgencyConfig.labelClasses}`}>
            {urgencyConfig.label}
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">{urgencyConfig.message}</p>
          {isOld && (
            <p className="mt-2 text-sm font-semibold text-neutral-700">
              ⚠ Your accident was over 18 months ago — speaking with an attorney soon is especially important.
            </p>
          )}
        </div>

        {/* Lawyer type suggestion */}
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
          <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-2">
            Lawyer Type That May Help
          </p>
          <p className="font-sans font-bold text-xl text-neutral-950 mb-3">{lawyerType}</p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Based on what you told us, lawyers who typically handle{' '}
            {data.accidentType?.toLowerCase()} cases in {data.state} may be able to help you understand
            your options. Availability varies by case type and location. This is educational
            information only, not legal advice.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            Connect with an Attorney <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
        </div>

        {/* Recommended resources */}
        {resources.length > 0 && (
          <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
            <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
              Recommended Resources
            </p>
            <ul className="flex flex-col gap-3">
              {resources.map(r => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-2 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                  >
                    <span aria-hidden="true" className="text-primary-300">→</span>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Restart / tools CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tools"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary-500 text-primary-600 font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-50 transition-colors"
          >
            Explore Free Tools
          </Link>
          <Link
            href="/find-help"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            Start Over
          </Link>
        </div>

        <DisclaimerBanner variant="intake" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run build to verify**

```bash
cd c:/Users/desil/projects/accident-path && npm run build 2>&1 | tail -20
```

Expected: `/find-help/results` appears in build. `(Client)` label shown.

- [ ] **Step 3: Commit**

```bash
git add app/find-help/results/page.tsx
git commit -m "feat(intake): add /find-help/results — personalized urgency, lawyer type, resources"
```

---

## Task 9: `app/find-help/thank-you/page.tsx`

**Files:**
- Create: `app/find-help/thank-you/page.tsx`

Static server component — displayed after a future email-confirmation flow. Currently linked from StepContact success path (optional) but primarily the results page is the post-submit destination. This page exists as a clean endpoint.

- [ ] **Step 1: Write thank-you page**

```tsx
// app/find-help/thank-you/page.tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Thank You — AccidentPath',
  description: 'Your intake has been submitted. View your personalized next steps and resources.',
  canonical: '/find-help/thank-you',
  noIndex: true,
})

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Get Help', href: '/find-help' },
              { label: 'Thank You' },
            ]}
            variant="dark"
          />
          <div className="flex items-center gap-2 text-success-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span aria-hidden="true">✓</span> Submitted
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            We&apos;ve Received Your Information
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Your personalized results are ready. If you provided an email address, you&apos;ll receive a copy shortly.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-success-500 text-2xl font-bold" aria-hidden="true">✓</span>
          </div>
          <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
            What Happens Next?
          </h2>
          <ul className="text-sm text-neutral-600 font-sans leading-relaxed text-left mt-4 flex flex-col gap-3">
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              View your personalized results and recommended resources below.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Explore free tools to document your evidence, track medical bills, and prepare for insurance calls.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Read guides tailored to your accident type and situation.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              When ready, contact us to learn what types of attorneys typically handle cases like yours.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/find-help/results"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            View My Results <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
          <Link
            href="/tools"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary-500 text-primary-600 font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-50 transition-colors"
          >
            Explore Free Tools
          </Link>
        </div>

        <DisclaimerBanner variant="intake" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run full build**

```bash
cd c:/Users/desil/projects/accident-path && npm run build 2>&1 | tail -30
```

Expected: 3 new routes (`/find-help`, `/find-help/results`, `/find-help/thank-you`). Total static pages: 71.

- [ ] **Step 3: Run lint**

```bash
cd c:/Users/desil/projects/accident-path && npm run lint 2>&1 | tail -20
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add app/find-help/thank-you/page.tsx
git commit -m "feat(intake): add /find-help/thank-you confirmation page"
```

---

## Post-Implementation Checklist

- [ ] All 3 routes build without errors
- [ ] TypeScript strict mode passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `intake_started`, `step_completed`, `intake_submitted` GA4 events fire (check browser console with `window.gtag` calls)
- [ ] Consent checkbox is unchecked by default on load
- [ ] Contact fields are visually disabled until consent is checked
- [ ] localStorage persists data across page refreshes on `/find-help`
- [ ] "Start Over" on results page navigates back to `/find-help`
- [ ] Urgency warning shows on Step 2 when date is > 18 months ago
- [ ] Police report tip shows when "No" is selected on Step 6
- [ ] Back button on Step 1 is not shown (Step 1 has no `onBack` — handled by not rendering it)

### Note on Step 1 Back Button
`StepAccidentType` does not render a Back button since it's the first step. The wizard renders `onBack` for all steps but Step 1's component simply doesn't call it.

---

## Compliance Notes

- All body copy uses safe language patterns (`may`, `typically`, `educational information only`)
- No "you have a case", "we recommend", or "best lawyer" language anywhere
- TCPA consent: unchecked by default, full legal text visible, required before contact fields activate
- Urgency warnings say "consider speaking with an attorney" not "you need a lawyer"
- All lawyer type suggestions use "lawyers who typically handle..." framing
- `DisclaimerBanner variant="intake"` appears on all 3 routes
