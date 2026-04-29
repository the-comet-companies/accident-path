'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const WORK_IMPACT_VALUES: IntakeForm['workImpact'][] = [
  'none',
  'missed_days',
  'reduced_capacity',
  'cant_work',
]

const EN_LABELS = ['No work impact', 'Missed some work', 'Working at reduced capacity', 'Unable to work']
const EN_DESCRIPTIONS = [
  'I was able to return to work as normal',
  'I missed days but have returned',
  "I'm back but can't do everything",
  'I cannot work due to my injuries',
]

export function StepWorkImpact({ data, onChange, onNext, onBack, strings }: StepProps) {
  const labels = strings?.workImpactLabels ?? EN_LABELS
  const descriptions = strings?.workImpactDescriptions ?? EN_DESCRIPTIONS

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step8_question ?? 'Has the accident affected your ability to work?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step8_desc ?? 'Lost wages may be recoverable. Select the option that best describes your situation.'}
      </p>
      <div className="flex flex-col gap-3">
        {WORK_IMPACT_VALUES.map((value, i) => (
          <button
            key={value}
            type="button"
            onClick={() => { onChange({ workImpact: value }); onNext() }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] ${
              data.workImpact === value
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
