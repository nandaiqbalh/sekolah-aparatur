import type { Metadata } from "next"

import { NewsCard } from "@/components/public/news-card"
import { PageHero } from "@/components/public/page-hero"
import { newsArticles } from "@/data/news"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.berita,
    title: "Informasi",
    description: "Informasi dan kegiatan LPSDM Aparatur serta program Sekolah Aparatur.",
  })
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Informasi"
        title="Informasi dan kegiatan"
        description="Berita dan dokumentasi kegiatan LPSDM Aparatur serta program Sekolah Aparatur."
      />
      <div className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4 lg:px-8">
          {newsArticles.map((article) => (
            <li key={article.slug}>
              <NewsCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
