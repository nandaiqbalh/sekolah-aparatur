import "server-only"

import { connection } from "next/server"
import { cache } from "react"

import { siteContactRepository } from "@/features/kontak/repositories/site-contact-repository"
import {
  SITE_CONTACT_KEY,
  socialLinkSchema,
  type SiteContactDto,
  type SiteContactFormValues,
} from "@/features/kontak/schemas/site-contact"
import { actionSuccess } from "@/lib/action-result"
import type { Prisma } from "@/generated/prisma/client"
import { z } from "zod"

type SiteContactRow = NonNullable<Awaited<ReturnType<typeof siteContactRepository.find>>>

function toDto(row: SiteContactRow): SiteContactDto {
  const socials = z.array(socialLinkSchema).safeParse(row.socials)
  return {
    key: row.key,
    address: row.address,
    phones: row.phones,
    email: row.email,
    website: row.website,
    whatsappNumber: row.whatsappNumber,
    socials: socials.success ? socials.data : [],
    updatedAt: row.updatedAt.toISOString(),
  }
}

async function loadSiteContact(): Promise<SiteContactDto | null> {
  await connection()
  const row = await siteContactRepository.find()
  return row ? toDto(row) : null
}

export const getSiteContact = cache(loadSiteContact)

export const siteContactService = {
  get: getSiteContact,

  async update(values: SiteContactFormValues) {
    const row = await siteContactRepository.upsert({
      address: values.address,
      phones: values.phones,
      email: values.email,
      website: values.website,
      whatsappNumber: values.whatsappNumber,
      socials: values.socials as Prisma.InputJsonValue,
    })
    return actionSuccess(
      { ...toDto(row), key: row.key || SITE_CONTACT_KEY },
      "Kontak diperbarui.",
    )
  },
}
