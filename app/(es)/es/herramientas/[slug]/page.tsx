import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Shield, Clock, Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import { getDictionary } from '@/i18n/dictionaries'
import { SLUG_MAP_ES, SLUG_MAP_EN, TOOL_META_ES } from '@/i18n/config'
import type { ToolConfig } from '@/types/tool'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { softwareApplicationSchema, breadcrumbSchema } from '@/lib/seo'
import { ToolEngine } from '@/components/tools/ToolEngine'
import { InjuryJournal } from '@/components/tools/InjuryJournal'

const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
]

export async function generateStaticParams() {
  return TOOL_EN_SLUGS
    .map(enSlug => ({ slug: SLUG_MAP_ES[enSlug] }))
    .filter((p): p is { slug: string } => Boolean(p.slug))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const enSlug = SLUG_MAP_EN[slug]
  if (!enSlug) return {}

  let tool: ToolConfig
  try {
    tool = cms.getTool(enSlug)
  } catch {
    return {}
  }

  return {
    title: `${tool.metaTitle} | AccidentPath`,
    description: tool.metaDescription,
    other: { google: 'notranslate' },
    alternates: {
      canonical: `https://accidentpath.com/es/herramientas/${slug}`,
      languages: {
        en: `/tools/${enSlug}`,
        es: `/es/herramientas/${slug}`,
        'x-default': `/tools/${enSlug}`,
      },
    },
  }
}

export default async function HerramientaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const enSlug = SLUG_MAP_EN[slug]
  if (!enSlug) notFound()

  let tool: ToolConfig
  try {
    tool = cms.getTool(enSlug)
  } catch {
    notFound()
  }

  const dict = await getDictionary('es')
  const toolStrings = {
    cta: dict.cta,
    tools: dict.tools,
  }
  const esMeta = TOOL_META_ES[enSlug]

  const isLive = TOOL_EN_SLUGS.includes(enSlug)

  if (!isLive) {
    return (
      <>
        <div className="bg-primary-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb
              items={[{ label: 'Herramientas Gratuitas', href: '/es/herramientas' }, { label: tool.title }]}
              variant="dark"
            />
            <div className="mt-4 max-w-2xl">
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {esMeta?.title ?? tool.title}
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                {esMeta?.description ?? tool.description}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface-page min-h-[40vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-neutral-100 mb-6">
              <Clock className="w-7 h-7 text-neutral-400" aria-hidden="true" />
            </div>
            <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-3">Próximamente</h2>
            <p className="text-neutral-500 font-serif text-base max-w-md mx-auto mb-8">
              Esta herramienta está siendo preparada y estará disponible al lanzamiento. Mientras tanto, explore nuestras otras herramientas gratuitas.
            </p>
            <Link
              href="/es/herramientas"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors"
            >
              ← Ver Todas las Herramientas
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SchemaOrg
        schema={[softwareApplicationSchema({
          name: tool.title,
          description: tool.description,
          url: `/es/herramientas/${slug}`,
        }), breadcrumbSchema([{ label: 'Herramientas', href: '/es/herramientas' }, { label: tool.title }])]}
        id="software-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16 print-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Herramientas Gratuitas', href: '/es/herramientas' },
              { label: tool.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {esMeta?.title ?? tool.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {esMeta?.description ?? tool.description}
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
                <ToolEngine tool={tool} strings={toolStrings} />
              )}

              {/* Supporting content — hidden on print */}
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

                {tool.relatedAccidents.length > 0 && (
                  <section aria-labelledby="related-accidents-heading">
                    <h2
                      id="related-accidents-heading"
                      className="font-sans font-bold text-xl text-neutral-950 mb-4"
                    >
                      Tipos de Accidentes Relacionados
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {tool.relatedAccidents.map(accSlug => (
                        <Link
                          key={accSlug}
                          href={`/es/accidentes/${SLUG_MAP_ES[accSlug] ?? accSlug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                        >
                          {accSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <CTAButton href="/es/buscar-ayuda" size="md">
                  Obtenga Orientación Gratuita
                </CTAButton>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* En Esta Herramienta — step nav */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  En Esta Herramienta
                </h3>
                <nav aria-label="Pasos de la herramienta">
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
                  Obtenga Orientación Personalizada
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Responda algunas preguntas sobre su situación y reciba una lista de próximos pasos personalizada. Gratis, sin compromiso.
                </p>
                <CTAButton href="/es/buscar-ayuda" size="sm" fullWidth>
                  Comience Su Evaluación Gratis
                </CTAButton>
              </div>

              {/* Related Tools */}
              {tool.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Herramientas Relacionadas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedTools.map(toolSlug => (
                      <li key={toolSlug}>
                        <Link
                          href={`/es/herramientas/${SLUG_MAP_ES[toolSlug] ?? toolSlug}`}
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
                    Guías Relacionadas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {tool.relatedGuides.map(guideSlug => (
                      <li key={guideSlug}>
                        <Link
                          href={`/es/guias/${SLUG_MAP_ES[guideSlug] ?? guideSlug}`}
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
