import type { Metadata } from "next"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/public/page-hero"
import { formatArticleDate, newsArticles } from "@/data/news"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, newsPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.berita,
    title: "Berita",
    description: "Daftar berita dummy Sekolah Aparatur untuk pratinjau situs.",
  })
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Berita"
        title="Berita dan catatan kegiatan"
        description="Artikel di halaman ini adalah data dummy. Tanggal dan peristiwa belum diverifikasi sebagai arsip resmi."
      />
      <ul className="mx-auto max-w-[1280px] divide-y divide-[var(--sa-line)] border-t border-[var(--sa-line)] px-4 pt-4 pb-24 sm:px-6 lg:px-8">
        {newsArticles.map((article, index) => (
          <li key={article.slug}>
            <Reveal delay={index * 0.08}>
            <Link
              href={newsPath(article.slug)}
              className="grid cursor-pointer gap-2 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10"
            >
              <p className="text-sm text-[var(--sa-muted)]">
                {article.category}
                <span className="mt-1 block">{formatArticleDate(article.publishedAt)}</span>
              </p>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{article.title}</h2>
                <p className="mt-2 max-w-2xl leading-7 text-[var(--sa-muted)]">{article.summary}</p>
              </div>
            </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </>
  )
}
