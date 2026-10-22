"use client"

import { GraduationCap, GripVertical, Pencil, Plus, Trash2 } from "lucide-react"
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
import { deleteProgramAction, listProgramsAction, reorderProgramsAction } from "@/features/program/actions/program-actions"
import type { ProgramDto, ProgramListResult } from "@/features/program/schemas/program"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminProgramPath } from "@/lib/routes"

const PAGE_SIZE = 20

export function ProgramsManager({ initialData }: { initialData: ProgramListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.program
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [programs, setPrograms] = useState(initialData.programs)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<ProgramDto | null>(null)
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
    const result = await listProgramsAction({
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

  function statusLabel(value: string) {
    if (value === "published") return copy.statusPublished
    if (value === "hidden") return copy.statusHidden
    return copy.allStatuses
  }

  const canReorder = can("program.update") && !reordering

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return
    const previous = programs
    const reordered = [...programs]
    const [moved] = reordered.splice(fromIndex, 1)
    if (!moved) return
    reordered.splice(toIndex, 0, moved)
    const pageOffset = (page - 1) * PAGE_SIZE
    const items = reordered.map((item, index) => ({
      id: item.id,
      sortOrder: pageOffset + index,
    }))
    setPrograms(reordered.map((item, index) => ({ ...item, sortOrder: pageOffset + index })))
    setReordering(true)
    const result = await reorderProgramsAction({ items })
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
          can("program.create") ? (
            <Button nativeButton={false} render={<Link href={ADMIN_ROUTES.programNew} />} className="cursor-pointer">
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
              if (value) setStatus(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={copy.allStatuses}>
                {(value: string | null) => statusLabel(value || "all")}
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
                {can("program.update") ? <AdminTableHeaderCell className="w-10" /> : null}
                <AdminTableHeaderCell>{copy.columnTitle}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {programs.map((program, index) => (
                <AdminTableRow
                  key={program.id}
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
                  {can("program.update") ? (
                    <AdminTableCell className="w-10 text-muted-foreground">
                      <GripVertical className="size-4" aria-label={copy.dragHandle} />
                    </AdminTableCell>
                  ) : null}
                  <AdminTableCell className="font-medium">{program.title}</AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      isActive={program.isPublished}
                      activeLabel={copy.statusPublished}
                      inactiveLabel={copy.statusHidden}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1" onDragStart={(event) => event.stopPropagation()}>
                      {can("program.update") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          nativeButton={false}
                          render={<Link href={adminProgramPath(program.id)} />}
                          aria-label={copy.edit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("program.delete") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => setDeleteTarget(program)}
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
          const result = await deleteProgramAction({ id: deleteTarget.id })
          if (result.ok) {
            toastSuccess(copy.deleted, dict.common.toastDeletedDesc)
            setDeleteTarget(null)
            await refresh()
          } else {
            toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
          }
        }}
      />
    </div>
  )
}
