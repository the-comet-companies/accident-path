'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const OPTIONS: Array<{ value: IntakeForm['workImpact']; label: string; description: string }> = [
  { value: 'none', label: 'No work impact', description: 'I was able to return to work as normal' },
  { value: 'missed_days', label: 'Missed some work', description: 'I missed days but have returned' },
  { value: 'reduced_capacity', label: 'Working at reduced capacity', description: "I'm back but can't do everything" },
  { value: 'cant_work', label: 'Unable to work', description: 'I cannot work due to my injuries' },
]

export function StepWorkImpact({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Has the accident affected your ability to work?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        Lost wages may be recoverable. Select the option that best describes your situation.
      </p>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { onChange({ workImpact: opt.value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.workImpact === opt.value
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
