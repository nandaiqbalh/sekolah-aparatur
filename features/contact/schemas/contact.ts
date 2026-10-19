import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter."),
  contact: z.string().trim().min(5, "Isi email atau nomor telepon."),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter."),
})

export type ContactInput = z.infer<typeof contactSchema>
