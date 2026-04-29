'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const INSURANCE_VALUES: IntakeForm['insuranceStatus'][] = [
  'has_insurance',
  'no_insurance',
  'unsure',
]

const EN_LABELS = ["I have insurance", "I don't have insurance", "I'm not sure"]
const EN_DESCRIPTIONS = [
  "Auto, health, or workers' comp coverage",
  'No applicable insurance coverage',
  "I'm unsure what coverage applies",
]

export function StepInsurance({ data, onChange, onNext, onBack, strings }: StepProps) {
  const labels = strings?.insuranceLabels ?? EN_LABELS
  const descriptions = strings?.insuranceDescriptions ?? EN_DESCRIPTIONS

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step7_question ?? 'Do you have insurance coverage?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step7_desc ?? 'This helps us understand what options may be available to you.'}
      </p>
      <div className="flex flex-col gap-3">
        {INSURANCE_VALUES.map((value, i) => (
          <button
            key={value}
            type="button"
            onClick={() => { onChange({ insuranceStatus: value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.insuranceStatus === value
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
