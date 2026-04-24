import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Scale,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import { cms } from '@/lib/cms'
import type { StateData } from '@/types/state'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'

export async function generateStaticParams() {
  return cms.getAllStates().map(s => ({ state: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params
  try {
    const stateData = cms.getState(state)
    return buildMetaTags({
      title: stateData.metaTitle,
      description: stateData.metaDescription,
      canonical: `/states/${state}`,
    })
  } catch {
    return {}
  }
}

export default async function StateDetailPage({
  params,
}: {
  params: Promise<{ state: string }>
}) {
  const { state } = await params

  let stateData: StateData
  try {
    stateData = cms.getState(state)
  } catch {
    notFound()
  }

  const cities = cms.getCitiesByState(state)

  const faultRuleLabel = {
    pure_comparative: 'Pure Comparative Fault',
    modified_comparative: 'Modified Comparative Fault',
    contributory: 'Contributory Negligence',
    no_fault: 'No-Fault',
  }[stateData.faultRule.type]

  return (
    <>
      <SchemaOrg
        schema={[articleSchema({
          title: `${stateData.name} Personal Injury Law Guide`,
          description: stateData.metaDescription,
          slug: `/states/${stateData.slug}`,
          reviewedBy: stateData.reviewedBy,
          dateModified: stateData.reviewDate,
        }), breadcrumbSchema([{ label: 'State Guides', href: '/states' }, { label: stateData.name }])]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'State Guides', href: '/states' },
              { label: stateData.name },
            ]}
            variant="dark"
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 mb-4">
                <span className="font-sans font-bold text-white text-sm">{stateData.abbreviation}</span>
              </div>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {stateData.name} Personal Injury Guide
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                Key deadlines, fault rules, insurance minimums, and laws that affect personal injury
                claims in {stateData.name}.
              </p>
              <div className="mt-4 flex items-center gap-4 text-primary-400 text-xs">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" aria-hidden="true" />
                  {stateData.reviewedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {stateData.reviewDate}
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-lg font-bold text-white font-sans">
                  {stateData.statuteOfLimitations.personalInjury.split(' ')[0]}{' '}
                  {stateData.statuteOfLimitations.personalInjury.split(' ')[1]}
                </p>
                <p className="text-primary-300 text-xs mt-1">Injury SOL</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-bold text-white font-sans leading-tight">{faultRuleLabel}</p>
                <p className="text-primary-300 text-xs mt-1">Fault system</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Min. bodily injury coverage</p>
                <p className="text-white text-sm font-medium">
                  {stateData.insuranceMinimums.bodilyInjuryPerPerson} /{' '}
                  {stateData.insuranceMinimums.bodilyInjuryPerAccident}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-14">

              {/* Statute of limitations */}
              <section aria-labelledby="sol-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="sol-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Statute of Limitations
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  These are the time limits to file a lawsuit. Missing these deadlines generally
                  means losing your right to recover compensation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">
                      Personal Injury
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.personalInjury}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                      Property Damage
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.propertyDamage}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                      Wrongful Death
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.wrongfulDeath}
                    </p>
                  </div>
                </div>
              </section>

              {/* Fault rule */}
              <section aria-labelledby="fault-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Scale className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="fault-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Fault Rule: {faultRuleLabel}
                  </h2>
                </div>
                <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                  <p className="text-sm text-primary-900 leading-relaxed">
                    {stateData.faultRule.description}
                  </p>
                </div>
              </section>

              {/* Reporting deadlines */}
              <section aria-labelledby="reporting-heading">
                <h2
                  id="reporting-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-6"
                >
                  Reporting Deadlines
                </h2>
                <div className="flex flex-col gap-4">
                  {stateData.reportingDeadlines.map(item => (
                    <div
                      key={item.type}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                          {item.type}
                        </h3>
                        <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          {item.deadline}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Insurance minimums */}
              <section aria-labelledby="insurance-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="insurance-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Insurance Minimums
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  These are the minimum auto insurance coverage amounts required in {stateData.name}.
                  Many drivers carry only these minimums, which may be insufficient for serious injuries.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Bodily Injury (per person)</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.bodilyInjuryPerPerson}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Bodily Injury (per accident)</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.bodilyInjuryPerAccident}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Property Damage</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.propertyDamage}
                    </p>
                  </div>
                  {stateData.insuranceMinimums.uninsuredMotorist && (
                    <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm col-span-2 sm:col-span-1">
                      <p className="text-xs text-neutral-400 mb-1">Uninsured Motorist</p>
                      <p className="font-sans font-semibold text-neutral-700 text-sm">
                        {stateData.insuranceMinimums.uninsuredMotorist}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Key laws */}
              <section aria-labelledby="laws-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2
                    id="laws-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Key Laws to Know
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {stateData.keyLaws.map(law => (
                    <div
                      key={law.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-2">
                        {law.name}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{law.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cities */}
              {cities.length > 0 && (
                <section aria-labelledby="cities-heading">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary-500" aria-hidden="true" />
                    <h2
                      id="cities-heading"
                      className="font-sans font-bold text-2xl text-neutral-950"
                    >
                      {stateData.name} Cities
                    </h2>
                  </div>
                  <p className="text-neutral-500 text-sm mb-5">
                    Local resources, hospitals, courts, and accident corridor information for major
                    cities in {stateData.name}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cities.map(city => (
                      <Link
                        key={city.slug}
                        href={`/states/${stateData.slug}/${city.slug}`}
                        className="group rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-sans font-semibold text-neutral-950 text-sm group-hover:text-primary-700 transition-colors">
                              {city.name}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Pop. {city.population}
                            </p>
                          </div>
                          <ArrowRight
                            className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                          {city.commonAccidentTypes[0]}, {city.commonAccidentTypes[1]}
                          {city.commonAccidentTypes.length > 2 ? ` + ${city.commonAccidentTypes.length - 2} more` : ''}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-xs text-neutral-400 leading-relaxed">
                The above is general educational information about {stateData.name} law and may not
                reflect recent legislative changes. Reviewed by: {stateData.reviewedBy} on{' '}
                {stateData.reviewDate}. Consult a licensed attorney in {stateData.name} for advice
                specific to your situation.
              </p>

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
                      ['#sol-heading', 'Statute of Limitations'],
                      ['#fault-heading', 'Fault Rule'],
                      ['#reporting-heading', 'Reporting Deadlines'],
                      ['#insurance-heading', 'Insurance Minimums'],
                      ['#laws-heading', 'Key Laws'],
                      ...(cities.length > 0 ? [['#cities-heading', 'Cities']] : []),
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

              {/* Reviewer badge */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                  Reviewed By
                </p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                  <p className="text-sm text-neutral-700">{stateData.reviewedBy}</p>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{stateData.reviewDate}</p>
              </div>

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="state" />
    </>
  )
}
