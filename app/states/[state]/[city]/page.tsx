import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  MapPin,
  Phone,
  Building2,
  Hospital,
  AlertTriangle,
  Navigation,
  User,
  Calendar,
} from 'lucide-react'
import { cms } from '@/lib/cms'
import type { CityData } from '@/types/state'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { articleSchema } from '@/lib/seo'

export async function generateStaticParams() {
  return cms.getAllCities().map(c => ({
    state: c.stateSlug,
    city: c.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}) {
  const { state, city } = await params
  try {
    const cityData = cms.getCity(city)
    if (cityData.stateSlug !== state) return {}
    return buildMetaTags({
      title: cityData.metaTitle,
      description: cityData.metaDescription,
      canonical: `/states/${state}/${city}`,
    })
  } catch {
    return {}
  }
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>
}) {
  const { state, city } = await params

  let cityData: CityData
  try {
    cityData = cms.getCity(city)
  } catch {
    notFound()
  }

  if (cityData.stateSlug !== state) notFound()

  let stateData
  try {
    stateData = cms.getState(state)
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={articleSchema({
          title: `${cityData.name}, ${cityData.stateAbbreviation} Accident Guide`,
          description: cityData.description.slice(0, 200),
          slug: `/states/${state}/${city}`,
          reviewedBy: cityData.reviewedBy,
          dateModified: cityData.reviewDate,
        })}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'State Guides', href: '/states' },
              { label: stateData.name, href: `/states/${state}` },
              { label: cityData.name },
            ]}
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary-400" aria-hidden="true" />
                <span className="text-primary-300 text-sm">
                  {cityData.stateAbbreviation} · Pop. {cityData.population}
                </span>
              </div>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {cityData.name} Accident Guide
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                {cityData.description}
              </p>
              <div className="mt-6 flex flex-row flex-wrap gap-3">
                <CTAButton href={`/find-help?city=${cityData.slug}`} size="md" className="whitespace-nowrap">
                  Get Help in {cityData.name}
                </CTAButton>
                <CTAButton
                  href={`/states/${state}`}
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap !border-white/30 !text-white hover:!bg-white/10"
                >
                  {stateData.name} State Laws
                </CTAButton>
              </div>
              <div className="mt-4 flex items-center gap-4 text-primary-400 text-xs">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" aria-hidden="true" />
                  {cityData.reviewedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {cityData.reviewDate}
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{cityData.hospitals.length}</p>
                <p className="text-primary-300 text-xs mt-1">Local hospitals</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{cityData.courts.length}</p>
                <p className="text-primary-300 text-xs mt-1">Courts</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Common accident types</p>
                <p className="text-white text-sm font-medium">
                  {cityData.commonAccidentTypes.slice(0, 2).join(', ')}
                  {cityData.commonAccidentTypes.length > 2
                    ? ` +${cityData.commonAccidentTypes.length - 2} more`
                    : ''}
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

              {/* Hospitals */}
              <section aria-labelledby="hospitals-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Hospital className="w-5 h-5 text-red-500" aria-hidden="true" />
                  <h2
                    id="hospitals-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Local Emergency Hospitals
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Seek emergency care immediately after a serious accident. Prompt medical evaluation
                  also creates an official record of your injuries.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cityData.hospitals.map(hospital => (
                    <div
                      key={hospital.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm leading-snug">
                          {hospital.name}
                        </h3>
                        {hospital.erAvailable && (
                          <span className="shrink-0 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            ER
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{hospital.address}</span>
                      </div>
                      {hospital.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <a
                            href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {hospital.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Courts */}
              <section aria-labelledby="courts-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="courts-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Local Courts
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Personal injury lawsuits in {cityData.name} are filed in{' '}
                  {cityData.stateAbbreviation === 'CA' ? 'Superior Court' : 'Superior Court (Maricopa or Pima County)'}.
                  Your attorney will file in the appropriate jurisdiction.
                </p>
                <div className="flex flex-col gap-4">
                  {cityData.courts.map(court => (
                    <div
                      key={court.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                          {court.name}
                        </h3>
                        <span className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
                          {court.type}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{court.address}</span>
                      </div>
                      {court.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <a
                            href={`tel:${court.phone.replace(/[^0-9+]/g, '')}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {court.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Common accident types */}
              <section aria-labelledby="accidents-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2
                    id="accidents-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Common Accident Types in {cityData.name}
                  </h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {cityData.commonAccidentTypes.map(accType => (
                    <li key={accType} className="flex items-start gap-3">
                      <AlertTriangle
                        className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{accType}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Notable corridors */}
              {cityData.notableCorridors && cityData.notableCorridors.length > 0 && (
                <section aria-labelledby="corridors-heading">
                  <div className="flex items-center gap-2 mb-6">
                    <Navigation className="w-5 h-5 text-primary-500" aria-hidden="true" />
                    <h2
                      id="corridors-heading"
                      className="font-sans font-bold text-2xl text-neutral-950"
                    >
                      Notable Accident Corridors
                    </h2>
                  </div>
                  <p className="text-neutral-500 text-sm mb-5">
                    These roads and freeways are known for high accident volume in {cityData.name}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cityData.notableCorridors.map(corridor => (
                      <div
                        key={corridor}
                        className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm"
                      >
                        <Navigation
                          className="w-4 h-4 text-primary-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-neutral-700 leading-relaxed">{corridor}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Local notes */}
              <section aria-labelledby="notes-heading">
                <h2
                  id="notes-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-4"
                >
                  Local Notes & Considerations
                </h2>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm text-amber-900 leading-relaxed">{cityData.localNotes}</p>
                </div>
              </section>

              <p className="text-xs text-neutral-400 leading-relaxed">
                Information reviewed by: {cityData.reviewedBy} on {cityData.reviewDate}. This is
                general educational information only and may not reflect recent changes. Consult a
                licensed attorney for advice specific to your situation.
              </p>

              <CTAButton href={`/find-help?city=${cityData.slug}`} size="md">
                Get Help in {cityData.name}
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
                      ['#hospitals-heading', 'Emergency Hospitals'],
                      ['#courts-heading', 'Local Courts'],
                      ['#accidents-heading', 'Common Accidents'],
                      ...(cityData.notableCorridors?.length
                        ? [['#corridors-heading', 'Accident Corridors']]
                        : []),
                      ['#notes-heading', 'Local Notes'],
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
                  Get Help in {cityData.name}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Answer a few questions and receive a personalized checklist for your situation in{' '}
                  {cityData.name}. Free, no obligation.
                </p>
                <CTAButton href={`/find-help?city=${cityData.slug}`} size="sm" fullWidth>
                  Start Free Check
                </CTAButton>
              </div>

              {/* State guide link */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                  {stateData.name} State Laws
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                  SOL, fault rules, and insurance minimums for {stateData.abbreviation}.
                </p>
                <Link
                  href={`/states/${state}`}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  View {stateData.name} guide
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="state" />
    </>
  )
}
