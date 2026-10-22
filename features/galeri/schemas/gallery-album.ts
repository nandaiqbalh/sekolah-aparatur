import { z } from "zod"

import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

export const galleryAlbumFormSchema = z.object({
  title: z.string().trim().min(3, "Nama wajib diisi."),
  category: z.string().trim().min(2, "Kategori wajib diisi."),
  dateLabel: z.string().trim().min(1, "Tanggal wajib diisi."),
  summary: z.string().trim().min(10, "Ringkasan wajib diisi."),
  images: z.array(z.string().trim().min(1)).min(1, "Minimal satu foto."),
  isPublished: z.boolean(),
})

export const createGalleryAlbumSchema = galleryAlbumFormSchema

export const updateGalleryAlbumSchema = galleryAlbumFormSchema.extend({
  id: z.string().uuid(),
})

export const deleteGalleryAlbumSchema = z.object({
  id: z.string().uuid(),
})

export const getGalleryAlbumSchema = z.object({
  id: z.string().uuid(),
})

export const listGalleryAlbumsSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export const uploadGalleryImageSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export type GalleryAlbumFormValues = z.infer<typeof galleryAlbumFormSchema>

export type PublicGalleryAlbum = {
  slug: string
  title: string
  category: string
  date: string
  summary: string
  images: string[]
}

export type GalleryAlbumDto = PublicGalleryAlbum & {
  id: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type GalleryAlbumListResult = {
  albums: GalleryAlbumDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
