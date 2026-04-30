'use client'

import { useState, useEffect } from 'react'
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
import esStrings from '@/i18n/es.json'

const urgencyStrings = esStrings.findHelp.urgency
const resultsStrings = esStrings.findHelp.results

const URGENCY_CONFIG = {
  high: {
    label: urgencyStrings.highLabel,
    message: urgencyStrings.highMessage,
    colorClasses: 'bg-danger-50 border-danger-500',
    labelClasses: 'text-danger-500',
  },
  medium: {
    label: urgencyStrings.moderateLabel,
    message: urgencyStrings.moderateMessage,
    colorClasses: 'bg-warning-50 border-warning-500',
    labelClasses: 'text-warning-500',
  },
  low: {
    label: urgencyStrings.standardLabel,
    message: urgencyStrings.standardMessage,
    colorClasses: 'bg-success-50 border-success-500',
    labelClasses: 'text-success-500',
  },
}

export default function BuscarAyudaResultsPage() {
  const [data, setData] = useState<Partial<IntakeForm> | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
      setData(saved ? (JSON.parse(saved) as Partial<IntakeForm>) : null)
    } catch { setData(null) }
    setLoaded(true)
  }, [])

  if (!loaded) return null

  if (!data || !data.accidentType) {
    return (
      <div className="min-h-screen bg-surface-page flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-sans font-bold text-2xl text-neutral-950 text-center">
          {resultsStrings.noResults}
        </h1>
        <Link
          href="/es/buscar-ayuda"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
        >
          {resultsStrings.startOver}
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
            {resultsStrings.heading}
            <span className="w-5 h-px bg-amber-500 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white leading-tight">
            {resultsStrings.subheading}
          </h1>
          <p className="mt-3 font-serif italic text-primary-200 text-lg max-w-2xl leading-relaxed">
            Basado en lo que nos contó sobre su accidente en {data.city}, {data.state}.
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
              <span aria-hidden="true">⚠</span> Su accidente fue hace más de 18 meses — hablar con un abogado pronto es especialmente importante.
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
            const [y, m, day] = data.accidentDate.split('-').map(Number)
            const d = new Date(y, m - 1, day)
            d.setFullYear(d.getFullYear() + stateRules.sol.personalInjury / 12)
            solDateStr = d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
          }

          return (
            <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-widest font-sans">
                  <span className="w-4 h-px bg-amber-500 shrink-0" aria-hidden="true" />
                  {resultsStrings.stateInfo}
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-sans font-bold text-xs border border-amber-200">
                  {data.state}
                </span>
              </div>

              {solDateStr && (
                <div className="mb-5">
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                    {resultsStrings.filingDeadline}
                  </p>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    En {stateName}, el plazo general de lesiones personales es de {stateRules.sol.personalInjury / 12}{' '}años desde la fecha del accidente.
                    Basado en sus respuestas, eso es aproximadamente{' '}
                    <span className="font-semibold text-neutral-950">{solDateStr}</span>.
                  </p>
                  <p className="mt-1.5 text-neutral-400 text-xs leading-relaxed">
                    Los plazos varían según sus circunstancias — consulte a un abogado para confirmar el suyo.
                  </p>
                </div>
              )}

              {deadlines.length > 0 && (
                <div className="mb-5">
                  <p className="font-sans font-semibold text-neutral-950 text-sm mb-3">
                    {resultsStrings.reportingDeadlines}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {deadlines.map((d, i) => (
                      <li key={`${d.label}-${i}`} className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sans font-semibold text-sm text-neutral-800">{d.label}</span>
                          <span className="text-xs font-semibold font-sans text-amber-700 whitespace-nowrap">
                            {d.deadlineDays !== null ? `${d.deadlineDays} días` : 'Según términos de la póliza'}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-xs leading-relaxed">{d.details}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-100">
                <p className="font-sans font-semibold text-neutral-950 text-sm mb-1">
                  {resultsStrings.faultRule}
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed">{stateRules.faultRule.summary}</p>
              </div>

              <p className="mt-4 text-neutral-400 text-xs leading-relaxed">
                Esta es información educativa general solamente, no asesoramiento legal. Las leyes cambian — verifique los plazos con un abogado con licencia en {stateName}.
              </p>
            </div>
          )
        })()}

        {/* Lawyer type suggestion */}
        <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
          <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-2">
            {resultsStrings.lawyerType}
          </p>
          <p className="font-sans font-bold text-xl text-neutral-950 mb-3">{lawyerType}</p>
          <p className="text-neutral-600 text-sm leading-relaxed">
            Basado en sus respuestas, los abogados que típicamente manejan casos de accidentes en {data.state} pueden ayudarle a entender sus opciones. La disponibilidad varía según el tipo de caso y la ubicación. Esta información es solo educativa, no asesoramiento legal.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
          >
            Conectar con un Abogado <span aria-hidden="true" className="ml-1.5">→</span>
          </Link>
        </div>

        {/* Recommended resources */}
        {resources.length > 0 && (
          <div className="bg-surface-card rounded-2xl border border-neutral-100 p-6">
            <p className="text-xs font-semibold font-sans text-neutral-400 uppercase tracking-widest mb-4">
              {resultsStrings.resources}
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
            {resultsStrings.exploreTools}
          </Link>
          <Link
            href="/es/buscar-ayuda"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            {resultsStrings.startOver}
          </Link>
        </div>

        <DisclaimerBanner locale="es" variant="intake" />
      </div>
    </div>
  )
}
