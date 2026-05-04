import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Shield, Lightbulb } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { Guide } from '@/types/content'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import { getGuideRelated } from '@/lib/related'

export async function generateStaticParams() {
  return cms.getAllGuides().map(g => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const guide = cms.getGuide(slug)
    return buildMetaTags({
      title: guide.metaTitle,
      description: guide.metaDescription,
      canonical: `/guides/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let guide: Guide
  try {
    guide = cms.getGuide(slug)
  } catch {
    notFound()
  }

  const related = getGuideRelated(slug)

  return (
    <>
      <SchemaOrg
        schema={[articleSchema({
          title: guide.title,
          description: guide.description,
          slug: `/guides/${guide.slug}`,
        }), breadcrumbSchema([{ label: 'Guides', href: '/guides' }, { label: guide.title }])]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Guides', href: '/guides' },
              { label: guide.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {guide.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {guide.description}
            </p>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">
              This information is for educational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-10">
              {guide.sections.map((section, index) => (
                <section key={index} aria-labelledby={`section-${index}`}>
                  <h2
                    id={`section-${index}`}
                    className="font-sans font-bold text-2xl text-neutral-950 mb-4"
                  >
                    {section.heading}
                  </h2>
                  <p className="text-neutral-600 leading-relaxed text-base font-serif mb-5">
                    {section.content}
                  </p>
                  {section.tips && section.tips.length > 0 && (
                    <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-primary-600 shrink-0" aria-hidden="true" />
                        <h3 className="font-sans font-semibold text-primary-900 text-sm">
                          Key Takeaways
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2.5">
                            <CheckCircle
                              className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span className="text-sm text-primary-800 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))}

              {/* Related accident types */}
              {guide.relatedAccidents.length > 0 && (
                <section aria-labelledby="related-accidents-heading">
                  <h2
                    id="related-accidents-heading"
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    Related Accident Types
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {guide.relatedAccidents.map(accSlug => (
                      <Link
                        key={accSlug}
                        href={`/accidents/${accSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                      >
                        {accSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <PageLeadCapture
                headline="Want this guide emailed to you?"
                subtext="Save it for reference — especially useful in the days after an accident."
                buttonLabel="Email Me This Guide"
                toolSlug="page-guide"
                toolContext={{ guideTitle: guide.title, guideSlug: guide.slug }}
              />

              {/* Resource CTA */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-2">
                  Must Read
                </p>
                <p className="text-sm font-semibold text-neutral-800 leading-snug mb-3">
                  5 Things You MUST Know Before Deciding on an Attorney
                </p>
                <a
                  href="/resources/5-things-before-deciding-on-attorney"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Read the free resource <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <CTAButton href="/find-help" size="md">
                Get Free Guidance
              </CTAButton>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  In This Guide
                </h3>
                <nav aria-label="Guide sections">
                  <ul className="flex flex-col gap-2">
                    {guide.sections.map((section, index) => (
                      <li key={index}>
                        <a
                          href={`#section-${index}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors py-0.5"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {section.heading}
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

              {/* Related guides */}
              {related.guides.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Guides
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {related.guides.map(link => (
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
