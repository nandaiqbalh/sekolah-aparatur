import type { MetadataRoute } from "next"

import { newsArticles } from "@/data/news"
import { programs } from "@/data/programs"
import { ROUTES, newsPath, registrationPath } from "@/lib/routes"
import { absoluteUrl } from "@/lib/site"

const STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.profil,
  ROUTES.sekolahAparatur,
  ROUTES.daerahDesa,
  ROUTES.legislator,
  ROUTES.berita,
  ROUTES.galeri,
  ROUTES.kontak,
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const paths = [
    ...STATIC_ROUTES,
    ...newsArticles.map((article) => newsPath(article.slug)),
    ...programs.map((program) => registrationPath(program.slug)),
  ]

  return paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === ROUTES.home ? "weekly" : "monthly",
    priority: path === ROUTES.home ? 1 : 0.7,
  }))
}
