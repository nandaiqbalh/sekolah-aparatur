import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import type { MessageStatus } from "@/features/pesan/schemas/message"
import { prisma } from "@/lib/db/prisma"

function buildWhere(params: {
  search?: string
  status?: MessageStatus
}): Prisma.ContactMessageWhereInput | undefined {
  const and: Prisma.ContactMessageWhereInput[] = []

  if (params.status) and.push({ status: params.status })
  if (params.search) {
    and.push({
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { contact: { contains: params.search, mode: "insensitive" } },
        { message: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

export const messageRepository = {
  findMany(params: { skip?: number; take?: number; search?: string; status?: MessageStatus }) {
    return prisma.contactMessage.findMany({
      where: buildWhere(params),
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; status?: MessageStatus }) {
    return prisma.contactMessage.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } })
  },

  create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data })
  },

  updateStatus(id: string, status: MessageStatus) {
    return prisma.contactMessage.update({ where: { id }, data: { status } })
  },
}
