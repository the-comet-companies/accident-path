# Static Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 static pages — `/about`, `/about/how-it-works`, `/privacy`, `/terms`, `/disclaimers`, `/for-attorneys`, `/contact` — all matching the existing hub hero pattern.

**Architecture:** All server components, no CMS data required. Each page uses the shared `Breadcrumb variant="dark"` + amber-eyebrow + `bg-primary-900` hero pattern established on `/guides`, `/accidents`, and `/tools`. Privacy and Terms are structured legal placeholders. All other pages contain real copy.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS (tokens via `app/globals.css`), `buildMetaTags` from `@/components/seo/MetaTags`, `Breadcrumb` from `@/components/layout/Breadcrumb`.

---

## Pattern Reference

Every page in this project follows this shell. Do not deviate:

```tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({ title: '...', description: '...', canonical: '/route' })

export default function PageName() {
  return (
    <div className="bg-surface-page min-h-screen">
      {/* Hero — always bg-primary-900 */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Page Title' }]} variant="dark" />
          {/* amber eyebrow */}
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Eyebrow Text
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Page Heading
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Subtext
          </p>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        ...
      </div>
    </div>
  )
}
```

Content sections inside the content area use this card:
```tsx
<div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
  <div className="p-8 lg:p-12 space-y-10">
    ...
  </div>
</div>
```

Separator between sections:
```tsx
<hr className="border-neutral-100" />
```

Section heading:
```tsx
<h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Heading</h2>
```

Body text:
```tsx
<p className="font-sans text-neutral-600 leading-relaxed">...</p>
```

---

## File Map

| Route | File | Status |
|-------|------|--------|
| `/about` | `app/about/page.tsx` | Create |
| `/about/how-it-works` | `app/about/how-it-works/page.tsx` | Create |
| `/privacy` | `app/privacy/page.tsx` | Create (new dir) |
| `/terms` | `app/terms/page.tsx` | Create (new dir) |
| `/disclaimers` | `app/disclaimers/page.tsx` | Create (new dir) |
| `/for-attorneys` | `app/for-attorneys/page.tsx` | Create (new dir) |
| `/contact` | `app/contact/page.tsx` | Create (new dir) |

Note: `app/about/` and `app/about/how-it-works/` directories already exist but are empty.

---

## Task 1: `/about` page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'About AccidentPath — Our Mission',
  description:
    'AccidentPath helps accident victims in California and Arizona get clear guidance, understand their options, and connect with qualified attorneys.',
  canonical: '/about',
})

const VALUES = [
  {
    title: 'Educational first.',
    body: 'Every guide, tool, and resource is designed to inform — not to push you toward a decision. You decide what to do with the information.',
  },
  {
    title: 'Compliance always.',
    body: 'We follow California State Bar rules and legal advertising standards. Our content is reviewed for accuracy and compliance before publication.',
  },
  {
    title: 'No pressure.',
    body: "We don't use urgency tactics or fear to drive action. If connecting with an attorney makes sense for your situation, we'll help. If not, we'll tell you that too.",
  },
  {
    title: 'Built for clarity.',
    body: 'We write in plain English. We define terms when we use them. We design every page to be useful on a phone, in a stressful moment.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'About' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Our Mission
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            About AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Clear guidance after an accident — for people who need answers, not jargon.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-10">

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">What We Do</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath is a consumer-first guidance platform for people who have been injured in accidents
                in California and Arizona. We provide plain-language educational resources, interactive tools,
                and referrals to qualified attorneys — without legal jargon, without pressure, and without
                pretending we know the outcome of your case.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Why We Built This</h2>
              <p className="font-sans text-neutral-600 leading-relaxed mb-4">
                After an accident, most people don&apos;t know what to do next. They&apos;re overwhelmed, in pain,
                and dealing with insurance adjusters who know far more than they do. The information that
                exists online is scattered, difficult to trust, and often written for lawyers rather than the
                people who actually need it.
              </p>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath was built to change that. We believe that clear, honest information — delivered
                at the right moment — leads to better decisions and better outcomes for injured people.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Our Approach</h2>
              <ul className="space-y-4">
                {VALUES.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-sans text-neutral-600 leading-relaxed">
                      <span className="font-semibold text-neutral-950">{item.title}</span>{' '}
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Who We Serve</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath currently serves injured people in California and Arizona. Our guides, tools,
                and attorney referrals are specific to these states. We are expanding to additional states
                and will update our coverage as we do.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Important Notice</h2>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                AccidentPath is an educational platform and legal referral service. Nothing on this site
                constitutes legal advice or creates an attorney-client relationship. The information provided
                is for general educational purposes only. Laws vary by jurisdiction and individual
                circumstances. Always consult a qualified attorney for advice specific to your situation.
              </p>
            </section>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/about/how-it-works"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                How AccidentPath Works →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Contact Us →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add /about page"
```

---

## Task 2: `/about/how-it-works` page

**Files:**
- Create: `app/about/how-it-works/page.tsx`

- [ ] **Step 1: Create `app/about/how-it-works/page.tsx`**

```tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'How AccidentPath Works — Step-by-Step Guide',
  description:
    'AccidentPath walks you through your next steps after an accident: clear guidance, free tools, and optional attorney connections in California and Arizona.',
  canonical: '/about/how-it-works',
})

const STEPS = [
  {
    number: '01',
    title: 'Describe Your Situation',
    body: "Start by telling us about your accident type, location, and what has happened so far. There's no account required — your answers guide what we show you next. Everything is confidential and nothing you share is sold to third parties.",
    cta: { label: 'Browse guides', href: '/guides' },
  },
  {
    number: '02',
    title: 'Get Instant, Clear Guidance',
    body: "Based on your situation, we surface the most relevant guides and tools for your specific accident type and state. No 50-tab research session — just the information that matters for your situation right now.",
    cta: { label: 'See all guides', href: '/guides' },
  },
  {
    number: '03',
    title: 'Use Our Free Tools',
    body: 'Our interactive tools help you take concrete action: collect evidence, estimate lost wages, check your statute of limitations deadline, prepare for insurance calls, and document your injuries and treatment. Free, no login required.',
    cta: { label: 'See all tools', href: '/tools' },
  },
  {
    number: '04',
    title: 'Connect With a Qualified Attorney (If You Want To)',
    body: "If your situation may benefit from legal help, we can connect you with attorneys who typically handle matters like yours in your state. This is optional — we'll never pressure you. And we'll always tell you what type of attorney to look for, even if you'd rather find one on your own.",
    cta: { label: 'Get free guidance', href: '/find-help' },
  },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'About', href: '/about' }, { label: 'How It Works' }]}
            variant="dark"
          />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            The Process
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            How AccidentPath Works
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Four steps from &ldquo;I just had an accident&rdquo; to &ldquo;I know what to do next.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-10"
            >
              <div className="flex gap-6 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center">
                  <span className="font-sans font-bold text-amber-400 text-sm">{step.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-sans font-bold text-xl text-neutral-950 mb-3">{step.title}</h2>
                  <p className="font-sans text-neutral-600 leading-relaxed mb-4">{step.body}</p>
                  <Link
                    href={step.cta.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {step.cta.label} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface-card rounded-2xl border border-neutral-100 p-8 text-center">
          <p className="font-sans text-neutral-500 text-sm mb-5 max-w-lg mx-auto">
            This information is for educational purposes only and does not constitute legal advice.
            Use of AccidentPath does not create an attorney-client relationship.
          </p>
          <Link
            href="/find-help"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-sans font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Get Free Guidance →
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/about/how-it-works/page.tsx
git commit -m "feat: add /about/how-it-works page"
```

---

## Task 3: `/privacy` and `/terms` pages (structured legal placeholders)

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`

Both are well-structured placeholders — real section headings and anchor points that legal counsel can fill in, with a clear editorial placeholder note inside each section body.

- [ ] **Step 1: Create `app/privacy/page.tsx`**

```tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Privacy Policy — AccidentPath',
  description:
    'AccidentPath privacy policy: how we collect, use, and protect your personal information when you use our accident guidance platform.',
  canonical: '/privacy',
  noIndex: true,
})

const LAST_UPDATED = 'April 2026'

const SECTIONS = [
  {
    id: 'information-we-collect',
    heading: '1. Information We Collect',
    placeholder:
      'Describe the categories of personal information collected: identifiers (name, email, IP address), usage data (pages visited, tool inputs), device/browser information, and any information submitted through forms or tools. Specify which is collected automatically vs. provided by the user.',
  },
  {
    id: 'how-we-use-information',
    heading: '2. How We Use Your Information',
    placeholder:
      'Describe all purposes for which collected data is used: providing the service, improving the platform, attorney referral matching, analytics, compliance with law, fraud prevention. Specify legal basis for processing where required (e.g., CCPA, CPRA).',
  },
  {
    id: 'sharing-information',
    heading: '3. Sharing Your Information',
    placeholder:
      'List all third parties with whom data is shared: attorney partners (for referral matching), analytics providers (Google Analytics, Microsoft Clarity), hosting providers (Vercel, Supabase), and any others. Clarify that data is not sold to third parties for advertising.',
  },
  {
    id: 'cookies',
    heading: '4. Cookies and Tracking Technologies',
    placeholder:
      'Describe use of cookies, local storage, session storage, pixels, and similar technologies. Include categories: strictly necessary, analytics, functional. Describe opt-out mechanisms available to users.',
  },
  {
    id: 'data-retention',
    heading: '5. Data Retention',
    placeholder:
      'Specify how long different categories of data are retained: session data, form submissions, analytics data, attorney referral records. Include criteria used to determine retention period.',
  },
  {
    id: 'your-rights',
    heading: '6. Your Privacy Rights',
    placeholder:
      'Describe rights available to users under applicable law: CCPA/CPRA (California residents) — right to know, delete, correct, opt out of sale/sharing; COPPA (children under 13); general rights. Include how to submit a privacy request and expected response timeline.',
  },
  {
    id: 'security',
    heading: '7. Security',
    placeholder:
      'Describe technical and organizational measures used to protect personal information. Note that no method of transmission is 100% secure and how users should report suspected security issues.',
  },
  {
    id: 'third-party-links',
    heading: '8. Third-Party Links',
    placeholder:
      'Clarify that AccidentPath may link to external sites not covered by this policy and that users should review the privacy policies of those sites.',
  },
  {
    id: 'changes',
    heading: '9. Changes to This Policy',
    placeholder:
      'Describe how users will be notified of material changes (e.g., updated date on this page, email notice). State that continued use after changes constitutes acceptance.',
  },
  {
    id: 'contact',
    heading: '10. Contact Us',
    placeholder:
      'Provide contact information for privacy inquiries: email address, mailing address, and any designated privacy officer contact. Include response timeframe.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            How we collect, use, and protect your information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12">

            <p className="font-sans text-neutral-400 text-sm mb-8">
              Last updated: {LAST_UPDATED}
            </p>

            <p className="font-sans text-neutral-600 leading-relaxed mb-10">
              AccidentPath (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit accidentpath.com and use our services. Please read this policy carefully.
            </p>

            <nav aria-label="Privacy policy sections" className="mb-10">
              <p className="font-sans font-semibold text-sm text-neutral-950 mb-3">Contents</p>
              <ol className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="font-sans text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-10">
              {SECTIONS.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
                  {index > 0 && <hr className="border-neutral-100 mb-10" />}
                  <h2
                    id={`heading-${section.id}`}
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    {section.heading}
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <p className="font-sans text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
                      Pending Legal Review
                    </p>
                    <p className="font-sans text-sm text-amber-800 leading-relaxed">
                      {section.placeholder}
                    </p>
                  </div>
                </section>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/terms/page.tsx`**

```tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Terms of Service — AccidentPath',
  description:
    'AccidentPath terms of service: the rules and conditions that govern your use of our accident guidance platform and educational tools.',
  canonical: '/terms',
  noIndex: true,
})

const LAST_UPDATED = 'April 2026'

const SECTIONS = [
  {
    id: 'acceptance',
    heading: '1. Acceptance of Terms',
    placeholder:
      'State that by accessing or using AccidentPath, users agree to be bound by these Terms of Service. Include that users who do not agree should not use the service. Specify the effective date and that continued use after updates constitutes acceptance.',
  },
  {
    id: 'description-of-services',
    heading: '2. Description of Services',
    placeholder:
      'Describe AccidentPath as an educational platform and legal referral service. Clarify that we provide general information, interactive tools, and optional referrals to attorneys — and that none of this constitutes legal advice or creates an attorney-client relationship.',
  },
  {
    id: 'no-attorney-client',
    heading: '3. No Attorney-Client Relationship',
    placeholder:
      "Explicitly state that use of AccidentPath does not create an attorney-client relationship between the user and AccidentPath or any attorney listed on the platform. Clarify that information provided is educational only and not a substitute for advice from a licensed attorney familiar with the user's specific facts and jurisdiction.",
  },
  {
    id: 'user-conduct',
    heading: '4. Acceptable Use',
    placeholder:
      'Describe prohibited uses: providing false information, using the platform to harass or harm others, attempting to reverse engineer or scrape the platform, using the service for commercial purposes without authorization, violating any applicable law.',
  },
  {
    id: 'disclaimer-of-warranties',
    heading: '5. Disclaimer of Warranties',
    placeholder:
      'Include a clear disclaimer that the service is provided "as is" and "as available" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose. State that AccidentPath does not warrant that the service will be uninterrupted or error-free.',
  },
  {
    id: 'limitation-of-liability',
    heading: '6. Limitation of Liability',
    placeholder:
      "Set forth the limitation on AccidentPath's liability for damages arising out of use of the service. Include cap on liability, exclusion of consequential damages, and any exceptions required by state law. Confirm compliance with California and Arizona consumer protection laws.",
  },
  {
    id: 'third-party-links',
    heading: '7. Third-Party Links and Services',
    placeholder:
      'Clarify that AccidentPath may link to or display information from third-party websites or services. State that AccidentPath is not responsible for third-party content, privacy practices, or services, and that users access them at their own risk.',
  },
  {
    id: 'intellectual-property',
    heading: '8. Intellectual Property',
    placeholder:
      'State that all content, design, trademarks, and code on AccidentPath are owned by or licensed to AccidentPath. Describe permitted uses (personal, non-commercial) and prohibited uses (reproduction, modification, distribution without permission).',
  },
  {
    id: 'termination',
    heading: '9. Termination',
    placeholder:
      "State AccidentPath's right to suspend or terminate access for violation of these terms or at its discretion, without prior notice. Describe what happens to user data upon termination.",
  },
  {
    id: 'governing-law',
    heading: '10. Governing Law and Disputes',
    placeholder:
      'Specify governing law (California), venue for disputes, and any mandatory arbitration or class action waiver provisions. Confirm compliance with applicable consumer protection requirements. Include notice requirements before filing a claim.',
  },
  {
    id: 'changes',
    heading: '11. Changes to These Terms',
    placeholder:
      'Describe how and when terms may be updated. State that material changes will be indicated by an updated date. Specify that continued use after changes constitutes acceptance.',
  },
  {
    id: 'contact',
    heading: '12. Contact',
    placeholder:
      'Provide contact information for questions about these Terms: email address, mailing address. Include response timeframe.',
  },
]

export default function TermsPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Terms of Service' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Terms of Service
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            The rules and conditions that govern your use of AccidentPath.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12">

            <p className="font-sans text-neutral-400 text-sm mb-8">
              Last updated: {LAST_UPDATED}
            </p>

            <p className="font-sans text-neutral-600 leading-relaxed mb-10">
              Please read these Terms of Service carefully before using AccidentPath. By accessing or
              using our platform, you agree to be bound by these terms. If you do not agree, please
              do not use AccidentPath.
            </p>

            <nav aria-label="Terms of service sections" className="mb-10">
              <p className="font-sans font-semibold text-sm text-neutral-950 mb-3">Contents</p>
              <ol className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="font-sans text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-10">
              {SECTIONS.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
                  {index > 0 && <hr className="border-neutral-100 mb-10" />}
                  <h2
                    id={`heading-${section.id}`}
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    {section.heading}
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <p className="font-sans text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
                      Pending Legal Review
                    </p>
                    <p className="font-sans text-sm text-amber-800 leading-relaxed">
                      {section.placeholder}
                    </p>
                  </div>
                </section>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx
git commit -m "feat: add /privacy and /terms structured legal placeholder pages"
```

---

## Task 4: `/disclaimers` page

Real legal disclaimer content — this page needs actual substance, not placeholders.

**Files:**
- Create: `app/disclaimers/page.tsx`

- [ ] **Step 1: Create `app/disclaimers/page.tsx`**

```tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Legal Disclaimers — AccidentPath',
  description:
    'Important legal disclaimers about AccidentPath: educational information only, no attorney-client relationship, tool limitations, and jurisdiction notice.',
  canonical: '/disclaimers',
})

const DISCLAIMERS = [
  {
    id: 'not-legal-advice',
    heading: 'Educational Information Only — Not Legal Advice',
    body: `All content on AccidentPath — including guides, articles, tool outputs, and any other information — is provided for general educational purposes only. Nothing on this website constitutes legal advice, legal opinions, or legal recommendations. The information is not a substitute for advice from a licensed attorney who is familiar with your specific facts and jurisdiction.

You should not act or refrain from acting based solely on information found on this website without first seeking legal advice from a qualified attorney licensed in your state.`,
  },
  {
    id: 'no-attorney-client',
    heading: 'No Attorney-Client Relationship',
    body: `Use of AccidentPath — including our guides, tools, intake forms, or any referral features — does not create an attorney-client relationship between you and AccidentPath, or between you and any attorney whose information may appear on this platform.

Any communication you have through AccidentPath prior to formally engaging an attorney is not protected by attorney-client privilege. Do not share sensitive case details through this platform that you would not want disclosed to third parties.`,
  },
  {
    id: 'tool-limitations',
    heading: 'Interactive Tool Limitations',
    body: `AccidentPath's interactive tools — including the Statute of Limitations Countdown, Evidence Collection Checklist, Lost Wages Estimator, and others — are designed to help you organize information and understand general concepts. They do not analyze your legal situation, predict the outcome of your case, or constitute legal or financial advice.

Tool outputs are based on general information you enter and general rules that may not apply to your specific circumstances. Laws, deadlines, and rules vary by jurisdiction and can change. Always verify any deadline or legal requirement with a qualified attorney before taking action.`,
  },
  {
    id: 'accuracy',
    heading: 'Accuracy of Information',
    body: `AccidentPath makes reasonable efforts to ensure that the content on this platform is accurate, current, and helpful. However, we make no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability, or availability of any information on this site.

Laws and legal standards change. Content that was accurate when published may become outdated. AccidentPath is not responsible for errors or omissions in content, or for any actions taken in reliance on information found on this site.`,
  },
  {
    id: 'jurisdiction',
    heading: 'State Jurisdiction Notice',
    body: `AccidentPath currently provides guidance specific to California and Arizona. Laws governing personal injury, insurance, and attorney-client relationships vary significantly from state to state. Information on this platform may not apply to residents of other states.

If you were injured in a state other than California or Arizona, please consult an attorney licensed in the relevant jurisdiction before relying on any information found on this site.`,
  },
  {
    id: 'attorney-advertising',
    heading: 'Attorney Advertising and Referral Notice',
    body: `AccidentPath may facilitate connections between injured people and attorneys. When it does so, it operates as an educational platform and lead generation service — not as a certified lawyer referral service under California Business & Professions Code § 6155 unless separately certified.

AccidentPath does not guarantee the quality, competence, or character of any attorney. Attorney referrals are provided for informational purposes only. You should independently verify an attorney's qualifications, licensing status, and experience before engaging their services.

Past results do not guarantee future outcomes. &ldquo;No fee unless you recover&rdquo; and similar language refers to fee arrangements offered by specific attorneys and does not represent a guarantee by AccidentPath.`,
  },
  {
    id: 'medical',
    heading: 'Medical Information Disclaimer',
    body: `Some content on AccidentPath discusses injuries, medical treatment, and related topics. This content is for general educational purposes only and is not medical advice. If you are injured, seek medical attention immediately. Do not delay seeking medical care because of information found on this website.

AccidentPath is not a medical provider. Nothing on this site should be used to self-diagnose or self-treat any condition.`,
  },
]

export default function DisclaimersPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Disclaimers' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Legal Disclaimers
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Important information about the nature and limits of what AccidentPath provides.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12">

            <nav aria-label="Disclaimer sections" className="mb-10">
              <p className="font-sans font-semibold text-sm text-neutral-950 mb-3">Contents</p>
              <ol className="space-y-1">
                {DISCLAIMERS.map((d) => (
                  <li key={d.id}>
                    <a
                      href={`#${d.id}`}
                      className="font-sans text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {d.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-10">
              {DISCLAIMERS.map((disclaimer, index) => (
                <section key={disclaimer.id} id={disclaimer.id} aria-labelledby={`heading-${disclaimer.id}`}>
                  {index > 0 && <hr className="border-neutral-100 mb-10" />}
                  <h2
                    id={`heading-${disclaimer.id}`}
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    {disclaimer.heading}
                  </h2>
                  {disclaimer.body.trim().split('\n\n').map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-sans text-neutral-600 leading-relaxed mb-3 last:mb-0"
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </section>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/disclaimers/page.tsx
git commit -m "feat: add /disclaimers page with real legal disclaimer content"
```

---

## Task 5: `/for-attorneys` page

**Files:**
- Create: `app/for-attorneys/page.tsx`

- [ ] **Step 1: Create `app/for-attorneys/page.tsx`**

```tsx
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Attorney Partnerships — AccidentPath',
  description:
    'Partner with AccidentPath to connect with pre-screened accident and injury leads in California and Arizona. Consumer-first platform, qualified referrals.',
  canonical: '/for-attorneys',
})

const BENEFITS = [
  {
    title: 'Qualified, Pre-Educated Leads',
    body: 'People who reach the referral stage on AccidentPath have already read relevant guides, used our tools, and understand what type of help they need. They arrive informed — not cold.',
  },
  {
    title: 'California & Arizona Focus',
    body: 'We serve only the markets you operate in. No out-of-jurisdiction leads, no broad national spray. Every referral is for an accident in a state we actively cover.',
  },
  {
    title: 'Consumer-First Platform',
    body: "Our brand is built on trust with injured people — not attorney advertising. That trust transfers. Users who come from AccidentPath aren't just leads, they're people who chose to ask for help.",
  },
  {
    title: 'Transparent Matching',
    body: 'We tell users what type of attorney to look for based on their situation — not which specific firm. Referrals happen through an honest matching process, not a ranking auction.',
  },
  {
    title: 'Compliance-First Infrastructure',
    body: 'AccidentPath is built around California State Bar rules and legal advertising standards. We work with counsel to ensure every referral interaction is properly structured.',
  },
]

const PRACTICE_AREAS = [
  'Car Accidents', 'Truck & Commercial Vehicle Accidents', 'Motorcycle Accidents',
  'Slip & Fall / Premises Liability', 'Pedestrian Accidents', 'Bicycle Accidents',
  'Rideshare Accidents', 'Workplace Injuries', 'Traumatic Brain Injury',
  'Spinal Cord Injury', 'Wrongful Death',
]

export default function ForAttorneysPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'For Attorneys' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Attorney Partnerships
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Partner With AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Connect with injured people who are actively seeking help — in California and Arizona.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">

          {/* Intro */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Who We Connect You With</h2>
            <p className="font-sans text-neutral-600 leading-relaxed mb-4">
              AccidentPath guides injured people through the confusion following an accident —
              evidence collection, insurance communication, understanding their rights. By the time
              someone reaches our referral step, they know what happened, what they&apos;ve done so far,
              and what kind of legal help they may need.
            </p>
            <p className="font-sans text-neutral-600 leading-relaxed">
              We work with personal injury attorneys in California and Arizona who handle the practice
              areas our users most commonly need help with.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-6">Why AccidentPath</h2>
            <ul className="space-y-6">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-sans font-semibold text-neutral-950 mb-1">{benefit.title}</p>
                    <p className="font-sans text-neutral-600 text-sm leading-relaxed">{benefit.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice areas */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Practice Areas We Cover</h2>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_AREAS.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold font-sans border border-primary-100"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-900 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="font-sans font-bold text-2xl text-white mb-3">Interested in Partnering?</h2>
            <p className="font-serif italic text-primary-200 max-w-lg mx-auto mb-6 leading-relaxed">
              We&apos;re currently building our attorney network in California and Arizona.
              Reach out to discuss partnership options, compliance structure, and how referrals work.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-primary-950 font-sans font-semibold text-sm px-7 py-3.5 rounded-xl transition-colors"
            >
              Get in Touch →
            </Link>
            <p className="mt-4 font-sans text-primary-400 text-xs">
              Or email us directly at{' '}
              <a
                href="mailto:attorneys@accidentpath.com"
                className="text-primary-300 hover:text-white underline transition-colors"
              >
                attorneys@accidentpath.com
              </a>
            </p>
          </div>

          {/* Disclaimer */}
          <p className="font-sans text-neutral-400 text-xs text-center leading-relaxed px-4">
            AccidentPath is an educational platform and lead generation service. Attorney partnerships
            are structured to comply with California State Bar rules and applicable legal advertising
            standards. Partnership details provided upon inquiry.
          </p>

        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/for-attorneys/page.tsx
git commit -m "feat: add /for-attorneys attorney partnership page"
```

---

## Task 6: `/contact` page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create `app/contact/page.tsx`**

```tsx
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Contact AccidentPath',
  description:
    'Get in touch with AccidentPath — general questions, attorney partnership inquiries, press, or feedback about our accident guidance platform.',
  canonical: '/contact',
})

const CONTACT_TOPICS = [
  {
    title: 'General Questions',
    email: 'hello@accidentpath.com',
    description: 'Questions about our guides, tools, or platform.',
  },
  {
    title: 'Attorney Partnerships',
    email: 'attorneys@accidentpath.com',
    description: 'Interested in joining our attorney network in CA or AZ.',
  },
  {
    title: 'Press & Media',
    email: 'press@accidentpath.com',
    description: 'Media inquiries, interview requests, or editorial questions.',
  },
  {
    title: 'Technical Issues',
    email: 'support@accidentpath.com',
    description: 'Something not working? Report a bug or broken link.',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contact' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Get in Touch
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Contact AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            We&apos;re a small team. We read every message and respond within 2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">

          {/* Contact topics */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-6">How to Reach Us</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {CONTACT_TOPICS.map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-xl border border-neutral-100 p-5 hover:border-primary-200 transition-colors"
                >
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">{topic.title}</p>
                  <p className="font-sans text-neutral-500 text-xs leading-relaxed mb-3">{topic.description}</p>
                  <a
                    href={`mailto:${topic.email}`}
                    className="font-sans text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {topic.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Response time */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8">
            <h2 className="font-sans font-bold text-lg text-neutral-950 mb-3">What to Expect</h2>
            <ul className="space-y-3">
              {[
                'We respond to all inquiries within 2 business days.',
                'For urgent matters, include "URGENT" in your subject line.',
                'Attorney partnership inquiries may take 3–5 business days for a full response.',
                'We cannot provide legal advice or case evaluations via email.',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" aria-hidden="true" />
                  <p className="font-sans text-neutral-600 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* If you need legal help */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center">
            <p className="font-sans font-semibold text-primary-900 text-sm mb-2">
              Need help after an accident?
            </p>
            <p className="font-sans text-primary-700 text-sm leading-relaxed mb-4">
              If you&apos;re looking for guidance about your accident — not a general question about AccidentPath
              — our guides and tools are the best place to start.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/guides"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                Browse Guides →
              </a>
              <a
                href="/tools"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Use Free Tools →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Full build verify**

Run: `npm run build`
Expected: Build completes successfully. All 7 new routes appear in the static generation output.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: add /contact page"
```

---

## Self-Review

**Spec coverage:**
- `/about` ✓ Task 1
- `/about/how-it-works` ✓ Task 2
- `/privacy` ✓ Task 3
- `/terms` ✓ Task 3
- `/disclaimers` ✓ Task 4
- `/for-attorneys` ✓ Task 5
- `/contact` ✓ Task 6
- Privacy + Terms = well-structured placeholders for legal counsel ✓ amber "Pending Legal Review" boxes with detailed guidance per section

**Placeholder scan:**
- No "TBD" or "TODO" in any implementation code
- Privacy/Terms placeholder boxes contain detailed instructions for legal counsel — intentionally structured, not lazy filler

**Type consistency:**
- `buildMetaTags`, `Breadcrumb`, and `Link` used identically across all tasks
- No cross-task type references
