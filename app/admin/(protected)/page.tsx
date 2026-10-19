import Link from "next/link"

import { AccessDenied } from "@/components/admin/access-denied"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { buttonVariants } from "@/components/ui/button"
import { activityLogService } from "@/features/activity-log/services/activity-log-service"
import { roleService } from "@/features/role/services/role-service"
import { userService } from "@/features/user/services/user-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"
import { extractAuthFromSession, getSession } from "@/lib/auth/get-session"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ADMIN_ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
  if (!(await canAccessPage("dashboard.view"))) {
    return <AccessDenied />
  }

  const session = await getSession()
  const dict = await getDictionary(await getLocale())
  const user = session ? extractAuthFromSession(session) : null

  const [users, roles, logs] = await Promise.all([
    userService.getUsers({ page: 1, limit: 1 }),
    roleService.getRoles({ page: 1, limit: 1 }),
    activityLogService.list({ page: 1, limit: 1 }),
  ])

  const userTotal = users.ok && users.data ? users.data.total : 0
  const roleTotal = roles.ok && roles.data ? roles.data.total : 0
  const logTotal = logs.total

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={dict.admin.dashboard.title}
        description={
          <>
            {dict.admin.dashboard.description}
            {user ? (
              <span className="mt-1 block">
                {dict.admin.dashboard.signedInAs} {user.name} ({user.email})
              </span>
            ) : null}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard label={dict.admin.dashboard.totalUsers} value={userTotal} />
        <AdminStatCard label={dict.admin.dashboard.totalRoles} value={roleTotal} />
        <AdminStatCard label={dict.admin.dashboard.recentActivity} value={logTotal} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{dict.admin.dashboard.quickLinks}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={ADMIN_ROUTES.users} className={cn(buttonVariants())}>
            {dict.admin.dashboard.viewUsers}
          </Link>
          <Link href={ADMIN_ROUTES.roles} className={cn(buttonVariants({ variant: "outline" }))}>
            {dict.admin.dashboard.viewRoles}
          </Link>
          <Link
            href={ADMIN_ROUTES.activityLogs}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {dict.admin.dashboard.viewActivityLogs}
          </Link>
        </div>
      </section>
    </div>
  )
}
