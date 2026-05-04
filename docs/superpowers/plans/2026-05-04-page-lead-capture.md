# Page Lead Capture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add contextual email capture blocks to every content page type (home, accidents, injuries, states, guides) feeding the existing `/api/tool-lead` → Supabase → Slack `#ap-lrs` pipeline.

**Architecture:** One reusable `PageLeadCapture` client component (email-only) configured per callsite via props. State pages get a second `SolLeadCapture` component that computes the SOL deadline from an accident date before revealing the email field. All submissions POST to the existing `/api/tool-lead` endpoint with `tool_slug` prefixed `page-` — no schema changes.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, existing `/api/tool-lead` endpoint, Zod-validated `ToolLeadSchema`.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `components/ui/PageLeadCapture.tsx` | Email-only capture block, reused on all content pages |
| Create | `components/ui/SolLeadCapture.tsx` | SOL calculator + email capture for state pages |
| Modify | `app/(en)/page.tsx` | Email strip between section 4 and section 5 |
| Modify | `app/(en)/accidents/[slug]/page.tsx` | Capture after "Immediate Steps" section |
| Modify | `app/(en)/injuries/[slug]/page.tsx` | Capture after "Symptoms" section |
| Modify | `app/(en)/states/[state]/page.tsx` | SolLeadCapture after "Statute of Limitations" section |
| Modify | `app/(en)/guides/[slug]/page.tsx` | Capture before the final CTAButton |

---

## Checkpoint 1 — PageLeadCapture component + home page

### Task 1: Create `components/ui/PageLeadCapture.tsx`

**Files:**
- Create: `components/ui/PageLeadCapture.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  headline: string
  subtext: string
  buttonLabel: string
  toolSlug: string
  toolContext?: Record<string, string>
}

const INPUT_CLASS =
  'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

export function PageLeadCapture({
  headline,
  subtext,
  buttonLabel,
  toolSlug,
  toolContext = {},
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          pattern: 'A',
          email,
          consent: true,
          toolContext,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="text-sm font-semibold text-green-800">Got it — check your inbox shortly.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-6">
      <p className="font-sans font-semibold text-primary-900 text-base mb-1">{headline}</p>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">{subtext}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor={`plc-email-${toolSlug}`}>
          Email address
        </label>
        <input
          id={`plc-email-${toolSlug}`}
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`${INPUT_CLASS} flex-1`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-400">
        By submitting, you agree to our{' '}
        <Link href="/privacy" className="underline hover:text-neutral-600">
          Privacy Policy
        </Link>
        .
      </p>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/PageLeadCapture.tsx
git commit -m "feat(lead): add PageLeadCapture component"
```

---

### Task 2: Add email strip to home page

**Files:**
- Modify: `app/(en)/page.tsx` — insert between `</section>` (end of section 4, ~line 371) and `{/* ── 5. Featured Tools */}` (~line 373)

- [ ] **Step 1: Add import at top of `app/(en)/page.tsx`**

Find the import block and add:
```tsx
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
```

- [ ] **Step 2: Insert email strip section between section 4 and section 5**

Find this comment in `app/(en)/page.tsx`:
```tsx
      {/* ── 5. Featured Tools ─────────────────────────────────────────────── */}
```

Insert immediately before it:
```tsx
      {/* ── 4.5. Email Capture Strip ─────────────────────────────────────── */}
      <section className="bg-surface-page py-12 border-t border-neutral-100" aria-label="Email signup">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageLeadCapture
            headline="Get our free accident recovery guide"
            subtext="Know what to do, what to document, and when to act."
            buttonLabel="Send Me the Guide"
            toolSlug="page-home"
            toolContext={{ source: 'home' }}
          />
        </div>
      </section>

```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test in browser**

Run `npm run dev`. Visit `http://localhost:3000`. Scroll to the email strip between the Accident Types section and the Featured Tools section. Verify:
- Strip renders with correct headline, subtext, and button
- Entering an email and submitting shows green success state
- Check Slack `#ap-lrs` for a notification with `tool_slug: page-home`

- [ ] **Step 5: Commit**

```bash
git add app/\(en\)/page.tsx
git commit -m "feat(lead): add email capture strip to home page"
```

---

## Checkpoint 2 — Accident pages

### Task 3: Add PageLeadCapture to accident detail page

**Files:**
- Modify: `app/(en)/accidents/[slug]/page.tsx`

- [ ] **Step 1: Add import**

In `app/(en)/accidents/[slug]/page.tsx`, add to the import block:
```tsx
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
```

- [ ] **Step 2: Insert capture block after "Immediate Steps" section**

In the main column (`<div className="flex flex-col gap-14">`), find the closing tag of the "Immediate Steps" section:
```tsx
              </section>

              {/* Evidence Checklist */}
```

Insert between them:
```tsx
              <PageLeadCapture
                headline={`Get the ${accident.title} checklist emailed to you`}
                subtext="A quick reference for what to document, report, and do next."
                buttonLabel="Email Me the Checklist"
                toolSlug={`page-accident-${accident.slug}`}
                toolContext={{ accidentType: accident.title }}
              />

```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test in browser**

Visit `http://localhost:3000/accidents/car-accident`. Verify:
- Capture block appears between "What To Do Immediately" and "Evidence Checklist"
- Headline reads "Get the Car Accident checklist emailed to you"
- Submit a test email — green success state appears
- Check Slack `#ap-lrs` for notification with `tool_slug: page-accident-car-accident` and `accidentType: Car Accident`

- [ ] **Step 5: Commit**

```bash
git add app/\(en\)/accidents/\[slug\]/page.tsx
git commit -m "feat(lead): add email capture to accident pages"
```

---

## Checkpoint 3 — Injury pages

### Task 4: Add PageLeadCapture to injury detail page

**Files:**
- Modify: `app/(en)/injuries/[slug]/page.tsx`

- [ ] **Step 1: Add import**

In `app/(en)/injuries/[slug]/page.tsx`, add to the import block:
```tsx
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
```

- [ ] **Step 2: Insert capture block after "Symptoms" section**

In the main column, find the closing tag of the "Symptoms" section:
```tsx
              </section>

              {/* Long-term effects */}
```

Insert between them:
```tsx
              <PageLeadCapture
                headline={`Get a ${injury.title} symptom & documentation guide`}
                subtext="Know what to track, when to see a doctor, and what insurers look for."
                buttonLabel="Email Me the Guide"
                toolSlug={`page-injury-${injury.slug}`}
                toolContext={{ injuryType: injury.title }}
              />

```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test in browser**

Visit `http://localhost:3000/injuries/whiplash`. Verify:
- Capture block appears between "Symptoms to Watch For" and "Potential Long-Term Effects"
- Headline reads "Get a Whiplash symptom & documentation guide"
- Submit a test email — green success state
- Check Slack `#ap-lrs` for notification with `tool_slug: page-injury-whiplash`

- [ ] **Step 5: Commit**

```bash
git add app/\(en\)/injuries/\[slug\]/page.tsx
git commit -m "feat(lead): add email capture to injury pages"
```

---

## Checkpoint 4 — State pages + SolLeadCapture

### Task 5: Create `components/ui/SolLeadCapture.tsx`

**Files:**
- Create: `components/ui/SolLeadCapture.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  stateAbbr: string
  stateName: string
  solMonths: number
}

const INPUT_CLASS =
  'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

function computeDeadline(accidentDate: string, solMonths: number): string {
  const [y, m, d] = accidentDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setMonth(date.getMonth() + solMonths)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function SolLeadCapture({ stateAbbr, stateName, solMonths }: Props) {
  const [accidentDate, setAccidentDate] = useState('')
  const [email, setEmail] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setAccidentDate(val)
    setDeadline(val ? computeDeadline(val, solMonths) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: `page-state-${stateAbbr.toLowerCase()}`,
          pattern: 'A',
          email,
          consent: true,
          toolContext: {
            state: stateAbbr,
            accidentDate,
            solDeadline: deadline ?? '',
          },
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="text-sm font-semibold text-green-800">
          Got it — check your inbox for your deadline reminder.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-6">
      <p className="font-sans font-semibold text-primary-900 text-base mb-1">
        Know your {stateName} filing deadline
      </p>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">
        Enter your accident date to calculate your personal injury deadline, then get it emailed to you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-700">Accident date</span>
          <input
            type="date"
            required
            value={accidentDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className={INPUT_CLASS}
          />
        </label>
        {deadline && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
              Your estimated deadline
            </p>
            <p className="font-sans font-bold text-neutral-950 text-base">{deadline}</p>
            <p className="text-xs text-neutral-500 mt-1">
              General {solMonths / 12}-year limit for personal injury in {stateName}. Verify with an attorney.
            </p>
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-700">Email address</span>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </label>
        <button
          type="submit"
          disabled={status === 'loading' || !deadline}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Email Me My Deadline'}
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-400">
        By submitting, you agree to our{' '}
        <Link href="/privacy" className="underline hover:text-neutral-600">
          Privacy Policy
        </Link>
        . Deadline estimates are for educational purposes only.
      </p>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SolLeadCapture.tsx
git commit -m "feat(lead): add SolLeadCapture component for state pages"
```

---

### Task 6: Add SolLeadCapture to state page

**Files:**
- Modify: `app/(en)/states/[state]/page.tsx`

- [ ] **Step 1: Add imports**

In `app/(en)/states/[state]/page.tsx`, add to the import block:
```tsx
import { STATE_RULES } from '@/lib/state-rules'
import { SolLeadCapture } from '@/components/ui/SolLeadCapture'
```

- [ ] **Step 2: Compute stateRules before the return**

In `StateDetailPage`, after `const cities = cms.getCitiesByState(state)`, add:
```tsx
  const stateAbbr = stateData.abbreviation as 'CA' | 'AZ'
  const stateRules = STATE_RULES[stateAbbr] ?? null
```

- [ ] **Step 3: Insert SolLeadCapture after the Statute of Limitations section**

In the main column, find the closing tag of the SOL section:
```tsx
              </section>

              {/* Fault rule */}
```

Insert between them:
```tsx
              {stateRules && (
                <SolLeadCapture
                  stateAbbr={stateAbbr}
                  stateName={stateData.name}
                  solMonths={stateRules.sol.personalInjury}
                />
              )}

```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Test in browser**

Visit `http://localhost:3000/states/ca`. Verify:
- SolLeadCapture appears between "Statute of Limitations" and "Fault Rule" sections
- Selecting an accident date (e.g. 2024-01-15) shows deadline box: "January 15, 2026"
- The deadline box shows "General 2-year limit for personal injury in California. Verify with an attorney."
- Email button is disabled until a date is selected
- Submit a test email — green success state
- Check Slack `#ap-lrs` for notification with `tool_slug: page-state-ca`, `state: CA`, `solDeadline` present

Also visit `http://localhost:3000/states/az` — verify it works for Arizona too.

- [ ] **Step 6: Commit**

```bash
git add app/\(en\)/states/\[state\]/page.tsx
git commit -m "feat(lead): add SOL deadline calculator + email capture to state pages"
```

---

## Checkpoint 5 — Guide pages

### Task 7: Add PageLeadCapture to guide detail page

**Files:**
- Modify: `app/(en)/guides/[slug]/page.tsx`

- [ ] **Step 1: Add import**

In `app/(en)/guides/[slug]/page.tsx`, add to the import block:
```tsx
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
```

- [ ] **Step 2: Insert capture block before the final CTAButton**

In the main column, find:
```tsx
              <CTAButton href="/find-help" size="md">
                Get Free Guidance
              </CTAButton>
```

Insert immediately before it:
```tsx
              <PageLeadCapture
                headline="Want this guide emailed to you?"
                subtext="Save it for reference — especially useful in the days after an accident."
                buttonLabel="Email Me This Guide"
                toolSlug={`page-guide-${guide.slug}`}
                toolContext={{ guideTitle: guide.title }}
              />

```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test in browser**

Visit any guide page (e.g. `http://localhost:3000/guides/what-to-do-after-car-accident`). Verify:
- Capture block appears above the "Get Free Guidance" button at the end of the guide
- Submit a test email — green success state
- Check Slack `#ap-lrs` for notification with `tool_slug: page-guide-what-to-do-after-car-accident` and `guideTitle` present

- [ ] **Step 5: Commit**

```bash
git add app/\(en\)/guides/\[slug\]/page.tsx
git commit -m "feat(lead): add email capture to guide pages"
```

---

## Self-Review Notes

- `page-` prefix on `tool_slug` distinguishes page leads from tool leads in Supabase — no schema change needed
- `SolLeadCapture` button stays disabled until a date is selected — prevents submitting without a computed deadline
- `STATE_RULES[stateAbbr] ?? null` guard means future states without rules silently skip the component
- No TCPA checkbox — email-only capture with privacy policy link satisfies CAN-SPAM; no phone = no TCPA requirement
- All components are `'use client'` — safe to import from server page components
