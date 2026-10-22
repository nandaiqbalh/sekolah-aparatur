import { z } from "zod"

import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

const textItem = z.string().trim().min(3, "Isian wajib diisi.")

export const latarBelakangPointSchema = z.object({
  title: z.string().trim().min(2, "Judul poin wajib diisi."),
  text: z.string().trim().min(2, "Teks poin wajib diisi."),
})

export const institutionProfileFormSchema = z.object({
  heroEyebrow: z.string().trim().min(2, "Teks kecil wajib diisi."),
  heroTitle: z.string().trim().min(2, "Judul wajib diisi."),
  heroDescription: z.string().trim().min(10, "Ringkasan wajib diisi."),
  lembagaImage: z.string().trim().min(1, "Foto lembaga wajib diisi."),
  lembagaBody: z.string().trim().min(10, "Teks lembaga wajib diisi."),
  latarBelakangParagraphs: z.array(textItem).min(1, "Minimal satu paragraf."),
  latarBelakangPoints: z.array(latarBelakangPointSchema).min(1, "Minimal satu poin."),
  visi: z.string().trim().min(10, "Visi wajib diisi."),
  misi: z.array(textItem).min(1, "Minimal satu misi."),
  rplParagraphs: z.array(textItem).min(1, "Minimal satu paragraf."),
  legalBasis: z.array(textItem).min(1, "Minimal satu dasar hukum."),
})

export const updateInstitutionProfileSchema = institutionProfileFormSchema

export const uploadProfileImageSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export type InstitutionProfileFormValues = z.infer<typeof institutionProfileFormSchema>
export type LatarBelakangPoint = z.infer<typeof latarBelakangPointSchema>

export type InstitutionProfileDto = InstitutionProfileFormValues & {
  key: string
  updatedAt: string
}
