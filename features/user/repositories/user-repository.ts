import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"

const staffUserInclude = {
  userRoles: {
    include: {
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
          isSystem: true,
        },
      },
    },
  },
} as const

function buildStaffUserWhere(params: {
  search?: string
  roleId?: string
}): Prisma.UserWhereInput | undefined {
  const and: Prisma.UserWhereInput[] = []

  if (params.search) {
    and.push({
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { username: { contains: params.search, mode: "insensitive" } },
      ],
    })
  }

  if (params.roleId) {
    and.push({ userRoles: { some: { roleId: params.roleId } } })
  }

  if (and.length === 0) return undefined
  if (and.length === 1) return and[0]
  return { AND: and }
}

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    })
  },

  findByLoginIdentifier(identifier: string) {
    const value = identifier.trim()
    if (value.includes("@")) {
      return prisma.user.findFirst({
        where: { email: { equals: value, mode: "insensitive" } },
      })
    }
    return prisma.user.findUnique({ where: { username: value.toLowerCase() } })
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  findByIdWithRoles(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: staffUserInclude,
    })
  },

  findAll(params: {
    skip: number
    take: number
    search?: string
    roleId?: string
  }) {
    return prisma.user.findMany({
      where: buildStaffUserWhere(params),
      include: staffUserInclude,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    })
  },

  count(params: { search?: string; roleId?: string }) {
    return prisma.user.count({ where: buildStaffUserWhere(params) })
  },

  create(data: {
    name: string
    username: string
    email: string
    password: string
    roleIds: string[]
    isActive?: boolean
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        username: data.username.toLowerCase(),
        email: data.email,
        password: data.password,
        isActive: data.isActive ?? true,
        userRoles: {
          create: data.roleIds.map((roleId) => ({ roleId })),
        },
      },
      include: staffUserInclude,
    })
  },

  updateById(
    id: string,
    data: {
      name?: string
      email?: string
      username?: string
      password?: string
      isActive?: boolean
      failedLoginAttempts?: number
      lockedUntil?: Date | null
    }
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(data.username ? { username: data.username.toLowerCase() } : {}),
      },
    })
  },

  recordFailedLogin(
    id: string,
    data: { failedLoginAttempts: number; lockedUntil: Date | null }
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: data.failedLoginAttempts,
        lockedUntil: data.lockedUntil,
      },
    })
  },

  clearLoginLock(id: string) {
    return prisma.user.update({
      where: { id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    })
  },

  updateStaffUser(
    id: string,
    data: {
      name: string
      username: string
      email: string
      password?: string
      roleIds?: string[]
      isActive?: boolean
    }
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          name: data.name,
          username: data.username.toLowerCase(),
          email: data.email,
          ...(data.password ? { password: data.password } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      })

      if (data.roleIds !== undefined) {
        await tx.userRole.deleteMany({ where: { userId: id } })
        if (data.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: data.roleIds.map((roleId) => ({ userId: id, roleId })),
          })
        }
      }

      return tx.user.findUniqueOrThrow({
        where: { id },
        include: staffUserInclude,
      })
    })
  },

  deleteSessionsByUserId(userId: string) {
    return prisma.session.deleteMany({ where: { userId } })
  },

  deleteOtherSessions(userId: string, exceptToken: string) {
    return prisma.session.deleteMany({
      where: { userId, token: { not: exceptToken } },
    })
  },

  deleteById(id: string) {
    return prisma.user.delete({ where: { id } })
  },

  countSuperAdmins() {
    return prisma.userRole.count({
      where: { role: { slug: "super_admin" } },
    })
  },

  findRolesByIds(roleIds: string[]) {
    return prisma.role.findMany({
      where: { id: { in: roleIds } },
      select: { id: true, slug: true },
    })
  },
}
