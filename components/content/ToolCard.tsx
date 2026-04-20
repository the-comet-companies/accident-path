import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  ctaText?: string
}

export function ToolCard({ title, description, href, icon, ctaText = 'Try It Free' }: ToolCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface-card border border-neutral-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-sans font-semibold text-neutral-950 text-base leading-snug">{title}</h3>
        <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors min-h-[44px] sm:min-h-0"
        aria-label={`${ctaText} — ${title}`}
      >
        {ctaText}
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
