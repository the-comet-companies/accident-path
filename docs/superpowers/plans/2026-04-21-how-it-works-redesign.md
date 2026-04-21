# How It Works Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain light-bg "How It Works" section with a dark gradient bridge layout — centered heading, 3 icon-centered step columns with frosted white icon tiles, and a white CTA button.

**Architecture:** All markup changes are confined to `app/page.tsx` (section replaced inline) and `components/home/HomeAnimations.tsx` (one new reveal call added). No new components or dependencies needed — all icons and primitives are already imported.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, lucide-react (already installed)

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Replace How It Works section (lines 291–338) with gradient layout |
| Modify | `components/home/HomeAnimations.tsx` | Add `hiw-heading` reveal call |

---

## Task 1: Replace How It Works section in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx:291-338`

- [ ] **Step 1: Find and replace the entire How It Works section**

Find this block (from the comment to the closing `</section>`):

```tsx
      {/* ── 3. How It Works ───────────────────────────────────────────────── */}
      <section
        className="bg-surface-page py-16 lg:py-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="how-it-works-heading"
              className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-3"
            >
              How AccidentPath Works
            </h2>
            <p className="font-serif text-neutral-500 text-lg max-w-xl mx-auto">
              Three simple steps to go from confusion to clarity after an accident.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ step, icon, title, description }) => (
              <div
                key={step}
                data-animate="step-item"
                className="flex flex-col items-center text-center md:items-start md:text-left gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold font-sans flex items-center justify-center shrink-0">
                    {step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
                    {icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-neutral-950 mb-2">
                    {title}
                  </h3>
                  <p className="font-serif text-neutral-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CTAButton href="/find-help" size="lg">
              Start Your Free Accident Check
            </CTAButton>
          </div>
        </div>
      </section>
```

Replace with:

```tsx
      {/* ── 3. How It Works ───────────────────────────────────────────────── */}
      <section
        className="text-white py-16 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #0a2535 0%, #1b4a63 40%, #2e6a88 100%)' }}
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading block */}
          <div data-animate="hiw-heading" className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-4">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              How It Works
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h2
              id="how-it-works-heading"
              className="font-sans font-bold text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3"
            >
              From Accident to Clarity in 3 Steps
            </h2>
            <p className="font-serif italic text-base text-white/45 leading-relaxed max-w-xl mx-auto">
              Clear guidance, no pressure, no obligation.
            </p>
          </div>

          {/* Step columns */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { step: 1, Icon: Search,      title: 'Tell Us What Happened',       description: 'Answer a few questions about your accident type, when it happened, and where. Takes about 2 minutes.' },
              { step: 2, Icon: CheckCircle, title: 'Get Personalized Guidance',   description: 'Receive a clear checklist of next steps, key deadlines to know about, and educational resources specific to your situation.' },
              { step: 3, Icon: Users,       title: 'Connect With Help if Needed', description: "If you'd like to speak with a lawyer experienced in your situation, we can help connect you. No pressure, no obligation." },
            ].map(({ step, Icon, title, description }, i) => (
              <div
                key={step}
                data-animate="step-item"
                className="relative flex flex-col items-center text-center px-6 py-8"
              >
                {/* Partial-height column divider */}
                {i < 2 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-[18%] h-[64%] w-px bg-white/10 max-md:hidden"
                  />
                )}
                {/* Step badge */}
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0 mb-4">
                  <span className="text-white text-xs font-bold font-sans">{step}</span>
                </div>
                {/* Icon tile */}
                <div className="w-[58px] h-[58px] rounded-[16px] bg-white/[0.08] border border-white/[0.18] flex items-center justify-center shrink-0 mb-4">
                  <Icon className="w-[22px] h-[22px] text-white/85" aria-hidden="true" />
                </div>
                <h3 className="font-sans font-bold text-sm lg:text-base text-white leading-snug mb-2">
                  {title}
                </h3>
                <p className="font-serif italic text-sm text-white/48 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center pt-8 border-t border-white/10">
            <Link
              href="/find-help"
              className="inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold px-8 py-4 text-lg min-h-[52px] bg-white text-primary-900 hover:bg-primary-50 transition-colors duration-150"
            >
              Start Your Free Accident Check
            </Link>
          </div>

        </div>
      </section>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redesign How It Works — gradient bridge bg, frosted icon tiles, centered layout"
```

---

## Task 2: Update GSAP animations in `HomeAnimations.tsx`

**Files:**
- Modify: `components/home/HomeAnimations.tsx`

- [ ] **Step 1: Add the hiw-heading reveal call**

Find this block in `components/home/HomeAnimations.tsx`:

```ts
      // ── How It Works ─────────────────────────────────────────────────────
      reveal('#how-it-works-heading', { y: 20 })
      reveal('[data-animate="step-item"]', { y: 32, duration: 0.55, stagger: 0.15 })
```

Replace with:

```ts
      // ── How It Works ─────────────────────────────────────────────────────
      gsap.fromTo(
        '[data-animate="hiw-heading"]',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.55, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="hiw-heading"]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-animate="step-item"]',
        { opacity: 0, y: 36, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, ease: 'back.out(1.4)', stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: '[data-animate="step-item"]', start: 'top 85%', once: true },
        },
      )
```

Note: The `reveal` helper only supports `y` + `opacity`. The step-item animation needs `scale` so it uses `gsap.fromTo` directly — matching the trust row pattern already in the file.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: clean build, `/` still listed as static route.

- [ ] **Step 4: Commit**

```bash
git add components/home/HomeAnimations.tsx
git commit -m "fix: update How It Works GSAP animations — hiw-heading + step-item spring-up"
```

---

## Self-Review

**Spec coverage:**
- ✅ Gradient background `linear-gradient(180deg, #0a2535 0%, #1b4a63 40%, #2e6a88 100%)`
- ✅ Amber eyebrow "How It Works" with leading + trailing `<span>` lines
- ✅ Inter 700 heading "From Accident to Clarity in 3 Steps"
- ✅ Merriweather italic subtext, `text-white/45`
- ✅ 3 step columns: badge → icon tile → title → description, `items-center text-center`
- ✅ Step badge: `w-7 h-7`, `bg-white/10`, `border-white/25`, white number
- ✅ Icon tile: `w-[58px] h-[58px]`, `rounded-[16px]`, `bg-white/[0.08]`, `border-white/[0.18]`, `text-white/85` icon
- ✅ Partial-height dividers: `absolute right-0 top-[18%] h-[64%] w-px bg-white/10 max-md:hidden` on columns 0 and 1
- ✅ CTA: plain `<Link>` with `bg-white text-primary-900 hover:bg-primary-50`
- ✅ CTA container: `border-t border-white/10`
- ✅ `data-animate="hiw-heading"` on heading block
- ✅ `data-animate="step-item"` preserved on each column
- ✅ `aria-labelledby="how-it-works-heading"` on `<section>`
- ✅ `id="how-it-works-heading"` on `<h2>`
- ✅ All icons `aria-hidden="true"`
- ✅ `HOW_IT_WORKS` data array removed (inlined directly — cleaner, same data)
- ✅ `reveal('#how-it-works-heading', ...)` selector replaced with `hiw-heading` block
- ✅ Step-item animation upgraded to include `scale` (matches trust row pattern)
- ✅ No new dependencies

**Placeholder scan:** None found.

**Type consistency:** `Icon` typed via destructuring from inline array — same pattern as trust row in `app/page.tsx`. `Link` already imported at top of file.
