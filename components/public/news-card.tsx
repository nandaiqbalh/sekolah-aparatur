import Image from "next/image"
import Link from "next/link"

import { formatArticleDate } from "@/data/news"
import type { PublicNewsArticle } from "@/features/informasi/schemas/news-article"
import { newsPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function NewsCard({
  article,
  className,
}: {
  article: PublicNewsArticle
  className?: string
}) {
  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <Link href={newsPath(article.slug)} className="flex h-full cursor-pointer flex-col">
        <span className="relative block aspect-square overflow-hidden rounded-xl bg-[var(--sa-canvas)]">
          <Image
            src={article.thumbnail}
            alt=""
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 33vw, 50vw"
          />
        </span>
        <span className="mt-2 flex flex-col gap-1">
          <span className="text-[0.65rem] font-semibold tracking-wide text-[var(--sa-gold)] uppercase">
            {article.category}
          </span>
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--sa-navy)] group-hover:text-[var(--brand-primary-dark)]">
            {article.title}
          </span>
          <time dateTime={article.publishedAt} className="text-xs font-semibold text-[var(--sa-navy)]">
            {formatArticleDate(article.publishedAt)}
          </time>
        </span>
      </Link>
    </article>
  )
}
