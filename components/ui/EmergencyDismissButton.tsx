'use client'

const SESSION_KEY = 'ap_emergency_dismissed'

export function EmergencyDismissButton() {
  function dismiss() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {}
    const banner = document.getElementById('emergency-banner')
    if (banner) banner.style.display = 'none'
  }

  return (
    <button
      onClick={dismiss}
      aria-label="Dismiss emergency notice"
      className="shrink-0 p-1 rounded hover:bg-danger-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      {/* X icon via SVG — avoids importing lucide in a client bundle just for one icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-500"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}
