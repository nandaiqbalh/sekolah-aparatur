"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { authService, type LoginResult } from "@/features/auth/services/auth-service"
import { getClientIpFromHeaders } from "@/lib/auth/client-ip"
import { requireAdmin, type AuthUser } from "@/lib/auth/require-admin"
import { loginSchema } from "@/features/auth/schemas/auth"
import { changePasswordSchema, updateProfileSchema } from "@/features/auth/schemas/auth"
import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { parseInput } from "@/lib/parse-input"
import type { ActionResult } from "@/lib/action-result"

export async function loginAction(input: unknown): Promise<LoginResult> {
  const parsed = parseInput(loginSchema, input)
  if (!parsed.ok) return parsed.result

  const headersList = await headers()
  return authService.login(parsed.data.identifier, parsed.data.password, {
    ip: getClientIpFromHeaders(headersList),
    userAgent: headersList.get("user-agent") ?? undefined,
  })
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (token) {
    await authService.logout(token)
  }
  redirect("/admin/login")
}

export async function getProfileAction(): Promise<
  ActionResult<AuthUser & { createdAt: string; updatedAt: string }>
> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  return authService.getProfile(auth.data.id)
}

export async function updateProfileAction(
  input: unknown
): Promise<ActionResult<AuthUser>> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  const parsed = parseInput(updateProfileSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await authService.updateProfile(auth.data.id, parsed.data)
  if (result.ok) {
    await recordAdminActivity({
      actorId: auth.data.id,
      actorEmail: auth.data.email,
      action: "update",
      module: "auth",
      entityType: "user",
      entityId: auth.data.id,
      summary: "Updated profile",
    })
  }
  return result
}

export async function changePasswordAction(
  input: unknown
): Promise<ActionResult<null>> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  const parsed = parseInput(changePasswordSchema, input)
  if (!parsed.ok) return parsed.result

  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  const result = await authService.changePassword(
    auth.data.id,
    parsed.data.currentPassword,
    parsed.data.newPassword,
    token
  )
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "auth",
    entityType: "user",
    entityId: auth.data.id,
    summary: "Changed password",
  })

  return result
}

export async function getCurrentUserAction(): Promise<ActionResult<AuthUser>> {
  return requireAdmin()
}