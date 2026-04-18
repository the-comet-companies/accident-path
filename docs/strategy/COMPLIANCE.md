# Compliance & Legal Requirements

> THIS FILE IS NON-NEGOTIABLE. Every agent MUST read this before writing ANY user-facing content.

---

## 1. California LRS Certification

### Governing Law
- **Business & Professions Code §§ 6155–6156**
- **State Bar LRS Rules & Regulations** (see `LRS-Rules.pdf`)

### Key Requirements
- Must be State Bar certified to operate a lawyer referral service in California
- Must be operated by a nonprofit or State Bar-certified entity
- Application filed directly through the State Bar
- Certification fees apply (up to 1.5% of gross revenue, max $10K)
- Must comply with detailed operational rules
- Separate certification required for each county of operation
- Annual reports required
- Subject to investigation and audit

### How to Apply
1. Email `LRS@calbar.ca.gov` requesting a certification application
2. Form a legal business entity (LLC/Corp) via CA Secretary of State at bizfileOnline
3. Build attorney panel with signed panel agreements
4. Submit application + pay fees
5. Await review and certification

---

## 2. Compliance Lanes

### Lane A: Safest Launch (RECOMMENDED FOR MVP)

**Launch as:**
- Educational brand
- Lead generation vendor
- Intake and document support platform
- Partner network with explicit disclaimers

**MUST AVOID:**
- Claiming "best lawyer"
- Implying unbiased recommendation unless legally structured to do so
- Giving state-specific legal advice without counsel review
- Signing contingency agreements yourself unless your structure allows it
- Advertising coverage in states you haven't cleared

**Key Rule:** Arizona's rule commentary says paid lead generation is allowed, but NOT if it creates the impression you are recommending a lawyer or analyzing legal problems for routing. California says referral services operating there must be certified unless exempt.

### Lane B: Regulated Referral Path (FUTURE)

For states like California, requires:
- Certified lawyer referral service pathway
- Local compliant entity or partner
- Documented panel criteria
- Complaint procedures
- County-by-county operational plan

---

## 3. Language Rules (MANDATORY)

### SAFE Language Patterns

All agents MUST use these patterns in user-facing copy:

```
"Based on what you told us, lawyers who typically handle matters like this include..."
"You may benefit from speaking with a lawyer experienced in..."
"Availability varies by state and case type."
"This information is for educational purposes only and does not constitute legal advice."
"Every case is different. Consult a licensed attorney for advice specific to your situation."
"Results may vary. Past results do not guarantee future outcomes."
```

### PROHIBITED Language

NEVER use these in any user-facing content:

```
"We recommend this lawyer" (implies expert recommendation)
"The best attorney for your case" (unsubstantiated claim)
"You should sue" / "You have a case" (legal advice)
"We guarantee results" (prohibited claim)
"Our expert recommendation" (implies qualified legal analysis)
"You need a lawyer" (could constitute legal advice)
"Your case is worth $X" (case valuation = legal advice)
```

### Routing Language

Instead of "we pick your lawyer," say:
- "Based on what you told us, lawyers who typically handle matters like this include..."
- "You may benefit from speaking with a lawyer experienced in..."
- "Availability varies by state and case type."

---

## 4. Required Disclaimers

### Every Page Footer
```
AccidentPath is not a law firm and does not provide legal advice. Information
provided is for educational purposes only. By using this site, you acknowledge
that no attorney-client relationship is formed. If you are in immediate danger,
call 911. For medical emergencies, seek care immediately.
```

### Intake/Matching Pages
```
AccidentPath connects consumers with attorneys in our network. Attorneys in our
network may pay a fee for marketing services. This does not affect the quality of
service you receive. AccidentPath does not endorse or guarantee any attorney's services.
```

### Tool Pages
```
This tool is for informational and educational purposes only. It does not constitute
legal advice and should not be relied upon as such. Consult a licensed attorney
for advice specific to your situation.
```

### State-Specific Content
```
Laws vary by state. The information on this page is general in nature and may not
reflect the current law in your jurisdiction. Consult a licensed attorney in your
state for specific guidance.
```

---

## 5. Disclosure Requirements

Every page must disclose:
1. Who operates the site (entity name, type)
2. The site is NOT a law firm
3. How attorney matching works
4. Whether attorneys pay for participation/marketing
5. That no attorney-client relationship is formed by using the site
6. Emergency guidance (911, seek medical care)
7. Privacy practices (link to privacy policy)
8. TCPA-style consent before collecting contact info

---

## 6. State-by-State Rules

### Operating Model
The platform must maintain a compliance matrix for each state covering:
- Advertising regulations
- Intake rules
- Unauthorized practice of law (UPL) risk
- Fee-sharing rules
- Referral service regulations
- Required disclosures

**RULE: Do NOT expand to a new state without specific legal review for that state.**

### Initial Launch States
- Start with 3 states maximum
- Each must be reviewed by legal ethics counsel before launch
- Arizona is favorable (ABS framework exists)
- California requires State Bar LRS certification

---

## 7. Content Review Requirements

| Content Type | Review Required |
|-------------|----------------|
| State-specific legal information | Attorney review in that state |
| Medical content | Medical reviewer sign-off |
| Tool outputs / suggestions | Compliance review |
| Intake form language | Legal counsel review |
| Disclaimer text | Legal counsel approval |
| Advertising copy | Compliance check per state rules |

---

## 8. CCPA / Privacy Regulation Compliance (NEW)

The site uses GA4, Microsoft Clarity heatmaps, call tracking, and potentially retargeting pixels. California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) requirements apply.

### Required Elements

| Requirement | Implementation |
|-------------|---------------|
| "Do Not Sell or Share My Personal Information" link | Footer on every page, links to `/privacy#do-not-sell` |
| Privacy policy with CCPA-specific disclosures | Categories of data collected, purposes, third parties, consumer rights |
| Right to delete personal information | Process for users to request data deletion |
| Right to know what data is collected | Accessible disclosure of all data collection |
| Opt-out of sale/sharing | Functional opt-out mechanism (cookie consent banner) |
| Cookie consent banner | Display on first visit, record consent, respect choices |
| GPC (Global Privacy Control) | Honor browser-level opt-out signals |
| Data retention policy | Define how long intake data, analytics data, and journal data are retained |

### Cookie Consent Implementation

```
1. On first visit: display banner with "Accept" / "Manage Preferences" / "Reject All"
2. Categories: Essential (always on), Analytics (GA4, Clarity), Marketing (retargeting)
3. If user rejects: do NOT load GA4, Clarity, or marketing pixels
4. Store consent choice in cookie (12-month expiry)
5. Provide "Cookie Settings" link in footer to change preferences
```

### Privacy Considerations for Tools

- **Injury Journal (Tool 4):** Photos uploaded to local storage have privacy implications. If Supabase sync is added, this becomes HIPAA-adjacent. Add explicit consent before any cloud storage.
- **Intake Wizard:** Contact information collected requires TCPA consent AND CCPA disclosure. Both must be in the language the user is viewing.
- **All tools:** No data sent to server until user explicitly consents.

---

## 9. TCPA Consent Language (FINALIZED)

**English:**
```
By submitting this form, I consent to receive calls, text messages, and emails
from AccidentPath and its attorney partners regarding my inquiry. I understand
that calls may be made using automated technology. Message and data rates may
apply. I understand this service is free and I am not obligated to retain any
attorney. I may revoke consent at any time by contacting us at [email/phone].
```

**Spanish:**
```
Al enviar este formulario, doy mi consentimiento para recibir llamadas, mensajes
de texto y correos electrónicos de AccidentPath y sus abogados asociados sobre
mi consulta. Entiendo que las llamadas pueden realizarse mediante tecnología
automatizada. Pueden aplicarse tarifas de mensajes y datos. Entiendo que este
servicio es gratuito y no estoy obligado a contratar a ningún abogado. Puedo
revocar mi consentimiento en cualquier momento contactándonos en [email/teléfono].
```

**Requirements:**
- Consent checkbox must be unchecked by default
- Must be visible and readable (not hidden in fine print)
- Must be in the language the user is viewing (EN or ES)
- Record timestamp, IP, and consent text version for audit trail
- Legal counsel must approve final language before launch

---

## 10. Technical Compliance Automation (NEW)

### Automated Compliance Lint Rules

Every page must pass these automated checks in CI/CD:

| Check | Rule | Implementation |
|-------|------|----------------|
| Disclaimer presence | Every page has footer disclaimer block | Zod schema: `disclaimer` field required |
| Attorney review badge | Every content page has `reviewedBy` + `reviewDate` | Zod schema: build refuses without these fields |
| Safe language check | No prohibited phrases in content JSONs | CI lint rule scans for prohibited patterns |
| TCPA consent | Intake pages include consent checkbox component | Component required in intake flow |
| Emergency banner | Pages mentioning injury/medical have 911 guidance | Automated check for EmergencyBanner component |
| Min word count | Hub pages ≥ 2,500 words, guides ≥ 1,500 | Zod schema with word count validation |
| Unique meta | No two pages share title or description | Build-time check across all content JSONs |

### Compliance Audit Schedule

| Frequency | Audit | Owner |
|-----------|-------|-------|
| Every PR | Automated lint checks (CI) | Claude / Developer |
| Monthly | Manual review of 10 random pages | Legal Counsel |
| Quarterly | Full compliance review of all published pages | Legal Counsel |
| Per state expansion | Complete state-specific compliance review | Legal Counsel |

---

## 11. Reminders for All Agents

1. **The safest rule:** Generate demand and educate. Do not present yourself as making "expert recommendations."
2. **Do not** present tools as legal advice engines — present them as educational tools and intake aids with clear disclaimers.
3. **Do not** route legal problems unless the structure supports it.
4. **Always** escalate to a licensed lawyer for anything that could be construed as legal analysis.
5. **When in doubt**, use more disclaimers, not fewer.
6. **Disclaimers must NOT be included in structured data** (schema.org) answer text.
7. **CCPA compliance** is required on every page — cookie consent, Do Not Sell link, privacy disclosures.
8. **TCPA consent** must be collected before any contact information is stored or shared.
