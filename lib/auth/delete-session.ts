import { cookies } from "next/headers"

import { prisma } from "@/lib/db/prisma"

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { token } })
  const cookieStore = await cookies()
  cookieStore.delete("session_token")
}
