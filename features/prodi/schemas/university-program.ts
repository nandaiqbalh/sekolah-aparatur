import { z } from "zod"

const requiredText = (message: string) => z.string().trim().min(1, message)

export const programStrata = ["S1", "S2", "S3"] as const
export type ProgramStrata = (typeof programStrata)[number]

export const universityProgramFormSchema = z.object({
  partnerId: z.string().uuid("Kampus wajib dipilih."),
  study: requiredText("Program studi wajib diisi."),
  strata: z.enum(programStrata),
  concentration: z.string().trim(),
  forAparaturDesa: z.boolean(),
  forAparaturPemerintah: z.boolean(),
  forLegislator: z.boolean(),
  isPublished: z.boolean(),
})

export const createUniversityProgramSchema = universityProgramFormSchema

export const updateUniversityProgramSchema = universityProgramFormSchema.extend({
  id: z.string().uuid(),
})

export const deleteUniversityProgramSchema = z.object({
  id: z.string().uuid(),
})

export const reorderUniversityProgramsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1),
})

export const listUniversityProgramsSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export type UniversityProgramFormValues = z.infer<typeof universityProgramFormSchema>

export type PublicUniversityProgram = {
  id: string
  university: string
  study: string
  strata: ProgramStrata
  concentration: string | null
  forAparaturDesa: boolean
  forAparaturPemerintah: boolean
  forLegislator: boolean
}

export type UniversityProgramDto = PublicUniversityProgram & {
  partnerId: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type UniversityProgramListResult = {
  programs: UniversityProgramDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const emptyUniversityProgramForm: UniversityProgramFormValues = {
  partnerId: "",
  study: "",
  strata: "S1",
  concentration: "",
  forAparaturDesa: false,
  forAparaturPemerintah: false,
  forLegislator: false,
  isPublished: true,
}
