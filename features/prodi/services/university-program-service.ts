import "server-only"

import { connection } from "next/server"

import { partnerRepository } from "@/features/mitra/repositories/partner-repository"
import {
  universityProgramRepository,
  type UniversityProgramStatus,
} from "@/features/prodi/repositories/university-program-repository"
import {
  programStrata,
  type ProgramStrata,
  type PublicUniversityProgram,
  type UniversityProgramDto,
  type UniversityProgramFormValues,
  type UniversityProgramListResult,
} from "@/features/prodi/schemas/university-program"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type Row = NonNullable<Awaited<ReturnType<typeof universityProgramRepository.findById>>>

function storedConcentration(value: string) {
  return value.length > 0 ? value : null
}

function toStrata(value: string): ProgramStrata {
  return programStrata.includes(value as ProgramStrata) ? (value as ProgramStrata) : "S1"
}

function toPublic(row: Row): PublicUniversityProgram {
  return {
    id: row.id,
    university: row.partner.name,
    study: row.study,
    strata: toStrata(row.strata),
    concentration: row.concentration,
    forAparaturDesa: row.forAparaturDesa,
    forAparaturPemerintah: row.forAparaturPemerintah,
    forLegislator: row.forLegislator,
  }
}

function toDto(row: Row): UniversityProgramDto {
  return {
    ...toPublic(row),
    partnerId: row.partnerId,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

async function assertUniversityPartner(
  partnerId: string,
): Promise<Extract<ActionResult<never>, { ok: false }> | null> {
  const partner = await partnerRepository.findById(partnerId)
  if (!partner || partner.kind !== "university") {
    return actionFailure("VALIDATION_ERROR", "Kampus harus dipilih dari mitra universitas.")
  }
  return null
}

export const universityProgramService = {
  async listPublished(): Promise<PublicUniversityProgram[]> {
    await connection()
    const rows = await universityProgramRepository.findMany({ publishedOnly: true })
    return rows.map(toPublic)
  },

  count() {
    return universityProgramRepository.count({})
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    status?: UniversityProgramStatus
  }): Promise<ActionResult<UniversityProgramListResult>> {
    const search = params.search?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, status }

    const [rows, total] = await Promise.all([
      universityProgramRepository.findMany({ skip, take: params.limit, ...filter }),
      universityProgramRepository.count(filter),
    ])

    return actionSuccess({
      programs: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<UniversityProgramDto>> {
    const row = await universityProgramRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Program studi tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: UniversityProgramFormValues): Promise<ActionResult<UniversityProgramDto>> {
    const partnerError = await assertUniversityPartner(values.partnerId)
    if (partnerError) return partnerError

    const sortOrder = await universityProgramRepository.count({})
    const row = await universityProgramRepository.create({
      partner: { connect: { id: values.partnerId } },
      study: values.study,
      strata: values.strata,
      concentration: storedConcentration(values.concentration),
      forAparaturDesa: values.forAparaturDesa,
      forAparaturPemerintah: values.forAparaturPemerintah,
      forLegislator: values.forLegislator,
      sortOrder,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Program studi disimpan.")
  },

  async update(
    id: string,
    values: UniversityProgramFormValues,
  ): Promise<ActionResult<UniversityProgramDto>> {
    const current = await universityProgramRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Program studi tidak ditemukan.")

    const partnerError = await assertUniversityPartner(values.partnerId)
    if (partnerError) return partnerError

    const row = await universityProgramRepository.update(id, {
      partner: { connect: { id: values.partnerId } },
      study: values.study,
      strata: values.strata,
      concentration: storedConcentration(values.concentration),
      forAparaturDesa: values.forAparaturDesa,
      forAparaturPemerintah: values.forAparaturPemerintah,
      forLegislator: values.forLegislator,
      isPublished: values.isPublished,
    })
    return actionSuccess(toDto(row), "Program studi diperbarui.")
  },

  async reorder(entries: { id: string; sortOrder: number }[]): Promise<ActionResult<{ count: number }>> {
    const known = new Set((await universityProgramRepository.findMany({})).map((row) => row.id))
    if (entries.some((entry) => !known.has(entry.id))) {
      return actionFailure("NOT_FOUND", "Program studi tidak ditemukan.")
    }
    await universityProgramRepository.applySortOrders(entries)
    return actionSuccess({ count: entries.length }, "Urutan diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string; study: string }>> {
    const current = await universityProgramRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Program studi tidak ditemukan.")
    await universityProgramRepository.delete(id)
    return actionSuccess({ id, study: current.study }, "Program studi dihapus.")
  },
}
