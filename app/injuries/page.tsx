import Link from 'next/link'
import { Activity, ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { CTAButton } from '@/components/ui/CTAButton'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata = buildMetaTags({
  title: 'Accident Injury Types — Symptoms, Treatment & Legal Rights',
  description:
    'Learn about common accident injuries — from whiplash and broken bones to traumatic brain injury and spinal damage. California and Arizona guidance.',
  canonical: '/injuries',
})


export default function InjuriesPage() {
  const injuries = cms.getAllInjuries()

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'Injury Types', href: '/injuries' }])} id="breadcrumb-schema" />
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary-400 text-sm font-medium mb-2">Injury Library</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Accident Injury Types
          </h1>
          <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif max-w-2xl">
            Understand the injuries commonly associated with accidents — symptoms, treatment options,
            and what they mean for your recovery and legal options.
          </p>
        </div>
      </div>

      {/* Injury grid */}
      <div className="bg-surface-page py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {injuries.length === 0 ? (
            <p className="text-neutral-500 text-sm">Injury guides coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {injuries.map(injury => (
                <Link
                  key={injury.slug}
                  href={`/injuries/${injury.slug}`}
                  className="group rounded-2xl border border-neutral-100 bg-surface-card p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <Activity className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <h2 className="font-sans font-semibold text-neutral-950 text-base mb-2 group-hover:text-primary-700 transition-colors">
                    {injury.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-3">
                    {injury.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary-600 text-xs font-medium">
                    Learn more <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA section */}
          <div className="mt-14 rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
              Concerned about your injuries?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Answer a few questions about your accident and injuries. We will help you understand
              your next steps — for free, with no obligation.
            </p>
            <CTAButton href="/find-help" size="md">
              Get Free Guidance
            </CTAButton>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="default" />
    </>
  )
}
