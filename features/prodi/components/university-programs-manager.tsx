"use client"

import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { AdminFilterActions } from "@/components/admin/admin-filter-actions"
import {
  ADMIN_FILTER_CONTROL_CLASS,
  AdminFilterBar,
  AdminFilterField,
} from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  deleteUniversityProgramAction,
  listUniversityProgramsAction,
  updateUniversityProgramAction,
} from "@/features/prodi/actions/university-program-actions"
import type {
  UniversityProgramDto,
  UniversityProgramListResult,
} from "@/features/prodi/schemas/university-program"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminProgramStudiPath } from "@/lib/routes"

const PAGE_SIZE = 100

type ClassField = "forAparaturDesa" | "forAparaturPemerintah" | "forLegislator"

function buildSpans(values: string[]) {
  const spans = values.map(() => 0)
  let index = 0
  while (index < values.length) {
    let count = 1
    while (index + count < values.length && values[index + count] === values[index]) {
      count += 1
    }
    spans[index] = count
    index += count
  }
  return spans
}

function withUniversityNumbers(rows: UniversityProgramDto[]) {
  const numbers = new Map<string, number>()
  let next = 1
  return rows.map((row) => {
    let no = numbers.get(row.university)
    if (!no) {
      no = next
      numbers.set(row.university, no)
      next += 1
    }
    return { ...row, no }
  })
}

export function UniversityProgramsManager({ initialData }: { initialData: UniversityProgramListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.programStudi
  const { can } = usePermissions()
  const { page, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [programs, setPrograms] = useState(initialData.programs)
  const [search, setSearch] = useState(() => getParam("search"))
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<UniversityProgramDto | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
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

  async function refresh(nextSearch = search, nextStatus = status) {
    const result = await listUniversityProgramsAction({
      page: 1,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      status: nextStatus === "published" || nextStatus === "hidden" ? nextStatus : "all",
    })
    if (result.ok && result.data) {
      setPrograms(result.data.programs)
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
    void refresh(filters.search, filters.status)
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
      void refresh(nextSearch, nextStatus)
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

  const displayRows = useMemo(() => withUniversityNumbers(programs), [programs])
  const universityKeys = displayRows.map((row) => `${row.no}:${row.university}`)
  const studyKeys = displayRows.map((row) => `${row.no}:${row.university}:${row.study}`)
  const universitySpans = buildSpans(universityKeys)
  const studySpans = buildSpans(studyKeys)

  async function toggleClass(row: UniversityProgramDto, field: ClassField) {
    if (!can("prodi.update") || savingId) return

    const nextValue = !row[field]
    const previous = programs
    setPrograms((rows) => rows.map((item) => (item.id === row.id ? { ...item, [field]: nextValue } : item)))
    setSavingId(row.id)

    const result = await updateUniversityProgramAction({
      id: row.id,
      partnerId: row.partnerId,
      study: row.study,
      strata: row.strata,
      concentration: row.concentration ?? "",
      forAparaturDesa: field === "forAparaturDesa" ? nextValue : row.forAparaturDesa,
      forAparaturPemerintah: field === "forAparaturPemerintah" ? nextValue : row.forAparaturPemerintah,
      forLegislator: field === "forLegislator" ? nextValue : row.forLegislator,
      isPublished: row.isPublished,
    })

    setSavingId(null)
    if (result.ok) {
      toastSuccess(copy.updated, dict.common.toastSavedDesc)
      return
    }
    setPrograms(previous)
    toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
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

      {displayRows.length === 0 ? (
        <EmptyState icon={GraduationCap} title={copy.empty} />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-white">
          <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--sa-navy)] text-white">
                <th className="px-4 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">{copy.columnUniversity}</th>
                <th className="px-4 py-3 font-semibold">{copy.columnStudy}</th>
                <th className="px-4 py-3 font-semibold">{copy.columnStrata}</th>
                <th className="px-4 py-3 font-semibold">{copy.concentration}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.classAparaturDesa}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.classAparaturPemerintah}</th>
                <th className="px-3 py-3 text-center font-semibold">{copy.classLegislator}</th>
                <th className="px-3 py-3 text-right font-semibold">{dict.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, index) => {
                const showUniversity = universitySpans[index] > 0
                const showStudy = studySpans[index] > 0
                const zebra = index % 2 === 0 ? "bg-white" : "bg-muted/40"
                const busy = savingId === row.id

                return (
                  <tr key={row.id} className={zebra}>
                    {showUniversity ? (
                      <td
                        rowSpan={universitySpans[index]}
                        className="align-top px-4 py-3 font-semibold text-[var(--sa-navy)]"
                      >
                        {row.no}
                      </td>
                    ) : null}
                    {showUniversity ? (
                      <td
                        rowSpan={universitySpans[index]}
                        className="align-top px-4 py-3 font-semibold text-[var(--sa-navy)]"
                      >
                        {row.university}
                      </td>
                    ) : null}
                    {showStudy ? (
                      <td rowSpan={studySpans[index]} className="align-top px-4 py-3 text-muted-foreground">
                        {row.study}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 font-semibold text-[var(--sa-navy)]">{row.strata}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.concentration ?? "—"}</td>
                    <td className="px-3 py-3 text-center">
                      <EditableCheck
                        checked={row.forAparaturDesa}
                        disabled={!can("prodi.update") || busy}
                        label={copy.classAparaturDesa}
                        onToggle={() => void toggleClass(row, "forAparaturDesa")}
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <EditableCheck
                        checked={row.forAparaturPemerintah}
                        disabled={!can("prodi.update") || busy}
                        label={copy.classAparaturPemerintah}
                        onToggle={() => void toggleClass(row, "forAparaturPemerintah")}
                      />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <EditableCheck
                        checked={row.forLegislator}
                        disabled={!can("prodi.update") || busy}
                        label={copy.classLegislator}
                        onToggle={() => void toggleClass(row, "forLegislator")}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        {can("prodi.update") ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                            nativeButton={false}
                            render={<Link href={adminProgramStudiPath(row.id)} />}
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
                            onClick={() => setDeleteTarget(row)}
                            aria-label={dict.admin.delete}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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

function EditableCheck({
  checked,
  disabled,
  label,
  onToggle,
}: {
  checked: boolean
  disabled: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onToggle()}
        aria-label={label}
        className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
      />
    </label>
  )
}
