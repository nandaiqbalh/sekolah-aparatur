"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"

import { assignRolePermissionsAction, updateRoleAction } from "@/features/role/actions/role-actions"
import type { PermissionSelectDto } from "@/features/permission/schemas/permission"
import type { RoleDto } from "@/features/role/schemas/role-types"
import { AdminDetailField } from "@/components/admin/admin-detail-field"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_ROUTES } from "@/lib/routes"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { formatDateTime } from "@/lib/utils/date"

export function RoleDetailManager({
  role,
  permissions,
}: {
  role: RoleDto
  permissions: PermissionSelectDto[]
}) {
  const dict = useDictionary()
  const router = useRouter()
  const { can } = usePermissions()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState(role.name)
  const [slug, setSlug] = useState(role.slug)
  const [description, setDescription] = useState(role.description ?? "")
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(role.permissions.map((p) => p.id)),
  )

  const grouped = useMemo(() => {
    const map = new Map<string, PermissionSelectDto[]>()
    for (const permission of permissions) {
      const list = map.get(permission.module) ?? []
      list.push(permission)
      map.set(permission.module, list)
    }
    return [...map.entries()]
  }, [permissions])

  const isSuperAdminRole = role.slug === "super_admin"

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={role.name}
        description={role.slug}
        backHref={ADMIN_ROUTES.roles}
        backLabel={dict.admin.roles.backToList}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminDetailField label={dict.admin.roles.system} value={role.isSystem ? "Yes" : "No"} />
        <AdminDetailField label={dict.admin.roles.userCount} value={String(role.userCount)} />
        <AdminDetailField
          label={dict.admin.activityLogs.time}
          value={formatDateTime(role.updatedAt)}
        />
      </div>

      {can("roles.update") ? (
        <form
          className="max-w-xl space-y-4 rounded-lg border border-border bg-card p-4"
          onSubmit={(e) => {
            e.preventDefault()
            startTransition(async () => {
              const result = await updateRoleAction({
                id: role.id,
                name,
                slug: role.isSystem ? undefined : slug,
                description: description || null,
              })
              if (!result.ok) {
                toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
                return
              }
              toastSuccess(dict.admin.roles.updated, dict.common.toastSavedDesc)
              router.refresh()
            })
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="detail-name">{dict.admin.roles.name}</Label>
            <Input
              id="detail-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={dict.admin.roles.namePlaceholder}
            />
          </div>
          {!role.isSystem ? (
            <div className="space-y-2">
              <Label htmlFor="detail-slug">{dict.admin.roles.slug}</Label>
              <Input
                id="detail-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={dict.admin.roles.slugPlaceholder}
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="detail-description">{dict.admin.roles.descriptionLabel}</Label>
            <Input
              id="detail-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={dict.admin.roles.descriptionPlaceholder}
            />
          </div>
          <Button type="submit" disabled={pending} className="w-fit">
            {pending ? dict.admin.roles.saving : dict.admin.roles.save}
          </Button>
        </form>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{dict.admin.roles.permissions}</h2>
        {isSuperAdminRole ? (
          <p className="text-sm text-muted-foreground">{dict.admin.roles.superAdminNote}</p>
        ) : (
          <>
            {grouped.map(([moduleName, items]) => (
              <div key={moduleName} className="space-y-2">
                <h3 className="text-sm font-medium capitalize">{moduleName}</h3>
                <AdminTableCard>
                  <AdminTableHead>
                    <AdminTableRow>
                      <AdminTableHeaderCell className="w-10" />
                      <AdminTableHeaderCell>Key</AdminTableHeaderCell>
                    </AdminTableRow>
                  </AdminTableHead>
                  <tbody>
                    {items.map((item) => (
                      <AdminTableRow key={item.id}>
                        <AdminTableCell className="w-10">
                          <Checkbox
                            disabled={!can("roles.update") && !can("permissions.update")}
                            checked={selected.has(item.id)}
                            onCheckedChange={() => toggle(item.id)}
                            aria-label={item.key}
                          />
                        </AdminTableCell>
                        <AdminTableCell className="font-mono text-xs">{item.key}</AdminTableCell>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </AdminTableCard>
              </div>
            ))}
            {can("roles.update") || can("permissions.update") ? (
              <Button
                className="w-fit"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await assignRolePermissionsAction({
                      roleId: role.id,
                      permissionIds: [...selected],
                    })
                    if (!result.ok) {
                      toastError(
                        dict.common.toastErrorTitle,
                        result.error ?? dict.common.toastTryAgainDesc,
                      )
                      return
                    }
                    toastSuccess(dict.admin.roles.saved, dict.common.toastSavedDesc)
                    router.refresh()
                  })
                }}
              >
                {pending ? dict.admin.roles.saving : dict.admin.roles.save}
              </Button>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
