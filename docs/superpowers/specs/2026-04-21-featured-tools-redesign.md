# Featured Tools Redesign — Spec

## Goal

Replace the current Featured Tools section (section 5) on the home page — a flat `bg-surface-info` grid of `ToolCard` column cards — with a full-width row layout: each tool gets a horizontal card (icon tile + title + description + plain text CTA link).

## Context

- **Preceding section (Accident Grid):** gradient ends at `#f3f6f9` — transitions naturally into `#EAF6FB`
- **Following section (Educational Guides):** `bg-surface-card` (white)
- **Current problem:** `xl:grid-cols-5` column cards feel generic and don't match the upgraded aesthetic of surrounding sections

---

## Design

### Background

`bg-surface-info` (`#EAF6FB`) — existing Tailwind token, no change needed.

### Heading Block

Left-aligned heading, "View all tools →" right-aligned in the same row:

- **Eyebrow:** "Free Tools" — amber (`text-amber-500`), flanking `<span>` lines (`bg-amber-500`), `text-xs font-semibold uppercase tracking-widest font-sans`
- **`<h2>`:** "Interactive Accident Tools" — `font-sans font-bold text-3xl lg:text-4xl text-neutral-950 leading-tight tracking-tight`
- **Subtext:** "For informational purposes only — not legal advice." — `font-serif italic text-sm text-neutral-500`
- **"View all tools →" link:** right-aligned, `text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors`, includes `<ChevronRight className="w-4 h-4" />`
- **Container:** `flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6`

### Tool Rows

5 rows, stacked vertically with `flex flex-col gap-3`. Each row is a `<Link>`:

```
group flex items-center gap-4 bg-white border border-[#ddeef7] rounded-[14px] p-[18px_22px]
hover:border-primary-200 hover:shadow-[0_4px_16px_rgba(40,145,199,0.09)] transition-all duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
```

**Icon tile:**
```
w-[46px] h-[46px] rounded-[12px] bg-[#eff8fd] border border-[#cce9f6]
flex items-center justify-center shrink-0
```
Icon: Lucide, `w-[19px] h-[19px] text-primary-500`, `aria-hidden="true"`

**Text block** (`flex-1 min-w-0`):
- Title: `font-sans font-bold text-sm text-neutral-950 leading-snug`
- Description: `font-serif text-xs text-neutral-500 leading-relaxed mt-0.5`

**CTA** (right side, shrink-0):
```
inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600
group-hover:text-primary-700 transition-colors whitespace-nowrap
```
Content: `Try It Free` + `<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />`

**`data-animate="tool-card"`** on each row `<Link>` — existing GSAP stagger in `HomeAnimations.tsx` continues to work unchanged.

### Accessibility

- `<section aria-labelledby="tools-heading">` preserved
- `id="tools-heading"` on `<h2>` preserved
- Each row is a `<Link>` — keyboard navigable, focus-visible ring applied
- Icon `aria-hidden="true"` on each Lucide icon
- Eyebrow `<span>` lines get `aria-hidden="true"`
- CTA `ArrowRight` gets `aria-hidden="true"`

---

## FEATURED_TOOLS Array

The existing `FEATURED_TOOLS` array in `app/page.tsx` has `icon` (Lucide JSX) fields. The icon JSX moves inline into the map — the array is trimmed to `slug`, `title`, `description` only. A `TOOL_ICONS` lookup is added (same pattern as `ACCIDENT_ICONS`):

```tsx
const FEATURED_TOOLS = [
  { slug: 'statute-of-limitations', title: 'Statute of Limitations Calculator', description: 'Understand the filing deadlines that may apply to your accident type in California or Arizona.' },
  { slug: 'evidence-checklist',      title: 'Evidence Checklist Generator',      description: 'Get a personalized checklist of evidence to gather based on your specific accident type.'   },
  { slug: 'medical-cost-estimator',  title: 'Medical Cost Estimator',            description: 'Understand the range of typical medical costs associated with common injury types.'           },
  { slug: 'insurance-claim-tracker', title: 'Insurance Claim Tracker',           description: 'Track your claim status, deadlines, and communications with your insurance company.'        },
  { slug: 'injury-journal',          title: 'Injury Journal',                    description: 'Document your symptoms, treatments, and daily impact. Detailed records can matter in your recovery.' },
]

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'statute-of-limitations': <Calculator    className="w-[19px] h-[19px]" aria-hidden="true" />,
  'evidence-checklist':     <ClipboardList className="w-[19px] h-[19px]" aria-hidden="true" />,
  'medical-cost-estimator': <DollarSign    className="w-[19px] h-[19px]" aria-hidden="true" />,
  'insurance-claim-tracker':<FileText      className="w-[19px] h-[19px]" aria-hidden="true" />,
  'injury-journal':         <BookOpen      className="w-[19px] h-[19px]" aria-hidden="true" />,
}
```

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Trim `FEATURED_TOOLS`; add `TOOL_ICONS`; replace section 5 markup with row layout |
| No change | `components/content/ToolCard.tsx` | Untouched — used on `/tools` index page |
| No change | `components/home/HomeAnimations.tsx` | `tool-card` selector still matches `data-animate="tool-card"` on each row |

---

## GSAP Animations (Unchanged)

Existing selector in `HomeAnimations.tsx` continues to work:

```ts
reveal('[data-animate="tool-card"]', { y: 20, stagger: 0.08 })
```

Each row `<Link>` gets `data-animate="tool-card"`.

---

## What Changes vs Current

| Current | New |
|---------|-----|
| `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5` | `flex flex-col gap-3` (stacked rows) |
| `<ToolCard>` component wrapper | Inline `<Link>` row |
| Amber icon tile (`bg-amber-50 text-amber-600`) | Teal icon tile (`bg-[#eff8fd] border-[#cce9f6] text-primary-500`) |
| "Try It Free" as link inside card | Plain teal text CTA right-aligned in row |
| Left-aligned heading, no eyebrow | Amber eyebrow + heading left / "View all" right |
| Column card layout with description below icon | Horizontal: icon → title+desc → CTA |
