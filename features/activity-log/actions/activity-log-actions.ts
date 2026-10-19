"use server"

import { activityLogService } from "@/features/activity-log/services/activity-log-service"
import type {
  ActivityLogActorOption,
  ActivityLogListResult,
} from "@/features/activity-log/schemas/activity-log"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { actionSuccess, type ActionResult } from "@/lib/action-result"
import { z } from "zod"

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  modules: z.array(z.string().trim().min(1)).optional(),
  actorEmails: z.array(z.string().trim().min(1)).optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
})

export async function getActivityLogsAction(
  input: unknown = {}
): Promise<ActionResult<ActivityLogListResult>> {
  const auth = await requirePermission("activity_logs.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await activityLogService.list(parsed.data)
  return actionSuccess(result)
}

export async function getActivityLogActorsAction(): Promise<
  ActionResult<ActivityLogActorOption[]>
> {
  const auth = await requirePermission("activity_logs.view")
  if (!auth.ok) return auth

  const actors = await activityLogService.listActors()
  return actionSuccess(actors)
}
