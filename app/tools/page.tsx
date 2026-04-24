import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata = buildMetaTags({
  title: 'Free Accident & Injury Tools — California & Arizona',
  description:
    'Free interactive tools for accident victims: evidence checklists, lost wages estimator, statute of limitations countdown, insurance call prep, and more.',
  canonical: '/tools',
})

const FEATURED_SLUGS = ['statute-countdown', 'accident-case-quiz']

export default function ToolsPage() {
  const tools = cms.getAllTools()
  const featuredTools = tools.filter(t => FEATURED_SLUGS.includes(t.slug))
  const gridTools = tools.filter(t => !FEATURED_SLUGS.includes(t.slug))

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'Tools', href: '/tools' }])} id="breadcrumb-schema" />
    <div className="bg-surface-page min-h-screen">
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Free Tools' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Free Tools
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Free Accident &amp; Injury Tools
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Interactive tools to help you collect evidence, understand your timeline, prepare for
            insurance calls, and more — free, no account required.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> Attorney-reviewed content
          </div>
          <p className="mt-2 text-primary-400 text-xs">
            These tools provide educational information only and do not constitute legal advice.
          </p>
        </div>
      </div>

      {/* Card wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">

          {/* Featured tools — 2-col */}
          {featuredTools.length > 0 && (
            <div className="p-6 lg:p-8">
              <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
                Most Useful
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {featuredTools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group block bg-primary-900 rounded-xl p-6 hover:bg-primary-800 transition-colors"
                  >
                    <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold font-sans mb-3">
                      <span aria-hidden="true">★</span> Most Useful
                    </div>
                    <h2 className="font-sans font-bold text-white text-lg leading-snug mb-2 group-hover:text-amber-100 transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-primary-300 text-sm leading-relaxed mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-400 text-xs">
                        {tool.steps.length} {tool.steps.length === 1 ? 'step' : 'steps'}
                      </span>
                      <span className="text-amber-400 text-sm font-semibold font-sans group-hover:underline">
                        Try It Free →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {featuredTools.length > 0 && gridTools.length > 0 && (
            <div className="border-t border-neutral-100" />
          )}

          {/* Grid tools — 3-col */}
          {gridTools.length > 0 && (
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gridTools.map(tool => (
                  <div
                    key={tool.slug}
                    className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-5 hover:border-primary-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-info flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <h2 className="font-sans font-semibold text-neutral-950 text-sm leading-snug">
                        {tool.title}
                      </h2>
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-xs">
                        {tool.steps.length} {tool.steps.length === 1 ? 'step' : 'steps'}
                      </span>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-xs font-semibold font-sans transition-colors"
                      >
                        Try Tool →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tools.length === 0 && (
            <p className="text-neutral-500 text-center py-16 text-sm">
              Tools are being prepared. Check back soon.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
