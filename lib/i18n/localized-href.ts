import { type Locale } from "./config"

export function localizedHref(locale: Locale, path = ""): string {
  const normalized =
    path === "/" ? "" : path.startsWith("/") ? path : path ? `/${path}` : ""
  if (!normalized) return `/${locale}`
  return `/${locale}${normalized}`
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 0 && (segments[0] === "en" || segments[0] === "id")) {
    segments[0] = nextLocale
    return `/${segments.join("/")}`
  }
  return localizedHref(nextLocale, pathname)
}
