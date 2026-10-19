import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/db/prisma"
import type {
  ActivityLogActorOption,
  ActivityLogListParams,
  ActivityLogListResult,
  AdminActivityLogDto,
  RecordAdminActivityInput,
} from "@/features/activity-log/schemas/activity-log"

export type {
  ActivityLogActorOption,
  ActivityLogListParams,
  ActivityLogListResult,
  AdminActivityLogDto,
  RecordAdminActivityInput,
}

export async function recordAdminActivity(
  input: RecordAdminActivityInput
): Promise<void> {
  try {
    await prisma.adminActivityLog.create({
      data: {
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        action: input.action,
        module: input.module,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        summary: input.summary,
        metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    })
  } catch (error) {
    console.error("[activity-log] failed to record", error)
  }
}

function toDto(row: {
  id: string
  actorId: string | null
  actorEmail: string
  action: string
  module: string
  entityType: string | null
  entityId: string | null
  summary: string
  metadata: unknown
  createdAt: Date
}): AdminActivityLogDto {
  return {
    id: row.id,
    actorId: row.actorId,
    actorEmail: row.actorEmail,
    action: row.action,
    module: row.module,
    entityType: row.entityType,
    entityId: row.entityId,
    summary: row.summary,
    metadata: row.metadata,
    createdAt: row.createdAt.toISOString(),
  }
}

export const activityLogService = {
  async listActors(): Promise<ActivityLogActorOption[]> {
    const rows = await prisma.adminActivityLog.findMany({
      distinct: ["actorEmail"],
      select: { actorEmail: true, actorId: true },
      orderBy: { actorEmail: "asc" },
    })
    return rows.map((row) => ({
      email: row.actorEmail,
      actorId: row.actorId,
    }))
  },

  async list(params: ActivityLogListParams): Promise<ActivityLogListResult> {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit

    const where: Prisma.AdminActivityLogWhereInput = {}

    if (params.modules?.length) {
      where.module = { in: params.modules }
    }
    if (params.actorEmails?.length) {
      where.actorEmail = { in: params.actorEmails }
    }
    if (params.from || params.to) {
      where.createdAt = {}
      if (params.from) where.createdAt.gte = new Date(params.from)
      if (params.to) {
        const toDate = new Date(params.to)
        toDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = toDate
      }
    }

    const [items, total] = await Promise.all([
      prisma.adminActivityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.adminActivityLog.count({ where }),
    ])

    return {
      items: items.map(toDto),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  },
}
