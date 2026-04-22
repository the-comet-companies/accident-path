import { cms } from '@/lib/cms'
import { GuidesHubClient } from '@/components/content/GuidesHubClient'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Accident & Injury Guides — California & Arizona',
  description:
    'Plain-language guides covering evidence collection, insurance claims, hiring a lawyer, and more for accident victims in California and Arizona.',
  canonical: '/guides',
})

export default function GuidesPage() {
  const guides = cms.getAllGuides()

  return (
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

      {/* Two-tone filter layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {guides.length > 0 ? (
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <GuidesHubClient guides={guides} />
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-16 text-sm">
            Guides are being prepared. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
