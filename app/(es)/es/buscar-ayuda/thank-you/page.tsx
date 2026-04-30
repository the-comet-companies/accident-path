import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'

export const metadata: Metadata = {
  title: 'Gracias — AccidentPath',
  description: 'Su formulario ha sido enviado. Sus próximos pasos personalizados y opciones de conexión con abogados están listos.',
  robots: { index: false, follow: false },
  other: { google: 'notranslate' },
  alternates: {
    canonical: '/es/buscar-ayuda/thank-you',
    languages: {
      en: '/find-help/thank-you',
      es: '/es/buscar-ayuda/thank-you',
      'x-default': '/find-help/thank-you',
    },
  },
}

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Buscar Ayuda', href: '/es/buscar-ayuda' },
              { label: 'Gracias' },
            ]}
            variant="dark"
          />
          <div className="flex items-center gap-2 text-success-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span aria-hidden="true">✓</span> Enviado
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Recibimos Su Información
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Sus resultados personalizados están listos. Si proporcionó una dirección de correo electrónico, recibirá una copia en breve.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <span className="text-success-500 text-2xl font-bold">✓</span>
          </div>
          <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
            ¿Qué Pasa Ahora?
          </h2>
          <ul className="text-sm text-neutral-600 font-sans leading-relaxed text-left mt-4 flex flex-col gap-3">
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Vea sus resultados personalizados y recursos recomendados a continuación.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Explore herramientas gratuitas para documentar su evidencia, seguir sus facturas médicas y prepararse para llamadas de seguros.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Lea guías adaptadas a su tipo de accidente y situación.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Cuando esté listo, contáctenos para conocer qué tipos de abogados manejan casos como el suyo.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/es/buscar-ayuda/results"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            Ver Mis Resultados <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
          <Link
            href="/tools"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary-500 text-primary-600 font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-50 transition-colors"
          >
            Explorar Herramientas Gratuitas
          </Link>
        </div>

        <DisclaimerBanner locale="es" variant="intake" />
      </div>
    </div>
  )
}
