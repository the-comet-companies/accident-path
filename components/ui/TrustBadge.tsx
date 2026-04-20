import { Shield, Lock, Clock, BadgeCheck } from 'lucide-react'

type BadgeVariant = 'shield' | 'lock' | 'clock' | 'badge'

interface TrustBadgeProps {
  variant: BadgeVariant
  text: string
  subtext?: string
  className?: string
}

const icons: Record<BadgeVariant, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  lock: Lock,
  clock: Clock,
  badge: BadgeCheck,
}

export function TrustBadge({ variant, text, subtext, className = '' }: TrustBadgeProps) {
  const Icon = icons[variant]

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
