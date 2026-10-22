import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result"
import { newsRepository, type NewsArticleStatus } from "@/features/informasi/repositories/news-repository"
import {
  isoDateToPublishedAt,
  publishedAtToIsoDate,
  type NewsArticleDto,
  type NewsArticleFormValues,
  type NewsArticleListResult,
  type PublicNewsArticle,
} from "@/features/informasi/schemas/news-article"

type NewsRow = NonNullable<Awaited<ReturnType<typeof newsRepository.findById>>>

function toPublic(row: NewsRow): PublicNewsArticle {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    publishedAt: publishedAtToIsoDate(row.publishedAt),
    summary: row.summary,
    thumbnail: row.thumbnail,
    gallery: row.gallery,
    bodyHtml: row.bodyHtml,
  }
}

function toDto(row: NewsRow): NewsArticleDto {
  return {
    ...toPublic(row),
    id: row.id,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function articleData(values: NewsArticleFormValues) {
  return {
    slug: values.slug,
    title: values.title,
    category: values.category,
    publishedAt: isoDateToPublishedAt(values.publishedAt),
    summary: values.summary,
    thumbnail: values.thumbnail,
    gallery: values.gallery,
    bodyHtml: values.bodyHtml,
    isPublished: values.isPublished,
  }
}

const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const newsService = {
  async listSitemap(): Promise<{ slug: string; updatedAt: Date }[]> {
    await connection()
    const rows = await newsRepository.findMany({ publishedOnly: true })
    return rows.map((row) => ({ slug: row.slug, updatedAt: row.updatedAt }))
  },

  async listPublished(limit?: number): Promise<PublicNewsArticle[]> {
    await connection()
    const rows = await newsRepository.findMany({
      publishedOnly: true,
      take: limit,
    })
    return rows.map(toPublic)
  },

  count() {
    return newsRepository.count({})
  },

  async getPublishedBySlug(slug: string): Promise<PublicNewsArticle | null> {
    await connection()
    const row = await newsRepository.findPublishedBySlug(slug)
    return row ? toPublic(row) : null
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    category?: string
    status?: NewsArticleStatus
  }): Promise<ActionResult<NewsArticleListResult>> {
    const search = params.search?.trim() || undefined
    const category = params.category?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, category, status }

    const [rows, total] = await Promise.all([
      newsRepository.findMany({ skip, take: params.limit, ...filter }),
      newsRepository.count(filter),
    ])

    return actionSuccess({
      articles: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async listCategories(): Promise<string[]> {
    const rows = await newsRepository.listCategories()
    return rows.map((row) => row.category)
  },

  async getById(id: string): Promise<ActionResult<NewsArticleDto>> {
    const row = await newsRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Informasi tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: NewsArticleFormValues): Promise<ActionResult<NewsArticleDto>> {
    const existing = await newsRepository.findBySlug(values.slug)
    if (existing) {
      return actionFailure("CONFLICT", "Slug sudah dipakai.", {
        slug: ["Slug sudah dipakai."],
      })
    }
    const row = await newsRepository.create(articleData(values))
    return actionSuccess(toDto(row), "Informasi disimpan.")
  },

  async update(id: string, values: NewsArticleFormValues): Promise<ActionResult<NewsArticleDto>> {
    const current = await newsRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Informasi tidak ditemukan.")

    const existing = await newsRepository.findBySlug(values.slug)
    if (existing && existing.id !== id) {
      return actionFailure("CONFLICT", "Slug sudah dipakai.", {
        slug: ["Slug sudah dipakai."],
      })
    }

    const row = await newsRepository.update(id, articleData(values))
    return actionSuccess(toDto(row), "Informasi diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string; title: string }>> {
    const current = await newsRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Informasi tidak ditemukan.")
    await newsRepository.delete(id)
    return actionSuccess({ id, title: current.title }, "Informasi dihapus.")
  },

  async saveImage(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "informasi")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/informasi/${filename}` })
  },
}
