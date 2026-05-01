import type { Metadata } from 'next'
import Link from 'next/link'
import { Wrench } from 'lucide-react'
import { cms } from '@/lib/cms'
import { SLUG_MAP_ES, TOOL_META_ES } from '@/i18n/config'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Herramientas Gratuitas para Víctimas de Accidentes | AccidentPath',
  description:
    'Herramientas interactivas gratuitas: lista de evidencia, calculadora de salario perdido, evaluación de caso y más. Sin cuenta requerida.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/herramientas',
    languages: {
      en: '/tools',
      es: '/es/herramientas',
      'x-default': '/tools',
    },
  },
}

const LAUNCH_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
  'record-request',
  'settlement-readiness',
  'state-next-steps',
  'statute-countdown',
]

const FEATURED_SLUGS = ['accident-case-quiz', 'urgency-checker']

export default function HerramientasPage() {
  const tools = cms.getAllTools()
  const featuredTools = tools.filter(t => FEATURED_SLUGS.includes(t.slug))
  const gridTools = tools
    .filter(t => !FEATURED_SLUGS.includes(t.slug))
    .sort((a, b) => {
      const aLive = LAUNCH_SLUGS.includes(a.slug) ? 0 : 1
      const bLive = LAUNCH_SLUGS.includes(b.slug) ? 0 : 1
      return aLive - bLive
    })

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema([{ label: 'Herramientas', href: '/es/herramientas' }])} id="breadcrumb-schema" />
      <div className="bg-surface-page min-h-screen">
        {/* Hero */}
        <div className="bg-primary-900 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Herramientas Gratuitas' }]} variant="dark" />
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Herramientas Gratuitas
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
              Herramientas de Accidentes y Lesiones Gratis
            </h1>
            <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
              Herramientas interactivas para ayudarle a recopilar evidencia, entender sus plazos, prepararse para llamadas de seguro y más — gratis, sin cuenta requerida.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
              <span aria-hidden="true">✓</span> Contenido revisado por abogados
            </div>
            <p className="mt-2 text-primary-400 text-xs">
              Estas herramientas proporcionan información educativa únicamente y no constituyen asesoramiento legal.
            </p>
          </div>
        </div>

        {/* Card wrapper */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">

            {/* Featured tools — 2-col */}
            {featuredTools.length > 0 && (
              <div className="p-6 lg:p-8">
                <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
                  Más Útiles
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {featuredTools.map(tool => {
                    const esSlug = SLUG_MAP_ES[tool.slug] ?? tool.slug
                    const esMeta = TOOL_META_ES[tool.slug]
                    return (
                      <Link
                        key={tool.slug}
                        href={`/es/herramientas/${esSlug}`}
                        className="group block bg-primary-900 rounded-xl p-6 hover:bg-primary-800 transition-colors"
                      >
                        <div className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold font-sans mb-3">
                          <span aria-hidden="true">★</span> Más Útil
                        </div>
                        <h2 className="font-sans font-bold text-white text-lg leading-snug mb-2 group-hover:text-amber-100 transition-colors">
                          {esMeta?.title ?? tool.title}
                        </h2>
                        <p className="text-primary-300 text-sm leading-relaxed mb-4 line-clamp-2">
                          {esMeta?.description ?? tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-400 text-xs">
                            {tool.steps.length} {tool.steps.length === 1 ? 'paso' : 'pasos'}
                          </span>
                          <span className="text-amber-400 text-sm font-semibold font-sans group-hover:underline">
                            Probar Gratis →
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            {featuredTools.length > 0 && gridTools.length > 0 && (
              <div className="border-t border-neutral-100" />
            )}

            {/* Grid tools — 3-col */}
            {gridTools.length > 0 && (
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gridTools.map(tool => {
                    const isLive = LAUNCH_SLUGS.includes(tool.slug)
                    const esSlug = SLUG_MAP_ES[tool.slug] ?? tool.slug
                    const esMeta = TOOL_META_ES[tool.slug]
                    return (
                      <div
                        key={tool.slug}
                        className={`flex flex-col gap-3 rounded-xl border p-5 transition-colors ${
                          isLive
                            ? 'border-neutral-100 hover:border-primary-200'
                            : 'border-neutral-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-lg bg-surface-info flex items-center justify-center shrink-0">
                            <Wrench className="w-5 h-5 text-primary-600" aria-hidden="true" />
                          </div>
                          {!isLive && (
                            <span className="text-xs font-semibold font-sans text-neutral-400 border border-neutral-200 rounded-full px-2 py-0.5">
                              Próximamente
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <h2 className="font-sans font-semibold text-neutral-950 text-sm leading-snug">
                            {esMeta?.title ?? tool.title}
                          </h2>
                          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                            {esMeta?.description ?? tool.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400 text-xs">
                            {tool.steps.length} {tool.steps.length === 1 ? 'paso' : 'pasos'}
                          </span>
                          {isLive ? (
                            <Link
                              href={`/es/herramientas/${esSlug}`}
                              className="text-primary-600 hover:text-primary-700 text-xs font-semibold font-sans transition-colors"
                            >
                              Probar Herramienta →
                            </Link>
                          ) : (
                            <span className="text-neutral-300 text-xs font-semibold font-sans">
                              Probar Herramienta →
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tools.length === 0 && (
              <p className="text-neutral-500 text-center py-16 text-sm">
                Las herramientas están siendo preparadas. Vuelva pronto.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
