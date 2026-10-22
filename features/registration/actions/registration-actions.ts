"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { registrationService } from "@/features/registration/services/registration-service"
import {
  listRegistrationsSchema,
  registrationSchema,
  updateRegistrationStatusSchema,
  type RegistrationDto,
  type RegistrationListResult,
} from "@/features/registration/schemas/registration"
import type { ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"

function revalidateRegistrations() {
  revalidatePath("/admin/pendaftaran")
  revalidatePath("/admin", "layout")
}

export async function submitRegistrationAction(
  input: unknown,
): Promise<ActionResult<RegistrationDto>> {
  const parsed = parseInput(registrationSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await registrationService.create(parsed.data)
  if (result.ok) revalidateRegistrations()
  return result
}

export async function listRegistrationsAction(
  input: unknown,
): Promise<ActionResult<RegistrationListResult>> {
  const auth = await requirePermission("pendaftaran.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listRegistrationsSchema, input)
  if (!parsed.ok) return parsed.result

  return registrationService.list(parsed.data)
}

export async function updateRegistrationStatusAction(
  input: unknown,
): Promise<ActionResult<RegistrationDto>> {
  const auth = await requirePermission("pendaftaran.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateRegistrationStatusSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await registrationService.updateStatus(parsed.data.id, parsed.data.status)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "pendaftaran",
    entityType: "registration",
    entityId: result.data.id,
    summary: `Updated registration status for ${result.data.name} to ${result.data.status}`,
  })

  revalidateRegistrations()
  return result
}
