'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { IntakeForm } from '@/types/intake'
import { INTAKE_STORAGE_KEY, computeUrgencyFactors } from '@/lib/intake'
import { trackEvent } from '@/lib/analytics'
import { ProgressBar } from '@/components/intake/ProgressBar'
import { StepAccidentType } from '@/components/intake/steps/StepAccidentType'
import { StepWhen } from '@/components/intake/steps/StepWhen'
import { StepWhere } from '@/components/intake/steps/StepWhere'
import { StepInjuries } from '@/components/intake/steps/StepInjuries'
import { StepMedical } from '@/components/intake/steps/StepMedical'
import { StepPoliceReport } from '@/components/intake/steps/StepPoliceReport'
import { StepInsurance } from '@/components/intake/steps/StepInsurance'
import { StepWorkImpact } from '@/components/intake/steps/StepWorkImpact'
import { StepContact } from '@/components/intake/steps/StepContact'

const TOTAL_STEPS = 9

const STEP_NAMES: Record<number, string> = {
  1: 'accident_type',
  2: 'when',
  3: 'where',
  4: 'injuries',
  5: 'medical',
  6: 'police_report',
  7: 'insurance',
  8: 'work_impact',
  9: 'contact',
}

export function IntakeWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Partial<IntakeForm>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
      return saved ? (JSON.parse(saved) as Partial<IntakeForm>) : {}
    } catch { return {} }
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    trackEvent('intake_started')
  }, [])

  useEffect(() => {
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const onChange = useCallback((updates: Partial<IntakeForm>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const goNext = useCallback(() => {
    const name = STEP_NAMES[step] ?? ''
    trackEvent('step_completed', { step_number: step, step_name: name })
    setStep(s => Math.min(s + 1, TOTAL_STEPS))
  }, [step])

  const goBack = useCallback(() => {
    setStep(s => Math.max(s - 1, 1))
  }, [])

  async function handleSubmit() {
    setSubmitting(true)
    const urgencyFactors = computeUrgencyFactors(data)
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          urgencyFactors,
        }),
      })
      if (!response.ok) {
        console.error('Intake submission failed:', response.status)
      }
    } catch {
      // Don't block the user flow on network errors
    } finally {
      setSubmitting(false)
    }
    trackEvent('intake_submitted', {
      accident_type: data.accidentType ?? '',
      state: data.state ?? '',
    })
    router.push('/find-help/thank-you')
  }

  const stepProps = { data, onChange, onNext: goNext, onBack: goBack }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      {/* Progress */}
      <div className="mb-8">
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div key={step} className="min-h-[400px] animate-step-in">
        {step === 1 && <StepAccidentType {...stepProps} />}
        {step === 2 && <StepWhen {...stepProps} />}
        {step === 3 && <StepWhere {...stepProps} />}
        {step === 4 && <StepInjuries {...stepProps} />}
        {step === 5 && <StepMedical {...stepProps} />}
        {step === 6 && <StepPoliceReport {...stepProps} />}
        {step === 7 && <StepInsurance {...stepProps} />}
        {step === 8 && <StepWorkImpact {...stepProps} />}
        {step === 9 && (
          <StepContact
            {...stepProps}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
