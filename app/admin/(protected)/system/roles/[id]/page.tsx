import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { RoleDetailManager } from "@/features/role/components/role-detail-manager"
import { permissionService } from "@/features/permission/services/permission-service"
import { roleService } from "@/features/role/services/role-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

export default async function AdminRoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await canAccessPage("roles.view"))) {
    return <AccessDenied />
  }

  const { id } = await params
  const [role, permissions] = await Promise.all([
    roleService.getById(id),
    permissionService.listAll(),
  ])

  if (!role.ok || !role.data) notFound()

  return (
    <RoleDetailManager
      role={role.data}
      permissions={permissions.ok && permissions.data ? permissions.data : []}
    />
  )
}
