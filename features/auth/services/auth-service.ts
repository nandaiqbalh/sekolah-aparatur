import "server-only"

import type { AuthUser } from "@/lib/auth/require-admin"
import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result"
import { createSession } from "@/lib/auth/create-session"
import { deleteSession } from "@/lib/auth/delete-session"
import { hashPassword, verifyPassword } from "@/lib/auth/hash-password"
import {
  LOGIN_LOCK_MINUTES,
  LOGIN_MAX_ATTEMPTS,
} from "@/lib/auth/login-lockout.constants"
import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { userRepository } from "@/features/user/repositories/user-repository"
import type { StaffUserDto } from "@/features/user/schemas/user-types"

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

function isLocked(lockedUntil: Date | null | undefined) {
  return Boolean(lockedUntil && lockedUntil.getTime() > Date.now())
}

export type LoginResult = ActionResult<AuthUser> & { lockedUntil?: string }

export const authService = {
  async login(
    identifier: string,
    password: string,
    request?: { ip?: string; userAgent?: string }
  ): Promise<LoginResult> {
    const user = await userRepository.findByLoginIdentifier(identifier)
    if (!user) {
      await recordAdminActivity({
        actorId: null,
        actorEmail: identifier,
        action: "login_failed",
        module: "auth",
        entityType: "user",
        summary: `Failed login for ${identifier} (invalid credentials)`,
      })
      return actionFailure("UNAUTHORIZED", "Invalid email or password")
    }

    if (!user.isActive) {
      await recordAdminActivity({
        actorId: user.id,
        actorEmail: user.email,
        action: "login_failed",
        module: "auth",
        entityType: "user",
        entityId: user.id,
        summary: `Failed login for ${user.email} (account disabled)`,
      })
      return actionFailure("FORBIDDEN", "Account is disabled")
    }

    if (isLocked(user.lockedUntil)) {
      await recordAdminActivity({
        actorId: user.id,
        actorEmail: user.email,
        action: "login_failed",
        module: "auth",
        entityType: "user",
        entityId: user.id,
        summary: `Failed login for ${user.email} (account locked)`,
      })
      return {
        ...actionFailure(
          "RATE_LIMITED",
          "Account temporarily locked. Try again in 2 minutes."
        ),
        lockedUntil: user.lockedUntil?.toISOString(),
      }
    }

    if (
      user.lockedUntil &&
      user.lockedUntil.getTime() <= Date.now() &&
      user.failedLoginAttempts > 0
    ) {
      await userRepository.clearLoginLock(user.id)
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      const baseAttempts =
        user.lockedUntil && user.lockedUntil.getTime() <= Date.now()
          ? 0
          : user.failedLoginAttempts
      const attempts = baseAttempts + 1
      const lockedUntil =
        attempts >= LOGIN_MAX_ATTEMPTS
          ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000)
          : null

      await userRepository.recordFailedLogin(user.id, {
        failedLoginAttempts: attempts >= LOGIN_MAX_ATTEMPTS ? 0 : attempts,
        lockedUntil,
      })

      if (lockedUntil) {
        await recordAdminActivity({
          actorId: user.id,
          actorEmail: user.email,
          action: "login_failed",
          module: "auth",
          entityType: "user",
          entityId: user.id,
          summary: `Failed login for ${user.email} (account locked after ${LOGIN_MAX_ATTEMPTS} attempts)`,
        })
        return {
          ...actionFailure(
            "RATE_LIMITED",
            "Account temporarily locked. Try again in 2 minutes."
          ),
          lockedUntil: lockedUntil.toISOString(),
        }
      }

      await recordAdminActivity({
        actorId: user.id,
        actorEmail: user.email,
        action: "login_failed",
        module: "auth",
        entityType: "user",
        entityId: user.id,
        summary: `Failed login for ${user.email} (invalid credentials)`,
      })
      return actionFailure("UNAUTHORIZED", "Invalid email or password")
    }

    await userRepository.clearLoginLock(user.id)
    await createSession(user.id, request)

    const withRoles = await userRepository.findByIdWithRoles(user.id)
    if (!withRoles) {
      return actionFailure("UNAUTHORIZED", "Invalid email or password")
    }

    const dto = toStaffUserDto(withRoles)
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      roles: dto.roles.map((r) => r.slug),
      permissions: [],
      isSuperAdmin: dto.roles.some((r) => r.slug === "super_admin"),
    }

    await recordAdminActivity({
      actorId: user.id,
      actorEmail: user.email,
      action: "login",
      module: "auth",
      entityType: "user",
      entityId: user.id,
      summary: "Logged in",
    })

    return actionSuccess(authUser)
  },

  async logout(token: string): Promise<ActionResult<null>> {
    await deleteSession(token)
    return actionSuccess(null)
  },

  async getProfile(
    userId: string
  ): Promise<
    ActionResult<AuthUser & { createdAt: string; updatedAt: string }>
  > {
    const user = await userRepository.findByIdWithRoles(userId)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    const dto = toStaffUserDto(user)
    return actionSuccess({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      roles: dto.roles.map((r) => r.slug),
      permissions: [],
      isSuperAdmin: dto.roles.some((r) => r.slug === "super_admin"),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  },

  async updateProfile(
    userId: string,
    data: { name: string }
  ): Promise<ActionResult<AuthUser>> {
    const user = await userRepository.findById(userId)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    const updated = await userRepository.updateById(userId, { name: data.name })
    const withRoles = await userRepository.findByIdWithRoles(updated.id)
    if (!withRoles) return actionFailure("NOT_FOUND", "User not found")

    const dto = toStaffUserDto(withRoles)
    return actionSuccess({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      name: updated.name,
      roles: dto.roles.map((r) => r.slug),
      permissions: [],
      isSuperAdmin: dto.roles.some((r) => r.slug === "super_admin"),
    })
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    currentSessionToken?: string
  ): Promise<ActionResult<null>> {
    const user = await userRepository.findById(userId)
    if (!user) return actionFailure("NOT_FOUND", "User not found")

    const valid = await verifyPassword(currentPassword, user.password)
    if (!valid) {
      return actionFailure("UNAUTHORIZED", "Current password is incorrect")
    }

    const hashed = await hashPassword(newPassword)
    await userRepository.updateById(userId, { password: hashed })

    if (currentSessionToken) {
      await userRepository.deleteOtherSessions(userId, currentSessionToken)
    } else {
      await userRepository.deleteSessionsByUserId(userId)
    }

    return actionSuccess(null)
  },
}
