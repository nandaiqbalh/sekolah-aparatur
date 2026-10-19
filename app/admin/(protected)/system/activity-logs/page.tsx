import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { ActivityLogsManager } from "@/features/activity-log/components/activity-logs-manager"
import { activityLogService } from "@/features/activity-log/services/activity-log-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"
import {
  parsePageParam,
  parseSearchParam,
  parseSearchParamList,
} from "@/lib/admin/parse-page-param"

type PageProps = {
  searchParams: Promise<{
    page?: string
    modules?: string
    actors?: string
    from?: string
    to?: string
  }>
}

export default async function AdminActivityLogsPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("activity_logs.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const modules = parseSearchParamList(sp.modules)
  const actorEmails = parseSearchParamList(sp.actors)
  const from = parseSearchParam(sp.from)
  const to = parseSearchParam(sp.to)

  const [initialData, initialActors] = await Promise.all([
    activityLogService.list({
      page,
      limit: 20,
      modules: modules.length > 0 ? modules : undefined,
      actorEmails: actorEmails.length > 0 ? actorEmails : undefined,
      from,
      to,
    }),
    activityLogService.listActors(),
  ])

  return (
    <Suspense>
      <ActivityLogsManager initialData={initialData} initialActors={initialActors} />
    </Suspense>
  )
}
