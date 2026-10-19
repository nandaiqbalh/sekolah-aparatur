import { actionFailure, type ActionResult } from "@/lib/action-result"
import { hasPermission } from "@/lib/auth/permissions"
import { requireAdmin, type AuthUser } from "@/lib/auth/require-admin"

export async function requirePermission(
  key: string
): Promise<ActionResult<AuthUser>> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  if (!hasPermission(auth.data, key)) {
    return actionFailure("FORBIDDEN", `Missing permission: ${key}`)
  }

  return auth
}
