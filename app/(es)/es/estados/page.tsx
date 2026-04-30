import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { CTAButton } from '@/components/ui/CTAButton'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Guías de Leyes de Lesiones por Estado — California y Arizona | AccidentPath',
  description:
    'Comprenda las leyes de lesiones personales, los plazos de prescripción, las reglas de culpa y los requisitos de seguro en California y Arizona.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/estados',
    languages: {
      en: '/states',
      es: '/es/estados',
      'x-default': '/states',
    },
  },
}

export default function EstadosPage() {
  const states = cms.getAllStates('es')

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'Guías por Estado', href: '/es/estados' }])} id="breadcrumb-schema" />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary-400 text-sm font-medium mb-2">Guías por Estado</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Guías de Leyes de Lesiones por Estado
          </h1>
          <p className="mt-4 text-primary-200 text-lg leading-relaxed font-serif max-w-2xl">
            Las leyes de lesiones personales varían según el estado. Atendemos California y Arizona — conozca los plazos específicos, las reglas de culpa y los mínimos de seguro que aplican a su reclamación.
          </p>
        </div>
      </div>

      {/* State cards */}
      <div className="bg-surface-page py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {states.length === 0 ? (
            <p className="text-neutral-500 text-sm">Guías por estado próximamente.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              {states.map(state => {
                const cities = cms.getCitiesByState(state.slug, 'es')
                return (
                  <div
                    key={state.slug}
                    className="rounded-2xl border border-neutral-100 bg-surface-card p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="font-sans font-bold text-primary-700 text-sm">
                          {state.abbreviation}
                        </span>
                      </div>
                      <Link
                        href={`/es/estados/${state.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        Ver guía <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                    <h2 className="font-sans font-bold text-xl text-neutral-950 mb-1">
                      {state.name}
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                      Prescripción: {state.statuteOfLimitations.personalInjury.split(' ').slice(0, 2).join(' ')} &middot; Culpa:{' '}
                      {state.faultRule.type === 'pure_comparative' ? 'Comparativa pura' : state.faultRule.type.replace(/_/g, ' ')}
                    </p>
                    {cities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                          Ciudades
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {cities.map(city => (
                            <li key={city.slug}>
                              <Link
                                href={`/es/estados/${state.slug}/${city.slug}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                              >
                                <MapPin className="w-2.5 h-2.5" aria-hidden="true" />
                                {city.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
              ¿No sabe qué plazos aplican a su caso?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Responda algunas preguntas sobre su accidente y le ayudaremos a comprender sus opciones y próximos pasos.
            </p>
            <CTAButton href="/es/buscar-ayuda" size="md">
              Obtenga Orientación Gratuita
            </CTAButton>
          </div>
        </div>
      </div>

      <DisclaimerBanner locale="es" variant="state" />
    </>
  )
}
