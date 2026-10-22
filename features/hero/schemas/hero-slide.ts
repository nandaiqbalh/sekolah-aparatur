import { z } from "zod"

import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

const heroSlideObjectSchema = z.object({
  image: z.string().trim().min(1, "Gambar wajib diisi."),
  alt: z.string().trim().min(3, "Teks alternatif wajib diisi."),
  isPublished: z.boolean(),
})

export const heroSlideFormSchema = heroSlideObjectSchema

export const createHeroSlideSchema = heroSlideObjectSchema

export const updateHeroSlideSchema = heroSlideObjectSchema.extend({
  id: z.string().uuid(),
})

export const deleteHeroSlideSchema = z.object({
  id: z.string().uuid(),
})

export const reorderHeroSlidesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1),
})

export const uploadHeroImageSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export type HeroSlideFormValues = z.infer<typeof heroSlideFormSchema>

export type PublicHeroSlide = {
  id: string
  image: string
  alt: string
}

export type HeroSlideDto = PublicHeroSlide & {
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}
