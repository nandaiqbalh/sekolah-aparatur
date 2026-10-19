import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Reveal } from "@/components/motion/reveal"
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
    title: article?.title ?? "Berita",
    description: article?.summary ?? "Artikel berita Sekolah Aparatur.",
    type: "article",
  })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const others = newsArticles.filter((item) => item.slug !== article.slug).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={`${article.category} · ${formatArticleDate(article.publishedAt)}`}
        title={article.title}
        description={article.summary}
      />
      <article className="bg-[var(--sa-canvas)]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="rounded-[28px] bg-white p-6 sm:p-8">
              <div className="grid gap-5">
                {article.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-8 text-[var(--sa-ink)]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-12 border-t border-[var(--sa-line)] pt-8">
                <h2 className="text-sm font-semibold text-[var(--sa-muted)]">Berita lain</h2>
                <ul className="mt-4 grid gap-3">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link href={newsPath(item.slug)} className="cursor-pointer font-semibold">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.berita} className="mt-8 inline-flex cursor-pointer text-sm font-semibold">
                  Kembali ke daftar berita
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </article>
    </>
  )
}
