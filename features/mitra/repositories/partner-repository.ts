import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import type { PartnerKind } from "@/features/mitra/schemas/partner"
import { prisma } from "@/lib/db/prisma"

export type PartnerStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  kind?: PartnerKind
  status?: PartnerStatus
  publishedOnly?: boolean
}): Prisma.PartnerWhereInput | undefined {
  const and: Prisma.PartnerWhereInput[] = []

  if (params.kind) and.push({ kind: params.kind })
  if (params.publishedOnly || params.status === "published") {
    and.push({ isPublished: true })
  } else if (params.status === "hidden") {
    and.push({ isPublished: false })
  }
  if (params.search) {
    and.push({
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { detail: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]

export const partnerRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    kind?: PartnerKind
    status?: PartnerStatus
    publishedOnly?: boolean
  }) {
    return prisma.partner.findMany({
      where: buildWhere(params),
      orderBy,
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: {
    search?: string
    kind?: PartnerKind
    status?: PartnerStatus
    publishedOnly?: boolean
  }) {
    return prisma.partner.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.partner.findUnique({ where: { id } })
  },

  findByKindAndName(kind: PartnerKind, name: string) {
    return prisma.partner.findUnique({ where: { kind_name: { kind, name } } })
  },

  create(data: Prisma.PartnerCreateInput) {
    return prisma.partner.create({ data })
  },

  update(id: string, data: Prisma.PartnerUpdateInput) {
    return prisma.partner.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.partner.delete({ where: { id } })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.partner.update({ where: { id: entry.id }, data: { sortOrder: entry.sortOrder } }),
      ),
    )
  },
}
