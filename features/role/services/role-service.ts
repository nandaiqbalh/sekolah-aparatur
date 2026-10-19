import "server-only"

import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result"
import { roleRepository } from "@/features/role/repositories/role-repository"
import type {
  RoleDto,
  RoleListParams,
  RoleListResult,
} from "@/features/role/schemas/role-types"

type RoleWithRelations = NonNullable<
  Awaited<ReturnType<typeof roleRepository.findById>>
>

function toRoleDto(role: RoleWithRelations): RoleDto {
  return {
    id: role.id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    isSystem: role.isSystem,
    permissions: role.rolePermissions.map((rp) => ({
      id: rp.permission.id,
      key: rp.permission.key,
      module: rp.permission.module,
      description: rp.permission.description as {
        en: string
        id: string
      } | null,
    })),
    userCount: role._count.userRoles,
    createdAt: role.createdAt.toISOString(),
    updatedAt: role.updatedAt.toISOString(),
  }
}

export const roleService = {
  async getRoles(
    params: RoleListParams
  ): Promise<ActionResult<RoleListResult>> {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const search = params.search?.trim() || undefined
    const skip = (page - 1) * limit

    const [roles, total] = await Promise.all([
      roleRepository.findAll({ skip, take: limit, search }),
      roleRepository.count({ search }),
    ])

    return actionSuccess({
      roles: roles.map(toRoleDto),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  },

  async getById(id: string): Promise<ActionResult<RoleDto>> {
    const role = await roleRepository.findById(id)
    if (!role) return actionFailure("NOT_FOUND", "Role not found")
    return actionSuccess(toRoleDto(role))
  },

  async create(data: {
    name: string
    slug: string
    description?: string | null
  }): Promise<ActionResult<RoleDto>> {
    const existing = await roleRepository.findBySlug(data.slug)
    if (existing) return actionFailure("CONFLICT", "Role slug already exists")

    const created = await roleRepository.create(data)
    return actionSuccess(toRoleDto(created))
  },

  async update(
    id: string,
    data: { name: string; slug?: string; description?: string | null }
  ): Promise<ActionResult<RoleDto>> {
    const role = await roleRepository.findById(id)
    if (!role) return actionFailure("NOT_FOUND", "Role not found")

    if (role.isSystem && data.slug && data.slug !== role.slug) {
      return actionFailure("FORBIDDEN", "Cannot change slug of a system role")
    }

    if (data.slug && data.slug !== role.slug) {
      const existing = await roleRepository.findBySlugExcludingId(data.slug, id)
      if (existing) return actionFailure("CONFLICT", "Role slug already exists")
    }

    const updated = await roleRepository.update(id, {
      name: data.name,
      slug: role.isSystem ? undefined : data.slug,
      description: data.description,
    })
    return actionSuccess(toRoleDto(updated))
  },

  async delete(id: string): Promise<ActionResult<null>> {
    const role = await roleRepository.findById(id)
    if (!role) return actionFailure("NOT_FOUND", "Role not found")
    if (role.isSystem) {
      return actionFailure("FORBIDDEN", "Cannot delete a system role")
    }
    if (role._count.userRoles > 0) {
      return actionFailure(
        "CONFLICT",
        "Cannot delete a role that is assigned to users"
      )
    }

    await roleRepository.delete(id)
    return actionSuccess(null)
  },

  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<ActionResult<RoleDto>> {
    const role = await roleRepository.findById(roleId)
    if (!role) return actionFailure("NOT_FOUND", "Role not found")

    if (role.slug === "super_admin") {
      return actionFailure(
        "FORBIDDEN",
        "Super Admin uses permission bypass; assignments are not stored"
      )
    }

    if (permissionIds.length > 0) {
      const count = await roleRepository.countPermissionsByIds(permissionIds)
      if (count !== permissionIds.length) {
        return actionFailure(
          "VALIDATION_ERROR",
          "One or more permissions are invalid"
        )
      }
    }

    const updated = await roleRepository.assignPermissions(
      roleId,
      permissionIds
    )
    return actionSuccess(toRoleDto(updated))
  },

  async listForSelect(): Promise<
    ActionResult<Array<{ id: string; name: string; slug: string; isSystem: boolean }>>
  > {
    const roles = await roleRepository.findAllForSelect()
    return actionSuccess(roles)
  },
}
