import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  ADMIN_LOGIN_PATH,
  PATHNAME_HEADER,
  withLoginRedirect,
} from "@/lib/auth/safe-redirect"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/lib/i18n/config"

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  const acceptLanguage =
    request.headers.get("accept-language")?.toLowerCase() ?? ""
  if (acceptLanguage.includes("id")) return "id"

  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin")) {
    const isPublic =
      pathname === "/admin/login" || pathname.startsWith("/admin/login/")
    if (!isPublic) {
      const token = request.cookies.get("session_token")?.value
      if (!token) {
        const loginPath = withLoginRedirect(ADMIN_LOGIN_PATH, pathname)
        return NextResponse.redirect(new URL(loginPath, request.url))
      }
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(PATHNAME_HEADER, pathname)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1] as Locale
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-locale", locale)
    requestHeaders.set(PATHNAME_HEADER, pathname)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const locale = resolvePreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
