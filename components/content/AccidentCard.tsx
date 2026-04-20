import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AccidentCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function AccidentCard({ title, description, href, icon }: AccidentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl bg-surface-card border border-neutral-100 p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
          {icon}
        </div>
        <ArrowRight
          className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200"
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="font-sans font-semibold text-neutral-950 text-base leading-snug">{title}</h3>
        <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}
