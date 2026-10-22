import "server-only"

import { programRepository } from "@/features/program/repositories/program-repository"
import { registrationRepository } from "@/features/registration/repositories/registration-repository"
import {
  type RegistrationDto,
  type RegistrationInput,
  type RegistrationListResult,
  type RegistrationStatus,
} from "@/features/registration/schemas/registration"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type RegistrationRow = NonNullable<Awaited<ReturnType<typeof registrationRepository.findById>>>

function toDto(row: RegistrationRow): RegistrationDto {
  return {
    id: row.id,
    programSlug: row.programSlug,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    institution: row.institution,
    position: row.position,
    address: row.address,
    status: row.status as RegistrationStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const registrationService = {
  async list(params: {
    page: number
    limit: number
    search?: string
    program?: string
    status?: RegistrationStatus | "all"
  }): Promise<ActionResult<RegistrationListResult>> {
    const search = params.search?.trim() || undefined
    const program = params.program?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, program, status }

    const [rows, total] = await Promise.all([
      registrationRepository.findMany({ skip, take: params.limit, ...filter }),
      registrationRepository.count(filter),
    ])

    return actionSuccess({
      registrations: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<RegistrationDto>> {
    const row = await registrationRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Pendaftaran tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: RegistrationInput): Promise<ActionResult<RegistrationDto>> {
    const program = await programRepository.findBySlug(values.program)
    if (!program) {
      return actionFailure("VALIDATION_ERROR", "Program wajib dipilih.", {
        program: ["Program wajib dipilih."],
      })
    }

    const row = await registrationRepository.create({
      programSlug: values.program,
      name: values.name,
      email: values.email,
      whatsapp: values.whatsapp,
      institution: values.institution,
      position: values.position,
      address: values.address,
      status: "submitted",
    })
    return actionSuccess(toDto(row), "Pendaftaran disimpan.")
  },

  count(status?: RegistrationStatus) {
    return registrationRepository.count({ status })
  },

  async updateStatus(id: string, status: RegistrationStatus): Promise<ActionResult<RegistrationDto>> {
    const current = await registrationRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Pendaftaran tidak ditemukan.")
    const row = await registrationRepository.updateStatus(id, status)
    return actionSuccess(toDto(row), "Status diperbarui.")
  },
}
