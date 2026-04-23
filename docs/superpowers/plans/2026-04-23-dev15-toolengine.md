# DEV-15: ToolEngine Live Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Launching soon" placeholder in `ToolEngine.tsx` with a fully interactive step-by-step wizard that renders all 11 tools, collects answers, generates output, and saves completions to Supabase `tool_submissions`.

**Architecture:** Shared `ToolEngine` (state machine) + `ToolStep` (per-type renderers) + `ToolResults` (output display). Each tool's logic lives in `lib/tools/output-generators.ts`. Step options are defined in the JSON CMS files. The ToolEngine imports the output-generators registry internally — no prop threading from the server page.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind v4, Zod 4.3.6, Supabase anon key + RLS, `window.print()` for export.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `types/tool.ts` | Modify | Add `ToolOption`, `ToolAnswers`, `OutputItem`, `CTAConfig`, `ToolOutput` types |
| `components/tools/ToolProgressBar.tsx` | Create | Light-mode progress bar for tool wizard |
| `components/tools/ToolStep.tsx` | Create | Renders one step by type: select, multiselect, checklist, number, text, date |
| `components/tools/ToolResults.tsx` | Create | Renders tool output: summary, priority items, CTA, print export |
| `components/tools/ToolEngine.tsx` | Rewrite | Live interactive wizard (replaces placeholder) |
| `lib/tools/output-generators.ts` | Create | `outputGenerator` function for each of the 11 tools |
| `content/tools/*.json` (all 11) | Modify | Add `options` arrays to select/multiselect/checklist steps |

**No changes needed to:** `app/tools/[slug]/page.tsx` (already passes `tool` to ToolEngine), `types/tool.ts` Zod schema shape is extended in-place.

---

## Common data sets (reference for JSON options)

These option arrays appear in multiple tool JSON files. Copy exactly:

### ACCIDENT_TYPE_OPTIONS
```json
[
  { "value": "car-accident", "label": "Car Accident" },
  { "value": "truck-accident", "label": "Truck Accident" },
  { "value": "motorcycle-crash", "label": "Motorcycle Crash" },
  { "value": "bicycle-accident", "label": "Bicycle Accident" },
  { "value": "pedestrian-accident", "label": "Pedestrian Accident" },
  { "value": "slip-fall", "label": "Slip & Fall" },
  { "value": "dog-bite", "label": "Dog Bite or Animal Attack" },
  { "value": "workplace-injury", "label": "Workplace Injury" },
  { "value": "other", "label": "Other" }
]
```

### TIMELINE_OPTIONS
```json
[
  { "value": "today", "label": "Today" },
  { "value": "1-7-days", "label": "1–7 days ago" },
  { "value": "1-4-weeks", "label": "1–4 weeks ago" },
  { "value": "1-6-months", "label": "1–6 months ago" },
  { "value": "6-12-months", "label": "6–12 months ago" },
  { "value": "over-1-year", "label": "More than 1 year ago" }
]
```

### YES_NO_OPTIONS
```json
[
  { "value": "yes", "label": "Yes" },
  { "value": "no", "label": "No" },
  { "value": "not-sure", "label": "Not sure" }
]
```

---

## Task 1: Extend types/tool.ts

**Files:**
- Modify: `types/tool.ts`

- [ ] **Step 1: Read the current file**

  Path: `types/tool.ts`
  Current content (read before editing):
  ```ts
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

- [ ] **Step 2: Replace the entire file with the extended version**

  ```ts
  import { z } from 'zod'

  const ToolOptionSchema = z.object({
    value: z.string(),
    label: z.string(),
  })

  export const ToolStepSchema = z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
    options: z.array(ToolOptionSchema).optional(),
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

  export type ToolOption = z.infer<typeof ToolOptionSchema>
  export type ToolConfig = z.infer<typeof ToolConfigSchema>
  export type ToolStep = z.infer<typeof ToolStepSchema>

  export type ToolAnswers = Record<string, string | string[] | number>

  export interface OutputItem {
    label: string
    value?: string
    priority: 'critical' | 'important' | 'helpful'
  }

  export interface CTAConfig {
    label: string
    href: string
  }

  export interface ToolOutput {
    summary: string
    items: OutputItem[]
    cta: CTAConfig
    disclaimer: string
    exportable: boolean
  }
  ```

- [ ] **Step 3: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors related to `types/tool.ts`

- [ ] **Step 4: Commit**

  ```bash
  git add types/tool.ts
  git commit -m "feat(tools): extend ToolStep with options + add ToolOutput types — DEV-15"
  ```

---

## Task 2: Build ToolProgressBar.tsx + ToolStep.tsx

**Files:**
- Create: `components/tools/ToolProgressBar.tsx`
- Create: `components/tools/ToolStep.tsx`

### ToolProgressBar

Light-mode progress bar (the intake `ProgressBar` uses dark-background colors; tools render on `bg-surface-page` which is white).

- [ ] **Step 1: Create `components/tools/ToolProgressBar.tsx`**

  ```tsx
  interface ToolProgressBarProps {
    current: number
    total: number
  }

  export function ToolProgressBar({ current, total }: ToolProgressBarProps) {
    const pct = Math.round((current / total) * 100)
    return (
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current} of ${total}`}
      >
        <div className="flex justify-between text-xs text-neutral-500 mb-2 font-sans">
          <span>Step {current} of {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }
  ```

### ToolStep

- [ ] **Step 2: Create `components/tools/ToolStep.tsx`**

  Props: one step at a time, current answer, onChange handler.

  ```tsx
  'use client'

  import type { ToolStep, ToolOption } from '@/types/tool'

  interface ToolStepProps {
    step: ToolStep
    value: string | string[] | number | undefined
    onChange: (v: string | string[] | number) => void
  }

  function OptionCard({
    option,
    selected,
    onClick,
    multi,
  }: {
    option: ToolOption
    selected: boolean
    onClick: () => void
    multi: boolean
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={[
          'flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border-2 font-sans text-sm transition-colors min-h-[44px]',
          selected
            ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50',
        ].join(' ')}
      >
        <span
          className={[
            'flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-colors text-xs font-bold',
            multi ? 'rounded' : 'rounded-full',
            selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300 bg-white',
          ].join(' ')}
          aria-hidden="true"
        >
          {selected && (multi ? '✓' : '●')}
        </span>
        {option.label}
      </button>
    )
  }

  export function ToolStep({ step, value, onChange }: ToolStepProps) {
    const options = step.options ?? []

    if (step.type === 'select') {
      const current = (value as string) ?? ''
      return (
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={step.question}>
          {options.map(opt => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={current === opt.value}
              onClick={() => onChange(opt.value)}
              multi={false}
            />
          ))}
        </div>
      )
    }

    if (step.type === 'multiselect' || step.type === 'checklist') {
      const current: string[] = Array.isArray(value) ? (value as string[]) : []
      const toggle = (v: string) => {
        const next = current.includes(v) ? current.filter(x => x !== v) : [...current, v]
        onChange(next)
      }
      return (
        <div className="flex flex-col gap-2" role="group" aria-label={step.question}>
          {options.map(opt => (
            <OptionCard
              key={opt.value}
              option={opt}
              selected={current.includes(opt.value)}
              onClick={() => toggle(opt.value)}
              multi={true}
            />
          ))}
        </div>
      )
    }

    if (step.type === 'number') {
      const current = typeof value === 'number' ? value : ''
      return (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            value={current}
            min={0}
            onChange={e => {
              const n = parseFloat(e.target.value)
              if (!isNaN(n)) onChange(n)
            }}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none min-h-[44px]"
            aria-label={step.question}
          />
        </div>
      )
    }

    if (step.type === 'text') {
      const current = (value as string) ?? ''
      return (
        <textarea
          value={current}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none resize-none"
          aria-label={step.question}
        />
      )
    }

    if (step.type === 'date') {
      const current = (value as string) ?? ''
      return (
        <input
          type="date"
          value={current}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none min-h-[44px]"
          aria-label={step.question}
        />
      )
    }

    return null
  }
  ```

- [ ] **Step 3: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 4: Commit**

  ```bash
  git add components/tools/ToolProgressBar.tsx components/tools/ToolStep.tsx
  git commit -m "feat(tools): add ToolProgressBar and ToolStep sub-components — DEV-15"
  ```

---

## Task 3: Build ToolResults.tsx

**Files:**
- Create: `components/tools/ToolResults.tsx`

- [ ] **Step 1: Create `components/tools/ToolResults.tsx`**

  Priority badge colors: critical → red, important → amber, helpful → green.

  ```tsx
  'use client'

  import Link from 'next/link'
  import type { ToolOutput, ToolConfig } from '@/types/tool'

  const PRIORITY_STYLES = {
    critical: 'bg-danger-50 text-danger-700 border-danger-200',
    important: 'bg-warning-50 text-warning-700 border-warning-200',
    helpful: 'bg-success-50 text-success-700 border-success-200',
  } as const

  const PRIORITY_LABELS = {
    critical: 'Critical',
    important: 'Important',
    helpful: 'Helpful',
  } as const

  interface ToolResultsProps {
    output: ToolOutput
    tool: ToolConfig
    onReset: () => void
  }

  export function ToolResults({ output, tool, onReset }: ToolResultsProps) {
    return (
      <div className="flex flex-col gap-6 print:gap-4">
        {/* Summary */}
        <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
          <p className="text-xs font-semibold font-sans text-primary-600 uppercase tracking-widest mb-2">
            Your Results
          </p>
          <p className="text-neutral-800 text-sm leading-relaxed font-serif">{output.summary}</p>
        </div>

        {/* Items */}
        {output.items.length > 0 && (
          <div className="flex flex-col gap-3">
            {output.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-surface-card p-4"
              >
                <span
                  className={[
                    'flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-bold font-sans mt-0.5',
                    PRIORITY_STYLES[item.priority],
                  ].join(' ')}
                >
                  {PRIORITY_LABELS[item.priority]}
                </span>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-neutral-900">{item.label}</p>
                  {item.value && (
                    <p className="text-neutral-500 text-xs leading-relaxed">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-neutral-400 text-xs leading-relaxed">{output.disclaimer}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <Link
            href={output.cta.href}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            {output.cta.label}
          </Link>
          {output.exportable && (
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
            >
              Print / Save PDF
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-500 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }
  ```

  **Note on Tailwind tokens:** `bg-danger-50 text-danger-700 border-danger-200`, `bg-warning-50 text-warning-700`, `bg-success-50 text-success-700` — these follow the same token pattern as the intake results page. If any are missing from `app/globals.css`, add them to the `@theme` block; but they should already exist from previous tasks.

- [ ] **Step 2: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 3: Commit**

  ```bash
  git add components/tools/ToolResults.tsx
  git commit -m "feat(tools): add ToolResults component with priority badges and print export — DEV-15"
  ```

---

## Task 4: Rewrite ToolEngine.tsx

**Files:**
- Rewrite: `components/tools/ToolEngine.tsx`

Replace the entire placeholder file. The ToolEngine is a self-contained wizard. It imports `outputGenerators` registry (built in Task 6) — but **Task 4 must compile before Task 6 exists**. Use a lazy import pattern: if `outputGenerators[tool.slug]` is undefined, show an "output not available yet" fallback rather than crashing.

- [ ] **Step 1: Create `lib/tools/output-generators.ts` stub**

  Task 6 will fill this in fully. Create a stub now so Task 4 can import it:

  ```ts
  import type { ToolAnswers, ToolOutput } from '@/types/tool'

  type OutputGenerator = (answers: ToolAnswers) => ToolOutput

  export const outputGenerators: Record<string, OutputGenerator> = {}
  ```

  Save to: `lib/tools/output-generators.ts`

- [ ] **Step 2: Rewrite `components/tools/ToolEngine.tsx`**

  Full replacement — remove the placeholder entirely:

  ```tsx
  'use client'

  import { useState, useCallback } from 'react'
  import type { ToolConfig, ToolAnswers, ToolOutput } from '@/types/tool'
  import { ToolProgressBar } from '@/components/tools/ToolProgressBar'
  import { ToolStep } from '@/components/tools/ToolStep'
  import { ToolResults } from '@/components/tools/ToolResults'
  import { outputGenerators } from '@/lib/tools/output-generators'
  import { getSupabase } from '@/lib/supabase'

  interface Props {
    tool: ToolConfig
  }

  export function ToolEngine({ tool }: Props) {
    const [answers, setAnswers] = useState<ToolAnswers>({})
    const [currentStep, setCurrentStep] = useState(0)
    const [output, setOutput] = useState<ToolOutput | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const step = tool.steps[currentStep]
    const total = tool.steps.length
    const isLast = currentStep === total - 1

    const handleChange = useCallback(
      (value: string | string[] | number) => {
        setAnswers(prev => ({ ...prev, [step.id]: value }))
      },
      [step.id]
    )

    const currentAnswer = answers[step?.id ?? '']

    function canAdvance(): boolean {
      if (!step) return false
      const v = currentAnswer
      if (step.type === 'select') return typeof v === 'string' && v !== ''
      if (step.type === 'multiselect' || step.type === 'checklist') return Array.isArray(v) && v.length > 0
      if (step.type === 'number') return typeof v === 'number' && !isNaN(v)
      if (step.type === 'text') return typeof v === 'string' && v.trim() !== ''
      if (step.type === 'date') return typeof v === 'string' && v !== ''
      return false
    }

    async function handleFinish() {
      const generator = outputGenerators[tool.slug]
      if (!generator) {
        setOutput({
          summary: 'Results for this tool are coming soon.',
          items: [],
          cta: { label: 'Get Free Guidance', href: '/find-help' },
          disclaimer: tool.disclaimer,
          exportable: false,
        })
        return
      }

      setSubmitting(true)
      const result = generator(answers)
      setOutput(result)

      try {
        const supabase = getSupabase()
        await supabase.from('tool_submissions').insert({
          tool_slug: tool.slug,
          answers,
          output: result,
        })
      } catch {
        // Don't block on Supabase errors
      } finally {
        setSubmitting(false)
      }
    }

    function handleReset() {
      setAnswers({})
      setCurrentStep(0)
      setOutput(null)
    }

    if (output) {
      return (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
          </div>
          <ToolResults output={output} tool={tool} onReset={handleReset} />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        {/* Disclaimer before */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
        </div>

        {/* Progress */}
        <ToolProgressBar current={currentStep + 1} total={total} />

        {/* Step question */}
        <div key={currentStep} className="flex flex-col gap-4 animate-step-in">
          <p className="font-sans font-semibold text-lg text-neutral-950 leading-snug">
            {step.question}
          </p>
          <ToolStep step={step} value={currentAnswer} onChange={handleChange} />
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s - 1)}
              className="px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
            >
              ← Back
            </button>
          )}
          {isLast ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={!canAdvance() || submitting}
              className="flex-1 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Calculating…' : 'See My Results →'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    )
  }
  ```

  **Note:** `animate-step-in` is already defined in `app/globals.css` from the intake wizard — it's the `@keyframes step-in` class applied as `animate-step-in`.

  **Note on `getSupabase()`:** This is imported from `@/lib/supabase` — same pattern as the intake API route. The supabase client uses the anon key with RLS.

- [ ] **Step 3: Verify import of getSupabase exists**

  Run: `grep -r "export function getSupabase" lib/`
  Expected: finds a match in `lib/supabase.ts`

  If it doesn't exist, look for the Supabase client export in `lib/supabase.ts` and adjust the import accordingly.

- [ ] **Step 4: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 5: Commit**

  ```bash
  git add components/tools/ToolEngine.tsx lib/tools/output-generators.ts
  git commit -m "feat(tools): rewrite ToolEngine as live interactive wizard — DEV-15"
  ```

---

## Task 5: Add step options to all 11 JSON files + update Zod

**Files:**
- Modify: `content/tools/accident-case-quiz.json`
- Modify: `content/tools/urgency-checker.json`
- Modify: `content/tools/evidence-checklist.json`
- Modify: `content/tools/injury-journal.json`
- Modify: `content/tools/lost-wages-estimator.json`
- Modify: `content/tools/insurance-call-prep.json`
- Modify: `content/tools/record-request.json`
- Modify: `content/tools/settlement-readiness.json`
- Modify: `content/tools/lawyer-type-matcher.json`
- Modify: `content/tools/state-next-steps.json`
- Modify: `content/tools/statute-countdown.json`

For each JSON file, add `"options"` arrays to the `steps` entries that use `select`, `multiselect`, or `checklist` types. Steps with type `number`, `text`, or `date` need no options.

**IMPORTANT:** Preserve ALL existing JSON content (title, description, disclaimer, supportingContent, faq, relatedTools, etc.) — only ADD the `options` field to each step object.

---

### `content/tools/accident-case-quiz.json` — step options

Update each step in the `"steps"` array:

```json
{ "id": "accident-type", "question": "What type of accident were you involved in?", "type": "select",
  "options": [
    { "value": "car-accident", "label": "Car Accident" },
    { "value": "truck-accident", "label": "Truck Accident" },
    { "value": "motorcycle-crash", "label": "Motorcycle Crash" },
    { "value": "bicycle-accident", "label": "Bicycle Accident" },
    { "value": "pedestrian-accident", "label": "Pedestrian Accident" },
    { "value": "slip-fall", "label": "Slip & Fall" },
    { "value": "dog-bite", "label": "Dog Bite or Animal Attack" },
    { "value": "workplace-injury", "label": "Workplace Injury" },
    { "value": "other", "label": "Other" }
  ]
},
{ "id": "what-happened", "question": "Which of the following best describes what happened?", "type": "multiselect",
  "options": [
    { "value": "rear-end", "label": "Rear-end collision" },
    { "value": "side-impact", "label": "Side-impact (T-bone) collision" },
    { "value": "head-on", "label": "Head-on collision" },
    { "value": "sideswipe", "label": "Sideswipe" },
    { "value": "hit-run", "label": "Hit and run" },
    { "value": "rollover", "label": "Rollover" },
    { "value": "pedestrian-struck", "label": "Pedestrian struck by vehicle" },
    { "value": "slip-trip-fall", "label": "Slip, trip, or fall on property" },
    { "value": "dog-bite-incident", "label": "Dog bite or animal attack" },
    { "value": "workplace-incident", "label": "Workplace accident or equipment injury" },
    { "value": "other", "label": "Other / Not listed" }
  ]
},
{ "id": "injuries", "question": "Which injuries did you sustain? (Select all that apply)", "type": "checklist",
  "options": [
    { "value": "whiplash", "label": "Whiplash / Neck Injury" },
    { "value": "back-injury", "label": "Back or Spine Injury" },
    { "value": "head-injury", "label": "Head Injury or Concussion" },
    { "value": "broken-bones", "label": "Broken Bones / Fractures" },
    { "value": "cuts-lacerations", "label": "Cuts or Lacerations" },
    { "value": "soft-tissue", "label": "Soft Tissue Injuries" },
    { "value": "internal-injuries", "label": "Internal Injuries" },
    { "value": "psychological", "label": "Psychological / Emotional Trauma" },
    { "value": "no-visible-injuries", "label": "No Visible Injuries" }
  ]
},
{ "id": "timeline", "question": "When did the accident happen?", "type": "select",
  "options": [
    { "value": "today", "label": "Today" },
    { "value": "1-7-days", "label": "1–7 days ago" },
    { "value": "1-4-weeks", "label": "1–4 weeks ago" },
    { "value": "1-6-months", "label": "1–6 months ago" },
    { "value": "6-12-months", "label": "6–12 months ago" },
    { "value": "over-1-year", "label": "More than 1 year ago" }
  ]
}
```

---

### `content/tools/urgency-checker.json` — step options

```json
{ "id": "accident-type", "question": "What type of accident were you involved in?", "type": "select",
  "options": [ /* ACCIDENT_TYPE_OPTIONS from header */ ]
},
{ "id": "symptoms", "question": "Are you experiencing any of the following? (Select all that apply)", "type": "checklist",
  "options": [
    { "value": "loss-of-consciousness", "label": "Loss of consciousness (even briefly)" },
    { "value": "severe-headache", "label": "Severe or worsening headache" },
    { "value": "neck-back-pain", "label": "Neck or back pain" },
    { "value": "chest-pain", "label": "Chest pain or difficulty breathing" },
    { "value": "numbness-tingling", "label": "Numbness or tingling in arms or legs" },
    { "value": "abdominal-pain", "label": "Abdominal pain or tenderness" },
    { "value": "blurred-vision", "label": "Blurred vision or dizziness" },
    { "value": "nausea", "label": "Nausea or vomiting" },
    { "value": "confusion", "label": "Confusion or memory problems" },
    { "value": "no-symptoms", "label": "No symptoms at this time" }
  ]
},
{ "id": "when", "question": "When did the accident happen?", "type": "select",
  "options": [ /* TIMELINE_OPTIONS from header */ ]
},
{ "id": "seen-doctor", "question": "Have you seen a doctor since the accident?", "type": "select",
  "options": [
    { "value": "yes-same-day", "label": "Yes — same day as the accident" },
    { "value": "yes-within-days", "label": "Yes — within a few days" },
    { "value": "not-yet", "label": "Not yet, but I plan to" },
    { "value": "no-feel-fine", "label": "No — I feel fine" }
  ]
}
```

---

### `content/tools/evidence-checklist.json` — step options

The existing steps are: accident-type, location-type, witnesses, police-report, photos.

```json
{ "id": "accident-type", ... "options": [ /* ACCIDENT_TYPE_OPTIONS */ ] },
{ "id": "location-type", "question": "Where did the accident occur?", "type": "select",
  "options": [
    { "value": "public-road", "label": "Public road or highway" },
    { "value": "parking-lot", "label": "Parking lot" },
    { "value": "business-premises", "label": "Business or commercial property" },
    { "value": "workplace", "label": "Workplace" },
    { "value": "private-property", "label": "Private property (home, driveway)" },
    { "value": "other", "label": "Other" }
  ]
},
{ "id": "witnesses", "question": "Were there witnesses to the accident?", "type": "select",
  "options": [
    { "value": "yes-with-info", "label": "Yes — I have their contact information" },
    { "value": "yes-no-info", "label": "Yes — but I don't have their contact info" },
    { "value": "no-witnesses", "label": "No witnesses" },
    { "value": "unknown", "label": "I'm not sure" }
  ]
},
{ "id": "police-report", "question": "Was a police report filed?", "type": "select",
  "options": [
    { "value": "yes-filed", "label": "Yes — a report was filed" },
    { "value": "no-not-filed", "label": "No report was filed" },
    { "value": "in-progress", "label": "Report is in progress" },
    { "value": "not-sure", "label": "I'm not sure" }
  ]
},
{ "id": "photos", "question": "Do you have photos of the scene or your injuries?", "type": "select",
  "options": [
    { "value": "yes-extensive", "label": "Yes — extensive photos" },
    { "value": "yes-some", "label": "Yes — a few photos" },
    { "value": "no-photos", "label": "No photos yet" },
    { "value": "conditions-prevented", "label": "Conditions made photos impossible" }
  ]
}
```

---

### `content/tools/injury-journal.json` — step options

Existing steps: injury-type (checklist), pain-level (number), symptoms (checklist), treatments (checklist).

```json
{ "id": "injury-type", "question": "What type of injuries are you tracking?", "type": "checklist",
  "options": [
    { "value": "whiplash-neck", "label": "Whiplash / Neck Injury" },
    { "value": "back-spine", "label": "Back or Spine Injury" },
    { "value": "head-concussion", "label": "Head Injury or Concussion" },
    { "value": "broken-bones", "label": "Broken Bones or Fractures" },
    { "value": "soft-tissue", "label": "Soft Tissue Injuries" },
    { "value": "cuts-lacerations", "label": "Cuts or Lacerations" },
    { "value": "psychological", "label": "Psychological / Emotional Trauma" },
    { "value": "other", "label": "Other Injuries" }
  ]
},
{ "id": "pain-level", ... /* no options — type: number */ },
{ "id": "symptoms", "question": "Which symptoms are you experiencing today? (Select all that apply)", "type": "checklist",
  "options": [
    { "value": "headache", "label": "Headache" },
    { "value": "neck-pain", "label": "Neck pain or stiffness" },
    { "value": "back-pain", "label": "Back pain" },
    { "value": "dizziness", "label": "Dizziness or vertigo" },
    { "value": "nausea", "label": "Nausea" },
    { "value": "numbness-tingling", "label": "Numbness or tingling" },
    { "value": "sleep-disruption", "label": "Sleep disruption" },
    { "value": "anxiety-depression", "label": "Anxiety or depression" },
    { "value": "difficulty-concentrating", "label": "Difficulty concentrating" },
    { "value": "fatigue", "label": "Fatigue or low energy" },
    { "value": "limited-range-of-motion", "label": "Limited range of motion" },
    { "value": "no-symptoms-today", "label": "No symptoms today" }
  ]
},
{ "id": "treatments", "question": "What treatments or appointments did you have today?", "type": "checklist",
  "options": [
    { "value": "doctor-visit", "label": "Doctor visit" },
    { "value": "physical-therapy", "label": "Physical therapy" },
    { "value": "chiropractic", "label": "Chiropractic care" },
    { "value": "medication", "label": "Medication" },
    { "value": "er-urgent-care", "label": "Emergency room or urgent care" },
    { "value": "mental-health", "label": "Mental health therapy" },
    { "value": "massage", "label": "Massage therapy" },
    { "value": "imaging", "label": "Imaging (X-ray, MRI, CT)" },
    { "value": "no-treatments-today", "label": "No treatments today" }
  ]
}
```

---

### `content/tools/lost-wages-estimator.json` — step options

Existing steps: employment-type (select), income (number), days-missed (number), reduced-hours (select), ongoing (select).

```json
{ "id": "employment-type", "question": "What is your employment status?", "type": "select",
  "options": [
    { "value": "full-time", "label": "Full-time employee (salaried)" },
    { "value": "full-time-hourly", "label": "Full-time employee (hourly)" },
    { "value": "part-time", "label": "Part-time employee" },
    { "value": "self-employed", "label": "Self-employed or freelance" },
    { "value": "gig-worker", "label": "Gig worker (rideshare, delivery, etc.)" },
    { "value": "not-employed", "label": "Not currently employed" }
  ]
},
{ "id": "income", ... /* type: number, no options */ },
{ "id": "days-missed", ... /* type: number, no options */ },
{ "id": "reduced-hours", "question": "Have you returned to work with reduced hours or capacity?", "type": "select",
  "options": [
    { "value": "yes-reduced", "label": "Yes — working reduced hours" },
    { "value": "yes-light-duty", "label": "Yes — on light duty / modified work" },
    { "value": "no-full-capacity", "label": "No — back to full capacity" },
    { "value": "not-returned", "label": "Have not returned to work yet" },
    { "value": "not-applicable", "label": "Not applicable" }
  ]
},
{ "id": "ongoing", "question": "Are you still unable to return to full work capacity?", "type": "select",
  "options": [
    { "value": "yes-ongoing", "label": "Yes — still unable to work" },
    { "value": "yes-partial", "label": "Yes — partially able to work" },
    { "value": "no-recovered", "label": "No — fully recovered" },
    { "value": "uncertain", "label": "Uncertain about future capacity" }
  ]
}
```

---

### `content/tools/insurance-call-prep.json` — step options

Existing steps: who-calling (select), purpose (select), have-info (checklist).

```json
{ "id": "who-calling", "question": "Who are you calling?", "type": "select",
  "options": [
    { "value": "your-insurer", "label": "Your own insurance company" },
    { "value": "other-driver-insurer", "label": "The other driver's insurance company" },
    { "value": "health-insurer", "label": "Your health insurer" },
    { "value": "workers-comp", "label": "Workers' compensation insurer" }
  ]
},
{ "id": "purpose", "question": "What is the purpose of the call?", "type": "select",
  "options": [
    { "value": "report-claim", "label": "Report a new claim" },
    { "value": "follow-up", "label": "Follow up on an existing claim" },
    { "value": "dispute-decision", "label": "Dispute a coverage decision" },
    { "value": "request-info", "label": "Request information or documents" }
  ]
},
{ "id": "have-info", "question": "What information do you have available? (Select all that apply)", "type": "checklist",
  "options": [
    { "value": "claim-number", "label": "Claim number" },
    { "value": "police-report-number", "label": "Police report number" },
    { "value": "photos-documentation", "label": "Photos and accident documentation" },
    { "value": "medical-records", "label": "Medical records or bills" },
    { "value": "witness-info", "label": "Witness contact information" },
    { "value": "policy-number", "label": "Insurance policy number" },
    { "value": "none-of-above", "label": "None of the above yet" }
  ]
}
```

---

### `content/tools/record-request.json` — step options

Existing steps: accident-type (select), records-needed (multiselect).

```json
{ "id": "accident-type", ... "options": [ /* ACCIDENT_TYPE_OPTIONS */ ] },
{ "id": "records-needed", "question": "Which records do you need to request? (Select all that apply)", "type": "multiselect",
  "options": [
    { "value": "police-report", "label": "Police / accident report" },
    { "value": "hospital-records", "label": "Hospital or emergency room records" },
    { "value": "ongoing-medical", "label": "Ongoing medical / doctor records" },
    { "value": "imaging-records", "label": "Imaging records (X-ray, MRI, CT)" },
    { "value": "pharmacy-records", "label": "Pharmacy records" },
    { "value": "employment-wage", "label": "Employment and wage records" },
    { "value": "insurance-policy", "label": "Insurance policy documents" },
    { "value": "property-damage", "label": "Property damage estimates or appraisals" },
    { "value": "surveillance-footage", "label": "Surveillance or security footage" },
    { "value": "rideshare-data", "label": "Rideshare trip data (Uber / Lyft)" }
  ]
}
```

---

### `content/tools/settlement-readiness.json` — step options

Existing steps are yes/no readiness questions. All are `select` type.

```json
{ "id": "medical-complete", "question": "Is your medical treatment complete, or have you reached maximum medical improvement?", "type": "select",
  "options": [
    { "value": "yes-complete", "label": "Yes — treatment is complete" },
    { "value": "yes-mmi", "label": "Yes — reached maximum medical improvement (MMI)" },
    { "value": "no-still-treating", "label": "No — still receiving treatment" },
    { "value": "uncertain", "label": "Uncertain" }
  ]
},
{ "id": "records-gathered", "question": "Have you gathered all relevant medical and accident records?", "type": "select",
  "options": [
    { "value": "yes-all", "label": "Yes — all records collected" },
    { "value": "partially", "label": "Partially — some records still outstanding" },
    { "value": "no", "label": "No — not yet started" }
  ]
},
{ "id": "wages-documented", "question": "Have you documented any lost wages or income losses?", "type": "select",
  "options": [
    { "value": "yes", "label": "Yes — fully documented" },
    { "value": "partially", "label": "Partially documented" },
    { "value": "no", "label": "No — not documented yet" },
    { "value": "not-applicable", "label": "Not applicable — no income loss" }
  ]
},
{ "id": "property-resolved", "question": "Has property damage (vehicle, personal property) been resolved?", "type": "select",
  "options": [
    { "value": "yes", "label": "Yes — resolved" },
    { "value": "pending", "label": "Pending — in progress" },
    { "value": "not-applicable", "label": "Not applicable" }
  ]
},
{ "id": "liability-clear", "question": "Is liability (who was at fault) reasonably clear?", "type": "select",
  "options": [
    { "value": "yes-clear", "label": "Yes — fault is clear" },
    { "value": "disputed", "label": "Disputed — liability is contested" },
    { "value": "unclear", "label": "Unclear at this time" }
  ]
},
{ "id": "insurance-limits", "question": "Do you know the insurance policy limits of all parties?", "type": "select",
  "options": [
    { "value": "yes-known", "label": "Yes — limits are known" },
    { "value": "no-unknown", "label": "No — limits are unknown" },
    { "value": "partially", "label": "Know some, not all" }
  ]
}
```

---

### `content/tools/lawyer-type-matcher.json` — step options

Existing steps: accident-type (select), severity (select), special-circumstances (checklist), state (select).

```json
{ "id": "accident-type", ... "options": [ /* ACCIDENT_TYPE_OPTIONS */ ] },
{ "id": "severity", "question": "How severe were your injuries?", "type": "select",
  "options": [
    { "value": "minor", "label": "Minor — no medical treatment needed" },
    { "value": "moderate", "label": "Moderate — medical care but no hospitalization" },
    { "value": "significant", "label": "Significant — hospitalization or surgery" },
    { "value": "severe-permanent", "label": "Severe — permanent injury or disability" },
    { "value": "fatality", "label": "Fatality — wrongful death situation" }
  ]
},
{ "id": "special-circumstances", "question": "Do any of the following apply? (Select all that apply)", "type": "checklist",
  "options": [
    { "value": "commercial-vehicle", "label": "Commercial or fleet vehicle involved" },
    { "value": "government-property", "label": "Government-owned vehicle or property" },
    { "value": "workplace", "label": "Accident occurred on the job or at a workplace" },
    { "value": "rideshare", "label": "Rideshare (Uber / Lyft) or delivery vehicle" },
    { "value": "defective-product", "label": "Defective product contributed to the injury" },
    { "value": "none", "label": "None of the above" }
  ]
},
{ "id": "state", "question": "Which state did the accident occur in?", "type": "select",
  "options": [
    { "value": "CA", "label": "California" },
    { "value": "AZ", "label": "Arizona" }
  ]
}
```

---

### `content/tools/state-next-steps.json` — step options

Existing steps: state (select), accident-type (select), when (select).

```json
{ "id": "state", "question": "Which state did the accident occur in?", "type": "select",
  "options": [
    { "value": "CA", "label": "California" },
    { "value": "AZ", "label": "Arizona" }
  ]
},
{ "id": "accident-type", ... "options": [ /* ACCIDENT_TYPE_OPTIONS */ ] },
{ "id": "when", "question": "When did the accident happen?", "type": "select",
  "options": [ /* TIMELINE_OPTIONS */ ]
}
```

---

### `content/tools/statute-countdown.json` — step options

Existing steps: state (select), claim-type (select), accident-date (date), was-minor (select), government-involved (select).

```json
{ "id": "state", "question": "Which state did the accident occur in?", "type": "select",
  "options": [
    { "value": "CA", "label": "California" },
    { "value": "AZ", "label": "Arizona" }
  ]
},
{ "id": "claim-type", "question": "What type of claim are you considering?", "type": "select",
  "options": [
    { "value": "personal-injury", "label": "Personal Injury (General)" },
    { "value": "car-truck-motorcycle", "label": "Car / Truck / Motorcycle Accident" },
    { "value": "wrongful-death", "label": "Wrongful Death" },
    { "value": "premises-liability", "label": "Premises Liability (Slip & Fall)" },
    { "value": "product-liability", "label": "Product Liability" },
    { "value": "workplace-injury", "label": "Workplace Injury" }
  ]
},
{ "id": "accident-date", ... /* type: date, no options */ },
{ "id": "was-minor", "question": "Were you under 18 years old at the time of the accident?", "type": "select",
  "options": [
    { "value": "yes-minor", "label": "Yes — I was under 18" },
    { "value": "no-adult", "label": "No — I was 18 or older" }
  ]
},
{ "id": "government-involved", "question": "Was a government entity involved (government vehicle, public property, public employee)?", "type": "select",
  "options": [
    { "value": "yes", "label": "Yes — a government entity was involved" },
    { "value": "no", "label": "No" },
    { "value": "not-sure", "label": "I'm not sure" }
  ]
}
```

---

- [ ] **Step 1: For each JSON file, read the current content, then add `options` to the appropriate steps**

  Use the Read tool on each file, then Edit to add the `options` field to each step that requires it. Do not change any other field. Work through all 11 files sequentially.

- [ ] **Step 2: Verify Zod still passes (options field is now `optional()` so existing files without options are still valid)**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 3: Commit**

  ```bash
  git add content/tools/
  git commit -m "feat(tools): add step options to all 11 tool JSON files — DEV-15"
  ```

---

## Task 6: Build output generators for all 11 tools

**Files:**
- Rewrite: `lib/tools/output-generators.ts` (replace stub from Task 4)

The output generators live in a single file. Each is a function `(answers: ToolAnswers) => ToolOutput`. All must follow safe language patterns from CLAUDE.md:
- "Based on your answers, cases like this are typically handled by..."
- "This is general educational information only, not legal advice."
- Never: "You have a case", "You should sue", "We recommend this lawyer"

- [ ] **Step 1: Create the full `lib/tools/output-generators.ts`**

  Replace the stub entirely with this full implementation:

  ```ts
  import type { ToolAnswers, ToolOutput, OutputItem } from '@/types/tool'

  type OutputGenerator = (answers: ToolAnswers) => ToolOutput

  // ─── Shared helpers ──────────────────────────────────────────────────────────

  const ACCIDENT_LABELS: Record<string, string> = {
    'car-accident': 'car accident',
    'truck-accident': 'truck accident',
    'motorcycle-crash': 'motorcycle crash',
    'bicycle-accident': 'bicycle accident',
    'pedestrian-accident': 'pedestrian accident',
    'slip-fall': 'slip and fall',
    'dog-bite': 'dog bite or animal attack',
    'workplace-injury': 'workplace injury',
    'other': 'accident',
  }

  function accidentLabel(v: string | undefined): string {
    return ACCIDENT_LABELS[v ?? ''] ?? 'accident'
  }

  function timelineUrgent(when: string | undefined): boolean {
    return when === 'today' || when === '1-7-days' || when === '1-4-weeks'
  }

  // ─── Tool 1: accident-case-quiz ──────────────────────────────────────────────

  const accidentCaseQuiz: OutputGenerator = (answers) => {
    const accType = answers['accident-type'] as string
    const injuries = (answers['injuries'] as string[]) ?? []
    const when = answers['timeline'] as string
    const hasVisibleInjuries = !injuries.includes('no-visible-injuries')

    const accLabel = accidentLabel(accType)
    const urgent = timelineUrgent(when)
    const whenLabel = when === 'over-1-year' ? 'over a year ago' : when === '6-12-months' ? '6–12 months ago' : 'recently'

    const items: OutputItem[] = []

    if (urgent) {
      items.push({
        label: 'Consult a personal injury attorney soon',
        value: `With a ${accLabel} that occurred ${whenLabel}, documenting your claim early is important. Evidence and witness memories fade over time.`,
        priority: 'critical',
      })
    } else {
      items.push({
        label: 'Consult a personal injury attorney',
        value: 'Your situation may benefit from legal guidance. Most personal injury attorneys offer free initial consultations.',
        priority: 'important',
      })
    }

    if (hasVisibleInjuries) {
      items.push({
        label: 'Continue documenting medical treatment',
        value: 'Keep records of all doctor visits, diagnoses, prescriptions, and bills. Consistent documentation supports your claim.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'Gather evidence',
      value: 'Photos of the scene and injuries, police report, witness contact info, and insurance documentation are all valuable.',
      priority: 'important',
    })

    items.push({
      label: 'Avoid giving recorded statements to insurance companies',
      value: 'Insurance adjusters may use recorded statements to minimize your claim. Consult an attorney before providing a formal statement.',
      priority: 'important',
    })

    items.push({
      label: 'Review the Evidence Checklist Tool',
      value: 'Use our free evidence checklist to make sure you have everything documented.',
      priority: 'helpful',
    })

    return {
      summary: `Based on your answers, your situation involves a ${accLabel}${hasVisibleInjuries ? ' with physical injuries' : ''}. Cases like this are typically handled by personal injury attorneys. This is general educational information only — your specific situation may differ.`,
      items,
      cta: { label: 'Connect with an Attorney', href: '/contact' },
      disclaimer: 'This quiz provides general educational information only. It is not legal advice and does not evaluate the merits of any potential claim.',
      exportable: true,
    }
  }

  // ─── Tool 2: urgency-checker ─────────────────────────────────────────────────

  const urgencyChecker: OutputGenerator = (answers) => {
    const symptoms = (answers['symptoms'] as string[]) ?? []
    const seenDoctor = answers['seen-doctor'] as string
    const when = answers['when'] as string

    const redFlags = ['loss-of-consciousness', 'chest-pain', 'abdominal-pain', 'confusion']
    const yellowFlags = ['severe-headache', 'numbness-tingling', 'blurred-vision', 'nausea']
    const hasRed = redFlags.some(f => symptoms.includes(f))
    const hasYellow = yellowFlags.some(f => symptoms.includes(f))
    const hasSeenDoctor = seenDoctor === 'yes-same-day' || seenDoctor === 'yes-within-days'
    const noSymptoms = symptoms.includes('no-symptoms')

    const items: OutputItem[] = []
    let summary = ''

    if (hasRed) {
      summary = 'Based on your answers, you may have symptoms that warrant prompt medical evaluation. Some of the symptoms you selected can indicate serious injury that may not be immediately apparent. This is general educational information only — it is not medical advice.'
      items.push({
        label: 'Seek medical attention promptly',
        value: 'The symptoms you selected — including possible loss of consciousness, chest pain, or abdominal pain — can indicate serious conditions. A medical provider can evaluate you properly.',
        priority: 'critical',
      })
      if (!hasSeenDoctor) {
        items.push({
          label: 'You have not yet seen a doctor',
          value: 'Gaps between the accident and your first medical visit can be used by insurance companies to dispute injury severity. Seeking care promptly also protects your health.',
          priority: 'critical',
        })
      }
    } else if (hasYellow && !hasSeenDoctor) {
      summary = 'Based on your answers, you may have symptoms that are worth evaluating with a healthcare provider soon. Delayed symptoms after accidents are common. This is general educational information only — it is not medical advice.'
      items.push({
        label: 'Consider seeing a doctor within the next 24–72 hours',
        value: 'Symptoms like headache, dizziness, or numbness can develop gradually after an accident. Early evaluation creates a medical record and helps identify conditions before they worsen.',
        priority: 'important',
      })
    } else if (noSymptoms && !hasSeenDoctor) {
      summary = 'You report no symptoms at this time. However, many accident injuries — including whiplash, soft tissue damage, and concussion — can take hours or days to present. This is general educational information only.'
      items.push({
        label: 'Consider a precautionary medical evaluation',
        value: 'Even without immediate symptoms, a medical evaluation within 24–72 hours is commonly recommended after accidents. It creates a record in case symptoms appear later.',
        priority: 'important',
      })
    } else {
      summary = 'Based on your answers, you have received medical care and appear to be monitoring your symptoms. Continuing to follow your provider\'s guidance is the key next step. This is general educational information only.'
      items.push({
        label: 'Continue following your healthcare provider\'s guidance',
        value: 'Keep all follow-up appointments and report any new or worsening symptoms promptly.',
        priority: 'important',
      })
    }

    if (timelineUrgent(when)) {
      items.push({
        label: 'Document everything now',
        value: 'Photos, notes about symptoms, and a list of everyone you spoke with at the scene are most valuable when gathered promptly.',
        priority: 'important',
      })
    }

    items.push({
      label: 'Start an injury journal',
      value: 'Daily documentation of symptoms, pain levels, and treatments creates a powerful record for any future claim.',
      priority: 'helpful',
    })

    return {
      summary,
      items,
      cta: { label: 'Get Free Guidance', href: '/find-help' },
      disclaimer: 'This tool is for educational purposes only. It is not medical advice. If you are experiencing a medical emergency, call 911 immediately.',
      exportable: true,
    }
  }

  // ─── Tool 3: evidence-checklist ──────────────────────────────────────────────

  const evidenceChecklist: OutputGenerator = (answers) => {
    const accType = answers['accident-type'] as string
    const location = answers['location-type'] as string
    const witnesses = answers['witnesses'] as string
    const policeReport = answers['police-report'] as string
    const photos = answers['photos'] as string

    const items: OutputItem[] = []

    if (policeReport === 'no-not-filed' || policeReport === 'not-sure') {
      items.push({
        label: 'Obtain or file a police / accident report',
        value: 'If no report was filed, contact the responding agency. A police report is often required by insurers and provides an official account of the incident.',
        priority: 'critical',
      })
    } else {
      items.push({
        label: 'Obtain a copy of the police / accident report',
        value: 'Request a copy of the filed report from the responding law enforcement agency. This is a foundational document for any claim.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'All medical records and bills',
      value: 'Emergency room, hospital, primary care, specialist, physical therapy, and pharmacy records. Start collecting these as they accumulate.',
      priority: 'critical',
    })

    if (photos === 'no-photos' || photos === 'conditions-prevented') {
      items.push({
        label: 'Return to photograph the scene if possible',
        value: 'Scene conditions change quickly. If you can safely return, photograph the area, any relevant hazards, and the general location.',
        priority: 'important',
      })
    } else {
      items.push({
        label: 'Continue photographing injuries as they develop',
        value: 'Bruising and swelling often intensify in the days after an accident. Continue documenting visible injuries with dated photos.',
        priority: 'important',
      })
    }

    if (witnesses === 'yes-no-info') {
      items.push({
        label: 'Attempt to locate witness contact information',
        value: 'Witness accounts are valuable. Check any police report, ask nearby businesses for surveillance footage, or post on local community forums.',
        priority: 'important',
      })
    } else if (witnesses === 'yes-with-info') {
      items.push({
        label: 'Preserve witness contact information',
        value: 'Secure witness names, phone numbers, and addresses. Consider asking them to write a brief statement while the incident is fresh.',
        priority: 'important',
      })
    }

    if (location === 'business-premises' || location === 'private-property') {
      items.push({
        label: 'Request surveillance or security footage',
        value: 'Businesses and properties often have cameras. Submit a written preservation request promptly — footage is typically overwritten within 30–60 days.',
        priority: 'important',
      })
    }

    if (location === 'workplace') {
      items.push({
        label: 'File an incident report with your employer',
        value: 'A written incident report creates an official workplace record. This is often required to initiate a workers\' compensation claim.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'Insurance documentation for all parties',
      value: 'Gather insurance cards, policy numbers, and contact information for all insurers involved — your own and any other parties\'.',
      priority: 'important',
    })

    items.push({
      label: 'Employment records to document lost wages',
      value: 'Pay stubs, employer letters, and tax returns help document income losses if you missed work due to your injuries.',
      priority: 'helpful',
    })

    return {
      summary: `Here is a prioritized evidence checklist for your ${accidentLabel(accType)} case. Gathering this documentation promptly protects your ability to pursue a claim. This is general educational information only, not legal advice.`,
      items,
      cta: { label: 'Get Free Guidance', href: '/find-help' },
      disclaimer: 'This checklist is for general educational purposes only. Consult a licensed attorney to understand what evidence matters most in your specific situation.',
      exportable: true,
    }
  }

  // ─── Tool 4: injury-journal ──────────────────────────────────────────────────

  const injuryJournal: OutputGenerator = (answers) => {
    const injuries = (answers['injury-type'] as string[]) ?? []
    const painLevel = typeof answers['pain-level'] === 'number' ? answers['pain-level'] : null
    const symptoms = (answers['symptoms'] as string[]) ?? []
    const treatments = (answers['treatments'] as string[]) ?? []

    const noTreatments = treatments.includes('no-treatments-today') || treatments.length === 0
    const noSymptoms = symptoms.includes('no-symptoms-today') || symptoms.length === 0
    const highPain = painLevel !== null && painLevel >= 7

    const items: OutputItem[] = []

    if (highPain) {
      items.push({
        label: `Pain level ${painLevel}/10 — document with your provider`,
        value: 'A high pain level should be communicated to your treating physician at your next appointment. Make sure your medical records reflect your current pain.',
        priority: 'critical',
      })
    }

    if (!noTreatments) {
      items.push({
        label: 'Treatments documented today',
        value: treatments
          .filter(t => t !== 'no-treatments-today')
          .map(t => t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
          .join(', '),
        priority: 'important',
      })
    }

    if (!noSymptoms) {
      items.push({
        label: 'Symptoms logged today',
        value: symptoms
          .filter(s => s !== 'no-symptoms-today')
          .map(s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
          .join(', '),
        priority: 'important',
      })
    }

    if (noTreatments && painLevel !== null && painLevel > 0) {
      items.push({
        label: 'No treatments today — consider documenting why',
        value: 'If you were in pain but did not receive treatment, note the reason (transportation, cost, appointment availability). This context is helpful if your journal is reviewed.',
        priority: 'helpful',
      })
    }

    items.push({
      label: 'Add a journal entry again tomorrow',
      value: 'Daily entries — even short ones — create the most useful record. Consistency matters more than length.',
      priority: 'helpful',
    })

    return {
      summary: `Today's entry recorded. Pain level: ${painLevel !== null ? `${painLevel}/10` : 'not recorded'}. ${injuries.length > 0 ? `Tracking: ${injuries.map(i => i.replace(/-/g, ' ')).join(', ')}.` : ''} Your journal is for personal documentation only — keep it in a secure location and share it with your attorney if you have one.`,
      items,
      cta: { label: 'Print This Entry', href: '#' },
      disclaimer: 'This journal is an educational tool to help you organize personal documentation. It is not a medical record and is not a substitute for professional medical care.',
      exportable: true,
    }
  }

  // ─── Tool 5: lost-wages-estimator ────────────────────────────────────────────

  const lostWagesEstimator: OutputGenerator = (answers) => {
    const empType = answers['employment-type'] as string
    const income = typeof answers['income'] === 'number' ? answers['income'] : 0
    const daysMissed = typeof answers['days-missed'] === 'number' ? answers['days-missed'] : 0
    const reducedHours = answers['reduced-hours'] as string
    const ongoing = answers['ongoing'] as string

    const isNotEmployed = empType === 'not-employed'
    const isSalaried = empType === 'full-time'
    const isHourly = empType === 'full-time-hourly' || empType === 'part-time' || empType === 'gig-worker'
    const isSelfEmployed = empType === 'self-employed'

    let dailyRate = 0
    let estimatedLoss = 0
    let incomeNote = ''

    if (income > 0 && daysMissed > 0) {
      if (isSalaried || isSelfEmployed) {
        dailyRate = income / 260
        estimatedLoss = dailyRate * daysMissed
        incomeNote = `Based on ${isSalaried ? 'annual salary' : 'annual income'} of $${income.toLocaleString()}`
      } else if (isHourly) {
        dailyRate = income * 8
        estimatedLoss = dailyRate * daysMissed
        incomeNote = `Based on hourly rate of $${income}/hr × 8 hours/day`
      }
    }

    const items: OutputItem[] = []

    if (!isNotEmployed && income > 0 && daysMissed > 0) {
      items.push({
        label: `Estimated lost wages to date: ~$${Math.round(estimatedLoss).toLocaleString()}`,
        value: `${incomeNote}, ${daysMissed} day(s) missed. This is a rough educational estimate only. Actual recoverable amounts depend on documentation, employment type, and applicable law.`,
        priority: 'important',
      })
    }

    if (ongoing === 'yes-ongoing' || ongoing === 'yes-partial') {
      items.push({
        label: 'Ongoing income loss — future damages may apply',
        value: 'If you cannot return to full work capacity, you may have a claim for future lost earning capacity in addition to past lost wages. This requires documentation and, often, expert testimony.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'Gather income documentation',
      value: 'Pay stubs (3+ months before accident), W-2s or tax returns, employer letter confirming your rate and missed days, and a note from your physician stating you could not work.',
      priority: 'critical',
    })

    if (isSelfEmployed) {
      items.push({
        label: 'Self-employed: additional documentation needed',
        value: 'Tax returns, bank statements, invoices, contracts, and client correspondence showing income lost during your recovery period. A comparison to the same period in prior years strengthens your claim.',
        priority: 'important',
      })
    }

    if (reducedHours === 'yes-reduced' || reducedHours === 'yes-light-duty') {
      items.push({
        label: 'Document your reduced capacity period',
        value: 'Keep records of your reduced schedule, any lower-paying duties, and how your earning capacity changed. This period of partial loss is also potentially compensable.',
        priority: 'important',
      })
    }

    items.push({
      label: 'Consult an attorney for a complete damages assessment',
      value: 'A personal injury attorney can identify the full scope of your economic damages — including lost wages, future earning capacity, and out-of-pocket expenses.',
      priority: 'helpful',
    })

    return {
      summary: isNotEmployed
        ? 'You indicated you were not employed at the time of the accident. Lost wages may not apply, but other economic damages — such as lost household services or caregiver costs — may be relevant depending on your situation. This is general educational information only.'
        : `Based on the information you provided, this tool estimates your lost wages to date at approximately $${Math.round(estimatedLoss).toLocaleString()}. This is a rough educational estimate only — actual recoverable damages depend on your documentation, employment type, and applicable law. Consult an attorney for a complete assessment.`,
      items,
      cta: { label: 'Get Free Guidance', href: '/find-help' },
      disclaimer: 'This estimator provides rough calculations for educational purposes only. Actual lost wage claims depend on employment records, medical documentation, and applicable law.',
      exportable: true,
    }
  }

  // ─── Tool 6: insurance-call-prep ─────────────────────────────────────────────

  const insuranceCallPrep: OutputGenerator = (answers) => {
    const whoCalling = answers['who-calling'] as string
    const purpose = answers['purpose'] as string
    const haveInfo = (answers['have-info'] as string[]) ?? []

    const callerLabels: Record<string, string> = {
      'your-insurer': 'your insurance company',
      'other-driver-insurer': "the other driver's insurance company",
      'health-insurer': 'your health insurer',
      'workers-comp': "workers' compensation insurer",
    }
    const callerLabel = callerLabels[whoCalling] ?? 'the insurance company'

    const items: OutputItem[] = []

    items.push({
      label: 'Do not give a recorded statement without attorney guidance',
      value: `Regardless of purpose, ${callerLabel === "the other driver's insurance company" ? "the other driver's insurer" : "insurers"} may ask for a recorded statement. You generally are not required to give one. Consult an attorney before agreeing.`,
      priority: 'critical',
    })

    items.push({
      label: 'Have your claim or policy number ready',
      value: haveInfo.includes('claim-number') || haveInfo.includes('policy-number')
        ? 'Good — you have these. Write down the representative\'s name, ID number, and the date and time of the call.'
        : 'Locate your insurance card or policy documents before calling. Having your number ready reduces hold times and ensures proper routing.',
      priority: 'important',
    })

    items.push({
      label: 'Take detailed notes during the call',
      value: 'Write down the name and employee ID of every person you speak with, what was said, and any commitments made. Follow up with a written email confirming any agreements.',
      priority: 'important',
    })

    if (purpose === 'dispute-decision') {
      items.push({
        label: 'Request the denial or decision in writing',
        value: 'Before disputing, obtain the written decision with the specific reason for denial or reduction. This is the foundation for any appeal or legal challenge.',
        priority: 'critical',
      })
    }

    if (whoCalling === 'other-driver-insurer') {
      items.push({
        label: "Limit what you say to the other driver's insurer",
        value: 'You are not required to give a statement to the other party\'s insurer. Stick to basic facts (date, location) and do not discuss fault, injuries, or dollar amounts.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'Things not to say',
      value: '"I\'m fine" / "It was partly my fault" / "I don\'t have a lawyer" / "I\'ll take whatever you offer." These statements can be used to limit your claim.',
      priority: 'important',
    })

    items.push({
      label: 'Recording consent reminder',
      value: 'California requires all-party consent to record calls. Arizona is a one-party state. Know the rules before recording — or simply take thorough written notes.',
      priority: 'helpful',
    })

    return {
      summary: `You are preparing to call ${callerLabel}${purpose ? ` to ${purpose.replace(/-/g, ' ')}` : ''}. The most important principle: limit what you share, document everything, and consider consulting an attorney before giving any statement. This is general educational information only.`,
      items,
      cta: { label: 'Get Free Guidance', href: '/find-help' },
      disclaimer: 'This tool is for educational purposes only. It does not constitute legal advice. Consult a licensed attorney before making decisions about your insurance claim.',
      exportable: true,
    }
  }

  // ─── Tool 7: record-request ───────────────────────────────────────────────────

  const recordRequest: OutputGenerator = (answers) => {
    const accType = answers['accident-type'] as string
    const recordsNeeded = (answers['records-needed'] as string[]) ?? []

    const recordDetails: Record<string, { who: string; timeline: string }> = {
      'police-report': { who: 'Responding law enforcement agency (police, highway patrol, sheriff)', timeline: 'Typically available within 5–10 business days of the accident' },
      'hospital-records': { who: 'Hospital medical records department (in-person or written request)', timeline: '30–60 days; submit a signed HIPAA-compliant authorization form' },
      'ongoing-medical': { who: 'Each treating provider\'s records department', timeline: '30 days; may require a medical authorization form per provider' },
      'imaging-records': { who: 'Radiology department of the hospital or imaging center', timeline: '1–2 weeks; ask for both the images (CD/digital) and the radiologist\'s report' },
      'pharmacy-records': { who: 'Your pharmacy or pharmacy chain\'s records department', timeline: '5–10 business days' },
      'employment-wage': { who: 'Your employer\'s HR or payroll department', timeline: 'Request pay stubs, a wage verification letter, and documentation of missed time' },
      'insurance-policy': { who: 'Your insurance company\'s customer service or claims department', timeline: 'Your declarations page and policy should be available online or within 5–10 days by request' },
      'property-damage': { who: 'Auto body shop, insurance adjuster, or independent appraiser', timeline: 'Appraisals typically take 3–7 business days after inspection' },
      'surveillance-footage': { who: 'Property owner, business manager, or local government (FOIA request for public cameras)', timeline: 'URGENT — footage is often overwritten within 30–60 days. Send a preservation notice immediately.' },
      'rideshare-data': { who: 'Uber / Lyft in-app support or legal team (subpoena may be required)', timeline: '2–4 weeks; submit a formal written request referencing the trip date and time' },
    }

    const items: OutputItem[] = recordsNeeded.map(record => {
      const detail = recordDetails[record]
      if (!detail) return { label: record, priority: 'helpful' as const }
      const isSurveillance = record === 'surveillance-footage'
      const isPolice = record === 'police-report'
      const isMedical = record === 'hospital-records' || record === 'ongoing-medical'
      return {
        label: record.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        value: `Who: ${detail.who} — Timeline: ${detail.timeline}`,
        priority: isSurveillance || isPolice ? 'critical' : isMedical ? 'important' : 'helpful',
      }
    })

    if (items.length === 0) {
      items.push({
        label: 'No records selected',
        value: 'Go back and select the records most relevant to your situation.',
        priority: 'helpful',
      })
    }

    return {
      summary: `Here are the records to request for your ${accidentLabel(accType)} case, along with who to contact and expected timelines. Prioritize time-sensitive items — especially surveillance footage, which is often deleted within 30–60 days. This is general educational information only.`,
      items,
      cta: { label: 'Get Free Guidance', href: '/find-help' },
      disclaimer: 'This checklist is for general educational purposes only. Consult a licensed attorney about what records to prioritize for your specific situation.',
      exportable: true,
    }
  }

  // ─── Tool 8: settlement-readiness ────────────────────────────────────────────

  const settlementReadiness: OutputGenerator = (answers) => {
    const medical = answers['medical-complete'] as string
    const records = answers['records-gathered'] as string
    const wages = answers['wages-documented'] as string
    const property = answers['property-resolved'] as string
    const liability = answers['liability-clear'] as string
    const limits = answers['insurance-limits'] as string

    const completedCount = [
      medical === 'yes-complete' || medical === 'yes-mmi',
      records === 'yes-all',
      wages === 'yes' || wages === 'not-applicable',
      property === 'yes' || property === 'not-applicable',
      liability === 'yes-clear',
      limits === 'yes-known',
    ].filter(Boolean).length

    const items: OutputItem[] = []

    if (medical !== 'yes-complete' && medical !== 'yes-mmi') {
      items.push({
        label: 'Medical treatment not yet complete',
        value: 'Settling before reaching maximum medical improvement (MMI) risks undervaluing your claim — future treatment costs and long-term effects may not yet be known.',
        priority: 'critical',
      })
    }

    if (records !== 'yes-all') {
      items.push({
        label: 'Records not fully gathered',
        value: 'Incomplete records make it difficult to calculate the full value of your claim. Ensure all medical, employment, and accident documentation is collected before discussing settlement.',
        priority: records === 'partially' ? 'important' : 'critical',
      })
    }

    if (wages !== 'yes' && wages !== 'not-applicable') {
      items.push({
        label: 'Lost wages not yet documented',
        value: 'If you missed work or had reduced capacity, document this with pay stubs, employer letters, and physician notes before settling.',
        priority: 'important',
      })
    }

    if (liability !== 'yes-clear') {
      items.push({
        label: 'Liability is disputed or unclear',
        value: 'Settling while liability is unclear can result in accepting less than your claim is worth — or releasing claims against parties who may share fault.',
        priority: 'critical',
      })
    }

    if (limits !== 'yes-known') {
      items.push({
        label: 'Insurance limits not yet known',
        value: 'Knowing the available policy limits is essential before evaluating any settlement offer. An attorney can help obtain this information.',
        priority: 'important',
      })
    }

    if (completedCount >= 5) {
      items.push({
        label: 'You may be in a strong position to discuss settlement',
        value: 'With most readiness factors addressed, it may be an appropriate time to consult an attorney about your options.',
        priority: 'helpful',
      })
    }

    items.push({
      label: 'Consult an attorney before accepting any offer',
      value: 'Once you sign a release, you typically cannot pursue additional compensation. An attorney can evaluate whether any offer reflects the full value of your claim.',
      priority: 'critical',
    })

    return {
      summary: `Your settlement readiness score: ${completedCount} of 6 factors addressed. ${completedCount < 3 ? 'Several important factors are outstanding — settling now may undervalue your claim.' : completedCount < 5 ? 'You are making progress, but some important gaps remain before discussing settlement.' : 'Most factors are in place — consider consulting an attorney to evaluate your options.'} This is general educational information only, not legal advice.`,
      items,
      cta: { label: 'Connect with an Attorney', href: '/contact' },
      disclaimer: 'This checklist is for general educational purposes only. Settlement decisions involve many factors specific to your situation. Always consult a licensed attorney before accepting any settlement offer.',
      exportable: true,
    }
  }

  // ─── Tool 9: lawyer-type-matcher ─────────────────────────────────────────────

  const lawyerTypeMatcher: OutputGenerator = (answers) => {
    const accType = answers['accident-type'] as string
    const severity = answers['severity'] as string
    const special = (answers['special-circumstances'] as string[]) ?? []
    const state = answers['state'] as string

    const isWorkplace = accType === 'workplace-injury' || special.includes('workplace')
    const isCommercial = special.includes('commercial-vehicle')
    const isGovernment = special.includes('government-property')
    const isRideshare = special.includes('rideshare')
    const isProduct = special.includes('defective-product')
    const isFatality = severity === 'fatality'
    const isSevere = severity === 'severe-permanent' || isFatality

    let lawyerType = 'Personal Injury Attorney'
    let typeDescription = 'Personal injury attorneys handle claims arising from accidents caused by another party\'s negligence.'
    const items: OutputItem[] = []

    if (isWorkplace) {
      lawyerType = 'Workers\' Compensation and Personal Injury Attorney'
      typeDescription = 'Workplace accidents may involve both workers\' compensation claims and third-party personal injury claims. An attorney experienced in both areas can maximize your recovery options.'
    } else if (isFatality) {
      lawyerType = 'Wrongful Death Attorney'
      typeDescription = 'Wrongful death cases involve specialized legal procedures and damages calculations. Attorneys who focus on wrongful death cases in ' + (state === 'CA' ? 'California' : 'Arizona') + ' can guide families through this process.'
    } else if (isProduct) {
      lawyerType = 'Product Liability Attorney'
      typeDescription = 'When a defective product contributes to an accident, a product liability claim against the manufacturer or distributor may apply in addition to any negligence claim.'
    } else if (isGovernment) {
      lawyerType = 'Government Claims / Personal Injury Attorney'
      typeDescription = 'Claims against government entities require strict compliance with notice requirements — 180 days in both California and Arizona. An attorney familiar with government claims procedures is advisable.'
    } else if (isCommercial) {
      lawyerType = 'Commercial Vehicle / Trucking Accident Attorney'
      typeDescription = 'Accidents involving commercial trucks or fleet vehicles involve federal regulations, multiple potentially liable parties, and insurers with significant resources. Specialized experience is valuable.'
    } else if (isRideshare) {
      lawyerType = 'Rideshare Accident Attorney'
      typeDescription = 'Rideshare accidents (Uber, Lyft) involve complex insurance coverage questions depending on the driver\'s status at the time. Attorneys with rideshare-specific experience navigate these issues effectively.'
    }

    items.push({
      label: `Suggested attorney type: ${lawyerType}`,
      value: typeDescription,
      priority: 'important',
    })

    if (isSevere) {
      items.push({
        label: 'Serious injury — consider consulting an attorney promptly',
        value: 'Cases involving permanent injury or fatality often involve larger insurance limits, multiple liable parties, and expert witnesses. Early legal representation helps preserve evidence and protect your interests.',
        priority: 'critical',
      })
    }

    items.push({
      label: 'What to look for in a consultation',
      value: 'Experience with your specific accident type, familiarity with ' + (state === 'CA' ? 'California' : 'Arizona') + ' courts, a contingency fee structure (no upfront cost), and clear communication about the process.',
      priority: 'helpful',
    })

    items.push({
      label: 'Questions to ask during a free consultation',
      value: '"How many cases like mine have you handled?" / "What is your fee arrangement?" / "Who will handle my case day-to-day?" / "What is a realistic timeline?"',
      priority: 'helpful',
    })

    return {
      summary: `Based on your answers, a ${lawyerType} may be well-suited to handle your situation. This is general educational information only — every case is unique, and attorney selection should be based on your specific circumstances and comfort level with the attorney.`,
      items,
      cta: { label: 'Connect with an Attorney', href: '/contact' },
      disclaimer: 'This tool provides general educational information only. It does not constitute a legal referral or recommendation of any specific attorney. Consult with a licensed attorney to evaluate your specific situation.',
      exportable: false,
    }
  }

  // ─── Tool 10: state-next-steps ────────────────────────────────────────────────

  const stateNextSteps: OutputGenerator = (answers) => {
    const state = answers['state'] as string
    const accType = answers['accident-type'] as string
    const when = answers['when'] as string

    const isCA = state === 'CA'
    const stateName = isCA ? 'California' : 'Arizona'
    const solYears = 2

    const items: OutputItem[] = []

    if (when === 'today' || when === '1-7-days' || when === '1-4-weeks') {
      items.push({
        label: `${stateName} statute of limitations: ${solYears} years from accident date`,
        value: `Your clock is already running. For most personal injury claims in ${stateName}, you have ${solYears} years from the date of the accident to file a lawsuit. Government claims have a shorter 180-day notice requirement.`,
        priority: 'critical',
      })
    } else if (when === '6-12-months' || when === 'over-1-year') {
      items.push({
        label: `Statute of limitations deadline approaching`,
        value: `${stateName} generally allows ${solYears} years from the accident date to file. Given your timeline, consulting an attorney promptly is especially important — delays can forfeit your right to pursue a claim.`,
        priority: 'critical',
      })
    } else {
      items.push({
        label: `${stateName} statute of limitations: ${solYears} years`,
        value: `For most personal injury claims in ${stateName}, you have ${solYears} years from the accident date to file a lawsuit. Specific claim types may have different deadlines.`,
        priority: 'important',
      })
    }

    if (accType === 'workplace-injury') {
      items.push({
        label: isCA ? "Workers' Compensation: report within 30 days" : "Workers' Compensation: file within 1 year",
        value: isCA
          ? 'Report the injury to your employer within 30 days and file a formal DWC-1 claim within 1 year.'
          : 'Report to your employer as soon as possible and file a workers\' compensation claim within 1 year of the injury date.',
        priority: 'critical',
      })
    }

    if (['car-accident', 'truck-accident', 'motorcycle-crash', 'bicycle-accident', 'pedestrian-accident'].includes(accType) && isCA) {
      items.push({
        label: 'CA DMV SR-1 Report: within 10 days',
        value: 'Required when injury, death, or property damage over $1,000 occurred. File with the California DMV within 10 days.',
        priority: 'important',
      })
    }

    items.push({
      label: 'Government claim notice: 180 days',
      value: `If a government entity (city, county, state, public school, transit authority) was involved, you must file a formal claim notice within 180 days in ${stateName}. Missing this deadline bars your claim.`,
      priority: 'important',
    })

    items.push({
      label: `${stateName} fault rule: Pure comparative negligence`,
      value: `${stateName} uses pure comparative negligence — you may recover damages even if you were partially at fault, but your award is reduced in proportion to your share of responsibility.`,
      priority: 'helpful',
    })

    items.push({
      label: `${stateName} minimum insurance requirements`,
      value: isCA
        ? 'California minimum: $30,000 per person / $60,000 per accident / $15,000 property damage (effective Jan 1, 2025 under SB 1107).'
        : 'Arizona minimum: $25,000 per person / $50,000 per accident / $15,000 property damage.',
      priority: 'helpful',
    })

    return {
      summary: `Here are the key deadlines and next steps for a ${accidentLabel(accType)} in ${stateName}. Deadlines in personal injury cases are strict — missing them can permanently bar your right to compensation. This is general educational information only, not legal advice.`,
      items,
      cta: { label: 'Connect with an Attorney', href: '/contact' },
      disclaimer: `This information is for general educational purposes only. ${stateName} laws change — verify all deadlines with a licensed attorney in ${stateName} before relying on them.`,
      exportable: true,
    }
  }

  // ─── Tool 11: statute-countdown ──────────────────────────────────────────────

  const statuteCountdown: OutputGenerator = (answers) => {
    const state = answers['state'] as string
    const claimType = answers['claim-type'] as string
    const accidentDate = answers['accident-date'] as string
    const wasMinor = answers['was-minor'] as string
    const govInvolved = answers['government-involved'] as string

    const isCA = state === 'CA'
    const stateName = isCA ? 'California' : 'Arizona'

    const solYears = 2

    const items: OutputItem[] = []

    if (accidentDate) {
      const [y, m, d] = accidentDate.split('-').map(Number)
      const accident = new Date(y, m - 1, d)
      const deadline = new Date(y + solYears, m - 1, d)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const daysRemaining = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const deadlineStr = deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

      let deadlinePriority: 'critical' | 'important' | 'helpful' = 'helpful'
      let deadlineNote = ''

      if (daysRemaining < 0) {
        deadlinePriority = 'critical'
        deadlineNote = 'The general deadline for this claim type may have passed. Some exceptions may apply. Consult an attorney immediately.'
      } else if (daysRemaining < 90) {
        deadlinePriority = 'critical'
        deadlineNote = `URGENT: Only ${daysRemaining} day(s) remaining. Consider speaking with an attorney as soon as possible.`
      } else if (daysRemaining < 180) {
        deadlinePriority = 'important'
        deadlineNote = `${daysRemaining} days remaining. Your deadline is approaching — consult an attorney to confirm your specific deadline.`
      } else {
        deadlinePriority = 'helpful'
        deadlineNote = `${daysRemaining} days remaining. You have time, but earlier action generally leads to better outcomes.`
      }

      items.push({
        label: `General filing deadline: ${deadlineStr}`,
        value: deadlineNote,
        priority: deadlinePriority,
      })
    } else {
      items.push({
        label: `${stateName} general deadline: ${solYears} years from accident date`,
        value: 'Enter your accident date to see the calculated deadline.',
        priority: 'important',
      })
    }

    if (govInvolved === 'yes' || govInvolved === 'not-sure') {
      items.push({
        label: 'Government claim notice: 180 days (6 months)',
        value: `If a government entity was involved, you must file a formal claim notice within 180 days in ${stateName}. This is a separate and SHORTER deadline than the standard statute of limitations. Missing it bars your claim.`,
        priority: 'critical',
      })
    }

    if (wasMinor === 'yes-minor') {
      items.push({
        label: 'Minor tolling may extend your deadline',
        value: 'In some cases, the statute of limitations is "tolled" (paused) while you were a minor. This is highly fact-specific — consult an attorney to understand how this applies to you.',
        priority: 'important',
      })
    }

    items.push({
      label: 'Discovery rule exceptions',
      value: 'For delayed-onset injuries (e.g., you did not discover the injury immediately), the limitations period may begin from the date of discovery rather than the accident. Consult an attorney.',
      priority: 'helpful',
    })

    const claimLabel = claimType?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) ?? 'Personal Injury'
    const citation = isCA ? 'California CCP § 335.1' : 'A.R.S. § 12-542'

    return {
      summary: `${claimLabel} in ${stateName} — General deadline: ${solYears} years from the accident date (${citation}). Statutes of limitations have many exceptions. The deadline for your specific situation may differ significantly. Consult a licensed attorney to confirm your exact deadline before taking action.`,
      items,
      cta: { label: 'Connect with an Attorney', href: '/contact' },
      disclaimer: 'This tool shows GENERAL statutory deadlines for educational purposes only. Your specific deadline depends on facts unique to your case. Always consult a licensed attorney to confirm your deadline — do not rely on this tool alone.',
      exportable: false,
    }
  }

  // ─── Registry ─────────────────────────────────────────────────────────────────

  export const outputGenerators: Record<string, OutputGenerator> = {
    'accident-case-quiz': accidentCaseQuiz,
    'urgency-checker': urgencyChecker,
    'evidence-checklist': evidenceChecklist,
    'injury-journal': injuryJournal,
    'lost-wages-estimator': lostWagesEstimator,
    'insurance-call-prep': insuranceCallPrep,
    'record-request': recordRequest,
    'settlement-readiness': settlementReadiness,
    'lawyer-type-matcher': lawyerTypeMatcher,
    'state-next-steps': stateNextSteps,
    'statute-countdown': statuteCountdown,
  }
  ```

- [ ] **Step 2: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 3: Build check**

  Run: `npm run build`
  Expected: successful build. If there are type errors or import failures, fix them before proceeding.

- [ ] **Step 4: Commit**

  ```bash
  git add lib/tools/output-generators.ts
  git commit -m "feat(tools): add output generators for all 11 tools — DEV-15"
  ```

---

## Task 7: Final verification and push

- [ ] **Step 1: Type-check the full project**

  Run: `npx tsc --noEmit`
  Expected: zero errors

- [ ] **Step 2: Build the full project**

  Run: `npm run build`
  Expected: successful build, no errors

- [ ] **Step 3: Lint**

  Run: `npm run lint`
  Expected: no errors (warnings acceptable)

- [ ] **Step 4: Push**

  ```bash
  git push origin main
  ```

- [ ] **Step 5: Update session doc**

  Update `session_docs/2026-04-23-session-context.md` (or create `session_docs/2026-04-23-session-context-dev15.md`):
  - Mark DEV-15 complete
  - Note all files changed
  - Note next task (if any)

  ```bash
  git add session_docs/
  git commit -m "docs: update session context — DEV-15 ToolEngine complete"
  git push origin main
  ```

---

## Compliance Checklist

Before marking DEV-15 done, verify:

- [ ] Every output generator's `summary` uses safe language ("Based on your answers..." / "general educational information only")
- [ ] Every `ToolOutput.disclaimer` contains "educational" and "not legal advice" (or "not medical advice" for urgency-checker)
- [ ] No output generator says "you have a case", "you should sue", or "we recommend"
- [ ] `ToolEngine` shows disclaimer BEFORE the first step AND AFTER results
- [ ] All buttons have `min-h-[44px]` for 44px touch targets
- [ ] `canAdvance()` prevents progressing without answering each step
