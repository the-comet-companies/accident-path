import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { CTAButton } from '@/components/ui/CTAButton'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata = buildMetaTags({
  title: 'State Injury Law Guides — California & Arizona',
  description:
    'Understand personal injury laws, statutes of limitations, fault rules, and insurance requirements in California and Arizona.',
  canonical: '/states',
})

export default function StatesPage() {
  const states = cms.getAllStates()

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'State Guides', href: '/states' }])} id="breadcrumb-schema" />
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary-400 text-sm font-medium mb-2">State Guides</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            State Injury Law Guides
          </h1>
          <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif max-w-2xl">
            Personal injury laws vary by state. We serve California and Arizona — learn the specific
            deadlines, fault rules, and insurance minimums that apply to your claim.
          </p>
        </div>
      </div>

      {/* State cards */}
      <div className="bg-surface-page py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {states.length === 0 ? (
            <p className="text-neutral-500 text-sm">State guides coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {states.map(state => {
                const cities = cms.getCitiesByState(state.slug)
                return (
                  <div
                    key={state.slug}
                    className="rounded-2xl border border-neutral-100 bg-surface-card p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="font-sans font-bold text-primary-700 text-sm">
                          {state.abbreviation}
                        </span>
                      </div>
                      <Link
                        href={`/states/${state.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        View guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                    <h2 className="font-sans font-bold text-xl text-neutral-950 mb-1">
                      {state.name}
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                      SOL: {state.statuteOfLimitations.personalInjury} &middot; Fault:{' '}
                      {state.faultRule.type.replace(/_/g, ' ')}
                    </p>
                    {cities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                          Cities
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {cities.slice(0, 8).map(city => (
                            <li key={city.slug}>
                              <Link
                                href={`/states/${state.slug}/${city.slug}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                              >
                                <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
                                {city.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {cities.length > 8 && (
                          <Link
                            href={`/states/${state.slug}`}
                            className="inline-flex items-center gap-1 mt-3 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                          >
                            View all {cities.length} cities <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
              Not sure which deadlines apply to your case?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Answer a few questions about your accident and we will help you understand your options
              and next steps.
            </p>
            <CTAButton href="/find-help" size="md">
              Get Free Guidance
            </CTAButton>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="state" />
    </>
  )
}
