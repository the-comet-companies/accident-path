import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'How AccidentPath Works — Step-by-Step Guide',
  description:
    'AccidentPath walks you through your next steps after an accident: clear guidance, free tools, and optional attorney connections in California and Arizona.',
  canonical: '/about/how-it-works',
})

const STEPS = [
  {
    number: '01',
    title: 'Describe Your Situation',
    body: "Start by telling us about your accident type, location, and what has happened so far. There's no account required — your answers guide what we show you next. Everything is confidential and nothing you share is sold to third parties.",
    cta: { label: 'Browse guides', href: '/guides' },
  },
  {
    number: '02',
    title: 'Get Instant, Clear Guidance',
    body: "Based on your situation, we surface the most relevant guides and tools for your specific accident type and state. No 50-tab research session — just the information that matters for your situation right now.",
    cta: { label: 'See all guides', href: '/guides' },
  },
  {
    number: '03',
    title: 'Use Our Free Tools',
    body: 'Our interactive tools help you take concrete action: collect evidence, estimate lost wages, check your statute of limitations deadline, prepare for insurance calls, and document your injuries and treatment. Free, no login required.',
    cta: { label: 'See all tools', href: '/tools' },
  },
  {
    number: '04',
    title: 'Connect With a Qualified Attorney (If You Want To)',
    body: "If your situation may benefit from legal help, we can connect you with attorneys who typically handle matters like yours in your state. This is optional — we'll never pressure you. And we'll always tell you what type of attorney to look for, even if you'd rather find one on your own.",
    cta: { label: 'Get free guidance', href: '/find-help' },
  },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'About', href: '/about' }, { label: 'How It Works' }]}
            variant="dark"
          />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            The Process
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            How AccidentPath Works
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Four steps from &ldquo;I just had an accident&rdquo; to &ldquo;I know what to do next.&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-10"
            >
              <div className="flex gap-6 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center">
                  <span className="font-sans font-bold text-amber-400 text-sm">{step.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-sans font-bold text-xl text-neutral-950 mb-3">{step.title}</h2>
                  <p className="font-sans text-neutral-600 leading-relaxed mb-4">{step.body}</p>
                  <Link
                    href={step.cta.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {step.cta.label} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface-card rounded-2xl border border-neutral-100 p-8 text-center">
          <p className="font-sans text-neutral-500 text-sm mb-5 max-w-lg mx-auto">
            This information is for educational purposes only and does not constitute legal advice.
            Use of AccidentPath does not create an attorney-client relationship.
          </p>
          <Link
            href="/find-help"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-sans font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Get Free Guidance →
          </Link>
        </div>
      </div>
    </div>
  )
}
