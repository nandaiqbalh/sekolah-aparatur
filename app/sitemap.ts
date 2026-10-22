import type { MetadataRoute } from "next"

import { galleryService } from "@/features/galeri/services/gallery-service"
import { newsService } from "@/features/informasi/services/news-service"
import { programService } from "@/features/program/services/program-service"
import { ROUTES, galleryPath, newsPath, programPath, registrationPath } from "@/lib/routes"
import { absoluteUrl } from "@/lib/site"

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, albums, programs] = await Promise.all([
    newsService.listSitemap(),
    galleryService.listSitemap(),
    programService.listSitemap(),
  ])

  return [
    entry(ROUTES.home, 1, "weekly"),
    entry(ROUTES.sekolahAparatur, 0.9, "weekly"),
    ...programs.map((program) => entry(programPath(program.slug), 0.9, "weekly", program.updatedAt)),
    ...programs.map((program) => entry(registrationPath(program.slug), 0.8, "weekly", program.updatedAt)),
    entry(ROUTES.profil, 0.7, "monthly"),
    entry(ROUTES.berita, 0.6, "weekly"),
    ...articles.map((article) => entry(newsPath(article.slug), 0.5, "monthly", article.updatedAt)),
    entry(ROUTES.galeri, 0.5, "monthly"),
    ...albums.map((album) => entry(galleryPath(album.slug), 0.4, "yearly", album.updatedAt)),
    entry(ROUTES.kontak, 0.5, "monthly"),
  ]
}
