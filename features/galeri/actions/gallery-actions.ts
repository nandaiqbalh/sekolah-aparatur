"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { galleryService } from "@/features/galeri/services/gallery-service"
import {
  createGalleryAlbumSchema,
  deleteGalleryAlbumSchema,
  getGalleryAlbumSchema,
  listGalleryAlbumsSchema,
  updateGalleryAlbumSchema,
  uploadGalleryImageSchema,
  type GalleryAlbumDto,
  type GalleryAlbumListResult,
} from "@/features/galeri/schemas/gallery-album"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

function revalidateGallery(slugs: string[] = []) {
  revalidatePath(ROUTES.galeri)
  revalidatePath("/admin/galeri")
  for (const slug of slugs) {
    if (slug) revalidatePath(`/galeri/${slug}`)
  }
}

export async function listGalleryAlbumsAction(
  input: unknown,
): Promise<ActionResult<GalleryAlbumListResult>> {
  const auth = await requirePermission("galeri.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listGalleryAlbumsSchema, input)
  if (!parsed.ok) return parsed.result

  return galleryService.list(parsed.data)
}

export async function getGalleryAlbumAction(
  input: unknown,
): Promise<ActionResult<GalleryAlbumDto>> {
  const auth = await requirePermission("galeri.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getGalleryAlbumSchema, input)
  if (!parsed.ok) return parsed.result

  return galleryService.getById(parsed.data.id)
}

export async function createGalleryAlbumAction(
  input: unknown,
): Promise<ActionResult<GalleryAlbumDto>> {
  const auth = await requirePermission("galeri.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createGalleryAlbumSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await galleryService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "galeri",
    entityType: "gallery_album",
    entityId: result.data.id,
    summary: `Created album ${result.data.slug}`,
  })

  revalidateGallery([result.data.slug])
  return result
}

export async function updateGalleryAlbumAction(
  input: unknown,
): Promise<ActionResult<GalleryAlbumDto>> {
  const auth = await requirePermission("galeri.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateGalleryAlbumSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await galleryService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "galeri",
    entityType: "gallery_album",
    entityId: result.data.album.id,
    summary: `Updated album ${result.data.album.slug}`,
  })

  revalidateGallery([result.data.previousSlug, result.data.album.slug])
  return { ...result, data: result.data.album }
}

export async function deleteGalleryAlbumAction(
  input: unknown,
): Promise<ActionResult<{ id: string; title: string; slug: string }>> {
  const auth = await requirePermission("galeri.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteGalleryAlbumSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await galleryService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "galeri",
    entityType: "gallery_album",
    entityId: result.data.id,
    summary: `Deleted album ${result.data.title}`,
  })

  revalidateGallery([result.data.slug])
  return result
}

export async function uploadGalleryImageAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const createAuth = await requirePermission("galeri.create")
  const auth = createAuth.ok ? createAuth : await requirePermission("galeri.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadGalleryImageSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return galleryService.saveImage({ type: parsed.data.type, bytes })
}
