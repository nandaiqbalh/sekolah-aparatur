import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { ProgramsManager } from "@/features/program/components/programs-manager"
import { programService } from "@/features/program/services/program-service"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function AdminProgramPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("program.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const status = parseEnumParam(sp.status, ["all", "published", "hidden"] as const, "all")
  const programs = await programService.list({ page, limit: 20, search, status })

  return (
    <Suspense>
      <ProgramsManager
        initialData={
          programs.ok && programs.data
            ? programs.data
            : { programs: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
