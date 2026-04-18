# Site Architecture

## Navigation Structure

### Top Navigation

```
[Logo] [Brand Name]

Accident Types | Injuries | What To Do Next | Tools | Find Help | State Guides | Resources | About
```

### Primary Nav Items

| Nav Item | Route | Type |
|----------|-------|------|
| Accident Types | `/accidents` | Hub with sub-pages |
| Injuries | `/injuries` | Hub with sub-pages |
| What To Do Next | `/guides` | Hub with sub-pages |
| Tools | `/tools` | Hub with sub-pages |
| Find Help | `/find-help` | Intake/matching flow |
| State Guides | `/states` | Hub with sub-pages |
| Resources | `/resources` | Content hub |
| About / How It Works | `/about` | Static + disclosure |

---

## Route Map

### Core Pages

```
/                           → Home page
/about                      → About / How it works
/about/how-it-works         → Detailed process explanation
/about/our-team             → Team/entity information
/contact                    → Contact / intake form
/privacy                    → Privacy policy
/terms                      → Terms of service
/disclaimers                → Legal disclaimers
/for-attorneys              → Partner attorney landing page
```

### Accident Type Hubs

```
/accidents                  → Accident types index
/accidents/car              → Car accidents hub
/accidents/truck            → Truck accidents hub
/accidents/motorcycle       → Motorcycle accidents hub
/accidents/uber-lyft        → Uber/Lyft accidents hub
/accidents/pedestrian       → Pedestrian accidents hub
/accidents/bicycle          → Bicycle accidents hub
/accidents/slip-and-fall    → Slip and fall hub
/accidents/dog-bite         → Dog bites hub
/accidents/construction     → Construction injuries hub
/accidents/workplace        → Workplace injuries hub
/accidents/wrongful-death   → Wrongful death hub
/accidents/premises         → Premises liability hub
/accidents/product          → Product liability hub
```

### Injury Type Pages

```
/injuries                   → Injuries index
/injuries/traumatic-brain   → TBI hub
/injuries/spinal            → Spinal injuries hub
/injuries/broken-bones      → Fractures hub
/injuries/soft-tissue       → Soft tissue injuries
/injuries/whiplash          → Whiplash hub
/injuries/burns             → Burn injuries
/injuries/internal          → Internal injuries
```

### Guide Pages

```
/guides                           → Guides index
/guides/after-car-accident        → What to do after a car accident
/guides/evidence-checklist        → Evidence collection guide
/guides/insurance-claims          → Insurance claim process
/guides/medical-treatment         → When and how to seek treatment
/guides/hiring-a-lawyer           → How to choose a PI lawyer
/guides/common-mistakes           → Mistakes that hurt your claim
/guides/timeline-expectations     → What to expect timeline-wise
/guides/medical-records           → Medical records and billing
```

### Tool Pages

```
/tools                            → Tools index
/tools/accident-case-quiz         → "What kind of case do I have?"
/tools/urgency-checker            → "Do I need medical care now?"
/tools/evidence-checklist         → Evidence checklist generator
/tools/injury-journal             → Injury and treatment journal
/tools/lost-wages-estimator       → Lost wages calculator
/tools/insurance-call-prep        → Insurance call prep tool
/tools/record-request             → Record request checklist
/tools/settlement-readiness       → Settlement readiness checklist
/tools/lawyer-type-matcher        → Lawyer type matcher
/tools/state-next-steps           → State-specific next-step generator
```

### State Pages

```
/states                           → State selector/map
/states/california                → California guide
/states/arizona                   → Arizona guide
/states/[state-slug]              → Dynamic state pages
```

### Find Help Flow

```
/find-help                        → Start intake/matching
/find-help/results                → Match results page
/find-help/thank-you              → Confirmation/next steps
```

---

## Page Templates

### Template: Accident Type Hub

```
[Breadcrumb: Home > Accidents > {Type}]

# {Accident Type} Accidents

[Hero section with type-specific imagery]

## Common Causes
[Content block]

## Likely Injuries
[Content block with links to /injuries/* pages]

## What To Do Immediately
[Numbered steps with urgency indicators]

## Evidence Checklist
[Interactive checklist component]

## Timeline Risks
[Timeline visual]

## Insurance Issues
[Content with state-specific callouts]

## When You Need a Specialist Lawyer
[Content + CTA to /find-help]

## State-Specific Notes
[Dynamic content based on detected/selected state]

[CTA: Start Your Free Accident Check]

[Disclaimers footer]
```

### Template: Tool Page

```
[Breadcrumb: Home > Tools > {Tool Name}]

# {Tool Name}

[Educational disclaimer callout]

[Interactive tool component]

[Results section]

[CTA: Want to discuss with a lawyer?]

[Tool disclaimer + educational purpose statement]
```

### Template: State Page

```
[Breadcrumb: Home > State Guides > {State}]

# {State} Accident & Injury Guide

[State-specific hero]

## Key Laws in {State}
[Statute of limitations, fault rules, etc.]

## What Makes {State} Different
[State-specific considerations]

## Finding a Lawyer in {State}
[CTA to /find-help with state pre-selected]

[State-specific disclaimers]
[Attorney review date badge]
```

---

## Internal Linking Strategy

### Cluster Model

```
Accident Hub Page
  ├── links to → related Injury pages
  ├── links to → relevant Tools
  ├── links to → State-specific guides
  ├── links to → "What to do" guides
  └── links to → Find Help (CTA)

State Page
  ├── links to → Accident types common in that state
  ├── links to → State-specific tools
  └── links to → Find Help (CTA with state pre-set)

Tool Page
  ├── links to → related Accident hubs
  ├── links to → related Guides
  └── links to → Find Help (CTA)
```

### Cross-Linking Rules
1. Every accident hub links to at least 3 related injury pages
2. Every injury page links back to accident types that cause it
3. Every guide links to relevant tools
4. Every page has at least one CTA to `/find-help`
5. State pages link to all accident types with state-specific context
6. Tools link to educational content for context

---

## Component Architecture

### Shared Components

```
components/
├── layout/
│   ├── Header.tsx          → Main nav with mega-menu
│   ├── Footer.tsx          → Disclaimers + links
│   ├── Breadcrumb.tsx      → SEO breadcrumb trail
│   └── MobileNav.tsx       → Responsive navigation
├── ui/
│   ├── CTAButton.tsx       → Primary/secondary CTAs
│   ├── TrustBadge.tsx      → Trust signals component
│   ├── DisclaimerBanner.tsx → Page disclaimers
│   ├── EmergencyBanner.tsx  → 911/medical emergency notice
│   └── StateSelector.tsx    → State dropdown/map
├── content/
│   ├── AccidentCard.tsx    → Accident type card
│   ├── ChecklistBlock.tsx  → Interactive checklist
│   ├── TimelineBlock.tsx   → Visual timeline
│   └── ContentModule.tsx   → CMS-driven content block
├── intake/
│   ├── IntakeWizard.tsx    → Multi-step intake flow
│   ├── ProgressBar.tsx     → Step progress indicator
│   └── ConsentCheckbox.tsx → TCPA consent component
└── seo/
    ├── SchemaOrg.tsx       → Structured data injector
    ├── MetaTags.tsx        → Dynamic meta tags
    └── CanonicalUrl.tsx    → Canonical URL handler
```

### Data Models

```
types/
├── accident.ts    → Accident type definitions
├── injury.ts      → Injury type definitions
├── state.ts       → State/jurisdiction data
├── intake.ts      → Intake form data model
├── attorney.ts    → Attorney/match data
├── content.ts     → CMS content models
└── tool.ts        → Tool input/output models
```

---

## Structured Data

### Organization (site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AccidentPath",
  "url": "https://[domain]",
  "description": "Accident guidance and attorney matching platform",
  "sameAs": []
}
```

### LocalBusiness (if applicable)

Only if a physical office is established.

### QAPage

Use on true Q&A content pages (not fake FAQ sections).

### BreadcrumbList

On every page for navigation trail.

### Review Markup

ONLY where it accurately reflects actual review content. Never fabricate.
