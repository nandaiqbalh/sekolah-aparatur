import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { INSTITUTION_PROFILE_KEY } from "@/data/profile"
import { prisma } from "@/lib/db/prisma"

export const institutionProfileRepository = {
  find() {
    return prisma.institutionProfile.findUnique({
      where: { key: INSTITUTION_PROFILE_KEY },
    })
  },

  upsert(data: Omit<Prisma.InstitutionProfileCreateInput, "key">) {
    return prisma.institutionProfile.upsert({
      where: { key: INSTITUTION_PROFILE_KEY },
      create: { key: INSTITUTION_PROFILE_KEY, ...data },
      update: data,
    })
  },
}
