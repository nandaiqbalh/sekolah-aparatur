"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { institutionProfileService } from "@/features/profil/services/institution-profile-service"
import {
  updateInstitutionProfileSchema,
  uploadProfileImageSchema,
  type InstitutionProfileDto,
} from "@/features/profil/schemas/institution-profile"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

export async function updateInstitutionProfileAction(
  input: unknown,
): Promise<ActionResult<InstitutionProfileDto>> {
  const auth = await requirePermission("profil.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateInstitutionProfileSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await institutionProfileService.update(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "profil",
    entityType: "institution_profile",
    entityId: result.data.key,
    summary: "Updated institution profile",
  })

  revalidatePath(ROUTES.profil)
  revalidatePath("/admin/profil-lembaga")
  return result
}

export async function uploadProfileImageAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const auth = await requirePermission("profil.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadProfileImageSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return institutionProfileService.saveImage({ type: parsed.data.type, bytes })
}
