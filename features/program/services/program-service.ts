import "server-only"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { connection } from "next/server"

import { programRepository, type ProgramStatus } from "@/features/program/repositories/program-repository"
import {
  programCampusSchema,
  programDocumentSchema,
  programHighlightSchema,
  programPeriodSchema,
  programRequirementGroupSchema,
  programStrata,
  type ProgramDto,
  type ProgramFormValues,
  type ProgramListResult,
  type ProgramStrata,
  type ProgramStudy,
  type PublicProgram,
  type PublicProgramCard,
} from "@/features/program/schemas/program"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"
import {
  documentExtensionFor,
  documentFormatFor,
  formatDocumentSize,
  isAllowedDocumentType,
  type DocumentMimeType,
} from "@/lib/document-upload"
import { slugifyTitle } from "@/lib/slug"
import type { Prisma } from "@/generated/prisma/client"
import { z } from "zod"

type ProgramRow = NonNullable<Awaited<ReturnType<typeof programRepository.findById>>>

const IMAGE_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

function readJson<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const parsed = schema.safeParse(value)
  return parsed.success ? parsed.data : fallback
}

function storedConcentration(value: string) {
  return value.length > 0 ? value : null
}

function toStudy(row: ProgramRow["studies"][number]): ProgramStudy {
  const strata = programStrata.includes(row.strata as ProgramStrata) ? (row.strata as ProgramStrata) : "S1"
  return {
    university: row.university,
    study: row.study,
    strata,
    concentration: row.concentration ?? "",
  }
}

function toPublic(row: ProgramRow): PublicProgram {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    image: row.image,
    imageAlt: row.imageAlt,
    introParagraphs: row.introParagraphs,
    highlights: readJson(z.array(programHighlightSchema), row.highlights, []),
    studies: row.studies.map(toStudy),
    registrationPeriods: readJson(z.array(programPeriodSchema), row.registrationPeriods, []),
    campus: readJson(programCampusSchema, row.campus, { name: "", logo: "", description: "", address: "" }),
    requirementGroups: readJson(z.array(programRequirementGroupSchema), row.requirementGroups, []),
    documents: readJson(z.array(programDocumentSchema), row.documents, []),
    mitraIds: row.mitraIds,
    isPublished: row.isPublished,
  }
}

function toCard(row: ProgramRow): PublicProgramCard {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    image: row.image,
    imageAlt: row.imageAlt,
  }
}

function toDto(row: ProgramRow): ProgramDto {
  return {
    ...toPublic(row),
    id: row.id,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

function contentData(values: Omit<ProgramFormValues, "studies">) {
  return {
    title: values.title,
    summary: values.summary,
    image: values.image,
    imageAlt: values.imageAlt,
    introParagraphs: values.introParagraphs,
    highlights: toJson(values.highlights),
    registrationPeriods: toJson(values.registrationPeriods),
    campus: toJson(values.campus),
    requirementGroups: toJson(values.requirementGroups),
    documents: toJson(values.documents),
    mitraIds: values.mitraIds,
    isPublished: values.isPublished,
  }
}

function studyRows(studies: ProgramStudy[]) {
  return studies.map((item, index) => ({
    university: item.university,
    study: item.study,
    strata: item.strata,
    concentration: storedConcentration(item.concentration),
    sortOrder: index,
  }))
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugifyTitle(title) || "program"
  let candidate = base
  let suffix = 2

  while (true) {
    const existing = await programRepository.findBySlug(candidate)
    if (!existing) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export type PublicUniversityProgramRow = {
  university: string
  study: string
  strata: ProgramStrata
  concentration: string | null
}

export const programService = {
  async listPublished(): Promise<PublicProgramCard[]> {
    await connection()
    const rows = await programRepository.findMany({ publishedOnly: true })
    return rows.map(toCard)
  },

  async listSitemap(): Promise<{ slug: string; updatedAt: Date }[]> {
    await connection()
    const rows = await programRepository.findMany({ publishedOnly: true })
    return rows.map((row) => ({ slug: row.slug, updatedAt: row.updatedAt }))
  },

  async getPublishedBySlug(slug: string): Promise<PublicProgram | null> {
    await connection()
    const row = await programRepository.findPublishedBySlug(slug)
    return row ? toPublic(row) : null
  },

  async listPublishedStudies(): Promise<PublicUniversityProgramRow[]> {
    await connection()
    const rows = await programRepository.listPublishedStudies()
    return rows.map((row) => ({
      university: row.university,
      study: row.study,
      strata: programStrata.includes(row.strata as ProgramStrata) ? (row.strata as ProgramStrata) : "S1",
      concentration: row.concentration,
    }))
  },

  count() {
    return programRepository.count({})
  },

  async listTitles(): Promise<{ slug: string; title: string }[]> {
    const rows = await programRepository.findMany({})
    return rows.map((row) => ({ slug: row.slug, title: row.title }))
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    status?: ProgramStatus
  }): Promise<ActionResult<ProgramListResult>> {
    const search = params.search?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, status }

    const [rows, total] = await Promise.all([
      programRepository.findMany({ skip, take: params.limit, ...filter }),
      programRepository.count(filter),
    ])

    return actionSuccess({
      programs: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<ProgramDto>> {
    const row = await programRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: ProgramFormValues): Promise<ActionResult<ProgramDto>> {
    const slug = await uniqueSlug(values.title)
    const sortOrder = await programRepository.count({})
    const { studies, ...rest } = values
    const row = await programRepository.create({
      slug,
      sortOrder,
      ...contentData(rest),
    })
    await programRepository.replaceStudies(row.id, studyRows(studies))
    const refreshed = await programRepository.findById(row.id)
    if (!refreshed) return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    return actionSuccess(toDto(refreshed), "Program disimpan.")
  },

  async update(id: string, values: ProgramFormValues): Promise<ActionResult<ProgramDto>> {
    const current = await programRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    const { studies, ...rest } = values
    await programRepository.update(id, contentData(rest))
    await programRepository.replaceStudies(id, studyRows(studies))
    const row = await programRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    return actionSuccess(toDto(row), "Program diperbarui.")
  },

  async reorder(entries: { id: string; sortOrder: number }[]): Promise<ActionResult<{ count: number }>> {
    const known = new Set((await programRepository.findMany({})).map((row) => row.id))
    if (entries.some((entry) => !known.has(entry.id))) {
      return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    }
    await programRepository.applySortOrders(entries)
    return actionSuccess({ count: entries.length }, "Urutan diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string; slug: string; title: string }>> {
    const current = await programRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Program tidak ditemukan.")
    await programRepository.delete(id)
    return actionSuccess({ id, slug: current.slug, title: current.title }, "Program dihapus.")
  },

  async saveImage(file: { type: string; bytes: Buffer }): Promise<ActionResult<{ path: string }>> {
    const extension = IMAGE_EXTENSION[file.type]
    if (!extension) {
      return actionFailure("VALIDATION_ERROR", "Gambar harus JPEG, PNG, atau WebP.")
    }

    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "program")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)
    return actionSuccess({ path: `/uploads/program/${filename}` })
  },

  async saveDocument(file: {
    type: string
    bytes: Buffer
    originalName?: string
  }): Promise<ActionResult<{ path: string; format: string; size: string; suggestedName: string }>> {
    if (!isAllowedDocumentType(file.type)) {
      return actionFailure("VALIDATION_ERROR", "Berkas harus PDF, DOC, atau DOCX.")
    }

    const mime = file.type as DocumentMimeType
    const extension = documentExtensionFor(mime)
    const filename = `${crypto.randomUUID()}.${extension}`
    const directory = path.join(process.cwd(), "public", "uploads", "program", "documents")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, filename), file.bytes)

    const suggestedName = (file.originalName ?? "")
      .replace(/\.[^.]+$/, "")
      .replaceAll("_", " ")
      .trim()

    return actionSuccess({
      path: `/uploads/program/documents/${filename}`,
      format: documentFormatFor(mime),
      size: formatDocumentSize(file.bytes.length),
      suggestedName,
    })
  },
}
