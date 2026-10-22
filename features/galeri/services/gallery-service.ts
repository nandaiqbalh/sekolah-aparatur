import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import { galleryRepository, type GalleryAlbumStatus } from "@/features/galeri/repositories/gallery-repository"
import {
  type GalleryAlbumDto,
  type GalleryAlbumFormValues,
  type GalleryAlbumListResult,
  type PublicGalleryAlbum,
} from "@/features/galeri/schemas/gallery-album"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"
import { slugifyTitle } from "@/lib/slug"

type GalleryRow = NonNullable<Awaited<ReturnType<typeof galleryRepository.findById>>>

function toPublic(row: GalleryRow): PublicGalleryAlbum {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.dateLabel,
    summary: row.summary,
    images: row.images,
  }
}

function toDto(row: GalleryRow): GalleryAlbumDto {
  return {
    ...toPublic(row),
    id: row.id,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugifyTitle(title) || "album"
  let candidate = base
  let suffix = 2

  while (true) {
    const existing = await galleryRepository.findBySlug(candidate)
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export const galleryService = {
  async listSitemap(): Promise<{ slug: string; updatedAt: Date }[]> {
    await connection()
    const rows = await galleryRepository.findMany({ publishedOnly: true })
    return rows.map((row) => ({ slug: row.slug, updatedAt: row.updatedAt }))
  },

  async listPublished(): Promise<PublicGalleryAlbum[]> {
    await connection()
    const rows = await galleryRepository.findMany({ publishedOnly: true })
    return rows.map(toPublic)
  },

  async listPublishedCategories(): Promise<string[]> {
    await connection()
    const rows = await galleryRepository.listCategories(true)
    return rows.map((row) => row.category)
  },

  count() {
    return galleryRepository.count({})
  },

  async getPublishedBySlug(slug: string): Promise<PublicGalleryAlbum | null> {
    await connection()
    const row = await galleryRepository.findPublishedBySlug(slug)
    return row ? toPublic(row) : null
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    category?: string
    status?: GalleryAlbumStatus
  }): Promise<ActionResult<GalleryAlbumListResult>> {
    const search = params.search?.trim() || undefined
    const category = params.category?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, category, status }

    const [rows, total] = await Promise.all([
      galleryRepository.findMany({ skip, take: params.limit, ...filter }),
      galleryRepository.count(filter),
    ])

    return actionSuccess({
      albums: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async listCategories(): Promise<string[]> {
    const rows = await galleryRepository.listCategories()
    return rows.map((row) => row.category)
  },

  async getById(id: string): Promise<ActionResult<GalleryAlbumDto>> {
    const row = await galleryRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Galeri tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: GalleryAlbumFormValues): Promise<ActionResult<GalleryAlbumDto>> {
    const slug = await uniqueSlug(values.title)
    const row = await galleryRepository.create({
      slug,
      title: values.title,
      category: values.category,
      dateLabel: values.dateLabel,
      summary: values.summary,
      images: values.images,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Galeri disimpan.")
  },

  async update(
    id: string,
    values: GalleryAlbumFormValues,
  ): Promise<ActionResult<{ album: GalleryAlbumDto; previousSlug: string }>> {
    const current = await galleryRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Galeri tidak ditemukan.")

    const slug =
      current.title === values.title ? current.slug : await uniqueSlug(values.title, id)

    const row = await galleryRepository.update(id, {
      slug,
      title: values.title,
      category: values.category,
      dateLabel: values.dateLabel,
      summary: values.summary,
      images: values.images,
      isPublished: values.isPublished,
    })

    return actionSuccess(
      { album: toDto(row), previousSlug: current.slug },
      "Galeri diperbarui.",
    )
  },

  async delete(id: string): Promise<ActionResult<{ id: string; title: string; slug: string }>> {
    const current = await galleryRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Galeri tidak ditemukan.")
    await galleryRepository.delete(id)
    return actionSuccess(
      { id, title: current.title, slug: current.slug },
      "Galeri dihapus.",
    )
  },

  async saveImage(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "galeri")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/galeri/${filename}` })
  },
}
