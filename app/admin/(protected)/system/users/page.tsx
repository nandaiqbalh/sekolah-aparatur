import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { UsersManager } from "@/features/user/components/users-manager"
import { roleService } from "@/features/role/services/role-service"
import { userService } from "@/features/user/services/user-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"
import {
  parsePageParam,
  parseSearchParam,
} from "@/lib/admin/parse-page-param"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    roleId?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("users.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const roleId = parseSearchParam(sp.roleId)

  const [users, roles] = await Promise.all([
    userService.getUsers({ page, limit: 20, search, roleId }),
    roleService.listForSelect(),
  ])

  return (
    <Suspense>
      <UsersManager
        initialData={
          users.ok && users.data
            ? users.data
            : { users: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
        initialRoles={roles.ok && roles.data ? roles.data : []}
      />
    </Suspense>
  )
}
