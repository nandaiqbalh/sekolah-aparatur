import type { PrismaClient } from "../generated/prisma/client"

import {
  adminRolePermissionKeys,
  PERMISSION_CATALOG,
  permissionDescriptionJson,
} from "../lib/rbac/permission-catalog"

export const SYSTEM_ROLES = [
  {
    name: "Super Admin",
    slug: "super_admin",
    description: "Akses penuh ke seluruh Sekolah Aparatur (bypass izin)",
    isSystem: true,
  },
  {
    name: "Admin",
    slug: "admin",
    description: "Dashboard back office — tanpa administrasi sistem",
    isSystem: true,
  },
] as const

const LEGACY_SYSTEM_ROLE_SLUGS = ["marketing_admin", "ops_admin"] as const

async function syncRolePermissions(
  prisma: PrismaClient,
  roleSlug: string,
  keys: string[],
) {
  const role = await prisma.role.findUnique({ where: { slug: roleSlug } })
  if (!role) return

  const permissions = await prisma.permission.findMany({
    where: { key: { in: keys } },
    select: { id: true },
  })

  await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
  if (permissions.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissions.map((p) => ({
        roleId: role.id,
        permissionId: p.id,
      })),
    })
  }
}

export async function seedRbac(prisma: PrismaClient) {
  for (const role of SYSTEM_ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      create: {
        name: role.name,
        slug: role.slug,
        description: role.description,
        isSystem: role.isSystem,
      },
      update: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
    })
  }

  for (const permission of PERMISSION_CATALOG) {
    const description = permissionDescriptionJson(permission.description)
    await prisma.permission.upsert({
      where: { key: permission.key },
      create: {
        key: permission.key,
        module: permission.module,
        description,
      },
      update: {
        module: permission.module,
        description,
      },
    })
  }

  const catalogKeys = PERMISSION_CATALOG.map((p) => p.key)
  await prisma.rolePermission.deleteMany({
    where: { permission: { key: { notIn: catalogKeys } } },
  })
  await prisma.permission.deleteMany({
    where: { key: { notIn: catalogKeys } },
  })

  await syncRolePermissions(prisma, "admin", adminRolePermissionKeys())

  for (const legacySlug of LEGACY_SYSTEM_ROLE_SLUGS) {
    const legacy = await prisma.role.findUnique({ where: { slug: legacySlug } })
    if (!legacy) continue
    const userCount = await prisma.userRole.count({ where: { roleId: legacy.id } })
    if (userCount === 0) {
      await prisma.rolePermission.deleteMany({ where: { roleId: legacy.id } })
      await prisma.role.delete({ where: { id: legacy.id } })
    }
  }

  console.log(
    `RBAC seeded: ${SYSTEM_ROLES.length} roles, ${PERMISSION_CATALOG.length} permissions`,
  )
}
