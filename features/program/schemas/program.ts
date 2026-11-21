import { z } from "zod"

import {
  DOCUMENT_MIME_TYPES,
  DOCUMENT_TOO_LARGE_MESSAGE,
  MAX_DOCUMENT_BYTES,
} from "@/lib/document-upload"
import { IMAGE_TOO_LARGE_MESSAGE, MAX_IMAGE_BYTES } from "@/lib/image-upload"

const requiredText = (message: string) => z.string().trim().min(1, message)

export const programHighlightSchema = z.object({
  title: requiredText("Judul poin wajib diisi."),
  description: requiredText("Uraian poin wajib diisi."),
})

export const programStrata = ["S1", "S2", "S3"] as const
export type ProgramStrata = (typeof programStrata)[number]

export const programStudySchema = z.object({
  partnerId: z.string().uuid("Kampus wajib dipilih."),
  study: requiredText("Program studi wajib diisi."),
  strata: z.enum(programStrata),
  concentration: z.string().trim(),
})

export const programPeriodSchema = z.object({
  term: requiredText("Nama periode wajib diisi."),
  detail: requiredText("Uraian wajib diisi."),
})

export const programCampusSchema = z.object({
  name: z.string().trim(),
  logo: z.string().trim(),
  description: z.string().trim(),
  address: z.string().trim(),
})

export const programRequirementGroupSchema = z.object({
  title: requiredText("Judul grup wajib diisi."),
  items: z.array(requiredText("Butir wajib diisi.")),
})

export const programDocumentSchema = z.object({
  name: requiredText("Nama berkas wajib diisi."),
  format: z.string().trim(),
  size: z.string().trim(),
  description: z.string().trim(),
  href: requiredText("Berkas unduhan wajib diunggah."),
})

export const programFormSchema = z.object({
  title: z.string().trim().min(2, "Judul wajib diisi."),
  summary: z.string().trim().min(10, "Ringkasan wajib diisi."),
  image: z.string().trim().min(1, "Gambar wajib diisi."),
  imageAlt: z.string().trim().min(2, "Teks alternatif gambar wajib diisi."),
  introParagraphs: z.array(requiredText("Paragraf wajib diisi.")),
  highlights: z.array(programHighlightSchema),
  studies: z.array(programStudySchema),
  registrationPeriods: z.array(programPeriodSchema),
  campus: programCampusSchema,
  requirementGroups: z.array(programRequirementGroupSchema),
  documents: z.array(programDocumentSchema),
  mitraIds: z.array(z.string().uuid()),
  isPublished: z.boolean(),
})

export const createProgramSchema = programFormSchema

export const updateProgramSchema = programFormSchema.extend({
  id: z.string().uuid(),
})

export const deleteProgramSchema = z.object({
  id: z.string().uuid(),
})

export const reorderProgramsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1),
})

export const listProgramsSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export const uploadProgramImageSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => value === "image/jpeg" || value === "image/png" || value === "image/webp",
      "Gambar harus JPEG, PNG, atau WebP.",
    ),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, IMAGE_TOO_LARGE_MESSAGE),
})

export const uploadProgramDocumentSchema = z.object({
  type: z
    .string()
    .refine(
      (value) => (DOCUMENT_MIME_TYPES as readonly string[]).includes(value),
      "Berkas harus PDF, DOC, atau DOCX.",
    ),
  size: z.number().int().positive().max(MAX_DOCUMENT_BYTES, DOCUMENT_TOO_LARGE_MESSAGE),
  name: z.string().trim().optional(),
})

export type ProgramFormValues = z.infer<typeof programFormSchema>
export type ProgramHighlight = z.infer<typeof programHighlightSchema>
export type ProgramStudy = z.infer<typeof programStudySchema>
export type ProgramStudyView = ProgramStudy & { university: string; logo: string }
export type ProgramPeriod = z.infer<typeof programPeriodSchema>
export type ProgramCampus = z.infer<typeof programCampusSchema>
export type ProgramRequirementGroup = z.infer<typeof programRequirementGroupSchema>
export type ProgramDocument = z.infer<typeof programDocumentSchema>

export type PublicProgramCard = {
  slug: string
  title: string
  summary: string
  image: string
  imageAlt: string
}

export type PublicProgram = Omit<ProgramFormValues, "studies"> &
  PublicProgramCard & {
    studies: ProgramStudyView[]
  }

export type ProgramDto = PublicProgram & {
  id: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ProgramListResult = {
  programs: ProgramDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const emptyProgramForm: ProgramFormValues = {
  title: "",
  summary: "",
  image: "",
  imageAlt: "",
  introParagraphs: [],
  highlights: [],
  studies: [],
  registrationPeriods: [],
  campus: { name: "", logo: "", description: "", address: "" },
  requirementGroups: [],
  documents: [],
  mitraIds: [],
  isPublished: true,
}
