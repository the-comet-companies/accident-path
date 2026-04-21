# Trust Row Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 4-badge Trust Row with a split-layout section — dark left panel with brand statement + CTA, and 4 amber-icon columns on the right.

**Architecture:** All changes are confined to `app/page.tsx` (Trust Row markup replaced inline) and `components/home/HomeAnimations.tsx` (GSAP selector swap). No new component files needed — the section is a one-off layout. `TrustBadge` component is untouched.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, GSAP (already installed), lucide-react (already installed)

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Replace Trust Row section (lines 219–235) with split layout |
| Modify | `components/home/HomeAnimations.tsx` | Swap `trust-badge` selector for `trust-left` + `trust-item` |

---

## Task 1: Replace Trust Row markup in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx:219-235`

- [ ] **Step 1: Confirm `ArrowRight` is already imported**

Check the top of `app/page.tsx`. The import block already has lucide-react icons. `ArrowRight` may not be there — add it if missing.

Find this line:
```tsx
import {
  Car,
  Truck,
  Bike,
  AlertTriangle,
  Briefcase,
  Calculator,
  ClipboardList,
  DollarSign,
  FileText,
  BookOpen,
  CheckCircle,
  Search,
  Users,
  ChevronRight,
} from 'lucide-react'
```

Replace with (adds `Shield`, `Lock`, `Clock`, `BadgeCheck`, `ArrowRight` — removes `ChevronRight` if unused elsewhere, but keep it to be safe):
```tsx
import {
  Car,
  Truck,
  Bike,
  AlertTriangle,
  Briefcase,
  Calculator,
  ClipboardList,
  DollarSign,
  FileText,
  BookOpen,
  CheckCircle,
  Search,
  Users,
  ChevronRight,
  Shield,
  Lock,
  Clock,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
```

- [ ] **Step 2: Replace the Trust Row section**

Find and replace the entire Trust Row section (from the comment to the closing `</section>`):

**Find:**
```tsx
      {/* ── 2. Trust Row ──────────────────────────────────────────────────── */}
      <section className="bg-surface-card border-b border-neutral-100" aria-label="Trust indicators">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              { variant: 'shield' as const, text: 'Attorney-Reviewed Content',  subtext: 'Reviewed for accuracy and compliance' },
              { variant: 'lock'   as const, text: 'Secure & Private',           subtext: 'Your information stays with you'      },
              { variant: 'clock'  as const, text: 'Free — No Obligation',       subtext: 'No pressure, no signup required'      },
              { variant: 'badge'  as const, text: 'California & Arizona',       subtext: 'State-specific guidance'              },
            ].map(({ variant, text, subtext }) => (
              <div key={text} data-animate="trust-badge">
                <TrustBadge variant={variant} text={text} subtext={subtext} size="lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
```

**Replace with:**
```tsx
      {/* ── 2. Trust Row ──────────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white" aria-label="Trust indicators">
        <div className="flex flex-col lg:flex-row">

          {/* Left panel — brand statement */}
          <div
            data-animate="trust-left"
            className="lg:w-[28%] flex-shrink-0 flex flex-col justify-center gap-4 px-8 lg:px-10 py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/[0.08]"
          >
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Why AccidentPath
            </div>
            <p className="font-sans font-bold text-xl lg:text-2xl text-white leading-tight tracking-tight">
              Your path to recovery starts here.
            </p>
            <p className="font-serif italic text-sm text-white/45 leading-relaxed">
              Clear guidance, smart next steps, and help finding the right lawyer if you need one.
            </p>
            <Link
              href="/find-help"
              className="inline-flex items-center gap-2 text-primary-300 text-sm font-semibold font-sans group w-fit"
            >
              Start Free Accident Check
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right panel — 4 trust columns */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Shield,    title: 'Attorney-Reviewed Content', sub: 'Reviewed for accuracy and compliance' },
              { Icon: Lock,      title: 'Secure & Private',          sub: 'Your information stays with you'      },
              { Icon: Clock,     title: 'Free — No Obligation',      sub: 'No pressure, no signup required'      },
              { Icon: BadgeCheck,title: 'California & Arizona',      sub: 'State-specific guidance'              },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                data-animate="trust-item"
                className={[
                  'flex flex-col items-center text-center gap-4 px-6 py-12 lg:py-16',
                  i < 3 ? 'border-r border-white/[0.07]' : '',
                  i < 2 ? 'border-b lg:border-b-0 border-white/[0.07]' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="w-[52px] h-[52px] rounded-[14px] bg-amber-500/[0.12] border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Icon className="w-[22px] h-[22px] text-amber-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-white leading-snug mb-1">{title}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redesign trust row — split layout with brand statement and amber icon columns"
```

---

## Task 2: Update GSAP animations in `HomeAnimations.tsx`

**Files:**
- Modify: `components/home/HomeAnimations.tsx:48`

- [ ] **Step 1: Swap the trust-badge selector**

Find this line in `components/home/HomeAnimations.tsx`:

```ts
      reveal('[data-animate="trust-badge"]', { y: 14, duration: 0.4, stagger: 0.1 })
```

Replace with:

```ts
      reveal('[data-animate="trust-left"]',  { y: 16, duration: 0.5 })
      reveal('[data-animate="trust-item"]',  { y: 14, duration: 0.4, stagger: 0.1 }, '[data-animate="trust-item"]')
```

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
git commit -m "fix: update trust row GSAP selectors — trust-left and trust-item"
```

---

## Self-Review

**Spec coverage:**
- ✅ `bg-primary-900` throughout — seamless with hero
- ✅ Left panel: amber eyebrow with leading line, Inter 700 heading, Merriweather italic subtext, text link CTA → `/find-help` with ArrowRight + hover translate
- ✅ Right panel: 4 columns, amber rounded-square icon tiles (`52px`, `rounded-[14px]`, `bg-amber-500/[0.12]`, `border-amber-500/25`), white title, `text-white/40` subtext
- ✅ Vertical dividers `border-white/[0.07]` between columns
- ✅ Mobile: left panel stacks above, right grid becomes 2×2 (`grid-cols-2 lg:grid-cols-4`)
- ✅ Border-b on mobile grid items (`i < 2`) so top row is separated from bottom row on mobile
- ✅ `TrustBadge` component untouched
- ✅ GSAP selectors updated: `trust-badge` → `trust-left` + `trust-item`
- ✅ `aria-label="Trust indicators"` preserved on section
- ✅ All icons `aria-hidden="true"`
- ✅ No new dependencies

**Placeholder scan:** None found.

**Type consistency:** `Icon` typed as lucide-react component via destructuring — consistent with existing usage in `app/page.tsx`. `Link` already imported from `next/link` at top of file.
