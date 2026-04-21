# How It Works Redesign — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## What We're Building

Replace the current "How It Works" section (plain light background, number circle + icon box side-by-side, left-aligned text) with a premium dark gradient section that bridges the hero/trust dark zone into the lighter sections below. Three centered step columns with frosted icon tiles and numbered badges.

---

## Approved Design

**Background:** `linear-gradient(180deg, #0a2535 0%, #1b4a63 40%, #2e6a88 100%)` — dark teal at the top seamlessly continuing from the trust row, lightening toward the bottom to ease the transition into `bg-surface-card` (Accident Types section).

**Layout:** Full-width section, `max-w-6xl` inner container. Centered heading block above a 3-column step grid, CTA below.

---

## Heading Block

| Element | Details |
|---------|---------|
| Eyebrow | "How It Works" — `text-amber-500`, `text-xs`, `font-semibold`, `uppercase`, `tracking-widest`. 20px amber lines on both sides (`<span>` elements). |
| Heading | "From Accident to Clarity in 3 Steps" — Inter 700, `text-3xl lg:text-4xl`, `text-white`, `leading-tight`, `tracking-tight` |
| Subtext | "Clear guidance, no pressure, no obligation." — Merriweather italic, `text-base`, `text-white/45`, `leading-relaxed` |
| Spacing | `mb-12` below heading block |

---

## Step Columns (3 equal columns)

**Grid:** `grid grid-cols-1 md:grid-cols-3`

**Each column** (`data-animate="step-item"`):

| Element | Details |
|---------|---------|
| Step badge | `w-7 h-7` circle, `bg-white/10 border border-white/25`, step number `text-white text-xs font-bold font-sans` |
| Icon tile | `w-[58px] h-[58px]`, `rounded-[16px]`, `bg-white/[0.08] border border-white/[0.18]`. Icon: `w-[22px] h-[22px]`, `stroke-white/85`, `aria-hidden="true"` |
| Title | Inter 700, `text-sm lg:text-base`, `text-white`, `leading-snug` |
| Description | Merriweather serif italic, `text-sm`, `text-white/48`, `leading-relaxed` |
| Column dividers | Absolutely-positioned `<span>` `right-0 top-[18%] h-[64%] w-px bg-white/10` on columns 0 and 1 (hidden on mobile via `max-md:hidden`) |
| Alignment | `items-center text-center` |
| Padding | `px-6 py-8` per column |

**Icons (lucide-react, already imported):**
1. Step 1 — `Search` (Tell Us What Happened)
2. Step 2 — `CheckCircle` (Get Personalized Guidance)
3. Step 3 — `Users` (Connect With Help if Needed)

**Step content (unchanged):**
1. "Tell Us What Happened" / "Answer a few questions about your accident type, when it happened, and where. Takes about 2 minutes."
2. "Get Personalized Guidance" / "Receive a clear checklist of next steps, key deadlines to know about, and educational resources specific to your situation."
3. "Connect With Help if Needed" / "If you'd like to speak with a lawyer experienced in your situation, we can help connect you. No pressure, no obligation."

---

## CTA

| Element | Details |
|---------|---------|
| Container | `mt-12 text-center pt-8 border-t border-white/10` |
| Button | `<CTAButton href="/find-help" size="lg">` with custom override: `bg-white text-primary-900 hover:bg-primary-50` |

---

## Animation

Re-use existing `data-animate="step-item"` selector already wired in `HomeAnimations.tsx` with `back.out(1.4)` spring-up stagger. No changes needed to `HomeAnimations.tsx`.

Add `data-animate="hiw-heading"` to the heading block and wire a new `reveal` call in `HomeAnimations.tsx`:
```ts
reveal('[data-animate="hiw-heading"]', { y: 20, duration: 0.55 })
```

Trigger: `start: 'top 85%', once: true` (consistent with trust row).

---

## Responsive Behaviour

| Breakpoint | Layout |
|------------|--------|
| Mobile (`< md`) | Single column stack. Column dividers hidden. |
| Tablet/Desktop (`md+`) | 3-column grid. Partial-height dividers between columns. |

---

## Architecture

**Files changed:**

| File | Change |
|------|--------|
| `app/page.tsx` | Replace How It Works section (lines ~291–338) entirely with new markup |
| `components/home/HomeAnimations.tsx` | Add `reveal('[data-animate="hiw-heading"]', ...)` call |

**No new components, no new dependencies.** All icons (`Search`, `CheckCircle`, `Users`) already imported in `app/page.tsx`. `CTAButton` already imported.

---

## Accessibility

- Section keeps `aria-labelledby="how-it-works-heading"` on `<section>`
- `id="how-it-works-heading"` moves to the new `<h2>`
- All icons `aria-hidden="true"`
- Color contrast: white on `#0a2535` ≈ 16:1 ✓, `text-white/48` ≈ 6.2:1 ✓
- CTA: `bg-white text-primary-900` contrast ≈ 14:1 ✓

---

## What Does NOT Change

- The 3 step titles, descriptions, and icons
- Section order on the page (still position 3, between Trust Row and Accident Types)
- `HOW_IT_WORKS` data array in `app/page.tsx`
- All other page sections
