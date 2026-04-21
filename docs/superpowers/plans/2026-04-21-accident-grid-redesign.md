# Accident Type Grid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat white Accident Type Grid (section 4) with a gradient-bridge layout — dark heading zone melting into a light background with a lifted white card panel containing compact icon+title cards using Font Awesome icons.

**Architecture:** All changes are confined to `app/page.tsx` — the section is replaced inline, `FEATURED_ACCIDENTS` array is trimmed, and `ACCIDENT_ICONS` lookup is added. `react-icons` is added as a dependency. No other files are modified.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS v4, react-icons (Font Awesome Solid)

---

## Files

| Action | File | Change |
|--------|------|--------|
| Modify | `app/page.tsx` | Add react-icons imports; trim `FEATURED_ACCIDENTS`; add `ACCIDENT_ICONS`; replace section 4 markup |
| No change | `components/content/AccidentCard.tsx` | Untouched |
| No change | `components/home/HomeAnimations.tsx` | Untouched — existing selectors still match |

---

## Task 1: Install react-icons

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the package**

```bash
npm install react-icons
```

Expected: `react-icons` appears in `package.json` dependencies. No errors.

- [ ] **Step 2: Verify the icons we need are importable**

Run a quick type-check to confirm the imports resolve:

```bash
npx tsc --noEmit
```

Expected: no new errors (project was clean before this change).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-icons dependency"
```

---

## Task 2: Replace Accident Type Grid section in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

### Step 1: Add react-icons imports and remove unused Lucide imports

- [ ] Find the existing Lucide import block at the top of `app/page.tsx` (lines 1–23). It currently includes `Car, Truck, Bike, AlertTriangle, Briefcase` — these were only used for the `FEATURED_ACCIDENTS` icon fields and are now replaced by react-icons.

Replace this import block:

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

With:

```tsx
import {
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
import { FaCar, FaTruck, FaMotorcycle, FaHardHat } from 'react-icons/fa'
import { FaPersonFalling } from 'react-icons/fa6'
```

### Step 2: Update `FEATURED_ACCIDENTS` and add `ACCIDENT_ICONS`

- [ ] Find the existing `FEATURED_ACCIDENTS` constant (starts around line 41). Replace the entire block:

```tsx
const FEATURED_ACCIDENTS = [
  {
    slug: 'car',
    title: 'Car Accidents',
    description:
      'Learn what steps to take, what to document, and what your options may be after a car accident.',
    icon: <Car className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'truck',
    title: 'Truck Accidents',
    description:
      'Commercial truck crashes involve multiple parties. Learn how these cases differ from standard car accidents.',
    icon: <Truck className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'motorcycle',
    title: 'Motorcycle Accidents',
    description:
      'Motorcyclists face unique risks and legal considerations. Understand your options after a crash.',
    icon: <Bike className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'slip-and-fall',
    title: 'Slip & Fall',
    description:
      'Premises liability cases hinge on evidence. Learn what to document and when to act.',
    icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'workplace',
    title: 'Workplace Injuries',
    description:
      "Workers' comp and third-party claims have different rules. Understand your options.",
    icon: <Briefcase className="w-5 h-5" aria-hidden="true" />,
  },
]
```

With:

```tsx
const FEATURED_ACCIDENTS = [
  { slug: 'car',           title: 'Car Accidents'      },
  { slug: 'truck',         title: 'Truck Accidents'    },
  { slug: 'motorcycle',    title: 'Motorcycle'         },
  { slug: 'slip-and-fall', title: 'Slip & Fall'        },
  { slug: 'workplace',     title: 'Workplace Injuries' },
]

const ACCIDENT_ICONS: Record<string, React.ReactNode> = {
  car:             <FaCar           className="w-5 h-5" aria-hidden="true" />,
  truck:           <FaTruck         className="w-5 h-5" aria-hidden="true" />,
  motorcycle:      <FaMotorcycle    className="w-5 h-5" aria-hidden="true" />,
  'slip-and-fall': <FaPersonFalling className="w-5 h-5" aria-hidden="true" />,
  workplace:       <FaHardHat       className="w-5 h-5" aria-hidden="true" />,
}
```

### Step 3: Replace the section 4 markup

- [ ] Find this entire block in `app/page.tsx`:

```tsx
      {/* ── 4. Accident Type Grid ─────────────────────────────────────────── */}
      <section
        className="bg-surface-card py-16 lg:py-24"
        aria-labelledby="accident-types-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2
                id="accident-types-heading"
                className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-2"
              >
                Accident Type Guides
              </h2>
              <p className="font-serif text-neutral-500 text-lg">
                In-depth educational resources for the most common accident types.
              </p>
            </div>
            <Link
              href="/accidents"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all accident types
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_ACCIDENTS.map((accident) => (
              <div key={accident.slug} data-animate="accident-card">
                <AccidentCard
                  title={accident.title}
                  description={accident.description}
                  href={`/accidents/${accident.slug}`}
                  icon={accident.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
```

Replace with:

```tsx
      {/* ── 4. Accident Type Grid ─────────────────────────────────────────── */}
      <section
        className="py-16 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #1a5470 0%, #1a5470 14%, #1f6b90 28%, #9dc9e2 50%, #d4eaf5 66%, #EAF6FB 80%, #f3f6f9 100%)' }}
        aria-labelledby="accident-types-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading block */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-4">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              What Happened?
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h2
              id="accident-types-heading"
              className="font-sans font-bold text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3"
            >
              Accident Type Guides
            </h2>
            <p className="font-serif italic text-base text-white/45 leading-relaxed max-w-xl mx-auto">
              In-depth educational resources for the most common accident types.
            </p>
          </div>

          {/* Lifted white card panel */}
          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] border border-white/60 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {FEATURED_ACCIDENTS.map((accident) => (
                <Link
                  key={accident.slug}
                  href={`/accidents/${accident.slug}`}
                  data-animate="accident-card"
                  className="group flex flex-col items-center text-center gap-2 p-4 rounded-xl hover:bg-primary-50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <div className="w-11 h-11 rounded-[11px] bg-primary-50 group-hover:bg-white flex items-center justify-center text-primary-500 shrink-0 transition-colors">
                    {ACCIDENT_ICONS[accident.slug]}
                  </div>
                  <span className="font-sans font-semibold text-sm text-neutral-950 leading-snug">
                    {accident.title}
                  </span>
                  <span className="text-[10px] text-neutral-300 group-hover:text-primary-500 transition-colors" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* View all link */}
          <div className="text-center mt-6">
            <Link
              href="/accidents"
              className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all 13 accident types
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

        </div>
      </section>
```

### Step 4: Remove the now-unused `AccidentCard` import

- [ ] Find this import near the top of `app/page.tsx`:

```tsx
import { AccidentCard } from '@/components/content/AccidentCard'
```

Remove it. `AccidentCard` is no longer referenced in the file.

### Step 5: Type-check

- [ ] Run:

```bash
npx tsc --noEmit
```

Expected: no errors. If you see "Cannot find module 'react-icons/fa6'" it means the package wasn't installed correctly — re-run `npm install react-icons`.

### Step 6: Build check

- [ ] Run:

```bash
npm run build
```

Expected: clean build. `/` still listed as a static route (`○`). No TypeScript or module errors.

### Step 7: Commit

- [ ] Run:

```bash
git add app/page.tsx
git commit -m "feat: redesign Accident Type Grid — gradient bridge, compact FA icon cards"
```

---

## Self-Review

**Spec coverage:**
- ✅ Gradient `linear-gradient(180deg, #1a5470 0%, #1a5470 14%, #1f6b90 28%, #9dc9e2 50%, #d4eaf5 66%, #EAF6FB 80%, #f3f6f9 100%)` via `style` prop
- ✅ Eyebrow "What Happened?" — amber, flanking `<span>` lines, `aria-hidden`
- ✅ `<h2 id="accident-types-heading">` "Accident Type Guides" — white, Inter 700, text-3xl/4xl
- ✅ Subtext — Merriweather italic, `text-white/45`
- ✅ White lifted panel — `bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] border border-white/60 p-6`
- ✅ Grid — `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2`
- ✅ Compact cards — icon tile + title + hover arrow `→`
- ✅ Icon tile — `w-11 h-11 rounded-[11px] bg-primary-50 group-hover:bg-white text-primary-500`
- ✅ `data-animate="accident-card"` on each card (GSAP compat)
- ✅ `FaCar`, `FaTruck`, `FaMotorcycle`, `FaPersonFalling`, `FaHardHat`
- ✅ "View all 13 accident types" link — `text-primary-600`, `ChevronRight`
- ✅ `aria-labelledby="accident-types-heading"` on section
- ✅ Icon `aria-hidden="true"` on each FA icon
- ✅ `AccidentCard` import removed
- ✅ Unused Lucide imports (`Car, Truck, Bike, AlertTriangle, Briefcase`) removed
- ✅ `FEATURED_ACCIDENTS` trimmed to `slug` + `title` only
- ✅ `ACCIDENT_ICONS` lookup added

**Placeholder scan:** None.

**Type consistency:** `ACCIDENT_ICONS` is `Record<string, React.ReactNode>` — accessed via `accident.slug` (string) — consistent throughout.
