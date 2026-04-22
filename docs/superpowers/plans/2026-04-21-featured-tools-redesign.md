# Featured Tools Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Featured Tools section (section 5) on the home page with a full-width horizontal row layout — icon tile + title + description + plain teal text CTA per tool.

**Architecture:** All changes are confined to `app/page.tsx`. The `FEATURED_TOOLS` array is trimmed to remove the `icon` JSX field; a `TOOL_ICONS` lookup is added (same pattern as `ACCIDENT_ICONS`). The section markup is replaced inline — `ToolCard.tsx` and `HomeAnimations.tsx` are not touched.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, lucide-react

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Trim `FEATURED_TOOLS`; add `TOOL_ICONS`; replace section 5 markup |
| No change | `components/content/ToolCard.tsx` | Untouched |
| No change | `components/home/HomeAnimations.tsx` | `tool-card` selector still matches |

---

## Task 1: Replace Featured Tools section in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

### Step 1: Update `FEATURED_TOOLS` and add `TOOL_ICONS`

- [ ] Find the existing `FEATURED_TOOLS` constant in `app/page.tsx` (around line 53). Replace the entire block:

```tsx
const FEATURED_TOOLS = [
  {
    slug: 'statute-of-limitations',
    title: 'Statute of Limitations Calculator',
    description:
      'Understand the filing deadlines that may apply to your accident type in California or Arizona.',
    icon: <Calculator className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'evidence-checklist',
    title: 'Evidence Checklist Generator',
    description:
      'Get a personalized checklist of evidence to gather based on your specific accident type.',
    icon: <ClipboardList className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'medical-cost-estimator',
    title: 'Medical Cost Estimator',
    description:
      'Understand the range of typical medical costs associated with common injury types.',
    icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'insurance-claim-tracker',
    title: 'Insurance Claim Tracker',
    description:
      'Track your claim status, deadlines, and communications with your insurance company.',
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'injury-journal',
    title: 'Injury Journal',
    description:
      'Document your symptoms, treatments, and daily impact. Detailed records can matter in your recovery.',
    icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
  },
]
```

With:

```tsx
const FEATURED_TOOLS = [
  { slug: 'statute-of-limitations', title: 'Statute of Limitations Calculator', description: 'Understand the filing deadlines that may apply to your accident type in California or Arizona.' },
  { slug: 'evidence-checklist',     title: 'Evidence Checklist Generator',      description: 'Get a personalized checklist of evidence to gather based on your specific accident type.'   },
  { slug: 'medical-cost-estimator', title: 'Medical Cost Estimator',            description: 'Understand the range of typical medical costs associated with common injury types.'           },
  { slug: 'insurance-claim-tracker',title: 'Insurance Claim Tracker',           description: 'Track your claim status, deadlines, and communications with your insurance company.'        },
  { slug: 'injury-journal',         title: 'Injury Journal',                    description: 'Document your symptoms, treatments, and daily impact. Detailed records can matter in your recovery.' },
]

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'statute-of-limitations':  <Calculator    className="w-[19px] h-[19px]" aria-hidden="true" />,
  'evidence-checklist':      <ClipboardList className="w-[19px] h-[19px]" aria-hidden="true" />,
  'medical-cost-estimator':  <DollarSign    className="w-[19px] h-[19px]" aria-hidden="true" />,
  'insurance-claim-tracker': <FileText      className="w-[19px] h-[19px]" aria-hidden="true" />,
  'injury-journal':          <BookOpen      className="w-[19px] h-[19px]" aria-hidden="true" />,
}
```

### Step 2: Replace section 5 markup

- [ ] Find this entire block in `app/page.tsx`:

```tsx
      {/* ── 5. Featured Tools ─────────────────────────────────────────────── */}
      <section className="bg-surface-info py-16 lg:py-24" aria-labelledby="tools-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2
                id="tools-heading"
                className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-2"
              >
                Featured Tools
              </h2>
              <p className="font-serif text-neutral-500 text-lg max-w-lg">
                Interactive tools to help you understand your situation. For informational purposes
                only — not legal advice.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all tools
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_TOOLS.map((tool) => (
              <div key={tool.slug} data-animate="tool-card">
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  icon={tool.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
```

Replace with:

```tsx
      {/* ── 5. Featured Tools ─────────────────────────────────────────────── */}
      <section className="bg-surface-info py-16 lg:py-24" aria-labelledby="tools-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
                Free Tools
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              </div>
              <h2
                id="tools-heading"
                className="font-sans font-bold text-3xl lg:text-4xl text-neutral-950 leading-tight tracking-tight"
              >
                Interactive Accident Tools
              </h2>
              <p className="font-serif italic text-sm text-neutral-500 mt-1">
                For informational purposes only — not legal advice.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all tools
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Tool rows */}
          <div className="flex flex-col gap-3">
            {FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                data-animate="tool-card"
                className="group flex items-center gap-4 bg-white border border-[#ddeef7] rounded-[14px] px-[22px] py-[18px] hover:border-primary-200 hover:shadow-[0_4px_16px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div className="w-[46px] h-[46px] rounded-[12px] bg-[#eff8fd] border border-[#cce9f6] flex items-center justify-center shrink-0 text-primary-500">
                  {TOOL_ICONS[tool.slug]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm text-neutral-950 leading-snug">
                    {tool.title}
                  </p>
                  <p className="font-serif text-xs text-neutral-500 leading-relaxed mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors whitespace-nowrap shrink-0">
                  Try It Free
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>
```

### Step 3: Remove the now-unused `ToolCard` import

- [ ] Find this import near the top of `app/page.tsx`:

```tsx
import { ToolCard } from '@/components/content/ToolCard'
```

Remove it. `ToolCard` is no longer referenced in this file.

### Step 4: Type-check

- [ ] Run:

```bash
npx tsc --noEmit
```

Expected: no errors. If you see "Property 'icon' does not exist" it means the old `FEATURED_TOOLS` type still has an `icon` field somewhere — double-check Step 1 replaced the full block.

### Step 5: Build check

- [ ] Run:

```bash
npm run build
```

Expected: clean build. `/` still listed as a static route (`○`). No TypeScript or module errors.

### Step 6: Commit

- [ ] Run:

```bash
git add app/page.tsx
git commit -m "feat: redesign Featured Tools — horizontal row layout with teal icon tiles"
```

---

## Self-Review

**Spec coverage:**
- ✅ `bg-surface-info` background preserved
- ✅ Amber eyebrow "Free Tools" with flanking `<span>` lines
- ✅ `<h2 id="tools-heading">` "Interactive Accident Tools" — Inter 700/800, `text-neutral-950`
- ✅ Serif italic subtext `text-neutral-500`
- ✅ "View all tools →" right-aligned, `text-primary-600`, `ChevronRight`
- ✅ 5 rows, `flex flex-col gap-3`
- ✅ Each row: `<Link>` with `bg-white border border-[#ddeef7] rounded-[14px] px-[22px] py-[18px]`
- ✅ Hover: `border-primary-200 shadow-[0_4px_16px_rgba(40,145,199,0.09)]`
- ✅ Icon tile: `w-[46px] h-[46px] rounded-[12px] bg-[#eff8fd] border-[#cce9f6] text-primary-500`
- ✅ Icon size: `w-[19px] h-[19px]` on each Lucide icon
- ✅ Title: `font-sans font-bold text-sm text-neutral-950`
- ✅ Description: `font-serif text-xs text-neutral-500`
- ✅ CTA: plain text "Try It Free" + `ArrowRight`, `text-primary-600 group-hover:text-primary-700`
- ✅ `data-animate="tool-card"` on each row (GSAP compat)
- ✅ `aria-labelledby="tools-heading"` on section
- ✅ `aria-hidden="true"` on all icons and eyebrow spans
- ✅ `focus-visible` ring on each row
- ✅ `ToolCard` import removed
- ✅ `FEATURED_TOOLS` trimmed to `slug`, `title`, `description`
- ✅ `TOOL_ICONS` lookup added

**Placeholder scan:** None.

**Type consistency:** `TOOL_ICONS` is `Record<string, React.ReactNode>` — accessed via `tool.slug` (string) — consistent throughout.
