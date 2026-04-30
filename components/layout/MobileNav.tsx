'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'
import {
  NAV_ACCIDENT_TYPES,
  NAV_SIMPLE_LINKS,
  NAV_FIND_HELP,
  NAV_LABELS,
  type Locale,
} from '@/i18n/config'

// State guides remain English-only until DEV-37 adds Spanish state pages
const stateGuides = [
  { label: 'California', href: '/states/california' },
  { label: 'Arizona', href: '/states/arizona' },
]

interface MobileNavProps {
  locale?: Locale
  breakpoint?: 'lg' | 'xl'
}

export function MobileNav({ locale = 'en', breakpoint = 'lg' }: MobileNavProps) {
  const hiddenAbove = breakpoint === 'xl' ? 'xl:hidden' : 'lg:hidden'
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  const accidentTypes = NAV_ACCIDENT_TYPES[locale]
  const simpleLinks = NAV_SIMPLE_LINKS[locale]
  const findHelp = NAV_FIND_HELP[locale]
  const labels = NAV_LABELS[locale]

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
        className={`${hiddenAbove} p-2 rounded-md text-neutral-700 hover:bg-neutral-50 min-h-[44px] min-w-[44px] flex items-center justify-center`}
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-neutral-950/40 z-40 ${hiddenAbove}`}
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
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-surface-card z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${hiddenAbove} ${
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
              {labels.accidentTypes}
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
                  <Link
                    href={locale === 'es' ? '/es/accidentes' : '/accidents'}
                    onClick={close}
                    className="py-2 text-sm font-medium text-primary-600 hover:underline block min-h-[44px] flex items-center"
                  >
                    {labels.viewAllAccidents}
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Simple main links (without Find Help) */}
          {simpleLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="flex items-center w-full py-3 text-base font-medium text-neutral-900 hover:text-primary-600 transition-colors min-h-[44px] border-t border-neutral-50"
            >
              {link.label}
            </Link>
          ))}

          {/* Find Help — highlighted */}
          <Link
            href={findHelp.href}
            onClick={close}
            className="flex items-center w-full py-3 text-base font-medium text-amber-600 hover:text-amber-700 transition-colors min-h-[44px] border-t border-neutral-50"
          >
            {findHelp.label}
          </Link>

          {/* State Guides accordion */}
          <div className="border-t border-neutral-50">
            <button
              onClick={() => toggleSection('states')}
              aria-expanded={expandedSection === 'states'}
              className="flex items-center justify-between w-full py-3 text-base font-medium text-neutral-900 hover:text-primary-600 transition-colors min-h-[44px]"
            >
              {labels.stateGuides}
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
          <CTAButton href={findHelp.href} fullWidth onClick={close}>
            {labels.getHelpNow}
          </CTAButton>
        </div>
      </div>

      {/* Bottom-fixed CTA bar — mobile only */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 ${hiddenAbove} bg-surface-card border-t border-neutral-100 px-4 py-3 safe-area-pb`}>
        <CTAButton href={findHelp.href} variant="primary-dark" fullWidth>
          {labels.getHelpNowFull}
        </CTAButton>
      </div>
    </>
  )
}
