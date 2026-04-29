import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tipos de Accidentes — Guías Detalladas | AccidentPath',
  description:
    'Encuentre orientación específica para su tipo de accidente. Listas de evidencia, pasos inmediatos, riesgos por plazos y recursos educativos para cada tipo de accidente.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/accidentes',
    languages: {
      en: '/accidents',
      es: '/es/accidentes',
      'x-default': '/accidents',
    },
  },
}

const MOST_COMMON = new Set(['auto', 'caida'])

export default function AccidentesPage() {
  const accidents = cms.getAllAccidents('es')

  return (
    <>
      <SchemaOrg
        schema={breadcrumbSchema([{ label: 'Tipos de Accidentes', href: '/es/accidentes' }])}
        id="breadcrumb-schema"
      />

      <div className="bg-surface-page min-h-screen">
        {/* Page header */}
        <div className="bg-primary-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Tipos de Accidentes' }]} variant="dark" />
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Todos los Tipos de Accidentes
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
              Guías por Tipo de Accidente
            </h1>
            <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
              Encuentre orientación específica para su tipo de accidente — listas de evidencia,
              pasos inmediatos, riesgos por plazos y recursos educativos para entender su situación.
            </p>
            <p className="mt-4 text-primary-400 text-xs">
              Esta información es solo para fines educativos y no constituye asesoramiento legal.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {accidents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {accidents.map(accident => {
                const totalEvidence = accident.evidenceChecklist.reduce(
                  (acc, cat) => acc + cat.items.length,
                  0
                )
                return (
                  <Link
                    key={accident.slug}
                    href={`/es/accidentes/${accident.slug}`}
                    className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
                    <div className="flex flex-col flex-1 p-4">
                      {MOST_COMMON.has(accident.slug) && (
                        <span className="inline-block self-start text-[10px] font-bold text-amber-600 bg-amber-50 rounded-full px-2.5 py-0.5 mb-3">
                          ★ Más Común
                        </span>
                      )}
                      <h2 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-1.5">
                        {accident.title}
                      </h2>
                      <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                        {accident.description.length > 110
                          ? accident.description.slice(0, 110) + '…'
                          : accident.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                        <span className="text-[10px] text-neutral-400">
                          {accident.immediateSteps.length} pasos &middot; {totalEvidence} elementos
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                          Ver guía <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-16 text-sm">
              Las guías de accidentes están siendo preparadas. Vuelva pronto.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
