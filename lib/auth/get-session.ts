import { cookies } from "next/headers"

import { ADMIN_SESSION_ACTIVITY_TOUCH_MS } from "@/lib/auth/admin-auth.constants"
import { touchSessionActivity } from "@/lib/auth/create-session"
import { prisma } from "@/lib/db/prisma"

const sessionInclude = {
  user: {
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  },
} as const

export type SessionWithUser = NonNullable<Awaited<ReturnType<typeof getSession>>>

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: sessionInclude,
  })

  if (!session) return null

  const now = new Date()
  if (session.expiresAt < now) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    cookieStore.delete("session_token")
    return null
  }

  if (!session.user.isActive) {
    await prisma.session
      .deleteMany({ where: { userId: session.userId } })
      .catch(() => {})
    cookieStore.delete("session_token")
    return null
  }

  const lastActiveMs =
    session.lastActiveAt?.getTime() ?? session.createdAt.getTime()
  if (now.getTime() - lastActiveMs >= ADMIN_SESSION_ACTIVITY_TOUCH_MS) {
    await touchSessionActivity(session.id, token).catch(() => {})
  }

  return session
}

export function extractAuthFromSession(session: SessionWithUser) {
  const roles = session.user.userRoles.map((ur) => ur.role.slug)
  const isSuperAdmin = roles.includes("super_admin")
  const permissionSet = new Set<string>()

  for (const userRole of session.user.userRoles) {
    for (const rolePermission of userRole.role.rolePermissions) {
      permissionSet.add(rolePermission.permission.key)
    }
  }

  return {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
    name: session.user.name,
    roles,
    permissions: Array.from(permissionSet),
    isSuperAdmin,
  }
}
