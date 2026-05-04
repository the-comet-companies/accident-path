# Page Lead Capture — Design Spec

> Capture email addresses from content pages (home, accidents, injuries, states, guides) using contextual offers matched to user intent at each page type.

---

## Goal

Every content page on AccidentPath has a natural on-ramp to capturing an email address. The offer varies by page type to match user intent. Captured leads feed the same Slack `#ap-lrs` notification pipeline as tool leads — manual follow-up for now, automatable later.

## Architecture

### New Components

**`components/ui/PageLeadCapture.tsx`**
- Email-only capture block (no phone, no TCPA checkbox)
- Props: `headline`, `subtext`, `buttonLabel`, `toolSlug`, `toolContext`
- Posts to existing `/api/tool-lead` with `pattern: 'A'`
- Shows inline success state on submit
- Privacy policy link replaces TCPA checkbox

**`components/ui/SolLeadCapture.tsx`** (state pages only)
- Extends the pattern: user enters accident date → SOL deadline computed inline → email field appears
- Computes deadline using existing `STATE_RULES` from `lib/state-rules.ts`
- `tool_context` includes `{ state, accidentDate, solDeadline }`
- Posts to same `/api/tool-lead` endpoint

**`lib/page-lead-config.ts`**
- Config map: page type → `{ headline, subtext, buttonLabel }`
- Mirrors pattern of `lib/tools/lead-capture-config.ts`

### No New Infrastructure

- API route: existing `/api/tool-lead`
- Database: existing `tool_leads` table — `tool_slug` prefixed `page-` (e.g., `page-accident-car-accident`)
- n8n workflow: existing `accidentpath - tool lead notification`
- Slack channel: existing `#ap-lrs`

The `page-` prefix in `tool_slug` allows easy filtering of page leads vs. tool leads in Supabase queries.

---

## Page-by-Page Spec

### Home Page
- **Placement:** Strip section between "How It Works" and accident categories grid
- **Headline:** "Get our free accident recovery guide"
- **Subtext:** "Know what to do, what to document, and when to act."
- **Button:** "Send Me the Guide"
- **`tool_slug`:** `page-home`
- **Implementation:** Inline in `app/(en)/page.tsx` — not a separate component, it's a one-off section

### Accident Pages (`/accidents/[slug]`)
- **Placement:** After intro + first content section, before detailed steps
- **Headline:** "Get the [Accident Type] checklist emailed to you"
- **Subtext:** "A quick reference for what to document, report, and do next."
- **Button:** "Email Me the Checklist"
- **`tool_slug`:** `page-accident-{slug}` (e.g., `page-accident-car-accident`)
- **`tool_context`:** `{ accidentType: data.title }`

### Injury Pages (`/injuries/[slug]`)
- **Placement:** After injury overview, before treatment/legal sections
- **Headline:** "Get a [Injury] symptom & documentation guide"
- **Subtext:** "Know what to track, when to see a doctor, and what insurers look for."
- **Button:** "Email Me the Guide"
- **`tool_slug`:** `page-injury-{slug}` (e.g., `page-injury-whiplash`)
- **`tool_context`:** `{ injuryType: data.title }`

### State Pages (`/states/[state]`)
- **Placement:** After state overview, before city grid
- **Component:** `SolLeadCapture` (interactive SOL calculator)
- **Headline:** "Know your [State] filing deadline"
- **Subtext:** "Your personal injury deadline, calculated from your accident date."
- **Button:** "Email Me My Deadline"
- **`tool_slug`:** `page-state-{state}` (e.g., `page-state-ca`)
- **`tool_context`:** `{ state, accidentDate, solDeadline }`

### Guide Pages (`/guides/[slug]`)
- **Placement:** End of guide content, before disclaimer banner
- **Headline:** "Want this guide emailed to you?"
- **Subtext:** "Save it for reference — especially useful in the days after an accident."
- **Button:** "Email Me This Guide"
- **`tool_slug`:** `page-guide-{slug}` (e.g., `page-guide-what-to-do-after-car-accident`)
- **`tool_context`:** `{ guideTitle: data.title }`

---

## Data Flow

```
User submits email on content page
  → PageLeadCapture / SolLeadCapture
  → POST /api/tool-lead { tool_slug: "page-*", pattern: "A", email, consent: true, tool_context }
  → Supabase insert into tool_leads
  → n8n webhook → accidentpath - tool lead notification workflow
  → Slack #ap-lrs notification (shows page slug + email)
```

---

## Implementation Order (Checkpoints)

Each checkpoint is independently deployable and testable end-to-end before the next begins.

1. **Checkpoint 1:** `PageLeadCapture` component + home page strip
2. **Checkpoint 2:** Accident pages
3. **Checkpoint 3:** Injury pages
4. **Checkpoint 4:** State pages + `SolLeadCapture`
5. **Checkpoint 5:** Guide pages

---

## Compliance Notes

- Email-only capture does not trigger TCPA requirements (no phone, no autodialed calls)
- Privacy Policy link on every capture form satisfies CAN-SPAM disclosure requirement
- No implied legal advice in offer copy — guides and checklists are "educational information"
- Disclaimers already present on all pages via `DisclaimerBanner`
