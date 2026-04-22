import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Contact AccidentPath',
  description:
    'Get in touch with AccidentPath — general questions, attorney partnership inquiries, press, or feedback about our accident guidance platform.',
  canonical: '/contact',
})

const CONTACT_TOPICS = [
  {
    title: 'General Questions',
    email: 'hello@accidentpath.com',
    description: 'Questions about our guides, tools, or platform.',
  },
  {
    title: 'Attorney Partnerships',
    email: 'attorneys@accidentpath.com',
    description: 'Interested in joining our attorney network in CA or AZ.',
  },
  {
    title: 'Press & Media',
    email: 'press@accidentpath.com',
    description: 'Media inquiries, interview requests, or editorial questions.',
  },
  {
    title: 'Technical Issues',
    email: 'support@accidentpath.com',
    description: 'Something not working? Report a bug or broken link.',
  },
]

const EXPECTATIONS = [
  'We respond to all inquiries within 2 business days.',
  'For urgent matters, include "URGENT" in your subject line.',
  'Attorney partnership inquiries may take 3–5 business days for a full response.',
  'We cannot provide legal advice or case evaluations via email.',
]

export default function ContactPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Contact' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Get in Touch
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Contact AccidentPath
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            We&apos;re a small team. We read every message and respond within 2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-6">

          {/* Contact topics */}
          <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 p-8 lg:p-12">
            <h2 className="font-sans font-bold text-xl text-neutral-950 mb-6">How to Reach Us</h2>
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
            <h2 className="font-sans font-bold text-lg text-neutral-950 mb-3">What to Expect</h2>
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
              Need help after an accident?
            </p>
            <p className="font-sans text-primary-700 text-sm leading-relaxed mb-4">
              If you&apos;re looking for guidance about your accident — not a general question about AccidentPath
              — our guides and tools are the best place to start.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/guides"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 transition-colors"
              >
                Browse Guides <span aria-hidden="true">→</span>
              </a>
              <a
                href="/tools"
                className="inline-flex items-center gap-1 text-sm font-semibold font-sans text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Use Free Tools <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
