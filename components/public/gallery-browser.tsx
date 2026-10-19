"use client"

import { useMemo, useState } from "react"
import { Play } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { MediaPlaceholder } from "@/components/public/media-placeholder"
import { galleryCategories, galleryItems } from "@/data/gallery"
import { cn } from "@/lib/utils"

export function GalleryBrowser() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("Semua")
  const [activeId, setActiveId] = useState<string | null>(null)
  const items = useMemo(
    () =>
      category === "Semua"
        ? galleryItems
        : galleryItems.filter((item) => item.category === category),
    [category]
  )
  const active = galleryItems.find((item) => item.id === activeId)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter galeri">
        {galleryCategories.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "h-9 cursor-pointer rounded-full px-4 text-sm",
              category === item ? "bg-[var(--sa-navy)] text-white" : "text-[var(--sa-muted)] hover:text-[var(--sa-ink)]"
            )}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <Reveal y={80} delay={(index % 3) * 0.1}>
            <button type="button" className="w-full cursor-pointer text-left" onClick={() => setActiveId(item.id)}>
              <MediaPlaceholder quiet label={item.title} className="h-56 rounded-[1.75rem]" />
              <p className="mt-4 flex items-center gap-2 font-semibold">
                {item.kind === "video" ? <Play className="size-4 shrink-0" aria-hidden /> : null}
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[var(--sa-muted)]">
                {item.category} · {item.date}
              </p>
            </button>
            </Reveal>
          </li>
        ))}
      </ul>
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10192b]/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className="w-full max-w-3xl">
            <MediaPlaceholder
              quiet
              label={active.kind === "video" ? `Pratinjau video: ${active.title}` : active.title}
              className="h-80 rounded-[1.75rem] sm:h-[28rem]"
            />
            <div className="mt-4 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-lg font-semibold">{active.title}</p>
                <p className="text-sm text-white/70">
                  {active.kind === "video" ? "Video belum diputar." : active.category}
                </p>
              </div>
              <button
                type="button"
                className="h-10 shrink-0 cursor-pointer rounded-full bg-white px-4 text-sm font-semibold text-[var(--sa-navy)]"
                onClick={() => setActiveId(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
