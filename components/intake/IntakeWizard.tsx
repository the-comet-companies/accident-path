'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { IntakeForm } from '@/types/intake'
import { supabase } from '@/lib/supabase'
import { INTAKE_STORAGE_KEY, computeUrgencyFactors, trackEvent } from '@/lib/intake'
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
  const [data, setData] = useState<Partial<IntakeForm>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(INTAKE_STORAGE_KEY)
    if (saved) {
      try { setData(JSON.parse(saved)) } catch { /* ignore corrupt data */ }
    }
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const goBack = useCallback(() => {
    setStep(s => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  async function handleSubmit() {
    setSubmitting(true)
    const urgencyFactors = computeUrgencyFactors(data)
    try {
      await supabase.from('intake_sessions').insert({
        accident_type: data.accidentType ?? null,
        accident_date: data.accidentDate ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        injuries: data.injuries ?? [],
        medical: data.medicalTreatment ?? null,
        police_report: data.policeReport ?? null,
        insurance: data.insuranceStatus ?? null,
        work_impact: data.workImpact ?? null,
        urgency_factors: urgencyFactors,
        name: data.name ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        consent: data.consent ?? false,
      })
    } catch {
      // Don't block the user flow on Supabase errors
    }
    trackEvent('intake_submitted', {
      accident_type: data.accidentType ?? '',
      state: data.state ?? '',
    })
    // Keep data in localStorage for results page
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
      <div className="min-h-[400px]">
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
