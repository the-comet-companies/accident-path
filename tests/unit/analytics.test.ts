import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackEvent } from '@/lib/analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    // jsdom provides window — attach a mock gtag
    vi.stubGlobal('gtag', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls window.gtag with the event name', () => {
    trackEvent('test_event')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'test_event', undefined)
  })

  it('passes params to window.gtag', () => {
    trackEvent('tool_started', { tool_slug: 'accident-case-quiz' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).gtag).toHaveBeenCalledWith('event', 'tool_started', {
      tool_slug: 'accident-case-quiz',
    })
  })

  it('is a no-op when gtag is not loaded', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).gtag
    expect(() => trackEvent('intake_started')).not.toThrow()
  })
})
