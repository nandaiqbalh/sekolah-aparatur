import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

const orderBy = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]

export const heroSlideRepository = {
  findMany(params: { publishedOnly?: boolean } = {}) {
    return prisma.heroSlide.findMany({
      where: params.publishedOnly ? { isPublished: true } : undefined,
      orderBy,
    })
  },

  count() {
    return prisma.heroSlide.count()
  },

  findById(id: string) {
    return prisma.heroSlide.findUnique({ where: { id } })
  },

  create(data: Prisma.HeroSlideCreateInput) {
    return prisma.heroSlide.create({ data })
  },

  update(id: string, data: Prisma.HeroSlideUpdateInput) {
    return prisma.heroSlide.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.heroSlide.delete({ where: { id } })
  },

  async applySortOrders(entries: { id: string; sortOrder: number }[]) {
    await prisma.$transaction(
      entries.map((entry) =>
        prisma.heroSlide.update({ where: { id: entry.id }, data: { sortOrder: entry.sortOrder } }),
      ),
    )
  },
}
