"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Eye, Pencil, Plus, Shield, Trash2 } from "lucide-react"

import {
  createRoleAction,
  deleteRoleAction,
  getRolesAction,
  updateRoleAction,
} from "@/features/role/actions/role-actions"
import type { RoleDto, RoleListResult } from "@/features/role/schemas/role-types"
import { AdminFilterActions } from "@/components/admin/admin-filter-actions"
import {
  ADMIN_FILTER_CONTROL_CLASS,
  AdminFilterBar,
  AdminFilterField,
} from "@/components/admin/admin-filter-bar"
import { AdminFormDialog, DialogFooter } from "@/components/admin/admin-form-dialog"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUrlListParams } from "@/hooks/use-url-page"
import { ADMIN_ROUTES } from "@/lib/routes"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

type RoleForm = {
  id: string
  name: string
  slug: string
  description: string
}

const emptyForm: RoleForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function RolesManager({ initialData }: { initialData: RoleListResult }) {
  const dict = useDictionary()
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [roles, setRoles] = useState(initialData.roles)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [form, setForm] = useState<RoleForm>(emptyForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<RoleDto | null>(null)
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  function readFiltersFromUrl() {
    return { search: getParam("search") }
  }

  async function refresh(nextPage = page, nextSearch = search) {
    const result = await getRolesAction({
      page: nextPage,
      limit: 20,
      search: nextSearch || undefined,
    })
    if (result.ok && result.data) {
      setRoles(result.data.roles)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional URL → draft sync
    setSearch(filters.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string }) {
    const nextSearch = next?.search ?? search
    setSearch(nextSearch)
    const current = readFiltersFromUrl()
    const unchanged = page === 1 && current.search === nextSearch

    if (unchanged) {
      void refresh(1, nextSearch)
      return
    }

    replaceQuery({ search: nextSearch || null }, { resetPage: true })
  }

  function openCreate() {
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  function openEdit(role: RoleDto) {
    setForm({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description ?? "",
    })
    setIsFormOpen(true)
  }

  async function handleSubmit() {
    setPending(true)
    const result = form.id
      ? await updateRoleAction({
          id: form.id,
          name: form.name,
          slug: form.slug || undefined,
          description: form.description || null,
        })
      : await createRoleAction({
          name: form.name,
          slug: form.slug || slugify(form.name),
          description: form.description || null,
        })
    setPending(false)

    if (result.ok) {
      toastSuccess(
        form.id ? dict.admin.roles.updated : dict.admin.roles.created,
        dict.common.toastSavedDesc,
      )
      setIsFormOpen(false)
      setForm(emptyForm)
      await refresh()
    } else {
      toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={dict.admin.roles.title}
        description={dict.admin.roles.description}
        actions={
          can("roles.create") ? (
            <Button onClick={openCreate}>
              <Plus className="mr-1 size-4" />
              {dict.admin.roles.add}
            </Button>
          ) : null
        }
      />

      <AdminFilterBar
        onSubmit={(e) => {
          e.preventDefault()
          commitFilters()
        }}
      >
        <AdminFilterField>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.admin.searchRoles}
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterActions
          clearDisabled={!search.trim()}
          onClear={() => commitFilters({ search: "" })}
        />
      </AdminFilterBar>

      {roles.length === 0 ? (
        <EmptyState icon={Shield} title={dict.admin.roles.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>{dict.admin.roles.name}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{dict.admin.roles.permissions}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="center">{dict.admin.roles.userCount}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {roles.map((role) => (
                <AdminTableRow key={role.id} className="hover:bg-muted/30">
                  <AdminTableCell className="font-medium">{role.name}</AdminTableCell>
                  <AdminTableCell>
                    {role.slug === "super_admin"
                      ? dict.admin.roles.superAdminBypass
                      : dict.admin.roles.permissionCount.replace(
                          "{count}",
                          String(role.permissions.length),
                        )}
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <Link
                      href={`${ADMIN_ROUTES.users}?roleId=${role.id}`}
                      className="text-primary tabular-nums hover:underline"
                    >
                      {role.userCount}
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1">
                      {can("roles.view") ? (
                        <Link
                          href={`${ADMIN_ROUTES.roles}/${role.id}`}
                          title={dict.admin.roles.view}
                          aria-label={dict.admin.roles.view}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-foreground hover:bg-muted"
                        >
                          <Eye className="size-4" />
                        </Link>
                      ) : null}
                      {can("roles.update") ? (
                        <Button variant="ghost" size="icon" onClick={() => openEdit(role)}>
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("roles.delete") && !role.isSystem ? (
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(role)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      ) : null}
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTableCard>

          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            previousLabel={dict.admin.paginationPrevious}
            nextLabel={dict.admin.paginationNext}
            countLabel={dict.admin.rolesCount.replace("{count}", String(total))}
          />
        </>
      )}

      <AdminFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={form.id ? dict.admin.roles.title : dict.admin.roles.add}
        closeLabel={dict.common.close}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">{dict.admin.roles.name}</Label>
              <Input
                id="role-name"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : slugify(name),
                  }))
                }}
                placeholder={dict.admin.roles.namePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">{dict.admin.roles.descriptionLabel}</Label>
              <Textarea
                id="role-description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={dict.admin.roles.descriptionPlaceholder}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              {dict.admin.roles.cancel}
            </Button>
            <Button type="button" disabled={pending} onClick={() => void handleSubmit()}>
              {pending ? dict.admin.roles.saving : dict.admin.roles.save}
            </Button>
          </DialogFooter>
        </div>
      </AdminFormDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        type="error"
        title={dict.admin.roles.deleteConfirm.replace("{name}", deleteTarget?.name ?? "")}
        message={dict.admin.confirmDeleteMessage}
        confirmLabel={dict.admin.roles.delete}
        cancelLabel={dict.admin.roles.cancel}
        showCancel
        onConfirm={async () => {
          if (!deleteTarget) return
          const result = await deleteRoleAction({ id: deleteTarget.id })
          setDeleteTarget(null)
          if (result.ok) {
            toastSuccess(dict.admin.roles.deleted, dict.common.toastDeletedDesc)
            await refresh()
          } else {
            toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
          }
        }}
      />
    </div>
  )
}
