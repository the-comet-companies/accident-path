import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Thank You — AccidentPath',
  description: 'Your intake has been submitted. View your personalized next steps and resources.',
  canonical: '/find-help/thank-you',
  noIndex: true,
})

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Get Help', href: '/find-help' },
              { label: 'Thank You' },
            ]}
            variant="dark"
          />
          <div className="flex items-center gap-2 text-success-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span aria-hidden="true">✓</span> Submitted
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            We&apos;ve Received Your Information
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Your personalized results are ready. If you provided an email address, you&apos;ll receive a copy shortly.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <span className="text-success-500 text-2xl font-bold">✓</span>
          </div>
          <h2 className="font-sans font-bold text-xl text-neutral-950 mb-2">
            What Happens Next?
          </h2>
          <ul className="text-sm text-neutral-600 font-sans leading-relaxed text-left mt-4 flex flex-col gap-3">
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              View your personalized results and recommended resources below.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Explore free tools to document your evidence, track medical bills, and prepare for insurance calls.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              Read guides tailored to your accident type and situation.
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0 mt-0.5" aria-hidden="true">→</span>
              When ready, contact us to learn what types of attorneys typically handle cases like yours.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/find-help/results"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            View My Results <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
          <Link
            href="/tools"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary-500 text-primary-600 font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-50 transition-colors"
          >
            Explore Free Tools
          </Link>
        </div>

        <DisclaimerBanner variant="intake" />
      </div>
    </div>
  )
}
