import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { CTAButton } from '@/components/ui/CTAButton'

export const metadata = buildMetaTags({
  title: 'Accident & Injury Guides — California & Arizona',
  description:
    'Plain-language guides covering evidence collection, insurance claims, hiring a lawyer, and more for accident victims in California and Arizona.',
  canonical: '/guides',
})

export default function GuidesPage() {
  const guides = cms.getAllGuides()

  return (
    <>
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary-400 text-sm font-medium mb-2">Resources</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Accident & Injury Guides
          </h1>
          <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif max-w-2xl">
            Plain-language guides to help you understand your options after an accident. Written for
            California and Arizona residents — not lawyers.
          </p>
        </div>
      </div>

      {/* Guide grid */}
      <div className="bg-surface-page py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {guides.length === 0 ? (
            <p className="text-neutral-500 text-sm">Guides coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-2xl border border-neutral-100 bg-surface-card p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <h2 className="font-sans font-semibold text-neutral-950 text-base mb-2 group-hover:text-primary-700 transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-primary-600 text-xs font-medium">
                    Read guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA section */}
          <div className="mt-14 rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
              Have questions about your specific situation?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Answer a few questions and receive a personalized next-steps checklist. Free, no
              obligation.
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
