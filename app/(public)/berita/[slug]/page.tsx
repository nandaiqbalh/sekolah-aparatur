import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NewsGallery } from "@/components/public/news-gallery"
import { PageHero } from "@/components/public/page-hero"
import { formatArticleDate } from "@/data/news"
import { newsService } from "@/features/informasi/services/news-service"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, newsPath } from "@/lib/routes"
import { buildPageMetadata, jsonLdScript } from "@/lib/seo"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await newsService.getPublishedBySlug(slug)
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: newsPath(slug),
    title: article?.title ?? dict.meta.news.title,
    description: article?.summary || dict.meta.newsFallbackDescription,
    keywords: dict.meta.keywords,
    type: "article",
  })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = await newsService.getPublishedBySlug(slug)
  if (!article) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    image: article.thumbnail ? [absoluteUrl(article.thumbnail)] : undefined,
    mainEntityOfPage: absoluteUrl(newsPath(slug)),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <PageHero
        eyebrow={`${article.category} · ${formatArticleDate(article.publishedAt)}`}
        title={article.title}
        description={article.summary}
      />
      <div className="bg-white py-8 lg:py-10">
        <article className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div
            className="program-content max-w-3xl"
            dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
          />
          <div className="mt-6">
            <NewsGallery images={article.gallery} title={article.title} />
          </div>
          <Link
            href={ROUTES.berita}
            className="mt-6 inline-flex cursor-pointer border-b-2 border-[var(--sa-gold)] pb-1 text-sm font-semibold text-[var(--sa-navy)]"
          >
            Kembali ke daftar informasi
          </Link>
        </article>
      </div>
    </>
  )
}
