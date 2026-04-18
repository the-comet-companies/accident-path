# AccidentPath.com — Master Implementation Plan

> **Focus:** California + Arizona | 16 City Pages | 98 Delegatable Tasks
> **Notion Tasks DB:** [AccidentPath Project Tasks](https://www.notion.so/345917dc7b838123aa1cd0e6cdaf2f26)
> **Created:** 2026-04-17

---

## Executive Summary

Build accidentpath.com as a **consumer-first personal injury guidance + attorney matching platform** operating inside a CA LRS-compliant framework. The MVP ships with:
- **39 pages** (22 core + 16 city + about/privacy/terms)
- **10 interactive tools** (5 at launch, 5 in post-launch)
- **2 states** (CA + AZ) with deep city-level SEO coverage
- **Full intake wizard** with state routing engine
- **Compliance-first architecture** (every page disclaimered, counsel-reviewed)

**Why this wins:** Competitor industry average UX is 5.4/10. Zero competitors have educational content or interactive tools. A premium build instantly differentiates.

---

## Team Roles & Delegation

| Role | Who | Responsibilities |
|------|-----|------------------|
| **Michael** | Michael Monfared | Business ops, attorney recruitment, paid media, final approvals |
| **Claude** | AI Agent | All core development (Next.js, components, tools, SEO, tests) |
| **Developer** | TBD / Contract | Vercel infra, CI/CD, CRM webhook, email/SMS integrations, P2 tools |
| **Content Writer** | TBD / Contract | 25 cornerstone pages + 16 city pages, all as JSON content files |
| **Legal Counsel** | TBD / Retain | State compliance maps, content review, disclaimers, panel agreements |
| **Designer** | TBD / Contract | Logo, custom icon set, brand identity finalization |
| **SEO Specialist** | TBD / Contract | Meta titles/descriptions, GSC monitoring, keyword research |
| **QA Engineer** | TBD / Contract | Lighthouse, WCAG, cross-browser, mobile testing |
| **Rogelio** | Team member | Full lead access (pending setup) |

---

## Phase Overview

```
Business/Legal (parallel)  ████████████████████████████████████████ Ongoing
Phase 0: Bootstrap         ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Day 1-2
Phase 1: Design System     ░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░ Day 3-6
Phase 2: Page Templates    ░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░ Day 7-10
Phase 3: Intake + Rules    ░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░ Day 11-13
Phase 4: Tools (5 P0)      ░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░ Day 14-21
Phase 5: Content (parallel) ░░░░░░░░░░░░░░░░░░████████████████░░░ Day 18-30
Phase 6: SEO               ░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░░ Day 26-30
Phase 7: Integrations      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░ Day 28-32
Phase 8: QA + Launch       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░ Day 31-37
Phase 9: Post-Launch       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ Day 38+
```

**MVP Launch Target: Day 37 (~5.5 weeks from kickoff)**

---

## Detailed Phase Breakdown

### Business/Legal Track (Parallel — starts Day 1)

These run alongside development. **They are blocking dependencies.**

| Task | Owner | Priority | Blocks |
|------|-------|----------|--------|
| Register AccidentPath LLC | Michael | P0 | Bank account, panel agreements |
| Email LRS@calbar.ca.gov | Michael | P0 | CA certification path |
| Retain legal ethics counsel | Michael | P0 | ALL state content, disclaimers |
| Draft privacy/terms/disclaimers | Legal Counsel | P0 | Contact page, intake flow |
| Map CA compliance rules | Legal Counsel | P0 | CA state + city content |
| Map AZ compliance rules | Legal Counsel | P0 | AZ state + city content |
| Draft panel agreement | Legal Counsel | P1 | Attorney recruitment |
| Recruit 5 LA attorneys | Michael | P1 | Lead routing go-live |
| Recruit 5 Phoenix attorneys | Michael | P1 | Lead routing go-live |

### Phase 0: Project Bootstrap (Day 1-2) — 15h

| Task | Owner | Hours |
|------|-------|-------|
| Initialize Next.js 14 + TS + Tailwind | Claude | 2 |
| Create Vercel project + GitHub repo | Developer | 1 |
| Create Supabase project + schema | Claude | 3 |
| Set up CI pipeline | Developer | 3 |
| Configure GA4 + GSC | Michael | 2 |
| Folder structure + data models | Claude | 4 |

### Phase 1: Design System + CMS + SEO Foundation (Day 3-6) — 32h

**SEO is embedded in every phase from here forward — not a separate Phase 6.**

| Task | Owner | Hours |
|------|-------|-------|
| Tailwind theme tokens (finalized palette — see DESIGN-SYSTEM.md) | Claude | 2 |
| Header (mega-menu) | Claude | 4 |
| Footer (disclaimers + CCPA "Do Not Sell" link) | Claude | 3 |
| MobileNav | Claude | 3 |
| Core UI components (5) | Claude | 4 |
| StateSelector (CA + AZ cities) | Claude | 2 |
| JSON CMS loader + Zod (with min word count validation) | Claude | 3 |
| **SEO primitives (SchemaOrg, MetaTags, CanonicalUrl, Hreflang)** | Claude | 4 |
| **BreadcrumbList component (every page from Day 1)** | Claude | 1 |
| **Dynamic sitemap.xml (app/sitemap.ts)** | Claude | 2 |
| Compliance wrapper HOC | Claude | 2 |
| Brand logo + icons | Designer | 12 |

### Phase 2: Page Templates (Day 7-10) — 33h

8 reusable templates driven by JSON content:

| Template | Route | Owner | Hours |
|----------|-------|-------|-------|
| Home | `/` | Claude | 6 |
| Accident Hub | `/accidents/[slug]` | Claude | 5 |
| Injury | `/injuries/[slug]` | Claude | 3 |
| Guide | `/guides/[slug]` | Claude | 3 |
| State | `/states/[state]` | Claude | 4 |
| **City** (new) | `/states/[state]/[city]` | Claude | 4 |
| Tool | `/tools/[slug]` | Claude | 3 |
| Static pages (7) | Various | Claude | 5 |

### Phase 3: Intake + State Rules Engine (Day 11-13) — 20h

| Task | Owner | Hours |
|------|-------|-------|
| IntakeWizard (9-step multi-step) | Claude | 8 |
| ConsentCheckbox + TCPA | Claude | 1 |
| State rules engine (CA + AZ) | Claude | 4 |
| Find Help flow (3 pages) | Claude | 4 |
| Server Actions + Supabase persistence | Claude | 3 |

### Phase 4: Interactive Tools (Day 14-21) — 49h

**P0 tools (launch):**

| Tool | Route | Owner | Hours |
|------|-------|-------|-------|
| ToolEngine (shared) | — | Claude | 5 |
| Accident Case Quiz | `/tools/accident-case-quiz` | Claude | 4 |
| Urgency Checker | `/tools/urgency-checker` | Claude | 4 |
| Evidence Checklist | `/tools/evidence-checklist` | Claude | 5 |
| Injury Journal | `/tools/injury-journal` | Claude | 8 |
| Lawyer Matcher | `/tools/lawyer-type-matcher` | Claude | 4 |

**P2 tools (post-launch):**

| Tool | Route | Owner | Hours |
|------|-------|-------|-------|
| Lost Wages Estimator | `/tools/lost-wages-estimator` | Developer | 4 |
| Insurance Call Prep | `/tools/insurance-call-prep` | Developer | 4 |
| Record Request | `/tools/record-request` | Developer | 3 |
| Settlement Readiness | `/tools/settlement-readiness` | Developer | 3 |
| State Next-Steps | `/tools/state-next-steps` | Developer | 5 |

### Phase 5: Content (Day 18-30, parallel) — 97h

| Content | Count | Owner | Hours | Notes |
|---------|-------|-------|-------|-------|
| Home page | 1 | Content Writer | 4 | |
| Accident hubs | 5 | Content Writer | 20 | car, truck, motorcycle, slip-fall, workplace |
| Guide pages | 5 | Content Writer | 15 | |
| About/How It Works | 1 | Content Writer | 3 | |
| CA state page | 1 | Content Writer | 4 | Counsel-reviewed |
| AZ state page | 1 | Content Writer | 4 | Counsel-reviewed |
| **CA city pages** | **10** | Content Writer | **15** | LA, SD, SJ, SF, Fresno, Sac, LB, Oakland, Bako, Anaheim |
| **AZ city pages** | **6** | Content Writer | **9** | Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert |
| For Attorneys page | 1 | Content Writer | 3 | |
| **Legal counsel reviews** | — | Legal Counsel | **14** | CA content, AZ content, disclaimers |
| Meta titles/descriptions | 39 | SEO Specialist | 6 | Unique per page, no templates |

### Phase 6: SEO Polish + Blog Launch (Day 26-30) — 18h

**Note:** Core SEO (schema, meta, sitemap, breadcrumbs) is now embedded in Phase 1-2 templates. Phase 6 covers polish, blog launch, and internal linking optimization.

| Task | Owner | Hours |
|------|-------|-------|
| Internal linking engine (hub↔injuries↔tools↔state↔city) | Claude | 4 |
| Place schema on city pages | Claude | 2 |
| Blog section setup (/blog with 5-10 launch posts) | Claude | 4 |
| FAQ content blocks on top 5 hub pages (PAA-optimized) | Claude | 3 |
| Google Search Console submission + priority URL inspection | Claude | 1 |
| IndexNow integration via Vercel | Claude | 1 |
| AI Overview optimization pass on all hub pages | Claude | 3 |

### Phase 7: Integrations (Day 28-32) — 18h

| Task | Owner | Hours |
|------|-------|-------|
| CRM webhook endpoint | Developer | 4 |
| Call tracking (CA + AZ pools) | Michael | 4 |
| Email notifications (Resend) | Developer | 3 |
| SMS notifications (Twilio) | Developer | 3 |
| Analytics event schema | Claude | 3 |
| Clarity heatmaps | Developer | 1 |

### Phase 8: QA + Launch (Day 31-37) — 37h

| Task | Owner | Hours |
|------|-------|-------|
| Lighthouse audit (90+ target) | QA Engineer | 4 |
| WCAG 2.2 AA audit | QA Engineer | 6 |
| Compliance review (all pages) | Legal Counsel | 8 |
| E2E tests (Playwright) | Claude | 6 |
| Unit tests (rules + tools) | Claude | 4 |
| Cross-browser + mobile | QA Engineer | 4 |
| DNS cutover | Michael | 1 |
| Sentry setup | Developer | 2 |
| Smoke test + Slack alerts | Michael | 2 |

---

## Target Cities

### California (10 cities)
Los Angeles, San Diego, San Jose, San Francisco, Fresno, Sacramento, Long Beach, Oakland, Bakersfield, Anaheim

### Arizona (6 cities)
Phoenix, Tucson, Mesa, Chandler, Scottsdale, Gilbert

**Each city page must contain unique local data:**
- Local hospitals / ERs
- County court / filing info
- Accident stats or notable corridors
- State law summary (from shared state rules engine)
- CTA with city + state pre-filled

**Content rule:** NO templated descriptions. Each city page gets real, researched local details.

---

## Cost Estimates (External)

| Role | Est. Rate | Est. Hours | Est. Cost |
|------|-----------|------------|-----------|
| Legal Counsel | $300/hr | 50h | $15,000 |
| Content Writer | $50/hr | 100h | $5,000 |
| Designer (logo + icons) | $2,000 flat | — | $2,000 |
| QA Engineer | $75/hr | 14h | $1,050 |
| SEO Specialist | $100/hr | 10h | $1,000 |
| Contract Developer | $100/hr | 40h | $4,000 |
| **Total external** | | | **~$28,000** |

| Recurring | Monthly |
|-----------|---------|
| Vercel Pro | $20 |
| Supabase | $25 |
| Call tracking (16 metros) | $150 |
| Resend (email) | $20 |
| Twilio (SMS) | $50 |
| Sentry | $26 |
| Clarity | Free |
| **Total monthly** | **~$291** |

---

## Success Metrics

| Milestone | KPI | Target |
|-----------|-----|--------|
| Day 37 (Launch) | Pages live | 39 |
| Day 37 | Tools functional | 5 |
| Day 37 | Lighthouse score | 90+ all pages |
| Day 37 | Intake flow working | End-to-end |
| Day 60 | Attorney partners | 3-5 onboarded |
| Day 60 | Leads per week | 10+ |
| Day 90 | All tools live | 10 |
| Day 90 | Content pages | 80+ |
| Day 90 | Spanish UI | Tier-1 live |
| Day 90 | Revenue | First partner payments |

---

## Critical Dependencies

| Dependency | Blocks | Owner | Deadline |
|-----------|--------|-------|----------|
| Legal ethics counsel retained | All state content, disclaimers, panel agreements | Michael | Day 5 |
| CA compliance map complete | CA state/city content publish | Legal Counsel | Day 15 |
| AZ compliance map complete | AZ state/city content publish | Legal Counsel | Day 15 |
| Brand logo delivered | Header, favicon, OG images | Designer | Day 6 |
| Privacy policy drafted | Intake flow, contact page | Legal Counsel | Day 10 |
| Attorney panel recruited | Lead routing go-live | Michael | Day 35 |

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| State content ships without counsel review | HIGH | Zod schema gate: build refuses without `reviewedBy` + `reviewDate` |
| AI content drifts into "legal advice" phrasing | HIGH | Compliance lint rule + security-reviewer agent on every content PR |
| City pages become thin/duplicate | HIGH | Zod requires min word count + unique local fields (hospitals, courts) |
| Counsel review bottleneck delays launch | MEDIUM | Start counsel engagement Day 1; city pages reference state law via component, not inline |
| PDF bundle bloat from @react-pdf/renderer | MEDIUM | Dynamic import, client-only, route-level code split |
| Local SEO takes 60-90 days to rank | MEDIUM | Pair with paid search for LA + Phoenix from Day 1 |
| Attorney recruitment slower than planned | MEDIUM | Start recruiting Day 1; launch with intake collecting leads before partners ready |

---

## Notion Tasks Database

**All 98 tasks are in the Notion database for team delegation:**

[Open AccidentPath Project Tasks](https://www.notion.so/345917dc7b838123aa1cd0e6cdaf2f26)

**Database columns:**
- Task (title)
- Phase (select)
- Workstream (select: Development, Design, Content, SEO, Legal/Compliance, Business Ops, Integrations, QA/Testing, Marketing)
- Owner (select: Michael, Developer, Content Writer, SEO Specialist, Legal Counsel, Designer, QA Engineer, Rogelio, Claude)
- Priority (P0-P3)
- Status (Not Started, In Progress, Blocked, In Review, Done)
- Est. Hours (number)
- Target Date (date)
- Dependencies (text)
- State (multi-select: CA, AZ, Both)
- Notes (text)

**Filter views to create:**
- "My Tasks" — filter by Owner = [person]
- "This Week" — filter by Target Date
- "Blocked" — filter by Status = Blocked
- "By Phase" — group by Phase
- "By Workstream" — group by Workstream

---

## How to Use This Plan

1. **Michael:** Start Business/Legal track immediately. Retain counsel, recruit attorneys, register LLC.
2. **Claude:** Begin Phase 0-4 development. All dev tasks are assigned to Claude in the Notion DB.
3. **Content Writer:** Begin Phase 5 content once templates are ready (Day 18). Start city research earlier.
4. **Legal Counsel:** Review compliance maps first, then review content as it's produced.
5. **Designer:** Deliver logo + icons by Day 6 so header/footer can ship with real assets.
6. **Everyone:** Update task status in Notion daily. Flag blockers immediately.

---

**MOTTO**: "Build the most useful, trustworthy, high-converting accident guidance and attorney-matching website on the internet."
