'use client'
import type { StepProps } from '@/lib/intake'

const ACCIDENT_TYPE_VALUES = [
  'Car Accident',
  'Truck Accident',
  'Motorcycle Crash',
  'Slip & Fall',
  'Workplace Injury',
  'Bicycle Accident',
  'Pedestrian Accident',
  'Dog Bite',
  'Other',
]

const EN_LABELS = ACCIDENT_TYPE_VALUES

export function StepAccidentType({ data, onChange, onNext, strings }: StepProps) {
  const labels = strings?.accidentTypeLabels ?? EN_LABELS

  function select(value: string) {
    onChange({ accidentType: value })
    onNext()
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step1_question ?? 'What type of accident happened?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step1_desc ?? 'Select the option that best describes your situation.'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACCIDENT_TYPE_VALUES.map((value, i) => (
          <button
            key={value}
            type="button"
            onClick={() => select(value)}
            className={`text-left p-4 rounded-xl border-2 transition-colors min-h-[44px] font-sans text-sm font-medium ${
              data.accidentType === value
                ? 'border-primary-500 bg-surface-info text-primary-700'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
            }`}
          >
            {labels[i] ?? value}
          </button>
        ))}
      </div>
    </div>
  )
}
