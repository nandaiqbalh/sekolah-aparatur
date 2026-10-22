import type { Metadata } from "next"

import { NewsCard } from "@/components/public/news-card"
import { PageHero } from "@/components/public/page-hero"
import { newsService } from "@/features/informasi/services/news-service"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: ROUTES.berita,
    title: dict.meta.news.title,
    description: dict.meta.news.description,
    keywords: dict.meta.keywords,
  })
}

export default async function NewsPage() {
  const articles = await newsService.listPublished()

  return (
    <>
      <PageHero
        eyebrow="Informasi"
        title="Informasi dan kegiatan"
        description="Berita dan dokumentasi kegiatan LPSDM Aparatur serta program Sekolah Aparatur."
      />
      <div className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4 lg:px-8">
          {articles.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
