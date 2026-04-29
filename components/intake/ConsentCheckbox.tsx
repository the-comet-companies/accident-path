interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  tcpaText?: string
}

const DEFAULT_TCPA = `By submitting this form, I consent to receive calls, text messages, and emails from AccidentPath and its attorney partners regarding my inquiry. I understand that calls may be made using automated technology. Message and data rates may apply. I understand this service is free and I am not obligated to retain any attorney. I may revoke consent at any time by contacting us at hello@accidentpath.com.`

export function ConsentCheckbox({ checked, onChange, tcpaText }: ConsentCheckboxProps) {
  const id = 'tcpa-consent'
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
      <label htmlFor={id} className="flex gap-3 cursor-pointer">
        <div className="shrink-0 mt-0.5">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              checked
                ? 'bg-primary-600 border-primary-600'
                : 'bg-white border-neutral-300'
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          {tcpaText ?? DEFAULT_TCPA}
        </p>
      </label>
    </div>
  )
}
