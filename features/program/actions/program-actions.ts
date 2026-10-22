"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { programService } from "@/features/program/services/program-service"
import {
  createProgramSchema,
  deleteProgramSchema,
  listProgramsSchema,
  reorderProgramsSchema,
  updateProgramSchema,
  uploadProgramImageSchema,
  type ProgramDto,
  type ProgramListResult,
} from "@/features/program/schemas/program"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { registrationPath } from "@/lib/routes"

function revalidatePrograms(slug?: string) {
  revalidatePath("/", "layout")
  revalidatePath("/admin/program")
  if (!slug) return
  revalidatePath(`/sekolah-aparatur/${slug}`)
  revalidatePath(registrationPath(slug))
}

export async function listProgramsAction(input: unknown): Promise<ActionResult<ProgramListResult>> {
  const auth = await requirePermission("program.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listProgramsSchema, input)
  if (!parsed.ok) return parsed.result

  return programService.list(parsed.data)
}

export async function createProgramAction(input: unknown): Promise<ActionResult<ProgramDto>> {
  const auth = await requirePermission("program.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await programService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "program",
    entityType: "program",
    entityId: result.data.id,
    summary: `Created program ${result.data.slug}`,
  })

  revalidatePrograms(result.data.slug)
  return result
}

export async function updateProgramAction(input: unknown): Promise<ActionResult<ProgramDto>> {
  const auth = await requirePermission("program.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await programService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "program",
    entityType: "program",
    entityId: result.data.id,
    summary: `Updated program ${result.data.slug}`,
  })

  revalidatePrograms(result.data.slug)
  return result
}

export async function reorderProgramsAction(
  input: unknown,
): Promise<ActionResult<{ count: number }>> {
  const auth = await requirePermission("program.update")
  if (!auth.ok) return auth

  const parsed = parseInput(reorderProgramsSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await programService.reorder(parsed.data.items)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "program",
    entityType: "program",
    summary: "Reordered programs",
  })

  revalidatePrograms()
  return result
}

export async function deleteProgramAction(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string; title: string }>> {
  const auth = await requirePermission("program.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await programService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "program",
    entityType: "program",
    entityId: result.data.id,
    summary: `Deleted program ${result.data.slug}`,
  })

  revalidatePrograms(result.data.slug)
  return result
}

export async function uploadProgramImageAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const createAuth = await requirePermission("program.create")
  const auth = createAuth.ok ? createAuth : await requirePermission("program.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadProgramImageSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return programService.saveImage({ type: parsed.data.type, bytes })
}
