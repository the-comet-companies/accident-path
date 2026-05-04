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
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import { SLUG_MAP_EN, SLUG_MAP_ES, NAV_ACCIDENT_TYPES } from '@/i18n/config'

const GUIDE_EN_SLUGS = [
  'after-car-accident',
  'after-truck-accident',
  'after-motorcycle-crash',
  'am-i-at-fault',
  'common-mistakes',
  'dealing-with-insurance-adjusters',
  'evidence-checklist',
  'getting-your-police-report',
  'hiring-a-lawyer',
  'insurance-claims',
  'protecting-your-claim',
  'settlement-vs-lawsuit',
  'should-i-talk-to-a-lawyer',
  'understanding-medical-bills',
]

export async function generateStaticParams() {
  return GUIDE_EN_SLUGS
    .map(enSlug => ({ slug: SLUG_MAP_ES[enSlug] }))
    .filter((p): p is { slug: string } => Boolean(p.slug))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const guide = cms.getGuide(slug, 'es')
    const enSlug = SLUG_MAP_EN[slug]
    return {
      title: guide.metaTitle,
      description: guide.metaDescription,
      other: { google: 'notranslate' },
      alternates: {
        canonical: `https://accidentpath.com/es/guias/${slug}`,
        languages: {
          en: `/guides/${enSlug}`,
          es: `/es/guias/${slug}`,
          'x-default': `/guides/${enSlug}`,
        },
      },
    }
  } catch {
    return {}
  }
}

const ACCIDENT_LABEL_ES: Record<string, string> = Object.fromEntries(
  NAV_ACCIDENT_TYPES.es.map(({ label, href }) => [href.split('/').pop()!, label])
)

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default async function GuideDetailPageES({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let guide: Guide
  try {
    guide = cms.getGuide(slug, 'es')
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={[
          articleSchema({
            title: guide.title,
            description: guide.description,
            slug: `/es/guias/${guide.slug}`,
          }),
          breadcrumbSchema([
            { label: 'Guías', href: '/es/guias' },
            { label: guide.title },
          ]),
        ]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Guías', href: '/es/guias' },
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
              Esta información es solo para fines educativos y no constituye asesoramiento legal.
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
                          Puntos Clave
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
                    Tipos de Accidentes Relacionados
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {guide.relatedAccidents.map(accSlug => (
                      <Link
                        key={accSlug}
                        href={`/es/accidentes/${accSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                      >
                        {ACCIDENT_LABEL_ES[accSlug] ?? slugToLabel(accSlug)}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <PageLeadCapture
                headline="¿Quieres recibir esta guía por correo?"
                subtext="Guárdala como referencia — especialmente útil en los días después de un accidente."
                buttonLabel="Envíame Esta Guía"
                toolSlug="page-guide-es"
                toolContext={{ guideTitle: guide.title }}
              />

              <CTAButton href="/es/buscar-ayuda" size="md">
                Obtener Orientación Gratuita
              </CTAButton>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  En Esta Guía
                </h3>
                <nav aria-label="Secciones de la guía">
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
                  Obtenga Orientación Personalizada
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Responda algunas preguntas sobre su situación y recibirá una lista personalizada
                  de próximos pasos. Gratis, sin compromiso.
                </p>
                <CTAButton href="/es/buscar-ayuda" size="sm" fullWidth>
                  Comenzar Evaluación Gratuita
                </CTAButton>
              </div>

              {/* Related guides */}
              {guide.relatedGuides.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Guías Relacionadas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {guide.relatedGuides.map(guideSlug => (
                      <li key={guideSlug}>
                        <Link
                          href={`/es/guias/${guideSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {slugToLabel(guideSlug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related tools */}
              {guide.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Herramientas Gratuitas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {guide.relatedTools.map(toolSlug => (
                      <li key={toolSlug}>
                        <Link
                          href={`/es/herramientas/${toolSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {slugToLabel(toolSlug)}
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

      <DisclaimerBanner locale="es" variant="default" />
    </>
  )
}
