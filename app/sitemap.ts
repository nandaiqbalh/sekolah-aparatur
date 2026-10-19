import type { MetadataRoute } from "next"

import { SUPPORTED_LOCALES } from "@/lib/i18n/config"
import { ROUTES, localizedPath } from "@/lib/routes"
import { absoluteUrl } from "@/lib/site"

const SITEMAP_ROUTES = [
  {
    path: ROUTES.home,
    changeFrequency: "monthly" as const,
    priority: 1,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return SUPPORTED_LOCALES.flatMap((locale) =>
    SITEMAP_ROUTES.map((route) => ({
      url: absoluteUrl(localizedPath(locale, route.path)),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  )
}
