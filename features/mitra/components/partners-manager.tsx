"use client"

import { GripVertical, Handshake, Pencil, Plus, Trash2 } from "lucide-react"
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
import { deletePartnerAction, listPartnersAction, reorderPartnersAction } from "@/features/mitra/actions/partner-actions"
import type { PartnerDto, PartnerKind, PartnerListResult } from "@/features/mitra/schemas/partner"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminMitraPath } from "@/lib/routes"

const PAGE_SIZE = 20

export function PartnersManager({ initialData }: { initialData: PartnerListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.mitra
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [partners, setPartners] = useState(initialData.partners)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [kind, setKind] = useState<PartnerKind>(() =>
    getParam("jenis") === "facilitator" ? "facilitator" : "university",
  )
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<PartnerDto | null>(null)
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
      kind: (getParam("jenis") === "facilitator" ? "facilitator" : "university") as PartnerKind,
      status: getParam("status") || "all",
    }
  }

  async function refresh(
    nextPage = page,
    nextSearch = search,
    nextKind = kind,
    nextStatus = status,
  ) {
    const result = await listPartnersAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      kind: nextKind,
      status: nextStatus === "published" || nextStatus === "hidden" ? nextStatus : "all",
    })
    if (result.ok && result.data) {
      setPartners(result.data.partners)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL → draft filter sync
    setSearch(filters.search)
    setKind(filters.kind)
    setStatus(filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search, filters.kind, filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string; kind?: PartnerKind; status?: string }) {
    const nextSearch = next?.search ?? search
    const nextKind = next?.kind ?? kind
    const nextStatus = next?.status ?? status
    setSearch(nextSearch)
    setKind(nextKind)
    setStatus(nextStatus)

    const patch = {
      search: nextSearch || null,
      jenis: nextKind === "university" ? null : nextKind,
      status: nextStatus === "all" ? null : nextStatus,
    }
    const current = readFiltersFromUrl()
    const unchanged =
      page === 1 &&
      current.search === nextSearch &&
      current.kind === nextKind &&
      current.status === nextStatus

    if (unchanged) {
      void refresh(1, nextSearch, nextKind, nextStatus)
      return
    }

    replaceQuery(patch, { resetPage: true })
  }

  function kindLabel(value: PartnerKind) {
    return value === "facilitator" ? copy.kindFacilitator : copy.kindUniversity
  }

  const canReorder = can("mitra.update") && !reordering

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return
    const previous = partners
    const reordered = [...partners]
    const [moved] = reordered.splice(fromIndex, 1)
    if (!moved) return
    reordered.splice(toIndex, 0, moved)
    const pageOffset = (page - 1) * PAGE_SIZE
    const items = reordered.map((item, index) => ({
      id: item.id,
      sortOrder: pageOffset + index,
    }))
    setPartners(reordered.map((item, index) => ({ ...item, sortOrder: pageOffset + index })))
    setReordering(true)
    const result = await reorderPartnersAction({ items })
    setReordering(false)
    if (result.ok) {
      toastSuccess(copy.reordered, dict.common.toastSavedDesc)
      return
    }
    setPartners(previous)
    toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          can("mitra.create") ? (
            <Button
              nativeButton={false}
              render={<Link href={`${ADMIN_ROUTES.mitraNew}?jenis=${kind}`} />}
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
            value={kind}
            onValueChange={(value) => {
              if (value === "university" || value === "facilitator") setKind(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={copy.filterKind}>
                {(value: string | null) => kindLabel(value === "facilitator" ? "facilitator" : "university")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="university">{copy.kindUniversity}</SelectItem>
              <SelectItem value="facilitator">{copy.kindFacilitator}</SelectItem>
            </SelectContent>
          </Select>
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
          clearDisabled={!search.trim() && kind === "university" && status === "all"}
          onClear={() => commitFilters({ search: "", kind: "university", status: "all" })}
        />
      </AdminFilterBar>

      {partners.length === 0 ? (
        <EmptyState icon={Handshake} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                {can("mitra.update") ? <AdminTableHeaderCell className="w-10" /> : null}
                <AdminTableHeaderCell>{copy.logoLabel}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnName}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnDetail}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {partners.map((partner, index) => (
                <AdminTableRow
                  key={partner.id}
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
                  {can("mitra.update") ? (
                    <AdminTableCell className="w-10 text-muted-foreground">
                      <GripVertical className="size-4" aria-label={copy.dragHandle} />
                    </AdminTableCell>
                  ) : null}
                  <AdminTableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={partner.logo} alt="" draggable={false} className="h-10 w-10 object-contain" />
                  </AdminTableCell>
                  <AdminTableCell className="font-medium">{partner.name}</AdminTableCell>
                  <AdminTableCell className="max-w-sm text-muted-foreground">
                    {partner.detail ? <span className="line-clamp-2">{partner.detail}</span> : null}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      isActive={partner.isPublished}
                      activeLabel={copy.statusPublished}
                      inactiveLabel={copy.statusHidden}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1" onDragStart={(event) => event.stopPropagation()}>
                      {can("mitra.update") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          nativeButton={false}
                          render={<Link href={adminMitraPath(partner.id)} />}
                          aria-label={copy.edit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("mitra.delete") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => setDeleteTarget(partner)}
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
          const result = await deletePartnerAction({ id: deleteTarget.id })
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
