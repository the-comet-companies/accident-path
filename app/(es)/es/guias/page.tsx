import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cms } from '@/lib/cms'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guías de Accidentes y Lesiones — California y Arizona | AccidentPath',
  description:
    'Guías en español sobre qué hacer después de un accidente. Evidencia, seguros, cómo contratar abogado y más. Información educativa gratuita para California y Arizona.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/guias',
    languages: {
      en: '/guides',
      es: '/es/guias',
      'x-default': '/guides',
    },
  },
}

export default function GuiasPage() {
  const guides = cms.getAllGuides('es')

  return (
    <>
      <SchemaOrg
        schema={breadcrumbSchema([{ label: 'Guías', href: '/es/guias' }])}
        id="breadcrumb-schema"
      />

      <div className="bg-surface-page min-h-screen">
        {/* Page header */}
        <div className="bg-primary-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Guías' }]} variant="dark" />
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Guías Educativas
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
              Guías de Accidentes y Lesiones
            </h1>
            <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
              Guías en lenguaje claro para ayudarle a entender sus opciones después de un accidente —
              evidencia, seguros, decisiones legales y qué hacer primero.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
              <span aria-hidden="true">✓</span> Contenido revisado por abogados
            </div>
            <p className="mt-2 text-primary-400 text-xs">
              Esta información es solo para fines educativos y no constituye asesoramiento legal.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map(guide => (
                <Link
                  key={guide.slug}
                  href={`/es/guias/${guide.slug}`}
                  className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <div className="h-[2px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
                  <div className="flex flex-col flex-1 p-4">
                    <h2 className="font-sans font-semibold text-sm text-neutral-950 leading-snug mb-1.5">
                      {guide.title}
                    </h2>
                    <p className="font-serif italic text-xs text-neutral-500 leading-relaxed flex-1">
                      {guide.description.length > 110
                        ? guide.description.slice(0, 110) + '…'
                        : guide.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                      <span className="text-[10px] text-neutral-400">
                        {guide.sections.length} secciones
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors">
                        Leer guía <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-16 text-sm">
              Las guías están siendo preparadas. Vuelva pronto.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
