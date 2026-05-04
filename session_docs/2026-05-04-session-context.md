# Session Notes — 2026-05-04

## Summary

_In progress._

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

### Debugging Notes
- Root cause of initial failure: webhook node was created via API without a `webhookId` top-level property — n8n couldn't match incoming requests to the registered webhook
- Fix: added `webhookId: "accidentpath-intake"` to the node via `n8n_update_partial_workflow`
- Verified: execution `1160974` succeeded (280ms), Slack message confirmed received in `#ap-lrs`
