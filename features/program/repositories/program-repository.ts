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
const studiesOrderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]
const studiesInclude = {
  studies: {
    orderBy: studiesOrderBy,
    include: { partner: { select: { id: true, name: true, kind: true, logo: true } } },
  },
} as const

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
      include: studiesInclude,
      orderBy,
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; status?: ProgramStatus; publishedOnly?: boolean }) {
    return prisma.program.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.program.findUnique({ where: { id }, include: studiesInclude })
  },

  findBySlug(slug: string) {
    return prisma.program.findUnique({ where: { slug }, include: studiesInclude })
  },

  findPublishedBySlug(slug: string) {
    return prisma.program.findFirst({ where: { slug, isPublished: true }, include: studiesInclude })
  },

  create(data: Prisma.ProgramCreateInput) {
    return prisma.program.create({ data, include: studiesInclude })
  },

  update(id: string, data: Prisma.ProgramUpdateInput) {
    return prisma.program.update({ where: { id }, data, include: studiesInclude })
  },

  delete(id: string) {
    return prisma.program.delete({ where: { id } })
  },

  replaceStudies(
    programId: string,
    studies: {
      partnerId: string
      study: string
      strata: string
      concentration: string | null
      sortOrder: number
    }[],
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.programStudy.deleteMany({ where: { programId } })
      if (studies.length === 0) return
      await tx.programStudy.createMany({
        data: studies.map((item) => ({
          programId,
          partnerId: item.partnerId,
          study: item.study,
          strata: item.strata,
          concentration: item.concentration,
          sortOrder: item.sortOrder,
        })),
      })
    })
  },

  listPublishedStudies() {
    return prisma.programStudy.findMany({
      where: { program: { isPublished: true } },
      orderBy: [{ program: { sortOrder: "asc" } }, { sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        study: true,
        strata: true,
        concentration: true,
        sortOrder: true,
        partner: { select: { name: true } },
      },
    })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.program.update({ where: { id: entry.id }, data: { sortOrder: entry.sortOrder } }),
      ),
    )
  },
}
