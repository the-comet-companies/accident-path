'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import {
  NAV_ACCIDENT_TYPES,
  NAV_SIMPLE_LINKS,
  NAV_FIND_HELP,
  NAV_LABELS,
  type Locale,
} from '@/i18n/config'

// State guides remain English-only until DEV-37 adds Spanish state pages
const stateGuides = [
  {
    state: 'California',
    href: '/states/california',
    cities: [
      { label: 'Los Angeles', href: '/states/california/los-angeles' },
      { label: 'San Diego', href: '/states/california/san-diego' },
      { label: 'San Francisco', href: '/states/california/san-francisco' },
      { label: 'San Jose', href: '/states/california/san-jose' },
      { label: 'Sacramento', href: '/states/california/sacramento' },
      { label: 'Fresno', href: '/states/california/fresno' },
    ],
  },
  {
    state: 'Arizona',
    href: '/states/arizona',
    cities: [
      { label: 'Phoenix', href: '/states/arizona/phoenix' },
      { label: 'Tucson', href: '/states/arizona/tucson' },
      { label: 'Mesa', href: '/states/arizona/mesa' },
      { label: 'Scottsdale', href: '/states/arizona/scottsdale' },
      { label: 'Chandler', href: '/states/arizona/chandler' },
      { label: 'Gilbert', href: '/states/arizona/gilbert' },
    ],
  },
]

type OpenMenu = 'accidents' | 'states' | null

interface HeaderProps {
  locale?: Locale
}

export function Header({ locale = 'en' }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const accidentTypes = NAV_ACCIDENT_TYPES[locale]
  const simpleLinks = NAV_SIMPLE_LINKS[locale]
  const findHelp = NAV_FIND_HELP[locale]
  const labels = NAV_LABELS[locale]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  function openOnHover(menu: OpenMenu) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(menu)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180)
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  function toggle(menu: OpenMenu) {
    setOpenMenu(prev => (prev === menu ? null : menu))
  }

  return (
    <header className="bg-surface-card border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={menuRef}>
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href={locale === 'es' ? '/es/' : '/'}
            className="flex items-center gap-2 shrink-0"
            aria-label={locale === 'es' ? 'AccidentPath inicio' : 'AccidentPath home'}
          >
            <span className="text-xl font-bold text-primary-700 font-sans tracking-tight">
              Accident<span className="text-amber-500">Path</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">

            {/* Accident Types mega-menu trigger */}
            <button
              aria-expanded={openMenu === 'accidents'}
              aria-haspopup="true"
              onClick={() => toggle('accidents')}
              onMouseEnter={() => openOnHover('accidents')}
              onMouseLeave={scheduleClose}
              className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              {labels.accidentTypes}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-150 shrink-0 ${openMenu === 'accidents' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {/* Simple links */}
            {simpleLinks.slice(0, 3).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Find Help — highlighted */}
            <Link
              href={findHelp.href}
              className="px-2.5 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 rounded-md hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              {findHelp.label}
            </Link>

            {/* State Guides mega-menu trigger */}
            <button
              aria-expanded={openMenu === 'states'}
              aria-haspopup="true"
              onClick={() => toggle('states')}
              onMouseEnter={() => openOnHover('states')}
              onMouseLeave={scheduleClose}
              className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              {labels.stateGuides}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-150 shrink-0 ${openMenu === 'states' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {/* Remaining simple links */}
            {simpleLinks.slice(3).map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

          </nav>

          {/* Desktop CTA + language toggle */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageToggle />
            <CTAButton href={findHelp.href} size="sm">{labels.getHelpNow}</CTAButton>
          </div>
        </div>

        {/* Mega-menu: Accident Types */}
        {openMenu === 'accidents' && (
          <div
            role="region"
            aria-label="Accident types menu"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 right-0 top-16 bg-surface-card border-b border-neutral-100 shadow-lg z-40 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                {labels.accidentTypes}
              </p>
              <ul className="grid grid-cols-4 gap-x-8 gap-y-2">
                {accidentTypes.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="text-sm text-neutral-700 hover:text-primary-600 hover:underline underline-offset-2 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Link
                  href={locale === 'es' ? '/es/accidentes' : '/accidents'}
                  onClick={() => setOpenMenu(null)}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  {labels.viewAllAccidents}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mega-menu: State Guides */}
        {openMenu === 'states' && (
          <div
            role="region"
            aria-label="State guides menu"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 right-0 top-16 bg-surface-card border-b border-neutral-100 shadow-lg z-40 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              <div className="grid grid-cols-2 gap-10">
                {stateGuides.map(stateData => (
                  <div key={stateData.href}>
                    <Link
                      href={stateData.href}
                      onClick={() => setOpenMenu(null)}
                      className="text-sm font-semibold text-primary-700 hover:underline mb-2 block"
                    >
                      {stateData.state}
                    </Link>
                    <ul className="grid grid-cols-2 gap-1">
                      {stateData.cities.map(city => (
                        <li key={city.href}>
                          <Link
                            href={city.href}
                            onClick={() => setOpenMenu(null)}
                            className="text-sm text-neutral-700 hover:text-primary-600 hover:underline underline-offset-2 transition-colors"
                          >
                            {city.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Link
                  href="/states"
                  onClick={() => setOpenMenu(null)}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  {labels.viewAllStates}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
