'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ToolConfig, ToolAnswers, ToolOutput } from '@/types/tool'
import { ToolProgressBar } from '@/components/tools/ToolProgressBar'
import { ToolStep } from '@/components/tools/ToolStep'
import { ToolResults } from '@/components/tools/ToolResults'
import { outputGenerators } from '@/lib/tools/output-generators'
import { getSupabase } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'

interface Props {
  tool: ToolConfig
}

export function ToolEngine({ tool }: Props) {
  const [answers, setAnswers] = useState<ToolAnswers>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [output, setOutput] = useState<ToolOutput | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    trackEvent('tool_started', { tool_slug: tool.slug })
  }, [tool.slug])

  const step = tool.steps[currentStep]
  const total = tool.steps.length
  const isLast = currentStep === total - 1

  const handleChange = useCallback(
    (value: string | string[] | number) => {
      setAnswers(prev => ({ ...prev, [step.id]: value }))
    },
    [step.id]
  )

  const currentAnswer = answers[step?.id ?? '']

  function canAdvance(): boolean {
    if (!step) return false
    const v = currentAnswer
    if (step.type === 'select') return typeof v === 'string' && v !== ''
    if (step.type === 'multiselect' || step.type === 'checklist') return Array.isArray(v) && v.length > 0
    if (step.type === 'number') return typeof v === 'number' && !isNaN(v)
    if (step.type === 'text') return typeof v === 'string' && v.trim() !== ''
    if (step.type === 'date') return typeof v === 'string' && v !== ''
    return false
  }

  async function handleFinish() {
    const generator = outputGenerators[tool.slug]
    if (!generator) {
      setOutput({
        summary: 'Results for this tool are coming soon.',
        items: [],
        cta: { label: 'Get Free Guidance', href: '/find-help' },
        disclaimer: tool.disclaimer,
        exportable: false,
      })
      return
    }

    setSubmitting(true)
    const result = generator(answers)
    setOutput(result)
    trackEvent('tool_completed', { tool_slug: tool.slug })

    try {
      const supabase = getSupabase()
      await supabase.from('tool_submissions').insert({
        tool_slug: tool.slug,
        answers,
        output: result,
      })
    } catch {
      // Don't block on Supabase errors
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setAnswers({})
    setCurrentStep(0)
    setOutput(null)
  }

  if (output) {
    return (
      <div className="flex flex-col gap-6">
        {output.emergency && (
          <div className="rounded-xl border-2 border-danger-500 bg-danger-50 p-4 flex items-start gap-3">
            <span className="text-danger-500 text-xl leading-none mt-0.5">⚠</span>
            <div>
              <p className="font-sans font-bold text-danger-700 text-sm">If you are in immediate danger, call 911 now.</p>
              <p className="font-sans text-danger-700 text-sm mt-1">The symptoms you reported may indicate a serious or life-threatening condition. Please seek emergency medical care immediately.</p>
            </div>
          </div>
        )}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
        </div>
        <ToolResults output={output} onReset={handleReset} />
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Disclaimer before */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm leading-relaxed">{tool.disclaimer}</p>
      </div>

      {/* Progress */}
      <ToolProgressBar current={currentStep + 1} total={total} />

      {/* Step question */}
      <div key={currentStep} className="flex flex-col gap-4 animate-step-in">
        <p className="font-sans font-semibold text-lg text-neutral-950 leading-snug">
          {step.question}
        </p>
        <ToolStep step={step} value={currentAnswer} onChange={handleChange} />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep(s => s - 1)}
            className="px-5 py-3 rounded-xl border-2 border-neutral-200 text-neutral-700 font-sans font-semibold text-sm min-h-[44px] hover:bg-neutral-50 transition-colors"
          >
            ← Back
          </button>
        )}
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!canAdvance() || submitting}
            className="flex-1 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? 'Calculating…' : 'See My Results →'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep(s => s + 1)}
            disabled={!canAdvance()}
            className="flex-1 px-5 py-3 rounded-xl bg-primary-600 text-white font-sans font-semibold text-sm min-h-[44px] hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
