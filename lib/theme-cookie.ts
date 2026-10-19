export const THEME_COOKIE_NAME = "theme"

export type Theme = "light" | "dark"

export function parseTheme(value: string | undefined | null): Theme | null {
  if (value === "light" || value === "dark") return value
  return null
}

export function getThemeCookie(): Theme | null {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`)
  )

  return parseTheme(match?.[1])
}

export function setThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=31536000;SameSite=Lax`
}
