'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const MEDICAL_VALUES: IntakeForm['medicalTreatment'][] = [
  'none',
  'er',
  'doctor',
  'ongoing',
  'surgery',
]

const EN_LABELS = ['No treatment yet', 'Emergency room visit', 'Doctor visit', 'Ongoing treatment', 'Surgery required']
const EN_DESCRIPTIONS = [
  'I have not seen a doctor',
  'I went to the ER after the accident',
  'I saw a doctor or urgent care',
  'Physical therapy, specialist, etc.',
  'I had or need surgery',
]

export function StepMedical({ data, onChange, onNext, onBack, strings }: StepProps) {
  const labels = strings?.medicalLabels ?? EN_LABELS
  const descriptions = strings?.medicalDescriptions ?? EN_DESCRIPTIONS

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step5_question ?? 'Have you received medical treatment?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step5_desc ?? 'Medical documentation is important evidence. Select the option that best applies.'}
      </p>
      <div className="flex flex-col gap-3">
        {MEDICAL_VALUES.map((value, i) => (
          <button
            key={value}
            type="button"
            onClick={() => { onChange({ medicalTreatment: value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.medicalTreatment === value
                ? 'border-primary-500 bg-surface-info'
                : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            <span className="font-sans font-semibold text-sm text-neutral-950">{labels[i]}</span>
            <span className="block font-sans text-xs text-neutral-500 mt-0.5">{descriptions[i]}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 w-full min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        {strings?.back ?? 'Back'}
      </button>
    </div>
  )
}
