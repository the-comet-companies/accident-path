import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  Shield,
  MapPin,
  Phone,
  Building2,
  Hospital,
  AlertTriangle,
  Navigation,
  User,
  Calendar,
} from 'lucide-react'
import { cms } from '@/lib/cms'
import type { CityData } from '@/types/state'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'

export async function generateStaticParams() {
  return cms.getAllCities('es').map(c => ({
    estado: c.stateSlug,
    ciudad: c.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ estado: string; ciudad: string }>
}): Promise<Metadata> {
  const { estado, ciudad } = await params
  try {
    const cityData = cms.getCity(ciudad, 'es')
    if (cityData.stateSlug !== estado) return {}
    return {
      title: `${cityData.metaTitle} | AccidentPath`,
      description: cityData.metaDescription,
      other: { google: 'notranslate' },
      alternates: {
        canonical: `https://accidentpath.com/es/estados/${estado}/${ciudad}`,
        languages: {
          en: `/states/${estado}/${ciudad}`,
          es: `/es/estados/${estado}/${ciudad}`,
          'x-default': `/states/${estado}/${ciudad}`,
        },
      },
    }
  } catch {
    return {}
  }
}

export default async function CiudadDetailPage({
  params,
}: {
  params: Promise<{ estado: string; ciudad: string }>
}) {
  const { estado, ciudad } = await params

  let cityData: CityData
  try {
    cityData = cms.getCity(ciudad, 'es')
  } catch {
    notFound()
  }

  if (cityData.stateSlug !== estado) notFound()

  let stateData
  try {
    stateData = cms.getState(estado, 'es')
  } catch {
    notFound()
  }

  return (
    <>
      <SchemaOrg
        schema={[articleSchema({
          title: `Guía de Accidentes en ${cityData.name}, ${cityData.stateAbbreviation}`,
          description: cityData.description.slice(0, 200),
          slug: `/es/estados/${estado}/${ciudad}`,
          reviewedBy: cityData.reviewedBy,
          dateModified: cityData.reviewDate,
        }), breadcrumbSchema([
          { label: 'Guías por Estado', href: '/es/estados' },
          { label: stateData.name, href: `/es/estados/${stateData.slug}` },
          { label: cityData.name },
        ])]}
        id="article-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Guías por Estado', href: '/es/estados' },
              { label: stateData.name, href: `/es/estados/${estado}` },
              { label: cityData.name },
            ]}
            variant="dark"
          />
          <div className="mt-4 lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary-400" aria-hidden="true" />
                <span className="text-primary-300 text-sm">
                  {cityData.stateAbbreviation} · Pob. {cityData.population}
                </span>
              </div>
              <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                Guía de Accidentes en {cityData.name}
              </h1>
              <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif">
                {cityData.description}
              </p>
              <div className="mt-6 flex flex-row flex-wrap gap-3">
                <CTAButton href={`/es/buscar-ayuda?city=${cityData.slug}`} size="md" className="whitespace-nowrap">
                  Obtenga Ayuda en {cityData.name}
                </CTAButton>
                <CTAButton
                  href={`/es/estados/${estado}`}
                  variant="secondary"
                  size="md"
                  className="whitespace-nowrap !border-white/30 !text-white hover:!bg-white/10"
                >
                  Leyes del Estado de {stateData.name}
                </CTAButton>
              </div>
              {cityData.reviewedBy !== 'Revisión Legal Pendiente' && (
                <div className="mt-4 flex items-center gap-4 text-primary-400 text-xs">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {cityData.reviewedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {cityData.reviewDate}
                  </span>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4 lg:w-72 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{cityData.hospitals.length}</p>
                <p className="text-primary-300 text-xs mt-1">Hospitales locales</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white font-sans">{cityData.courts.length}</p>
                <p className="text-primary-300 text-xs mt-1">Tribunales</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <p className="text-primary-300 text-xs mb-1">Tipos de accidente más comunes</p>
                <p className="text-white text-sm font-medium">
                  {cityData.commonAccidentTypes.slice(0, 2).join(', ')}
                  {cityData.commonAccidentTypes.length > 2
                    ? ` +${cityData.commonAccidentTypes.length - 2} más`
                    : ''}
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

              {/* Hospitals */}
              <section aria-labelledby="hospitals-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Hospital className="w-5 h-5 text-red-500" aria-hidden="true" />
                  <h2 id="hospitals-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Hospitales de Emergencia Locales
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Busque atención de emergencia inmediatamente después de un accidente grave. La evaluación médica oportuna también crea un registro oficial de sus lesiones.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cityData.hospitals.map(hospital => (
                    <div
                      key={hospital.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm leading-snug">
                          {hospital.name}
                        </h3>
                        {hospital.erAvailable && (
                          <span className="shrink-0 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            UR
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{hospital.address}</span>
                      </div>
                      {hospital.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <a
                            href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {hospital.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Courts */}
              <section aria-labelledby="courts-heading">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-primary-500" aria-hidden="true" />
                  <h2 id="courts-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Tribunales Locales
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm mb-5">
                  Las demandas por lesiones personales en {cityData.name} se presentan en el Tribunal Superior{cityData.stateAbbreviation === 'AZ' ? ' (Condado de Maricopa o Pima)' : ''}. Su abogado presentará la demanda en la jurisdicción correspondiente.
                </p>
                <div className="flex flex-col gap-4">
                  {cityData.courts.map(court => (
                    <div
                      key={court.name}
                      className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans font-semibold text-neutral-950 text-sm">
                          {court.name}
                        </h3>
                        <span className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-full">
                          {court.type}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-neutral-500">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{court.address}</span>
                      </div>
                      {court.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                          <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <a
                            href={`tel:${court.phone.replace(/[^0-9+]/g, '')}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {court.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Common accident types */}
              <section aria-labelledby="accidents-heading">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  <h2 id="accidents-heading" className="font-sans font-bold text-2xl text-neutral-950">
                    Tipos de Accidentes Comunes en {cityData.name}
                  </h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {cityData.commonAccidentTypes.map(accType => (
                    <li key={accType} className="flex items-start gap-3">
                      <AlertTriangle
                        className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-neutral-700 leading-relaxed">{accType}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Notable corridors */}
              {cityData.notableCorridors && cityData.notableCorridors.length > 0 && (
                <section aria-labelledby="corridors-heading">
                  <div className="flex items-center gap-2 mb-6">
                    <Navigation className="w-5 h-5 text-primary-500" aria-hidden="true" />
                    <h2 id="corridors-heading" className="font-sans font-bold text-2xl text-neutral-950">
                      Corredores de Accidentes Notables
                    </h2>
                  </div>
                  <p className="text-neutral-500 text-sm mb-5">
                    Estas carreteras y autopistas son conocidas por su alto volumen de accidentes en {cityData.name}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cityData.notableCorridors.map(corridor => (
                      <div
                        key={corridor}
                        className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-surface-card p-4 shadow-sm"
                      >
                        <Navigation
                          className="w-4 h-4 text-primary-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-neutral-700 leading-relaxed">{corridor}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Local notes */}
              <section aria-labelledby="notes-heading">
                <h2 id="notes-heading" className="font-sans font-bold text-2xl text-neutral-950 mb-4">
                  Notas y Consideraciones Locales
                </h2>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm text-amber-900 leading-relaxed">{cityData.localNotes}</p>
                </div>
              </section>

              <p className="text-xs text-neutral-400 leading-relaxed">
                {cityData.reviewedBy !== 'Revisión Legal Pendiente' && `Información revisada por: ${cityData.reviewedBy} el ${cityData.reviewDate}. `}Esta es información educativa de carácter general y puede no reflejar cambios recientes. Consulte a un abogado con licencia para obtener orientación específica a su situación.
              </p>

              <CTAButton href={`/es/buscar-ayuda?city=${cityData.slug}`} size="md">
                Obtenga Ayuda en {cityData.name}
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
                      ['#hospitals-heading', 'Hospitales de Emergencia'],
                      ['#courts-heading', 'Tribunales Locales'],
                      ['#accidents-heading', 'Accidentes Comunes'],
                      ...(cityData.notableCorridors?.length
                        ? [['#corridors-heading', 'Corredores de Accidentes']]
                        : []),
                      ['#notes-heading', 'Notas Locales'],
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
                  Obtenga Ayuda en {cityData.name}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Responda algunas preguntas y reciba una lista de próximos pasos personalizada para su situación en {cityData.name}. Gratis, sin compromiso.
                </p>
                <CTAButton href={`/es/buscar-ayuda?city=${cityData.slug}`} size="sm" fullWidth>
                  Comience Su Evaluación Gratis
                </CTAButton>
              </div>

              {/* State guide link */}
              <div className="rounded-xl border border-neutral-100 bg-surface-card p-5 shadow-sm">
                <h3 className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                  Leyes del Estado de {stateData.name}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                  Prescripción, reglas de culpa y mínimos de seguro en {stateData.abbreviation}.
                </p>
                <Link
                  href={`/es/estados/${estado}`}
                  className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Ver guía de {stateData.name}
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>

      <DisclaimerBanner locale="es" variant="state" />
    </>
  )
}
