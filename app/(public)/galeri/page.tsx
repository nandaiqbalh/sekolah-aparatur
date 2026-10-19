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
    description: "Galeri foto dan video placeholder Sekolah Aparatur.",
  })
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Dokumentasi kegiatan"
        description="Foto dan video di sini berlabel placeholder. Tidak ada tautan ke platform video eksternal."
      />
      <div className="mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <GalleryBrowser />
      </div>
    </>
  )
}
