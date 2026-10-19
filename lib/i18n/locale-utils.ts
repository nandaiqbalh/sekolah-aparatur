import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "./config"

export function isValidLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function getLocaleFromParams(locale: string): Locale {
  if (isValidLocale(locale)) return locale
  return DEFAULT_LOCALE
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0]
  if (segment && isValidLocale(segment)) return segment
  return DEFAULT_LOCALE
}
