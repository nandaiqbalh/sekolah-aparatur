"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

import { Reveal } from "@/components/motion/reveal"
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
              "h-9 cursor-pointer rounded-full px-4 text-sm font-medium",
              category === item ? "bg-[var(--sa-gold)] text-[var(--sa-navy)]" : "bg-white text-[var(--sa-muted)]"
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
              <span className="relative block h-56 overflow-hidden rounded-[28px] bg-white">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              </span>
              <p className="mt-4 font-semibold">{item.title}</p>
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
            <span className="relative block h-80 overflow-hidden rounded-[1.75rem] sm:h-[28rem]">
              <Image src={active.image} alt={active.title} fill className="object-cover" sizes="48rem" />
            </span>
            <div className="mt-4 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-lg font-semibold">{active.title}</p>
                <p className="text-sm text-white/70">{active.category}</p>
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
