"use client"

import { GripVertical, Pencil, Plus, Trash2, Wallet } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { AdminFilterActions } from "@/components/admin/admin-filter-actions"
import {
  ADMIN_FILTER_CONTROL_CLASS,
  AdminFilterBar,
  AdminFilterField,
} from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  deleteFeeScheduleAction,
  listFeeSchedulesAction,
  reorderFeeSchedulesAction,
} from "@/features/biaya/actions/fee-schedule-actions"
import type { FeeScheduleDto, FeeScheduleListResult } from "@/features/biaya/schemas/fee-schedule"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminRincianBiayaPath } from "@/lib/routes"

const PAGE_SIZE = 20

export function FeeSchedulesManager({ initialData }: { initialData: FeeScheduleListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.rincianBiaya
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [schedules, setSchedules] = useState(initialData.schedules)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<FeeScheduleDto | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  function readFiltersFromUrl() {
    return {
      search: getParam("search"),
      status: getParam("status") || "all",
    }
  }

  async function refresh(nextPage = page, nextSearch = search, nextStatus = status) {
    const result = await listFeeSchedulesAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      status: nextStatus === "published" || nextStatus === "hidden" ? nextStatus : "all",
    })
    if (result.ok && result.data) {
      setSchedules(result.data.schedules)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL → draft filter sync
    setSearch(filters.search)
    setStatus(filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search, filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string; status?: string }) {
    const nextSearch = next?.search ?? search
    const nextStatus = next?.status ?? status
    setSearch(nextSearch)
    setStatus(nextStatus)

    const current = readFiltersFromUrl()
    const unchanged = page === 1 && current.search === nextSearch && current.status === nextStatus
    if (unchanged) {
      void refresh(1, nextSearch, nextStatus)
      return
    }

    replaceQuery(
      {
        search: nextSearch || null,
        status: nextStatus === "all" ? null : nextStatus,
      },
      { resetPage: true },
    )
  }

  const canReorder = can("biaya.update") && !reordering && status === "all" && !search.trim()

  async function handleReorder(from: number, to: number) {
    if (from === to || !canReorder) return
    const previous = schedules
    const next = [...schedules]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const withOrder = next.map((item, index) => ({ ...item, sortOrder: index }))
    setSchedules(withOrder)
    setReordering(true)
    const result = await reorderFeeSchedulesAction({
      items: withOrder.map((item) => ({ id: item.id, sortOrder: item.sortOrder })),
    })
    setReordering(false)
    if (result.ok) {
      toastSuccess(copy.reordered, dict.common.toastSavedDesc)
      return
    }
    setSchedules(previous)
    toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          can("biaya.create") ? (
            <Button
              nativeButton={false}
              render={<Link href={ADMIN_ROUTES.rincianBiayaNew} />}
              className="cursor-pointer"
            >
              <Plus className="mr-1 size-4" />
              {copy.create}
            </Button>
          ) : null
        }
      />

      <AdminFilterBar
        onSubmit={(event) => {
          event.preventDefault()
          commitFilters()
        }}
      >
        <AdminFilterField>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.search}
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterField>
          <Select
            value={status}
            onValueChange={(value) => {
              if (!value) return
              setStatus(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={copy.allStatuses}>
                {(value: string | null) => {
                  if (!value || value === "all") return copy.allStatuses
                  if (value === "published") return copy.statusPublished
                  if (value === "hidden") return copy.statusHidden
                  return value
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allStatuses}</SelectItem>
              <SelectItem value="published">{copy.statusPublished}</SelectItem>
              <SelectItem value="hidden">{copy.statusHidden}</SelectItem>
            </SelectContent>
          </Select>
        </AdminFilterField>
        <AdminFilterActions
          clearDisabled={!search.trim() && status === "all"}
          onClear={() => commitFilters({ search: "", status: "all" })}
        />
      </AdminFilterBar>

      {schedules.length === 0 ? (
        <EmptyState icon={Wallet} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                {can("biaya.update") ? <AdminTableHeaderCell className="w-10" /> : null}
                <AdminTableHeaderCell>{copy.columnTitle}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnSubtitle}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnGroups}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {schedules.map((item, index) => (
                <AdminTableRow
                  key={item.id}
                  draggable={canReorder}
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => {
                    if (!canReorder) return
                    event.preventDefault()
                  }}
                  onDrop={() => {
                    if (dragIndex === null) return
                    void handleReorder(dragIndex, index)
                    setDragIndex(null)
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`hover:bg-muted/30 ${dragIndex === index ? "opacity-50" : ""} ${canReorder ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {can("biaya.update") ? (
                    <AdminTableCell className="w-10 text-muted-foreground">
                      <GripVertical className="size-4" aria-label={copy.dragHandle} />
                    </AdminTableCell>
                  ) : null}
                  <AdminTableCell className="font-medium">{item.title}</AdminTableCell>
                  <AdminTableCell className="max-w-sm text-muted-foreground">
                    <span className="line-clamp-2">{item.subtitle || "—"}</span>
                  </AdminTableCell>
                  <AdminTableCell className="text-muted-foreground">{item.groups.length}</AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      isActive={item.isPublished}
                      activeLabel={copy.statusPublished}
                      inactiveLabel={copy.statusHidden}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1" onDragStart={(event) => event.stopPropagation()}>
                      {can("biaya.update") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          nativeButton={false}
                          render={<Link href={adminRincianBiayaPath(item.id)} />}
                          aria-label={copy.edit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("biaya.delete") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={dict.admin.delete}
                        >
                          <Trash2 className="size-4" />
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
            countLabel={copy.count.replace("{count}", String(total))}
            previousLabel={dict.admin.paginationPrevious}
            nextLabel={dict.admin.paginationNext}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        type="warning"
        title={copy.deleteTitle}
        message={copy.deleteMessage}
        confirmLabel={dict.admin.delete}
        cancelLabel={dict.admin.cancel}
        showCancel
        onConfirm={async () => {
          if (!deleteTarget) return
          const result = await deleteFeeScheduleAction({ id: deleteTarget.id })
          if (result.ok) {
            toastSuccess(copy.deleted, dict.common.toastDeletedDesc)
            setDeleteTarget(null)
            await refresh()
            return
          }
          toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
        }}
      />
    </div>
  )
}
