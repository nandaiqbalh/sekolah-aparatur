"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { permissionService } from "@/features/permission/services/permission-service"
import { roleService } from "@/features/role/services/role-service"
import {
  assignRolePermissionsSchema,
  createRoleSchema,
  deleteRoleSchema,
  getRoleByIdSchema,
  getRolesSchema,
  updateRoleSchema,
} from "@/features/role/schemas/role"
import type { RoleDto, RoleListResult } from "@/features/role/schemas/role-types"
import { hasAnyPermission } from "@/lib/auth/permissions"
import { requireAdmin } from "@/lib/auth/require-admin"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { actionFailure, type ActionResult } from "@/lib/action-result"

async function requireRolePermissionManage() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  if (!hasAnyPermission(auth.data, ["roles.update", "permissions.update"])) {
    return actionFailure(
      "FORBIDDEN",
      "Missing permission: roles.update or permissions.update"
    )
  }
  return auth
}

export async function getRolesAction(
  input: unknown = {}
): Promise<ActionResult<RoleListResult>> {
  const auth = await requirePermission("roles.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getRolesSchema, input)
  if (!parsed.ok) return parsed.result

  return roleService.getRoles(parsed.data)
}

export async function getRoleByIdAction(
  input: unknown
): Promise<ActionResult<RoleDto>> {
  const auth = await requirePermission("roles.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getRoleByIdSchema, input)
  if (!parsed.ok) return parsed.result

  return roleService.getById(parsed.data.id)
}

export async function createRoleAction(
  input: unknown
): Promise<ActionResult<RoleDto>> {
  const auth = await requirePermission("roles.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createRoleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await roleService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "roles",
    entityType: "role",
    entityId: result.data.id,
    summary: `Created role ${result.data.slug}`,
  })

  revalidatePath("/admin/system/roles")
  return result
}

export async function updateRoleAction(
  input: unknown
): Promise<ActionResult<RoleDto>> {
  const auth = await requirePermission("roles.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateRoleSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...data } = parsed.data
  const result = await roleService.update(id, data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "roles",
    entityType: "role",
    entityId: result.data.id,
    summary: `Updated role ${result.data.slug}`,
  })

  revalidatePath("/admin/system/roles")
  revalidatePath(`/admin/system/roles/${id}`)
  return result
}

export async function deleteRoleAction(
  input: unknown
): Promise<ActionResult<null>> {
  const auth = await requirePermission("roles.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteRoleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await roleService.delete(parsed.data.id)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "roles",
    entityType: "role",
    entityId: parsed.data.id,
    summary: `Deleted role ${parsed.data.id}`,
  })

  revalidatePath("/admin/system/roles")
  return result
}

export async function assignRolePermissionsAction(
  input: unknown
): Promise<ActionResult<RoleDto>> {
  const auth = await requireRolePermissionManage()
  if (!auth.ok) return auth

  const parsed = parseInput(assignRolePermissionsSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await roleService.assignPermissions(
    parsed.data.roleId,
    parsed.data.permissionIds
  )
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "roles",
    entityType: "role",
    entityId: result.data.id,
    summary: `Assigned ${parsed.data.permissionIds.length} permissions to role ${result.data.slug}`,
  })

  revalidatePath("/admin/system/roles")
  revalidatePath(`/admin/system/roles/${parsed.data.roleId}`)
  return result
}

export async function getRolesForSelectAction(): Promise<
  ActionResult<Array<{ id: string; name: string; slug: string; isSystem: boolean }>>
> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  if (!hasAnyPermission(auth.data, ["users.view", "users.update", "users.create"])) {
    return actionFailure("FORBIDDEN", "Missing permission: users.view")
  }

  return roleService.listForSelect()
}

export async function getPermissionsForSelectAction() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  if (
    !hasAnyPermission(auth.data, [
      "roles.view",
      "roles.update",
      "permissions.update",
    ])
  ) {
    return actionFailure("FORBIDDEN", "Missing permission: roles.view")
  }

  return permissionService.listAll()
}
