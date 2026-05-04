# Session Notes — 2026-05-04

## Summary

Session complete. Two major Notion data quality tasks finished: Meta Description column fully populated across all ~96 pages, and Spanish Route column fixed — 67 rows were missing the `https://accident-path.vercel.app` domain prefix and are now corrected. InjuryJournal lead capture + hydration fix also shipped earlier in this session.

---

## Context Coming In

All PENDING.md work is complete as of 2026-05-01. Site is fully bilingual. Notion tracker is synced.

Next phase: **Attorney Matching System** — n8n-driven intake routing.

---

## Attorney Matching System — Plan

### Agreed Architecture
- `/api/intake` (Next.js) POSTs to an n8n webhook URL after saving to Supabase
- n8n workflow handles:
  1. Slack notification to `#leads` channel (`C0ATA1QUBRD`) via gptbot
  2. User confirmation email (if email provided)
- No custom Slack/email code in Next.js codebase — n8n owns all notification logic
- Slack App "AccidentPath Leads" creation was blocked (free plan 10-app limit); using gptbot already in channel instead

### Infrastructure Still Needed
- [ ] n8n workflow (webhook trigger → Slack + email)
- [ ] `attorneys` Supabase table + matching logic
- [ ] Update `/api/intake` to POST to n8n webhook
- [ ] Attorney onboarding form on `/for-attorneys`

### Env Vars Needed
- `N8N_WEBHOOK_URL` — the n8n webhook endpoint URL

---

## TODO After Attorney Matching
- Lead Magnets / Resources section (`/resources` hub + `/resources/[slug]` gated pages)
- Dependency: attorney matching must be live first

---

## Work This Session

### n8n Workflow — accidentpath - intake lead notification ✅
- Workflow ID: `EduJ32K8EsTHqHrK`
- Active at: `https://n8n-dtla-c914de1950b9.herokuapp.com/webhook/accidentpath-intake`
- Nodes: Intake Webhook → Prepare Data (code) → Notify Leads Channel (Slack `C0ATA1QUBRD`) → Has Email? (IF) → Send Confirmation Email (disabled — needs SMTP)
- Slack credential reused: "Bot Slack account" (`OtHOQtNyZ413Arrz`)
- Urgency logic: High (surgery / can't work) 🔴, Medium (ongoing / missed days / reduced) 🟡, Low (everything else) 🟢
- `/api/intake` updated: fire-and-forget POST to n8n after Supabase insert (silent fail if n8n down)
- `N8N_WEBHOOK_URL` added to `.env.local`

### TODO — Still Needed
- [x] Add `N8N_WEBHOOK_URL` to **Vercel env vars** (handled by user during session)
- [ ] Configure SMTP credential in n8n ("AccidentPath SMTP") then enable the confirmation email node
  - SMTP: `smtp.gmail.com:587`, from: `sales@dtlaprint.com`, Google Workspace app password
- [ ] Add `N8N_TOOL_LEAD_WEBHOOK_URL` to **Vercel env vars**
  - Value: `https://n8n-dtla-c914de1950b9.herokuapp.com/webhook/accidentpath-tool-lead`

### Tool Lead Capture — SMTP Email Delivery (Phase 2)
Pattern A tools (Evidence Checklist, Lost Wages Estimator, etc.) show copy like "Email Me the Checklist."
Currently: contact is captured → Supabase → Slack `#ap-lrs` notification only. No email goes to the user yet.
**Pending:** Once SMTP is configured in n8n, add an email node to the `accidentpath - tool lead notification` workflow that sends the actual content (checklist, estimate, etc.) to the captured email address. One email template per tool slug.

### Notion Pending Tasks (visible to teammates)
Tracked in the "Accident Path Website Pages" DB using Category = "Task" + Status = "Pending".
A dedicated **"tasks" view** filters by Category = Task — teammates can see all pending work there.
- `⏳ Tool Lead Email Delivery (SMTP)` — Pattern A email delivery once SMTP configured
- `⏳ TASK: Intake Confirmation Email (SMTP)` — enable disabled node in intake workflow + add N8N_TOOL_LEAD_WEBHOOK_URL to Vercel
- `⏳ TASK: Attorney Matching System` — deferred; Supabase attorneys table + matching logic + /for-attorneys form

**Convention for future tasks:** Category = "Task", Status = "Pending", title prefix `⏳ TASK:`

### Notion — Meta Description Column ✅
- Populated `Meta Description` field for all ~96 rows in "Accident Path Website Pages" DB
- Values sourced from `metaDescription` field in each page's content JSON (`content/accidents/*.json`, `content/injuries/*.json`, `content/guides/*.json`, `content/cities/*.json`, etc.) — exact strings Next.js renders in `<meta name="description">`
- Script used: `scripts/extract-meta.js` (walks `content/` dir, reads `metaDescription` + builds route)
- City pages use `/states/{state}/{city}` routes in Notion, not `/cities/{slug}` — matched manually via subagent

### Notion — Spanish Route Column Fixed ✅
- Found 67 rows where Spanish Route was stored as a relative path (`/es/...`) instead of a full URL
- Patched all 67 to `https://accident-path.vercel.app/es/...`
- Affected categories: all — cities, accidents, injuries, guides, tools, states, hubs, lead gen pages

### InjuryJournal Lead Capture + Hydration Fix ✅
- Added `ToolLeadCapture` to `components/tools/InjuryJournal.tsx` — shown in List view after ≥1 entry logged (EN only)
- Tool context passed: `painLevel` + `injuries` (symptom labels) from the latest entry
- Fixed SSR hydration mismatch: moved localStorage read from `useState` lazy init to `useEffect` post-mount

### Debugging Notes
- Root cause of initial failure: webhook node was created via API without a `webhookId` top-level property — n8n couldn't match incoming requests to the registered webhook
- Fix: added `webhookId: "accidentpath-intake"` to the node via `n8n_update_partial_workflow`
- Verified: execution `1160974` succeeded (280ms), Slack message confirmed received in `#ap-lrs`

---

## Page Lead Capture — 2026-05-04 (continued session)

### Goal
Add email capture touchpoints across all content page types (home, accidents, injuries, states, guides) feeding the existing `/api/tool-lead` → Supabase → Slack pipeline. No new API routes, no schema changes.

### Components Built
- **`components/ui/PageLeadCapture.tsx`** — email-only capture card. `bare` prop strips wrapper for use inside modal. POSTs to `/api/tool-lead` with `pattern: 'A'`, fires `trackEvent('tool_lead_submitted')`.
- **`components/ui/PageLeadCaptureModal.tsx`** — native `<dialog>` modal. Trigger button (amber), backdrop click closes, X button, no backdrop blur. Wraps `PageLeadCapture` with `bare`.

### Home Page (Checkpoint 1 ✅)
- Trust row refactored: 4 trust columns on left, brand statement + CTA on right
- Replaced inline email block with `PageLeadCaptureModal` next to "View all 13 accident types" link
  - `toolSlug: 'page-home'`, `toolContext: { source: 'home' }`
  - Copy: "Get Free Accident Guide" → modal → "Send Me the Guide"
- Same modal added to ES home (`app/(es)/es/page.tsx`) with Spanish copy
  - `toolSlug: 'page-home-es'`, `toolContext: { source: 'home-es' }`

### n8n Workflow Updated
- `accidentpath - tool lead notification` (ID: `3mjn5gjskMVgWefV`) — added page slug labels to `toolLabels` map:
  - `page-home` → "Home Page", `page-home-es` → "Home Page (ES)", `page-accident` → "Accident Page", `page-injury` → "Injury Page", `page-state` → "State Page", `page-guide` → "Guide Page"
- Slack message format: `📋 *Tool Lead — Home Page* | Email: ... | Source: home | Submitted: ...`

### Notion Task Added
- `⏳ TASK: Accident Recovery Guide — Content + Email Delivery`
- Note: This is a **guide page** (`/guides/accident-recovery-guide`), not a tool. Email links to the page. Falls under Checkpoint 5 (guide pages).

### Hydration Error (browser extension — not a code bug)
- `fdprocessedid` attributes injected by "Fake Data" Chrome extension into buttons/selects before React hydrates
- Causes a React hydration mismatch warning in dev. Safe to ignore; disappears in Incognito without extensions.

### Checkpoints Status
| # | Pages | Status |
|---|-------|--------|
| 1 | Home (EN + ES) | ✅ Done |
| 2 | Accident pages (EN + ES) | ✅ Done |
| 3 | Injury pages (EN + ES) | ✅ Done |
| 4 | State pages — SolLeadCapture (EN + ES) | ✅ Done |
| 5 | Guide pages (EN + ES) | ✅ Done |

### Supabase Security Fix ✅
- Enabled RLS on `tool_leads` table
- `/api/tool-lead` route now uses `getSupabaseAdmin()` (service role key) instead of anon key
- `SUPABASE_SERVICE_ROLE_KEY` added to Vercel + `.env.local`
- Anon insert policy dropped — no public access to table at all
- `lib/supabase.ts` exports both `getSupabase()` (anon) and `getSupabaseAdmin()` (service role, server-side only)

### n8n Workflow Labels Updated ✅
- `accidentpath - tool lead notification` (ID: `3mjn5gjskMVgWefV`) now maps all page slugs:
  - EN: `page-home`, `page-accident`, `page-injury`, `page-state`, `page-guide`
  - ES: `page-home-es`, `page-accident-es`, `page-injury-es`, `page-state-es`, `page-guide-es`

### SMTP / Email Delivery
- Pending SMTP credentials for accidentpath.com (user to request from PM)
- Once ready: configure in n8n, wire email delivery node to `accidentpath - tool lead notification` workflow
- Notion task: `⏳ TASK: Page Lead Email Delivery (SMTP)` covers all page slug types

### TODO Still Needed
- [ ] Add `N8N_TOOL_LEAD_WEBHOOK_URL` to Vercel env vars
  - Value: `https://n8n-dtla-c914de1950b9.herokuapp.com/webhook/accidentpath-tool-lead`
- [ ] Request SMTP credentials for accidentpath.com from PM (e.g. hello@accidentpath.com)
- [ ] Configure SMTP in n8n then wire email delivery for page leads
