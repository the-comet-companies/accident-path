'use client'

import { useLayoutEffect, useRef } from 'react'
import { EmergencyDismissButton } from './EmergencyDismissButton'

const SESSION_KEY = 'ap_emergency_dismissed'

interface EmergencyBannerProps {
  locale?: 'en' | 'es'
}

export function EmergencyBanner({ locale = 'en' }: EmergencyBannerProps) {
  const isEs = locale === 'es'
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) && ref.current) {
        ref.current.style.display = 'none'
      }
    } catch {}
  }, [])

  return (
    <div
      ref={ref}
      id="emergency-banner"
        role="alert"
        aria-live="polite"
        className="bg-danger-50 border-b border-danger-500 px-4 py-2"
      >
        <div className="max-w-7xl mx-auto relative flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-neutral-950">
            {/* Phone icon via SVG — server component can't import lucide */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-danger-500 shrink-0"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>
              {isEs ? (
                <>
                  <strong>¿En peligro?</strong> Llame al{' '}
                  <a
                    href="tel:911"
                    className="font-bold text-danger-700 underline underline-offset-2"
                    aria-label="Llame al 911 para emergencias"
                  >
                    911
                  </a>
                  . Busque atención médica inmediata.
                </>
              ) : (
                <>
                  <strong>In immediate danger?</strong> Call{' '}
                  <a
                    href="tel:911"
                    className="font-bold text-danger-700 underline underline-offset-2"
                    aria-label="Call 911 for emergencies"
                  >
                    911
                  </a>
                  . For medical emergencies, seek care immediately.
                </>
              )}
            </span>
          </div>
          <div className="absolute right-0"><EmergencyDismissButton /></div>
        </div>
    </div>
  )
}
