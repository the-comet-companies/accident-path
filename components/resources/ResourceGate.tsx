'use client'

import { useState } from 'react'
import { CheckCircle, Lock } from 'lucide-react'
import type { Resource } from '@/types/content'
import { ConsentCheckbox } from '@/components/intake/ConsentCheckbox'
import { CTAButton } from '@/components/ui/CTAButton'
import { trackEvent } from '@/lib/analytics'

const INPUT_CLASS =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'

export function ResourceGate({ resource }: { resource: Resource }) {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: resource.toolSlug,
          pattern: 'R',
          email,
          phone,
          consent,
          toolContext: {
            resourceTitle: resource.headline,
            resourceSlug: resource.slug,
            name,
          },
        }),
      })
      if (!res.ok) throw new Error()
      setUnlocked(true)
      trackEvent('tool_lead_submitted', { toolSlug: resource.toolSlug })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

      {/* Split gate panel */}
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:items-start">

        {/* Left: teaser bullets */}
        <div>
          <p className="text-neutral-600 text-base leading-relaxed font-serif mb-6">
            {resource.teaser}
          </p>
          <div className="rounded-xl border border-neutral-200 bg-surface-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-neutral-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-neutral-700">What&apos;s inside:</span>
            </div>
            <ul className="flex flex-col gap-3">
              {resource.teaserBullets.map((bullet, i) => {
                const isLast = i === resource.teaserBullets.length - 1
                return (
                  <li key={i} className={`flex items-start gap-2.5 ${isLast ? 'opacity-40' : ''}`}>
                    <CheckCircle
                      className="w-4 h-4 text-primary-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-neutral-700 leading-relaxed">{bullet}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Right: form or success */}
        <div className="mt-8 lg:mt-0">
          {unlocked ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" aria-hidden="true" />
              <p className="font-semibold text-green-800 text-sm">
                You&apos;re in — check your inbox shortly.
              </p>
              <p className="text-green-700 text-xs mt-1">Scroll down to read the full resource.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
              <p className="font-sans font-semibold text-primary-900 text-sm mb-4">
                Get Free Instant Access
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="sr-only" htmlFor="resource-name">Full Name</label>
                <input
                  id="resource-name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={INPUT_CLASS}
                />
                <label className="sr-only" htmlFor="resource-email">Email Address</label>
                <input
                  id="resource-email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={INPUT_CLASS}
                />
                <label className="sr-only" htmlFor="resource-phone">Phone Number</label>
                <input
                  id="resource-phone"
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={INPUT_CLASS}
                />
                <ConsentCheckbox checked={consent} onChange={setConsent} />
                <button
                  type="submit"
                  disabled={!consent || status === 'loading'}
                  className="w-full rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {status === 'loading' ? 'Submitting…' : 'Unlock Free Resource →'}
                </button>
                {status === 'error' && (
                  <p aria-live="polite" className="text-xs text-red-600 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Revealed content */}
      {unlocked && (
        <div className="mt-12 max-w-2xl">
          <ol className="flex flex-col gap-10">
            {resource.content.map((item, i) => (
              <li key={i} className="flex gap-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h2 className="font-sans font-bold text-neutral-950 text-base mb-2">
                    {item.heading}
                  </h2>
                  <p className="text-neutral-600 text-sm leading-relaxed font-serif">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 mb-4">Ready to take the next step?</p>
            <CTAButton href="/find-help" size="md">Get Free Personalized Guidance</CTAButton>
          </div>
        </div>
      )}
    </div>
  )
}
