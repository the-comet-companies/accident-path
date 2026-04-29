import { NextRequest, NextResponse } from 'next/server'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const SPANISH_PREFIX = '/es'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run locale detection on the root path
  if (pathname !== '/') {
    return NextResponse.next()
  }

  // 1. Check cookie first
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale === 'es') {
    return NextResponse.redirect(new URL(SPANISH_PREFIX + '/', request.url))
  }
  if (cookieLocale === 'en') {
    return NextResponse.next()
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const primaryLang = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() ?? ''

  if (primaryLang.startsWith('es')) {
    return NextResponse.redirect(new URL(SPANISH_PREFIX + '/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
