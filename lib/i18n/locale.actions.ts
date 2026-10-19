"use server"

import { cookies } from "next/headers"

import { LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from "./config"

export async function setLocaleAction(
  locale: Locale
): Promise<{ success: boolean }> {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return { success: false }
  }

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  })

  return { success: true }
}
