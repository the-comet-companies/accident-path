'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'

const accidentTypes = [
  { label: 'Car Accidents', href: '/accidents/car' },
  { label: 'Truck Accidents', href: '/accidents/truck' },
  { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
  { label: 'Uber / Lyft Accidents', href: '/accidents/uber-lyft' },
  { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
  { label: 'Bicycle Accidents', href: '/accidents/bicycle' },
  { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
  { label: 'Dog Bites', href: '/accidents/dog-bite' },
  { label: 'Construction Injuries', href: '/accidents/construction' },
  { label: 'Workplace Injuries', href: '/accidents/workplace' },
  { label: 'Wrongful Death', href: '/accidents/wrongful-death' },
  { label: 'Premises Liability', href: '/accidents/premises' },
  { label: 'Product Liability', href: '/accidents/product' },
]

const stateGuides = [
  { label: 'California', href: '/states/california' },
  { label: 'Arizona', href: '/states/arizona' },
]

const mainLinks = [
  { label: 'Injuries', href: '/injuries' },
  { label: 'What To Do Next', href: '/guides' },
  { label: 'Tools', href: '/tools' },
  { label: 'Find Help', href: '/find-help' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setExpandedSection(null)
    openButtonRef.current?.focus()
  }, [])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const drawer = drawerRef.current
    if (!drawer) return

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    first?.focus()

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    drawer.addEventListener('keydown', trap)
    return () => drawer.removeEventListener('keydown', trap)
  }, [isOpen, expandedSection])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function toggleSection(section: string) {
    setExpandedSection(prev => (prev === section ? null : section))
  }

  return (
    <>
      {/* Hamburger button — shown on mobile only */}
      <button
        ref={openButtonRef}
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        className="lg:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/40 z-40 lg:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Slide-out drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-surface-card z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-100 shrink-0">
          <Link href="/" onClick={close} aria-label="AccidentPath home">
            <span className="text-lg font-bold text-primary-700 font-sans">
              Accident<span className="text-amber-500">Path</span>
            </span>
          </Link>
          <button
            onClick={close}
            aria-label="Close navigation menu"
            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer content */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          {/* Accident Types accordion */}
          <div>
            <button
              onClick={() => toggleSection('accidents')}
              aria-expanded={expandedSection === 'accidents'}
              className="flex items-center justify-between w-full py-3 text-base font-medium text-neutral-900 hover:text-primary-600 transition-colors min-h-[44px]"
            >
              Accident Types
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-150 ${expandedSection === 'accidents' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {expandedSection === 'accidents' && (
              <ul className="pl-3 mb-2 border-l-2 border-primary-100 space-y-1">
                {accidentTypes.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-1 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors min-h-[44px]"
                    >
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/accidents" onClick={close} className="py-2 text-sm font-medium text-primary-600 hover:underline block min-h-[44px] flex items-center">
                    View all →
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Simple main links */}
          {mainLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`flex items-center w-full py-3 text-base font-medium transition-colors min-h-[44px] border-t border-neutral-50 ${
                link.label === 'Find Help'
                  ? 'text-amber-600 hover:text-amber-700'
                  : 'text-neutral-900 hover:text-primary-600'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* State Guides accordion */}
          <div className="border-t border-neutral-50">
            <button
              onClick={() => toggleSection('states')}
              aria-expanded={expandedSection === 'states'}
              className="flex items-center justify-between w-full py-3 text-base font-medium text-neutral-900 hover:text-primary-600 transition-colors min-h-[44px]"
            >
              State Guides
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-150 ${expandedSection === 'states' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {expandedSection === 'states' && (
              <ul className="pl-3 mb-2 border-l-2 border-primary-100 space-y-1">
                {stateGuides.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-1 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors min-h-[44px]"
                    >
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Drawer footer CTA */}
        <div className="shrink-0 px-4 py-4 border-t border-neutral-100">
          <CTAButton href="/find-help" fullWidth onClick={close}>
            Get Help Now
          </CTAButton>
        </div>
      </div>

      {/* Bottom-fixed CTA bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-surface-card border-t border-neutral-100 px-4 py-3 safe-area-pb">
        <CTAButton href="/find-help" fullWidth>
          Get Help Now — Free, No Obligation
        </CTAButton>
      </div>
    </>
  )
}
