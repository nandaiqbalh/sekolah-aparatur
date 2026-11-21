"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { universityProgramService } from "@/features/prodi/services/university-program-service"
import {
  createUniversityProgramSchema,
  deleteUniversityProgramSchema,
  listUniversityProgramsSchema,
  reorderUniversityProgramsSchema,
  updateUniversityProgramSchema,
  type UniversityProgramDto,
  type UniversityProgramListResult,
} from "@/features/prodi/schemas/university-program"
import type { ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ADMIN_ROUTES, ROUTES } from "@/lib/routes"

function revalidateUniversityPrograms() {
  revalidatePath(ROUTES.profil)
  revalidatePath(ADMIN_ROUTES.programStudi)
  revalidatePath("/admin", "layout")
}

export async function listUniversityProgramsAction(
  input: unknown,
): Promise<ActionResult<UniversityProgramListResult>> {
  const auth = await requirePermission("prodi.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listUniversityProgramsSchema, input)
  if (!parsed.ok) return parsed.result

  return universityProgramService.list(parsed.data)
}

export async function createUniversityProgramAction(
  input: unknown,
): Promise<ActionResult<UniversityProgramDto>> {
  const auth = await requirePermission("prodi.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createUniversityProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await universityProgramService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "prodi",
    entityType: "university_program",
    entityId: result.data.id,
    summary: `Created university program ${result.data.study}`,
  })

  revalidateUniversityPrograms()
  return result
}

export async function updateUniversityProgramAction(
  input: unknown,
): Promise<ActionResult<UniversityProgramDto>> {
  const auth = await requirePermission("prodi.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateUniversityProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await universityProgramService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "prodi",
    entityType: "university_program",
    entityId: result.data.id,
    summary: `Updated university program ${result.data.study}`,
  })

  revalidateUniversityPrograms()
  return result
}

export async function reorderUniversityProgramsAction(
  input: unknown,
): Promise<ActionResult<{ count: number }>> {
  const auth = await requirePermission("prodi.update")
  if (!auth.ok) return auth

  const parsed = parseInput(reorderUniversityProgramsSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await universityProgramService.reorder(parsed.data.items)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "prodi",
    entityType: "university_program",
    summary: `Reordered ${result.data?.count ?? 0} university programs`,
  })

  revalidateUniversityPrograms()
  return result
}

export async function deleteUniversityProgramAction(
  input: unknown,
): Promise<ActionResult<{ id: string; study: string }>> {
  const auth = await requirePermission("prodi.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteUniversityProgramSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await universityProgramService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "prodi",
    entityType: "university_program",
    entityId: result.data.id,
    summary: `Deleted university program ${result.data.study}`,
  })

  revalidateUniversityPrograms()
  return result
}
