# DEV-12: Tool Template + Static Pages (Tools Only)
_Date: 2026-04-22_

## Scope

This spec covers the tools section only:
- `/tools/page.tsx` — index page
- `/tools/[slug]/page.tsx` — detail page
- `components/tools/ToolEngine.tsx` — placeholder component
- `types/tool.ts` — Zod schema
- `content/tools/*.json` — 11 CMS files
- `lib/cms.ts` — getTool / getAllTools additions

Static pages (`/about`, `/privacy`, `/terms`, etc.) are out of scope for this spec.

---

## Routes

| Route | File | Type |
|-------|------|------|
| `/tools` | `app/tools/page.tsx` | Static, server component |
| `/tools/[slug]` | `app/tools/[slug]/page.tsx` | Static, server component + `generateStaticParams` |

---

## `/tools/page.tsx` — Index

### Hero
Matches `/guides` and `/accidents` hub pattern exactly:
- `bg-primary-900` hero section
- `Breadcrumb variant="dark"` → `[{ label: 'Free Tools' }]`
- Amber eyebrow with flanking lines: "Free Tools"
- `h1`: "Free Accident & Injury Tools"
- Serif italic subtext: "Interactive tools to help you collect evidence, understand your timeline, prepare for insurance calls, and more — free, no account required."
- Attorney-reviewed badge (`text-success-500 ✓`)
- Disclaimer: "These tools provide educational information only and do not constitute legal advice."

### Featured Tools Row
Two featured tools in a 2-col grid (`sm:grid-cols-2`) inside the white card wrapper (`max-w-6xl mx-auto bg-surface-card rounded-2xl shadow-sm border`):
- **Statute Countdown** (`/tools/statute-countdown`)
- **Case Type Quiz** (`/tools/accident-case-quiz`)

Card treatment: `bg-primary-900` dark card, amber "★ Most Useful" badge, tool title, description excerpt, step count, "Try It Free →" CTA link.

### Tools Grid
Remaining 9 tools in a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` grid below the featured row, inside the same white card wrapper (separated by a divider). Each card:
- Colored icon tile (teal `bg-surface-info` to match home page featured tools pattern)
- Title
- Description (one sentence)
- Step count ("4 steps")
- "Try Tool →" text link

### Metadata
```
title: "Free Accident & Injury Tools — California & Arizona"
description: "Free interactive tools for accident victims: evidence checklists, lost wages estimator, statute of limitations countdown, insurance call prep, and more."
canonical: "/tools"
```

---

## `/tools/[slug]/page.tsx` — Detail

### Static Generation
```ts
export async function generateStaticParams() {
  return cms.getAllTools().map(t => ({ slug: t.slug }))
}
```

### Hero
- `bg-primary-900` section
- `Breadcrumb variant="dark"` → `[{ label: 'Free Tools', href: '/tools' }, { label: tool.title }]`
- `h1`: `tool.title`
- Serif italic description: `tool.description`
- Disclaimer text (tool-specific from `tool.disclaimer`)

### Page Body — 2-col layout
`lg:grid lg:grid-cols-[1fr_300px] lg:gap-12` — matches guide detail.

**Main column (top to bottom):**
1. `ToolEngine` component — placeholder widget (see below)
2. Supporting content sections — rendered from `tool.supportingContent[]`, same section/tips pattern as guide detail
3. FAQ block — `tool.faq[]` rendered as `<details>`/`<summary>` accordion
4. Related accident type pill links — `tool.relatedAccidents[]`
5. `CTAButton href="/find-help"` — "Get Free Guidance"

**Sidebar (sticky `top-24`):**
1. "In This Tool" nav — step list from `tool.steps[]` (step number + question text, non-interactive links)
2. CTA card — same `bg-primary-50 border-primary-200` pattern as guide sidebar
3. Related Tools list — `tool.relatedTools[]`
4. Related Guides list — `tool.relatedGuides[]`

**Footer:** `DisclaimerBanner variant="default"`

### Metadata
Generated from `tool.metaTitle` and `tool.metaDescription`. Canonical `/tools/[slug]`.

---

## `ToolEngine` Component (`components/tools/ToolEngine.tsx`)

A `'use client'` component that DEV-15 will activate with real interactivity. In placeholder state:

```tsx
interface Props {
  tool: ToolConfig
}
```

Renders:
- Tool disclaimer in a `bg-amber-50 border-amber-200` banner
- Numbered step list — each step shows: step number badge, `step.question`, input type label (`step.type` formatted as "Multiple choice", "Checklist", etc.)
- Greyed-out CTA area: `opacity-50` "Start Tool →" button + "Launching soon" badge (`bg-surface-info text-primary-700 text-xs`)

The component accepts the full `ToolConfig` so DEV-15 only needs to replace the internals — the page template is untouched.

---

## `types/tool.ts` — Zod Schema

```ts
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

---

## `content/tools/*.json` — 11 CMS Files

| Slug | Title |
|------|-------|
| `accident-case-quiz` | What Kind of Accident Case Do I Have? |
| `urgency-checker` | Do I Need Medical Care Now? |
| `evidence-checklist` | Evidence Collection Checklist |
| `injury-journal` | Injury & Treatment Journal |
| `lost-wages-estimator` | Lost Wages Estimator |
| `insurance-call-prep` | Insurance Call Prep Tool |
| `record-request` | Record Request Checklist |
| `settlement-readiness` | Settlement Readiness Checklist |
| `lawyer-type-matcher` | Lawyer Type Matcher |
| `state-next-steps` | State-Specific Next Steps |
| `statute-countdown` | Statute of Limitations Countdown |

Each file must be Zod-compliant: metaTitle ≤70 chars, metaDescription 120–160 chars, ≥4 supportingContent sections (each ≥150 chars), ≥3 FAQ items, steps matching TOOLS-SPEC.md, compliance-safe language throughout.

---

## `lib/cms.ts` Additions

```ts
getTool: (slug: string) => loadAndValidate<ToolConfig>('tools', slug, ToolConfigSchema),
getAllTools: () => loadAll<ToolConfig>('tools', ToolConfigSchema),
```

---

## Compliance Requirements

- Every tool page must show `tool.disclaimer` prominently before the widget
- No language implying legal or medical advice
- Safe language patterns from `COMPLIANCE.md` throughout all CMS copy
- `DisclaimerBanner` on every detail page
- Hero disclaimer line on index page

---

## SEO Requirements (per TOOLS-SPEC.md)

- `supportingContent` fields provide 800+ words of indexable content per tool page
- FAQ block targets People Also Ask
- `relatedAccidents` + `relatedGuides` provide 3+ internal links per page
- `SoftwareApplication` schema markup on each detail page (added via `SchemaOrg` component)

---

## Out of Scope

- Actual tool interactivity (DEV-15)
- PDF export (DEV-15)
- Supabase `tool_submissions` writes (DEV-15)
- Shareable results URLs (DEV-15)
- Static pages: `/about`, `/about/how-it-works`, `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/contact`
