import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Attorney Partnerships — AccidentPath',
  description:
    'Partner with AccidentPath to connect with pre-screened accident and injury leads in California and Arizona. Consumer-first platform, qualified referrals.',
  canonical: '/for-attorneys',
})

const BENEFITS = [
  {
    title: 'Qualified, Pre-Educated Leads',
    body: 'People who reach the referral stage on AccidentPath have already read relevant guides, used our tools, and understand what type of help they need. They arrive informed — not cold.',
  },
  {
    title: 'California & Arizona Focus',
    body: 'We serve only the markets you operate in. No out-of-jurisdiction leads, no broad national spray. Every referral is for an accident in a state we actively cover.',
  },
  {
    title: 'Consumer-First Platform',
    body: "Our brand is built on trust with injured people — not attorney advertising. That trust transfers. Users who come from AccidentPath aren't just leads, they're people who chose to ask for help.",
  },
  {
    title: 'Transparent Matching',
    body: 'We tell users what type of attorney to look for based on their situation — not which specific firm. Referrals happen through an honest matching process, not a ranking auction.',
  },
  {
    title: 'Compliance-First Infrastructure',
    body: 'AccidentPath is built around California State Bar rules and legal advertising standards. We work with counsel to ensure every referral interaction is properly structured.',
  },
]

const PRACTICE_AREAS = [
  'Car Accidents', 'Truck & Commercial Vehicle Accidents', 'Motorcycle Accidents',
  'Slip & Fall / Premises Liability', 'Pedestrian Accidents', 'Bicycle Accidents',
  'Rideshare Accidents', 'Workplace Injuries', 'Traumatic Brain Injury',
  'Spinal Cord Injury', 'Wrongful Death',
]

export default function ForAttorneysPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'For Attorneys' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Attorney Partnerships
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Partner With AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Connect with injured people who are actively seeking help — in California and Arizona.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">

          {/* Intro */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Who We Connect You With</h2>
            <p className="font-sans text-neutral-600 leading-relaxed mb-4">
              AccidentPath guides injured people through the confusion following an accident —
              evidence collection, insurance communication, understanding their rights. By the time
              someone reaches our referral step, they know what happened, what they&apos;ve done so far,
              and what kind of legal help they may need.
            </p>
            <p className="font-sans text-neutral-600 leading-relaxed">
              We work with personal injury attorneys in California and Arizona who handle the practice
              areas our users most commonly need help with.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-6">Why AccidentPath</h2>
            <ul className="space-y-6">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-sans font-semibold text-neutral-950 mb-1">{benefit.title}</p>
                    <p className="font-sans text-neutral-600 text-sm leading-relaxed">{benefit.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice areas */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-4">Practice Areas We Cover</h2>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_AREAS.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold font-sans border border-primary-100"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-900 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="font-sans font-bold text-2xl text-white mb-3">Interested in Partnering?</h2>
            <p className="font-serif italic text-primary-200 max-w-lg mx-auto mb-6 leading-relaxed">
              We&apos;re currently building our attorney network in California and Arizona.
              Reach out to discuss partnership options, compliance structure, and how referrals work.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-primary-950 font-sans font-semibold text-sm px-7 py-3.5 rounded-xl transition-colors"
            >
              Get in Touch <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-4 font-sans text-primary-400 text-xs">
              Or email us directly at{' '}
              <a
                href="mailto:attorneys@accidentpath.com"
                className="text-primary-300 hover:text-white underline transition-colors"
              >
                attorneys@accidentpath.com
              </a>
            </p>
          </div>

          {/* Disclaimer */}
          <p className="font-sans text-neutral-400 text-xs text-center leading-relaxed px-4">
            AccidentPath is an educational platform and lead generation service. Attorney partnerships
            are structured to comply with California State Bar rules and applicable legal advertising
            standards. Partnership details provided upon inquiry.
          </p>

        </div>
      </div>
    </div>
  )
}
