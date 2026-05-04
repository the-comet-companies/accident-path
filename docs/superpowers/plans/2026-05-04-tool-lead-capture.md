# Tool Lead Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add non-intrusive contact capture to all 11 AccidentPath tools — Pattern A/C: inline mini-form below results; Pattern B: redirect to `/find-help` intake with pre-filled URL params.

**Architecture:** `ToolLeadCapture` component renders below `ToolResults` in `ToolEngine` when a config entry exists for the tool slug. Configs are added one per task so the user can review each tool before proceeding. Pattern B tools get updated `cta.href` in output generators pointing to `/find-help?accidentType=...&state=...`; the intake wizard gains URL param pre-fill via a new `IntakeInitializer` client component. New `/api/tool-lead` route stores to Supabase `tool_leads` + fires n8n webhook for Slack notification in `#ap-lrs`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, Zod, n8n (MCP)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `lib/tools/lead-capture-config.ts` | Create | Config map: slug → hook, fields, TCPA flag, context extractor |
| `components/tools/ToolLeadCapture.tsx` | Create | Pattern A/C inline form (email / phone / city + optional TCPA) |
| `components/tools/ToolEngine.tsx` | Modify | Render ToolLeadCapture after ToolResults (EN only, non-emergency) |
| `components/intake/IntakeInitializer.tsx` | Create | Client component: write URL params to localStorage before wizard mounts |
| `app/(en)/find-help/page.tsx` | Modify | Read searchParams, render IntakeInitializer before wizard |
| `types/tool-lead.ts` | Create | Zod schema for /api/tool-lead request body |
| `app/(en)/api/tool-lead/route.ts` | Create | Validate → Supabase insert → n8n webhook |
| `lib/tools/output-generators.ts` | Modify (×2) | Update CTA href for Lawyer Type Matcher + Settlement Readiness (Pattern B) |
| `.env.local` | Modify | Add N8N_TOOL_LEAD_WEBHOOK_URL |

---

## Task 1: Supabase `tool_leads` Table

**Files:** SQL migration (apply via Supabase MCP `apply_migration` or dashboard SQL editor)

- [ ] **Step 1: Apply migration**

```sql
CREATE TABLE IF NOT EXISTS tool_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tool_slug TEXT NOT NULL,
  pattern TEXT NOT NULL CHECK (pattern IN ('A', 'C')),
  email TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  tool_context JSONB DEFAULT '{}',
  consent BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_tool_leads_tool_slug ON tool_leads(tool_slug);
CREATE INDEX idx_tool_leads_created_at ON tool_leads(created_at DESC);
```

- [ ] **Step 2: Verify**

In Supabase dashboard → Table Editor, confirm `tool_leads` appears with the columns above.

---

## Task 2: Zod Schema + `/api/tool-lead` Route

**Files:**
- Create: `types/tool-lead.ts`
- Create: `app/(en)/api/tool-lead/route.ts`

- [ ] **Step 1: Create `types/tool-lead.ts`**

```typescript
import { z } from 'zod'

export const ToolLeadSchema = z.object({
  toolSlug: z.string(),
  pattern: z.enum(['A', 'C']),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  city: z.string().optional(),
  consent: z.boolean(),
  toolContext: z.record(z.string()).default({}),
})

export type ToolLead = z.infer<typeof ToolLeadSchema>
```

- [ ] **Step 2: Create `app/(en)/api/tool-lead/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { ToolLeadSchema } from '@/types/tool-lead'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ToolLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const data = parsed.data

  const { error } = await getSupabase()
    .from('tool_leads')
    .insert({
      tool_slug: data.toolSlug,
      pattern: data.pattern,
      email: data.email ?? null,
      phone: data.phone ?? null,
      city: data.city ?? null,
      state: data.toolContext?.state ?? null,
      tool_context: data.toolContext,
      consent: data.consent,
    })

  if (error) {
    console.error('Tool lead insert error:', error.message)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  const webhookUrl = process.env.N8N_TOOL_LEAD_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.error('[tool-lead] n8n webhook error:', err))
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add types/tool-lead.ts app/\(en\)/api/tool-lead/route.ts
git commit -m "feat(api): add /api/tool-lead endpoint for tool contact capture"
```

---

## Task 3: n8n Tool-Lead Notification Workflow

**Files:** n8n workflow via MCP (no local file). `.env.local` update.

- [ ] **Step 1: Create n8n workflow via `mcp__n8n-mcp-admin__n8n_create_workflow`**

```json
{
  "name": "accidentpath - tool lead notification",
  "nodes": [
    {
      "id": "tl-webhook",
      "name": "Tool Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [0, 0],
      "webhookId": "accidentpath-tool-lead",
      "parameters": {
        "httpMethod": "POST",
        "path": "accidentpath-tool-lead",
        "options": {}
      }
    },
    {
      "id": "tl-code",
      "name": "Format Message",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [240, 0],
      "parameters": {
        "jsCode": "const body = $input.first().json.body;\n\nconst toolLabels = {\n  'statute-countdown': 'Statute Countdown',\n  'state-next-steps': 'State Next Steps',\n  'evidence-checklist': 'Evidence Checklist',\n  'lost-wages-estimator': 'Lost Wages Estimator',\n  'record-request': 'Record Request',\n  'insurance-call-prep': 'Insurance Call Prep',\n  'injury-journal': 'Injury Journal',\n  'urgency-checker': 'Urgency Checker',\n  'accident-case-quiz': 'Accident Case Quiz',\n};\n\nconst toolLabel = toolLabels[body.toolSlug] || body.toolSlug;\nconst ctx = body.toolContext || {};\n\nconst contextLine = Object.entries(ctx)\n  .filter(([, v]) => v)\n  .map(([k, v]) => `*${k.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase())}:* ${v}`)\n  .join(' | ');\n\nreturn [{\n  json: {\n    toolLabel,\n    email: body.email || 'Not provided',\n    phone: body.phone || 'Not provided',\n    city: body.city ? `\\n*City:* ${body.city}` : '',\n    contextLine,\n  }\n}];"
      }
    },
    {
      "id": "tl-slack",
      "name": "Notify Tool Lead",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.3,
      "position": [480, 0],
      "parameters": {
        "select": "channel",
        "channelId": {
          "__rl": true,
          "value": "C0ATA1QUBRD",
          "mode": "id"
        },
        "text": "=📋 *Tool Lead — {{ $json.toolLabel }}*\n*Email:* {{ $json.email }} | *Phone:* {{ $json.phone }}{{ $json.city }}\n{{ $json.contextLine }}\n*Submitted:* {{ new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles', dateStyle: 'short', timeStyle: 'short'}) }} PT",
        "otherOptions": {}
      },
      "credentials": {
        "slackApi": {
          "id": "OtHOQtNyZ413Arrz",
          "name": "Bot Slack account"
        }
      }
    }
  ],
  "connections": {
    "Tool Lead Webhook": {
      "main": [[{"node": "Format Message", "type": "main", "index": 0}]]
    },
    "Format Message": {
      "main": [[{"node": "Notify Tool Lead", "type": "main", "index": 0}]]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "errorWorkflow": "h5rTMLcZ5VfDXHSN"
  }
}
```

- [ ] **Step 2: Activate the workflow**

Using `mcp__n8n-mcp-admin__n8n_update_partial_workflow` with operation `{"type": "activateWorkflow"}`.

- [ ] **Step 3: Add env var to `.env.local`**

```
N8N_TOOL_LEAD_WEBHOOK_URL=https://n8n-dtla-c914de1950b9.herokuapp.com/webhook/accidentpath-tool-lead
```

Also add to Vercel project env vars.

---

## Task 4: `lib/tools/lead-capture-config.ts`

**Files:**
- Create: `lib/tools/lead-capture-config.ts`

- [ ] **Step 1: Create file**

```typescript
import type { ToolAnswers } from '@/types/tool'

function s(v: ToolAnswers[string] | undefined): string {
  return typeof v === 'string' ? v : ''
}

export interface LeadCaptureConfig {
  hook: string
  buttonLabel: string
  successMessage: string
  fields: Array<'email' | 'phone' | 'city'>
  requiresTcpa: boolean
  getContext: (answers: ToolAnswers) => Record<string, string>
}

// Tool configs are added one per task (Tasks 8–18).
// ToolEngine renders ToolLeadCapture only when a slug has an entry here.
export const TOOL_LEAD_CONFIGS: Partial<Record<string, LeadCaptureConfig>> = {}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): scaffold lead-capture-config (empty — configs added per tool task)"
```

---

## Task 5: `ToolLeadCapture` Component

**Files:**
- Create: `components/tools/ToolLeadCapture.tsx`

- [ ] **Step 1: Create component**

```tsx
'use client'

import { useState } from 'react'
import type { LeadCaptureConfig } from '@/lib/tools/lead-capture-config'

interface Props {
  toolSlug: string
  config: LeadCaptureConfig
  toolContext: Record<string, string>
}

export function ToolLeadCapture({ toolSlug, config, toolContext }: Props) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [consent, setConsent] = useState(false)
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
          pattern: config.fields.includes('city') ? 'C' : 'A',
          email: config.fields.includes('email') ? email : undefined,
          phone: config.fields.includes('phone') ? phone : undefined,
          city: config.fields.includes('city') ? city : undefined,
          consent: config.requiresTcpa ? consent : true,
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
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center print:hidden">
        <p className="text-sm font-medium text-green-800">{config.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-5 print:hidden">
      <p className="mb-3 text-sm font-semibold text-primary-900">{config.hook}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {config.fields.includes('email') && (
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        )}
        {config.fields.includes('phone') && (
          <input
            type="tel"
            required
            placeholder="Your phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        )}
        {config.fields.includes('city') && (
          <input
            type="text"
            required
            placeholder="Your city (e.g. Los Angeles)"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        )}
        {config.requiresTcpa && (
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0 accent-primary-600"
            />
            <span className="text-xs text-neutral-600">
              By submitting, I consent to receive calls, texts, and emails from AccidentPath
              regarding my inquiry.{' '}
              <a href="/privacy" className="underline hover:text-primary-700">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        )}
        <button
          type="submit"
          disabled={status === 'loading' || (config.requiresTcpa && !consent)}
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {status === 'loading' ? 'Sending…' : config.buttonLabel}
        </button>
        {status === 'error' && (
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/tools/ToolLeadCapture.tsx
git commit -m "feat(tools): add ToolLeadCapture component for Pattern A/C inline forms"
```

---

## Task 6: Update `ToolEngine` to Render `ToolLeadCapture`

**Files:**
- Modify: `components/tools/ToolEngine.tsx`

- [ ] **Step 1: Add imports** (after existing imports at top of file)

```typescript
import { TOOL_LEAD_CONFIGS } from '@/lib/tools/lead-capture-config'
import { ToolLeadCapture } from '@/components/tools/ToolLeadCapture'
```

- [ ] **Step 2: Update the `if (output)` return block** (currently lines 119–139)

Replace the existing block:

```tsx
if (output) {
  return (
    <div className="flex flex-col gap-6">
      {output.emergency && (
        <div className="rounded-xl border-2 border-danger-500 bg-danger-50 p-4 flex items-start gap-3">
          <span className="text-danger-500 text-xl leading-none mt-0.5">⚠</span>
          <div>
            <p className="font-sans font-bold text-danger-700 text-sm">If you are in immediate danger, call 911 now.</p>
            <p className="font-sans text-danger-700 text-sm mt-1">The symptoms you reported may indicate a serious or life-threatening condition. Please seek emergency medical care immediately.</p>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>
      <ToolResults output={output} onReset={handleReset} strings={strings} />
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>
    </div>
  )
}
```

With:

```tsx
if (output) {
  const captureConfig =
    !pathname.startsWith('/es/') && !output.emergency
      ? TOOL_LEAD_CONFIGS[tool.slug]
      : undefined

  return (
    <div className="flex flex-col gap-6">
      {output.emergency && (
        <div className="rounded-xl border-2 border-danger-500 bg-danger-50 p-4 flex items-start gap-3">
          <span className="text-danger-500 text-xl leading-none mt-0.5">⚠</span>
          <div>
            <p className="font-sans font-bold text-danger-700 text-sm">If you are in immediate danger, call 911 now.</p>
            <p className="font-sans text-danger-700 text-sm mt-1">The symptoms you reported may indicate a serious or life-threatening condition. Please seek emergency medical care immediately.</p>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>
      <ToolResults output={output} onReset={handleReset} strings={strings} />
      {captureConfig && (
        <ToolLeadCapture
          toolSlug={tool.slug}
          config={captureConfig}
          toolContext={captureConfig.getContext(answers)}
        />
      )}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/tools/ToolEngine.tsx
git commit -m "feat(tools): wire ToolLeadCapture into ToolEngine output view"
```

---

## Task 7: Intake Wizard URL Param Pre-fill (Pattern B Foundation)

**Files:**
- Create: `components/intake/IntakeInitializer.tsx`
- Modify: `app/(en)/find-help/page.tsx`

- [ ] **Step 1: Identify the intake localStorage key**

Open `components/intake/IntakeWizard.tsx`. Search for `localStorage.getItem` or `localStorage.setItem`. Note the exact key string (e.g. `'accidentpath_intake'`). Use that exact string in the next step.

- [ ] **Step 2: Create `components/intake/IntakeInitializer.tsx`**

Replace `'accidentpath_intake'` below with the key you found in Step 1 if different.

```tsx
'use client'

import { useEffect } from 'react'

const INTAKE_KEY = 'accidentpath_intake'

export function IntakeInitializer({
  accidentType,
  state,
}: {
  accidentType?: string
  state?: string
}) {
  useEffect(() => {
    if (!accidentType && !state) return
    const existing = localStorage.getItem(INTAKE_KEY)
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as Record<string, unknown>
        if (parsed?.accidentType || parsed?.state) return
      } catch {
        // corrupt storage — proceed with pre-fill
      }
    }
    const prefill: Record<string, string> = {}
    if (accidentType) prefill.accidentType = accidentType
    if (state) prefill.state = state
    localStorage.setItem(INTAKE_KEY, JSON.stringify(prefill))
  }, [accidentType, state])

  return null
}
```

- [ ] **Step 3: Update `app/(en)/find-help/page.tsx`**

Open the file. It is a server component (no `'use client'`). Add `searchParams` to the page props and render `IntakeInitializer` before existing content.

The exact change depends on the current file shape. The pattern to apply is:

```tsx
import { IntakeInitializer } from '@/components/intake/IntakeInitializer'

export default function FindHelpPage({
  searchParams,
}: {
  searchParams: { accidentType?: string; state?: string }
}) {
  return (
    <>
      <IntakeInitializer
        accidentType={searchParams.accidentType}
        state={searchParams.state}
      />
      {/* All existing JSX below — do not remove anything */}
    </>
  )
}
```

If the page already has a return with a wrapper element, add `<IntakeInitializer>` as the first child inside it rather than introducing a new fragment.

- [ ] **Step 4: Test pre-fill manually**

Start dev server. Navigate to `http://localhost:3000/find-help?accidentType=car-accident&state=CA`. Open browser DevTools → Application → Local Storage. Confirm the intake key contains `{"accidentType":"car-accident","state":"CA"}`. Reload page. Confirm the intake wizard step 1 shows "Car Accident" pre-selected (the wizard must read from localStorage on mount for this to work — if it doesn't, note it but the Pattern B redirect still improves the CTA text).

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/intake/IntakeInitializer.tsx app/\(en\)/find-help/page.tsx
git commit -m "feat(intake): add URL param pre-fill support for Pattern B tool redirects"
```

---

## Task 8: Tool 1 — Statute Countdown (Pattern A — Phone)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs (from `output-generators.ts`): `accident-date`, `accident-type`, `state`

- [ ] **Step 1: Add config entry to `TOOL_LEAD_CONFIGS`**

```typescript
'statute-countdown': {
  hook: 'Get a text reminder before your deadline expires.',
  buttonLabel: 'Text Me a Reminder',
  successMessage: "Got it — we'll remind you 30 days before your filing deadline.",
  fields: ['phone'],
  requiresTcpa: true,
  getContext: (answers) => ({
    state: s(answers['state']),
    accidentType: s(answers['accident-type']).replace(/-/g, ' '),
    accidentDate: s(answers['accident-date']),
  }),
},
```

- [ ] **Step 2: Start dev server and test**

```bash
npm run dev
```

Go to `http://localhost:3000/tools/statute-countdown`. Complete all steps. Confirm:
1. ToolLeadCapture appears below results with "Get a text reminder before your deadline expires."
2. Phone field + TCPA checkbox visible
3. Submitting shows "Sending…" then success message
4. Slack `#ap-lrs` receives: `📋 Tool Lead — Statute Countdown` with the context fields
5. `tool_leads` table has a new row in Supabase

**→ User reviews UI/UX and approves before continuing**

- [ ] **Step 3: Commit after approval**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to statute-countdown (Pattern A — phone)"
```

---

## Task 9: Tool 2 — Lawyer Type Matcher (Pattern B — Intake Redirect)

**Files:** Modify `lib/tools/output-generators.ts`

Step IDs: `accident-type`, `state` (already in local vars `accType` and `state`)

- [ ] **Step 1: Update CTA in `lawyerTypeMatcher` generator**

In `lib/tools/output-generators.ts`, find the `return` at the bottom of the `lawyerTypeMatcher` function (around line 872). Change:

```typescript
cta: { label: 'Connect with an Attorney', href: '/contact' },
```

To:

```typescript
cta: {
  label: 'Find an Attorney for My Case',
  href: `/find-help?${new URLSearchParams({
    ...(accType ? { accidentType: accType } : {}),
    ...(state ? { state } : {}),
  }).toString()}`,
},
```

- [ ] **Step 2: Test**

Go to `http://localhost:3000/tools/lawyer-type-matcher`. Complete all steps. Click the CTA button. Confirm:
1. URL navigates to `/find-help?accidentType=car-accident&state=CA` (matching your selections)
2. Intake wizard step 1 shows accident type pre-selected (if localStorage pre-fill works)

**→ User reviews and approves**

- [ ] **Step 3: Commit after approval**

```bash
git add lib/tools/output-generators.ts
git commit -m "feat(tools): update lawyer-type-matcher CTA to /find-help with pre-filled params (Pattern B)"
```

---

## Task 10: Tool 3 — Evidence Checklist (Pattern A — Email)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `accident-type`, `location-type`

- [ ] **Step 1: Add config entry**

```typescript
'evidence-checklist': {
  hook: "Email me this checklist so I don't lose it.",
  buttonLabel: 'Email Me the Checklist',
  successMessage: 'Check your inbox — your evidence checklist is on the way.',
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    accidentType: s(answers['accident-type']).replace(/-/g, ' '),
    locationType: s(answers['location-type']).replace(/-/g, ' '),
  }),
},
```

- [ ] **Step 2: Test at `http://localhost:3000/tools/evidence-checklist`**

Confirm form appears (email only, no TCPA), submit works, Slack notification fires.

**→ User reviews and approves**

- [ ] **Step 3: Commit after approval**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to evidence-checklist (Pattern A — email)"
```

---

## Task 11: Tool 4 — Settlement Readiness (Pattern B — Intake Redirect)

**Files:** Modify `lib/tools/output-generators.ts`

Note: This tool has no accident type or state inputs, so no URL params can be pre-filled — the CTA just goes to `/find-help`.

- [ ] **Step 1: Update CTA in `settlementReadiness` generator**

Find the `return` at the bottom of `settlementReadiness` (around line 784). Change:

```typescript
cta: { label: 'Connect with an Attorney', href: '/contact' },
```

To:

```typescript
cta: { label: 'Start My Free Case Review', href: '/find-help' },
```

- [ ] **Step 2: Test at `http://localhost:3000/tools/settlement-readiness`**

Confirm CTA button now says "Start My Free Case Review" and navigates to `/find-help`.

**→ User reviews and approves**

- [ ] **Step 3: Commit after approval**

```bash
git add lib/tools/output-generators.ts
git commit -m "feat(tools): update settlement-readiness CTA to /find-help (Pattern B)"
```

---

## Task 12: Tool 5 — State Next Steps (Pattern A — Email)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `state`, `accident-type`, `accident-date`

- [ ] **Step 1: Add config entry**

```typescript
'state-next-steps': {
  hook: 'Email me these deadlines so I have them for reference.',
  buttonLabel: 'Email Me My Deadlines',
  successMessage: 'Check your inbox — your state-specific deadlines are on the way.',
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    state: s(answers['state']),
    accidentType: s(answers['accident-type']).replace(/-/g, ' '),
    accidentDate: s(answers['accident-date']),
  }),
},
```

- [ ] **Step 2: Test → Commit after user approves**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to state-next-steps (Pattern A — email)"
```

---

## Task 13: Tool 6 — Lost Wages Estimator (Pattern A — Email)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `employment-type`, `days-missed`, `ongoing`

- [ ] **Step 1: Add config entry**

```typescript
'lost-wages-estimator': {
  hook: 'Email me this estimate and the documentation checklist.',
  buttonLabel: 'Email Me My Estimate',
  successMessage: 'Check your inbox — your wage loss estimate and documentation checklist are on the way.',
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    employmentType: s(answers['employment-type']).replace(/-/g, ' '),
    daysMissed: String(answers['days-missed'] ?? ''),
    ongoingLoss: s(answers['ongoing']).replace(/-/g, ' '),
  }),
},
```

- [ ] **Step 2: Test → Commit after user approves**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to lost-wages-estimator (Pattern A — email)"
```

---

## Task 14: Tool 7 — Record Request (Pattern A — Email)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `accident-type`, `records-needed`

- [ ] **Step 1: Add config entry**

```typescript
'record-request': {
  hook: 'Email me this checklist so I have it when I start making calls.',
  buttonLabel: 'Email Me the Checklist',
  successMessage: 'Check your inbox — your record request checklist is on the way.',
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    accidentType: s(answers['accident-type']).replace(/-/g, ' '),
    recordsNeeded: Array.isArray(answers['records-needed'])
      ? (answers['records-needed'] as string[]).map(r => r.replace(/-/g, ' ')).join(', ')
      : '',
  }),
},
```

- [ ] **Step 2: Test → Commit after user approves**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to record-request (Pattern A — email)"
```

---

## Task 15: Tool 8 — Accident Case Quiz (Pattern C — City + Phone)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `accident-type`, `timeline`, `injuries`

- [ ] **Step 1: Add config entry**

```typescript
'accident-case-quiz': {
  hook: 'Get personalized next steps for your case in your city.',
  buttonLabel: 'Get My Personalized Steps',
  successMessage: "We'll be in touch shortly with next steps tailored to your situation.",
  fields: ['city', 'phone'],
  requiresTcpa: true,
  getContext: (answers) => ({
    accidentType: s(answers['accident-type']).replace(/-/g, ' '),
    timeline: s(answers['timeline']).replace(/-/g, ' '),
    injuries: Array.isArray(answers['injuries'])
      ? (answers['injuries'] as string[]).map(i => i.replace(/-/g, ' ')).join(', ')
      : '',
  }),
},
```

- [ ] **Step 2: Test at `http://localhost:3000/tools/accident-case-quiz`**

Confirm city + phone fields both appear, TCPA checkbox present, submit works.

**→ User reviews and approves**

- [ ] **Step 3: Commit after approval**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to accident-case-quiz (Pattern C — city + phone)"
```

---

## Task 16: Tool 9 — Insurance Call Prep (Pattern A — Phone)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `caller-type`, `call-purpose`

- [ ] **Step 1: Add config entry**

```typescript
'insurance-call-prep': {
  hook: 'Text me this script so I have it during the call.',
  buttonLabel: 'Text Me the Script',
  successMessage: 'Script sent — check your texts before the call.',
  fields: ['phone'],
  requiresTcpa: true,
  getContext: (answers) => ({
    callerType: s(answers['caller-type']).replace(/-/g, ' '),
    callPurpose: s(answers['call-purpose']).replace(/-/g, ' '),
  }),
},
```

- [ ] **Step 2: Test → Commit after user approves**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to insurance-call-prep (Pattern A — phone)"
```

---

## Task 17: Tool 10 — Injury Journal (Pattern A — Email)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `injury-type`, `pain-level`

- [ ] **Step 1: Add config entry**

```typescript
'injury-journal': {
  hook: "Email me today's entry to keep a record.",
  buttonLabel: 'Email Me This Entry',
  successMessage: "Today's journal entry has been emailed to you.",
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    painLevel: String(answers['pain-level'] ?? ''),
    injuries: Array.isArray(answers['injury-type'])
      ? (answers['injury-type'] as string[]).map(i => i.replace(/-/g, ' ')).join(', ')
      : '',
  }),
},
```

- [ ] **Step 2: Test → Commit after user approves**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to injury-journal (Pattern A — email)"
```

---

## Task 18: Tool 11 — Urgency Checker (Pattern A — Email, Conditional)

**Files:** Modify `lib/tools/lead-capture-config.ts`

Step IDs: `symptoms`, `seen-doctor`, `when`

**Special rule:** ToolLeadCapture is already suppressed when `output.emergency === true` (RED tier) by the guard in Task 6. No extra logic needed here — just adding the config is sufficient.

- [ ] **Step 1: Add config entry**

```typescript
'urgency-checker': {
  hook: 'Email me my symptom summary to bring to the doctor.',
  buttonLabel: 'Email Me My Summary',
  successMessage: 'Check your inbox — your symptom summary is on the way.',
  fields: ['email'],
  requiresTcpa: false,
  getContext: (answers) => ({
    seenDoctor: s(answers['seen-doctor']).replace(/-/g, ' '),
    when: s(answers['when']).replace(/-/g, ' '),
    symptoms: Array.isArray(answers['symptoms'])
      ? (answers['symptoms'] as string[]).map(sym => sym.replace(/-/g, ' ')).join(', ')
      : '',
  }),
},
```

- [ ] **Step 2: Test RED tier — form must NOT appear**

Select red-flag symptoms (e.g. "loss of consciousness"). Verify: emergency banner appears, no ToolLeadCapture form shows.

- [ ] **Step 3: Test YELLOW/GREEN tier — form must appear**

Reset. Select non-red symptoms (e.g. "severe headache" only). Verify: ToolLeadCapture appears with email field and no TCPA checkbox.

**→ User reviews and approves**

- [ ] **Step 4: Commit after approval**

```bash
git add lib/tools/lead-capture-config.ts
git commit -m "feat(tools): add lead capture to urgency-checker (Pattern A — email, RED tier excluded)"
```

---

## Final Push

After all 18 tasks are complete and approved:

```bash
git push origin main && git push origin main:staging
```
