import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Shield, AlertTriangle, Stethoscope, Clock } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { InjuryType } from '@/types/injury'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import { getInjuryRelated } from '@/lib/related'

export async function generateStaticParams() {
  return cms.getAllInjuries().map(i => ({ slug: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const injury = cms.getInjury(slug)
    return buildMetaTags({
      title: injury.metaTitle,
      description: injury.metaDescription,
      canonical: `/injuries/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function InjuryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let injury: InjuryType
  try {
    injury = cms.getInjury(slug)
  } catch {
    notFound()
  }

  const related = getInjuryRelated(slug)

  return (
    <>
      <SchemaOrg
        schema={[articleSchema({
          title: injury.title,
          description: injury.description,
          slug: `/injuries/${injury.slug}`,
        }), breadcrumbSchema([{ label: 'Injury Types', href: '/injuries' }, { label: injury.title }])]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Injuries', href: '/injuries' },
              { label: injury.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {injury.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {injury.description}
            </p>
            <div className="mt-6 flex flex-row flex-wrap gap-3">
              <CTAButton href="/find-help" size="md" className="whitespace-nowrap">
                Get Free Guidance
              </CTAButton>
            </div>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">
              This information is for educational purposes only and does not constitute legal or
              medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-14">

              {/* Symptoms */}
              <section aria-labelledby="symptoms-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2
                    id="symptoms-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Symptoms to Watch For
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Some symptoms appear immediately; others develop hours or days after the accident.
                  Seek medical evaluation promptly even if you feel okay.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {injury.symptoms.map(symptom => (
                    <li
                      key={symptom}
                      className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4"
                    >
                      <AlertTriangle
                        className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-amber-900 leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Long-term effects */}
              <section aria-labelledby="effects-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-red-500" aria-hidden="true" />
                  <h2
                    id="effects-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Potential Long-Term Effects
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Serious injuries can have lasting effects on your health, work, and daily life.
                  Understanding these possibilities matters for your recovery and legal options.
                </p>
                <ul className="flex flex-col gap-3">
                  {injury.longTermEffects.map(effect => (
                    <li key={effect} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{effect}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Treatment options */}
              <section aria-labelledby="treatment-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Stethoscope className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="treatment-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Common Treatment Options
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Treatment options vary based on severity. Follow your healthcare provider's
                  recommendations and document all treatment — it is important evidence for your
                  claim.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {injury.treatmentOptions.map(treatment => (
                    <div
                      key={treatment}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle
                          className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-neutral-700 leading-relaxed">{treatment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Common causes */}
              <section aria-labelledby="causes-heading">
                <h2
                  id="causes-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-3"
                >
                  Common Accident Causes
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  These accident types are frequently associated with this injury. Select an accident
                  type to learn what steps to take.
                </p>
                <div className="flex flex-wrap gap-3">
                  {injury.commonCauses.map(cause => (
                    <span
                      key={cause}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700"
                    >
                      {cause}
                    </span>
                  ))}
                </div>
                {injury.relatedAccidents.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {injury.relatedAccidents.map(accSlug => (
                      <Link
                        key={accSlug}
                        href={`/accidents/${accSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-200 bg-primary-50 text-sm text-primary-700 hover:bg-primary-100 transition-colors"
                      >
                        {accSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Guide
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <CTAButton href="/find-help" size="md">
                Get Free Guidance
              </CTAButton>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  On This Page
                </h3>
                <nav aria-label="Page sections">
                  <ul className="flex flex-col gap-2">
                    {[
                      ['#symptoms-heading', 'Symptoms'],
                      ['#effects-heading', 'Long-Term Effects'],
                      ['#treatment-heading', 'Treatment Options'],
                      ['#causes-heading', 'Common Causes'],
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

              {/* Related accidents */}
              {related.accidents.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Accident Types
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {related.accidents.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related tools */}
              {related.tools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Free Tools
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {related.tools.map(link => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {link.label}
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
