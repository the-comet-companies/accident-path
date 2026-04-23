'use client'

import Link from 'next/link'
import type { ToolOutput, ToolConfig } from '@/types/tool'

const PRIORITY_STYLES = {
  critical: 'bg-danger-50 text-danger-700 border-danger-200',
  important: 'bg-warning-50 text-warning-700 border-warning-200',
  helpful: 'bg-success-50 text-success-700 border-success-200',
} as const

const PRIORITY_LABELS = {
  critical: 'Critical',
  important: 'Important',
  helpful: 'Helpful',
} as const

interface ToolResultsProps {
  output: ToolOutput
  tool: ToolConfig
  onReset: () => void
}

export function ToolResults({ output, tool, onReset }: ToolResultsProps) {
  return (
    <div className="flex flex-col gap-6 print:gap-4">
      {/* Summary */}
      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <p className="text-xs font-semibold font-sans text-primary-600 uppercase tracking-widest mb-2">
          Your Results
        </p>
        <p className="text-neutral-800 text-sm leading-relaxed font-serif">{output.summary}</p>
      </div>

      {/* Items */}
      {output.items.length > 0 && (
        <div className="flex flex-col gap-3">
          {output.items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-surface-card p-4"
            >
              <span
                className={[
                  'flex-shrink-0 px-2 py-0.5 rounded-full border text-xs font-bold font-sans mt-0.5',
                  PRIORITY_STYLES[item.priority],
                ].join(' ')}
              >
                {PRIORITY_LABELS[item.priority]}
              </span>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-sans font-semibold text-sm text-neutral-900">{item.label}</p>
                {item.value && (
                  <p className="text-neutral-500 text-xs leading-relaxed">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-neutral-500 text-xs leading-relaxed">{output.disclaimer}</p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Link
          href={output.cta.href}
          className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors"
        >
          {output.cta.label}
        </Link>
        {output.exportable && (
          <button
            type="button"
            onClick={() => { if (typeof window !== 'undefined') window.print() }}
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            Print / Save PDF
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-500 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
