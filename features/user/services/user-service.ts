import "server-only"

import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result"
import { hashPassword } from "@/lib/auth/hash-password"
import { userRepository } from "@/features/user/repositories/user-repository"
import type {
  StaffUserDto,
  StaffUserListParams,
  StaffUserListResult,
} from "@/features/user/schemas/user-types"

type UserWithRoles = NonNullable<
  Awaited<ReturnType<typeof userRepository.findByIdWithRoles>>
>

function toStaffUserDto(user: UserWithRoles): StaffUserDto {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    isActive: user.isActive,
    roles: user.userRoles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      slug: ur.role.slug,
      isSystem: ur.role.isSystem,
    })),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

export const userService = {
  async getUsers(
    params: StaffUserListParams
  ): Promise<ActionResult<StaffUserListResult>> {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const search = params.search?.trim() || undefined
    const roleId = params.roleId || undefined
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      userRepository.findAll({ skip, take: limit, search, roleId }),
      userRepository.count({ search, roleId }),
    ])

    return actionSuccess({
      users: users.map(toStaffUserDto),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  },

  async getUserById(id: string): Promise<ActionResult<StaffUserDto>> {
    const user = await userRepository.findByIdWithRoles(id)
    if (!user) return actionFailure("NOT_FOUND", "User not found")
    return actionSuccess(toStaffUserDto(user))
  },

  async createUser(data: {
    name: string
    username: string
    email: string
    password: string
    roleIds: string[]
    isActive?: boolean
  }): Promise<ActionResult<StaffUserDto>> {
    const existingEmail = await userRepository.findByEmail(data.email)
    if (existingEmail) return actionFailure("CONFLICT", "Email already in use")

    const existingUsername = await userRepository.findByUsername(data.username)
    if (existingUsername) {
      return actionFailure("CONFLICT", "Username already in use")
    }

    const roles = await userRepository.findRolesByIds(data.roleIds)
    if (roles.length !== data.roleIds.length) {
      return actionFailure("VALIDATION_ERROR", "One or more roles are invalid")
    }

    const hashed = await hashPassword(data.password)
    const created = await userRepository.create({
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashed,
      roleIds: data.roleIds,
      isActive: data.isActive ?? true,
    })

    return actionSuccess(toStaffUserDto(created))
  },

  async updateUser(
    id: string,
    data: {
      name: string
      username: string
      email: string
      password?: string
      roleIds?: string[]
      isActive?: boolean
    },
    actorId: string
  ): Promise<ActionResult<StaffUserDto>> {
    const user = await userRepository.findByIdWithRoles(id)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    if (data.isActive === false && id === actorId) {
      return actionFailure("FORBIDDEN", "You cannot disable your own account")
    }

    if (data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email)
      if (existing) return actionFailure("CONFLICT", "Email already in use")
    }

    if (data.username.toLowerCase() !== user.username) {
      const existing = await userRepository.findByUsername(data.username)
      if (existing) return actionFailure("CONFLICT", "Username already in use")
    }

    if (data.roleIds !== undefined) {
      const roles = await userRepository.findRolesByIds(data.roleIds)
      if (roles.length !== data.roleIds.length) {
        return actionFailure("VALIDATION_ERROR", "One or more roles are invalid")
      }

      const currentlySuperAdmin = user.userRoles.some(
        (ur) => ur.role.slug === "super_admin"
      )
      const willBeSuperAdmin = roles.some((r) => r.slug === "super_admin")
      if (currentlySuperAdmin && !willBeSuperAdmin) {
        const superAdminCount = await userRepository.countSuperAdmins()
        if (superAdminCount <= 1) {
          return actionFailure(
            "FORBIDDEN",
            "Cannot remove the last super admin role"
          )
        }
      }
    }

    if (data.isActive === false) {
      const isSuperAdmin = user.userRoles.some(
        (ur) => ur.role.slug === "super_admin"
      )
      if (isSuperAdmin) {
        const superAdminCount = await userRepository.countSuperAdmins()
        if (superAdminCount <= 1) {
          return actionFailure("FORBIDDEN", "Cannot disable the last super admin")
        }
      }
    }

    const password =
      data.password && data.password.length > 0
        ? await hashPassword(data.password)
        : undefined

    const updated = await userRepository.updateStaffUser(id, {
      name: data.name,
      username: data.username,
      email: data.email,
      password,
      roleIds: data.roleIds,
      isActive: data.isActive,
    })

    if (data.isActive === false) {
      await userRepository.deleteSessionsByUserId(id)
    }

    return actionSuccess(toStaffUserDto(updated))
  },

  async toggleUserActive(
    id: string,
    isActive: boolean,
    actorId: string
  ): Promise<ActionResult<StaffUserDto>> {
    const user = await userRepository.findByIdWithRoles(id)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    if (!isActive && id === actorId) {
      return actionFailure("FORBIDDEN", "You cannot disable your own account")
    }

    if (!isActive) {
      const isSuperAdmin = user.userRoles.some(
        (ur) => ur.role.slug === "super_admin"
      )
      if (isSuperAdmin) {
        const superAdminCount = await userRepository.countSuperAdmins()
        if (superAdminCount <= 1) {
          return actionFailure("FORBIDDEN", "Cannot disable the last super admin")
        }
      }
    }

    const updated = await userRepository.updateStaffUser(id, {
      name: user.name,
      username: user.username,
      email: user.email,
      isActive,
    })

    if (!isActive) {
      await userRepository.deleteSessionsByUserId(id)
    }

    return actionSuccess(toStaffUserDto(updated))
  },

  async deleteUser(id: string, actorId: string): Promise<ActionResult<null>> {
    if (id === actorId) {
      return actionFailure("FORBIDDEN", "You cannot delete your own account")
    }

    const user = await userRepository.findByIdWithRoles(id)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    const isSuperAdmin = user.userRoles.some(
      (ur) => ur.role.slug === "super_admin"
    )
    if (isSuperAdmin) {
      const superAdminCount = await userRepository.countSuperAdmins()
      if (superAdminCount <= 1) {
        return actionFailure("FORBIDDEN", "Cannot delete the last super admin")
      }
    }

    await userRepository.deleteById(id)
    return actionSuccess(null)
  },
}
