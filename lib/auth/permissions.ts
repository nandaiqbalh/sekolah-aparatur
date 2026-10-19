import type { AuthUser } from "@/lib/auth/require-admin"

export function hasPermission(user: AuthUser, key: string): boolean {
  if (user.isSuperAdmin) return true
  return user.permissions.includes(key)
}

export function hasAnyPermission(user: AuthUser, keys: string[]): boolean {
  if (user.isSuperAdmin) return true
  return keys.some((key) => user.permissions.includes(key))
}

export function hasAllPermissions(user: AuthUser, keys: string[]): boolean {
  if (user.isSuperAdmin) return true
  return keys.every((key) => user.permissions.includes(key))
}
