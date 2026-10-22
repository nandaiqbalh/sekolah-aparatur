import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

export type GalleryAlbumStatus = "all" | "published" | "hidden"

function buildWhere(params: {
  search?: string
  category?: string
  status?: GalleryAlbumStatus
  publishedOnly?: boolean
}): Prisma.GalleryAlbumWhereInput | undefined {
  const and: Prisma.GalleryAlbumWhereInput[] = []

  if (params.publishedOnly || params.status === "published") {
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

export const galleryRepository = {
  findMany(params: {
    skip?: number
    take?: number
    search?: string
    category?: string
    status?: GalleryAlbumStatus
    publishedOnly?: boolean
  }) {
    return prisma.galleryAlbum.findMany({
      where: buildWhere(params),
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: {
    search?: string
    category?: string
    status?: GalleryAlbumStatus
    publishedOnly?: boolean
  }) {
    return prisma.galleryAlbum.count({ where: buildWhere(params) })
  },

  findById(id: string) {
    return prisma.galleryAlbum.findUnique({ where: { id } })
  },

  findBySlug(slug: string) {
    return prisma.galleryAlbum.findUnique({ where: { slug } })
  },

  findPublishedBySlug(slug: string) {
    return prisma.galleryAlbum.findFirst({
      where: { slug, isPublished: true },
    })
  },

  listCategories(publishedOnly = false) {
    return prisma.galleryAlbum.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    })
  },

  create(data: Prisma.GalleryAlbumCreateInput) {
    return prisma.galleryAlbum.create({ data })
  },

  update(id: string, data: Prisma.GalleryAlbumUpdateInput) {
    return prisma.galleryAlbum.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.galleryAlbum.delete({ where: { id } })
  },
}
