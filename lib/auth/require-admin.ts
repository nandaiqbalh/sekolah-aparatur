import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result"
import {
  extractAuthFromSession,
  getSession,
} from "@/lib/auth/get-session"

export type AuthUser = {
  id: string
  email: string
  username: string
  name: string
  roles: string[]
  permissions: string[]
  isSuperAdmin: boolean
}

export async function requireAdmin(): Promise<ActionResult<AuthUser>> {
  const session = await getSession()
  if (!session) return actionFailure("UNAUTHORIZED", "Not logged in")

  return actionSuccess(extractAuthFromSession(session))
}
