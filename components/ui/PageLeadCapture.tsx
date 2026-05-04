'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface Props {
  headline: string
  subtext: string
  buttonLabel: string
  toolSlug: string
  toolContext?: Record<string, string>
  bare?: boolean
}

const INPUT_CLASS =
  'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

export function PageLeadCapture({
  headline,
  subtext,
  buttonLabel,
  toolSlug,
  toolContext = {},
  bare = false,
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          pattern: 'A',
          email,
          consent: true, // disclosed via Privacy Policy link below
          toolContext,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      trackEvent('tool_lead_submitted', { toolSlug })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="text-sm font-semibold text-green-800">Got it — check your inbox shortly.</p>
      </div>
    )
  }

  const content = (
    <>
      {headline && <p className="font-sans font-semibold text-primary-900 text-base mb-1">{headline}</p>}
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">{subtext}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor={`plc-email-${toolSlug}`}>
          Email address
        </label>
        <input
          id={`plc-email-${toolSlug}`}
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`${INPUT_CLASS} flex-1`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'loading' ? 'Sending…' : buttonLabel}
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-400">
        By submitting, you agree to our{' '}
        <Link href="/privacy" className="underline hover:text-neutral-600">
          Privacy Policy
        </Link>
        .
      </p>
      {status === 'error' && (
        <p aria-live="polite" className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </>
  )

  if (bare) return content

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-6">
      {content}
    </div>
  )
}
