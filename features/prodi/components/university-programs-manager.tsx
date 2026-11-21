"use client"

import { Check, GraduationCap, GripVertical, Pencil, Plus, Trash2 } from "lucide-react"
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
  deleteUniversityProgramAction,
  listUniversityProgramsAction,
  reorderUniversityProgramsAction,
} from "@/features/prodi/actions/university-program-actions"
import type {
  UniversityProgramDto,
  UniversityProgramListResult,
} from "@/features/prodi/schemas/university-program"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminProgramStudiPath } from "@/lib/routes"

const PAGE_SIZE = 20

function Mark({ on }: { on: boolean }) {
  if (!on) return <span className="text-muted-foreground">—</span>
  return <Check className="mx-auto size-4 text-[var(--sa-navy)]" aria-hidden />
}

export function UniversityProgramsManager({ initialData }: { initialData: UniversityProgramListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.programStudi
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [programs, setPrograms] = useState(initialData.programs)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<UniversityProgramDto | null>(null)
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
    const result = await listUniversityProgramsAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      status: nextStatus === "published" || nextStatus === "hidden" ? nextStatus : "all",
    })
    if (result.ok && result.data) {
      setPrograms(result.data.programs)
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

  const canReorder = can("prodi.update") && !reordering && status === "all" && !search.trim()

  async function handleReorder(from: number, to: number) {
    if (from === to || !canReorder) return
    const previous = programs
    const next = [...programs]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const withOrder = next.map((item, index) => ({ ...item, sortOrder: index }))
    setPrograms(withOrder)
    setReordering(true)
    const result = await reorderUniversityProgramsAction({
      items: withOrder.map((item) => ({ id: item.id, sortOrder: item.sortOrder })),
    })
    setReordering(false)
    if (result.ok) {
      toastSuccess(copy.reordered, dict.common.toastSavedDesc)
      return
    }
    setPrograms(previous)
    toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          can("prodi.create") ? (
            <Button
              nativeButton={false}
              render={<Link href={ADMIN_ROUTES.programStudiNew} />}
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

      {programs.length === 0 ? (
        <EmptyState icon={GraduationCap} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                {can("prodi.update") ? <AdminTableHeaderCell className="w-10" /> : null}
                <AdminTableHeaderCell>{copy.columnUniversity}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStudy}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStrata}</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-center">{copy.classAparaturDesaShort}</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-center">{copy.classAparaturPemerintahShort}</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-center">{copy.classLegislatorShort}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {programs.map((item, index) => (
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
                  {can("prodi.update") ? (
                    <AdminTableCell className="w-10 text-muted-foreground">
                      <GripVertical className="size-4" aria-label={copy.dragHandle} />
                    </AdminTableCell>
                  ) : null}
                  <AdminTableCell className="font-medium">{item.university}</AdminTableCell>
                  <AdminTableCell>
                    <div>{item.study}</div>
                    {item.concentration ? (
                      <div className="text-xs text-muted-foreground">{item.concentration}</div>
                    ) : null}
                  </AdminTableCell>
                  <AdminTableCell>{item.strata}</AdminTableCell>
                  <AdminTableCell className="text-center">
                    <Mark on={item.forAparaturDesa} />
                  </AdminTableCell>
                  <AdminTableCell className="text-center">
                    <Mark on={item.forAparaturPemerintah} />
                  </AdminTableCell>
                  <AdminTableCell className="text-center">
                    <Mark on={item.forLegislator} />
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      isActive={item.isPublished}
                      activeLabel={copy.statusPublished}
                      inactiveLabel={copy.statusHidden}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1" onDragStart={(event) => event.stopPropagation()}>
                      {can("prodi.update") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          nativeButton={false}
                          render={<Link href={adminProgramStudiPath(item.id)} />}
                          aria-label={copy.edit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("prodi.delete") ? (
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
          const result = await deleteUniversityProgramAction({ id: deleteTarget.id })
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
