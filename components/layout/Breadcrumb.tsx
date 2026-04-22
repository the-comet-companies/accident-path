import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SchemaOrg } from '@/components/seo/SchemaOrg'
import { breadcrumbSchema } from '@/lib/seo'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

export function Breadcrumb({ items, variant = 'light' }: BreadcrumbProps) {
  const withHome: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items]

  const isDark = variant === 'dark'
  const baseColor = isDark ? 'text-white/50' : 'text-neutral-500'
  const currentColor = isDark ? 'text-white/90 font-medium' : 'text-neutral-950 font-medium'
  const linkHover = isDark
    ? 'hover:text-white transition-colors underline-offset-2 hover:underline'
    : 'hover:text-primary-600 transition-colors underline-offset-2 hover:underline'

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(items)} id="breadcrumb-jsonld" />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className={`flex flex-wrap items-center gap-1 text-sm ${baseColor}`}>
          {withHome.map((item, index) => {
            const isLast = index === withHome.length - 1
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                {isLast || !item.href ? (
                  <span
                    className={currentColor}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={linkHover}>
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
