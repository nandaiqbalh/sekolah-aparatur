import { actionFailure, type ActionResult } from "@/lib/action-result"
import { hasAnyPermission } from "@/lib/auth/permissions"
import { requireAdmin, type AuthUser } from "@/lib/auth/require-admin"

export async function requireAnyPermission(
  keys: string[]
): Promise<ActionResult<AuthUser>> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  if (!hasAnyPermission(auth.data, keys)) {
    return actionFailure(
      "FORBIDDEN",
      `Missing permission: ${keys.join(" or ")}`
    )
  }

  return auth
}
