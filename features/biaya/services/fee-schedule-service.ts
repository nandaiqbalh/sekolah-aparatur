import "server-only"

import { connection } from "next/server"

import {
  feeScheduleRepository,
  type FeeScheduleStatus,
  type FeeScheduleWithGroups,
} from "@/features/biaya/repositories/fee-schedule-repository"
import {
  feeLineKinds,
  type FeeLineDto,
  type FeeLineKind,
  type FeeProgramGroupDto,
  type FeeScheduleDto,
  type FeeScheduleFormValues,
  type FeeScheduleListResult,
  type PublicFeeSchedule,
} from "@/features/biaya/schemas/fee-schedule"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type ScheduleRow = FeeScheduleWithGroups

function toLine(row: ScheduleRow["groups"][number]["lines"][number]): FeeLineDto {
  const kind = feeLineKinds.includes(row.kind as FeeLineKind) ? (row.kind as FeeLineKind) : "item"
  return {
    kind,
    label: row.label,
    amount: row.amount,
    note: row.note,
  }
}

function toGroup(row: ScheduleRow["groups"][number]): FeeProgramGroupDto {
  return {
    title: row.title,
    lines: row.lines.map(toLine),
  }
}

function toPublic(row: ScheduleRow): PublicFeeSchedule {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    groups: row.groups.map(toGroup),
  }
}

function toDto(row: ScheduleRow): FeeScheduleDto {
  return {
    ...toPublic(row),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

function toFormGroups(values: FeeScheduleFormValues["groups"]) {
  return values.map((group, groupIndex) => ({
    title: group.title,
    sortOrder: groupIndex,
    lines: group.lines.map((line, lineIndex) => ({
      kind: line.kind,
      label: line.label,
      amount: Number(line.amount),
      note: line.note.length > 0 ? line.note : null,
      sortOrder: lineIndex,
    })),
  }))
}

function toFormValues(row: ScheduleRow): FeeScheduleFormValues {
  return {
    title: row.title,
    subtitle: row.subtitle,
    isPublished: row.isPublished,
    groups: row.groups.map((group) => ({
      title: group.title,
      lines: group.lines.map((line) => ({
        kind: feeLineKinds.includes(line.kind as FeeLineKind) ? (line.kind as FeeLineKind) : "item",
        label: line.label,
        amount: String(line.amount),
        note: line.note ?? "",
      })),
    })),
  }
}

export const feeScheduleService = {
  async listPublished(): Promise<PublicFeeSchedule[]> {
    await connection()
    const rows = await feeScheduleRepository.findMany({ publishedOnly: true })
    return rows.map(toPublic)
  },

  count() {
    return feeScheduleRepository.count({})
  },

  async list(params: {
    page: number
    limit: number
    search?: string
    status?: FeeScheduleStatus
  }): Promise<ActionResult<FeeScheduleListResult>> {
    const search = params.search?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, status }

    const [rows, total] = await Promise.all([
      feeScheduleRepository.findMany({ skip, take: params.limit, ...filter }),
      feeScheduleRepository.count(filter),
    ])

    return actionSuccess({
      schedules: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<FeeScheduleDto>> {
    const row = await feeScheduleRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async getFormById(id: string): Promise<ActionResult<FeeScheduleFormValues & { id: string }>> {
    const row = await feeScheduleRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")
    return actionSuccess({ id: row.id, ...toFormValues(row) })
  },

  async create(values: FeeScheduleFormValues): Promise<ActionResult<FeeScheduleDto>> {
    const sortOrder = await feeScheduleRepository.count({})
    const row = await feeScheduleRepository.create({
      title: values.title,
      subtitle: values.subtitle,
      sortOrder,
      isPublished: values.isPublished,
      groups: toFormGroups(values.groups),
    })
    return actionSuccess(toDto(row), "Rincian biaya disimpan.")
  },

  async update(id: string, values: FeeScheduleFormValues): Promise<ActionResult<FeeScheduleDto>> {
    const current = await feeScheduleRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")

    await feeScheduleRepository.updateMeta(id, {
      title: values.title,
      subtitle: values.subtitle,
      isPublished: values.isPublished,
    })
    await feeScheduleRepository.replaceGroups(id, toFormGroups(values.groups))
    const row = await feeScheduleRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")
    return actionSuccess(toDto(row), "Rincian biaya diperbarui.")
  },

  async reorder(entries: { id: string; sortOrder: number }[]): Promise<ActionResult<{ count: number }>> {
    const known = new Set((await feeScheduleRepository.findMany({})).map((row) => row.id))
    if (entries.some((entry) => !known.has(entry.id))) {
      return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")
    }
    await feeScheduleRepository.applySortOrders(entries)
    return actionSuccess({ count: entries.length }, "Urutan diperbarui.")
  },

  async delete(id: string): Promise<ActionResult<{ id: string; title: string }>> {
    const current = await feeScheduleRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Rincian biaya tidak ditemukan.")
    await feeScheduleRepository.delete(id)
    return actionSuccess({ id, title: current.title }, "Rincian biaya dihapus.")
  },
}
