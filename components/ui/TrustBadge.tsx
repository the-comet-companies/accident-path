import { Shield, Lock, Clock, BadgeCheck } from 'lucide-react'

type BadgeVariant = 'shield' | 'lock' | 'clock' | 'badge'
type BadgeSize = 'sm' | 'lg'

interface TrustBadgeProps {
  variant: BadgeVariant
  text: string
  subtext?: string
  size?: BadgeSize
  className?: string
}

const icons: Record<BadgeVariant, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  lock: Lock,
  clock: Clock,
  badge: BadgeCheck,
}

export function TrustBadge({ variant, text, subtext, size = 'sm', className = '' }: TrustBadgeProps) {
  const Icon = icons[variant]

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary-500" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-950 leading-snug font-sans">{text}</p>
          {subtext && (
            <p className="text-sm text-neutral-500 leading-snug mt-0.5">{subtext}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Icon className="w-5 h-5 text-primary-500 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-neutral-950 leading-tight">{text}</p>
        {subtext && (
          <p className="text-xs text-neutral-500 leading-tight">{subtext}</p>
        )}
      </div>
    </div>
  )
}
