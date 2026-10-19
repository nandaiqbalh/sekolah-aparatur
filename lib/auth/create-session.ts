import crypto from "crypto"
import { cookies } from "next/headers"

import { ADMIN_SESSION_INACTIVITY_DAYS } from "@/lib/auth/admin-auth.constants"
import { prisma } from "@/lib/db/prisma"

function inactivityExpiry(from = new Date()) {
  return new Date(
    from.getTime() + ADMIN_SESSION_INACTIVITY_DAYS * 24 * 60 * 60 * 1000
  )
}

function sessionCookieMaxAgeSeconds() {
  return ADMIN_SESSION_INACTIVITY_DAYS * 24 * 60 * 60
}

export async function createSession(
  userId: string,
  request?: { ip?: string; userAgent?: string }
) {
  const token = crypto.randomBytes(32).toString("hex")
  const now = new Date()
  const expiresAt = inactivityExpiry(now)

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      lastActiveAt: now,
      ipAddress: request?.ip ?? null,
      userAgent: request?.userAgent ?? null,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionCookieMaxAgeSeconds(),
  })

  return session
}

export async function touchSessionActivity(sessionId: string, token: string) {
  const now = new Date()
  const expiresAt = inactivityExpiry(now)

  await prisma.session.update({
    where: { id: sessionId },
    data: { lastActiveAt: now, expiresAt },
  })

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionCookieMaxAgeSeconds(),
  })
}
