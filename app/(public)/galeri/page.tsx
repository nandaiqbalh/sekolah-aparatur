import type { Metadata } from "next"

import { GalleryBrowser } from "@/components/public/gallery-browser"
import { PageHero } from "@/components/public/page-hero"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.galeri,
    title: "Galeri",
    description: "Dokumentasi foto kegiatan LPSDM Aparatur dan program Sekolah Aparatur.",
  })
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Dokumentasi kegiatan"
        description="Dokumentasi foto kegiatan LPSDM Aparatur serta program Sekolah Aparatur."
      />
      <div className="bg-[var(--sa-canvas)]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <GalleryBrowser />
      </div>
      </div>
    </>
  )
}
