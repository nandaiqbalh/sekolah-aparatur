import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NewsGallery } from "@/components/public/news-gallery"
import { PageHero } from "@/components/public/page-hero"
import { galleryAlbums, getGalleryAlbum } from "@/data/gallery"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, galleryPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return galleryAlbums.map((album) => ({ slug: album.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const album = getGalleryAlbum(slug)
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: galleryPath(slug),
    title: album?.title ?? "Galeri",
    description: album?.summary ?? "Dokumentasi kegiatan Sekolah Aparatur.",
  })
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const album = getGalleryAlbum(slug)
  if (!album) notFound()

  return (
    <>
      <PageHero eyebrow={`${album.category} · ${album.date}`} title={album.title} description={album.summary} />
      <div className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <NewsGallery images={album.images} title={album.title} />
          <Link
            href={ROUTES.galeri}
            className="mt-12 inline-flex cursor-pointer border-b-2 border-[var(--sa-gold)] pb-1 text-sm font-semibold text-[var(--sa-navy)]"
          >
            Kembali ke galeri
          </Link>
        </div>
      </div>
    </>
  )
}
