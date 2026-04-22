'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['insuranceStatus']; label: string; description: string }> = [
  { value: 'has_insurance', label: 'I have insurance', description: "Auto, health, or workers' comp coverage" },
  { value: 'no_insurance', label: "I don't have insurance", description: 'No applicable insurance coverage' },
  { value: 'unsure', label: "I'm not sure", description: "I'm unsure what coverage applies" },
]

export function StepInsurance({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Do you have insurance coverage?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        This helps us understand what options may be available to you.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ insuranceStatus: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.insuranceStatus === opt.value
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
