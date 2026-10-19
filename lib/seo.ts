import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site"

type BuildPageMetadataOptions = {
  locale: Locale
  path?: string
  title: string
  description: string
  type?: "website" | "article"
}

function normalizePath(path = ""): string {
  if (!path || path === "/") return ""
  return path.startsWith("/") ? path : `/${path}`
}

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  type = "website",
}: BuildPageMetadataOptions): Metadata {
  const normalizedPath = normalizePath(path)
  const canonicalPath = `/${locale}${normalizedPath}`
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((code) => [code, `/${code}${normalizedPath}`])
  )

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale: locale === "id" ? "id_ID" : "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
