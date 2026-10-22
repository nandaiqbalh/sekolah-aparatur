import { z } from "zod"

import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug wajib diisi.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung.")

const publishedAtSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid.")

export const newsArticleFormSchema = z.object({
  title: z.string().trim().min(3, "Judul wajib diisi."),
  slug: slugSchema,
  category: z.string().trim().min(2, "Kategori wajib diisi."),
  publishedAt: publishedAtSchema,
  summary: z.string().trim().min(10, "Ringkasan wajib diisi."),
  thumbnail: z.string().trim().min(1, "Thumbnail wajib diisi."),
  gallery: z.array(z.string().trim().min(1)),
  bodyHtml: z.string().trim().min(1, "Isi artikel wajib diisi."),
  isPublished: z.boolean(),
})

export const createNewsArticleSchema = newsArticleFormSchema

export const updateNewsArticleSchema = newsArticleFormSchema.extend({
  id: z.string().uuid(),
})

export const deleteNewsArticleSchema = z.object({
  id: z.string().uuid(),
})

export const getNewsArticleSchema = z.object({
  id: z.string().uuid(),
})

export const listNewsArticlesSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export const uploadNewsImageSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export type NewsArticleFormValues = z.infer<typeof newsArticleFormSchema>
export type ListNewsArticlesInput = z.infer<typeof listNewsArticlesSchema>

export type PublicNewsArticle = {
  slug: string
  title: string
  category: string
  publishedAt: string
  summary: string
  thumbnail: string
  gallery: string[]
  bodyHtml: string
}

export type NewsArticleDto = PublicNewsArticle & {
  id: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type NewsArticleListResult = {
  articles: NewsArticleDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function publishedAtToIsoDate(value: Date): string {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, "0")
  const day = String(value.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function isoDateToPublishedAt(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}
