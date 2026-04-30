import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { IntakeWizard } from '@/components/intake/IntakeWizard'
import { getDictionary } from '@/i18n/dictionaries'

export const metadata: Metadata = {
  title: 'Buscar Ayuda Gratis — AccidentPath',
  description:
    'Responda algunas preguntas sobre su accidente para obtener orientación personalizada, conectarse con abogados calificados — servicio gratuito, sin compromiso.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: '/es/buscar-ayuda',
    languages: {
      en: '/find-help',
      es: '/es/buscar-ayuda',
      'x-default': '/find-help',
    },
  },
}

export default async function BuscarAyudaPage() {
  const dict = await getDictionary('es')

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Buscar Ayuda' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            {dict.findHelp.heroLabel}
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            {dict.findHelp.heroHeadline}
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            {dict.findHelp.heroDescription}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> {dict.findHelp.heroCta}
          </div>
        </div>
      </div>

      {/* Wizard card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <IntakeWizard strings={dict.intake} />
        </div>
        <div className="mt-6">
          <DisclaimerBanner locale="es" variant="intake" />
        </div>
      </div>
    </div>
  )
}
