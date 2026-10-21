"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { galleryAlbums, galleryCategories, galleryCover } from "@/data/gallery"
import { galleryPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function GalleryBrowser() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("Semua")
  const items = useMemo(
    () =>
      category === "Semua"
        ? galleryAlbums
        : galleryAlbums.filter((item) => item.category === category),
    [category],
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter galeri">
        {galleryCategories.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "h-9 cursor-pointer rounded-full px-4 text-sm font-medium",
              category === item ? "bg-[var(--sa-gold)] text-[var(--sa-navy)]" : "bg-white text-[var(--sa-muted)]",
            )}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-5 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} className="h-full">
            <Link href={galleryPath(item.slug)} className="flex h-full cursor-pointer flex-col">
              <span className="relative block h-56 shrink-0 overflow-hidden rounded-2xl bg-white">
                <Image
                  src={galleryCover(item)}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </span>
              <span className="mt-4 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">{item.title}</span>
              <span className="mt-1 text-sm text-[var(--sa-muted)]">
                {item.category}
                {item.images.length > 1 ? ` · ${item.images.length} foto` : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
