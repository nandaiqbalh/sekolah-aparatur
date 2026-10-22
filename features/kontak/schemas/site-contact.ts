import { z } from "zod"

export const SITE_CONTACT_KEY = "kontak"

export const socialPlatforms = ["instagram", "facebook", "tiktok", "youtube", "x", "linkedin"] as const
export type SocialPlatform = (typeof socialPlatforms)[number]

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || z.url().safeParse(value).success, "Tautan tidak valid.")

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  url: z.string().trim().pipe(z.url("Tautan tidak valid.")),
})

export const siteContactFormSchema = z.object({
  address: z.string().trim().min(10, "Alamat wajib diisi."),
  phones: z.array(z.string().trim().min(8, "Nomor telepon wajib diisi.")),
  email: z.email("Surel tidak valid."),
  website: optionalUrl,
  whatsappNumber: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.replace(/\D/g, "").length >= 8,
      "Nomor WhatsApp tidak valid.",
    ),
  socials: z.array(socialLinkSchema).superRefine((items, ctx) => {
    const seen = new Set<string>()
    items.forEach((item, index) => {
      if (seen.has(item.platform)) {
        ctx.addIssue({
          code: "custom",
          message: "Platform sudah dipilih.",
          path: [index, "platform"],
        })
      }
      seen.add(item.platform)
    })
  }),
})

export const updateSiteContactSchema = siteContactFormSchema

export type SiteContactFormValues = z.infer<typeof siteContactFormSchema>
export type SocialLink = z.infer<typeof socialLinkSchema>

export type SiteContactDto = SiteContactFormValues & {
  key: string
  updatedAt: string
}
