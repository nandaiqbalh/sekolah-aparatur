"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { feeScheduleService } from "@/features/biaya/services/fee-schedule-service"
import {
  createFeeScheduleSchema,
  deleteFeeScheduleSchema,
  listFeeSchedulesSchema,
  reorderFeeSchedulesSchema,
  updateFeeScheduleSchema,
  type FeeScheduleDto,
  type FeeScheduleListResult,
} from "@/features/biaya/schemas/fee-schedule"
import type { ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

function revalidateFeeSchedules() {
  revalidatePath(ROUTES.profil)
  revalidatePath("/admin/rincian-biaya")
  revalidatePath("/admin", "layout")
}

export async function listFeeSchedulesAction(
  input: unknown,
): Promise<ActionResult<FeeScheduleListResult>> {
  const auth = await requirePermission("biaya.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listFeeSchedulesSchema, input)
  if (!parsed.ok) return parsed.result

  return feeScheduleService.list(parsed.data)
}

export async function createFeeScheduleAction(input: unknown): Promise<ActionResult<FeeScheduleDto>> {
  const auth = await requirePermission("biaya.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createFeeScheduleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await feeScheduleService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "biaya",
    entityType: "fee_schedule",
    entityId: result.data.id,
    summary: `Created fee schedule ${result.data.title}`,
  })

  revalidateFeeSchedules()
  return result
}

export async function updateFeeScheduleAction(input: unknown): Promise<ActionResult<FeeScheduleDto>> {
  const auth = await requirePermission("biaya.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateFeeScheduleSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await feeScheduleService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "biaya",
    entityType: "fee_schedule",
    entityId: result.data.id,
    summary: `Updated fee schedule ${result.data.title}`,
  })

  revalidateFeeSchedules()
  return result
}

export async function reorderFeeSchedulesAction(
  input: unknown,
): Promise<ActionResult<{ count: number }>> {
  const auth = await requirePermission("biaya.update")
  if (!auth.ok) return auth

  const parsed = parseInput(reorderFeeSchedulesSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await feeScheduleService.reorder(parsed.data.items)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "biaya",
    entityType: "fee_schedule",
    summary: "Reordered fee schedules",
  })

  revalidateFeeSchedules()
  return result
}

export async function deleteFeeScheduleAction(
  input: unknown,
): Promise<ActionResult<{ id: string; title: string }>> {
  const auth = await requirePermission("biaya.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteFeeScheduleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await feeScheduleService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "biaya",
    entityType: "fee_schedule",
    entityId: result.data.id,
    summary: `Deleted fee schedule ${result.data.title}`,
  })

  revalidateFeeSchedules()
  return result
}
