import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { buildMetaTags } from '@/components/seo/MetaTags'

export const metadata = buildMetaTags({
  title: 'Legal Disclaimers — AccidentPath',
  description:
    'Important legal disclaimers about AccidentPath: educational information only, no attorney-client relationship, tool limitations, and jurisdiction notice.',
  canonical: '/disclaimers',
})

const DISCLAIMERS = [
  {
    id: 'not-legal-advice',
    heading: 'Educational Information Only — Not Legal Advice',
    paragraphs: [
      'All content on AccidentPath — including guides, articles, tool outputs, and any other information — is provided for general educational purposes only. Nothing on this website constitutes legal advice, legal opinions, or legal recommendations. The information is not a substitute for advice from a licensed attorney who is familiar with your specific facts and jurisdiction.',
      'You should not act or refrain from acting based solely on information found on this website without first seeking legal advice from a qualified attorney licensed in your state.',
    ],
  },
  {
    id: 'no-attorney-client',
    heading: 'No Attorney-Client Relationship',
    paragraphs: [
      'Use of AccidentPath — including our guides, tools, intake forms, or any referral features — does not create an attorney-client relationship between you and AccidentPath, or between you and any attorney whose information may appear on this platform.',
      'Any communication you have through AccidentPath prior to formally engaging an attorney is not protected by attorney-client privilege. Do not share sensitive case details through this platform that you would not want disclosed to third parties.',
    ],
  },
  {
    id: 'tool-limitations',
    heading: 'Interactive Tool Limitations',
    paragraphs: [
      'AccidentPath\'s interactive tools — including the Statute of Limitations Countdown, Evidence Collection Checklist, Lost Wages Estimator, and others — are designed to help you organize information and understand general concepts. They do not analyze your legal situation, predict the outcome of your case, or constitute legal or financial advice.',
      'Tool outputs are based on general information you enter and general rules that may not apply to your specific circumstances. Laws, deadlines, and rules vary by jurisdiction and can change. Always verify any deadline or legal requirement with a qualified attorney before taking action.',
    ],
  },
  {
    id: 'accuracy',
    heading: 'Accuracy of Information',
    paragraphs: [
      'AccidentPath makes reasonable efforts to ensure that the content on this platform is accurate, current, and helpful. However, we make no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability, or availability of any information on this site.',
      'Laws and legal standards change. Content that was accurate when published may become outdated. AccidentPath is not responsible for errors or omissions in content, or for any actions taken in reliance on information found on this site.',
    ],
  },
  {
    id: 'jurisdiction',
    heading: 'State Jurisdiction Notice',
    paragraphs: [
      'AccidentPath currently provides guidance specific to California and Arizona. Laws governing personal injury, insurance, and attorney-client relationships vary significantly from state to state. Information on this platform may not apply to residents of other states.',
      'If you were injured in a state other than California or Arizona, please consult an attorney licensed in the relevant jurisdiction before relying on any information found on this site.',
    ],
  },
  {
    id: 'attorney-advertising',
    heading: 'Attorney Advertising and Referral Notice',
    paragraphs: [
      'AccidentPath may facilitate connections between injured people and attorneys. When it does so, it operates as an educational platform and lead generation service — not as a certified lawyer referral service under California Business & Professions Code § 6155 unless separately certified.',
      'AccidentPath does not guarantee the quality, competence, or character of any attorney. Attorney referrals are provided for informational purposes only. You should independently verify an attorney\'s qualifications, licensing status, and experience before engaging their services.',
      'Past results do not guarantee future outcomes. "No fee unless you recover" and similar language refers to fee arrangements offered by specific attorneys and does not represent a guarantee by AccidentPath.',
    ],
  },
  {
    id: 'medical',
    heading: 'Medical Information Disclaimer',
    paragraphs: [
      'Some content on AccidentPath discusses injuries, medical treatment, and related topics. This content is for general educational purposes only and is not medical advice. If you are injured, seek medical attention immediately. Do not delay seeking medical care because of information found on this website.',
      'AccidentPath is not a medical provider. Nothing on this site should be used to self-diagnose or self-treat any condition.',
    ],
  },
]

export default function DisclaimersPage() {
  return (
    <div className="bg-surface-page min-h-screen">
      <div className="bg-primary-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Disclaimers' }]} variant="dark" />
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mt-4 mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Legal
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Legal Disclaimers
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Important information about the nature and limits of what AccidentPath provides.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-surface-card rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-8 lg:p-12">

            <nav aria-label="Disclaimer sections" className="mb-10">
              <p className="font-sans font-semibold text-sm text-neutral-950 mb-3">Contents</p>
              <ul className="space-y-1">
                {DISCLAIMERS.map((d) => (
                  <li key={d.id}>
                    <a
                      href={`#${d.id}`}
                      className="font-sans text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                    >
                      {d.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-10">
              {DISCLAIMERS.map((disclaimer, index) => (
                <section key={disclaimer.id} id={disclaimer.id} aria-labelledby={`heading-${disclaimer.id}`}>
                  {index > 0 && <hr className="border-neutral-100 mb-10" />}
                  <h2
                    id={`heading-${disclaimer.id}`}
                    className="font-sans font-bold text-xl text-neutral-950 mb-4"
                  >
                    {disclaimer.heading}
                  </h2>
                  {disclaimer.paragraphs.map((para, i) => (
                    <p key={i} className="font-sans text-neutral-600 leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
