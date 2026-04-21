# Trust Row Redesign — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## What We're Building

Replace the current Trust Row (4 centered TrustBadge components on a white card background) with a premium split-layout section that flows seamlessly from the hero and adds a brand statement + CTA alongside the trust signals.

---

## Approved Design

**Layout:** Full-width split section — dark left panel (28%) + 4-column trust grid (72%).

**Background:** `bg-primary-900` (`#0C2D3E`) throughout — same as the hero, creating a unified dark zone at the top of the page before transitioning to the light `bg-surface-page` in "How It Works".

---

## Left Panel (28% width)

| Element | Details |
|---------|---------|
| Eyebrow | "Why AccidentPath" — `text-amber-500`, `text-xs`, `font-semibold`, `uppercase`, `tracking-widest`. Preceded by a 20px amber horizontal line (`::before` or inline `<span>`). |
| Heading | "Your path to recovery starts here." — Inter 700, `text-2xl`, `text-white`, `leading-tight`, `tracking-tight` |
| Subtext | "Clear guidance, smart next steps, and help finding the right lawyer if you need one." — Merriweather italic, `text-sm`, `text-white/45`, `leading-relaxed` |
| CTA | Text link + arrow: "Start Free Accident Check" → `/find-help`. `text-primary-300`, `font-semibold`, `text-sm`. Arrow icon (`ArrowRight`, lucide-react, `w-4 h-4`) animates `translate-x-1` on hover. |
| Right border | `border-r border-white/[0.08]` — separates left panel from right grid |
| Padding | `py-12 lg:py-16 px-10` |

---

## Right Panel (72% width — 4 equal columns)

Each column:

| Element | Details |
|---------|---------|
| Icon tile | `w-13 h-13` (`52px`) rounded square (`rounded-[14px]`), `bg-amber-500/[0.12]`, `border border-amber-500/25`. Icon: `w-[22px] h-[22px]`, `text-amber-500` (lucide-react). |
| Title | Inter 600, `text-sm`, `text-white`, `leading-snug` |
| Subtext | `text-[11px]`, `text-white/40`, `leading-relaxed` |
| Column dividers | `border-r border-white/[0.07]` on all columns except last |
| Padding | `py-12 px-6` per column, centered (`items-center text-center`) |

**4 trust signals (unchanged content):**
1. Shield icon — "Attorney-Reviewed Content" / "Reviewed for accuracy and compliance"
2. Lock icon — "Secure & Private" / "Your information stays with you"
3. Clock icon — "Free — No Obligation" / "No pressure, no signup required"
4. BadgeCheck icon — "California & Arizona" / "State-specific guidance"

---

## Architecture

### Files Changed

| File | Change |
|------|--------|
| `app/page.tsx` | Replace Trust Row section markup entirely. New split layout rendered inline (no new component needed — it's a one-off section). |
| `components/ui/TrustBadge.tsx` | **Not touched.** TrustBadge is still used elsewhere; the Trust Row no longer uses it but the component stays. |

### No New Dependencies
All icons already available via lucide-react (`Shield`, `Lock`, `Clock`, `BadgeCheck`, `ArrowRight`).

---

## Responsive Behaviour

| Breakpoint | Layout |
|------------|--------|
| Mobile (`< lg`) | Single column — left panel stacks above right grid. Right grid becomes 2×2. |
| Desktop (`lg+`) | Side-by-side split: left 28%, right 72% with 4 columns. |

---

## Animation

The existing `data-animate="trust-badge"` GSAP scroll trigger in `HomeAnimations.tsx` targets the old TrustBadge wrappers. The new markup will use `data-animate="trust-item"` on each of the 4 column divs, and `data-animate="trust-left"` on the left panel.

`HomeAnimations.tsx` must be updated:
- Remove: `reveal('[data-animate="trust-badge"]', ...)`
- Add: `reveal('[data-animate="trust-left"]', { y: 16, duration: 0.5 })`
- Add: `reveal('[data-animate="trust-item"]', { y: 14, duration: 0.4, stagger: 0.1 })`

---

## Accessibility

- Section keeps `aria-label="Trust indicators"`
- Icons have `aria-hidden="true"`
- CTA link has descriptive text ("Start Free Accident Check") — no additional aria-label needed
- Color contrast: white text on `#0C2D3E` = 13.2:1 ✓, `text-white/40` on `#0C2D3E` ≈ 5.4:1 ✓

---

## What Does NOT Change

- Section order on the page (still position 2, between hero and How It Works)
- The 4 trust signal labels and subtexts
- `TrustBadge` component (untouched)
- All other page sections
