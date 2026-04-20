'use client'

import { useState, useEffect } from 'react'
import { X, Phone } from 'lucide-react'

const SESSION_KEY = 'ap_emergency_dismissed'

export function EmergencyBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-danger-50 border-b border-danger-500 px-4 py-2"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-neutral-950">
          <Phone className="w-4 h-4 text-danger-500 shrink-0" aria-hidden="true" />
          <span>
            <strong>In immediate danger?</strong> Call{' '}
            <a
              href="tel:911"
              className="font-bold text-danger-500 underline underline-offset-2"
              aria-label="Call 911 for emergencies"
            >
              911
            </a>
            . For medical emergencies, seek care immediately.
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss emergency notice"
          className="shrink-0 p-1 rounded hover:bg-danger-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-4 h-4 text-neutral-500" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
