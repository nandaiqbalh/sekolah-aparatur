import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { formatArticleDate, type NewsArticle } from "@/data/news"
import { newsPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function NewsCard({
  article,
  className,
}: {
  article: NewsArticle
  className?: string
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-[var(--sa-line)] bg-white transition-colors hover:border-[var(--sa-navy)]/25",
        className,
      )}
    >
      <Link
        href={newsPath(article.slug)}
        className="grid cursor-pointer sm:grid-cols-[13rem_1fr] lg:grid-cols-[16rem_1fr]"
      >
        <span className="relative block h-44 sm:h-full sm:min-h-40">
          <Image
            src={article.thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 16rem, (min-width: 640px) 13rem, 100vw"
          />
        </span>
        <span className="flex flex-col gap-3 px-6 py-5 sm:px-7 sm:py-6">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-semibold tracking-wide text-[var(--sa-navy)] uppercase">
              {article.category}
            </span>
            <time dateTime={article.publishedAt} className="text-sm text-[var(--sa-muted)]">
              {formatArticleDate(article.publishedAt)}
            </time>
          </span>
          <span className="text-lg font-semibold tracking-tight break-words text-[var(--sa-navy)] group-hover:text-[var(--brand-primary-dark)] sm:text-2xl">
            {article.title}
          </span>
          <span className="max-w-2xl text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
            {article.summary}
          </span>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--sa-navy)]">
            Baca
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </article>
  )
}
