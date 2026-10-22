import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

export type ProgramStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  status?: ProgramStatus
  publishedOnly?: boolean
}): Prisma.ProgramWhereInput | undefined {
  const and: Prisma.ProgramWhereInput[] = []

  if (params.publishedOnly || params.status === "published") {
    and.push({ isPublished: true })
  } else if (params.status === "hidden") {
    and.push({ isPublished: false })
  }
  if (params.search) {
    and.push({ title: { contains: params.search, mode: "insensitive" } })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]

export const programRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    status?: ProgramStatus
    publishedOnly?: boolean
  }) {
    return prisma.program.findMany({
      where: buildWhere(params),
      orderBy,
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; status?: ProgramStatus; publishedOnly?: boolean }) {
    return prisma.program.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.program.findUnique({ where: { id } })
  },

  findBySlug(slug: string) {
    return prisma.program.findUnique({ where: { slug } })
  },

  findPublishedBySlug(slug: string) {
    return prisma.program.findFirst({ where: { slug, isPublished: true } })
  },

  create(data: Prisma.ProgramCreateInput) {
    return prisma.program.create({ data })
  },

  update(id: string, data: Prisma.ProgramUpdateInput) {
    return prisma.program.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.program.delete({ where: { id } })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.program.update({ where: { id: entry.id }, data: { sortOrder: entry.sortOrder } }),
      ),
    )
  },
}
