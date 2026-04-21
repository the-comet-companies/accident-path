# Hero Motion Graphic — Design Spec

**Date:** 2026-04-21
**Status:** Approved

---

## What We're Building

Replace the static right-column of the hero section (`app/page.tsx`) with an animated visual: a floating 3D-style shield over a dense particle network background. The left column (copy, CTAs, disclaimer) is unchanged.

---

## Approved Design

**Direction:** CSS 3D + SVG shield + Canvas particle network. No Three.js.

**Why CSS 3D + SVG (not Three.js):**
- 90+ Lighthouse is a hard project requirement — Three.js (~150kb) risks dropping the performance score
- Particles already provide sufficient motion richness
- Brand is "calm, sharp, trustworthy" — not portfolio/gaming
- GSAP already installed; zero new dependencies needed

---

## Visual Components

### 1. Particle Network (Canvas)
- 110 particles, teal-blue (`rgba(75,168,212, 0.25–0.7)`)
- Connections drawn between particles within 100px, opacity fades with distance (`rgba(40,145,199, 0–0.28)`)
- Each particle: `r: 0.8–2.3px`, velocity `±0.35px/frame`, bounces off edges
- Canvas fills the entire hero section (`position: absolute; inset: 0; z-index: 1`)
- Respects `prefers-reduced-motion` — particles freeze (no animation), connections still render

### 2. Vignette Overlay
- `radial-gradient` from transparent at left-center to `rgba(12,45,62, 0.72)` at edges
- Grounds the left text content, prevents particles from competing with copy
- `z-index: 2`, pointer-events none

### 3. Shield (SVG + CSS 3D)
- Positioned in the right half of the hero, centered vertically
- SVG shield shape with:
  - Body fill: linear gradient `#4BA8D4 → #1A5F85 → #0C2D3E`
  - Glass sheen: white-to-transparent vertical overlay (`opacity 0.14 → 0`)
  - Border: `rgba(75,168,212, 0.5)` stroke
  - Inner border: `rgba(255,255,255, 0.07)` inset
  - Checkmark: amber→green gradient (`#E08A2E → #2AB07E`), 7px stroke, GSAP glow filter
- **Float animation (GSAP):** `y: 0 → -14px`, `rotateY: 0 → 7deg`, `rotateX: 2 → -2deg`, 5s ease-in-out, yoyo repeat
- **Drop shadow:** `drop-shadow(0 0 40px rgba(40,145,199,0.55)) drop-shadow(0 0 80px rgba(40,145,199,0.2))`

### 4. Glow Halo
- Radial gradient circle behind the shield (`rgba(40,145,199,0.2)` center → transparent)
- CSS `animation: scale(0.9)→scale(1.2)`, 4s ease-in-out alternate, infinite

### 5. Orbit Rings
- Two concentric circles centered on the shield
- Ring 1: 210px, `rgba(40,145,199,0.15)`, 20s clockwise spin
- Ring 2: 290px, `rgba(224,138,46,0.10)`, 32s counter-clockwise spin
- Each ring has a single colored dot at its leading edge (teal dot on ring 1, amber dot on ring 2)

---

## Component Architecture

### New file: `components/home/HeroVisual.tsx`
`'use client'` component. Encapsulates all animation logic (canvas particle loop + GSAP shield float). Renders:
- `<canvas>` for particles
- Vignette `<div>`
- Glow halo + orbit rings + shield SVG

Props: none (self-contained).

### Updated: `components/home/HomeAnimations.tsx`
Remove the existing hero-card GSAP animation (the card is being replaced). Keep all scroll-triggered section animations untouched.

### Updated: `app/page.tsx`
In the hero section, replace the existing right-column `<div>` (the "What You'll Get" glass card) with `<HeroVisual />`.

---

## Accessibility

- Canvas has `aria-hidden="true"` — decorative only
- Shield SVG has `aria-hidden="true"`
- `prefers-reduced-motion`: particle `requestAnimationFrame` loop does not start; GSAP float animation skips via `gsap.matchMedia`
- No color-only information conveyed by the graphic

---

## Performance

- Single `<canvas>` element, one `requestAnimationFrame` loop
- Canvas cleared and redrawn each frame (no retained objects)
- GSAP float: CSS transform only (compositor layer, no layout)
- No new npm dependencies
- Estimated bundle impact: ~0kb (canvas + SVG + GSAP already present)

---

## What Does NOT Change

- Hero left column: eyebrow, h1, body copy, CTAs, disclaimer — identical to current
- All other page sections: Trust Row, How It Works, Accident Grid, Tools, Guides, State Selector
- `HomeAnimations.tsx` scroll-triggered animations for all sections below the hero
- `app/layout.tsx`, Header, Footer, MobileNav — untouched
