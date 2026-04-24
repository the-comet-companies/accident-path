import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Cookie Policy — AccidentPath',
  description:
    'AccidentPath cookie policy: how we use cookies and similar tracking technologies on our platform.',
  canonical: '/cookie-policy',
  noIndex: true,
})

const LAST_UPDATED = 'April 2026'

const SECTIONS = [
  {
    id: 'what-are-cookies',
    heading: '1. What Are Cookies',
    placeholder:
      'Explain what cookies and similar tracking technologies are (cookies, local storage, session storage, pixels), how they work, and why they are commonly used on websites.',
  },
  {
    id: 'how-we-use-cookies',
    heading: '2. How We Use Cookies',
    placeholder:
      'Describe all cookies and tracking technologies used on AccidentPath. Categories: (a) Strictly Necessary — session management, security; (b) Analytics — Google Analytics 4 (GA4), Microsoft Clarity for usage analytics; (c) Functional — localStorage for intake wizard progress and injury journal entries. Specify each technology, provider, and purpose.',
  },
  {
    id: 'third-party-cookies',
    heading: '3. Third-Party Cookies',
    placeholder:
      'Identify all third-party services that may set cookies or collect data when users visit AccidentPath: Google Analytics, Microsoft Clarity, Supabase, Vercel. Link to each provider\'s privacy/cookie policy. Clarify that AccidentPath does not control third-party cookies.',
  },
  {
    id: 'managing-cookies',
    heading: '4. Managing Your Cookie Preferences',
    placeholder:
      'Explain how users can manage or disable cookies: browser settings for each major browser (Chrome, Firefox, Safari, Edge), opt-out links for Google Analytics and Microsoft Clarity, and the effect of disabling cookies on site functionality. Note that disabling strictly necessary cookies may affect the intake wizard and tool functionality.',
  },
  {
    id: 'do-not-track',
    heading: '5. Do Not Track',
    placeholder:
      'State AccidentPath\'s response to browser Do Not Track (DNT) signals. Clarify whether DNT signals are honored and what happens when a user sends a DNT signal.',
  },
  {
    id: 'ccpa-rights',
    heading: '6. California Residents — CCPA/CPRA Rights',
    placeholder:
      'Describe rights of California residents under CCPA/CPRA as they relate to cookies and tracking: right to opt out of sale/sharing of personal information collected via tracking technologies, right to know what is collected, right to delete. Include link to the Do Not Sell My Info page (/privacy#do-not-sell).',
  },
  {
    id: 'updates',
    heading: '7. Updates to This Policy',
    placeholder:
      'State how and when this cookie policy will be updated, how users will be notified of material changes, and the effective date of the current version.',
  },
  {
    id: 'contact',
    heading: '8. Contact Us',
    placeholder:
      'Provide contact information for cookie-related questions or requests: email address (hello@accidentpath.com), mailing address if applicable.',
  },
]

export default function CookiePolicyPage() {
  return (
    <>
      <div className="bg-primary-900 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Cookie Policy' }]}
            variant="dark"
          />
          <h1 className="mt-4 font-sans font-bold text-3xl text-white">
            Cookie Policy
          </h1>
          <p className="mt-2 text-primary-300 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">Pending Legal Review</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            This cookie policy is currently being drafted and reviewed by legal counsel. The sections
            below outline the topics that will be covered. Final content will be published prior to
            site launch.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {SECTIONS.map(section => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2
                id={`${section.id}-heading`}
                className="font-sans font-bold text-xl text-neutral-950 mb-3"
              >
                {section.heading}
              </h2>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                  Pending Legal Review
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">{section.placeholder}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
