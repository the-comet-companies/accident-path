import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Shield, AlertTriangle, Stethoscope, Clock } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { InjuryType } from '@/types/injury'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import { SLUG_MAP_ES, SLUG_MAP_EN, NAV_ACCIDENT_TYPES } from '@/i18n/config'

const INJURY_EN_SLUGS = [
  'whiplash',
  'broken-bones',
  'traumatic-brain',
  'spinal',
  'soft-tissue',
  'burns',
  'internal',
]

export async function generateStaticParams() {
  return INJURY_EN_SLUGS
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
    const injury = cms.getInjury(slug, 'es')
    const enSlug = SLUG_MAP_EN[slug]
    return {
      title: injury.metaTitle,
      description: injury.metaDescription,
      other: { google: 'notranslate' },
      alternates: {
        canonical: `https://accidentpath.com/es/lesiones/${slug}`,
        languages: {
          en: `/injuries/${enSlug}`,
          es: `/es/lesiones/${slug}`,
          'x-default': `/injuries/${enSlug}`,
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

export default async function InjuryDetailPageES({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let injury: InjuryType
  try {
    injury = cms.getInjury(slug, 'es')
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={[
          articleSchema({
            title: injury.title,
            description: injury.description,
            slug: `/es/lesiones/${slug}`,
          }),
          breadcrumbSchema([
            { label: 'Tipos de Lesiones', href: '/es/lesiones' },
            { label: injury.title },
          ]),
        ]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Tipos de Lesiones', href: '/es/lesiones' },
              { label: injury.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 max-w-2xl">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {injury.title}
            </h1>
            <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
              {injury.description}
            </p>
            <div className="mt-6 flex flex-row flex-wrap gap-3">
              <CTAButton href="/es/buscar-ayuda" size="md" className="whitespace-nowrap">
                Obtener Orientación Gratuita
              </CTAButton>
            </div>
            <p className="mt-4 text-primary-400 text-xs leading-relaxed">
              Esta información es solo para fines educativos y no constituye asesoramiento legal ni
              médico.
            </p>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-14">

              {/* Symptoms */}
              <section aria-labelledby="symptoms-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2
                    id="symptoms-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Síntomas a Observar
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Algunos síntomas aparecen de inmediato; otros se desarrollan horas o días después
                  del accidente. Busque evaluación médica de inmediato aunque se sienta bien.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {injury.symptoms.map(symptom => (
                    <li
                      key={symptom}
                      className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4"
                    >
                      <AlertTriangle
                        className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-amber-900 leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <PageLeadCapture
                headline={`Recibe una guía de síntomas y documentación de ${injury.title}`}
                subtext="Qué rastrear, cuándo ver a un médico y qué buscan las aseguradoras."
                buttonLabel="Envíame la Guía"
                toolSlug="page-injury-es"
                toolContext={{ injuryType: injury.title }}
              />

              {/* Long-term effects */}
              <section aria-labelledby="effects-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-red-500" aria-hidden="true" />
                  <h2
                    id="effects-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Efectos a Largo Plazo
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Las lesiones graves pueden tener efectos duraderos en su salud, trabajo y vida
                  diaria. Comprender estas posibilidades es importante para su recuperación y opciones
                  legales.
                </p>
                <ul className="flex flex-col gap-3">
                  {injury.longTermEffects.map(effect => (
                    <li key={effect} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{effect}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Treatment options */}
              <section aria-labelledby="treatment-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Stethoscope className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2
                    id="treatment-heading"
                    className="font-sans font-bold text-2xl text-neutral-950"
                  >
                    Opciones de Tratamiento
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Las opciones de tratamiento varían según la gravedad. Siga las recomendaciones de
                  su proveedor de salud y documente todo el tratamiento — es evidencia importante
                  para su reclamo.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {injury.treatmentOptions.map(treatment => (
                    <div
                      key={treatment}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle
                          className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-neutral-700 leading-relaxed">{treatment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Common causes */}
              <section aria-labelledby="causes-heading">
                <h2
                  id="causes-heading"
                  className="font-sans font-bold text-2xl text-neutral-950 mb-3"
                >
                  Causas Comunes de Accidente
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  Estos tipos de accidentes se asocian frecuentemente con esta lesión. Seleccione un
                  tipo de accidente para conocer los pasos a seguir.
                </p>
                <div className="flex flex-wrap gap-3">
                  {injury.commonCauses.map(cause => (
                    <span
                      key={cause}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-neutral-200 bg-surface-card text-sm text-neutral-700"
                    >
                      {cause}
                    </span>
                  ))}
                </div>
                {injury.relatedAccidents.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {injury.relatedAccidents.map(accSlug => (
                      <Link
                        key={accSlug}
                        href={`/es/accidentes/${accSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-200 bg-primary-50 text-sm text-primary-700 hover:bg-primary-100 transition-colors"
                      >
                        {ACCIDENT_LABEL_ES[accSlug] ?? slugToLabel(accSlug)}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <CTAButton href="/es/buscar-ayuda" size="md">
                Obtener Orientación Gratuita
              </CTAButton>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  En Esta Página
                </h3>
                <nav aria-label="Secciones de la página">
                  <ul className="flex flex-col gap-2">
                    {[
                      ['#symptoms-heading', 'Síntomas'],
                      ['#effects-heading', 'Efectos a Largo Plazo'],
                      ['#treatment-heading', 'Opciones de Tratamiento'],
                      ['#causes-heading', 'Causas Comunes'],
                    ].map(([href, label]) => (
                      <li key={href}>
                        <a
                          href={href}
                          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors py-0.5"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {label}
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

              {/* Related accident types */}
              {injury.relatedAccidents.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Tipos de Accidentes Relacionados
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {injury.relatedAccidents.map(accSlug => (
                      <li key={accSlug}>
                        <Link
                          href={`/es/accidentes/${accSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {ACCIDENT_LABEL_ES[accSlug] ?? slugToLabel(accSlug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related tools */}
              {injury.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Herramientas Gratuitas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {injury.relatedTools.map(toolSlug => (
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
