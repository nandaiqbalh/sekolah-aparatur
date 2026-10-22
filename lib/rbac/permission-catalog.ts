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
  {
    key: "informasi.view",
    module: "informasi",
    description: "Lihat informasi",
  },
  {
    key: "informasi.create",
    module: "informasi",
    description: "Buat informasi",
  },
  {
    key: "informasi.update",
    module: "informasi",
    description: "Perbarui informasi",
  },
  {
    key: "informasi.delete",
    module: "informasi",
    description: "Hapus informasi",
  },
  {
    key: "galeri.view",
    module: "galeri",
    description: "Lihat galeri",
  },
  {
    key: "galeri.create",
    module: "galeri",
    description: "Buat galeri",
  },
  {
    key: "galeri.update",
    module: "galeri",
    description: "Perbarui galeri",
  },
  {
    key: "galeri.delete",
    module: "galeri",
    description: "Hapus galeri",
  },
  {
    key: "profil.view",
    module: "profil",
    description: "Lihat profil program",
  },
  {
    key: "profil.update",
    module: "profil",
    description: "Perbarui profil program",
  },
  {
    key: "hero.view",
    module: "hero",
    description: "Lihat gambar hero beranda",
  },
  {
    key: "hero.create",
    module: "hero",
    description: "Tambah gambar hero beranda",
  },
  {
    key: "hero.update",
    module: "hero",
    description: "Perbarui gambar hero beranda",
  },
  {
    key: "hero.delete",
    module: "hero",
    description: "Hapus gambar hero beranda",
  },
  {
    key: "mitra.view",
    module: "mitra",
    description: "Lihat mitra",
  },
  {
    key: "mitra.create",
    module: "mitra",
    description: "Buat mitra",
  },
  {
    key: "mitra.update",
    module: "mitra",
    description: "Perbarui mitra",
  },
  {
    key: "mitra.delete",
    module: "mitra",
    description: "Hapus mitra",
  },
  {
    key: "pendaftaran.view",
    module: "pendaftaran",
    description: "Lihat pendaftaran",
  },
  {
    key: "pendaftaran.update",
    module: "pendaftaran",
    description: "Perbarui status pendaftaran",
  },
  {
    key: "pesan.view",
    module: "pesan",
    description: "Lihat pesan",
  },
  {
    key: "pesan.update",
    module: "pesan",
    description: "Perbarui status pesan",
  },
  {
    key: "program.view",
    module: "program",
    description: "Lihat program",
  },
  {
    key: "program.create",
    module: "program",
    description: "Buat program",
  },
  {
    key: "program.update",
    module: "program",
    description: "Perbarui program",
  },
  {
    key: "program.delete",
    module: "program",
    description: "Hapus program",
  },
  {
    key: "kontak.view",
    module: "kontak",
    description: "Lihat kontak",
  },
  {
    key: "kontak.update",
    module: "kontak",
    description: "Perbarui kontak",
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

const ADMIN_ROLE_MODULES = new Set([
  "dashboard",
  "informasi",
  "galeri",
  "profil",
  "hero",
  "mitra",
  "pendaftaran",
  "pesan",
  "program",
  "kontak",
])

/** Staff role: dashboard and public content, without system administration. */
export function adminRolePermissionKeys(): string[] {
  return PERMISSION_CATALOG.filter((p) => ADMIN_ROLE_MODULES.has(p.module)).map(
    (p) => p.key,
  )
}
