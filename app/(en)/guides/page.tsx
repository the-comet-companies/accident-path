import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata = buildMetaTags({
  title: 'Accident & Injury Guides — California & Arizona',
  description:
    'Plain-language guides covering evidence collection, insurance claims, hiring a lawyer, and more for accident victims in California and Arizona.',
  canonical: '/guides',
})

const CORNERSTONE = new Set(['am-i-at-fault', 'settlement-vs-lawsuit'])

export default function GuidesPage() {
  const guides = cms.getAllGuides()

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'Guides', href: '/guides' }])} id="breadcrumb-schema" />
      <div className="bg-surface-page min-h-screen">
        {/* Page header */}
        <div className="bg-primary-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Guides' }]} variant="dark" />
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Educational Guides
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
              Accident & Injury Guides
            </h1>
            <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
              Plain-language guides to help you understand your options after an accident — evidence,
              insurance, legal decisions, and what to do first.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
              <span aria-hidden="true">✓</span> Attorney-reviewed content
            </div>
            <p className="mt-2 text-primary-400 text-xs">
              This information is for educational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
                  <div className="flex flex-col flex-1 p-4">
                    {CORNERSTONE.has(guide.slug) && (
                      <span className="inline-block self-start text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2.5 py-0.5 mb-3">
                        ★ Cornerstone Guide
                      </span>
                    )}
                    <h2 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-1.5">
                      {guide.title}
                    </h2>
                    <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                      {guide.description.length > 110
                        ? guide.description.slice(0, 110) + '…'
                        : guide.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                      <span className="text-[10px] text-neutral-400">
                        {guide.sections.length} sections &middot; ~{guide.sections.length * 3} min read
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                        Read guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-16 text-sm">
              Guides are being prepared. Check back soon.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
