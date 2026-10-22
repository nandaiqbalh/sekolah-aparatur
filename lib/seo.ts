import type { Metadata } from "next"

import { type Locale } from "@/lib/i18n/config"
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site"

type BuildPageMetadataOptions = {
  locale: Locale
  path?: string
  title: string
  description: string
  keywords?: readonly string[]
  type?: "website" | "article"
}

function includesBrand(value: string) {
  return value.toLowerCase().includes(SITE_NAME.toLowerCase())
}

function withBrandTitle(title: string) {
  if (includesBrand(title)) return title
  return `${title} | ${SITE_NAME}`
}

function withBrandDescription(description: string) {
  if (includesBrand(description)) return description
  const trimmed = description.replace(/[.\s]+$/, "")
  return `${trimmed}. ${SITE_NAME}.`
}

export function fillSeoTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  )
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
  keywords,
  type = "website",
}: BuildPageMetadataOptions): Metadata {
  const normalizedPath = normalizePath(path)
  const canonicalPath = normalizedPath || "/"
  const socialTitle = withBrandTitle(title)
  const socialDescription = withBrandDescription(description)

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description: socialDescription,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale: locale === "id" ? "id_ID" : "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
    },
  }
}

export function jsonLdScript(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
