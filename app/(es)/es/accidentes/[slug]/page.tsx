import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle, ArrowRight, Scale, Shield, ExternalLink } from 'lucide-react'
import { cms } from '@/lib/cms'
import type { AccidentType } from '@/types/accident'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { ChecklistBlock } from '@/components/content/ChecklistBlock'
import { TimelineBlock } from '@/components/content/TimelineBlock'
import { PageLeadCapture } from '@/components/ui/PageLeadCapture'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import { SLUG_MAP_EN, SLUG_MAP_ES, NAV_ACCIDENT_TYPES } from '@/i18n/config'

const ACCIDENT_EN_SLUGS = [
  'car', 'truck', 'motorcycle', 'slip-and-fall', 'workplace', 'bicycle',
  'pedestrian', 'dog-bite', 'construction', 'premises', 'product',
  'wrongful-death', 'uber-lyft', 'spinal', 'traumatic-brain',
]

export async function generateStaticParams() {
  return ACCIDENT_EN_SLUGS
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
    const accident = cms.getAccident(slug, 'es')
    const enSlug = SLUG_MAP_EN[slug]
    return {
      title: accident.metaTitle,
      description: accident.metaDescription,
      other: { google: 'notranslate' },
      alternates: {
        canonical: `https://accidentpath.com/es/accidentes/${slug}`,
        languages: {
          en: `/accidents/${enSlug}`,
          es: `/es/accidentes/${slug}`,
          'x-default': `/accidents/${enSlug}`,
        },
      },
    }
  } catch {
    return {}
  }
}

const urgencyConfig = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    label: 'Crítico',
  },
  important: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    label: 'Importante',
  },
  helpful: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    badge: 'bg-primary-100 text-primary-700',
    dot: 'bg-primary-500',
    label: 'Útil',
  },
}

const severityColors = {
  mild: 'bg-green-50 border-green-200 text-green-800',
  moderate: 'bg-amber-50 border-amber-200 text-amber-800',
  severe: 'bg-orange-50 border-orange-200 text-orange-800',
  catastrophic: 'bg-red-50 border-red-200 text-red-800',
}

const ACCIDENT_LABEL_ES: Record<string, string> = Object.fromEntries(
  NAV_ACCIDENT_TYPES.es.map(({ label, href }) => [href.split('/').pop()!, label])
)

function slugToLabel(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default async function AccidentHubPageES({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const enSlug = SLUG_MAP_EN[slug]

  let accident: AccidentType
  try {
    accident = cms.getAccident(slug, 'es')
  } catch {
    notFound()
  }

  const totalEvidenceItems = accident.evidenceChecklist.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  )

  return (
    <>
      <SchemaOrg
        schema={[
          articleSchema({
            title: accident.title,
            description: accident.description,
            slug: `/es/accidentes/${slug}`,
          }),
          breadcrumbSchema([
            { label: 'Tipos de Accidentes', href: '/es/accidentes' },
            { label: accident.title },
          ]),
        ]}
        id="article-schema"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Tipos de Accidentes', href: '/es/accidentes' },
              { label: accident.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {accident.title}
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                {accident.description}
              </p>
              <div className="mt-6 flex flex-row flex-wrap gap-3">
                <CTAButton href="/es/buscar-ayuda" size="md" className="whitespace-nowrap">
                  Obtener Orientación Gratuita
                </CTAButton>
                <CTAButton
                  href="#evidence-checklist"
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap !border-white/30 !text-white hover:!bg-white/10"
                >
                  Ver Lista de Evidencia
                </CTAButton>
              </div>
              <p className="mt-4 text-primary-400 text-xs leading-relaxed">
                Esta información es solo para fines educativos y no constituye asesoramiento legal.
                La disponibilidad varía por estado y tipo de caso.
              </p>
            </div>

            {/* Quick-stats card */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">
                  {accident.immediateSteps.length}
                </p>
                <p className="text-primary-300 text-xs mt-1">Pasos inmediatos</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{totalEvidenceItems}</p>
                <p className="text-primary-300 text-xs mt-1">Elementos de evidencia</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Lesiones comunes</p>
                <p className="text-white text-sm font-medium">
                  {accident.likelyInjuries
                    .slice(0, 3)
                    .map(i => i.title)
                    .join(', ')}
                  {accident.likelyInjuries.length > 3
                    ? ` +${accident.likelyInjuries.length - 3} más`
                    : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page body ─────────────────────────────────────────────────────── */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* ── Main column ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-14">

              {/* Common Causes */}
              <section aria-labelledby="causes-heading">
                <h2 id="causes-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-6">
                  Causas Comunes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accident.commonCauses.map(cause => (
                    <div
                      key={cause.title}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                        {cause.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{cause.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Likely Injuries */}
              <section aria-labelledby="injuries-heading">
                <h2 id="injuries-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-3">
                  Lesiones Probables
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  Este tipo de accidente se asocia frecuentemente con las siguientes lesiones.
                  Seleccione una lesión para obtener más información.
                </p>
                <div className="flex flex-wrap gap-3">
                  {accident.likelyInjuries.map(injury => (
                    <Link
                      key={injury.slug}
                      href={`/es/lesiones/${injury.slug}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-opacity hover:opacity-75 ${severityColors[injury.severity]}`}
                    >
                      {injury.title}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Immediate Steps */}
              <section aria-labelledby="steps-heading">
                <h2 id="steps-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-6">
                  Qué Hacer Inmediatamente
                </h2>
                <ol className="flex flex-col gap-4">
                  {accident.immediateSteps.map(step => {
                    const config = urgencyConfig[step.urgency]
                    return (
                      <li
                        key={step.step}
                        className={`flex gap-4 rounded-xl border p-5 ${config.bg} ${config.border}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold font-sans shrink-0 ${config.dot}`}
                        >
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                              {step.title}
                            </h3>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>

              <PageLeadCapture
                headline={`Recibe la lista de verificación de ${accident.title} por correo`}
                subtext="Una guía rápida sobre qué documentar, reportar y hacer a continuación."
                buttonLabel="Envíame la Lista"
                toolSlug="page-accident-es"
                toolContext={{ accidentType: accident.title }}
              />

              {/* Evidence Checklist */}
              <section id="evidence-checklist" aria-labelledby="checklist-heading">
                <h2 id="checklist-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-2">
                  Lista de Evidencia
                </h2>
                <p className="text-neutral-500 text-sm mb-6">
                  Marque los elementos a medida que los recopile. Los elementos críticos deben
                  recopilarse lo antes posible después del accidente.
                </p>
                <ChecklistBlock items={accident.evidenceChecklist} />
              </section>

              {/* Timeline Risks */}
              <section aria-labelledby="timeline-heading">
                <h2 id="timeline-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-2">
                  Riesgos por Plazos
                </h2>
                <p className="text-neutral-500 text-sm mb-6">
                  Plazos clave y acciones urgentes. Perder estas ventanas de tiempo puede afectar
                  significativamente sus opciones.
                </p>
                <TimelineBlock items={accident.timelineRisks} />
              </section>

              {/* Insurance Issues */}
              <section aria-labelledby="insurance-heading">
                <h2 id="insurance-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-6">
                  Problemas de Seguro a Conocer
                </h2>
                <div className="flex flex-col gap-4">
                  {accident.insuranceIssues.map(item => (
                    <div
                      key={item.issue}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                            {item.issue}
                          </h3>
                          <p className="text-sm text-neutral-500 leading-relaxed">{item.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* When You Need a Lawyer */}
              <section aria-labelledby="lawyer-heading">
                <h2 id="lawyer-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-3">
                  Cuándo Puede Beneficiarse de Hablar con un Abogado
                </h2>
                <p className="text-neutral-500 text-sm mb-5">
                  No está obligado a contratar a un abogado. Pero en algunas situaciones, hablar
                  con un abogado con experiencia en lesiones personales puede ayudar a proteger sus
                  opciones. Esta es información educativa, no asesoramiento legal.
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {accident.whenToGetLawyer.map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-5 h-5 text-primary-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <CTAButton href="/es/buscar-ayuda" size="md">
                  Obtener Orientación Gratuita
                </CTAButton>
              </section>

              {/* State-Specific Notes */}
              <section aria-labelledby="state-heading">
                <h2 id="state-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-6">
                  Notas por Estado
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-primary-600" aria-hidden="true" />
                      <h3 className="font-sans font-semibold text-primary-900 text-sm">California</h3>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-primary-800 leading-relaxed">
                      <li>
                        <strong>Prescripción:</strong> 2 años desde la fecha del accidente para
                        reclamar daños personales
                      </li>
                      <li>
                        <strong>Regla de culpabilidad:</strong> Culpa comparativa pura — puede
                        recuperar incluso si tuvo parte de la culpa, reducida por su porcentaje
                      </li>
                      <li>
                        <strong>Seguro mínimo:</strong> $30,000/$60,000/$15,000
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale className="w-5 h-5 text-amber-600" aria-hidden="true" />
                      <h3 className="font-sans font-semibold text-amber-900 text-sm">Arizona</h3>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-amber-800 leading-relaxed">
                      <li>
                        <strong>Prescripción:</strong> 2 años desde la fecha del accidente para
                        reclamar daños personales
                      </li>
                      <li>
                        <strong>Regla de culpabilidad:</strong> Culpa comparativa pura — su
                        compensación se reduce por su porcentaje de responsabilidad
                      </li>
                      <li>
                        <strong>Seguro mínimo:</strong> $25,000/$50,000/$15,000
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  Las leyes varían por estado y están sujetas a cambios. Lo anterior es información
                  educativa general únicamente y puede no reflejar cambios legislativos recientes.
                  Consulte a un abogado con licencia en su estado para obtener asesoramiento
                  específico a su situación.
                </p>
              </section>

            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="hidden lg:flex flex-col gap-5 sticky top-24">

              {/* On this page */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-4">
                  En Esta Página
                </h3>
                <nav aria-label="Secciones de la página">
                  <ul className="flex flex-col gap-2">
                    {[
                      ['#causes-heading', 'Causas Comunes'],
                      ['#injuries-heading', 'Lesiones Probables'],
                      ['#steps-heading', 'Pasos Inmediatos'],
                      ['#evidence-checklist', 'Lista de Evidencia'],
                      ['#timeline-heading', 'Riesgos por Plazos'],
                      ['#insurance-heading', 'Problemas de Seguro'],
                      ['#lawyer-heading', 'Cuándo Ver a un Abogado'],
                      ['#state-heading', 'Notas por Estado'],
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
              {accident.relatedAccidents.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Tipos de Accidentes Relacionados
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {accident.relatedAccidents.map(relSlug => (
                      <li key={relSlug}>
                        <Link
                          href={`/es/accidentes/${relSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {ACCIDENT_LABEL_ES[relSlug] ?? slugToLabel(relSlug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related injuries */}
              {accident.relatedInjuries.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Lesiones Relacionadas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {accident.relatedInjuries.map(injSlug => (
                      <li key={injSlug}>
                        <Link
                          href={`/es/lesiones/${injSlug}`}
                          className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {slugToLabel(injSlug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related guides */}
              {accident.relatedGuides.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Guías Relacionadas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {accident.relatedGuides.map(guideSlug => (
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
              {accident.relatedTools.length > 0 && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Herramientas Gratuitas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {accident.relatedTools.map(toolSlug => (
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
