'use client'
import type { StepProps } from '@/lib/intake'
import type { IntakeForm } from '@/types/intake'

const STATES: Array<{ value: IntakeForm['state']; label: string }> = [
  { value: 'CA', label: 'California' },
  { value: 'AZ', label: 'Arizona' },
]

export function StepWhere({ data, onChange, onNext, onBack }: StepProps) {
  const isValid = !!data.state && !!data.city?.trim()

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        Where did it happen?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        We currently serve California and Arizona. State laws affect your options.
      </p>

      <fieldset className="mb-5">
        <legend className="text-sm font-semibold font-sans text-neutral-700 mb-2">State</legend>
        <div className="flex gap-3">
          {STATES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange({ state: s.value })}
              className={`flex-1 min-h-[44px] rounded-xl border-2 font-sans font-semibold text-sm transition-colors ${
                data.state === s.value
                  ? 'border-primary-500 bg-surface-info text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="city-input" className="block text-sm font-semibold font-sans text-neutral-700 mb-2">
          City
        </label>
        <input
          id="city-input"
          type="text"
          value={data.city ?? ''}
          onChange={e => onChange({ city: e.target.value })}
          placeholder="e.g. Los Angeles"
          className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-base focus:outline-none focus:border-primary-500 min-h-[44px] bg-white placeholder:text-neutral-400"
        />
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-[44px] rounded-xl border-2 border-neutral-200 font-sans font-semibold text-sm text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
