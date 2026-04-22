import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'About AccidentPath — Our Mission',
  description:
    'AccidentPath helps accident victims in California and Arizona get clear guidance, understand their options, and connect with qualified attorneys.',
  canonical: '/about',
})

const VALUES = [
  {
    title: 'Educational first.',
    body: 'Every guide, tool, and resource is designed to inform — not to push you toward a decision. You decide what to do with the information.',
  },
  {
    title: 'Compliance always.',
    body: 'We follow California State Bar rules and legal advertising standards. Our content is reviewed for accuracy and compliance before publication.',
  },
  {
    title: 'No pressure.',
    body: "We don't use urgency tactics or fear to drive action. If connecting with an attorney makes sense for your situation, we'll help. If not, we'll tell you that too.",
  },
  {
    title: 'Built for clarity.',
    body: 'We write in plain English. We define terms when we use them. We design every page to be useful on a phone, in a stressful moment.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'About' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Our Mission
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            About AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Clear guidance after an accident — for people who need answers, not jargon.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-10">

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">What We Do</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath is a consumer-first guidance platform for people who have been injured in accidents
                in California and Arizona. We provide plain-language educational resources, interactive tools,
                and referrals to qualified attorneys — without legal jargon, without pressure, and without
                pretending we know the outcome of your case.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Why We Built This</h2>
              <p className="font-sans text-neutral-600 leading-relaxed mb-4">
                After an accident, most people don&apos;t know what to do next. They&apos;re overwhelmed, in pain,
                and dealing with insurance adjusters who know far more than they do. The information that
                exists online is scattered, difficult to trust, and often written for lawyers rather than the
                people who actually need it.
              </p>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath was built to change that. We believe that clear, honest information — delivered
                at the right moment — leads to better decisions and better outcomes for injured people.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Our Approach</h2>
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
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Who We Serve</h2>
              <p className="font-sans text-neutral-600 leading-relaxed">
                AccidentPath currently serves injured people in California and Arizona. Our guides, tools,
                and attorney referrals are specific to these states. We are expanding to additional states
                and will update our coverage as we do.
              </p>
            </section>

            <hr className="border-neutral-100" />

            <section>
              <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Important Notice</h2>
              <p className="font-sans text-neutral-500 text-sm leading-relaxed">
                AccidentPath is an educational platform and legal referral service. Nothing on this site
                constitutes legal advice or creates an attorney-client relationship. The information provided
                is for general educational purposes only. Laws vary by jurisdiction and individual
                circumstances. Always consult a qualified attorney for advice specific to your situation.
              </p>
            </section>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/about/how-it-works"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                How AccidentPath Works <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
