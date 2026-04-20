import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle, ArrowRight, Scale, Shield, ExternalLink } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { AccidentType } from '@/types/accident'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { ChecklistBlock } from '@/components/content/ChecklistBlock'
import { TimelineBlock } from '@/components/content/TimelineBlock'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { articleSchema } from '@/lib/seo'

export async function generateStaticParams() {
  return cms.getAllAccidents().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const accident = cms.getAccident(slug)
    return buildMetaTags({
      title: accident.metaTitle,
      description: accident.metaDescription,
      canonical: `/accidents/${slug}`,
    })
  } catch {
    return {}
  }
}

const urgencyConfig = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    label: 'Critical',
  },
  important: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    label: 'Important',
  },
  helpful: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    badge: 'bg-primary-100 text-primary-700',
    dot: 'bg-primary-500',
    label: 'Helpful',
  },
}

const severityColors = {
  mild: 'bg-green-50 border-green-200 text-green-800',
  moderate: 'bg-amber-50 border-amber-200 text-amber-800',
  severe: 'bg-orange-50 border-orange-200 text-orange-800',
  catastrophic: 'bg-red-50 border-red-200 text-red-800',
}

export default async function AccidentHubPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let accident: AccidentType
  try {
    accident = cms.getAccident(slug)
  } catch {
    notFound()
  }

  const totalEvidenceItems = accident.evidenceChecklist.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  )

  return (
    <>
      <SchemaOrg
        schema={articleSchema({
          title: accident.title,
          description: accident.description,
          slug: `/accidents/${accident.slug}`,
        })}
        id="article-schema"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Accident Types', href: '/accidents' },
              { label: accident.title },
            ]}
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {accident.title}
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                {accident.description}
              </p>
              <div className="mt-6 flex flex-row flex-wrap gap-3">
                <CTAButton href="/find-help" size="md" className="whitespace-nowrap">
                  Get Free Guidance
                </CTAButton>
                <CTAButton
                  href="#evidence-checklist"
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap !border-white/30 !text-white hover:!bg-white/10"
                >
                  View Evidence Checklist
                </CTAButton>
              </div>
              <p className="mt-4 text-primary-400 text-xs leading-relaxed">
                This information is for educational purposes only and does not constitute legal
                advice. Availability varies by state and case type.
              </p>
            </div>

            {/* Quick-stats card */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">
                  {accident.immediateSteps.length}
                </p>
                <p className="text-primary-300 text-xs mt-1">Immediate steps</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{totalEvidenceItems}</p>
                <p className="text-primary-300 text-xs mt-1">Evidence items</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Common injuries</p>
                <p className="text-white text-sm font-medium">
                  {accident.likelyInjuries
                    .slice(0, 3)
                    .map(i => i.title)
                    .join(', ')}
                  {accident.likelyInjuries.length > 3
                    ? ` +${accident.likelyInjuries.length - 3} more`
                    : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ─────────────────────────────────────────────────────── */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* ── Main column ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-14">

              {/* Common Causes */}
              <section aria-labelledby="causes-heading">
                <h2
                  id="causes-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-6"
                >
                  Common Causes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accident.commonCauses.map(cause => (
                    <div
                      key={cause.title}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                        {cause.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {cause.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Likely Injuries */}
              <section aria-labelledby="injuries-heading">
                <h2
                  id="injuries-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-3"
                >
                  Likely Injuries
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  These types of accidents are frequently associated with the following injuries.
                  Select an injury to learn more.
                </p>
                <div className="flex flex-wrap gap-3">
                  {accident.likelyInjuries.map(injury => (
                    <Link
                      key={injury.slug}
                      href={`/injuries/${injury.slug}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-opacity hover:opacity-75 ${severityColors[injury.severity]}`}
                    >
                      {injury.title}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Immediate Steps */}
              <section aria-labelledby="steps-heading">
                <h2
                  id="steps-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-6"
                >
                  What To Do Immediately
                </h2>
                <ol className="flex flex-col gap-4">
                  {accident.immediateSteps.map(step => {
                    const config = urgencyConfig[step.urgency]
                    return (
                      <li
                        key={step.step}
                        className={`flex gap-4 rounded-xl border p-5 ${config.bg} ${config.border}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold font-sans shrink-0 ${config.dot}`}
                        >
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                              {step.title}
                            </h3>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>

              {/* Evidence Checklist */}
              <section id="evidence-checklist" aria-labelledby="checklist-heading">
                <h2
                  id="checklist-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-2"
                >
                  Evidence Checklist
                </h2>
                <p className="text-neutral-500 text-sm mb-6">
                  Check off items as you collect them. Critical items should be gathered as soon as
                  possible after the accident.
                </p>
                <ChecklistBlock items={accident.evidenceChecklist} />
              </section>

              {/* Timeline Risks */}
              <section aria-labelledby="timeline-heading">
                <h2
                  id="timeline-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-2"
                >
                  Timeline Risks
                </h2>
                <p className="text-neutral-500 text-sm mb-6">
                  Key deadlines and time-sensitive actions. Missing these windows can significantly
                  affect your options.
                </p>
                <TimelineBlock items={accident.timelineRisks} />
              </section>

              {/* Insurance Issues */}
              <section aria-labelledby="insurance-heading">
                <h2
                  id="insurance-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-6"
                >
                  Insurance Issues to Know About
                </h2>
                <div className="flex flex-col gap-4">
                  {accident.insuranceIssues.map(item => (
                    <div
                      key={item.issue}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                            {item.issue}
                          </h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* When You Need a Lawyer */}
              <section aria-labelledby="lawyer-heading">
                <h2
                  id="lawyer-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-3"
                >
                  When You May Benefit From Speaking With a Lawyer
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  You are not required to hire an attorney. But in some situations, speaking with a
                  lawyer experienced in personal injury matters can help protect your options. This
                  is educational information, not legal advice.
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {accident.whenToGetLawyer.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-5 h-5 text-primary-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton href="/find-help" size="md">
                  Get Free Guidance
                </CTAButton>
              </section>

              {/* State-Specific Notes */}
              <section aria-labelledby="state-heading">
                <h2
                  id="state-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-6"
                >
                  State-Specific Notes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      <h3 className="font-sans font-semibold text-primary-900 text-sm">
                        California
                      </h3>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-primary-800 leading-relaxed">
                      <li>
                        <strong>Statute of limitations:</strong> 2 years from date of injury for
                        personal injury claims
                      </li>
                      <li>
                        <strong>Fault rule:</strong> Pure comparative fault — you can recover even
                        if partially at fault, reduced by your percentage
                      </li>
                      <li>
                        <strong>Insurance minimum:</strong> $15,000/$30,000/$5,000
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-amber-600" aria-hidden="true" />
                      <h3 className="font-sans font-semibold text-amber-900 text-sm">Arizona</h3>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-amber-800 leading-relaxed">
                      <li>
                        <strong>Statute of limitations:</strong> 2 years from date of injury for
                        personal injury claims
                      </li>
                      <li>
                        <strong>Fault rule:</strong> Pure comparative fault — your recovery is
                        reduced by your share of fault
                      </li>
                      <li>
                        <strong>Insurance minimum:</strong> $25,000/$50,000/$15,000
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  Laws vary by state and are subject to change. The above is general educational
                  information only and may not reflect recent legislative changes. Consult a
                  licensed attorney in your state for advice specific to your situation.
                </p>
              </section>

            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  On This Page
                </h3>
                <nav aria-label="Page sections">
                  <ul className="flex flex-col gap-2">
                    {[
                      ['#causes-heading', 'Common Causes'],
                      ['#injuries-heading', 'Likely Injuries'],
                      ['#steps-heading', 'Immediate Steps'],
                      ['#evidence-checklist', 'Evidence Checklist'],
                      ['#timeline-heading', 'Timeline Risks'],
                      ['#insurance-heading', 'Insurance Issues'],
                      ['#lawyer-heading', 'When to See a Lawyer'],
                      ['#state-heading', 'State-Specific Notes'],
                    ].map(([href, label]) => (
                      <li key={href}>
                        <a
                          href={href}
                          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors py-0.5"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* CTA card */}
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                <Shield className="w-8 h-8 text-primary-500 mb-3" aria-hidden="true" />
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-2">
                  Get Personalized Guidance
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Answer a few questions about your situation and receive a personalized next-steps
                  checklist. Free, no obligation.
                </p>
                <CTAButton href="/find-help" size="sm" fullWidth>
                  Start Free Check
                </CTAButton>
              </div>

              {/* Related accident types */}
              {accident.relatedAccidents.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Accident Types
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {accident.relatedAccidents.map(relSlug => (
                      <li key={relSlug}>
                        <Link
                          href={`/accidents/${relSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {relSlug
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="default" />
    </>
  )
}
