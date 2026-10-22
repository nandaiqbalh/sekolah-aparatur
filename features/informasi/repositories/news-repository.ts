import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

export type NewsArticleStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  category?: string
  status?: NewsArticleStatus
  publishedOnly?: boolean
}): Prisma.NewsArticleWhereInput | undefined {
  const and: Prisma.NewsArticleWhereInput[] = []

  if (params.publishedOnly) {
    and.push({ isPublished: true })
  } else if (params.status === "published") {
    and.push({ isPublished: true })
  } else if (params.status === "hidden") {
    and.push({ isPublished: false })
  }

  if (params.category) {
    and.push({ category: params.category })
  }

  if (params.search) {
    and.push({
      OR: [
        { title: { contains: params.search, mode: "insensitive" } },
        { summary: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

export const newsRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    category?: string
    status?: NewsArticleStatus
    publishedOnly?: boolean
  }) {
    return prisma.newsArticle.findMany({
      where: buildWhere(params),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "asc" }],
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: {
    search?: string
    category?: string
    status?: NewsArticleStatus
    publishedOnly?: boolean
  }) {
    return prisma.newsArticle.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.newsArticle.findUnique({ where: { id } })
  },

  findBySlug(slug: string) {
    return prisma.newsArticle.findUnique({ where: { slug } })
  },

  findPublishedBySlug(slug: string) {
    return prisma.newsArticle.findFirst({
      where: { slug, isPublished: true },
    })
  },

  listCategories() {
    return prisma.newsArticle.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    })
  },

  create(data: Prisma.NewsArticleCreateInput) {
    return prisma.newsArticle.create({ data })
  },

  update(id: string, data: Prisma.NewsArticleUpdateInput) {
    return prisma.newsArticle.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.newsArticle.delete({ where: { id } })
  },
}
