# Email Templates (n8n) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build branded HTML email templates for `page-state` and `page-guide` lead captures inside the existing n8n workflow, with the Send Email node disabled until SMTP credentials arrive.

**Architecture:** The existing `accidentpath - tool lead notification` n8n workflow (ID: `3mjn5gjskMVgWefV`) currently routes: Webhook → Format Message → Notify Slack. We extend it with three new nodes after Slack: an IF node that gates on email presence, a code node that generates subject + HTML per slug, and a disabled Send Email node. Separately, guide pages need `guideSlug` added to their `toolContext` so the email can link to the correct guide URL.

**Tech Stack:** n8n (MCP tools for all workflow changes), Next.js 14 App Router (guide page toolContext change), inline HTML email templates with AccidentPath color scheme.

---

## Color Reference

| Token | Hex | Usage |
|-------|-----|-------|
| primary-900 | `#1e3a5f` | Email header background |
| primary-600 | `#2563eb` | CTA buttons, links |
| primary-50 | `#eff6ff` | Deadline card background |
| neutral-950 | `#0a0a0a` | Headline text |
| neutral-500 | `#6b7280` | Body text, footer |
| amber-50 | `#fffbeb` | Warning card background |
| amber-200 | `#fde68a` | Warning card border |
| amber-800 | `#92400e` | Warning card text |

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `app/(en)/guides/[slug]/page.tsx:159` | Add `guideSlug` to toolContext |
| Modify | `app/(es)/es/guias/[slug]/page.tsx:198` | Add `guideSlug` to toolContext (ES) |
| Modify | n8n workflow `3mjn5gjskMVgWefV` | Add Has Email? → Prepare Email → Send Email nodes |

---

## Task 1: Add `guideSlug` to guide page toolContext

**Files:**
- Modify: `app/(en)/guides/[slug]/page.tsx:154-160`
- Modify: `app/(es)/es/guias/[slug]/page.tsx:193-199`

- [ ] **Step 1: Update EN guide page**

In `app/(en)/guides/[slug]/page.tsx`, find lines 154–160:
```tsx
              <PageLeadCapture
                headline="Want this guide emailed to you?"
                subtext="Save it for reference — especially useful in the days after an accident."
                buttonLabel="Email Me This Guide"
                toolSlug="page-guide"
                toolContext={{ guideTitle: guide.title }}
              />
```

Change to:
```tsx
              <PageLeadCapture
                headline="Want this guide emailed to you?"
                subtext="Save it for reference — especially useful in the days after an accident."
                buttonLabel="Email Me This Guide"
                toolSlug="page-guide"
                toolContext={{ guideTitle: guide.title, guideSlug: guide.slug }}
              />
```

- [ ] **Step 2: Update ES guide page**

In `app/(es)/es/guias/[slug]/page.tsx`, find lines 193–199:
```tsx
              <PageLeadCapture
                headline="¿Quieres recibir esta guía por correo?"
                subtext="Guárdala como referencia — especialmente útil en los días después de un accidente."
                buttonLabel="Envíame Esta Guía"
                toolSlug="page-guide-es"
                toolContext={{ guideTitle: guide.title }}
              />
```

Change to:
```tsx
              <PageLeadCapture
                headline="¿Quieres recibir esta guía por correo?"
                subtext="Guárdala como referencia — especialmente útil en los días después de un accidente."
                buttonLabel="Envíame Esta Guía"
                toolSlug="page-guide-es"
                toolContext={{ guideTitle: guide.title, guideSlug: guide.slug }}
              />
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add "app/(en)/guides/[slug]/page.tsx" "app/(es)/es/guias/[slug]/page.tsx"
git commit -m "feat(lead): pass guideSlug in guide page toolContext for email linking"
```

---

## Task 2: Add `Has Email?` IF node to n8n workflow

The workflow currently ends at the Slack node (`tl-slack`, position [480, 0]). The new nodes extend to the right.

**n8n workflow ID:** `3mjn5gjskMVgWefV`

The IF node checks whether a real email was captured. The Format Message code node sets `email` to `body.email || 'Not provided'` — so we check for that sentinel.

- [ ] **Step 1: Call `n8n_update_full_workflow` with the Has Email? node added**

Add node `tl-if-email` at position [720, 0]. Update connections so `tl-slack` main[0] connects to `tl-if-email`.

Full nodes array (all 4 nodes):

```json
[
  {
    "parameters": { "httpMethod": "POST", "path": "accidentpath-tool-lead", "options": {} },
    "id": "tl-webhook",
    "name": "Tool Lead Webhook",
    "type": "n8n-nodes-base.webhook",
    "typeVersion": 2.1,
    "position": [0, 0],
    "webhookId": "accidentpath-tool-lead"
  },
  {
    "parameters": {
      "jsCode": "const body = $input.first().json.body;\n\nconst toolLabels = {\n  'statute-countdown': 'Statute Countdown',\n  'state-next-steps': 'State Next Steps',\n  'evidence-checklist': 'Evidence Checklist',\n  'lost-wages-estimator': 'Lost Wages Estimator',\n  'record-request': 'Record Request',\n  'insurance-call-prep': 'Insurance Call Prep',\n  'injury-journal': 'Injury Journal',\n  'urgency-checker': 'Urgency Checker',\n  'accident-case-quiz': 'Accident Case Quiz',\n  'page-home': 'Home Page',\n  'page-accident': 'Accident Page',\n  'page-injury': 'Injury Page',\n  'page-state': 'State Page',\n  'page-guide': 'Guide Page',\n  'page-home-es': 'Home Page (ES)',\n  'page-accident-es': 'Accident Page (ES)',\n  'page-injury-es': 'Injury Page (ES)',\n  'page-state-es': 'State Page (ES)',\n  'page-guide-es': 'Guide Page (ES)',\n};\n\nconst toolLabel = toolLabels[body.toolSlug] || body.toolSlug;\nconst ctx = body.toolContext || {};\n\nconst contextLine = Object.entries(ctx)\n  .filter(([, v]) => v)\n  .map(([k, v]) => `*${k.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase())}:* ${v}`)\n  .join(' | ');\n\nreturn [{\n  json: {\n    toolLabel,\n    email: body.email || 'Not provided',\n    phone: body.phone || 'Not provided',\n    city: body.city ? `\\n*City:* ${body.city}` : '',\n    contextLine,\n  }\n}];"
    },
    "id": "tl-code",
    "name": "Format Message",
    "type": "n8n-nodes-base.code",
    "typeVersion": 2,
    "position": [240, 0]
  },
  {
    "parameters": {
      "operation": "post",
      "select": "channel",
      "channelId": { "__rl": true, "value": "C0ATA1QUBRD", "mode": "id" },
      "text": "=<!here>\n📋 *Tool Lead — {{ $json.toolLabel }}*\n*Email:* {{ $json.email }} | *Phone:* {{ $json.phone }}{{ $json.city }}\n{{ $json.contextLine }}\n*Submitted:* {{ new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles', dateStyle: 'short', timeStyle: 'short'}) }} PT",
      "otherOptions": {}
    },
    "id": "tl-slack",
    "name": "Notify Tool Lead",
    "type": "n8n-nodes-base.slack",
    "typeVersion": 2.3,
    "position": [480, 0],
    "webhookId": "6efdd98d-7144-450a-9aff-9a4348ab3e1c",
    "credentials": { "slackApi": { "id": "OtHOQtNyZ413Arrz", "name": "Bot Slack account" } }
  },
  {
    "parameters": {
      "conditions": {
        "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
        "conditions": [
          {
            "id": "has-email-condition",
            "leftValue": "={{ $json.email }}",
            "rightValue": "Not provided",
            "operator": { "type": "string", "operation": "notEquals" }
          }
        ],
        "combinator": "and"
      }
    },
    "id": "tl-if-email",
    "name": "Has Email?",
    "type": "n8n-nodes-base.if",
    "typeVersion": 2.2,
    "position": [720, 0]
  }
]
```

Full connections:
```json
{
  "Tool Lead Webhook": { "main": [[{ "node": "Format Message", "type": "main", "index": 0 }]] },
  "Format Message": { "main": [[{ "node": "Notify Tool Lead", "type": "main", "index": 0 }]] },
  "Notify Tool Lead": { "main": [[{ "node": "Has Email?", "type": "main", "index": 0 }]] },
  "Has Email?": { "main": [[{ "node": "Prepare Email", "type": "main", "index": 0 }], []] }
}
```

Note: `Has Email?` main[0] (true branch) goes to `Prepare Email` — but that node doesn't exist yet. Add it as an empty placeholder name so the connection resolves after Task 3. The connections can be set now even before the target node exists in the array — n8n will accept and resolve it when the node is added.

Actually — add all remaining nodes in this step to avoid partial state. See Task 3 below for the Prepare Email and Send Email node definitions. Combine Tasks 2, 3, and 4 into a single `n8n_update_full_workflow` call with all 6 nodes and all connections.

---

## Task 3: Add `Prepare Email` code node

This node reads the original webhook body and generates `{ to, subject, html }` for supported slugs, or returns `[]` to stop execution for unsupported ones.

The node accesses the webhook body via `$('Tool Lead Webhook').first().json.body` since downstream nodes can reference any upstream node by name.

**Node definition:**

```json
{
  "parameters": {
    "jsCode": "<<see Step 1 below>>"
  },
  "id": "tl-prepare-email",
  "name": "Prepare Email",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [960, -120]
}
```

- [ ] **Step 1: Full jsCode for Prepare Email node**

```javascript
const body = $('Tool Lead Webhook').first().json.body;
const email = $('Format Message').first().json.email;
const toolSlug = body.toolSlug;
const ctx = body.toolContext || {};
const baseUrl = 'https://accidentpath.com';

function wrapEmail(content) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body { margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  .container { max-width:580px; margin:32px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
  .header { background:#1e3a5f; padding:28px 32px; }
  .header p { color:#ffffff; font-size:18px; font-weight:700; margin:0; }
  .body { padding:32px; }
  .footer { padding:20px 32px; border-top:1px solid #e5e7eb; background:#f9fafb; }
  .footer p { color:#6b7280; font-size:12px; margin:0; line-height:1.6; }
  .btn { display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px; margin:16px 0; }
  .deadline-box { background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:20px 24px; margin:20px 0; }
  .deadline-label { color:#6b7280; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 4px; }
  .deadline-date { color:#0a0a0a; font-size:22px; font-weight:700; margin:0 0 8px; }
  .deadline-note { color:#6b7280; font-size:12px; margin:0; }
  .warning-box { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:14px 18px; margin:16px 0; }
  .warning-box p { color:#92400e; font-size:13px; margin:0; line-height:1.5; }
  h2 { color:#0a0a0a; font-size:20px; font-weight:700; margin:0 0 8px; }
  p { color:#374151; font-size:15px; line-height:1.6; margin:0 0 12px; }
  .small { color:#6b7280; font-size:13px; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><p>AccidentPath</p></div>
  <div class="body">${content}</div>
  <div class="footer"><p>This email was sent because you submitted your email on AccidentPath.com. This information is for educational purposes only and does not constitute legal advice. Consult a licensed attorney for advice specific to your situation.</p></div>
</div>
</body>
</html>`;
}

const stateNames = { CA: 'California', AZ: 'Arizona' };
let subject, html;

if (toolSlug === 'page-state') {
  const stateName = stateNames[ctx.state] || ctx.state || 'your state';
  const stateSlug = (ctx.state || '').toLowerCase();
  const solYears = 2;
  subject = `Your personal injury deadline in ${stateName}: ${ctx.solDeadline}`;
  html = wrapEmail(`
    <h2>Your ${stateName} Filing Deadline</h2>
    <p>Based on the accident date you entered, here is your estimated personal injury filing deadline:</p>
    <div class="deadline-box">
      <p class="deadline-label">Estimated Deadline</p>
      <p class="deadline-date">${ctx.solDeadline}</p>
      <p class="deadline-note">General ${solYears}-year limit for personal injury in ${stateName}</p>
    </div>
    <div class="warning-box">
      <p><strong>Important:</strong> This is an estimate only. Some cases have shorter deadlines — government claims, minors, and certain injury types may differ. Verify with a licensed attorney.</p>
    </div>
    <p>Learn more about ${stateName} personal injury law:</p>
    <a href="${baseUrl}/states/${stateSlug}" class="btn">View ${stateName} Guide →</a>
  `);
} else if (toolSlug === 'page-state-es') {
  const stateName = stateNames[ctx.state] || ctx.state || 'su estado';
  const stateSlug = (ctx.state || '').toLowerCase();
  subject = `Tu plazo de lesiones personales en ${stateName}: ${ctx.solDeadline}`;
  html = wrapEmail(`
    <h2>Tu Plazo en ${stateName}</h2>
    <p>Según la fecha de accidente que ingresaste, este es tu plazo estimado para presentar una reclamación:</p>
    <div class="deadline-box">
      <p class="deadline-label">Plazo Estimado</p>
      <p class="deadline-date">${ctx.solDeadline}</p>
      <p class="deadline-note">Límite general de 2 años para lesiones personales en ${stateName}</p>
    </div>
    <div class="warning-box">
      <p><strong>Importante:</strong> Este es solo un estimado. Algunos casos tienen plazos más cortos — reclamos contra entidades gubernamentales, menores y ciertos tipos de lesiones pueden diferir. Verifica con un abogado autorizado.</p>
    </div>
    <p>Aprende más sobre la ley de lesiones personales en ${stateName}:</p>
    <a href="${baseUrl}/es/estados/${stateSlug}" class="btn">Ver Guía de ${stateName} →</a>
  `);
} else if (toolSlug === 'page-guide') {
  subject = `Your guide: ${ctx.guideTitle}`;
  html = wrapEmail(`
    <h2>${ctx.guideTitle}</h2>
    <p>Here's the AccidentPath guide you requested. Bookmark it — it's especially useful in the days and weeks after an accident.</p>
    <a href="${baseUrl}/guides/${ctx.guideSlug}" class="btn">Read the Guide →</a>
    <p class="small" style="margin-top:20px;">Need personalized guidance? Answer a few questions and get a free next-steps checklist.</p>
    <a href="${baseUrl}/find-help" style="color:#2563eb;font-size:13px;">Get Free Guidance →</a>
  `);
} else if (toolSlug === 'page-guide-es') {
  subject = `Tu guía: ${ctx.guideTitle}`;
  html = wrapEmail(`
    <h2>${ctx.guideTitle}</h2>
    <p>Aquí está la guía de AccidentPath que solicitaste. Guárdala — es especialmente útil en los días y semanas después de un accidente.</p>
    <a href="${baseUrl}/es/guias/${ctx.guideSlug}" class="btn">Leer la Guía →</a>
    <p class="small" style="margin-top:20px;">¿Necesitas orientación personalizada? Responde unas preguntas y recibe una lista gratuita de próximos pasos.</p>
    <a href="${baseUrl}/es/buscar-ayuda" style="color:#2563eb;font-size:13px;">Obtener Orientación Gratuita →</a>
  `);
} else {
  return [];
}

return [{ json: { to: email, subject, html } }];
```

---

## Task 4: Add `Send Email` node (disabled)

The Send Email node is type `n8n-nodes-base.emailSend`. It is set `disabled: true` — n8n will skip it during execution but keep it in the workflow ready to enable.

**Node definition:**

```json
{
  "parameters": {
    "fromEmail": "placeholder@accidentpath.com",
    "toEmail": "={{ $json.to }}",
    "subject": "={{ $json.subject }}",
    "emailType": "html",
    "html": "={{ $json.html }}",
    "options": {}
  },
  "id": "tl-send-email",
  "name": "Send Email",
  "type": "n8n-nodes-base.emailSend",
  "typeVersion": 2.1,
  "position": [1200, -120],
  "disabled": true
}
```

No SMTP credential set — the node is disabled so n8n won't try to connect. When SMTP is ready: add the credential, update `fromEmail` to the real address, and set `disabled: false`.

---

## Combined Execution: Tasks 2 + 3 + 4 in one `n8n_update_full_workflow` call

All three node additions must be submitted together to avoid partial workflow state. Call `n8n_update_full_workflow` with all 6 nodes and the complete connections object:

**All 6 nodes:**
1. `tl-webhook` — Tool Lead Webhook (unchanged)
2. `tl-code` — Format Message (unchanged)
3. `tl-slack` — Notify Tool Lead (unchanged)
4. `tl-if-email` — Has Email? (new, IF node)
5. `tl-prepare-email` — Prepare Email (new, code node)
6. `tl-send-email` — Send Email (new, emailSend node, disabled)

**Complete connections:**
```json
{
  "Tool Lead Webhook": { "main": [[{ "node": "Format Message", "type": "main", "index": 0 }]] },
  "Format Message": { "main": [[{ "node": "Notify Tool Lead", "type": "main", "index": 0 }]] },
  "Notify Tool Lead": { "main": [[{ "node": "Has Email?", "type": "main", "index": 0 }]] },
  "Has Email?": {
    "main": [
      [{ "node": "Prepare Email", "type": "main", "index": 0 }],
      []
    ]
  },
  "Prepare Email": { "main": [[{ "node": "Send Email", "type": "main", "index": 0 }]] }
}
```

- [ ] **Step 1: Call `n8n_update_full_workflow` with all 6 nodes and connections above**

Expected: `{ "success": true, ... }`

- [ ] **Step 2: Verify with `n8n_get_workflow` in structure mode**

Call `n8n_get_workflow` with `id: "3mjn5gjskMVgWefV"` and `mode: "structure"`.

Verify:
- 6 nodes present
- `Has Email?` is IF type, connected after Slack
- `Prepare Email` is code type, connected on true branch of Has Email?
- `Send Email` is emailSend type, `disabled: true`

- [ ] **Step 3: Commit the guide page changes (Task 1 commit)**

Already done in Task 1 Step 4.

---

## How to test (manually, after SMTP is wired)

1. Visit `/guides/what-to-do-after-car-accident`
2. Submit an email in the capture block
3. Check Slack `#ap-lrs` — notification fires as normal ✅
4. Enable the Send Email node + add SMTP credential
5. Submit another test email
6. Check inbox — should receive branded guide email with link to the guide

For state pages:
1. Visit `/states/ca`
2. Pick an accident date, submit email
3. Email should arrive with the SOL deadline prominently displayed

---

## Self-Review Notes

- `guideSlug` is always available as `guide.slug` in both EN and ES guide page server components — safe to pass
- `Prepare Email` returns `[]` for unsupported slugs — execution stops cleanly, no error
- `Has Email?` IF node true branch (index 0) → Prepare Email, false branch (index 1) → empty (stop)
- `Send Email` node is `disabled: true` — n8n skips it, so no SMTP credential needed now
- The `$('Tool Lead Webhook').first().json.body` reference in Prepare Email is valid because n8n allows any upstream node to be referenced by name in code nodes
- State name lookup covers CA and AZ only — `stateNames[ctx.state] || ctx.state` falls back gracefully for future states
- `solYears` is hardcoded to 2 for now since both CA and AZ have 24-month SOL — update when more states are added
