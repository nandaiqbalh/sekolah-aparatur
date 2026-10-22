import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { GalleryAlbumForm } from "@/features/galeri/components/gallery-album-form"
import { galleryService } from "@/features/galeri/services/gallery-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminGaleriFormPage({ params }: PageProps) {
  const { id } = await params

  if (id === "baru") {
    if (!(await canAccessPage("galeri.create"))) {
      return <AccessDenied />
    }
    return <GalleryAlbumForm mode="create" />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("galeri.update"))) {
    return <AccessDenied />
  }

  const album = await galleryService.getById(id)
  if (!album.ok || !album.data) notFound()

  return <GalleryAlbumForm mode="edit" album={album.data} />
}
