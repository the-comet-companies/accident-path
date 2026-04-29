import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Terms of Service — AccidentPath',
  description:
    'AccidentPath terms of service: the rules and conditions that govern your use of our accident guidance platform and educational tools.',
  canonical: '/terms',
  noIndex: true,
})

const LAST_UPDATED = 'April 2026'

const SECTIONS = [
  {
    id: 'acceptance',
    heading: '1. Acceptance of Terms',
    placeholder:
      'State that by accessing or using AccidentPath, users agree to be bound by these Terms of Service. Include that users who do not agree should not use the service. Specify the effective date and that continued use after updates constitutes acceptance.',
  },
  {
    id: 'description-of-services',
    heading: '2. Description of Services',
    placeholder:
      'Describe AccidentPath as an educational platform and legal referral service. Clarify that we provide general information, interactive tools, and optional referrals to attorneys — and that none of this constitutes legal advice or creates an attorney-client relationship.',
  },
  {
    id: 'no-attorney-client',
    heading: '3. No Attorney-Client Relationship',
    placeholder:
      "Explicitly state that use of AccidentPath does not create an attorney-client relationship between the user and AccidentPath or any attorney listed on the platform. Clarify that information provided is educational only and not a substitute for advice from a licensed attorney familiar with the user's specific facts and jurisdiction.",
  },
  {
    id: 'user-conduct',
    heading: '4. Acceptable Use',
    placeholder:
      'Describe prohibited uses: providing false information, using the platform to harass or harm others, attempting to reverse engineer or scrape the platform, using the service for commercial purposes without authorization, violating any applicable law.',
  },
  {
    id: 'disclaimer-of-warranties',
    heading: '5. Disclaimer of Warranties',
    placeholder:
      'Include a clear disclaimer that the service is provided "as is" and "as available" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose. State that AccidentPath does not warrant that the service will be uninterrupted or error-free.',
  },
  {
    id: 'limitation-of-liability',
    heading: '6. Limitation of Liability',
    placeholder:
      "Set forth the limitation on AccidentPath's liability for damages arising out of use of the service. Include cap on liability, exclusion of consequential damages, and any exceptions required by state law. Confirm compliance with California and Arizona consumer protection laws.",
  },
  {
    id: 'third-party-links',
    heading: '7. Third-Party Links and Services',
    placeholder:
      'Clarify that AccidentPath may link to or display information from third-party websites or services. State that AccidentPath is not responsible for third-party content, privacy practices, or services, and that users access them at their own risk.',
  },
  {
    id: 'intellectual-property',
    heading: '8. Intellectual Property',
    placeholder:
      'State that all content, design, trademarks, and code on AccidentPath are owned by or licensed to AccidentPath. Describe permitted uses (personal, non-commercial) and prohibited uses (reproduction, modification, distribution without permission).',
  },
  {
    id: 'termination',
    heading: '9. Termination',
    placeholder:
      "State AccidentPath's right to suspend or terminate access for violation of these terms or at its discretion, without prior notice. Describe what happens to user data upon termination.",
  },
  {
    id: 'governing-law',
    heading: '10. Governing Law and Disputes',
    placeholder:
      'Specify governing law (California), venue for disputes, and any mandatory arbitration or class action waiver provisions. Confirm compliance with applicable consumer protection requirements. Include notice requirements before filing a claim.',
  },
  {
    id: 'changes',
    heading: '11. Changes to These Terms',
    placeholder:
      'Describe how and when terms may be updated. State that material changes will be indicated by an updated date. Specify that continued use after changes constitutes acceptance.',
  },
  {
    id: 'contact',
    heading: '12. Contact',
    placeholder:
      'Provide contact information for questions about these Terms: email address, mailing address. Include response timeframe.',
  },
]

export default function TermsPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Terms of Service' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Terms of Service
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            The rules and conditions that govern your use of AccidentPath.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12">

            <p className="font-sans text-neutral-400 text-sm mb-8">
              Last updated: {LAST_UPDATED}
            </p>

            <p className="font-sans text-neutral-600 leading-relaxed mb-10">
              Please read these Terms of Service carefully before using AccidentPath. By accessing or
              using our platform, you agree to be bound by these terms. If you do not agree, please
              do not use AccidentPath.
            </p>

            <nav aria-label="Terms of service sections" className="mb-10">
              <p className="font-sans font-semibold text-sm text-neutral-950 mb-3">Contents</p>
              <ol className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="font-sans text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-10">
              {SECTIONS.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
                  {index > 0 && <hr className="border-neutral-100 mb-10" />}
                  <h2
                    id={`heading-${section.id}`}
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    {section.heading}
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <p className="font-sans text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
                      Pending Legal Review
                    </p>
                    <p className="font-sans text-sm text-amber-800 leading-relaxed">
                      {section.placeholder}
                    </p>
                  </div>
                </section>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
