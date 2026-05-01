import Link from 'next/link'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Contacto — AccidentPath',
  description:
    'Contáctese con AccidentPath — preguntas generales, consultas sobre asociaciones con abogados, prensa o comentarios sobre nuestra plataforma de orientación en accidentes.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/contacto',
    languages: {
      en: '/contact',
      es: '/es/contacto',
      'x-default': '/contact',
    },
  },
}

const CONTACT_TOPICS = [
  {
    title: 'Preguntas Generales',
    email: 'hello@accidentpath.com',
    description: 'Preguntas sobre nuestras guías, herramientas o plataforma.',
  },
  {
    title: 'Asociaciones con Abogados',
    email: 'attorneys@accidentpath.com',
    description: 'Interesado/a en unirse a nuestra red de abogados en CA o AZ.',
  },
  {
    title: 'Prensa y Medios',
    email: 'press@accidentpath.com',
    description: 'Consultas de medios, solicitudes de entrevista o preguntas editoriales.',
  },
  {
    title: 'Problemas Técnicos',
    email: 'support@accidentpath.com',
    description: '¿Algo no funciona? Reporte un error o enlace roto.',
  },
]

const EXPECTATIONS = [
  'Respondemos a todas las consultas en un plazo de 2 días hábiles.',
  'Para asuntos urgentes, incluya "URGENTE" en el asunto de su correo.',
  'Las consultas sobre asociaciones con abogados pueden tardar de 3 a 5 días hábiles para una respuesta completa.',
  'No podemos proporcionar asesoramiento legal ni evaluaciones de casos por correo electrónico.',
]

export default function ContactoPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contacto' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Contáctenos
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Contacto — AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Somos un equipo pequeño. Leemos cada mensaje y respondemos en un plazo de 2 días hábiles.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">

          {/* Contact topics */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-6">Cómo Contactarnos</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {CONTACT_TOPICS.map((topic) => (
                <div
                  key={topic.title}
                  className="rounded-xl border border-neutral-100 p-5 hover:border-primary-200 transition-colors"
                >
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">{topic.title}</p>
                  <p className="font-sans text-neutral-500 text-xs leading-relaxed mb-3">{topic.description}</p>
                  <a
                    href={`mailto:${topic.email}`}
                    className="font-sans text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {topic.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Response time */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8">
            <h2 className="font-sans font-bold text-lg text-neutral-950 mb-3">Qué Esperar</h2>
            <ul className="space-y-3">
              {EXPECTATIONS.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" aria-hidden="true" />
                  <p className="font-sans text-neutral-600 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* If you need legal help */}
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center">
            <p className="font-sans font-semibold text-primary-900 text-sm mb-2">
              ¿Necesita ayuda después de un accidente?
            </p>
            <p className="font-sans text-primary-700 text-sm leading-relaxed mb-4">
              Si busca orientación sobre su accidente — y no una pregunta general sobre AccidentPath
              — nuestras guías y herramientas son el mejor punto de partida.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/es/guias"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                Ver Guías <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/es/herramientas"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Usar Herramientas Gratuitas <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
