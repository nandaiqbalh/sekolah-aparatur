import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { FeeSchedulesManager } from "@/features/biaya/components/fee-schedules-manager"
import { feeScheduleService } from "@/features/biaya/services/fee-schedule-service"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function AdminRincianBiayaPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("biaya.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const status = parseEnumParam(sp.status, ["all", "published", "hidden"] as const, "all")
  const schedules = await feeScheduleService.list({ page, limit: 20, search, status })

  return (
    <Suspense>
      <FeeSchedulesManager
        initialData={
          schedules.ok && schedules.data
            ? schedules.data
            : { schedules: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
