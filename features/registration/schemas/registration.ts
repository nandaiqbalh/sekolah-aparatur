import { z } from "zod"

export const registrationSchema = z.object({
  program: z.string().min(1, "Program wajib dipilih."),
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

export type RegistrationInput = z.infer<typeof registrationSchema>
