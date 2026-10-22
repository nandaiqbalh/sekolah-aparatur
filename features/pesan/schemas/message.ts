import { z } from "zod"

import { contactSchema } from "@/features/contact/schemas/contact"

export const messageStatuses = ["submitted", "read", "replied", "closed"] as const
export type MessageStatus = (typeof messageStatuses)[number]
const messageStatusFilters = ["all", ...messageStatuses] as const

export const submitMessageSchema = contactSchema

export const updateMessageStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(messageStatuses),
})

export const listMessagesSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().optional(),
  status: z.enum(messageStatusFilters).optional(),
})

export type MessageDto = {
  id: string
  name: string
  contact: string
  message: string
  status: MessageStatus
  createdAt: string
  updatedAt: string
}

export type MessageListResult = {
  messages: MessageDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
