import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Shield, Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { ToolConfig } from '@/types/tool'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { softwareApplicationSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'
import { ToolEngine } from '@/components/tools/ToolEngine'
import { InjuryJournal } from '@/components/tools/InjuryJournal'

export async function generateStaticParams() {
  return cms.getAllTools().map(t => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const tool = cms.getTool(slug)
    return buildMetaTags({
      title: tool.metaTitle,
      description: tool.metaDescription,
      canonical: `/tools/${slug}`,
    })
  } catch {
    return {}
  }
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let tool: ToolConfig
  try {
    tool = cms.getTool(slug)
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={[softwareApplicationSchema({
          name: tool.title,
          description: tool.description,
          url: `/tools/${tool.slug}`,
        }), breadcrumbSchema([{ label: 'Tools', href: '/tools' }, { label: tool.title }])]}
        id="software-schema"
      />
      <SchemaOrg
        schema={faqSchema(tool.faq)}
        id="faq-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16 print-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Free Tools', href: '/tools' },
              { label: tool.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {tool.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {tool.description}
            </p>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">{tool.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-10">

              {/* Tool engine */}
              {tool.slug === 'injury-journal' ? (
                <InjuryJournal tool={tool} />
              ) : (
                <ToolEngine tool={tool} />
              )}

              {/* Supporting content, FAQ, related, CTA — hidden on print */}
              <div className="print-hide flex flex-col gap-10">
                {tool.supportingContent.map((section, index) => (
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
                        <ul className="flex flex-col gap-2.5">
                          {section.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2.5">
                              <ArrowRight
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

                {tool.faq.length > 0 && (
                  <section aria-labelledby="faq-heading">
                    <h2
                      id="faq-heading"
                      className="font-sans font-bold text-2xl text-neutral-950 mb-4"
                    >
                      Frequently Asked Questions
                    </h2>
                    <div className="flex flex-col gap-2">
                      {tool.faq.map((item, index) => (
                        <details
                          key={index}
                          className="group rounded-xl border border-neutral-100 bg-surface-card"
                        >
                          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-sans font-semibold text-sm text-neutral-950 list-none">
                            {item.question}
                            <ArrowRight
                              className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-open:rotate-90"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="px-5 pb-4">
                            <p className="text-neutral-600 text-sm leading-relaxed font-serif">
                              {item.answer}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {tool.relatedAccidents.length > 0 && (
                  <section aria-labelledby="related-accidents-heading">
                    <h2
                      id="related-accidents-heading"
                      className="font-sans font-bold text-xl text-neutral-950 mb-4"
                    >
                      Related Accident Types
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {tool.relatedAccidents.map(accSlug => (
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

                <CTAButton href="/find-help" size="md">
                  Get Free Guidance
                </CTAButton>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* In This Tool — step nav */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  In This Tool
                </h3>
                <nav aria-label="Tool steps">
                  <ol className="flex flex-col gap-2">
                    {tool.steps.map((step, index) => (
                      <li key={step.id} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-neutral-500 leading-snug">
                          {step.question}
                        </span>
                      </li>
                    ))}
                  </ol>
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

              {/* Related Tools */}
              {tool.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Tools
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedTools.map(toolSlug => (
                      <li key={toolSlug}>
                        <Link
                          href={`/tools/${toolSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <Wrench className="w-3 h-3 shrink-0 text-neutral-400" aria-hidden="true" />
                          {toolSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Guides */}
              {tool.relatedGuides.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Related Guides
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedGuides.map(guideSlug => (
                      <li key={guideSlug}>
                        <Link
                          href={`/guides/${guideSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {guideSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
