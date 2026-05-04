'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface Props {
  stateAbbr: string
  stateName: string
  solMonths: number
}

const INPUT_CLASS =
  'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

function computeDeadline(accidentDate: string, solMonths: number): string {
  const [y, m, d] = accidentDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setMonth(date.getMonth() + solMonths)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function SolLeadCapture({ stateAbbr, stateName, solMonths }: Props) {
  const [accidentDate, setAccidentDate] = useState('')
  const [email, setEmail] = useState('')
  const [deadline, setDeadline] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setAccidentDate(val)
    setDeadline(val ? computeDeadline(val, solMonths) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: 'page-state',
          pattern: 'A',
          email,
          consent: true,
          toolContext: {
            state: stateAbbr,
            accidentDate,
            solDeadline: deadline ?? '',
          },
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      trackEvent('tool_lead_submitted', { toolSlug: 'page-state' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
        <p className="text-sm font-semibold text-green-800">
          Got it — check your inbox for your deadline reminder.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-6">
      <p className="font-sans font-semibold text-primary-900 text-base mb-1">
        Know your {stateName} filing deadline
      </p>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">
        Enter your accident date to calculate your personal injury deadline, then get it emailed to you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-700">Accident date</span>
          <input
            type="date"
            required
            value={accidentDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className={INPUT_CLASS}
          />
        </label>
        {deadline && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-0.5">
              Your estimated deadline
            </p>
            <p className="font-sans font-bold text-neutral-950 text-base">{deadline}</p>
            <p className="text-xs text-neutral-500 mt-1">
              General {solMonths / 12}-year limit for personal injury in {stateName}. Verify with an attorney.
            </p>
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-700">Email address</span>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
        </label>
        <button
          type="submit"
          disabled={status === 'loading' || !deadline}
          aria-busy={status === 'loading'}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        >
          {status === 'loading' ? 'Sending…' : 'Email Me My Deadline'}
        </button>
      </form>
      <p className="mt-2 text-xs text-neutral-400">
        By submitting, you agree to our{' '}
        <Link href="/privacy" className="underline hover:text-neutral-600">
          Privacy Policy
        </Link>
        . Deadline estimates are for educational purposes only.
      </p>
      {status === 'error' && (
        <p aria-live="polite" className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
