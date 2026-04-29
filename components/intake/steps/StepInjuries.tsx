'use client'
import type { StepProps } from '@/lib/intake'

const INJURY_VALUES = [
  'Head / Brain',
  'Neck / Back',
  'Broken Bones',
  'Soft Tissue (whiplash, sprains)',
  'Burns',
  'Internal Injuries',
  'Emotional / Psychological',
  'None Visible Yet',
]

export function StepInjuries({ data, onChange, onNext, onBack, strings }: StepProps) {
  const selected = data.injuries ?? []
  const labels = strings?.injuryLabels ?? INJURY_VALUES

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange({ injuries: selected.filter(i => i !== value) })
    } else {
      onChange({ injuries: [...selected, value] })
    }
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step4_question ?? 'What injuries did you sustain?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step4_desc ?? 'Select all that apply. If unsure, select your best guess.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INJURY_VALUES.map((value, i) => {
          const isSelected = selected.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              aria-pressed={isSelected}
              className={`text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] font-sans text-sm font-medium flex items-center gap-3 ${
                isSelected
                  ? 'border-primary-500 bg-surface-info text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
              }`}
            >
              <div
                aria-hidden="true"
                className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary-600 border-primary-600' : 'bg-white border-neutral-300'
                }`}
              >
                {isSelected && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {labels[i] ?? value}
            </button>
          )
        })}
      </div>
      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          {strings?.back ?? 'Back'}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {strings?.continue ?? 'Continue'}
        </button>
      </div>
    </div>
  )
}
