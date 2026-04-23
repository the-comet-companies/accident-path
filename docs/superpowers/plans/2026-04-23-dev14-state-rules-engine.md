# DEV-14: State Rules Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CA/AZ state rules data layer, move intake submission to a server-side Route Handler, and surface personalized state-specific legal deadlines on the results page.

**Architecture:** `lib/state-rules.ts` holds typed CA/AZ rules as a static data map with a `getRelevantDeadlines()` filter helper. `app/api/intake/route.ts` is a POST Route Handler that validates with Zod and inserts to Supabase server-side. The results page adds a state rules card between the urgency banner and lawyer type card.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Zod, Supabase JS client, Tailwind CSS v4

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `types/state-rules.ts` | Create | `ReportingDeadline` and `StateRules` interfaces |
| `lib/state-rules.ts` | Create | `STATE_RULES` data const + `getRelevantDeadlines()` helper |
| `app/api/intake/route.ts` | Create | POST handler — Zod validation + Supabase insert |
| `components/intake/IntakeWizard.tsx` | Edit | Swap `getSupabase()` call → `fetch('/api/intake', ...)` |
| `app/find-help/results/page.tsx` | Edit | Add state rules card using `STATE_RULES` + `getRelevantDeadlines()` |

---

## Task 1: Types — `types/state-rules.ts`

**Files:**
- Create: `types/state-rules.ts`

- [ ] **Step 1: Create the types file**

```ts
// types/state-rules.ts
export interface ReportingDeadline {
  accidentTypes: string[] // empty array = applies to all accident types
  label: string
  deadlineDays: number | null // null = "per policy terms" (e.g. UM/UIM)
  details: string
}

export interface StateRules {
  sol: {
    personalInjury: number  // months
    propertyDamage: number
    wrongfulDeath: number
  }
  faultRule: {
    type: 'pure_comparative'
    summary: string
  }
  insuranceMinimums: {
    perPerson: string
    perAccident: string
    propertyDamage: string
  }
  reportingDeadlines: ReportingDeadline[]
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/state-rules.ts
git commit -m "feat(state-rules): add StateRules and ReportingDeadline types"
```

---

## Task 2: State Rules Data — `lib/state-rules.ts`

**Files:**
- Create: `lib/state-rules.ts`
- Read: `types/state-rules.ts` (Task 1)

- [ ] **Step 1: Create the data file**

```ts
// lib/state-rules.ts
import type { StateRules, ReportingDeadline } from '@/types/state-rules'

export const STATE_RULES: Record<'CA' | 'AZ', StateRules> = {
  CA: {
    sol: {
      personalInjury: 24,
      propertyDamage: 36,
      wrongfulDeath: 24,
    },
    faultRule: {
      type: 'pure_comparative',
      summary:
        'California uses pure comparative fault — you may recover damages even if you were partly at fault, with your award reduced in proportion to your share of responsibility.',
    },
    insuranceMinimums: {
      perPerson: '$15,000',
      perAccident: '$30,000',
      propertyDamage: '$5,000',
    },
    reportingDeadlines: [
      {
        accidentTypes: [
          'Car Accident',
          'Truck Accident',
          'Motorcycle Crash',
          'Bicycle Accident',
          'Pedestrian Accident',
        ],
        label: 'DMV SR-1 Report',
        deadlineDays: 10,
        details:
          'Required when an accident results in injury, death, or property damage over $1,000. File with the California DMV within 10 days.',
      },
      {
        accidentTypes: [],
        label: 'Government Entity Claim',
        deadlineDays: 180,
        details:
          'Claims against any California state or local government entity must be filed within 6 months of the incident. Missing this deadline is a hard bar to recovery.',
      },
      {
        accidentTypes: ['Workplace Injury'],
        label: "Workers' Compensation Notice",
        deadlineDays: 30,
        details:
          'Report the injury to your employer within 30 days. File a formal DWC-1 claim within 1 year of the injury date.',
      },
      {
        accidentTypes: ['Car Accident', 'Truck Accident', 'Motorcycle Crash'],
        label: 'UM/UIM Claim',
        deadlineDays: null,
        details:
          'Uninsured/underinsured motorist claims must be reported promptly per your policy terms. A lawsuit must be filed within 2 years under California law.',
      },
    ],
  },
  AZ: {
    sol: {
      personalInjury: 24,
      propertyDamage: 24,
      wrongfulDeath: 24,
    },
    faultRule: {
      type: 'pure_comparative',
      summary:
        'Arizona uses pure comparative fault — you may recover damages regardless of your share of fault, with your award reduced proportionally. There is no threshold that bars recovery.',
    },
    insuranceMinimums: {
      perPerson: '$25,000',
      perAccident: '$50,000',
      propertyDamage: '$15,000',
    },
    reportingDeadlines: [
      {
        accidentTypes: [],
        label: 'Government Entity Claim',
        deadlineDays: 180,
        details:
          'Claims against Arizona state, county, or municipal entities require pre-suit notice within 180 days of the incident. Missing this deadline bars your claim.',
      },
      {
        accidentTypes: ['Workplace Injury'],
        label: "Workers' Compensation Claim",
        deadlineDays: 365,
        details:
          'File a workers\' compensation claim within 1 year of the injury date. Report the injury to your employer as soon as possible.',
      },
      {
        accidentTypes: ['Car Accident', 'Truck Accident', 'Motorcycle Crash'],
        label: 'UM/UIM Claim',
        deadlineDays: null,
        details:
          'Uninsured/underinsured motorist claims must be reported promptly per your policy terms. Review your policy for specific notice requirements.',
      },
    ],
  },
}

export function getRelevantDeadlines(
  state: 'CA' | 'AZ',
  accidentType: string
): ReportingDeadline[] {
  return STATE_RULES[state].reportingDeadlines
    .filter(
      d => d.accidentTypes.length === 0 || d.accidentTypes.includes(accidentType)
    )
    .slice(0, 3)
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify filter logic with tsx**

```bash
npx tsx -e "
import { getRelevantDeadlines } from './lib/state-rules'
console.log('CA Car:', getRelevantDeadlines('CA', 'Car Accident').map(d => d.label))
console.log('CA Workplace:', getRelevantDeadlines('CA', 'Workplace Injury').map(d => d.label))
console.log('AZ Slip:', getRelevantDeadlines('AZ', 'Slip & Fall').map(d => d.label))
console.log('CA Dog:', getRelevantDeadlines('CA', 'Dog Bite').map(d => d.label))
"
```

Expected output:
```
CA Car: [ 'DMV SR-1 Report', 'Government Entity Claim', 'UM/UIM Claim' ]
CA Workplace: [ 'Government Entity Claim', "Workers' Compensation Notice" ]
AZ Slip: [ 'Government Entity Claim' ]
CA Dog: [ 'Government Entity Claim' ]
```

- [ ] **Step 4: Commit**

```bash
git add lib/state-rules.ts
git commit -m "feat(state-rules): add CA/AZ rules data and getRelevantDeadlines helper"
```

---

## Task 3: Route Handler — `app/api/intake/route.ts`

**Files:**
- Create: `app/api/intake/route.ts`
- Read: `types/intake.ts` (existing — has `IntakeFormSchema`)
- Read: `lib/supabase.ts` (existing — has `getSupabase()`)

- [ ] **Step 1: Create the route handler**

```ts
// app/api/intake/route.ts
import { NextResponse } from 'next/server'
import { IntakeFormSchema } from '@/types/intake'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = IntakeFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid submission', details: parsed.error.errors },
      { status: 400 }
    )
  }

  const data = parsed.data
  const { error } = await getSupabase()
    .from('intake_sessions')
    .insert({
      accident_type: data.accidentType,
      accident_date: data.accidentDate,
      city: data.city,
      state: data.state,
      injuries: data.injuries,
      medical: data.medicalTreatment,
      police_report: data.policeReport,
      insurance: data.insuranceStatus,
      work_impact: data.workImpact,
      urgency_factors: data.urgencyFactors,
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      consent: data.consent,
    })

  if (error) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/intake/route.ts
git commit -m "feat(intake): add POST route handler with Zod validation and Supabase insert"
```

---

## Task 4: Update IntakeWizard — swap Supabase call for fetch

**Files:**
- Modify: `components/intake/IntakeWizard.tsx`

The current `handleSubmit` calls `getSupabase().from('intake_sessions').insert(...)` directly. Replace with a `fetch` to the new route handler. Remove the `getSupabase` import.

- [ ] **Step 1: Update `handleSubmit` and remove the Supabase import**

Replace the entire import line and `handleSubmit` function. The rest of the file is unchanged.

Remove this import (no longer needed client-side):
```ts
import { getSupabase } from '@/lib/supabase'
```

Replace the entire `handleSubmit` function with:
```ts
async function handleSubmit() {
  setSubmitting(true)
  const urgencyFactors = computeUrgencyFactors(data)
  try {
    await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        urgencyFactors,
      }),
    })
  } catch {
    // Don't block the user flow on network errors
  }
  trackEvent('intake_submitted', {
    accident_type: data.accidentType ?? '',
    state: data.state ?? '',
  })
  router.push('/find-help/thank-you')
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the wizard still builds and the Supabase import is gone**

```bash
grep -n "getSupabase\|supabase" components/intake/IntakeWizard.tsx
```

Expected: no output (import fully removed).

- [ ] **Step 4: Commit**

```bash
git add components/intake/IntakeWizard.tsx
git commit -m "feat(intake): submit via /api/intake route handler instead of direct Supabase call"
```

---

## Task 5: Results page — add state rules card

**Files:**
- Modify: `app/find-help/results/page.tsx`
- Read: `lib/state-rules.ts` (Task 2)
- Read: `types/state-rules.ts` (Task 1)

The results page is `'use client'` and reads from localStorage. Add a state rules card between the urgency banner and lawyer type card. The card only renders when `data.state` is `'CA'` or `'AZ'`.

- [ ] **Step 1: Add imports at the top of the file**

Add to the existing import block:
```ts
import { STATE_RULES, getRelevantDeadlines } from '@/lib/state-rules'
```

- [ ] **Step 2: Add `addMonths` at module level and derive state variables inside the component**

Add `addMonths` at the top of the file, after the import block and before `const URGENCY_CONFIG`:

```ts
function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
```

Then, inside the component function after the existing `const isOld = ...` line, add:

```ts
const stateKey = data.state === 'CA' || data.state === 'AZ' ? data.state : null
const stateRules = stateKey ? STATE_RULES[stateKey] : null
const relevantDeadlines = stateKey
  ? getRelevantDeadlines(stateKey, data.accidentType ?? '')
  : []
const solDeadline = stateKey && data.accidentDate ? addMonths(data.accidentDate, 24) : null
const stateName = stateKey === 'CA' ? 'California' : stateKey === 'AZ' ? 'Arizona' : ''
```

- [ ] **Step 3: Add the state rules card to the JSX**

Insert the following block immediately after the closing `</div>` of the urgency banner card (after `{isOld && ...}` block, before the lawyer type card):

```tsx
{/* State rules card */}
{stateRules && (
  <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
    {/* Header */}
    <div className="flex items-center gap-2 mb-5">
      <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans">
        <span className="w-4 h-px bg-amber-500 shrink-0" aria-hidden="true" />
        State-Specific Information
        <span className="w-4 h-px bg-amber-500 shrink-0" aria-hidden="true" />
      </div>
      <span className="ml-2 bg-primary-900 text-white text-xs font-bold px-2 py-0.5 rounded font-sans">
        {stateKey}
      </span>
    </div>

    {/* SOL deadline */}
    {solDeadline && (
      <div className="mb-5">
        <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-1">
          Estimated Filing Deadline
        </p>
        <p className="font-sans font-bold text-xl text-neutral-950 mb-1">{solDeadline}</p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          In {stateName}, the general personal injury deadline is 2 years from your accident
          date. Based on what you told us, that&apos;s approximately {solDeadline}.
        </p>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Deadlines vary based on your specific circumstances — consult an attorney to confirm yours.
        </p>
      </div>
    )}

    {/* Relevant reporting deadlines */}
    {relevantDeadlines.length > 0 && (
      <div className="mb-5">
        <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-3">
          Relevant Deadlines
        </p>
        <div className="flex flex-col gap-3">
          {relevantDeadlines.map((d, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans font-semibold text-sm text-neutral-950">
                  {d.label}
                </span>
                <span className="font-sans text-xs font-semibold text-amber-600 shrink-0">
                  {d.deadlineDays !== null ? `${d.deadlineDays} days` : 'Per policy terms'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">{d.details}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Fault rule */}
    <div className="pt-4 border-t border-neutral-100 mb-4">
      <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-1">
        Fault Rule
      </p>
      <p className="text-sm text-neutral-700 leading-relaxed">{stateRules.faultRule.summary}</p>
    </div>

    {/* Footer disclaimer */}
    <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-100 pt-3">
      This is general educational information only, not legal advice. Laws change — verify
      deadlines with a licensed attorney in {stateName}.
    </p>
  </div>
)}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: build completes with no errors. `/find-help` should prerender successfully (the route handler is separate and doesn't affect static generation).

- [ ] **Step 6: Commit**

```bash
git add app/find-help/results/page.tsx
git commit -m "feat(results): add state-specific rules card with SOL deadline, deadlines, and fault rule"
```

---

## Task 6: Push and verify

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Verify deployment**

After Vercel deploys:
1. Go to `/find-help` and complete the wizard with a CA accident (Car Accident, date ~6 months ago, Los Angeles, CA)
2. On the results page, confirm the state rules card appears between the urgency banner and lawyer type card
3. Confirm the SOL deadline date is approximately 18 months from now (accident date + 24 months)
4. Confirm SR-1 (10 days), Government Entity (180 days), and UM/UIM deadlines appear
5. Confirm fault rule line reads correctly for California
6. Repeat with AZ accident type — confirm AZ rules card (no SR-1, AZ government entity 180 days)
7. Check Supabase `intake_sessions` table — confirm new row inserted after wizard completion

- [ ] **Step 3: Update session doc**

Update `session_docs/2026-04-23-session-context.md` — mark DEV-14 complete, set DEV-15 as next.
