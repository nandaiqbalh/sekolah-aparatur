"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { userService } from "@/features/user/services/user-service"
import {
  createUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  getUsersSchema,
  toggleUserActiveSchema,
  updateUserSchema,
} from "@/features/user/schemas/user"
import type { StaffUserDto, StaffUserListResult } from "@/features/user/schemas/user-types"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import type { ActionResult } from "@/lib/action-result"

export async function getUsersAction(
  input: unknown = {}
): Promise<ActionResult<StaffUserListResult>> {
  const auth = await requirePermission("users.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getUsersSchema, input)
  if (!parsed.ok) return parsed.result

  return userService.getUsers(parsed.data)
}

export async function getUserByIdAction(
  input: unknown
): Promise<ActionResult<StaffUserDto>> {
  const auth = await requirePermission("users.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getUserByIdSchema, input)
  if (!parsed.ok) return parsed.result

  return userService.getUserById(parsed.data.id)
}

export async function createUserAction(
  input: unknown
): Promise<ActionResult<StaffUserDto>> {
  const auth = await requirePermission("users.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createUserSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await userService.createUser(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "users",
    entityType: "user",
    entityId: result.data.id,
    summary: `Created user ${result.data.username}`,
  })

  revalidatePath("/admin/system/users")
  return result
}

export async function updateUserAction(
  input: unknown
): Promise<ActionResult<StaffUserDto>> {
  const auth = await requirePermission("users.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateUserSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...data } = parsed.data
  const result = await userService.updateUser(id, data, auth.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "users",
    entityType: "user",
    entityId: result.data.id,
    summary: `Updated user ${result.data.username}`,
  })

  revalidatePath("/admin/system/users")
  return result
}

export async function toggleUserActiveAction(
  input: unknown
): Promise<ActionResult<StaffUserDto>> {
  const auth = await requirePermission("users.update")
  if (!auth.ok) return auth

  const parsed = parseInput(toggleUserActiveSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await userService.toggleUserActive(
    parsed.data.id,
    parsed.data.isActive,
    auth.data.id
  )
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "users",
    entityType: "user",
    entityId: result.data.id,
    summary: `${parsed.data.isActive ? "Activated" : "Disabled"} user ${result.data.username}`,
  })

  revalidatePath("/admin/system/users")
  return result
}

export async function deleteUserAction(
  input: unknown
): Promise<ActionResult<null>> {
  const auth = await requirePermission("users.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteUserSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await userService.deleteUser(parsed.data.id, auth.data.id)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "users",
    entityType: "user",
    entityId: parsed.data.id,
    summary: `Deleted user ${parsed.data.id}`,
  })

  revalidatePath("/admin/system/users")
  return result
}
