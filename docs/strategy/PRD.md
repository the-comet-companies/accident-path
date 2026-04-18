# Product Requirements Document — Legal Leads Platform

## 1. Product Vision

Create the most useful, trustworthy, high-converting accident guidance and attorney-matching website on the internet. This is NOT a thin lead-gen page — it is a full accident intelligence platform.

### Core Objective

Help injured consumers answer four questions fast:

1. What happened to me?
2. How urgent is this medically and legally?
3. What type of lawyer or specialist should I talk to?
4. What should I do in the next 15 minutes, 24 hours, and 7 days?

### Target Users

- **Primary:** People who just had an accident (car, truck, motorcycle, slip/fall, workplace, etc.)
- **Secondary:** Family members helping an injured person
- **Tertiary:** People researching their legal options after an injury

---

## 2. Pages to Build

| # | Page | Priority | Description |
|---|------|----------|-------------|
| 1 | Home page | P0 | Hero + CTA + trust + how it works + categories |
| 2 | Accident type hub pages | P0 | 15 accident types with deep content |
| 3 | Injury type pages | P1 | Specific injury information hubs |
| 4 | "What to do after an accident" guides | P0 | Step-by-step post-accident guidance |
| 5 | State pages | P1 | State-specific laws, statutes, guidance |
| 6 | Attorney matching page | P0 | Quiz/intake → lawyer type matching |
| 7 | Resources center | P1 | Educational content hub |
| 8 | About / How it works | P0 | Transparency, trust, disclosures |
| 9 | Contact / intake | P0 | Multi-step intake form |
| 10 | Tool pages | P1 | Interactive tools (see TOOLS-SPEC.md) |
| 11 | Partner attorney landing page | P1 | For recruiting attorney partners |
| 12 | Compliance/disclosure pages | P0 | Legal disclaimers, privacy, terms |

---

## 3. Home Page Requirements

### Hero Section
- Immediate value proposition: "Get clear next steps after an accident."
- Subtext: "Learn what to do, what evidence to keep, and whether speaking with a lawyer could help."
- **Primary CTA:** Start Free Accident Check
- **Secondary CTA:** Explore Accident Guides

### Sections (in order)
1. Hero with value prop + CTAs
2. Trust modules (badges, stats, credentials)
3. "How it works" 3-step section
4. Featured accident categories (cards/grid)
5. Featured tools (interactive previews)
6. Consumer-first educational content blocks
7. State selector (dropdown or map)
8. Strong footer with disclaimers and routing details

---

## 4. Accident Type Hubs

Create dedicated hubs for each accident type:

1. Car accidents
2. Truck accidents
3. Motorcycle accidents
4. Uber/Lyft accidents
5. Pedestrian accidents
6. Bicycle accidents
7. Slip and fall
8. Dog bites
9. Construction injuries
10. Workplace injuries
11. Wrongful death
12. Premises liability
13. Product liability
14. Traumatic brain injury
15. Spinal injuries

### Each Hub Must Include
- Common causes
- Likely injuries
- Immediate steps
- Evidence checklist
- Timeline risks
- Insurance issues
- When a specialist lawyer matters
- State-specific notes (where reviewed by counsel)

---

## 5. Quiz / Intake Architecture

### Flow Design
- Progressive, elegant multi-step flow
- Clean transitions, progress indicator
- Mobile-optimized

### Data to Collect
1. Accident type
2. Date of accident
3. Location (city/state)
4. Injuries sustained
5. Medical treatment status
6. Police report filed?
7. Insurance status
8. Work impact
9. Urgency factors

### Output
- Personalized next-steps summary
- Suggested lawyer type (not specific lawyer)
- Relevant resources and tools
- Option to connect with a matched attorney

### Technical
- Persist answers for CRM handoff
- Event tracking on each step
- State-based routing rules engine
- TCPA-style consent language placeholder
- Privacy language placeholder

---

## 6. Trust Architecture

Every page must show:

- Who operates the site
- Whether it is a law firm, referral service, marketing platform, or partner network
- Where lawyers are licensed
- How matching works
- Whether lawyers pay for marketing or participation
- What the user is and is not getting
- Clear emergency language: "Call 911 / seek care" where appropriate

---

## 7. Technical Requirements

### Performance
- 90+ Lighthouse score on all pages
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Core Web Vitals passing

### SEO
- Every page: unique metadata, semantic headings
- Internal linking across topic clusters
- Organization structured data
- QAPage structured data where appropriate
- Review markup only where legitimately applicable
- Do NOT rely on FAQ rich-result strategy
- Content must be original, substantial, people-first

### Accessibility
- WCAG 2.2 Level AA
- Keyboard navigable
- Screen reader compatible
- 4.5:1 contrast ratios
- 44x44px touch targets

### Architecture
- Componentized architecture
- CMS-ready content models
- Analytics-ready event tracking
- Structured-data-ready components
- SEO-first routing and metadata
- Server-friendly forms and API architecture
- State rules engine for jurisdiction-aware content
