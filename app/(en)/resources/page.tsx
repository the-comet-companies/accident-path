import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Free Resources for Accident Victims — AccidentPath',
  description:
    'Critical guides and checklists for anyone navigating a personal injury claim in California or Arizona. Free, no obligation. No spam.',
  canonical: '/resources',
})

export default function ResourcesPage() {
  const resources = cms.getAllResources()

  return (
    <div className="bg-surface-page min-h-screen">
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Resources' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Free Resources
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            What Your Attorney Won&apos;t Tell You
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Critical information for anyone navigating a personal injury claim in California or Arizona.
            Free, no obligation.
          </p>
          <p className="mt-2 text-primary-400 text-xs">
            This information is for educational purposes only and does not constitute legal advice.
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {resources.map(resource =>
              resource.comingSoon ? (
                <div
                  key={resource.slug}
                  className="opacity-45 flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden"
                >
                  <div className="h-[2px] bg-gradient-to-r from-neutral-300 to-neutral-400 shrink-0" />
                  <div className="flex flex-col flex-1 p-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                      Coming Soon
                    </span>
                    <h2 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-2">
                      {resource.headline}
                    </h2>
                    <p className="font-serif italic text-xs text-neutral-500 leading-relaxed">
                      {resource.teaser}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  key={resource.slug}
                  href={`/resources/${resource.slug}`}
                  className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" />
                  <div className="flex flex-col flex-1 p-5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                        resource.label === 'Critical' ? 'text-red-600' : 'text-amber-700'
                      }`}
                    >
                      {resource.label}
                    </span>
                    <h2 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-2">
                      {resource.headline}
                    </h2>
                    <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                      {resource.teaser}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Lock className="w-3 h-3" aria-hidden="true" />
                        <span>Free access</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                        Unlock free <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-16 text-sm">
            Resources are being prepared. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
