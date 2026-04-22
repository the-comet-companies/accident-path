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

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(items)} id="breadcrumb-jsonld" />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className={`flex flex-wrap items-center gap-1 text-sm ${
          variant === 'dark' ? 'text-primary-300' : 'text-neutral-500'
        }`}>
          {withHome.map((item, index) => {
            const isLast = index === withHome.length - 1
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                {isLast || !item.href ? (
                  <span
                    className={`font-medium ${
                      variant === 'dark' ? 'text-white' : 'text-neutral-950'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors underline-offset-2 hover:underline ${
                      variant === 'dark'
                        ? 'hover:text-primary-100'
                        : 'hover:text-primary-600'
                    }`}
                  >
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
