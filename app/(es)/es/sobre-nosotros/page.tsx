import Link from 'next/link'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/layout/Breadcrumb'

export const metadata: Metadata = {
  title: 'Sobre AccidentPath — Nuestra Misión',
  description:
    'AccidentPath ayuda a víctimas de accidentes en California y Arizona a obtener orientación clara, entender sus opciones y conectarse con abogados calificados.',
  other: { google: 'notranslate' },
  alternates: {
    canonical: 'https://accidentpath.com/es/sobre-nosotros',
    languages: {
      en: '/about',
      es: '/es/sobre-nosotros',
      'x-default': '/about',
    },
  },
}

const VALUES = [
  {
    title: 'Lo educativo primero.',
    body: 'Cada guía, herramienta y recurso está diseñado para informar, no para empujarle hacia una decisión. Usted decide qué hacer con la información.',
  },
  {
    title: 'Cumplimiento siempre.',
    body: 'Seguimos las normas del Colegio de Abogados de California y los estándares de publicidad legal. Nuestro contenido se revisa para garantizar su exactitud y cumplimiento antes de publicarse.',
  },
  {
    title: 'Sin presión.',
    body: 'No utilizamos tácticas de urgencia ni miedo para motivar acciones. Si conectarse con un abogado tiene sentido para su situación, le ayudaremos. Si no, también se lo diremos.',
  },
  {
    title: 'Diseñado para la claridad.',
    body: 'Escribimos en un lenguaje sencillo. Definimos los términos cuando los usamos. Diseñamos cada página para que sea útil en un teléfono, en un momento de estrés.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Sobre Nosotros' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Nuestra Misión
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Sobre AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Orientación clara después de un accidente — para personas que necesitan respuestas, no tecnicismos.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-10">

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Qué Hacemos</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath es una plataforma de orientación para personas que han resultado lesionadas en
                accidentes en California y Arizona. Ofrecemos recursos educativos en lenguaje sencillo,
                herramientas interactivas y referencias a abogados calificados — sin tecnicismos legales,
                sin presión y sin pretender que conocemos el resultado de su caso.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Por Qué Lo Construimos</h2>
              <p className="font-sans text-neutral-600 leading-relaxed mb-4">
                Después de un accidente, la mayoría de las personas no saben qué hacer a continuación. Están
                abrumadas, con dolor y lidiando con ajustadores de seguros que saben mucho más que ellas. La
                información disponible en internet está dispersa, es difícil de confiar y con frecuencia está
                escrita para abogados, no para las personas que realmente la necesitan.
              </p>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath fue creado para cambiar eso. Creemos que la información clara y honesta —
                entregada en el momento adecuado — conduce a mejores decisiones y mejores resultados para
                las personas lesionadas.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Nuestro Enfoque</h2>
              <ul className="space-y-4">
                {VALUES.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-sans text-neutral-600 leading-relaxed">
                      <span className="font-semibold text-neutral-950">{item.title}</span>{' '}
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">A Quiénes Servimos</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath atiende actualmente a personas lesionadas en California y Arizona. Nuestras
                guías, herramientas y referencias de abogados son específicas para estos estados. Estamos
                expandiéndonos a estados adicionales y actualizaremos nuestra cobertura a medida que lo hagamos.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Aviso Importante</h2>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                AccidentPath es una plataforma educativa y servicio de referencia legal. Nada en este sitio
                constituye asesoramiento legal ni crea una relación abogado-cliente. La información
                proporcionada es únicamente para fines educativos generales. Las leyes varían según la
                jurisdicción y las circunstancias individuales. Siempre consulte a un abogado calificado
                para obtener asesoramiento específico a su situación.
              </p>
            </section>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/about/how-it-works"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                Cómo Funciona AccidentPath <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/es/contacto"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Contáctenos <span aria-hidden="true">→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
