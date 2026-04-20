'use client'

import { usePathname } from 'next/navigation'
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner'
import type { ComponentType } from 'react'

type DisclaimerVariant = 'default' | 'intake' | 'tool' | 'state'

function getVariantForPath(pathname: string): DisclaimerVariant {
  if (pathname.startsWith('/tools')) return 'tool'
  if (pathname.startsWith('/find-help')) return 'intake'
  if (pathname.startsWith('/states')) return 'state'
  return 'default'
}

interface ComplianceWrapperProps {
  children: React.ReactNode
  className?: string
}

/** Wrapper component — auto-injects the correct DisclaimerBanner for the current route. */
export function ComplianceWrapper({ children, className = '' }: ComplianceWrapperProps) {
  const pathname = usePathname()
  const variant = getVariantForPath(pathname)

  return (
    <div className={className}>
      {children}
      <DisclaimerBanner variant={variant} className="mt-8" />
    </div>
  )
}

/** HOC version — wraps a page component with ComplianceWrapper. */
export function withCompliance<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  function WithComplianceComponent(props: P) {
    return (
      <ComplianceWrapper>
        <WrappedComponent {...props} />
      </ComplianceWrapper>
    )
  }
  WithComplianceComponent.displayName = `withCompliance(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return WithComplianceComponent
}

/** Standalone hook — returns the correct variant for the current route. */
export function useDisclaimerVariant(): DisclaimerVariant {
  const pathname = usePathname()
  return getVariantForPath(pathname)
}
