import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requireAdmin, type AuthUser } from "@/lib/auth/require-admin"

export async function requireSuperAdmin(): Promise<ActionResult<AuthUser>> {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  if (!auth.data.isSuperAdmin) {
    return actionFailure("FORBIDDEN", "Super admin access required")
  }
  return auth
}
