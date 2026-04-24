import Link from 'next/link'
import { TrustBadge } from '@/components/ui/TrustBadge'

const accidentLinks = [
  { label: 'Car Accidents', href: '/accidents/car' },
  { label: 'Truck Accidents', href: '/accidents/truck' },
  { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
  { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
  { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
  { label: 'Workplace Injuries', href: '/accidents/workplace' },
  { label: 'View All Accident Types', href: '/accidents' },
]

const resourceLinks = [
  { label: 'Accident Guides', href: '/guides' },
  { label: 'Injury Types', href: '/injuries' },
  { label: 'Free Tools', href: '/tools' },
  { label: 'California Guide', href: '/states/california' },
  { label: 'Arizona Guide', href: '/states/arizona' },
  { label: 'Find an Attorney', href: '/find-help' },
]

const companyLinks = [
  { label: 'How It Works', href: '/about/how-it-works' },
  { label: 'About Us', href: '/about' },
  { label: 'For Attorneys', href: '/for-attorneys' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Do Not Sell My Info', href: '/privacy#do-not-sell' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Disclaimers', href: '/disclaimers' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer aria-label="Site footer" className="bg-primary-900 text-neutral-300">

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
              Your path to recovery starts here. Clear guidance after an accident, smart next steps, and help finding the right attorney.
            </p>
            <div className="space-y-2 pt-2">
              <TrustBadge
                variant="shield"
                text="Attorney-Reviewed Content"
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
              <TrustBadge
                variant="lock"
                text="Your information is secure"
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
              <TrustBadge
                variant="clock"
                text="Free consultation — no obligation"
                className="text-neutral-300 [&_svg]:text-amber-500 [&_p]:text-neutral-300"
              />
            </div>
          </div>

          {/* Col 2: Accident Types */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Accident Types
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
              Resources
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
              Company
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
          <p className="text-xs text-neutral-500 leading-relaxed">
            AccidentPath is not a law firm and does not provide legal advice. Information provided is for educational purposes only. By using this site, you acknowledge that no attorney-client relationship is formed. If you are in immediate danger, call 911. For medical emergencies, seek care immediately.
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            AccidentPath connects consumers with attorneys in our network. Attorneys in our network may pay a fee for marketing services. This does not affect the quality of service you receive. AccidentPath does not endorse or guarantee any attorney&apos;s services. Availability varies by state and case type.
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Every case is different. Consult a licensed attorney for advice specific to your situation. Results may vary. Past results do not guarantee future outcomes.
          </p>
        </div>
      </div>

      {/* Bottom bar: emergency + copyright + CCPA */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-neutral-500">
            <strong className="text-neutral-400">Emergency?</strong>{' '}
            <a href="tel:911" className="text-danger-500 font-bold hover:underline">
              Call 911
            </a>{' '}
            &middot; Seek immediate medical care for injuries.
          </p>
          <p className="text-xs text-neutral-500">
            &copy; {currentYear} AccidentPath. All rights reserved.{' '}
            <Link href="/privacy#do-not-sell" className="text-amber-400 hover:text-amber-300 underline">
              Do Not Sell My Info
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
