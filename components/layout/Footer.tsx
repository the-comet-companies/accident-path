import Link from 'next/link'
import { TrustBadge } from '@/components/ui/TrustBadge'
import { LanguageToggle } from '@/components/layout/LanguageToggle'
import { FOOTER_ACCIDENT_LINKS, FOOTER_RESOURCE_LINKS, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

function getCompanyLinks(locale: Locale) {
  return [
    { label: locale === 'es' ? 'Cómo Funciona' : 'How It Works', href: '/about/how-it-works' },
    { label: locale === 'es' ? 'Sobre Nosotros' : 'About Us', href: '/about' },
    { label: locale === 'es' ? 'Contacto' : 'Contact Us', href: locale === 'es' ? '/es/contacto' : '/contact' },
    { label: locale === 'es' ? 'Para Abogados' : 'For Attorneys', href: '/for-attorneys' },
    { label: locale === 'es' ? 'Política de Privacidad' : 'Privacy Policy', href: '/privacy' },
    { label: 'Do Not Sell My Info', href: '/privacy#do-not-sell' },
    { label: locale === 'es' ? 'Términos de Servicio' : 'Terms of Service', href: '/terms' },
    { label: locale === 'es' ? 'Descargos de Responsabilidad' : 'Disclaimers', href: '/disclaimers' },
    { label: locale === 'es' ? 'Política de Cookies' : 'Cookie Policy', href: '/cookie-policy' },
  ]
}

const currentYear = new Date().getFullYear()

interface FooterProps {
  locale?: Locale
  dict: Dictionary
}

export function Footer({ locale = 'en', dict }: FooterProps) {
  const accidentLinks = FOOTER_ACCIDENT_LINKS[locale]
  const resourceLinks = FOOTER_RESOURCE_LINKS[locale]
  const companyLinks = getCompanyLinks(locale)
  const t = dict.footer
  const trust = dict.trust

  return (
    <footer aria-label="Site footer" className="bg-primary-900 text-neutral-300 pb-20 lg:pb-0">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="AccidentPath home">
              <span className="text-xl font-bold text-white font-sans tracking-tight">
                Accident<span className="text-amber-500">Path</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              {locale === 'es'
                ? 'Su camino hacia la recuperación comienza aquí. Orientación clara después de un accidente y ayuda para encontrar el abogado adecuado.'
                : 'Your path to recovery starts here. Clear guidance after an accident, smart next steps, and help finding the right attorney.'}
            </p>
            <div className="space-y-2 pt-2">
              <TrustBadge
                variant="shield"
                text={trust.contentReview}
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
              <TrustBadge
                variant="lock"
                text={trust.infoSecure}
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
              <TrustBadge
                variant="clock"
                text={trust.freeConsult}
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
            </div>
          </div>

          {/* Col 2: Accident Types */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.accidentTypes}
            </h3>
            <ul className="space-y-2">
              {accidentLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.resources}
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.company}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors ${
                      link.label === 'Do Not Sell My Info'
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer block */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
          <p className="text-xs text-neutral-500 leading-relaxed">{t.disclaimer1}</p>
          <p className="text-xs text-neutral-500 leading-relaxed">{t.disclaimer2}</p>
          <p className="text-xs text-neutral-500 leading-relaxed">{t.disclaimer3}</p>
        </div>
      </div>

      {/* Bottom bar: emergency + copyright + CCPA + language toggle */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-neutral-500">
            <strong className="text-neutral-400">{t.emergency}</strong>{' '}
            <a href="tel:911" className="text-danger-500 font-bold hover:underline">
              {t.call911}
            </a>{' '}
            &middot; {locale === 'es' ? 'Busque atención médica inmediata.' : 'Seek immediate medical care for injuries.'}
          </p>
          <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
            <p className="text-xs text-neutral-500 min-w-0">
              &copy; {currentYear} AccidentPath. {t.copyright}{' '}
              <Link href="/privacy#do-not-sell" className="text-amber-400 hover:text-amber-300 underline">
                {t.doNotSell}
              </Link>
            </p>
            <LanguageToggle variant="dark" />
          </div>
        </div>
      </div>
    </footer>
  )
}
