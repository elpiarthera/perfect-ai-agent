import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
})

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Remove restrictive cache headers that next-intl sets,
  // so that statically generated pages can be cached by the CDN.
  // API routes and dynamic routes will set their own headers.
  response.headers.delete('cache-control')
  response.headers.delete('x-middleware-cache')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|opengraph-image|icon|favicon|sitemap|robots|feed\\.xml|.*\\..*).*)',
  ],
}
