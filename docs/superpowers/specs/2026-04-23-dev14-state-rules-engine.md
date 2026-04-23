# DEV-14: State Rules Engine (CA+AZ) + Find-Help Flow + Server Action

**Date:** 2026-04-23
**Task:** DEV-14
**Approach:** A — Static typed map + Route Handler

---

## Overview

Three additions that work together:

1. `lib/state-rules.ts` — typed CA/AZ legal rules data + `getRelevantDeadlines()` filter helper
2. `app/api/intake/route.ts` — POST Route Handler that validates + inserts intake submissions server-side
3. `/find-help/results` state rules card — surfaces personalized state-specific deadlines, fault rule, and SOL calculation to the user

---

## 1. Types — `types/state-rules.ts` (new)

```ts
interface ReportingDeadline {
  accidentTypes: string[]  // empty array = applies to all accident types
  label: string
  deadlineDays: number | null  // null = "per policy terms" (e.g. UM/UIM)
  details: string
}

interface StateRules {
  sol: {
    personalInjury: number   // months
    propertyDamage: number
    wrongfulDeath: number
  }
  faultRule: {
    type: 'pure_comparative'
    summary: string          // one-sentence plain-English description
  }
  insuranceMinimums: {
    perPerson: string        // formatted string e.g. "$15,000"
    perAccident: string
    propertyDamage: string
  }
  reportingDeadlines: ReportingDeadline[]
}
```

---

## 2. State Rules Data — `lib/state-rules.ts` (new)

### Exports

**`STATE_RULES: Record<'CA' | 'AZ', StateRules>`**

CA rules:
- SOL: personalInjury 24mo, propertyDamage 36mo, wrongfulDeath 24mo
- Fault: pure comparative (Li v. Yellow Cab Co., 1975)
- Insurance minimums: $15,000 / $30,000 / $5,000
- Reporting deadlines:
  - SR-1 report: accidentTypes `['Car Accident', 'Truck Accident', 'Motorcycle Crash', 'Bicycle Accident', 'Pedestrian Accident']`, 10 days, required for injury/death/damage >$1,000
  - Government entity claim: accidentTypes `[]` (all), 180 days, hard bar to recovery if missed
  - Workers' comp notice: accidentTypes `['Workplace Injury']`, 30 days to employer + 365 days to file
  - UM/UIM claim: accidentTypes `['Car Accident', 'Truck Accident', 'Motorcycle Crash']`, null days, per policy terms

AZ rules:
- SOL: personalInjury 24mo, propertyDamage 24mo, wrongfulDeath 24mo
- Fault: pure comparative (no threshold bar to recovery)
- Insurance minimums: $25,000 / $50,000 / $15,000
- Reporting deadlines:
  - Government entity claim: accidentTypes `[]` (all), 180 days, pre-suit notice required
  - Workers' comp notice: accidentTypes `['Workplace Injury']`, 1 year to file
  - UM/UIM claim: accidentTypes `['Car Accident', 'Truck Accident', 'Motorcycle Crash']`, null days, per policy terms

**`getRelevantDeadlines(state: 'CA' | 'AZ', accidentType: string): ReportingDeadline[]`**

Filters `STATE_RULES[state].reportingDeadlines` — returns deadlines where `accidentTypes` is empty (applies to all) OR includes the given `accidentType`. Capped at 3 results.

---

## 3. Route Handler — `app/api/intake/route.ts` (new)

POST only. No GET handler.

**Flow:**
```
parse request.json()
  → IntakeFormSchema.safeParse(body)
    → fail: return 400 { error: 'Invalid submission', details: zod.errors }
    → pass: getSupabase().from('intake_sessions').insert({ ...mapped columns })
      → supabase error: return 500 { error: 'Submission failed' }
      → success: return 200 { success: true }
```

**Column mapping** (same as current IntakeWizard.tsx):
```ts
{
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
}
```

**Supabase:** continues using `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` via `getSupabase()`. No service key needed — RLS handles row-level security.

---

## 4. IntakeWizard.tsx — edit

In `handleSubmit`, replace the `getSupabase().from(...)` block with:

```ts
await fetch('/api/intake', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...data,
    urgencyFactors: computeUrgencyFactors(data),
  }),
})
```

Error handling stays the same — swallowed in try/catch so user flow is never blocked. Remove the `getSupabase` import from IntakeWizard.tsx (no longer needed client-side).

---

## 5. `/find-help/results` — State Rules Card (edit)

Added between the urgency banner and the lawyer type card.

**Rendered from:** `STATE_RULES[data.state]` + `getRelevantDeadlines(data.state, data.accidentType)` — both are pure synchronous calls, no loading state needed.

**Card contents:**

### SOL Deadline Block
Only rendered if `data.accidentDate` is present.
- Calculates: `new Date(accidentDate)` + 24 months → formatted as "Month D, YYYY"
- Copy: *"In [State], the general personal injury deadline is 2 years from your accident date. Based on what you told us, that's approximately [calculated date]."*
- Disclaimer line: *"Deadlines vary based on your specific circumstances — consult an attorney to confirm yours."*

### Reporting Deadlines Block
Renders each result from `getRelevantDeadlines()` as a row:
- Label (bold) + deadline (`${deadlineDays} days` or "Per policy terms" if null)
- Details line in smaller text

### Fault Rule Block
One line from `stateRules.faultRule.summary`.

**Card header:** amber eyebrow "State-Specific Information" with state abbreviation badge (CA or AZ).

**Card footer disclaimer:** *"This is general educational information only, not legal advice. Laws change — verify deadlines with a licensed attorney in [State]."*

**Only rendered** if `data.state` is `'CA'` or `'AZ'` (guards against missing/corrupt localStorage data).

---

## File Changeset

| File | Action | Notes |
|------|--------|-------|
| `types/state-rules.ts` | New | `ReportingDeadline`, `StateRules` interfaces |
| `lib/state-rules.ts` | New | `STATE_RULES` const + `getRelevantDeadlines()` |
| `app/api/intake/route.ts` | New | POST handler — validate + insert |
| `components/intake/IntakeWizard.tsx` | Edit | Swap Supabase call → fetch('/api/intake') |
| `app/find-help/results/page.tsx` | Edit | Add state rules card |

5 files total. No changes to `lib/intake.ts`, step components, `/find-help/page.tsx`, or `/find-help/thank-you/page.tsx`.

---

## What This Does NOT Include

- Email sending on submission (thank-you page copy about email is aspirational — no email service is wired up yet)
- Service role key for Supabase — anon key + RLS is sufficient for now
- Additional city-level routing logic — state-level rules are sufficient for DEV-14
- Changes to urgency scoring algorithm — the state rules card and urgency banner work side-by-side
