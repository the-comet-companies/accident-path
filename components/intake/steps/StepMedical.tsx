'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['medicalTreatment']; label: string; description: string }> = [
  { value: 'none', label: 'No treatment yet', description: 'I have not seen a doctor' },
  { value: 'er', label: 'Emergency room visit', description: 'I went to the ER after the accident' },
  { value: 'doctor', label: 'Doctor visit', description: 'I saw a doctor or urgent care' },
  { value: 'ongoing', label: 'Ongoing treatment', description: 'Physical therapy, specialist, etc.' },
  { value: 'surgery', label: 'Surgery required', description: 'I had or need surgery' },
]

export function StepMedical({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Have you received medical treatment?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Medical documentation is important evidence. Select the option that best applies.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ medicalTreatment: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.medicalTreatment === opt.value
                ? 'border-primary-500 bg-surface-info'
                : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            <span className="font-sans font-semibold text-sm text-neutral-950">{opt.label}</span>
            <span className="block font-sans text-xs text-neutral-500 mt-0.5">{opt.description}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        Back
      </button>
    </div>
  )
}
