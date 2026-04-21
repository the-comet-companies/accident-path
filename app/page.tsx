import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Car,
  Truck,
  Bike,
  AlertTriangle,
  Briefcase,
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
import { CTAButton } from '@/components/ui/CTAButton'
import { StateSelector } from '@/components/ui/StateSelector'
import { AccidentCard } from '@/components/content/AccidentCard'
import { ToolCard } from '@/components/content/ToolCard'
import { buildMetaTags } from '@/components/seo/MetaTags'
import { HomeAnimations } from '@/components/home/HomeAnimations'
import { HeroVisual } from '@/components/home/HeroVisual'

export const metadata: Metadata = buildMetaTags({
  title: 'AccidentPath — Get Clear Next Steps After an Accident',
  description:
    'Accident guidance for California and Arizona. Learn what to do, what evidence to keep, and whether speaking with a lawyer could help. Free, no obligation.',
  canonical: '/',
})

// ─── Static featured data ────────────────────────────────────────────────────

const FEATURED_ACCIDENTS = [
  {
    slug: 'car',
    title: 'Car Accidents',
    description:
      'Learn what steps to take, what to document, and what your options may be after a car accident.',
    icon: <Car className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'truck',
    title: 'Truck Accidents',
    description:
      'Commercial truck crashes involve multiple parties. Learn how these cases differ from standard car accidents.',
    icon: <Truck className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'motorcycle',
    title: 'Motorcycle Accidents',
    description:
      'Motorcyclists face unique risks and legal considerations. Understand your options after a crash.',
    icon: <Bike className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'slip-and-fall',
    title: 'Slip & Fall',
    description:
      'Premises liability cases hinge on evidence. Learn what to document and when to act.',
    icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'workplace',
    title: 'Workplace Injuries',
    description:
      "Workers' comp and third-party claims have different rules. Understand your options.",
    icon: <Briefcase className="w-5 h-5" aria-hidden="true" />,
  },
]

const FEATURED_TOOLS = [
  {
    slug: 'statute-of-limitations',
    title: 'Statute of Limitations Calculator',
    description:
      'Understand the filing deadlines that may apply to your accident type in California or Arizona.',
    icon: <Calculator className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'evidence-checklist',
    title: 'Evidence Checklist Generator',
    description:
      'Get a personalized checklist of evidence to gather based on your specific accident type.',
    icon: <ClipboardList className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'medical-cost-estimator',
    title: 'Medical Cost Estimator',
    description:
      'Understand the range of typical medical costs associated with common injury types.',
    icon: <DollarSign className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'insurance-claim-tracker',
    title: 'Insurance Claim Tracker',
    description:
      'Track your claim status, deadlines, and communications with your insurance company.',
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
  },
  {
    slug: 'injury-journal',
    title: 'Injury Journal',
    description:
      'Document your symptoms, treatments, and daily impact. Detailed records can matter in your recovery.',
    icon: <BookOpen className="w-5 h-5" aria-hidden="true" />,
  },
]

const FEATURED_GUIDES = [
  {
    title: 'What to Do in the First 24 Hours After an Accident',
    excerpt:
      'The steps you take immediately after an accident can significantly impact your ability to document what happened. This guide walks you through each critical action.',
    href: '/guides/what-to-do-first-24-hours',
    readTime: '8 min read',
  },
  {
    title: 'How to Document Your Injuries After an Accident',
    excerpt:
      'Thorough documentation supports your medical care and may be important if you decide to explore legal options. Learn what to record and how.',
    href: '/guides/how-to-document-injuries',
    readTime: '6 min read',
  },
  {
    title: 'Understanding When to Speak With a Personal Injury Lawyer',
    excerpt:
      'Not every accident requires legal help, but some situations benefit from a consultation. This guide helps you understand the questions to ask.',
    href: '/guides/when-to-speak-with-a-lawyer',
    readTime: '7 min read',
  },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: <Search className="w-6 h-6" aria-hidden="true" />,
    title: 'Tell Us What Happened',
    description:
      'Answer a few questions about your accident type, when it happened, and where. Takes about 2 minutes.',
  },
  {
    step: 2,
    icon: <CheckCircle className="w-6 h-6" aria-hidden="true" />,
    title: 'Get Personalized Guidance',
    description:
      'Receive a clear checklist of next steps, key deadlines to know about, and educational resources specific to your situation.',
  },
  {
    step: 3,
    icon: <Users className="w-6 h-6" aria-hidden="true" />,
    title: 'Connect With Help if Needed',
    description:
      "If you'd like to speak with a lawyer experienced in your situation, we can help connect you. No pressure, no obligation.",
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <HomeAnimations />

      {/* ── 1. Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white relative overflow-hidden" aria-labelledby="hero-heading">
        <HeroVisual />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy + CTAs */}
            <div>
              <p
                data-animate="hero-eyebrow"
                className="text-primary-300 text-sm font-medium uppercase tracking-wider mb-4 font-sans"
              >
                Free guidance — no obligation
              </p>
              <h1
                id="hero-heading"
                className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6"
              >
                Get Clear Next Steps After an Accident
              </h1>
              <p
                data-animate="hero-body"
                className="font-serif text-lg sm:text-xl text-primary-100 leading-relaxed mb-8"
              >
                Learn what to do, what evidence to keep, and whether speaking with a lawyer could
                help. Educational guidance for California and Arizona.
              </p>
              <div data-animate="hero-ctas" className="flex flex-row flex-wrap gap-3">
                <CTAButton href="/find-help" size="md" className="whitespace-nowrap shadow-[0_4px_20px_rgba(40,145,199,0.4)]">
                  Start Free Accident Check
                </CTAButton>
                <CTAButton
                  href="/guides"
                  size="md"
                  variant="secondary"
                  className="whitespace-nowrap border border-white/25 text-white/80 hover:bg-white/10 hover:border-white/40"
                >
                  Explore Accident Guides
                </CTAButton>
              </div>
              <p className="mt-5 text-xs text-primary-300 font-serif italic">
                This information is for educational purposes only and does not constitute legal
                advice.
              </p>
            </div>

            {/* Right: spacer — HeroVisual renders the shield absolutely */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── 2. Trust Row ──────────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white border-t border-white/[0.08]" aria-label="Trust indicators">
        <div className="flex flex-col lg:flex-row">

          {/* Left panel — brand statement */}
          <div
            data-animate="trust-left"
            className="lg:w-[28%] shrink-0 flex flex-col justify-center gap-4 px-8 lg:px-10 py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/[0.08]"
          >
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans">
              <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
              Why AccidentPath
            </div>
            <h2 className="font-sans font-bold text-xl lg:text-2xl text-white leading-tight tracking-tight">
              Your path to recovery starts here.
            </h2>
            <p className="font-serif italic text-sm text-white/45 leading-relaxed">
              Clear guidance, smart next steps, and help finding the right lawyer if you need one.
            </p>
            <Link
              href="/find-help"
              className="inline-flex items-center gap-2 text-primary-300 hover:text-white transition-colors text-sm font-semibold font-sans group w-fit"
            >
              Start Free Accident Check
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Right panel — 4 trust columns */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Shield,     title: 'Attorney-Reviewed Content', sub: 'Reviewed for accuracy and compliance' },
              { Icon: Lock,       title: 'Secure & Private',          sub: 'Your information stays with you'      },
              { Icon: Clock,      title: 'Free — No Obligation',      sub: 'No pressure, no signup required'      },
              { Icon: BadgeCheck, title: 'California & Arizona',      sub: 'State-specific guidance'              },
            ].map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                data-animate="trust-item"
                className={[
                  'flex flex-col items-center text-center gap-4 px-6 py-12 lg:py-16',
                  i < 3 ? `border-r border-white/[0.07]${i === 1 ? ' max-lg:border-r-0' : ''}` : '',
                  i < 2 ? 'border-b lg:border-b-0 border-white/[0.07]' : '',
                ].filter(Boolean).join(' ')}
              >
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
        className="bg-surface-page py-16 lg:py-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="how-it-works-heading"
              className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-3"
            >
              How AccidentPath Works
            </h2>
            <p className="font-serif text-neutral-500 text-lg max-w-xl mx-auto">
              Three simple steps to go from confusion to clarity after an accident.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ step, icon, title, description }) => (
              <div
                key={step}
                data-animate="step-item"
                className="flex flex-col items-center text-center md:items-start md:text-left gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold font-sans flex items-center justify-center shrink-0">
                    {step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center">
                    {icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-lg text-neutral-950 mb-2">
                    {title}
                  </h3>
                  <p className="font-serif text-neutral-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CTAButton href="/find-help" size="lg">
              Start Your Free Accident Check
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── 4. Accident Type Grid ─────────────────────────────────────────── */}
      <section
        className="bg-surface-card py-16 lg:py-24"
        aria-labelledby="accident-types-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2
                id="accident-types-heading"
                className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-2"
              >
                Accident Type Guides
              </h2>
              <p className="font-serif text-neutral-500 text-lg">
                In-depth educational resources for the most common accident types.
              </p>
            </div>
            <Link
              href="/accidents"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all accident types
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_ACCIDENTS.map((accident) => (
              <div key={accident.slug} data-animate="accident-card">
                <AccidentCard
                  title={accident.title}
                  description={accident.description}
                  href={`/accidents/${accident.slug}`}
                  icon={accident.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Featured Tools ─────────────────────────────────────────────── */}
      <section className="bg-surface-info py-16 lg:py-24" aria-labelledby="tools-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2
                id="tools-heading"
                className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-2"
              >
                Featured Tools
              </h2>
              <p className="font-serif text-neutral-500 text-lg max-w-lg">
                Interactive tools to help you understand your situation. For informational purposes
                only — not legal advice.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all tools
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_TOOLS.map((tool) => (
              <div key={tool.slug} data-animate="tool-card">
                <ToolCard
                  title={tool.title}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  icon={tool.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Educational Content Teaser ─────────────────────────────────── */}
      <section className="bg-surface-card py-16 lg:py-24" aria-labelledby="guides-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2
                id="guides-heading"
                className="font-sans font-semibold text-3xl lg:text-4xl text-neutral-950 mb-2"
              >
                Step-by-Step Accident Guides
              </h2>
              <p className="font-serif text-neutral-500 text-lg">
                Educational content reviewed for accuracy by legal professionals.
              </p>
            </div>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0 min-h-[44px] sm:min-h-0"
            >
              View all guides
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                data-animate="guide-card"
                className="group flex flex-col gap-3 rounded-xl bg-surface-page border border-neutral-100 p-6 hover:bg-primary-50 hover:border-primary-100 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium font-sans text-primary-600 bg-primary-50 group-hover:bg-white px-2.5 py-1 rounded-full transition-colors">
                    {guide.readTime}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-base text-neutral-950 leading-snug mb-2">
                    {guide.title}
                  </h3>
                  <p className="font-serif text-sm text-neutral-500 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. State Selector ─────────────────────────────────────────────── */}
      <section
        className="bg-primary-50 py-16 lg:py-20"
        aria-labelledby="state-selector-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="state-section" className="max-w-xl mx-auto text-center">
            <h2
              id="state-selector-heading"
              className="font-sans font-semibold text-3xl text-neutral-950 mb-3"
            >
              Find Resources in Your State
            </h2>
            <p className="font-serif text-neutral-500 text-lg mb-8">
              State-specific laws, deadlines, and guidance for California and Arizona.
            </p>
            <StateSelector navigateOnSelect className="max-w-md mx-auto" />
            <p className="mt-4 text-xs text-neutral-500 font-serif">
              Laws vary by state. The information provided is general in nature. Consult a licensed
              attorney in your state for specific guidance.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
