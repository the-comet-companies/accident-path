import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { IntakeWizard } from '@/components/intake/IntakeWizard'
import { IntakeInitializer } from '@/components/intake/IntakeInitializer'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Get Free Accident Guidance — AccidentPath',
  description:
    'Answer a few questions about your accident to get personalized next steps, understand what type of lawyer may help, and find resources — free, no obligation.',
  canonical: '/find-help',
})

export default async function FindHelpPage({
  searchParams,
}: {
  searchParams: Promise<{ accidentType?: string; state?: string }>
}) {
  const { accidentType, state } = await searchParams
  return (
    <div className="min-h-screen bg-surface-page">
      <IntakeInitializer
        accidentType={accidentType}
        state={state}
      />
      {/* Hero */}
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Get Help' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Free Guidance
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Let&apos;s Find Your Next Steps
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Answer 9 quick questions about your accident and we&apos;ll give you personalized guidance — free, no obligation.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-success-500">
            <span aria-hidden="true">✓</span> No account required
          </div>
        </div>
      </div>

      {/* Wizard card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <IntakeWizard />
        </div>
        <div className="mt-6">
          <DisclaimerBanner variant="intake" />
        </div>
      </div>
    </div>
  )
}
