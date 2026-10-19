import "server-only"

import { prisma } from "@/lib/db/prisma"

const roleInclude = {
  rolePermissions: {
    include: {
      permission: {
        select: {
          id: true,
          key: true,
          module: true,
          description: true,
        },
      },
    },
  },
  _count: {
    select: { userRoles: true },
  },
} as const

export const roleRepository = {
  findAll(params: { skip: number; take: number; search?: string }) {
    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { slug: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : undefined

    return prisma.role.findMany({
      where,
      include: roleInclude,
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string }) {
    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" as const } },
            { slug: { contains: params.search, mode: "insensitive" as const } },
          ],
        }
      : undefined

    return prisma.role.count({ where })
  },

  findById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: roleInclude,
    })
  },

  findBySlug(slug: string) {
    return prisma.role.findUnique({ where: { slug } })
  },

  findBySlugExcludingId(slug: string, excludeId: string) {
    return prisma.role.findFirst({
      where: { slug, NOT: { id: excludeId } },
    })
  },

  create(data: { name: string; slug: string; description?: string | null }) {
    return prisma.role.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        isSystem: false,
      },
      include: roleInclude,
    })
  },

  update(
    id: string,
    data: { name: string; slug?: string; description?: string | null }
  ) {
    return prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.slug ? { slug: data.slug } : {}),
        description: data.description ?? null,
      },
      include: roleInclude,
    })
  },

  delete(id: string) {
    return prisma.role.delete({ where: { id } })
  },

  assignPermissions(roleId: string, permissionIds: string[]) {
    return prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } })
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
        })
      }
      return tx.role.findUniqueOrThrow({
        where: { id: roleId },
        include: roleInclude,
      })
    })
  },

  countPermissionsByIds(permissionIds: string[]) {
    return prisma.permission.count({
      where: { id: { in: permissionIds } },
    })
  },

  findAllForSelect() {
    return prisma.role.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isSystem: true,
      },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    })
  },
}
