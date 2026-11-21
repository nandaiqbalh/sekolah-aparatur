import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

export type UniversityProgramStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  status?: UniversityProgramStatus
  publishedOnly?: boolean
}): Prisma.UniversityProgramWhereInput | undefined {
  const and: Prisma.UniversityProgramWhereInput[] = []

  if (params.publishedOnly || params.status === "published") {
    and.push({ isPublished: true })
  } else if (params.status === "hidden") {
    and.push({ isPublished: false })
  }
  if (params.search) {
    and.push({
      OR: [
        { study: { contains: params.search, mode: "insensitive" } },
        { concentration: { contains: params.search, mode: "insensitive" } },
        { partner: { name: { contains: params.search, mode: "insensitive" } } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]
const partnerSelect = { select: { id: true, name: true, kind: true } } as const
const include = { partner: partnerSelect } as const

export const universityProgramRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    status?: UniversityProgramStatus
    publishedOnly?: boolean
  }) {
    return prisma.universityProgram.findMany({
      where: buildWhere(params),
      include,
      orderBy,
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; status?: UniversityProgramStatus; publishedOnly?: boolean }) {
    return prisma.universityProgram.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.universityProgram.findUnique({ where: { id }, include })
  },

  create(data: Prisma.UniversityProgramCreateInput) {
    return prisma.universityProgram.create({ data, include })
  },

  update(id: string, data: Prisma.UniversityProgramUpdateInput) {
    return prisma.universityProgram.update({ where: { id }, data, include })
  },

  delete(id: string) {
    return prisma.universityProgram.delete({ where: { id } })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.universityProgram.update({
          where: { id: entry.id },
          data: { sortOrder: entry.sortOrder },
        }),
      ),
    )
  },
}
