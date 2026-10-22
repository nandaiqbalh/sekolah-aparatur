"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { partnerService } from "@/features/mitra/services/partner-service"
import {
  createPartnerSchema,
  deletePartnerSchema,
  listPartnersSchema,
  reorderPartnersSchema,
  updatePartnerSchema,
  uploadPartnerLogoSchema,
  type PartnerDto,
  type PartnerListResult,
} from "@/features/mitra/schemas/partner"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES, registrationPath } from "@/lib/routes"

function revalidatePartners() {
  revalidatePath(ROUTES.home)
  revalidatePath(ROUTES.profil)
  revalidatePath(ROUTES.sekolahAparatur)
  revalidatePath(ROUTES.aparaturPemerintah)
  revalidatePath(ROUTES.aparaturDesa)
  revalidatePath(ROUTES.legislator)
  revalidatePath(registrationPath("daerah-dan-desa"))
  revalidatePath(registrationPath("legislator"))
  revalidatePath(registrationPath("aparatur-pemerintah"))
  revalidatePath(registrationPath("aparatur-desa"))
  revalidatePath("/admin/mitra")
}

export async function listPartnersAction(input: unknown): Promise<ActionResult<PartnerListResult>> {
  const auth = await requirePermission("mitra.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listPartnersSchema, input)
  if (!parsed.ok) return parsed.result

  return partnerService.list(parsed.data)
}

export async function createPartnerAction(input: unknown): Promise<ActionResult<PartnerDto>> {
  const auth = await requirePermission("mitra.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createPartnerSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await partnerService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "mitra",
    entityType: "partner",
    entityId: result.data.id,
    summary: `Created partner ${result.data.name}`,
  })

  revalidatePartners()
  return result
}

export async function updatePartnerAction(input: unknown): Promise<ActionResult<PartnerDto>> {
  const auth = await requirePermission("mitra.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updatePartnerSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await partnerService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "mitra",
    entityType: "partner",
    entityId: result.data.id,
    summary: `Updated partner ${result.data.name}`,
  })

  revalidatePartners()
  return result
}

export async function reorderPartnersAction(
  input: unknown,
): Promise<ActionResult<{ count: number }>> {
  const auth = await requirePermission("mitra.update")
  if (!auth.ok) return auth

  const parsed = parseInput(reorderPartnersSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await partnerService.reorder(parsed.data.items)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "mitra",
    entityType: "partner",
    summary: "Reordered partners",
  })

  revalidatePartners()
  return result
}

export async function deletePartnerAction(
  input: unknown,
): Promise<ActionResult<{ id: string; name: string }>> {
  const auth = await requirePermission("mitra.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deletePartnerSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await partnerService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "mitra",
    entityType: "partner",
    entityId: result.data.id,
    summary: `Deleted partner ${result.data.name}`,
  })

  revalidatePartners()
  return result
}

export async function uploadPartnerLogoAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const createAuth = await requirePermission("mitra.create")
  const auth = createAuth.ok ? createAuth : await requirePermission("mitra.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadPartnerLogoSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return partnerService.saveLogo({ type: parsed.data.type, bytes })
}
