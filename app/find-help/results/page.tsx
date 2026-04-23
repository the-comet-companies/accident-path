'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { IntakeForm } from '@/types/intake'
import {
  INTAKE_STORAGE_KEY,
  computeUrgency,
  suggestLawyerType,
  suggestResources,
  monthsAgo,
} from '@/lib/intake'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import { STATE_RULES, getRelevantDeadlines } from '@/lib/state-rules'

const URGENCY_CONFIG = {
  high: {
    label: 'High Priority',
    message:
      'Based on what you shared, your situation may be time-sensitive. Consider speaking with a personal injury attorney as soon as possible. This is educational information only, not legal advice.',
    colorClasses: 'bg-danger-50 border-danger-500',
    labelClasses: 'text-danger-500',
  },
  medium: {
    label: 'Moderate Priority',
    message:
      'Your situation warrants attention. There may be important deadlines or documentation steps to take soon. This is educational information only, not legal advice.',
    colorClasses: 'bg-warning-50 border-warning-500',
    labelClasses: 'text-warning-500',
  },
  low: {
    label: 'Standard Priority',
    message:
      'Based on your responses, you appear to have more time to consider your options carefully. That said, earlier action is generally better when it comes to accident claims. This is educational information only, not legal advice.',
    colorClasses: 'bg-success-50 border-success-500',
    labelClasses: 'text-success-500',
  },
}

export default function FindHelpResultsPage() {
  const [data, setData] = useState<Partial<IntakeForm> | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
    if (saved) {
      try { setData(JSON.parse(saved)) } catch { /* ignore */ }
    }
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center">
        <div className="text-neutral-400 font-sans text-sm">Loading your results…</div>
      </div>
    )
  }

  if (!data || !data.accidentType) {
    return (
      <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-sans font-bold text-2xl text-neutral-950 text-center">No results found</h1>
        <p className="text-neutral-500 text-sm text-center max-w-sm">
          It looks like you haven&apos;t completed the intake form yet.
        </p>
        <Link
          href="/find-help"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
        >
          Start the Intake Wizard
        </Link>
      </div>
    )
  }

  const urgency = computeUrgency(data)
  const urgencyConfig = URGENCY_CONFIG[urgency]
  const lawyerType = suggestLawyerType(data)
  const resources = suggestResources(data)
  const isOld = data.accidentDate ? monthsAgo(data.accidentDate) > 18 : false

  return (
    <div className="min-h-screen bg-surface-page">
      {/* Header */}
      <div className="bg-primary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
            Your Personalized Results
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            Here&apos;s What We Found
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Based on what you told us about your {data.accidentType?.toLowerCase()} in {data.city}, {data.state}.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">

        {/* Urgency banner */}
        <div className={`p-5 rounded-2xl border-2 ${urgencyConfig.colorClasses}`}>
          <p className={`font-sans font-bold text-sm mb-1 ${urgencyConfig.labelClasses}`}>
            {urgencyConfig.label}
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">{urgencyConfig.message}</p>
          {isOld && (
            <p className="mt-2 text-sm font-semibold text-neutral-700">
              <span aria-hidden="true">⚠</span> Your accident was over 18 months ago — speaking with an attorney soon is especially important.
            </p>
          )}
        </div>

        {/* State rules card */}
        {(data.state === 'CA' || data.state === 'AZ') && (() => {
          const stateRules = STATE_RULES[data.state]
          const deadlines = getRelevantDeadlines(data.state, data.accidentType ?? '')
          const stateName = data.state === 'CA' ? 'California' : 'Arizona'

          let solDateStr: string | null = null
          if (data.accidentDate) {
            const d = new Date(data.accidentDate)
            d.setMonth(d.getMonth() + 24)
            solDateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }

          return (
            <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-widest font-sans">
                  <span className="w-4 h-px bg-amber-500 shrink-0" aria-hidden="true" />
                  State-Specific Information
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-sans font-bold text-xs border border-amber-200">
                  {data.state}
                </span>
              </div>

              {/* SOL Deadline Block */}
              {solDateStr && (
                <div className="mb-5">
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                    Personal Injury Filing Deadline
                  </p>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    In {stateName}, the general personal injury deadline is 2 years from your accident date.
                    Based on what you told us, that&apos;s approximately{' '}
                    <span className="font-semibold text-neutral-950">{solDateStr}</span>.
                  </p>
                  <p className="mt-1.5 text-neutral-400 text-xs leading-relaxed">
                    Deadlines vary based on your specific circumstances — consult an attorney to confirm yours.
                  </p>
                </div>
              )}

              {/* Reporting Deadlines Block */}
              {deadlines.length > 0 && (
                <div className="mb-5">
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    Reporting Deadlines to Know
                  </p>
                  <ul className="flex flex-col gap-3">
                    {deadlines.map(d => (
                      <li key={d.label} className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sans font-semibold text-sm text-neutral-800">{d.label}</span>
                          <span className="text-xs font-semibold font-sans text-amber-700 whitespace-nowrap">
                            {d.deadlineDays !== null ? `${d.deadlineDays} days` : 'Per policy terms'}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-xs leading-relaxed">{d.details}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fault Rule Block */}
              <div className="pt-4 border-t border-neutral-100">
                <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">Fault Rule</p>
                <p className="text-neutral-600 text-sm leading-relaxed">{stateRules.faultRule.summary}</p>
              </div>

              {/* Footer disclaimer */}
              <p className="mt-4 text-neutral-400 text-xs leading-relaxed">
                This is general educational information only, not legal advice. Laws change — verify
                deadlines with a licensed attorney in {stateName}.
              </p>
            </div>
          )
        })()}

        {/* Lawyer type suggestion */}
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
          <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-2">
            Lawyer Type That May Help
          </p>
          <p className="font-sans font-bold text-xl text-neutral-950 mb-3">{lawyerType}</p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Based on what you told us, lawyers who typically handle{' '}
            {data.accidentType?.toLowerCase()} cases in {data.state} may be able to help you understand
            your options. Availability varies by case type and location. This is educational
            information only, not legal advice.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            Connect with an Attorney <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
        </div>

        {/* Recommended resources */}
        {resources.length > 0 && (
          <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
            <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
              Recommended Resources
            </p>
            <ul className="flex flex-col gap-3">
              {resources.map(r => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-2 text-sm font-semibold font-sans text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                  >
                    <span aria-hidden="true" className="text-primary-300">→</span>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tools"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-primary-500 text-primary-600 font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-50 transition-colors"
          >
            Explore Free Tools
          </Link>
          <Link
            href="/find-help"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            Start Over
          </Link>
        </div>

        <DisclaimerBanner variant="intake" />
      </div>
    </div>
  )
}
