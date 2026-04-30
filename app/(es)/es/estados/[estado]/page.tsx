import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  Shield,
  Scale,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  User,
} from 'lucide-react'
import { cms } from '@/lib/cms'
import type { StateData } from '@/types/state'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'

const FAULT_RULE_LABELS: Record<string, string> = {
  pure_comparative: 'Culpa Comparativa Pura',
  modified_comparative: 'Culpa Comparativa Modificada',
  contributory: 'Negligencia Contributiva',
  no_fault: 'Sin Culpa',
}

export async function generateStaticParams() {
  return cms.getAllStates('es').map(s => ({ estado: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ estado: string }>
}): Promise<Metadata> {
  const { estado } = await params
  try {
    const stateData = cms.getState(estado, 'es')
    return {
      title: `${stateData.metaTitle} | AccidentPath`,
      description: stateData.metaDescription,
      other: { google: 'notranslate' },
      alternates: {
        canonical: `https://accidentpath.com/es/estados/${estado}`,
        languages: {
          en: `/states/${estado}`,
          es: `/es/estados/${estado}`,
          'x-default': `/states/${estado}`,
        },
      },
    }
  } catch {
    return {}
  }
}

export default async function EstadoDetailPage({
  params,
}: {
  params: Promise<{ estado: string }>
}) {
  const { estado } = await params

  let stateData: StateData
  try {
    stateData = cms.getState(estado, 'es')
  } catch {
    notFound()
  }

  const cities = cms.getCitiesByState(estado, 'es')
  const faultRuleLabel = FAULT_RULE_LABELS[stateData.faultRule.type] ?? stateData.faultRule.type

  return (
    <>
      <SchemaOrg
        schema={[articleSchema({
          title: `Guía de Lesiones Personales en ${stateData.name}`,
          description: stateData.metaDescription,
          slug: `/es/estados/${stateData.slug}`,
          reviewedBy: stateData.reviewedBy,
          dateModified: stateData.reviewDate,
        }), breadcrumbSchema([{ label: 'Guías por Estado', href: '/es/estados' }, { label: stateData.name }])]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Guías por Estado', href: '/es/estados' },
              { label: stateData.name },
            ]}
            variant="dark"
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 mb-4">
                <span className="font-sans font-bold text-white text-sm">{stateData.abbreviation}</span>
              </div>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                Guía de Lesiones Personales en {stateData.name}
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                Plazos clave, reglas de culpa, mínimos de seguro y leyes que afectan las reclamaciones por lesiones personales en {stateData.name}.
              </p>
              {stateData.reviewedBy !== 'Revisión Legal Pendiente' && (
                <div className="mt-4 flex items-center gap-4 text-primary-400 text-xs">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {stateData.reviewedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {stateData.reviewDate}
                  </span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-lg font-bold text-white font-sans">
                  {stateData.statuteOfLimitations.personalInjury.split(' ')[0]}{' '}
                  {stateData.statuteOfLimitations.personalInjury.split(' ')[1]}
                </p>
                <p className="text-primary-300 text-xs mt-1">Prescripción</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-bold text-white font-sans leading-tight">{faultRuleLabel}</p>
                <p className="text-primary-300 text-xs mt-1">Sistema de culpa</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Cobertura mín. de lesiones corporales</p>
                <p className="text-white text-sm font-medium">
                  {stateData.insuranceMinimums.bodilyInjuryPerPerson} /{' '}
                  {stateData.insuranceMinimums.bodilyInjuryPerAccident}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-surface-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">

            {/* Main column */}
            <div className="flex flex-col gap-14">

              {/* Statute of limitations */}
              <section aria-labelledby="sol-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2 id="sol-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Plazo de Prescripción
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Estos son los plazos para presentar una demanda. Incumplir estos plazos generalmente significa perder el derecho a obtener compensación.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">
                      Lesiones Personales
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.personalInjury}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                      Daños a la Propiedad
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.propertyDamage}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                      Muerte por Negligencia
                    </p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.statuteOfLimitations.wrongfulDeath}
                    </p>
                  </div>
                </div>
              </section>

              {/* Fault rule */}
              <section aria-labelledby="fault-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Scale className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2 id="fault-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Regla de Culpa: {faultRuleLabel}
                  </h2>
                </div>
                <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                  <p className="text-sm text-primary-900 leading-relaxed">
                    {stateData.faultRule.description}
                  </p>
                </div>
              </section>

              {/* Reporting deadlines */}
              <section aria-labelledby="reporting-heading">
                <h2 id="reporting-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-6">
                  Plazos de Notificación
                </h2>
                <div className="flex flex-col gap-4">
                  {stateData.reportingDeadlines.map(item => (
                    <div
                      key={item.type}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                          {item.type}
                        </h3>
                        <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          {item.deadline}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">{item.details}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Insurance minimums */}
              <section aria-labelledby="insurance-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2 id="insurance-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Mínimos de Seguro
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Estos son los montos mínimos de cobertura de seguro de auto requeridos en {stateData.name}. Muchos conductores solo tienen estos mínimos, lo que puede ser insuficiente para lesiones graves.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Lesiones corporales (por persona)</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.bodilyInjuryPerPerson}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Lesiones corporales (por accidente)</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.bodilyInjuryPerAccident}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm">
                    <p className="text-xs text-neutral-400 mb-1">Daños a la propiedad</p>
                    <p className="font-sans font-bold text-neutral-950 text-base">
                      {stateData.insuranceMinimums.propertyDamage}
                    </p>
                  </div>
                  {stateData.insuranceMinimums.uninsuredMotorist && (
                    <div className="rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm col-span-2 sm:col-span-1">
                      <p className="text-xs text-neutral-400 mb-1">Motorista sin seguro</p>
                      <p className="font-sans font-semibold text-neutral-700 text-sm">
                        {stateData.insuranceMinimums.uninsuredMotorist}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Key laws */}
              <section aria-labelledby="laws-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2 id="laws-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Leyes Clave que Debe Conocer
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {stateData.keyLaws.map(law => (
                    <div
                      key={law.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-2">
                        {law.name}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{law.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cities */}
              {cities.length > 0 && (
                <section aria-labelledby="cities-heading">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary-500" aria-hidden="true" />
                    <h2 id="cities-heading" className="font-sans font-bold text-2xl text-neutral-950">
                      Ciudades en {stateData.name}
                    </h2>
                  </div>
                  <p className="text-neutral-500 text-sm mb-5">
                    Recursos locales, hospitales, tribunales e información sobre zonas de accidentes en las principales ciudades de {stateData.name}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cities.map(city => (
                      <Link
                        key={city.slug}
                        href={`/es/estados/${stateData.slug}/${city.slug}`}
                        className="group rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-sans font-semibold text-neutral-950 text-sm group-hover:text-primary-700 transition-colors">
                              {city.name}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Pob. {city.population}
                            </p>
                          </div>
                          <ArrowRight
                            className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                          {city.commonAccidentTypes[0]}, {city.commonAccidentTypes[1]}
                          {city.commonAccidentTypes.length > 2 ? ` + ${city.commonAccidentTypes.length - 2} más` : ''}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-xs text-neutral-400 leading-relaxed">
                La información anterior es educativa de carácter general sobre las leyes de {stateData.name} y puede no reflejar cambios legislativos recientes.{stateData.reviewedBy !== 'Revisión Legal Pendiente' && ` Revisado por: ${stateData.reviewedBy} el ${stateData.reviewDate}.`}{' '}
                Consulte a un abogado con licencia en {stateData.name} para obtener orientación específica a su situación.
              </p>

              <CTAButton href="/es/buscar-ayuda" size="md">
                Obtenga Orientación Gratuita
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
                      ['#sol-heading', 'Plazo de Prescripción'],
                      ['#fault-heading', 'Regla de Culpa'],
                      ['#reporting-heading', 'Plazos de Notificación'],
                      ['#insurance-heading', 'Mínimos de Seguro'],
                      ['#laws-heading', 'Leyes Clave'],
                      ...(cities.length > 0 ? [['#cities-heading', 'Ciudades']] : []),
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
                  Responda algunas preguntas sobre su situación y reciba una lista de próximos pasos personalizada. Gratis, sin compromiso.
                </p>
                <CTAButton href="/es/buscar-ayuda" size="sm" fullWidth>
                  Comience Su Evaluación Gratis
                </CTAButton>
              </div>

              {/* Reviewer badge */}
              {stateData.reviewedBy !== 'Revisión Legal Pendiente' && (
                <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                    Revisado Por
                  </p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                    <p className="text-sm text-neutral-700">{stateData.reviewedBy}</p>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{stateData.reviewDate}</p>
                </div>
              )}

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner locale="es" variant="state" />
    </>
  )
}
