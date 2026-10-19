export type PermissionDefinition = {
  key: string
  module: string
  description: string
}

export const ADMINISTRATION_MODULES = [
  "users",
  "roles",
  "permissions",
  "activity_logs",
] as const

export const SUPER_ADMIN_ONLY_MODULES = [
  "users",
  "roles",
  "permissions",
  "activity_logs",
] as const

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  {
    key: "dashboard.view",
    module: "dashboard",
    description: "Lihat dashboard admin",
  },
  {
    key: "users.view",
    module: "users",
    description: "Lihat admin sistem",
  },
  {
    key: "users.create",
    module: "users",
    description: "Buat admin sistem",
  },
  {
    key: "users.update",
    module: "users",
    description: "Perbarui admin sistem dan tetapkan peran",
  },
  {
    key: "users.delete",
    module: "users",
    description: "Hapus admin sistem",
  },
  { key: "roles.view", module: "roles", description: "Lihat peran" },
  { key: "roles.create", module: "roles", description: "Buat peran" },
  {
    key: "roles.update",
    module: "roles",
    description: "Perbarui peran dan tetapkan izin",
  },
  {
    key: "roles.delete",
    module: "roles",
    description: "Hapus peran non-sistem",
  },
  {
    key: "permissions.view",
    module: "permissions",
    description: "Lihat izin",
  },
  {
    key: "permissions.update",
    module: "permissions",
    description: "Tetapkan izin ke peran",
  },
  {
    key: "activity_logs.view",
    module: "activity_logs",
    description: "Lihat log aktivitas admin",
  },
]

export function permissionDescriptionJson(description: string): {
  en: string
  id: string
} {
  return { en: description, id: description }
}

export function isSuperAdminOnlyPermission(key: string): boolean {
  const moduleName = key.split(".")[0] ?? ""
  return (SUPER_ADMIN_ONLY_MODULES as readonly string[]).includes(moduleName)
}

const ADMIN_ROLE_MODULES = new Set(["dashboard"])

/** Limited staff role — dashboard only (no system administration). */
export function adminRolePermissionKeys(): string[] {
  return PERMISSION_CATALOG.filter((p) => ADMIN_ROLE_MODULES.has(p.module)).map(
    (p) => p.key,
  )
}
