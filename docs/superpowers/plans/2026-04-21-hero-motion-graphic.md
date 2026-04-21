# Hero Motion Graphic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "What You'll Get" card in the hero right column with an animated CSS 3D shield floating over a dense particle network canvas.

**Architecture:** A new `'use client'` component `HeroVisual` is absolutely positioned inside the hero `<section>`, rendering a Canvas particle loop and GSAP-animated SVG shield. The hero section gains `relative overflow-hidden`. The right grid column becomes an empty spacer so left copy stays left-aligned. `HomeAnimations` loses two dead selectors (`hero-card`, `hero-card-item`).

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, GSAP (already installed), Canvas API

---

## Files

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `components/home/HeroVisual.tsx` | Canvas particles + glow halo + orbit rings + shield SVG + GSAP float |
| Modify | `components/home/HomeAnimations.tsx` | Remove dead `hero-card` / `hero-card-item` animation lines |
| Modify | `app/page.tsx` | Section becomes `relative overflow-hidden`, import + mount `HeroVisual`, replace right column with spacer |

---

## Task 1: Create `HeroVisual.tsx`

**Files:**
- Create: `components/home/HeroVisual.tsx`

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PARTICLE_COUNT = 110
const MAX_DIST = 100
const SPEED = 0.35

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; opacity: number
}

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r: Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.45 + 0.25,
  }
}

export function HeroVisual() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const shieldRef  = useRef<HTMLDivElement>(null)
  const haloRef    = useRef<HTMLDivElement>(null)
  const orbit1Ref  = useRef<HTMLDivElement>(null)
  const orbit2Ref  = useRef<HTMLDivElement>(null)
  const rafRef     = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0, H = 0, particles: Particle[] = []

    function resize() {
      W = canvas!.width  = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H))
    }

    function renderFrame(animate: boolean) {
      ctx!.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            ctx!.beginPath()
            ctx!.strokeStyle = `rgba(40,145,199,${0.28 * (1 - dist / MAX_DIST)})`
            ctx!.lineWidth = 0.7
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(75,168,212,${p.opacity})`
        ctx!.fill()
        if (animate) {
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
        }
      })
      if (animate) rafRef.current = requestAnimationFrame(() => renderFrame(true))
    }

    resize()
    renderFrame(!reduced)

    const onResize = () => { resize(); if (reduced) renderFrame(false) }
    window.addEventListener('resize', onResize)

    if (!reduced) {
      gsap.to(shieldRef.current, {
        y: -14, rotateY: 7, rotateX: -2,
        duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to(haloRef.current, {
        scale: 1.2, opacity: 1,
        duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1,
      })
      gsap.to(orbit1Ref.current, { rotation: 360,  duration: 20, ease: 'none', repeat: -1 })
      gsap.to(orbit2Ref.current, { rotation: -360, duration: 32, ease: 'none', repeat: -1 })
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf([shieldRef.current, haloRef.current, orbit1Ref.current, orbit2Ref.current])
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Vignette — keeps left copy readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 50%, transparent 40%, rgba(12,45,62,0.72) 100%)' }}
      />

      {/* Shield stage — right half, desktop only */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:flex items-center justify-center">
        {/* Glow halo */}
        <div
          ref={haloRef}
          className="absolute w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(40,145,199,0.2) 0%, transparent 70%)', opacity: 0.7 }}
        />

        {/* Orbit ring 1 — teal, clockwise */}
        <div
          ref={orbit1Ref}
          className="absolute w-[210px] h-[210px] rounded-full border border-primary-500/[0.15]"
        >
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-primary-400"
            style={{ top: '-3px', left: 'calc(50% - 3px)', boxShadow: '0 0 8px rgba(40,145,199,0.9)' }}
          />
        </div>

        {/* Orbit ring 2 — amber, counter-clockwise */}
        <div
          ref={orbit2Ref}
          className="absolute w-[290px] h-[290px] rounded-full border border-amber-500/[0.10]"
        >
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-500"
            style={{ bottom: '-3px', left: 'calc(50% - 3px)', boxShadow: '0 0 8px rgba(224,138,46,0.9)' }}
          />
        </div>

        {/* Shield */}
        <div
          ref={shieldRef}
          className="relative z-10"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(40,145,199,0.55)) drop-shadow(0 0 80px rgba(40,145,199,0.2))',
            transformStyle: 'preserve-3d',
          }}
        >
          <svg width="148" height="178" viewBox="0 0 140 168" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="hv-sg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#4BA8D4" />
                <stop offset="55%"  stopColor="#1A5F85" />
                <stop offset="100%" stopColor="#0C2D3E" />
              </linearGradient>
              <linearGradient id="hv-sg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="hv-ck" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#E08A2E" />
                <stop offset="100%" stopColor="#2AB07E" />
              </linearGradient>
              <filter id="hv-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Body */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="url(#hv-sg1)" />
            {/* Glass sheen */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="url(#hv-sg2)" />
            {/* Outer border */}
            <path d="M70 6L14 28V76C14 109 38 138 70 148C102 138 126 109 126 76V28L70 6Z" fill="none" stroke="rgba(75,168,212,0.5)" strokeWidth="1.5" />
            {/* Inner border */}
            <path d="M70 18L24 36V76C24 103 44 128 70 136C96 128 116 103 116 76V36L70 18Z" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {/* Checkmark */}
            <path d="M46 78L62 94L94 62" stroke="url(#hv-ck)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#hv-glow)" />
          </svg>
        </div>
      </div>
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
git add components/home/HeroVisual.tsx
git commit -m "feat: add HeroVisual component — particle canvas + CSS 3D shield"
```

---

## Task 2: Update `HomeAnimations.tsx` — remove dead selectors

**Files:**
- Modify: `components/home/HomeAnimations.tsx`

The hero-card and hero-card-item elements are being replaced by `HeroVisual`. Remove those two animation lines so GSAP doesn't warn about missing targets.

- [ ] **Step 1: Remove the two dead lines**

In `components/home/HomeAnimations.tsx`, find this block inside the timeline and delete both lines:

```ts
        .from('[data-animate="hero-card"]',    { opacity: 0, x: 32, duration: 0.7  }, '-=0.55')
        .from('[data-animate="hero-card-item"]', {
          opacity: 0, x: 18, duration: 0.4, stagger: 0.13,
        }, '-=0.45')
```

The timeline after the edit should end at `hero-ctas`:

```ts
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from('[data-animate="hero-eyebrow"]', { opacity: 0, y: 12, duration: 0.45 })
        .from('#hero-heading',                 { opacity: 0, y: 28, duration: 0.6  }, '-=0.2')
        .from('[data-animate="hero-body"]',    { opacity: 0, y: 18, duration: 0.5  }, '-=0.3')
        .from('[data-animate="hero-ctas"]',    { opacity: 0, y: 14, duration: 0.4  }, '-=0.25')
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/HomeAnimations.tsx
git commit -m "fix: remove hero-card GSAP animations — replaced by HeroVisual"
```

---

## Task 3: Update `app/page.tsx` — mount HeroVisual, update hero section

**Files:**
- Modify: `app/page.tsx`

Three changes:
1. Import `HeroVisual`
2. Add `relative overflow-hidden` to the hero `<section>`
3. Mount `<HeroVisual />` as first child of the section, add `relative z-10` to the inner container, replace the right-column card div with an empty spacer

- [ ] **Step 1: Add the import**

At the top of `app/page.tsx`, add after the existing `HomeAnimations` import:

```ts
import { HeroVisual } from '@/components/home/HeroVisual'
```

- [ ] **Step 2: Update the hero section**

Find this line:

```tsx
      <section className="bg-primary-900 text-white" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
```

Replace with:

```tsx
      <section className="bg-primary-900 text-white relative overflow-hidden" aria-labelledby="hero-heading">
        <HeroVisual />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
```

- [ ] **Step 3: Replace the right column**

Find and delete the entire right-column div (from the comment to its closing tag):

```tsx
            {/* Right: What You'll Get card */}
            <div
              data-animate="hero-card"
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7"
              aria-label="What you'll get"
            >
              <p className="text-xs font-semibold font-sans uppercase tracking-widest text-primary-300 mb-5">
                What You&apos;ll Get
              </p>
              <ol className="flex flex-col gap-5" role="list">
                {[
                  {
                    title: 'A clear checklist of next steps',
                    desc: 'Specific to your accident type and state.',
                  },
                  {
                    title: 'Your statute-of-limitations deadline',
                    desc: "We'll flag the date you can't miss.",
                  },
                  {
                    title: 'A shortlist of lawyers — if you need one',
                    desc: 'Matched to your case. You decide who to talk to.',
                  },
                ].map(({ title, desc }, i) => (
                  <li key={i} data-animate="hero-card-item" className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-sans font-semibold text-sm text-white">{title}</p>
                      <p className="font-serif text-sm text-primary-200 mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
```

Replace with:

```tsx
            {/* Right: spacer — HeroVisual renders the shield absolutely */}
            <div className="hidden lg:block" aria-hidden="true" />
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: clean build, `/` still listed as static route.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: mount HeroVisual in hero section — particle network + floating shield"
```

---

## Self-Review

**Spec coverage:**
- ✅ Canvas fills entire hero section — `absolute inset-0` on `HeroVisual`, section is `relative overflow-hidden`
- ✅ 110 particles, teal, connections ≤100px, opacity fades with distance
- ✅ Vignette overlay at `z-0` layer
- ✅ Shield: gradient fill, glass sheen, border, inner border, amber→green checkmark glow
- ✅ GSAP float: y -14, rotateY 7, rotateX -2, 5s sine.inOut yoyo
- ✅ Glow halo pulse via GSAP scale+opacity
- ✅ Two orbit rings with colored dots, clockwise/counter-clockwise
- ✅ `prefers-reduced-motion`: no `requestAnimationFrame`, no GSAP tweens
- ✅ `aria-hidden="true"` on canvas and SVG
- ✅ Shield hidden on mobile (`hidden lg:flex` on shield stage)
- ✅ Left hero copy unchanged
- ✅ Dead GSAP selectors removed from `HomeAnimations`
- ✅ No new dependencies

**Placeholder scan:** None found.

**Type consistency:** `HeroVisual` is imported and used consistently. GSAP refs typed as `useRef<HTMLDivElement>` and `useRef<HTMLCanvasElement>`. `makeParticle` returns `Particle` interface used in `renderFrame`.
