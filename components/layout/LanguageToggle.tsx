'use client'

import { usePathname } from 'next/navigation'
import { SLUG_MAP_ES, SLUG_MAP_EN } from '@/i18n/config'

// Maps English path prefixes to their Spanish equivalents and vice versa
const EN_TO_ES_PREFIXES: Record<string, string> = {
  '/accidents': '/es/accidentes',
  '/guides': '/es/guias',
  '/injuries': '/es/lesiones',
  '/tools': '/es/herramientas',
  '/states': '/es/estados',
}
const ES_TO_EN_PREFIXES: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TO_ES_PREFIXES).map(([en, es]) => [es, en])
)

function getEquivalentUrl(pathname: string, targetLocale: 'en' | 'es'): string {
  if (targetLocale === 'es') {
    if (pathname === '/') return '/es/'
    if (pathname.startsWith('/find-help')) return '/es/buscar-ayuda'

    for (const [enPrefix, esPrefix] of Object.entries(EN_TO_ES_PREFIXES)) {
      if (pathname === enPrefix) return esPrefix
      if (pathname.startsWith(enPrefix + '/')) {
        const segments = pathname.slice(enPrefix.length + 1).split('/')
        const translated = segments.map(seg => SLUG_MAP_ES[seg] ?? seg)
        return `${esPrefix}/${translated.join('/')}`
      }
    }
    return '/es/'
  } else {
    if (pathname === '/es/' || pathname === '/es') return '/'
    if (pathname.startsWith('/es/buscar-ayuda')) return '/find-help'

    for (const [esPrefix, enPrefix] of Object.entries(ES_TO_EN_PREFIXES)) {
      if (pathname === esPrefix) return enPrefix
      if (pathname.startsWith(esPrefix + '/')) {
        const segments = pathname.slice(esPrefix.length + 1).split('/')
        const translated = segments.map(seg => SLUG_MAP_EN[seg] ?? seg)
        return `${enPrefix}/${translated.join('/')}`
      }
    }
    return '/'
  }
}

interface LanguageToggleProps {
  variant?: 'light' | 'dark'
}

export function LanguageToggle({ variant = 'light' }: LanguageToggleProps) {
  const pathname = usePathname()
  const activeLocale = pathname.startsWith('/es') ? 'es' : 'en'

  function handleSwitch(locale: 'en' | 'es') {
    if (locale === activeLocale) return
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    window.location.href = getEquivalentUrl(pathname, locale)
  }

  const containerClass = variant === 'dark'
    ? 'flex items-center rounded-full border border-primary-700 overflow-hidden text-xs font-semibold tracking-wide shrink-0'
    : 'flex items-center rounded-full border border-neutral-200 overflow-hidden text-xs font-semibold tracking-wide shrink-0'

  const activeClass = 'bg-primary-600 text-white px-3 py-1.5 cursor-pointer transition-colors'

  const inactiveClass = variant === 'dark'
    ? 'px-3 py-1.5 cursor-pointer text-neutral-400 hover:text-white hover:bg-primary-700 transition-colors'
    : 'px-3 py-1.5 cursor-pointer text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors'

  return (
    <div className={containerClass} aria-label="Language selector">
      <button
        onClick={() => handleSwitch('en')}
        aria-label="Switch to English"
        aria-current={activeLocale === 'en' ? 'true' : undefined}
        className={activeLocale === 'en' ? activeClass : inactiveClass}
      >
        EN
      </button>
      <button
        onClick={() => handleSwitch('es')}
        aria-label="Cambiar a español"
        aria-current={activeLocale === 'es' ? 'true' : undefined}
        className={activeLocale === 'es' ? activeClass : inactiveClass}
      >
        ES
      </button>
    </div>
  )
}
