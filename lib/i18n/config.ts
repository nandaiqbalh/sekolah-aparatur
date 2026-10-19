export const LOCALE_COOKIE = "locale"
export const DEFAULT_LOCALE = "id"
export const SUPPORTED_LOCALES = ["en", "id"] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
