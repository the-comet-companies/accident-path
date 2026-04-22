'use client'

import type { ToolConfig } from '@/types/tool'

const TYPE_LABELS: Record<string, string> = {
  select: 'Multiple choice',
  multiselect: 'Multiple select',
  checklist: 'Checklist',
  number: 'Number input',
  text: 'Text input',
  date: 'Date input',
}

interface Props {
  tool: ToolConfig
}

export function ToolEngine({ tool }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>

      {/* Step list */}
      <div className="flex flex-col gap-4">
        {tool.steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-surface-card p-4"
          >
            <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold font-sans">{index + 1}</span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p className="font-sans font-medium text-neutral-950 text-sm leading-snug">
                {step.question}
              </p>
              <p className="text-neutral-400 text-xs">{TYPE_LABELS[step.type] ?? step.type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Greyed-out CTA */}
      <div className="flex flex-col items-start gap-2 opacity-50 pointer-events-none select-none">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-900 text-white text-sm font-semibold font-sans"
        >
          Start Tool →
        </button>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-info text-primary-700 text-xs font-semibold font-sans">
          Launching soon
        </span>
      </div>
    </div>
  )
}
