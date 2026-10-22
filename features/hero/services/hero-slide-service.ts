import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import { heroSlideRepository } from "@/features/hero/repositories/hero-slide-repository"
import type {
  HeroSlideDto,
  HeroSlideFormValues,
  PublicHeroSlide,
} from "@/features/hero/schemas/hero-slide"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type HeroSlideRow = NonNullable<Awaited<ReturnType<typeof heroSlideRepository.findById>>>

function toPublic(row: HeroSlideRow): PublicHeroSlide {
  return {
    id: row.id,
    image: row.image,
    alt: row.alt,
  }
}

function toDto(row: HeroSlideRow): HeroSlideDto {
  return {
    ...toPublic(row),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const heroSlideService = {
  async listPublished(): Promise<PublicHeroSlide[]> {
    await connection()
    const rows = await heroSlideRepository.findMany({ publishedOnly: true })
    return rows.map(toPublic)
  },

  async list(): Promise<ActionResult<HeroSlideDto[]>> {
    const rows = await heroSlideRepository.findMany()
    return actionSuccess(rows.map(toDto))
  },

  async getById(id: string): Promise<ActionResult<HeroSlideDto>> {
    const row = await heroSlideRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: HeroSlideFormValues): Promise<ActionResult<HeroSlideDto>> {
    const siblings = await heroSlideRepository.findMany()
    const sortOrder = siblings.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    const row = await heroSlideRepository.create({
      image: values.image,
      alt: values.alt,
      sortOrder,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Data disimpan.")
  },

  async update(id: string, values: HeroSlideFormValues): Promise<ActionResult<HeroSlideDto>> {
    const current = await heroSlideRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")

    const row = await heroSlideRepository.update(id, {
      image: values.image,
      alt: values.alt,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Data diperbarui.")
  },

  async reorder(entries: { id: string; sortOrder: number }[]): Promise<ActionResult<{ count: number }>> {
    const rows = await heroSlideRepository.findMany()
    const selected = rows.filter((row) => entries.some((entry) => entry.id === row.id))
    if (selected.length !== entries.length) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")

    await heroSlideRepository.applySortOrders(entries)
    return actionSuccess({ count: entries.length }, "Urutan diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string }>> {
    const current = await heroSlideRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")

    await heroSlideRepository.delete(id)
    return actionSuccess({ id }, "Data dihapus.")
  },

  async saveImage(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "hero")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/hero/${filename}` })
  },
}
