import { z } from "zod"

import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

export const partnerKinds = ["university", "facilitator"] as const
export type PartnerKind = (typeof partnerKinds)[number]

const partnerKindSchema = z.enum(partnerKinds)

const partnerObjectSchema = z.object({
  kind: partnerKindSchema,
  name: z.string().trim().min(2, "Nama wajib diisi."),
  detail: z.string().trim(),
  logo: z.string().trim().min(1, "Logo wajib diisi."),
  isPublished: z.boolean(),
})

export const partnerFormSchema = partnerObjectSchema.superRefine((value, ctx) => {
  if (value.kind === "facilitator" && value.detail.length < 2) {
    ctx.addIssue({
      code: "custom",
      message: "Nama lengkap wajib diisi.",
      path: ["detail"],
    })
  }
})

export const createPartnerSchema = partnerFormSchema

export const updatePartnerSchema = partnerObjectSchema.omit({ kind: true }).extend({
  id: z.string().uuid(),
})

export const deletePartnerSchema = z.object({
  id: z.string().uuid(),
})

export const reorderPartnersSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1),
})

export const listPartnersSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  kind: partnerKindSchema,
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export const uploadPartnerLogoSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export type PartnerFormValues = z.infer<typeof partnerFormSchema>

export type PublicPartner = {
  id: string
  kind: PartnerKind
  name: string
  detail: string | null
  logo: string
}

export type PartnerDto = PublicPartner & {
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type PartnerListResult = {
  partners: PartnerDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
