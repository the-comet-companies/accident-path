'use client'

import { useState } from 'react'
import type { LeadCaptureConfig } from '@/lib/tools/lead-capture-config'

interface Props {
  toolSlug: string
  config: LeadCaptureConfig
  toolContext: Record<string, string>
}

export function ToolLeadCapture({ toolSlug, config, toolContext }: Props) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [consent, setConsent] = useState(false)
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
          pattern: config.fields.includes('city') ? 'C' : 'A',
          email: config.fields.includes('email') ? email : undefined,
          phone: config.fields.includes('phone') ? phone : undefined,
          city: config.fields.includes('city') ? city : undefined,
          consent: config.requiresTcpa ? consent : true,
          toolContext,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center print:hidden">
        <p className="text-sm font-medium text-green-800">{config.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50 p-5 print:hidden">
      <p className="mb-3 text-sm font-semibold text-primary-900">{config.hook}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {config.fields.includes('email') && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-700">Email address</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </label>
        )}
        {config.fields.includes('phone') && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-700">Phone number</span>
            <input
              type="tel"
              required
              placeholder="(555) 555-5555"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </label>
        )}
        {config.fields.includes('city') && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-700">Your city</span>
            <input
              type="text"
              required
              placeholder="e.g. Los Angeles"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </label>
        )}
        {config.requiresTcpa && (
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0 accent-primary-600"
            />
            <span className="text-xs text-neutral-600">
              By submitting, I consent to receive calls, texts, and emails from AccidentPath
              regarding my inquiry.{' '}
              <a href="/privacy" className="underline hover:text-primary-700">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        )}
        <button
          type="submit"
          disabled={status === 'loading' || (config.requiresTcpa && !consent)}
          className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : config.buttonLabel}
        </button>
        {status === 'error' && (
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
