import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Privacy Policy — AccidentPath',
  description:
    'AccidentPath privacy policy: how we collect, use, and protect your personal information when you use our accident guidance platform.',
  canonical: '/privacy',
  noIndex: true,
})

const LAST_UPDATED = 'April 2026'

const SECTIONS = [
  {
    id: 'information-we-collect',
    heading: '1. Information We Collect',
    placeholder:
      'Describe the categories of personal information collected: identifiers (name, email, IP address), usage data (pages visited, tool inputs), device/browser information, and any information submitted through forms or tools. Specify which is collected automatically vs. provided by the user.',
  },
  {
    id: 'how-we-use-information',
    heading: '2. How We Use Your Information',
    placeholder:
      'Describe all purposes for which collected data is used: providing the service, improving the platform, attorney referral matching, analytics, compliance with law, fraud prevention. Specify legal basis for processing where required (e.g., CCPA, CPRA).',
  },
  {
    id: 'sharing-information',
    heading: '3. Sharing Your Information',
    placeholder:
      'List all third parties with whom data is shared: attorney partners (for referral matching), analytics providers (Google Analytics, Microsoft Clarity), hosting providers (Vercel, Supabase), and any others. Clarify that data is not sold to third parties for advertising.',
  },
  {
    id: 'cookies',
    heading: '4. Cookies and Tracking Technologies',
    placeholder:
      'Describe use of cookies, local storage, session storage, pixels, and similar technologies. Include categories: strictly necessary, analytics, functional. Describe opt-out mechanisms available to users.',
  },
  {
    id: 'data-retention',
    heading: '5. Data Retention',
    placeholder:
      'Specify how long different categories of data are retained: session data, form submissions, analytics data, attorney referral records. Include criteria used to determine retention period.',
  },
  {
    id: 'your-rights',
    heading: '6. Your Privacy Rights',
    placeholder:
      'Describe rights available to users under applicable law: CCPA/CPRA (California residents) — right to know, delete, correct, opt out of sale/sharing; COPPA (children under 13); general rights. Include how to submit a privacy request and expected response timeline.',
  },
  {
    id: 'security',
    heading: '7. Security',
    placeholder:
      'Describe technical and organizational measures used to protect personal information. Note that no method of transmission is 100% secure and how users should report suspected security issues.',
  },
  {
    id: 'third-party-links',
    heading: '8. Third-Party Links',
    placeholder:
      'Clarify that AccidentPath may link to external sites not covered by this policy and that users should review the privacy policies of those sites.',
  },
  {
    id: 'changes',
    heading: '9. Changes to This Policy',
    placeholder:
      'Describe how users will be notified of material changes (e.g., updated date on this page, email notice). State that continued use after changes constitutes acceptance.',
  },
  {
    id: 'contact',
    heading: '10. Contact Us',
    placeholder:
      'Provide contact information for privacy inquiries: email address, mailing address, and any designated privacy officer contact. Include response timeframe.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Privacy Policy' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            How we collect, use, and protect your information.
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
              AccidentPath (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit accidentpath.com and use our services. Please read this policy carefully.
            </p>

            <nav aria-label="Privacy policy sections" className="mb-10">
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
