type EventParams = Record<string, string | number>

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === 'undefined') return
  // @ts-expect-error gtag injected by GA4 script tag — not loaded until GA4 measurement ID is added to layout
  window.gtag?.('event', name, params)
}
