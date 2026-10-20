"use client"

import Image from "next/image"
import { useState } from "react"

export function NewsGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<string | null>(null)

  if (images.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-[var(--sa-navy)]">Galeri</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              className="relative block h-48 w-full cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => setActive(src)}
            >
              <Image
                src={src}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
              />
            </button>
          </li>
        ))}
      </ul>
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="w-full max-w-3xl">
            <span className="relative block h-80 overflow-hidden rounded-2xl sm:h-[28rem]">
              <Image src={active} alt={title} fill className="object-cover" sizes="48rem" />
            </span>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="h-10 cursor-pointer rounded-full bg-white px-4 text-sm font-semibold text-[var(--sa-navy)]"
                onClick={() => setActive(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
