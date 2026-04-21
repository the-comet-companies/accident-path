# Accident Type Grid Redesign — Spec

## Goal

Replace the current flat `bg-surface-card` Accident Type Grid (section 4) with a dramatic-reveal layout that seamlessly transitions from the How It Works section above it and flows naturally into the Featured Tools section below.

## Context

- **Preceding section (How It Works):** ends with `background: linear-gradient(180deg, #0C2D3E 0%, #0f3d55 50%, #1a5470 100%)` — bottom color is `#1a5470`
- **Following section (Featured Tools):** `bg-surface-info` = `#EAF6FB`
- **Current problem:** abrupt jump to `bg-surface-card` (#FFFFFF) is jarring

---

## Design

### Background

```css
linear-gradient(180deg,
  #1a5470 0%,
  #1a5470 14%,
  #1f6b90 28%,
  #9dc9e2 50%,
  #d4eaf5 66%,
  #EAF6FB 80%,
  #f3f6f9 100%
)
```

Applied via `style` prop on `<section>` (not a Tailwind bg class — gradient is too specific).

### Heading Block

- **Eyebrow:** "What Happened?" — amber (`text-amber-500`), flanking `<span>` lines (`bg-amber-500`), `text-xs font-semibold uppercase tracking-widest font-sans`
- **`<h2>`:** "Accident Type Guides" — `text-white font-sans font-bold text-3xl lg:text-4xl leading-tight tracking-tight`
- **Subtext:** "In-depth educational resources for the most common accident types." — `font-serif italic text-base text-white/45 leading-relaxed max-w-xl mx-auto`
- **Container:** `text-center mb-10`
- **`id="accident-types-heading"`** preserved on `<h2>` (existing GSAP `#accident-types-heading` animation still works)

### Card Panel

White lifted panel containing the 5 compact cards:

```
bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] border border-white/60 p-6
```

### Compact Cards

Each card is a `<Link>` (replaces the `<AccidentCard>` wrapper — no changes to `AccidentCard.tsx`):

```
group flex flex-col items-center text-center gap-2 p-4 rounded-xl
hover:bg-primary-50 transition-colors duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
```

**Icon tile:**
```
w-11 h-11 rounded-[11px] bg-primary-50 group-hover:bg-white flex items-center justify-center text-primary-500 shrink-0 transition-colors
```
Icon size: `className="w-5 h-5"` on the react-icons component.

**Title:**
```
font-sans font-semibold text-sm text-neutral-950 leading-snug
```

**Hover arrow:**
```
text-[10px] text-neutral-300 group-hover:text-primary-500 transition-colors
```
Content: `→`

**Grid:** `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2`

**`data-animate="accident-card"`** on each `<Link>` (existing GSAP stagger still works).

### Icons (react-icons — Font Awesome Solid)

| Accident | Import |
|----------|--------|
| Car Accidents | `FaCar` from `react-icons/fa` |
| Truck Accidents | `FaTruck` from `react-icons/fa` |
| Motorcycle | `FaMotorcycle` from `react-icons/fa` |
| Slip & Fall | `FaPersonFalling` from `react-icons/fa6` |
| Workplace | `FaHardHat` from `react-icons/fa` |

Note: `FaPersonFalling` is in `react-icons/fa6` (Font Awesome 6). All others are `react-icons/fa` (Font Awesome 5).

### "View All" Link

Below the card panel, centered:

```
inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-600
hover:text-primary-700 transition-colors mt-6
```

Content: `View all 13 accident types` + `<ChevronRight className="w-4 h-4" />`

---

## FEATURED_ACCIDENTS Array Update

The existing `FEATURED_ACCIDENTS` array in `app/page.tsx` has `icon` (Lucide JSX) and `description` fields — neither is needed in the compact card design. Update the array to remove both, keeping only `slug` and `title`. Icons are rendered inline in the map via a `slug → react-icons component` lookup:

```tsx
const ACCIDENT_ICONS: Record<string, React.ReactNode> = {
  car:        <FaCar       className="w-5 h-5" aria-hidden="true" />,
  truck:      <FaTruck     className="w-5 h-5" aria-hidden="true" />,
  motorcycle: <FaMotorcycle className="w-5 h-5" aria-hidden="true" />,
  'slip-and-fall': <FaPersonFalling className="w-5 h-5" aria-hidden="true" />,
  workplace:  <FaHardHat   className="w-5 h-5" aria-hidden="true" />,
}
```

Updated `FEATURED_ACCIDENTS`:
```tsx
const FEATURED_ACCIDENTS = [
  { slug: 'car',          title: 'Car Accidents'      },
  { slug: 'truck',        title: 'Truck Accidents'    },
  { slug: 'motorcycle',   title: 'Motorcycle'         },
  { slug: 'slip-and-fall',title: 'Slip & Fall'        },
  { slug: 'workplace',    title: 'Workplace Injuries' },
]
```

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Replace section 4 (Accident Type Grid) with new gradient layout + compact cards |
| Modify | `app/page.tsx` | Add react-icons imports; update `FEATURED_ACCIDENTS` array (remove `icon` + `description` fields); add `ACCIDENT_ICONS` lookup |
| No change | `components/content/AccidentCard.tsx` | Not used in this section — no modifications |
| No change | `components/home/HomeAnimations.tsx` | Existing `#accident-types-heading` + `accident-card` selectors still match |

---

## Dependency

```bash
npm install react-icons
```

`react-icons` is tree-shakeable — only the icons imported are included in the bundle.

---

## GSAP Animations (Unchanged)

Existing selectors in `HomeAnimations.tsx` continue to work:

```ts
reveal('#accident-types-heading', { y: 20 })
reveal('[data-animate="accident-card"]', { y: 26, duration: 0.45, stagger: 0.09 })
```

The `<h2 id="accident-types-heading">` is preserved. Each compact card `<Link>` gets `data-animate="accident-card"`.

---

## Accessibility

- `<section aria-labelledby="accident-types-heading">` preserved
- `id="accident-types-heading"` on `<h2>` preserved
- Icon components get `aria-hidden="true"`
- All cards are `<Link>` — keyboard navigable, focus-visible ring applied
- Eyebrow `<span>` lines get `aria-hidden="true"`

---

## What Changes vs Current

| Current | New |
|---------|-----|
| `bg-surface-card` flat white section | Gradient bridge from HIW → light |
| `AccidentCard` component (with description) | Inline compact Link (icon + title only) |
| Lucide icons (car = truck visually) | react-icons FA Solid (distinct vehicle silhouettes) |
| Left-aligned heading + "View all" in header row | Centered heading block above lifted white panel |
| `xl:grid-cols-5` loose grid | Compact cards inside white panel `lg:grid-cols-5` |
