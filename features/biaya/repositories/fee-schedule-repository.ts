import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

export type FeeScheduleStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  status?: FeeScheduleStatus
  publishedOnly?: boolean
}): Prisma.FeeScheduleWhereInput | undefined {
  const and: Prisma.FeeScheduleWhereInput[] = []

  if (params.publishedOnly || params.status === "published") {
    and.push({ isPublished: true })
  } else if (params.status === "hidden") {
    and.push({ isPublished: false })
  }
  if (params.search) {
    and.push({
      OR: [
        { title: { contains: params.search, mode: "insensitive" } },
        { subtitle: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]
const nestedInclude = {
  groups: {
    orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
    include: {
      lines: {
        orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
      },
    },
  },
} satisfies Prisma.FeeScheduleInclude

export type FeeScheduleWithGroups = Prisma.FeeScheduleGetPayload<{ include: typeof nestedInclude }>

export const feeScheduleRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    status?: FeeScheduleStatus
    publishedOnly?: boolean
  }) {
    return prisma.feeSchedule.findMany({
      where: buildWhere(params),
      include: nestedInclude,
      orderBy,
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; status?: FeeScheduleStatus; publishedOnly?: boolean }) {
    return prisma.feeSchedule.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.feeSchedule.findUnique({ where: { id }, include: nestedInclude })
  },

  create(data: {
    title: string
    subtitle: string
    sortOrder: number
    isPublished: boolean
    groups: {
      title: string
      sortOrder: number
      lines: {
        kind: string
        label: string
        amount: number
        note: string | null
        sortOrder: number
      }[]
    }[]
  }) {
    return prisma.feeSchedule.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        groups: {
          create: data.groups.map((group) => ({
            title: group.title,
            sortOrder: group.sortOrder,
            lines: {
              create: group.lines.map((line) => ({
                kind: line.kind,
                label: line.label,
                amount: line.amount,
                note: line.note,
                sortOrder: line.sortOrder,
              })),
            },
          })),
        },
      },
      include: nestedInclude,
    })
  },

  updateMeta(
    id: string,
    data: { title: string; subtitle: string; isPublished: boolean },
  ) {
    return prisma.feeSchedule.update({
      where: { id },
      data,
      include: nestedInclude,
    })
  },

  async replaceGroups(
    scheduleId: string,
    groups: {
      title: string
      sortOrder: number
      lines: {
        kind: string
        label: string
        amount: number
        note: string | null
        sortOrder: number
      }[]
    }[],
  ) {
    await prisma.$transaction(async (tx) => {
      await tx.feeProgramGroup.deleteMany({ where: { scheduleId } })
      for (const group of groups) {
        await tx.feeProgramGroup.create({
          data: {
            scheduleId,
            title: group.title,
            sortOrder: group.sortOrder,
            lines: {
              create: group.lines.map((line) => ({
                kind: line.kind,
                label: line.label,
                amount: line.amount,
                note: line.note,
                sortOrder: line.sortOrder,
              })),
            },
          },
        })
      }
    })
  },

  delete(id: string) {
    return prisma.feeSchedule.delete({ where: { id } })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.feeSchedule.update({ where: { id: entry.id }, data: { sortOrder: entry.sortOrder } }),
      ),
    )
  },
}
