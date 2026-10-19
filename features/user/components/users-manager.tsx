"use client"

import { useEffect, useRef, useState } from "react"
import { Pencil, Plus, Trash2, Users } from "lucide-react"

import {
  createUserAction,
  deleteUserAction,
  getUsersAction,
  toggleUserActiveAction,
  updateUserAction,
} from "@/features/user/actions/user-actions"
import type { StaffUserDto, StaffUserListResult } from "@/features/user/schemas/user-types"
import { AdminFilterActions } from "@/components/admin/admin-filter-actions"
import {
  ADMIN_FILTER_CONTROL_CLASS,
  AdminFilterBar,
  AdminFilterField,
} from "@/components/admin/admin-filter-bar"
import { AdminFormDialog, DialogFooter } from "@/components/admin/admin-form-dialog"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { AdminStatusToggle } from "@/components/admin/admin-status-toggle"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

type RoleOption = { id: string; name: string; slug: string; isSystem: boolean }

type UserForm = {
  id: string
  name: string
  username: string
  email: string
  password: string
  roleId: string
  isActive: boolean
}

const emptyForm: UserForm = {
  id: "",
  name: "",
  username: "",
  email: "",
  password: "",
  roleId: "",
  isActive: true,
}

export function UsersManager({
  initialData,
  initialRoles,
}: {
  initialData: StaffUserListResult
  initialRoles: RoleOption[]
}) {
  const dict = useDictionary()
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [users, setUsers] = useState(initialData.users)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [roleId, setRoleId] = useState(() => getParam("roleId") || "all")
  const [roles] = useState(initialRoles)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StaffUserDto | null>(null)
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  function readFiltersFromUrl() {
    return {
      search: getParam("search"),
      roleId: getParam("roleId") || "all",
    }
  }

  async function refresh(nextPage = page, nextSearch = search, nextRoleId = roleId) {
    const result = await getUsersAction({
      page: nextPage,
      limit: 20,
      search: nextSearch || undefined,
      roleId: nextRoleId !== "all" ? nextRoleId : undefined,
    })
    if (result.ok && result.data) {
      setUsers(result.data.users)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // Sync draft filter inputs when URL changes (back/forward, external navigation)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional URL → draft sync
    setSearch(filters.search)
    setRoleId(filters.roleId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search, filters.roleId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string; roleId?: string }) {
    const nextSearch = next?.search ?? search
    const nextRoleId = next?.roleId ?? roleId
    setSearch(nextSearch)
    setRoleId(nextRoleId)

    const patch = {
      search: nextSearch || null,
      roleId: nextRoleId === "all" ? null : nextRoleId,
    } as const
    const current = readFiltersFromUrl()
    const unchanged =
      page === 1 && current.search === nextSearch && current.roleId === nextRoleId

    if (unchanged) {
      void refresh(1, nextSearch, nextRoleId)
      return
    }

    replaceQuery(patch, { resetPage: true })
  }

  function openCreate() {
    setForm({
      ...emptyForm,
      roleId: roles[0]?.id ?? "",
    })
    setIsFormOpen(true)
  }

  function openEdit(user: StaffUserDto) {
    setForm({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      roleId: user.roles[0]?.id ?? "",
      isActive: user.isActive,
    })
    setIsFormOpen(true)
  }

  async function handleSubmit() {
    if (!form.roleId) {
      toastError(dict.common.toastErrorTitle, dict.admin.users.roleRequired)
      return
    }

    setPending(true)
    const roleIds = [form.roleId]
    const result = form.id
      ? await updateUserAction({
          id: form.id,
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password || undefined,
          roleIds,
          isActive: form.isActive,
        })
      : await createUserAction({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          roleIds,
          isActive: form.isActive,
        })
    setPending(false)

    if (result.ok) {
      toastSuccess(
        form.id ? dict.admin.users.updated : dict.admin.users.created,
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
        title={dict.admin.users.title}
        description={dict.admin.users.description}
        actions={
          can("users.create") ? (
            <Button onClick={openCreate}>
              <Plus className="mr-1 size-4" />
              {dict.admin.users.add}
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
            placeholder={dict.admin.searchUsers}
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterField>
          <Select
            value={roleId}
            onValueChange={(value) => {
              if (!value) return
              setRoleId(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={dict.admin.filterRole}>
                {(v: string | null) => {
                  if (!v || v === "all") return dict.admin.filterRole
                  return roles.find((r) => r.id === v)?.name ?? v
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{dict.admin.filterRole}</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AdminFilterField>
        <AdminFilterActions
          clearDisabled={!search.trim() && roleId === "all"}
          onClear={() => commitFilters({ search: "", roleId: "all" })}
        />
      </AdminFilterBar>

      {users.length === 0 ? (
        <EmptyState icon={Users} title={dict.admin.users.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>{dict.admin.users.name}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{dict.admin.users.username}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{dict.admin.users.email}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{dict.admin.users.roles}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{dict.admin.users.status}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {users.map((user) => (
                <AdminTableRow key={user.id} className="hover:bg-muted/30">
                  <AdminTableCell className="font-medium">{user.name}</AdminTableCell>
                  <AdminTableCell className="text-muted-foreground">{user.username}</AdminTableCell>
                  <AdminTableCell className="text-muted-foreground">{user.email}</AdminTableCell>
                  <AdminTableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.slice(0, 1).map((role) => (
                        <Badge
                          key={role.id}
                          variant={role.slug === "super_admin" ? "destructive" : "secondary"}
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusToggle
                      isActive={user.isActive}
                      permission="users.update"
                      activeLabel={dict.admin.users.active}
                      inactiveLabel={dict.admin.users.inactive}
                      activateLabel={dict.admin.activate}
                      deactivateLabel={dict.admin.deactivate}
                      onToggle={async () => {
                        const result = await toggleUserActiveAction({
                          id: user.id,
                          isActive: !user.isActive,
                        })
                        if (result.ok) {
                          toastSuccess(
                            user.isActive ? dict.admin.users.disabled : dict.admin.users.enabled,
                            dict.common.toastStatusUpdatedDesc,
                          )
                          await refresh()
                        } else {
                          toastError(
                            dict.common.toastErrorTitle,
                            result.error ?? dict.common.toastTryAgainDesc,
                          )
                        }
                      }}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1">
                      {can("users.update") ? (
                        <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("users.delete") ? (
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(user)}>
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
            countLabel={dict.admin.usersCount.replace("{count}", String(total))}
          />
        </>
      )}

      <AdminFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={form.id ? dict.admin.users.edit : dict.admin.users.add}
        closeLabel={dict.common.close}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6">
            <div className="space-y-2">
              <Label htmlFor="staff-name">{dict.admin.users.name} *</Label>
              <Input
                id="staff-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder={dict.admin.users.namePlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-username">{dict.admin.users.username} *</Label>
              <Input
                id="staff-username"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder={dict.admin.users.usernamePlaceholder}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">{dict.admin.users.email} *</Label>
              <Input
                id="staff-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={dict.admin.users.emailPlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-password">
                {form.id ? dict.admin.users.passwordOptional : `${dict.admin.users.password} *`}
              </Label>
              <PasswordInput
                id="staff-password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={
                  form.id
                    ? dict.admin.users.passwordOptionalPlaceholder
                    : dict.admin.users.passwordPlaceholder
                }
                required={!form.id}
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label>{dict.admin.users.assignRole} *</Label>
              <Select
                value={form.roleId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, roleId: value ?? "" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={dict.admin.users.rolePlaceholder}>
                    {(v: string | null) => roles.find((r) => r.id === v)?.name ?? v}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="staff-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isActive: Boolean(checked) }))
                }
              />
              <Label htmlFor="staff-active" className="cursor-pointer">
                {dict.admin.users.active}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              {dict.admin.users.cancel}
            </Button>
            <Button type="button" disabled={pending} onClick={() => void handleSubmit()}>
              {pending ? dict.admin.users.saving : dict.admin.users.save}
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
        title={dict.admin.users.deleteConfirm.replace("{name}", deleteTarget?.name ?? "")}
        message={dict.admin.confirmDeleteMessage}
        confirmLabel={dict.admin.users.delete}
        cancelLabel={dict.admin.users.cancel}
        showCancel
        onConfirm={async () => {
          if (!deleteTarget) return
          const result = await deleteUserAction({ id: deleteTarget.id })
          setDeleteTarget(null)
          if (result.ok) {
            toastSuccess(dict.admin.users.deleted, dict.common.toastDeletedDesc)
            await refresh()
          } else {
            toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
          }
        }}
      />
    </div>
  )
}
