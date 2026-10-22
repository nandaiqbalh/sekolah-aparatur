import { z } from "zod"

export const registrationStatuses = ["submitted", "contacted", "accepted", "declined"] as const
export type RegistrationStatus = (typeof registrationStatuses)[number]
const registrationStatusFilters = ["all", ...registrationStatuses] as const

export const registrationSchema = z.object({
  program: z.string().trim().min(1, "Program wajib dipilih."),
  name: z.string().trim().min(3, "Nama lengkap wajib diisi."),
  email: z.string().trim().email("Email tidak valid."),
  whatsapp: z.string().trim().min(8, "Nomor WhatsApp wajib diisi."),
  institution: z.string().trim().min(2, "Instansi atau lembaga wajib diisi."),
  position: z.string().trim().min(2, "Jabatan wajib diisi."),
  address: z.string().trim().min(5, "Alamat wajib diisi."),
  consent: z
    .boolean()
    .refine((value) => value, "Persetujuan wajib dicentang untuk melanjutkan."),
})

export const updateRegistrationStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(registrationStatuses),
})

export const listRegistrationsSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  program: z.string().trim().optional(),
  status: z.enum(registrationStatusFilters).optional(),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

export type RegistrationDto = {
  id: string
  programSlug: string
  name: string
  email: string
  whatsapp: string
  institution: string
  position: string
  address: string
  status: RegistrationStatus
  createdAt: string
  updatedAt: string
}

export type RegistrationListResult = {
  registrations: RegistrationDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
