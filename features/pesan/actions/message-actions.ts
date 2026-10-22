"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { messageService } from "@/features/pesan/services/message-service"
import {
  listMessagesSchema,
  submitMessageSchema,
  updateMessageStatusSchema,
  type MessageDto,
  type MessageListResult,
} from "@/features/pesan/schemas/message"
import type { ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

function revalidateMessages() {
  revalidatePath("/admin/pesan")
  revalidatePath("/admin", "layout")
  revalidatePath(ROUTES.kontak)
}

export async function submitMessageAction(input: unknown): Promise<ActionResult<MessageDto>> {
  const parsed = parseInput(submitMessageSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await messageService.create(parsed.data)
  if (result.ok) revalidateMessages()
  return result
}

export async function listMessagesAction(input: unknown): Promise<ActionResult<MessageListResult>> {
  const auth = await requirePermission("pesan.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listMessagesSchema, input)
  if (!parsed.ok) return parsed.result

  return messageService.list(parsed.data)
}

export async function updateMessageStatusAction(input: unknown): Promise<ActionResult<MessageDto>> {
  const auth = await requirePermission("pesan.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateMessageStatusSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await messageService.updateStatus(parsed.data.id, parsed.data.status)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "pesan",
    entityType: "contact_message",
    entityId: result.data.id,
    summary: `Updated message status for ${result.data.name} to ${result.data.status}`,
  })

  revalidateMessages()
  return result
}
