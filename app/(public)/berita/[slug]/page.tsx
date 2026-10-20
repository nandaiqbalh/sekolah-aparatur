import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NewsGallery } from "@/components/public/news-gallery"
import { PageHero } from "@/components/public/page-hero"
import { formatArticleDate, getArticle, newsArticles } from "@/data/news"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, newsPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: newsPath(slug),
    title: article?.title ?? "Informasi",
    description: article?.summary ?? "Informasi kegiatan Sekolah Aparatur.",
    type: "article",
  })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <PageHero
        eyebrow={`${article.category} · ${formatArticleDate(article.publishedAt)}`}
        title={article.title}
        description={article.summary}
      />
      <div className="bg-white py-12 lg:py-16">
        <article className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div
            className="program-content max-w-3xl"
            dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
          />
          <div className="mt-12">
            <NewsGallery images={article.gallery} title={article.title} />
          </div>
          <Link
            href={ROUTES.berita}
            className="mt-12 inline-flex cursor-pointer border-b-2 border-[var(--sa-gold)] pb-1 text-sm font-semibold text-[var(--sa-navy)]"
          >
            Kembali ke daftar informasi
          </Link>
        </article>
      </div>
    </>
  )
}
