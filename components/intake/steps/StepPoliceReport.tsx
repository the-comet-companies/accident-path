'use client'
import type { StepProps } from '@/lib/intake'

export function StepPoliceReport({ data, onChange, onNext, onBack, strings }: StepProps) {
  function select(val: boolean) {
    onChange({ policeReport: val })
    onNext()
  }

  return (
    <div>
      <h2 className="font-sans font-bold text-2xl text-neutral-950 mb-2">
        {strings?.step6_question ?? 'Was a police report filed?'}
      </h2>
      <p className="text-neutral-500 text-sm mb-6">
        {strings?.step6_desc ?? 'Police reports are an important piece of evidence in accident cases.'}
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => select(true)}
          className={`flex-1 min-h-[64px] rounded-xl border-2 font-sans font-bold text-lg transition-colors ${
            data.policeReport === true
              ? 'border-primary-500 bg-surface-info text-primary-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
          }`}
        >
          {strings?.step6_yes ?? 'Yes'}
        </button>
        <button
          type="button"
          onClick={() => select(false)}
          className={`flex-1 min-h-[64px] rounded-xl border-2 font-sans font-bold text-lg transition-colors ${
            data.policeReport === false
              ? 'border-primary-500 bg-surface-info text-primary-700'
              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-surface-info'
          }`}
        >
          {strings?.step6_no ?? 'No'}
        </button>
      </div>
      {data.policeReport === false && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-500 rounded-xl">
          <p className="text-amber-700 text-sm font-sans leading-relaxed">
            <strong>{strings?.step6_tipTitle ?? 'Tip:'}</strong>{' '}
            {strings?.step6_tipMsg ?? 'You may still be able to file a report. Many police departments accept delayed reports within 24–72 hours. Check with your local department for options. This is educational information only, not legal advice.'}
          </p>
        </div>
      )}
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
