# 90-Day Rollout Plan

> **SUPERSEDED:** This document has been superseded by `MASTER-PLAN.md` which contains the authoritative implementation plan with 37-day MVP target, detailed phase breakdown, cost estimates, and team assignments. This file is kept for historical reference only.

## Overview

```
Days 1-15:   Foundation — Legal, business, compliance setup
Days 16-35:  Build — MVP site, content, tools, integrations
Days 36-60:  Launch — Paid search, state guides, partner onboarding
Days 61-90:  Scale — Content expansion, conversion optimization
```

---

## Phase 1: Foundation (Days 1–15)

### Business Setup
- [ ] Name the brand (see candidates in BUSINESS-CONTEXT.md)
- [ ] Register domain
- [ ] Form legal business entity (LLC/Corp via CA Secretary of State)
- [ ] Email LRS@calbar.ca.gov for certification application

### Legal & Compliance
- [ ] Retain legal ethics counsel
- [ ] Define business structure: marketing vendor, ABS, referral service, or hybrid
- [ ] Choose first 3 launch states only
- [ ] Map partner lawyer requirements per state
- [ ] Draft disclosures and routing rules
- [ ] Draft privacy policy, terms of service, disclaimer language

### Attorney Panel
- [ ] Start recruiting PI attorneys for panel
- [ ] Draft panel agreement template (20% fee structure)
- [ ] Identify 5-10 target attorneys per launch state

### Technical Foundation
- [ ] Set up Next.js project with TypeScript + Tailwind
- [ ] Set up Supabase database
- [ ] Set up Vercel deployment
- [ ] Configure analytics (GA4 + Search Console)
- [ ] Set up development environment and CI/CD

---

## Phase 2: Build (Days 16–35)

### MVP Website
- [ ] Build component library (see DESIGN-SYSTEM.md)
- [ ] Build page templates (accident hub, guide, tool, state)
- [ ] Build intake wizard / multi-step flow
- [ ] Build state routing engine
- [ ] Build CMS content models (JSON)
- [ ] Implement structured data (Organization, Breadcrumbs)

### Content (25 Cornerstone Pages)
- [ ] Home page
- [ ] 5 highest-traffic accident hubs (car, truck, motorcycle, slip/fall, workplace)
- [ ] 5 core guide pages (after accident, evidence, insurance, hiring lawyer, mistakes)
- [ ] 5 tool pages (case quiz, urgency checker, evidence checklist, journal, lawyer matcher)
- [ ] 3 state pages (launch states)
- [ ] About / How It Works
- [ ] Contact / Intake
- [ ] Privacy + Terms + Disclaimers

### Interactive Tools
- [ ] Accident Case Type Quiz
- [ ] Urgency Checker
- [ ] Evidence Checklist Generator
- [ ] Injury and Treatment Journal
- [ ] Lawyer Type Matcher

### Integrations
- [ ] CRM connection
- [ ] Call tracking setup
- [ ] SMS/email notification pipeline
- [ ] Set Organization schema markup
- [ ] Connect Google Search Console
- [ ] Connect analytics + heatmaps

---

## Phase 3: Launch (Days 36–60)

### Paid Acquisition
- [ ] Launch paid search for first state
- [ ] Target 2-3 accident types initially
- [ ] Set up conversion tracking
- [ ] A/B test landing pages

### Content Expansion
- [ ] Publish state-specific guides (reviewed by counsel)
- [ ] Remaining accident type hubs
- [ ] Injury type pages

### Partner Onboarding
- [ ] Onboard 3-5 law firm partners
- [ ] Test lead routing and handoff
- [ ] QA the full intake → attorney pipeline
- [ ] Collect feedback from partner attorneys

### Quality Assurance
- [ ] Full QA of all intake flows
- [ ] Compliance review of all published content
- [ ] Lighthouse audits (target 90+)
- [ ] Accessibility audit (WCAG 2.2 AA)
- [ ] Mobile testing across devices

---

## Phase 4: Scale (Days 61–90)

### Content Depth
- [ ] Expand content clusters (spoke articles for each hub)
- [ ] Launch blog/news section
- [ ] Publish downloadable PDF resources
- [ ] Create linkable assets (infographics, data studies)

### Tool Expansion
- [ ] Lost Wages Estimator
- [ ] Insurance Call Prep Tool
- [ ] Record Request Checklist
- [ ] Settlement Readiness Checklist
- [ ] State-Specific Next-Step Generator

### Conversion Optimization
- [ ] Analyze intake funnel drop-off
- [ ] A/B test CTAs, headlines, form layouts
- [ ] Improve conversion rates based on data
- [ ] Optimize page speed and Core Web Vitals

### Platform Growth
- [ ] Add document center (accident report checklist, insurance call script, etc.)
- [ ] Add symptom journal with PDF export
- [ ] Review compliance before each new state expansion
- [ ] Plan Phase 2 states based on performance data

---

## Success Metrics

### Phase 1 (Day 15)
- Business entity formed
- Legal counsel retained
- 3 states selected and reviewed
- Development environment ready

### Phase 2 (Day 35)
- MVP live on Vercel
- 25 pages published
- 5 tools functional
- Intake flow working end-to-end
- CRM + tracking connected

### Phase 3 (Day 60)
- Paid search running
- 3-5 attorney partners onboarded
- Leads flowing through pipeline
- State guides published with attorney review
- 90+ Lighthouse scores

### Phase 4 (Day 90)
- Content clusters fully built out
- All 10 tools live
- Conversion rate optimized
- PDF resources available
- Ready for next-state expansion
- Revenue from first partner firms

---

## Key Dependencies

| Dependency | Blocks | Owner |
|-----------|--------|-------|
| Brand name selection | Everything | Michael |
| Legal ethics counsel | State expansion, content review | Michael |
| Attorney panel recruitment | Partner onboarding | Michael |
| CA LRS certification | California operations | Legal counsel |
| State-specific legal review | State content, routing | Legal counsel |
| Medical reviewer | Health-related content | TBD |
