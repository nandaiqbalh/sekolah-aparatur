import { requirePermission } from "@/lib/auth/require-permission"

export async function canAccessPage(permission: string): Promise<boolean> {
  const auth = await requirePermission(permission)
  return auth.ok
}
