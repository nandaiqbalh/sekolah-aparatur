import type { MetadataRoute } from "next"

import { galleryAlbums } from "@/data/gallery"
import { newsArticles } from "@/data/news"
import { programs } from "@/data/programs"
import { sekolahClasses } from "@/data/sekolah-classes"
import { ROUTES, galleryPath, newsPath, registrationPath } from "@/lib/routes"
import { absoluteUrl } from "@/lib/site"

const STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.profil,
  ROUTES.sekolahAparatur,
  ROUTES.aparaturPemerintah,
  ROUTES.aparaturDesa,
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
    ...galleryAlbums.map((album) => galleryPath(album.slug)),
    ...programs.map((program) => registrationPath(program.slug)),
    ...sekolahClasses.map((item) => registrationPath(item.slug)),
  ]

  return paths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === ROUTES.home ? "weekly" : "monthly",
    priority: path === ROUTES.home ? 1 : 0.7,
  }))
}
