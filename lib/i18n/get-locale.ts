import { cookies, headers } from "next/headers"

import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./config"
import { isValidLocale } from "./locale-utils"

export { getLocaleFromParams, getLocaleFromPathname, isValidLocale } from "./locale-utils"

export async function getLocale(): Promise<Locale> {
  const headerLocale = (await headers()).get("x-locale")
  if (headerLocale && isValidLocale(headerLocale)) {
    return headerLocale
  }

  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale
  }

  return DEFAULT_LOCALE
}
