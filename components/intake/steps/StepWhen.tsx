'use client'
import { monthsAgo } from '@/lib/intake'
import type { StepProps } from '@/lib/intake'

export function StepWhen({ data, onChange, onNext, onBack }: StepProps) {
  const isOld = data.accidentDate ? monthsAgo(data.accidentDate) > 18 : false
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        When did the accident happen?
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        The date affects your legal timeline. California and Arizona both have a 2-year statute of limitations for most personal injury claims.
      </p>
      <input
        type="date"
        value={data.accidentDate ?? ''}
        max={today}
        onChange={e => onChange({ accidentDate: e.target.value })}
        className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-neutral-950 font-sans text-base focus:outline-none focus:border-primary-500 min-h-[44px] bg-white"
      />
      {isOld && (
        <div className="mt-4 p-4 bg-warning-50 border border-warning-500 rounded-xl">
          <p className="text-warning-500 text-sm font-semibold font-sans mb-1">
            <span aria-hidden="true">⚠</span> Time-sensitive situation
          </p>
          <p className="text-neutral-700 text-sm leading-relaxed">
            More than 18 months have passed since your accident. You may be approaching your legal deadline. Consider speaking with an attorney as soon as possible. This is educational information only, not legal advice.
          </p>
        </div>
      )}
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
          disabled={!data.accidentDate}
          className="flex-1 min-h-[44px] rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
