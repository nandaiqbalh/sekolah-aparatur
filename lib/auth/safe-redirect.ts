const ADMIN_PUBLIC_PREFIXES = ["/admin/login"] as const

export const ADMIN_LOGIN_PATH = "/admin/login"
export const ADMIN_DEFAULT_REDIRECT = "/admin"
export const PATHNAME_HEADER = "x-pathname"

export function isSafeInternalPath(
  value: string | null | undefined
): value is string {
  if (!value) return false
  if (!value.startsWith("/")) return false
  if (value.startsWith("//")) return false
  if (value.includes("://")) return false
  if (value.includes("\\")) return false
  return true
}

function pathMatchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function isAdminPublicPath(pathname: string): boolean {
  return ADMIN_PUBLIC_PREFIXES.some((p) => pathMatchesPrefix(pathname, p))
}

export function safeAdminRedirect(
  value: string | null | undefined
): string {
  if (!isSafeInternalPath(value)) return ADMIN_DEFAULT_REDIRECT
  if (!pathMatchesPrefix(value, "/admin")) return ADMIN_DEFAULT_REDIRECT
  if (isAdminPublicPath(value)) return ADMIN_DEFAULT_REDIRECT
  return value
}

export function withLoginRedirect(
  loginPath: typeof ADMIN_LOGIN_PATH,
  pathname: string | null | undefined
): string {
  if (!isSafeInternalPath(pathname)) return loginPath
  if (!pathMatchesPrefix(pathname, "/admin") || isAdminPublicPath(pathname)) {
    return loginPath
  }
  return `${loginPath}?redirect=${encodeURIComponent(pathname)}`
}

export function getPathnameFromHeaders(headerList: Headers): string | null {
  return headerList.get(PATHNAME_HEADER)
}
