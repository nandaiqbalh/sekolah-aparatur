import "server-only"

import { messageRepository } from "@/features/pesan/repositories/message-repository"
import {
  type MessageDto,
  type MessageListResult,
  type MessageStatus,
} from "@/features/pesan/schemas/message"
import type { ContactInput } from "@/features/contact/schemas/contact"
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result"

type MessageRow = NonNullable<Awaited<ReturnType<typeof messageRepository.findById>>>

function toDto(row: MessageRow): MessageDto {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact,
    message: row.message,
    status: row.status as MessageStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const messageService = {
  async list(params: {
    page: number
    limit: number
    search?: string
    status?: MessageStatus | "all"
  }): Promise<ActionResult<MessageListResult>> {
    const search = params.search?.trim() || undefined
    const status = params.status && params.status !== "all" ? params.status : undefined
    const skip = (params.page - 1) * params.limit
    const filter = { search, status }

    const [rows, total] = await Promise.all([
      messageRepository.findMany({ skip, take: params.limit, ...filter }),
      messageRepository.count(filter),
    ])

    return actionSuccess({
      messages: rows.map(toDto),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<MessageDto>> {
    const row = await messageRepository.findById(id)
    if (!row) return actionFailure("NOT_FOUND", "Pesan tidak ditemukan.")
    return actionSuccess(toDto(row))
  },

  async create(values: ContactInput): Promise<ActionResult<MessageDto>> {
    const row = await messageRepository.create({
      name: values.name,
      contact: values.contact,
      message: values.message,
      status: "submitted",
    })
    return actionSuccess(toDto(row), "Pesan disimpan.")
  },

  count(status?: MessageStatus) {
    return messageRepository.count({ status })
  },

  async updateStatus(id: string, status: MessageStatus): Promise<ActionResult<MessageDto>> {
    const current = await messageRepository.findById(id)
    if (!current) return actionFailure("NOT_FOUND", "Pesan tidak ditemukan.")
    const row = await messageRepository.updateStatus(id, status)
    return actionSuccess(toDto(row), "Status diperbarui.")
  },
}
