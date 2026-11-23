import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { UniversityProgramsManager } from "@/features/prodi/components/university-programs-manager"
import { universityProgramService } from "@/features/prodi/services/university-program-service"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function AdminProgramStudiPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("prodi.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const status = parseEnumParam(sp.status, ["all", "published", "hidden"] as const, "all")
  const programs = await universityProgramService.list({ page, limit: 100, search, status })

  return (
    <Suspense>
      <UniversityProgramsManager
        initialData={
          programs.ok && programs.data
            ? programs.data
            : { programs: [], total: 0, page: 1, limit: 100, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
