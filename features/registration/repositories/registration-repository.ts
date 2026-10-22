import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import type { RegistrationStatus } from "@/features/registration/schemas/registration"
import { prisma } from "@/lib/db/prisma"

function buildWhere(params: {
  search?: string
  program?: string
  status?: RegistrationStatus
}): Prisma.RegistrationWhereInput | undefined {
  const and: Prisma.RegistrationWhereInput[] = []

  if (params.program) and.push({ programSlug: params.program })
  if (params.status) and.push({ status: params.status })
  if (params.search) {
    and.push({
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { whatsapp: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

export const registrationRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    program?: string
    status?: RegistrationStatus
  }) {
    return prisma.registration.findMany({
      where: buildWhere(params),
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; program?: string; status?: RegistrationStatus }) {
    return prisma.registration.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.registration.findUnique({ where: { id } })
  },

  create(data: Prisma.RegistrationCreateInput) {
    return prisma.registration.create({ data })
  },

  updateStatus(id: string, status: RegistrationStatus) {
    return prisma.registration.update({ where: { id }, data: { status } })
  },
}
