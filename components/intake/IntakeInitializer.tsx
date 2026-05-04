'use client'

import { useEffect } from 'react'
import { INTAKE_STORAGE_KEY } from '@/lib/intake'

export function IntakeInitializer({
  accidentType,
  state,
}: {
  accidentType?: string
  state?: string
}) {
  useEffect(() => {
    if (!accidentType && !state) return
    const existing = localStorage.getItem(INTAKE_STORAGE_KEY)
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as Record<string, unknown>
        if (parsed?.accidentType || parsed?.state) return
      } catch {
        // corrupt storage — proceed with pre-fill
      }
    }
    const prefill: Record<string, string> = {}
    if (accidentType) prefill.accidentType = accidentType
    if (state) prefill.state = state
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(prefill))
  }, [accidentType, state])

  return null
}
