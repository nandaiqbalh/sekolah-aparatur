"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { NewsCard } from "@/components/public/news-card"
import type { NewsArticle } from "@/data/news"
import { cn } from "@/lib/utils"

export function NewsScrollRow({ articles }: { articles: NewsArticle[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const overflow = max > 2
    setCanScrollPrev(overflow && el.scrollLeft > 2)
    setCanScrollNext(overflow && el.scrollLeft < max - 2)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener("scroll", updateScrollState, { passive: true })
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", updateScrollState)
      observer.disconnect()
    }
  }, [updateScrollState, articles.length])

  function scrollByCard(direction: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const styles = window.getComputedStyle(el)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0
    const delta = first ? first.offsetWidth + gap : Math.max(el.clientWidth * 0.75, 240)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: direction * delta, behavior: reduceMotion ? "auto" : "smooth" })
  }

  const arrowClass = cn(
    "absolute top-1/2 z-20 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--sa-navy)] bg-white text-[var(--sa-navy)] shadow-md",
  )

  return (
    <div className="relative mt-5">
      <ul
        ref={trackRef}
        className="-mr-4 flex w-[calc(100%+1rem)] gap-3 overflow-x-auto pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mr-6 sm:w-[calc(100%+1.5rem)] sm:pr-6 lg:-mr-8 lg:w-[calc(100%+2rem)] lg:pr-8 [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => (
          <li key={article.slug} className="w-[11.5rem] shrink-0 sm:w-52 lg:w-60">
            <NewsCard article={article} />
          </li>
        ))}
      </ul>

      {canScrollPrev ? (
        <button type="button" aria-label="Informasi sebelumnya" onClick={() => scrollByCard(-1)} className={cn(arrowClass, "left-0")}>
          <ChevronLeft className="size-5" strokeWidth={2.5} aria-hidden />
        </button>
      ) : null}

      {canScrollNext ? (
        <button type="button" aria-label="Informasi berikutnya" onClick={() => scrollByCard(1)} className={cn(arrowClass, "right-0")}>
          <ChevronRight className="size-5" strokeWidth={2.5} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
