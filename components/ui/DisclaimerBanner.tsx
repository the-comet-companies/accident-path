type DisclaimerVariant = 'default' | 'intake' | 'tool' | 'state'

interface DisclaimerBannerProps {
  variant?: DisclaimerVariant
  className?: string
}

const disclaimerText: Record<DisclaimerVariant, string> = {
  default:
    'AccidentPath is not a law firm and does not provide legal advice. Information provided is for educational purposes only. By using this site, you acknowledge that no attorney-client relationship is formed. If you are in immediate danger, call 911. For medical emergencies, seek care immediately.',
  intake:
    'AccidentPath connects consumers with attorneys in our network. Attorneys in our network may pay a fee for marketing services. This does not affect the quality of service you receive. AccidentPath does not endorse or guarantee any attorney\u2019s services.',
  tool:
    'This tool is for informational and educational purposes only. It does not constitute legal advice and should not be relied upon as such. Consult a licensed attorney for advice specific to your situation.',
  state:
    'Laws vary by state. The information on this page is general in nature and may not reflect the current law in your jurisdiction. Consult a licensed attorney in your state for specific guidance.',
}

export function DisclaimerBanner({ variant = 'default', className = '' }: DisclaimerBannerProps) {
  return (
    <aside
      aria-label="Legal disclaimer"
      className={`bg-neutral-50 border border-neutral-100 rounded-lg px-4 py-3 ${className}`}
    >
      <p className="text-sm text-neutral-500 leading-relaxed">{disclaimerText[variant]}</p>
    </aside>
  )
}
