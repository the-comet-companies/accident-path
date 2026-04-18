# Site Build Prompts — Split by Agent/Task

> These are copy-paste ready prompts for team members or AI agents to execute.
> Each prompt is self-contained with all the context needed.
> Run them in the order shown (dependencies noted).

---

## BUILD ORDER

```
Phase 1: Foundation (prompts 1-3, run in parallel)
Phase 2: Pages (prompts 4-7, run in parallel after Phase 1)
Phase 3: Tools (prompt 8, run after Phase 2)
Phase 4: Content (prompt 9, run after Phase 2)
Phase 5: SEO + Polish (prompts 10-11, run after Phase 4)
Phase 6: Intake + Integration (prompt 12, run last)
```

---

## PROMPT 1: PROJECT SCAFFOLDING + ARCHITECTURE

**Agent:** Systems Architect
**Dependencies:** None
**Estimated time:** 2-4 hours
**Deliverable:** Working Next.js project with folder structure, data models, CMS system

```
You are building the foundation for a premium personal injury legal referral platform.

CONTEXT:
Read these files first:
- projects/legal-leads/CLAUDE.md (master instructions)
- projects/legal-leads/SITE-ARCHITECTURE.md (routes, components, data models)
- projects/legal-leads/DESIGN-SYSTEM.md (brand direction)

TASK:
1. Initialize a Next.js 14+ App Router project with TypeScript and Tailwind CSS
2. Create the complete folder structure from SITE-ARCHITECTURE.md
3. Set up the data models (TypeScript interfaces) for:
   - Accident types (15 types with metadata)
   - Injury types
   - State/jurisdiction data
   - Intake form data
   - Attorney match data
   - CMS content models (JSON-based)
   - Tool input/output models
4. Create the JSON CMS system:
   - /content/accidents/*.json (one per accident type)
   - /content/injuries/*.json
   - /content/guides/*.json
   - /content/states/*.json
   - /content/tools/*.json
   - Content loader utility functions
5. Set up Supabase connection (schema for leads, intake data, analytics events)
6. Configure Tailwind with the design system tokens from DESIGN-SYSTEM.md
7. Set up the layout structure: Header, Footer, MobileNav, Breadcrumb
8. Configure metadata generation utilities for SEO
9. Add structured data components (Organization, BreadcrumbList)

DESIGN DIRECTION:
This must look like Stripe meets One Medical — premium, calm, authoritative.
NOT like a typical law firm website. Think high-end SaaS.

TECH STACK (non-negotiable):
- Next.js 14+ App Router
- TypeScript (strict mode)
- Tailwind CSS
- Supabase (Postgres)
- Vercel deployment

OUTPUT:
A fully scaffolded project that any developer can clone and start building pages in.
Every file should have proper TypeScript types. Zero any types.
```

---

## PROMPT 2: DESIGN SYSTEM + COMPONENT LIBRARY

**Agent:** Frontend/UX Specialist
**Dependencies:** Prompt 1 (project scaffold)
**Estimated time:** 4-6 hours
**Deliverable:** Complete component library with all shared UI elements

```
You are building the component library for a premium personal injury legal platform.

CONTEXT:
Read these files first:
- projects/legal-leads/DESIGN-SYSTEM.md (full design direction)
- projects/legal-leads/COMPETITOR-ANALYSIS.md (see "Design Benchmarks" section)
- projects/legal-leads/COMPLIANCE.md (disclaimer requirements)

DESIGN VISION:
This site must look MORE official and trustworthy than any law firm website.
Think: Stripe's clarity + One Medical's warmth + top-tier law firm's authority.
NOT generic legal marketing. NOT template-y. Premium SaaS-level polish.

EVERY competitor in this space scores 3-7/10 on design. We need a 9.5/10.

COLOR PALETTE:
- Primary: Deep navy (#1B2A4A) — authority, trust
- Secondary: Warm gold (#C8A96E) — warmth, premium feel
- Accent: Teal (#2A9D8F) — clarity, action
- Success: Forest green (#2D6A4F)
- Warning: Amber (#E9C46A)
- Danger: Crimson (#E63946)
- Background: Warm off-white (#FAFAF8)
- Surface: White (#FFFFFF)
- Text primary: Charcoal (#1A1A2E)
- Text secondary: Slate (#64748B)

TYPOGRAPHY:
- Headings: "Plus Jakarta Sans" (weight 600-800) — modern authority
- Body: "Inter" (weight 400-500) — clean readability
- Legal/disclaimer: "Inter" (weight 400, smaller) — readable but distinct
- Scale: 14/16/18/20/24/30/36/48/60px

BUILD THESE COMPONENTS:

Layout:
- Header (with mega-menu navigation matching SITE-ARCHITECTURE.md nav)
- Footer (with disclaimers, links, contact info, State Bar badge)
- MobileNav (slide-out drawer, thumb-zone friendly)
- Breadcrumb (with structured data)
- PageContainer (max-width, padding, responsive)
- Section (alternating backgrounds, consistent spacing)

Trust & Authority:
- TrustBadge (State Bar Certified badge — MUST look official, shield icon)
- ReviewBadge ("Reviewed by [Name], Esq. — [Date]")
- CredentialBar (horizontal strip of trust icons)
- EmergencyBanner ("In danger? Call 911" — subtle but visible)
- DisclaimerBlock (contextual disclaimers per page type)
- StatBar (animated number counters: "20,000+ helped", etc.)

Cards & Content:
- AccidentTypeCard (icon + title + brief + arrow, hover effect)
- ToolCard (icon + title + description + "Try It" CTA)
- GuideCard (title + excerpt + read time + review badge)
- TestimonialCard (quote + name + case type + rating)
- ContentModule (CMS-driven content block with heading + body + CTA)

CTAs & Conversion:
- PrimaryButton (large, bold, high-contrast, subtle hover animation)
- SecondaryButton (outlined, professional)
- CTABanner (full-width callout with heading + button)
- FloatingCTA (mobile sticky bottom bar with "Get Help Now")

Forms & Intake:
- IntakeWizard (multi-step form container)
- ProgressBar (step indicator for wizard)
- FormField (input with label, validation, error state)
- SelectField (styled dropdown)
- ChecklistField (interactive checklist with checkboxes)
- ConsentCheckbox (TCPA-style consent with link to terms)
- RadioCardGroup (large tappable cards for option selection)

SEO & Meta:
- SchemaOrg (JSON-LD structured data injector)
- MetaTags (dynamic meta tag generator)
- TableOfContents (auto-generated from headings, sticky sidebar)

QUALITY REQUIREMENTS:
- Every component must be accessible (WCAG 2.2 AA)
- Every component must work on mobile (44x44px touch targets)
- Every component must support dark mode via prefers-color-scheme
- Every interactive element needs focus indicators (3:1 contrast)
- Respect prefers-reduced-motion for animations
- All components documented with props interface and usage example

ANIMATIONS (tasteful, not distracting):
- Subtle fade-in on scroll for content sections
- Smooth hover transitions on cards (200ms ease)
- Number counters animate on viewport entry
- Button hover: slight scale + shadow change
- Page transitions: fade (150ms)
- All animations disabled for prefers-reduced-motion
```

---

## PROMPT 3: HOMEPAGE

**Agent:** Frontend + Content
**Dependencies:** Prompt 1 + 2
**Estimated time:** 3-4 hours
**Deliverable:** Complete homepage

```
You are building the homepage for a premium personal injury legal platform.

CONTEXT:
Read: PRD.md (home page requirements section), DESIGN-SYSTEM.md, COMPLIANCE.md, COMPETITOR-ANALYSIS.md

CRITICAL INSIGHT FROM COMPETITOR RESEARCH:
Every competitor homepage is a generic contact form with thin marketing copy.
None have educational value. None have tools. None look premium.
Our homepage must be the OPPOSITE — a value-first experience that earns trust
before asking for anything.

SECTIONS (in this exact order):

1. HERO
   - Headline: "Clear Next Steps After an Accident"
   - Subheadline: "Get honest guidance, the right tools, and help finding a qualified attorney — all in one place."
   - Primary CTA: "Start Your Free Accident Check" (links to /find-help)
   - Secondary CTA: "Explore Accident Guides" (links to /accidents)
   - Background: Subtle gradient or abstract pattern (NOT stock photo of gavel/courthouse)
   - Trust strip below hero: "State Bar Certified | 24/7 Support | Free Service | No Obligation"

2. VALUE PROPOSITION STRIP
   - "Unlike other referral services, we help you BEFORE connecting you with a lawyer."
   - Three cards:
     a) "Understand Your Situation" — Educational content for your accident type
     b) "Use Free Tools" — Checklists, calculators, journals
     c) "Find the Right Help" — Matched to your case type, location, and needs

3. ACCIDENT TYPE GRID
   - Heading: "What Type of Accident Were You In?"
   - 3x5 grid of AccidentTypeCards (15 types from PRD.md)
   - Each card: custom icon + title + "Learn More →"
   - Responsive: 2-column on tablet, 1-column on mobile

4. FEATURED TOOLS
   - Heading: "Free Tools That Actually Help"
   - Subheading: "No sign-up required. Use them right now."
   - 3 featured tool cards: Case Quiz, Evidence Checklist, Urgency Checker
   - "View All Tools →" link

5. HOW IT WORKS
   - 3-step visual:
     Step 1: "Tell Us What Happened" (form icon)
     Step 2: "Get Your Personalized Plan" (checklist icon)
     Step 3: "Connect With a Qualified Attorney" (handshake icon)
   - Below: "Our service is free. Attorneys pay us. You pay nothing unless you win your case."

6. TRUST MODULE
   - State Bar Certification badge (large, official)
   - Stats strip: "X,000+ People Helped | Y+ Years Operating | Z+ Attorney Partners"
   - "All attorneys in our network are licensed, insured, and have no disciplinary record."

7. EDUCATIONAL CONTENT PREVIEW
   - Heading: "Latest Guides & Resources"
   - 3 GuideCards from the content pipeline
   - "View All Resources →"

8. STATE SELECTOR
   - Heading: "Find Help in Your State"
   - Interactive map or dropdown: select state → route to /states/[state]
   - Initially show CA, AZ, and launch states

9. FOOTER
   - Full disclaimer (from COMPLIANCE.md — every-page footer)
   - Navigation links (all major sections)
   - Contact info (phone, email)
   - State Bar badge (small)
   - Social links
   - Privacy Policy | Terms | Disclaimers links

DESIGN REQUIREMENTS:
- Must look like a $50M company built this — premium, authoritative, calm
- NO stock photos of gavels, scales of justice, or courthouses
- Use abstract patterns, gradients, or custom illustrations instead
- Generous whitespace between sections
- Each section should breathe — don't cram
- The page should feel like landing on Stripe or One Medical, not a law firm
```

---

## PROMPT 4: ACCIDENT TYPE HUB TEMPLATE

**Agent:** Frontend + Content
**Dependencies:** Prompt 1 + 2
**Estimated time:** 4-5 hours (template + first 5 hubs)
**Deliverable:** Reusable hub template + 5 populated hubs

```
Build the accident type hub page template and populate the first 5 hubs.

CONTEXT:
Read: SITE-ARCHITECTURE.md (hub template section), CONTENT-PLAN.md (hub requirements),
COMPLIANCE.md (language rules), content-briefs/ folder for article angles.

COMPETITOR GAP WE'RE EXPLOITING:
Not a single competitor has substantive accident type content. They have thin
category pages with a form. We're building DEEP educational hubs that earn
organic rankings AND trust.

TEMPLATE STRUCTURE (apply to all 15 types):

[Breadcrumb: Home > Accidents > {Type}]

# {Type} Accidents — What You Need to Know

[Hero section — type-specific custom illustration, NOT stock photo]

## What Causes {Type} Accidents
[5-10 causes with brief explanations, internal links to related hubs]

## Common Injuries
[Linked list to relevant /injuries/* pages]

## What To Do Immediately
[Numbered steps: First 15 minutes, 24 hours, 7 days]
[Include emergency banner if applicable]

## Evidence You Need to Collect
[Interactive checklist component — links to evidence tool]

## Timeline Risks
[Visual timeline showing key deadlines: medical care, police report, insurance notification, statute of limitations]

## Insurance Issues You'll Face
[Common insurer tactics, what to watch for]
[Link to insurance call prep tool]

## When You Need a Specialist Lawyer
[Clear guidance using COMPLIANCE.md safe language]
[Link to lawyer type matcher tool]

## State-Specific Information
[Dynamic content based on state — show CA by default]
[Attorney review badge: "Reviewed by [Name], Esq. — [Date]"]

[CTA Banner: "Start Your Free Accident Check"]

[Related Guides sidebar]
[Related Tools sidebar]

[Contextual disclaimer per COMPLIANCE.md]

FIRST 5 HUBS TO BUILD:
1. /accidents/car — Car Accidents (highest traffic)
2. /accidents/truck — Truck Accidents (highest value)
3. /accidents/motorcycle — Motorcycle Accidents
4. /accidents/slip-and-fall — Slip and Fall
5. /accidents/workplace — Workplace Injuries

Each hub must have at least 2,000 words of substantive content.
Use JSON CMS files for content. Do not hardcode.
```

---

## PROMPT 5: GUIDE PAGE TEMPLATE

**Agent:** Frontend + Content
**Dependencies:** Prompt 1 + 2
**Estimated time:** 3-4 hours
**Deliverable:** Guide template + first 5 guides

```
Build the guide page template and write the first 5 guides.

Use the content briefs from projects/legal-leads/content-briefs/ as source material.
Each guide should be 1,500-2,500 words, educational, people-first.

FIRST 5 GUIDES (from P0 content briefs):
1. "Do You Need a Lawyer After an Accident That Wasn't Your Fault?"
2. "Insurance Company Lowballing You? 7 Steps to Fight Back"
3. "Injured in an Uber or Lyft? Here's Exactly Who Pays (2026 Guide)"
4. "Delayed Pain After a Car Accident? Why It's Not Too Late"
5. "Hit by a Driver With No Insurance? Your 5 Options"

TEMPLATE: Table of contents sidebar, author/reviewer badge, related tools,
related accident hubs, CTA to /find-help, contextual disclaimers.

Follow ALL language rules in COMPLIANCE.md. Flag state-specific claims for attorney review.
```

---

## PROMPT 6: STATE PAGES

**Agent:** Frontend + Content
**Dependencies:** Prompt 1 + 2
**Estimated time:** 2-3 hours per state
**Deliverable:** State page template + California page

```
Build the state page template. Create the California page first.

TEMPLATE:
- State-specific accident and injury laws
- Statute of limitations (with countdown visual)
- Fault rules (at-fault, no-fault, comparative)
- Minimum insurance requirements
- Key consumer protections (link to new 2026 CA laws)
- State-specific attorney matching CTA
- Attorney review badge (REQUIRED — no state content without review)

CALIFORNIA SPECIFIC CONTENT:
- Pure comparative negligence state
- 2-year statute of limitations for PI
- New 2026 laws: Survival Action changes, 9 insurance consumer protection laws
- Uber/Lyft UM/UIM changes (if verified)
- LRS certification context
- CA-specific accident statistics

ALL state-specific legal claims MUST be flagged: "NEEDS ATTORNEY REVIEW BEFORE PUBLISH"
```

---

## PROMPT 7: LEGAL FUNDING PAGES

**Agent:** Frontend + Content
**Dependencies:** Prompt 1 + 2
**Estimated time:** 2-3 hours
**Deliverable:** Legal funding hub + sub-pages

```
Build the legal funding content hub from LEGAL-FUNDING.md.

PAGES:
1. /legal-funding — Hub page: "What Is Pre-Settlement Funding?"
2. /legal-funding/how-it-works — Step-by-step process
3. /legal-funding/pros-and-cons — Honest breakdown
4. /legal-funding/questions-to-ask — 10 questions before signing

TONE: Educational and balanced. This is NOT a sales page for Rock Point.
Present funding as ONE option among many. Be honest about costs.
Follow the legal funding compliance rules in LEGAL-FUNDING.md.
```

---

## PROMPT 8: INTERACTIVE TOOLS

**Agent:** Senior Software Engineer
**Dependencies:** Prompt 1 + 2
**Estimated time:** 6-8 hours
**Deliverable:** 5 core tools fully functional

```
Build the first 5 interactive tools from TOOLS-SPEC.md.

TOOLS TO BUILD:
1. Accident Case Type Quiz (/tools/accident-case-quiz)
2. Urgency Checker (/tools/urgency-checker)
3. Evidence Checklist Generator (/tools/evidence-checklist)
4. Injury & Treatment Journal (/tools/injury-journal)
5. Lawyer Type Matcher (/tools/lawyer-type-matcher)

COMPETITOR CONTEXT:
Not a single competitor has ANY interactive tools. This is our #1 differentiator.
These tools must feel polished, premium, and genuinely useful.

TECHNICAL REQUIREMENTS:
- Progressive multi-step UI (one question group per step)
- Smooth animations between steps
- Progress indicator
- Mobile-first (44x44px touch targets)
- Client-side logic (fast, no server round-trips for each step)
- Results page with personalized output
- PDF export where applicable
- Analytics events on each step + completion
- Disclaimer before AND after results
- Accessible (keyboard nav, screen reader, ARIA labels)
- Local storage for journal (no account required)

DESIGN: Same premium feel as rest of site. Radio card groups for options.
Large, tappable, beautiful. NOT a boring form. Think of it as a guided experience.
```

---

## PROMPT 9: CONTENT POPULATION

**Agent:** Content Writer
**Dependencies:** Prompts 4-7 (page templates exist)
**Estimated time:** 8-12 hours
**Deliverable:** All 25 cornerstone pages populated with content

```
Populate all page templates with substantive, people-first content.

SOURCE MATERIAL:
- projects/legal-leads/content-briefs/ (Reddit harvest briefs)
- projects/legal-leads/news-briefs/ (news scan briefs)
- projects/legal-leads/CONTENT-PLAN.md (content modules)
- projects/legal-leads/COMPLIANCE.md (MANDATORY language rules)

PAGES TO WRITE:
- 5 accident type hubs (car, truck, motorcycle, slip-and-fall, workplace)
- 5 core guide articles (from P0 content briefs)
- 3 state pages (CA + 2 launch states)
- 4 legal funding pages
- Home page content blocks
- About / How It Works
- Contact / Intake page copy
- Privacy Policy + Terms + Disclaimers
- Partner Attorney landing page

CONTENT STANDARDS:
- Minimum 1,500 words per hub page, 1,000 per guide
- Original, substantial, people-first (Google E-E-A-T)
- Every page: unique title tag (<60 chars) + meta description (<155 chars)
- Include internal links to 3+ related pages
- Include at least 1 tool CTA per page
- Use ONLY safe language from COMPLIANCE.md
- Flag all state-specific legal info: "NEEDS ATTORNEY REVIEW"
- Include review badge placeholder: "Reviewed by [TBD], Esq."
- All content in JSON CMS files — never hardcode in components
```

---

## PROMPT 10: SEO INFRASTRUCTURE

**Agent:** SEO Specialist
**Dependencies:** Prompts 1-9 (site built)
**Estimated time:** 3-4 hours
**Deliverable:** Complete SEO setup

```
Implement the full SEO strategy from SEO-STRATEGY.md.

TASKS:
1. Structured data on every page:
   - Organization (site-wide)
   - BreadcrumbList (every page)
   - Article (guide pages)
   - HowTo (step-by-step guides)
   - QAPage (true Q&A content only)
   - LocalBusiness (if physical office)

2. XML sitemap at /sitemap.xml (auto-generated)
3. robots.txt (allow all crawlers)
4. Canonical URLs on every page
5. Internal linking audit:
   - Every page links to 3+ related pages
   - No orphan pages
   - Descriptive anchor text
6. Image optimization: WebP, alt text, srcset, lazy loading
7. Performance targets: Lighthouse 90+, LCP <2.5s, CLS <0.1
8. Meta tags: unique title + description for every page
9. Heading hierarchy audit: one H1, sequential H2-H6
10. Open Graph + Twitter Card tags for social sharing
```

---

## PROMPT 11: ACCESSIBILITY + PERFORMANCE AUDIT

**Agent:** QA Engineer
**Dependencies:** All previous prompts
**Estimated time:** 2-3 hours
**Deliverable:** Audit report + fixes

```
Run a complete accessibility and performance audit.

ACCESSIBILITY (WCAG 2.2 AA):
- Run axe-core on every page template
- Keyboard-only navigation test
- Screen reader test (VoiceOver)
- Color contrast check (4.5:1 body, 3:1 large)
- Focus indicators visible (3:1 contrast)
- All images have alt text
- All forms have labels
- Skip-to-content link present
- ARIA landmarks correct

PERFORMANCE:
- Lighthouse audit on every page type
- Target: 90+ Performance, 90+ Accessibility, 90+ SEO
- Bundle size analysis
- Largest Contentful Paint < 2.5s
- First Input Delay < 100ms
- Cumulative Layout Shift < 0.1
- No layout shifts from images (explicit dimensions)

FIX every issue found. Do not just report — fix.
```

---

## PROMPT 12: INTAKE PIPELINE + INTEGRATIONS

**Agent:** Backend Engineer
**Dependencies:** All previous prompts
**Estimated time:** 4-6 hours
**Deliverable:** Working intake → CRM → notification pipeline

```
Build the intake pipeline from form submission to attorney notification.

INTAKE FLOW:
1. User completes multi-step intake wizard
2. Data saved to Supabase (leads table)
3. State routing engine determines jurisdiction
4. Lead scored by case type, severity, urgency
5. Matched to attorney panel based on type + location
6. Email notification to matched attorney(s)
7. SMS notification to user (confirmation)
8. Slack notification to D08LC4UFHQE
9. Analytics event tracked
10. User redirected to results page with:
    - Personalized next-steps summary
    - Relevant tools and guides
    - "While you wait" resources

INTEGRATIONS:
- Supabase for data storage
- Resend or SendGrid for email
- Twilio for SMS
- Slack API for internal notifications
- Google Analytics for events
- Call tracking integration (placeholder)

COMPLIANCE:
- TCPA consent collected before any contact
- Privacy policy linked and accepted
- Data encrypted at rest
- No data shared with third parties without consent
```

---

## PROMPT EXECUTION CHECKLIST

```
Phase 1 (Days 1-3):
  □ Prompt 1: Project Scaffolding
  □ Prompt 2: Component Library (can start after scaffold)

Phase 2 (Days 4-8):
  □ Prompt 3: Homepage
  □ Prompt 4: Accident Hub Template + 5 hubs
  □ Prompt 5: Guide Template + 5 guides
  □ Prompt 6: State Pages (CA first)
  □ Prompt 7: Legal Funding Pages

Phase 3 (Days 9-12):
  □ Prompt 8: Interactive Tools (5 core)

Phase 4 (Days 13-16):
  □ Prompt 9: Content Population (all 25 pages)

Phase 5 (Days 17-19):
  □ Prompt 10: SEO Infrastructure
  □ Prompt 11: Accessibility + Performance Audit

Phase 6 (Days 20-22):
  □ Prompt 12: Intake Pipeline + Integrations

Deploy Day: Day 23
```
