import { z } from "zod"

export const feeLineKinds = ["item", "subtotal", "total"] as const
export type FeeLineKind = (typeof feeLineKinds)[number]

const requiredText = (message: string) => z.string().trim().min(1, message)

/** Amount as digit string in forms — parsed to int in the service (no z.coerce). */
export const feeLineFormSchema = z.object({
  kind: z.enum(feeLineKinds),
  label: requiredText("Rincian wajib diisi."),
  amount: z
    .string()
    .trim()
    .regex(/^\d+$/, "Biaya harus angka bulat.")
    .refine((value) => Number(value) >= 0, "Biaya tidak boleh negatif."),
  note: z.string().trim(),
})

export const feeProgramGroupFormSchema = z.object({
  title: requiredText("Judul program wajib diisi."),
  lines: z.array(feeLineFormSchema).min(1, "Minimal satu baris biaya."),
})

export const feeScheduleFormSchema = z.object({
  title: z.string().trim().min(2, "Judul wajib diisi."),
  subtitle: z.string().trim(),
  isPublished: z.boolean(),
  groups: z.array(feeProgramGroupFormSchema).min(1, "Minimal satu program."),
})

export const createFeeScheduleSchema = feeScheduleFormSchema

export const updateFeeScheduleSchema = feeScheduleFormSchema.extend({
  id: z.string().uuid(),
})

export const deleteFeeScheduleSchema = z.object({
  id: z.string().uuid(),
})

export const reorderFeeSchedulesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      }),
    )
    .min(1),
})

export const listFeeSchedulesSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  status: z.enum(["all", "published", "hidden"]).optional(),
})

export type FeeLineFormValues = z.infer<typeof feeLineFormSchema>
export type FeeProgramGroupFormValues = z.infer<typeof feeProgramGroupFormSchema>
export type FeeScheduleFormValues = z.infer<typeof feeScheduleFormSchema>

export type FeeLineDto = {
  kind: FeeLineKind
  label: string
  amount: number
  note: string | null
}

export type FeeProgramGroupDto = {
  title: string
  lines: FeeLineDto[]
}

export type PublicFeeSchedule = {
  id: string
  title: string
  subtitle: string
  groups: FeeProgramGroupDto[]
}

export type FeeScheduleDto = PublicFeeSchedule & {
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type FeeScheduleListResult = {
  schedules: FeeScheduleDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const emptyFeeLine: FeeLineFormValues = {
  kind: "item",
  label: "",
  amount: "0",
  note: "",
}

export const emptyFeeGroup: FeeProgramGroupFormValues = {
  title: "",
  lines: [{ ...emptyFeeLine }],
}

export const emptyFeeScheduleForm: FeeScheduleFormValues = {
  title: "",
  subtitle: "",
  isPublished: true,
  groups: [{ ...emptyFeeGroup, lines: [{ ...emptyFeeLine }] }],
}
