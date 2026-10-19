import { type Locale } from "./config"
import { isValidLocale } from "./locale-utils"

export function localizedHref(_locale: Locale, path = ""): string {
  if (!path || path === "/") return "/"
  return path.startsWith("/") ? path : `/${path}`
}

export function switchLocalePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const rest = segments.slice(1).join("/")
    return rest ? `/${rest}` : "/"
  }
  return pathname || "/"
}
