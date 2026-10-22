import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import { partnerRepository, type PartnerStatus } from "@/features/mitra/repositories/partner-repository"
import {
  type PartnerDto,
  type PartnerFormValues,
  type PartnerKind,
  type PartnerListResult,
  type PublicPartner,
} from "@/features/mitra/schemas/partner"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type PartnerRow = NonNullable<Awaited<ReturnType<typeof partnerRepository.findById>>>

function storedDetail(detail: string) {
  return detail.length > 0 ? detail : null
}

function toPublic(row: PartnerRow): PublicPartner {
  return {
    id: row.id,
    kind: row.kind as PartnerKind,
    name: row.name,
    detail: row.detail,
    logo: row.logo,
  }
}

function toDto(row: PartnerRow): PartnerDto {
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

export const partnerService = {
  count() {
    return partnerRepository.count({})
  },

  async listPublished(kind: PartnerKind): Promise<PublicPartner[]> {
    await connection()
    const rows = await partnerRepository.findMany({ kind, publishedOnly: true })
    return rows.map(toPublic)
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    kind: PartnerKind
    status?: PartnerStatus
  }): Promise<ActionResult<PartnerListResult>> {
    const search = params.search?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, kind: params.kind, status }

    const [rows, total] = await Promise.all([
      partnerRepository.findMany({ skip, take: params.limit, ...filter }),
      partnerRepository.count(filter),
    ])

    return actionSuccess({
      partners: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<PartnerDto>> {
    const row = await partnerRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: PartnerFormValues): Promise<ActionResult<PartnerDto>> {
    const existing = await partnerRepository.findByKindAndName(values.kind, values.name)
    if (existing) {
      return actionFailure("CONFLICT", "Nama sudah dipakai.", {
        name: ["Nama sudah dipakai."],
      })
    }

    const siblings = await partnerRepository.findMany({ kind: values.kind })
    const sortOrder = siblings.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    const row = await partnerRepository.create({
      kind: values.kind,
      name: values.name,
      detail: storedDetail(values.detail),
      logo: values.logo,
      sortOrder,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Data disimpan.")
  },

  async update(
    id: string,
    values: Omit<PartnerFormValues, "kind">,
  ): Promise<ActionResult<PartnerDto>> {
    const current = await partnerRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")

    if (current.kind === "facilitator" && values.detail.length < 2) {
      return actionFailure("VALIDATION_ERROR", "Nama lengkap wajib diisi.", {
        detail: ["Nama lengkap wajib diisi."],
      })
    }

    const existing = await partnerRepository.findByKindAndName(current.kind as PartnerKind, values.name)
    if (existing && existing.id !== id) {
      return actionFailure("CONFLICT", "Nama sudah dipakai.", {
        name: ["Nama sudah dipakai."],
      })
    }

    const row = await partnerRepository.update(id, {
      name: values.name,
      detail: storedDetail(values.detail),
      logo: values.logo,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Data diperbarui.")
  },

  async reorder(entries: { id: string; sortOrder: number }[]): Promise<ActionResult<{ count: number }>> {
    const rows = await partnerRepository.findMany({})
    const selected = rows.filter((row) => entries.some((entry) => entry.id === row.id))
    if (selected.length !== entries.length) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")
    if (new Set(selected.map((row) => row.kind)).size > 1) {
      return actionFailure("VALIDATION_ERROR", "Urutan hanya berlaku dalam jenis yang sama.")
    }
    await partnerRepository.applySortOrders(entries)
    return actionSuccess({ count: entries.length }, "Urutan diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string; name: string }>> {
    const current = await partnerRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Data tidak ditemukan.")
    await partnerRepository.delete(id)
    return actionSuccess({ id, name: current.name }, "Data dihapus.")
  },

  async saveLogo(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "mitra")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/mitra/${filename}` })
  },
}
