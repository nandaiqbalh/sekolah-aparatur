import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { RolesManager } from "@/features/role/components/roles-manager"
import { roleService } from "@/features/role/services/role-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"
import { parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function AdminRolesPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("roles.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)

  const roles = await roleService.getRoles({ page, limit: 20, search })

  return (
    <Suspense>
      <RolesManager
        initialData={
          roles.ok && roles.data
            ? roles.data
            : { roles: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
