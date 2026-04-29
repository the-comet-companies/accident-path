import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'
import { getDictionary } from '@/i18n/dictionaries'

export default async function EsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dict = await getDictionary('es')

  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block sticky top-0 z-50">
        <Header locale="es" />
      </div>
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-50 bg-surface-card border-b border-neutral-100 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/es/" aria-label="AccidentPath inicio">
            <span className="text-lg font-bold text-primary-700 font-sans">
              Accident<span className="text-amber-500">Path</span>
            </span>
          </Link>
          <MobileNav locale="es" />
        </div>
      </div>
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer locale="es" dict={dict} />
    </>
  )
}
