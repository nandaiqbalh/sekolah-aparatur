import "server-only"

import { prisma } from "@/lib/db/prisma"

export const permissionRepository = {
  findAllForSelect() {
    return prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { key: "asc" }],
      select: {
        id: true,
        key: true,
        module: true,
        description: true,
      },
    })
  },
}
