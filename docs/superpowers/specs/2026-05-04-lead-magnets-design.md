# Lead Magnets / Resources Section — Design Spec

## Goal

Build a `/resources` section with gated lead magnet pages that capture name + email + phone using urgency-driven headlines. Feeds the existing `/api/tool-lead` → Supabase → n8n → Slack pipeline.

## Architecture

**Routes**
- `/resources` — hub listing page (server component, static)
- `/resources/[slug]` — individual gated resource page (client component)

**New files**
- `content/resources/[slug].json` — one JSON file per resource
- `app/(en)/resources/page.tsx` — hub page
- `app/(en)/resources/[slug]/page.tsx` — individual resource page
- `types/content.ts` — add `ResourceSchema` + `Resource` type

**No new API routes. No schema changes.** Form submits to existing `/api/tool-lead`.

## Content Schema (`ResourceSchema`)

```ts
{
  slug: string
  metaTitle: string          // max 70 chars
  metaDescription: string    // 120–160 chars
  label: string              // badge text e.g. "Critical", "Must Read"
  headline: string           // the urgency headline
  teaser: string             // 1-2 sentences shown before gate
  teaserBullets: string[]    // 3-4 preview items shown in left panel (last one grayed)
  toolSlug: string           // e.g. "resource-before-picking-attorney"
  content: Array<{
    heading: string
    body: string
  }>                         // revealed after form submission (min 3 items)
}
```

## Individual Resource Page (`/resources/[slug]`)

**Gate state (before submit) — Split layout:**
- Dark navy hero: `label` badge (small, red/amber text) + `headline`
- Two-column panel below:
  - **Left:** `teaser` paragraph + `teaserBullets` list. Last bullet grayed out with "+ more..." to create FOMO
  - **Right:** form with Name, Email, Phone fields + TCPA consent checkbox + "Unlock Free Resource →" button

**Reveal state (after submit):**
- Right panel replaced with success message: "Check your inbox — we'll follow up shortly."
- Full `content` array renders below the split panel — numbered list, each item has bold heading + paragraph body
- CTA at bottom: "Ready to find an attorney? Get free guidance →" linking to `/find-help`

**Form submission:**
- POSTs to `/api/tool-lead` with:
  - `pattern: 'R'`
  - `toolSlug: resource.toolSlug`
  - `email`, `phone`, `consent: true`
  - `toolContext: { resourceTitle: resource.headline, resourceSlug: resource.slug, name }`
- Name is stored in `toolContext` (not a top-level field — matches existing API schema)
- On success: toggle React state to reveal content
- On error: show inline error, do not reveal content

**TCPA consent:** Uses `ConsentCheckbox` component (same as intake wizard). Required before submit. Button disabled until checked.

## Hub Page (`/resources`)

- Dark navy hero (matches guides/tools hub style): "Free Resources" label + "What Your Attorney Won't Tell You" heading + subtext
- 2-column card grid, auto-populated from all `content/resources/*.json` files
- Live cards: label badge + headline + teaser + "Unlock free →" link
- Coming Soon cards: grayed out at 45% opacity, no link
- Coming Soon = any resource JSON not yet in `generateStaticParams` (or a `status: 'coming-soon'` field — simpler: just scaffold the JSON with a `comingSoon: true` flag)

## CTAs on Existing Pages

No new components. Add a simple CTA link block in:
- `app/(en)/accidents/[slug]/page.tsx` — after the lead capture section, link to `before-picking-an-attorney`
- `app/(en)/guides/[slug]/page.tsx` — after the lead capture section, link to `5-questions-to-ask-attorney` (only on `hiring-a-lawyer` slug, or on all guides)

## n8n Workflow Update

Add `resource-before-picking-attorney` and `resource-5-things-before-deciding` to the `toolLabels` map in the `accidentpath - tool lead notification` workflow (ID: `3mjn5gjskMVgWefV`) so Slack shows a friendly label instead of the raw slug.

No email template needed for resources yet — Slack notification is sufficient at launch.

## Launch Scope (2 resources)

1. **`before-picking-an-attorney`** — "CRITICAL — Do Not Do This Before Picking an Attorney"
   - `toolSlug: "resource-before-picking-attorney"`
2. **`5-things-before-deciding-on-attorney`** — "5 Things You MUST Know Before Deciding on an Attorney"
   - `toolSlug: "resource-5-things-before-deciding"`

Other 2 resources (need-help-choosing-attorney, 5-questions-to-ask-attorney) scaffolded as `comingSoon: true` JSON files so they appear grayed out on the hub.

## Compliance

- TCPA consent checkbox required (same language as intake wizard)
- Disclaimer footer on every resource page: "This information is for educational purposes only and does not constitute legal advice."
- No promise of attorney contact — copy says "we'll follow up" not "an attorney will call you"

## Not In Scope

- Spanish versions (deferred)
- Email delivery of resource content (deferred — needs SMTP)
- Attorney matching from resource submissions (deferred)
- Resource-specific email templates in n8n (deferred)
