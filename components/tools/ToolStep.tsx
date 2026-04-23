'use client'

import type { ToolStep, ToolOption } from '@/types/tool'

interface ToolStepProps {
  step: ToolStep
  value: string | string[] | number | undefined
  onChange: (v: string | string[] | number) => void
}

function OptionCard({
  option,
  selected,
  onClick,
  multi,
}: {
  option: ToolOption
  selected: boolean
  onClick: () => void
  multi: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border-2 font-sans text-sm transition-colors min-h-[44px]',
        selected
          ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50',
      ].join(' ')}
    >
      <span
        className={[
          'flex-shrink-0 w-5 h-5 flex items-center justify-center border-2 transition-colors text-xs font-bold',
          multi ? 'rounded' : 'rounded-full',
          selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300 bg-white',
        ].join(' ')}
        aria-hidden="true"
      >
        {selected && (multi ? '✓' : '●')}
      </span>
      {option.label}
    </button>
  )
}

export function ToolStep({ step, value, onChange }: ToolStepProps) {
  const options = step.options ?? []

  if (step.type === 'select') {
    const current = (value as string) ?? ''
    return (
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={step.question}>
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            option={opt}
            selected={current === opt.value}
            onClick={() => onChange(opt.value)}
            multi={false}
          />
        ))}
      </div>
    )
  }

  if (step.type === 'multiselect' || step.type === 'checklist') {
    const current: string[] = Array.isArray(value) ? (value as string[]) : []
    const toggle = (v: string) => {
      const next = current.includes(v) ? current.filter(x => x !== v) : [...current, v]
      onChange(next)
    }
    return (
      <div className="flex flex-col gap-2" role="group" aria-label={step.question}>
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            option={opt}
            selected={current.includes(opt.value)}
            onClick={() => toggle(opt.value)}
            multi={true}
          />
        ))}
      </div>
    )
  }

  if (step.type === 'number') {
    const current = typeof value === 'number' ? value : ''
    return (
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={current}
          min={0}
          onChange={e => {
            const n = parseFloat(e.target.value)
            if (!isNaN(n)) onChange(n)
          }}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none min-h-[44px]"
          aria-label={step.question}
        />
      </div>
    )
  }

  if (step.type === 'text') {
    const current = (value as string) ?? ''
    return (
      <textarea
        value={current}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none resize-none"
        aria-label={step.question}
      />
    )
  }

  if (step.type === 'date') {
    const current = (value as string) ?? ''
    return (
      <input
        type="date"
        value={current}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 font-sans text-sm text-neutral-900 focus:border-primary-500 focus:outline-none min-h-[44px]"
        aria-label={step.question}
      />
    )
  }

  return null
}
