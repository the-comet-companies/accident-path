import Link from 'next/link'
import { Activity, ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'
import { CTAButton } from '@/components/ui/CTAButton'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tipos de Lesiones por Accidente — Síntomas y Derechos | AccidentPath',
  description:
    'Aprenda sobre lesiones comunes en accidentes: latigazo, huesos rotos, traumatismo craneal y más. Síntomas, tratamientos y sus derechos en California y Arizona.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/lesiones',
    languages: {
      en: '/injuries',
      es: '/es/lesiones',
      'x-default': '/injuries',
    },
  },
}

export default function LesionesPage() {
  const injuries = cms.getAllInjuries('es')

  return (
    <>
      <SchemaOrg
        schema={breadcrumbSchema([{ label: 'Tipos de Lesiones', href: '/es/lesiones' }])}
        id="breadcrumb-schema"
      />

      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Tipos de Lesiones' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Biblioteca de Lesiones
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Tipos de Lesiones por Accidente
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Entienda las lesiones más comunes en accidentes — síntomas, opciones de tratamiento y lo
            que significan para su recuperación y derechos legales.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> Contenido revisado por abogados
          </div>
          <p className="mt-2 text-primary-400 text-xs">
            Esta información es solo para fines educativos y no constituye asesoramiento legal ni
            médico.
          </p>
        </div>
      </div>

      {/* Injury grid */}
      <div className="bg-surface-page py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {injuries.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-16">
              Las guías de lesiones están siendo preparadas. Vuelva pronto.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {injuries.map(injury => (
                <Link
                  key={injury.slug}
                  href={`/es/lesiones/${injury.slug}`}
                  className="group rounded-2xl border border-neutral-100 bg-surface-card p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <Activity className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <h2 className="font-sans font-semibold text-neutral-950 text-base mb-2 group-hover:text-primary-700 transition-colors">
                    {injury.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-3">
                    {injury.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary-600 text-xs font-medium">
                    Leer más <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA section */}
          <div className="mt-14 rounded-2xl bg-primary-50 border border-primary-200 p-8 text-center">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
              ¿Preocupado por sus lesiones?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-md mx-auto">
              Responda algunas preguntas sobre su accidente y lesiones. Le ayudaremos a entender sus
              próximos pasos — gratis, sin compromiso.
            </p>
            <CTAButton href="/es/buscar-ayuda" size="md">
              Obtener Orientación Gratuita
            </CTAButton>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="default" />
    </>
  )
}
