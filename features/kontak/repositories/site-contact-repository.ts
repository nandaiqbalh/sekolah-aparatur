import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { SITE_CONTACT_KEY } from "@/features/kontak/schemas/site-contact"
import { prisma } from "@/lib/db/prisma"

export const siteContactRepository = {
  find() {
    return prisma.siteContact.findUnique({ where: { key: SITE_CONTACT_KEY } })
  },

  upsert(data: Omit<Prisma.SiteContactCreateInput, "key">) {
    return prisma.siteContact.upsert({
      where: { key: SITE_CONTACT_KEY },
      create: { key: SITE_CONTACT_KEY, ...data },
      update: data,
    })
  },
}
