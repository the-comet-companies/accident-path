import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calculator,
  ClipboardList,
  DollarSign,
  FileText,
  BookOpen,
  CheckCircle,
  Search,
  Users,
  ChevronRight,
  Shield,
  Lock,
  Clock,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import { FaCar, FaTruck, FaMotorcycle, FaHardHat } from 'react-icons/fa'
import { FaPersonFalling } from 'react-icons/fa6'
import { CTAButton } from '@/components/ui/CTAButton'
import { PageLeadCaptureModal } from '@/components/ui/PageLeadCaptureModal'
import { StateSelector } from '@/components/ui/StateSelector'
import { LazyAnimations, LazyHeroVisual } from '@/components/home/LazyAnimations'

export const metadata: Metadata = {
  title: 'AccidentPath | Guía de Accidentes en California',
  description:
    'Orientación para accidentes en California y Arizona. Aprenda qué hacer, qué evidencia conservar y si hablar con un abogado podría ayudarle. Gratis, sin compromiso.',
  alternates: {
    canonical: '/es/',
    languages: {
      'en': '/',
      'es': '/es/',
      'x-default': '/',
    },
  },
}

// ─── Static featured data ────────────────────────────────────────────────────

const FEATURED_ACCIDENTS = [
  { slug: 'auto',        title: 'Accidentes de Auto'    },
  { slug: 'camion',      title: 'Accidentes de Camión'  },
  { slug: 'motocicleta', title: 'Motocicleta'            },
  { slug: 'caida',       title: 'Caídas'                },
  { slug: 'trabajo',     title: 'Lesiones de Trabajo'   },
]

const ACCIDENT_ICONS: Record<string, React.ReactNode> = {
  auto:        <FaCar           className="w-5 h-5" aria-hidden="true" />,
  camion:      <FaTruck         className="w-5 h-5" aria-hidden="true" />,
  motocicleta: <FaMotorcycle    className="w-5 h-5" aria-hidden="true" />,
  caida:       <FaPersonFalling className="w-5 h-5" aria-hidden="true" />,
  trabajo:     <FaHardHat       className="w-5 h-5" aria-hidden="true" />,
}

interface FeaturedTool {
  slug: string
  title: string
  description: string
}

const FEATURED_TOOLS: FeaturedTool[] = [
  { slug: 'statute-countdown',    title: 'Cuenta Regresiva del Plazo Legal',       description: 'Encuentre el plazo de presentación que puede aplicar a su tipo de accidente en California o Arizona.' },
  { slug: 'evidence-checklist',   title: 'Lista de Verificación de Evidencias',    description: 'Obtenga una lista personalizada de evidencias según su tipo específico de accidente.'               },
  { slug: 'lost-wages-estimator', title: 'Estimador de Salarios Perdidos',          description: 'Estime los ingresos que pudo haber perdido debido a su lesión y tiempo fuera del trabajo.'           },
  { slug: 'insurance-call-prep',  title: 'Preparación para Llamadas de Seguro',    description: 'Prepárese para llamadas con ajustadores de seguros — sepa qué decir y qué evitar.'                   },
  { slug: 'injury-journal',       title: 'Diario de Lesiones y Tratamiento',       description: 'Documente sus síntomas, tratamientos e impacto diario. Los registros detallados pueden importar.'    },
]

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'statute-countdown':    <Calculator    className="w-5 h-5" aria-hidden="true" />,
  'evidence-checklist':   <ClipboardList className="w-5 h-5" aria-hidden="true" />,
  'lost-wages-estimator': <DollarSign    className="w-5 h-5" aria-hidden="true" />,
  'insurance-call-prep':  <FileText      className="w-5 h-5" aria-hidden="true" />,
  'injury-journal':       <BookOpen      className="w-5 h-5" aria-hidden="true" />,
}

const FEATURED_GUIDES = [
  {
    title: 'Qué Hacer en las Primeras 24 Horas Después de un Accidente',
    excerpt:
      'Los pasos que tome inmediatamente después de un accidente pueden afectar significativamente su capacidad de documentar lo que ocurrió. Esta guía lo acompaña en cada acción crítica.',
    href: '/es/guias/despues-accidente-auto',
    readTime: '8 min',
  },
  {
    title: 'Cómo Documentar Sus Lesiones Después de un Accidente',
    excerpt:
      'La documentación exhaustiva respalda su atención médica y puede ser importante si decide explorar opciones legales. Aprenda qué registrar y cómo.',
    href: '/es/guias/lista-evidencia',
    readTime: '6 min',
  },
  {
    title: 'Cuándo Hablar con un Abogado de Lesiones Personales',
    excerpt:
      'No todos los accidentes requieren ayuda legal, pero algunas situaciones se benefician de una consulta. Esta guía le ayuda a entender qué preguntas hacer.',
    href: '/es/guias/contratar-abogado',
    readTime: '7 min',
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomeEs() {
  return (
    <>
      <LazyAnimations />

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white relative overflow-hidden" aria-labelledby="hero-heading">
        <LazyHeroVisual />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy + CTAs */}
            <div>
              <p
                data-animate="hero-eyebrow"
                className="animate-hero-eyebrow text-primary-300 text-sm font-medium uppercase tracking-wider mb-4 font-sans"
              >
                Orientación gratuita — sin compromiso
              </p>
              <h1
                id="hero-heading"
                className="animate-hero-heading font-sans font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6"
              >
                Obtenga Pasos Claros Después de un Accidente
              </h1>
              <p
                data-animate="hero-body"
                className="animate-hero-body font-serif text-lg sm:text-xl text-primary-100 leading-relaxed mb-8"
              >
                Aprenda qué hacer, qué evidencia conservar y si hablar con un abogado podría
                ayudarle. Orientación educativa para California y Arizona.
              </p>
              <div data-animate="hero-ctas" className="animate-hero-ctas flex flex-row flex-wrap gap-3">
                <CTAButton href="/es/buscar-ayuda" size="md" className="whitespace-nowrap shadow-[0_4px_20px_rgba(40,145,199,0.4)]">
                  Inicie Su Evaluación Gratis
                </CTAButton>
                <CTAButton
                  href="/es/guias"
                  size="md"
                  variant="secondary"
                  className="whitespace-nowrap border border-white/25 text-white/80 hover:bg-white/10 hover:border-white/40"
                >
                  Explorar Guías de Accidentes
                </CTAButton>
              </div>
              <p className="mt-5 text-xs text-primary-300 font-serif italic">
                Esta información es solo para fines educativos y no constituye asesoramiento legal.
              </p>
            </div>

            {/* Right: spacer — HeroVisual renders the shield absolutely */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── 2. Trust Row ──────────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white border-t border-white/[0.08]" aria-label="Indicadores de confianza">
        <div className="flex flex-col lg:flex-row">

          {/* Left panel — brand statement */}
          <div
            data-animate="trust-left"
            className="lg:w-[28%] shrink-0 flex flex-col justify-center gap-4 px-8 lg:px-10 py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/[0.08]"
          >
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Por Qué AccidentPath
            </div>
            <h2 className="font-sans font-bold text-xl lg:text-2xl text-white leading-tight tracking-tight">
              Su camino hacia la recuperación comienza aquí.
            </h2>
            <p className="font-serif italic text-sm text-white/45 leading-relaxed">
              Orientación clara, próximos pasos inteligentes y ayuda para encontrar el abogado
              adecuado si lo necesita.
            </p>
            <Link
              href="/es/buscar-ayuda"
              className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors text-sm font-semibold font-sans group w-fit"
            >
              Inicie Su Evaluación Gratis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right panel — 4 trust columns */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Shield,     title: 'Contenido Revisado por Abogados', sub: 'Revisado para precisión y cumplimiento' },
              { Icon: Lock,       title: 'Seguro y Privado',                sub: 'Su información permanece con usted'     },
              { Icon: Clock,      title: 'Gratis — Sin Compromiso',         sub: 'Sin presión, sin registro requerido'     },
              { Icon: BadgeCheck, title: 'California y Arizona',            sub: 'Orientación específica por estado'       },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                data-animate="trust-item"
                className={[
                  'relative flex flex-col items-center text-center gap-4 px-6 py-12 lg:py-16',
                  i < 2 ? 'border-b lg:border-b-0 border-white/[0.07]' : '',
                ].filter(Boolean).join(' ')}
              >
                {i < 3 && (
                  <span
                    aria-hidden="true"
                    className={[
                      'absolute right-0 top-[20%] h-[60%] w-px bg-white/[0.07]',
                      i === 1 ? 'max-lg:hidden' : '',
                    ].filter(Boolean).join(' ')}
                  />
                )}
                <div className="w-[52px] h-[52px] rounded-[14px] bg-amber-500/12 border border-amber-500/25 flex items-center justify-center shrink-0">
                  <Icon className="w-[22px] h-[22px] text-amber-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-white leading-snug mb-1">{title}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">{sub}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. How It Works ───────────────────────────────────────────────── */}
      <section
        className="text-white py-16 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #0C2D3E 0%, #0f3d55 50%, #1a5470 100%)' }}
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div data-animate="hiw-heading" className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-4">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Cómo Funciona
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h2
              id="how-it-works-heading"
              className="font-sans font-bold text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3"
            >
              Del Accidente a la Claridad en 3 Pasos
            </h2>
            <p className="font-serif italic text-base text-white/45 leading-relaxed max-w-xl mx-auto">
              Orientación clara, sin presión, sin compromiso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { step: 1, Icon: Search,      title: 'Cuéntenos Lo Que Pasó',            description: 'Responda algunas preguntas sobre el tipo de accidente, cuándo ocurrió y dónde. Toma unos 2 minutos.' },
              { step: 2, Icon: CheckCircle, title: 'Obtenga Orientación Personalizada', description: 'Reciba una lista clara de próximos pasos, plazos importantes y recursos educativos específicos para su situación.' },
              { step: 3, Icon: Users,       title: 'Conéctese Con Ayuda si lo Necesita', description: 'Si desea hablar con un abogado con experiencia en su situación, podemos ayudarle a conectarse. Sin presión, sin compromiso.' },
            ].map(({ step, Icon, title, description }, i) => (
              <div
                key={step}
                data-animate="step-item"
                className="relative flex flex-col items-center text-center px-6 py-8"
              >
                {i < 2 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-[18%] h-[64%] w-px bg-white/10 max-md:hidden"
                  />
                )}
                <div className="w-7 h-7 rounded-full bg-amber-500/[0.12] border border-amber-500/25 flex items-center justify-center shrink-0 mb-4">
                  <span className="text-amber-500 text-xs font-bold font-sans">{step}</span>
                </div>
                <div className="w-[58px] h-[58px] rounded-[16px] bg-white/[0.08] border border-white/[0.18] flex items-center justify-center shrink-0 mb-4">
                  <Icon className="w-[22px] h-[22px] text-white/80" aria-hidden="true" />
                </div>
                <h3 className="font-sans font-bold text-sm lg:text-base text-white leading-snug mb-2">
                  {title}
                </h3>
                <p className="font-serif italic text-sm text-white/[0.48] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center pt-8 border-t border-white/10">
            <Link
              href="/es/buscar-ayuda"
              className="inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold px-8 py-4 text-lg min-h-[52px] border border-white/25 text-white/80 bg-transparent hover:bg-white/10 hover:border-white/40 transition-colors duration-150"
            >
              Inicie Su Evaluación Gratuita
            </Link>
          </div>

        </div>
      </section>

      {/* ── 4. Accident Type Grid ─────────────────────────────────────────── */}
      <section
        className="py-16 lg:py-24"
        style={{ background: 'linear-gradient(180deg, #1a5470 0%, #1a5470 14%, #1f6b90 28%, #9dc9e2 50%, #d4eaf5 66%, #EAF6FB 80%, #f3f6f9 100%)' }}
        aria-labelledby="accident-types-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-4">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              ¿Qué Pasó?
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h2
              id="accident-types-heading"
              className="font-sans font-bold text-3xl lg:text-4xl text-white leading-tight tracking-tight mb-3"
            >
              Guías por Tipo de Accidente
            </h2>
            <p className="font-serif italic text-base text-white/45 leading-relaxed max-w-xl mx-auto">
              Recursos educativos detallados para los tipos de accidentes más comunes.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.13)] border border-white/60 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {FEATURED_ACCIDENTS.map((accident) => (
                <Link
                  key={accident.slug}
                  href={`/es/accidentes/${accident.slug}`}
                  data-animate="accident-card"
                  className="group flex flex-col items-center text-center gap-2 p-4 rounded-xl hover:bg-primary-50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 last:col-span-2 sm:last:col-span-1"
                >
                  <div className="w-11 h-11 rounded-[11px] bg-primary-50 group-hover:bg-white flex items-center justify-center text-primary-500 shrink-0 transition-colors duration-200">
                    {ACCIDENT_ICONS[accident.slug]}
                  </div>
                  <span className="font-sans font-semibold text-sm text-neutral-950 leading-snug">
                    {accident.title}
                  </span>
                  <span className="text-[10px] text-neutral-300 group-hover:text-primary-500 transition-colors duration-200" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link
              href="/es/accidentes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-700 hover:text-primary-800 transition-colors min-h-[44px] sm:min-h-0"
            >
              Ver los 13 tipos de accidentes
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <PageLeadCaptureModal
              triggerLabel="Obtener Guía Gratuita"
              headline="Recibe nuestra guía gratuita de recuperación"
              subtext="Aprende qué hacer, qué documentar y cuándo actuar."
              buttonLabel="Envíame la Guía"
              toolSlug="page-home-es"
              toolContext={{ source: 'home-es' }}
            />
          </div>

        </div>
      </section>

      {/* ── 5. Featured Tools ─────────────────────────────────────────────── */}
      <section className="bg-surface-info py-16 lg:py-24" aria-labelledby="tools-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
                Herramientas Gratuitas
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              </div>
              <h2
                id="tools-heading"
                className="font-sans font-bold text-3xl lg:text-4xl text-neutral-950 leading-tight tracking-tight"
              >
                Herramientas Interactivas para Accidentes
              </h2>
              <p className="font-serif italic text-sm text-neutral-500 mt-1">
                Solo para fines informativos — no constituyen asesoramiento legal.
              </p>
            </div>
            <Link
              href="/es/herramientas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              Ver todas las herramientas
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/es/herramientas/${tool.slug}`}
                data-animate="tool-card"
                className="group flex items-center gap-4 bg-white border border-primary-100 rounded-2xl px-5 py-4 hover:border-primary-200 hover:shadow-[0_4px_16px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div className="w-[46px] h-[46px] rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0 text-primary-500">
                  {TOOL_ICONS[tool.slug]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm text-neutral-950 leading-snug">
                    {tool.title}
                  </p>
                  <p className="font-serif italic text-xs text-neutral-500 leading-relaxed mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors whitespace-nowrap shrink-0">
                  Usar Gratis
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Educational Content Teaser ─────────────────────────────────── */}
      <section className="bg-surface-page py-16 lg:py-24" aria-labelledby="guides-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
                Guías Educativas
                <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              </div>
              <h2
                id="guides-heading"
                className="font-sans font-bold text-3xl lg:text-4xl text-neutral-950 leading-tight tracking-tight"
              >
                Guías Paso a Paso para Accidentes
              </h2>
              <p className="font-serif italic text-sm text-neutral-500 mt-1">
                Contenido educativo revisado por abogados — no constituye asesoramiento legal.
              </p>
            </div>
            <Link
              href="/es/guias"
              className="inline-flex items-center gap-1.5 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              Ver todas las guías
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                data-animate="guide-card"
                className="group flex flex-col bg-surface-card border border-neutral-100 rounded-xl overflow-hidden hover:border-primary-100 hover:shadow-[0_4px_20px_rgba(40,145,199,0.09)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div className="h-[3px] bg-gradient-to-r from-primary-500 to-primary-800 shrink-0" aria-hidden="true" />
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-semibold font-sans text-primary-600 bg-primary-50 rounded-full px-2.5 py-1">
                      {guide.readTime}
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <span className="text-success-500" aria-hidden="true">✓</span>
                      Revisado por abogados
                    </span>
                  </div>
                  <h3 className="font-sans font-semibold text-base text-neutral-950 leading-snug mb-2">
                    {guide.title}
                  </h3>
                  <p className="font-serif italic text-sm text-neutral-500 leading-relaxed flex-1">
                    {guide.excerpt}
                  </p>
                  <div className="pt-4 mt-4 border-t border-neutral-100">
                    <span className="text-sm font-semibold font-sans text-primary-600 group-hover:text-primary-700 transition-colors inline-flex items-center gap-1">
                      Leer guía
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. State Selector ─────────────────────────────────────────────── */}
      <section
        className="bg-surface-page py-16 lg:py-20"
        aria-labelledby="state-selector-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="state-section" className="max-w-lg mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Su Estado
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            </div>
            <h2
              id="state-selector-heading"
              className="font-sans font-bold text-3xl text-neutral-950 leading-tight tracking-tight mb-2"
            >
              Encuentre Recursos en Su Estado
            </h2>
            <p className="font-serif italic text-sm text-neutral-500 mb-8">
              Leyes, plazos y orientación específica para California y Arizona.
            </p>
            <StateSelector navigateOnSelect className="max-w-md mx-auto" />
            <p className="mt-4 text-xs text-neutral-500 font-serif italic">
              Las leyes varían según el estado. La información proporcionada es de carácter general.
              Consulte a un abogado con licencia en su estado para orientación específica.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
