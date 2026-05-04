# Tools Lead Capture — Opportunities & Patterns

> Discovery doc — identifying natural, non-forced contact capture moments across all 11 interactive tools.
> Status: Discovery / Pre-Design

---

## The Principle

Every tool gives the user something useful (a deadline, a checklist, a dollar amount, a result).
The contact capture ask should feel like an extension of that value — not a gate, not a distraction.

**Rule:** Never ask for contact info before the user has received their result.
**Rule:** Always frame the ask as delivering something useful to them (reminder, checklist, estimate, matches).
**Compliance:** TCPA consent checkbox required on any form that captures phone number.

---

## Three Patterns

All 11 tools map to one of three capture mechanics:

| Pattern | Hook | What We Get |
|---------|------|-------------|
| **A — Email/Text My Results** | "Send this to me so I don't lose it" | Email or phone |
| **B — Find Me An Attorney** | "Get matched based on this result" | Name + phone + email |
| **C — Get Personalized Next Steps** | "Customize this for my city/situation" | City + phone |

Pattern B is the highest-intent capture — equivalent to starting the intake wizard but with context pre-filled from the tool result.

---

## Tool-by-Tool Breakdown

### 1. Statute Countdown
**User state:** Anxious, deadline-conscious. May see CRITICAL flag (<90 days).
**Pattern:** A — Email/Text My Results
**Hook:** "Text me a reminder 30 days before my deadline"
**Why it works:** They're already worried about missing the deadline — a reminder is a service.
**Capture fields:** Phone (for SMS reminder) — low friction, high value

---

### 2. State Next Steps
**User state:** Wants clarity on deadlines and state rules.
**Pattern:** A — Email/Text My Results
**Hook:** "Email me these deadlines"
**Why it works:** State-specific info + dates is exactly what someone saves for reference.
**Capture fields:** Email

---

### 3. Lawyer Type Matcher
**User state:** Ready to act — knows they need an attorney, now learning what kind.
**Pattern:** B — Find Me An Attorney
**Hook:** "Find [Motor Vehicle] attorneys in [my city]"
**Why it works:** They literally just asked "what kind of lawyer do I need?" — natural next question is "where do I find one?"
**Capture fields:** Name + phone + city (pre-fills attorney type from result)
**Note:** Highest-intent tool alongside Statute Countdown. Attorney type can be pre-populated from result.

---

### 4. Settlement Readiness
**User state:** Evaluating whether to accept a settlement offer. Often missing attorney.
**Pattern:** B — Find Me An Attorney
**Hook:** "Want a free review before you settle?"
**Why it works:** Tool explicitly warns against settling without a lawyer. Capture is the natural next step from that warning.
**Capture fields:** Name + phone
**Note:** If score shows "no attorney consulted" — emphasize this in the hook copy.

---

### 5. Lost Wages Estimator
**User state:** Just saw a dollar amount representing their losses. Emotionally impactful.
**Pattern:** A — Email/Text My Results
**Hook:** "Email me this estimate + what I need to document it"
**Why it works:** The estimate ($14,200, etc.) is something they want to save and show an attorney.
**Capture fields:** Email
**Bonus:** Include documentation checklist in the email — increases perceived value.

---

### 6. Evidence Checklist
**User state:** Racing against time — surveillance footage, skid marks, witnesses disappearing.
**Pattern:** A — Email/Text My Results
**Hook:** "Email me this checklist"
**Why it works:** Pure utility. If 72-hour surveillance window is flagged, urgency is already built in.
**Capture fields:** Email
**Note:** One of the easiest asks on the site — no persuasion needed.

---

### 7. Record Request Checklist
**User state:** Organized, in administrative mode. Tracking what records to get and from where.
**Pattern:** A — Email/Text My Results
**Hook:** "Email me this checklist"
**Why it works:** Same as Evidence Checklist — procedural, useful, obvious.
**Capture fields:** Email

---

### 8. Accident Case Quiz
**User state:** Seeking clarity on what kind of case they have. Recommends attorney if recent.
**Pattern:** C — Get Personalized Next Steps
**Hook:** "Get personalized next steps for a [car accident] case in [CA/AZ]"
**Why it works:** Quiz result is general — the hook offers to make it specific to them.
**Capture fields:** City + phone (accident type and state already known from quiz)

---

### 9. Injury Journal
**User state:** Tracking daily pain and symptoms over time. High engagement, moderate intent.
**Pattern:** A — Email/Text My Results
**Hook:** "Save your journal progress" or "Get daily check-in reminders"
**Why it works:** Journal is ongoing — email/phone to preserve progress feels natural.
**Capture fields:** Email or phone
**Note:** Lower attorney-intent than other tools. Good for nurture/follow-up sequence later.

---

### 10. Insurance Call Prep
**User state:** Nervous, about to speak with an insurance adjuster. Wants protection.
**Pattern:** A — Email/Text My Results
**Hook:** "Text me this script before my call"
**Why it works:** They may be using the tool on mobile right before the call — SMS delivery is genuinely useful.
**Capture fields:** Phone

---

### 11. Urgency Checker
**User state:** Anxious about whether symptoms are serious.
**Pattern:** A — Email/Text My Results (conditional)
**Hook:** "Email me my symptom summary to bring to the doctor"
**Why it works:** Delivers a record of what they reported — useful for the doctor visit.
**Capture fields:** Email
**IMPORTANT:** If result is RED tier (go to ER immediately) — NO capture prompt. Focus is entirely on getting help now. Only show capture on YELLOW and GREEN results.

---

## Priority Order for Implementation

| Priority | Tool | Pattern | Reason |
|----------|------|---------|--------|
| 1 | Statute Countdown | A (SMS reminder) | Highest urgency + easiest yes |
| 2 | Lawyer Type Matcher | B (find attorney) | Highest intent, pre-filled context |
| 3 | Evidence Checklist | A (email checklist) | Easiest ask, time-sensitive hook |
| 4 | Settlement Readiness | B (find attorney) | High intent, captures near-decision users |
| 5 | State Next Steps | A (email deadlines) | Easy ask, deadline urgency |
| 6 | Lost Wages Estimator | A (email estimate) | Dollar amount is emotionally compelling |
| 7 | Record Request | A (email checklist) | Easy, procedural |
| 8 | Accident Case Quiz | C (personalized steps) | Moderate intent |
| 9 | Insurance Call Prep | A (SMS script) | Moderate, phone capture |
| 10 | Injury Journal | A (save progress) | Low intent, nurture value |
| 11 | Urgency Checker | A (email summary, conditional) | Handle RED tier carefully |

---

## What Happens With Captured Contacts

All captures → n8n webhook → Slack `#ap-lrs` notification + optional follow-up.

**Pattern A captures** (email/text results): Lower urgency Slack notification — user is researching.
**Pattern B captures** (find attorney): High urgency Slack notification — same as intake lead.
**Pattern C captures** (personalized steps): Medium urgency — user is close but not quite ready.

Notification format mirrors the existing intake Slack message (urgency tier, tool used, contact info).

---

## Open Questions (Pre-Design)

- Single shared API route (`/api/tool-lead`) or reuse `/api/intake`?
- Where exactly does the capture UI appear — inline within result card, or below the result as a separate section?
- Do Pattern B captures flow into the same `intake_sessions` Supabase table, or a separate `tool_leads` table?
- Email delivery for Pattern A — n8n handles this once SMTP is configured, or a third-party transactional email?
