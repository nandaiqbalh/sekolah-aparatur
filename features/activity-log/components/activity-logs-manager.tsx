"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { Eye, ScrollText } from "lucide-react"

import {
  getActivityLogsAction,
} from "@/features/activity-log/actions/activity-log-actions"
import type {
  ActivityLogActorOption,
  ActivityLogListResult,
  AdminActivityLogDto,
} from "@/features/activity-log/schemas/activity-log"
import { AdminFilterActions } from "@/components/admin/admin-filter-actions"
import {
  ADMIN_FILTER_CONTROL_CLASS,
  AdminFilterBar,
  AdminFilterField,
} from "@/components/admin/admin-filter-bar"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DateField } from "@/components/ui/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MultiSelect } from "@/components/ui/multi-select"
import { useUrlListParams } from "@/hooks/use-url-page"
import { PERMISSION_CATALOG } from "@/lib/rbac/permission-catalog"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError } from "@/lib/notification"
import { formatDateTime } from "@/lib/utils/date"

const EXTRA_ACTIVITY_MODULES = ["auth"] as const

const MODULE_OPTIONS = Array.from(
  new Set([...PERMISSION_CATALOG.map((p) => p.module), ...EXTRA_ACTIVITY_MODULES]),
)
  .sort((a, b) => a.localeCompare(b))
  .map((module) => ({ value: module, label: module }))

function parseListParam(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function prettyJson(value: unknown): string {
  if (value == null) return "—"
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function actionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  if (action === "delete") return "destructive"
  if (action === "create") return "default"
  return "secondary"
}

export function ActivityLogsManager({
  initialData,
  initialActors,
}: {
  initialData: ActivityLogListResult
  initialActors: ActivityLogActorOption[]
}) {
  const dict = useDictionary()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [data, setData] = useState(initialData)
  const [modules, setModules] = useState<string[]>(() => parseListParam(getParam("modules")))
  const [actors, setActors] = useState<string[]>(() => parseListParam(getParam("actors")))
  const [from, setFrom] = useState(() => getParam("from"))
  const [to, setTo] = useState(() => getParam("to"))
  const [pending, startTransition] = useTransition()
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<AdminActivityLogDto | null>(null)
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  const actorOptions = useMemo(
    () =>
      initialActors.map((actor) => ({
        value: actor.email,
        label: actor.email,
      })),
    [initialActors],
  )

  const hasActiveFilters =
    modules.length > 0 || actors.length > 0 || Boolean(from) || Boolean(to)

  function readFiltersFromUrl() {
    return {
      modules: parseListParam(getParam("modules")),
      actors: parseListParam(getParam("actors")),
      from: getParam("from"),
      to: getParam("to"),
    }
  }

  function load(params: {
    page?: number
    modules?: string[]
    actors?: string[]
    from?: string
    to?: string
  }) {
    startTransition(async () => {
      const nextModules = params.modules ?? modules
      const nextActors = params.actors ?? actors
      const result = await getActivityLogsAction({
        page: params.page ?? page,
        limit: data.limit,
        modules: nextModules.length > 0 ? nextModules : undefined,
        actorEmails: nextActors.length > 0 ? nextActors : undefined,
        from: (params.from ?? from) || undefined,
        to: (params.to ?? to) || undefined,
      })
      if (result.ok && result.data) setData(result.data)
      else toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastLoadFailedDesc)
    })
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional URL → draft sync
    setModules(filters.modules)
    setActors(filters.actors)
    setFrom(filters.from)
    setTo(filters.to)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    load({ ...filters, page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: {
    modules?: string[]
    actors?: string[]
    from?: string
    to?: string
  }) {
    const nextModules = next?.modules ?? modules
    const nextActors = next?.actors ?? actors
    const nextFrom = next?.from ?? from
    const nextTo = next?.to ?? to

    setModules(nextModules)
    setActors(nextActors)
    setFrom(nextFrom)
    setTo(nextTo)

    const patch = {
      modules: nextModules.length > 0 ? nextModules.join(",") : null,
      actors: nextActors.length > 0 ? nextActors.join(",") : null,
      from: nextFrom || null,
      to: nextTo || null,
    } as const

    const current = readFiltersFromUrl()
    const unchanged =
      page === 1 &&
      current.modules.join(",") === nextModules.join(",") &&
      current.actors.join(",") === nextActors.join(",") &&
      current.from === nextFrom &&
      current.to === nextTo

    if (unchanged) {
      load({ page: 1, modules: nextModules, actors: nextActors, from: nextFrom, to: nextTo })
      return
    }

    replaceQuery(patch, { resetPage: true })
  }

  const selectedModulesCountLabel = useMemo(
    () => (count: number) =>
      dict.admin.activityLogs.modulesSelected.replace("{count}", String(count)),
    [dict.admin.activityLogs.modulesSelected],
  )

  const selectedActorsCountLabel = useMemo(
    () => (count: number) =>
      dict.admin.activityLogs.actorsSelected.replace("{count}", String(count)),
    [dict.admin.activityLogs.actorsSelected],
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={dict.admin.activityLogs.title}
        description={dict.admin.activityLogs.description}
      />

      <AdminFilterBar
        onSubmit={(e) => {
          e.preventDefault()
          commitFilters({ modules, actors, from, to })
        }}
      >
        <AdminFilterField label={dict.admin.activityLogs.filterModule}>
          <MultiSelect
            value={modules}
            onChange={setModules}
            options={MODULE_OPTIONS}
            placeholder={dict.admin.activityLogs.modulesPlaceholder}
            searchPlaceholder={dict.admin.activityLogs.modulesSearch}
            emptyLabel={dict.common.noResults}
            selectedCountLabel={selectedModulesCountLabel}
            disabled={pending}
            allowClear
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterField label={dict.admin.activityLogs.filterActor}>
          <MultiSelect
            value={actors}
            onChange={setActors}
            options={actorOptions}
            placeholder={dict.admin.activityLogs.actorsPlaceholder}
            searchPlaceholder={dict.admin.activityLogs.actorsSearch}
            emptyLabel={dict.common.noResults}
            selectedCountLabel={selectedActorsCountLabel}
            disabled={pending}
            allowClear
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterField label={dict.admin.activityLogs.from}>
          <DateField
            value={from}
            onChange={setFrom}
            placeholder={dict.admin.activityLogs.from}
            disabled={pending}
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterField label={dict.admin.activityLogs.to}>
          <DateField
            value={to}
            onChange={setTo}
            placeholder={dict.admin.activityLogs.to}
            disabled={pending}
            className={ADMIN_FILTER_CONTROL_CLASS}
          />
        </AdminFilterField>
        <AdminFilterActions
          pending={pending}
          clearDisabled={!hasActiveFilters}
          onClear={() => commitFilters({ modules: [], actors: [], from: "", to: "" })}
        />
      </AdminFilterBar>

      {data.items.length === 0 ? (
        <EmptyState icon={ScrollText} title={dict.admin.activityLogs.empty} />
      ) : (
        <AdminTableCard>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableHeaderCell>{dict.admin.activityLogs.time}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{dict.admin.activityLogs.actor}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{dict.admin.activityLogs.module}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{dict.admin.activityLogs.action}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{dict.admin.activityLogs.summary}</AdminTableHeaderCell>
              <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
            </AdminTableRow>
          </AdminTableHead>
          <tbody>
            {data.items.map((item) => (
              <AdminTableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => {
                  setDetail(item)
                  setDetailOpen(true)
                }}
              >
                <AdminTableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </AdminTableCell>
                <AdminTableCell>{item.actorEmail}</AdminTableCell>
                <AdminTableCell className="text-muted-foreground">{item.module}</AdminTableCell>
                <AdminTableCell>
                  <Badge variant={actionBadgeVariant(item.action)}>{item.action}</Badge>
                </AdminTableCell>
                <AdminTableCell>{item.summary}</AdminTableCell>
                <AdminTableCell align="right">
                  <button
                    type="button"
                    className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
                    aria-label={dict.admin.activityLogs.view}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDetail(item)
                      setDetailOpen(true)
                    }}
                  >
                    <Eye className="size-4" />
                  </button>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTableCard>
      )}

      {(data.totalPages > 1 || data.total > 0) && (
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          disabled={pending}
          onPageChange={setPage}
          previousLabel={dict.admin.paginationPrevious}
          nextLabel={dict.admin.paginationNext}
          countLabel={dict.admin.activityLogs.totalCount.replace("{count}", String(data.total))}
        />
      )}

      <Dialog open={detailOpen} onOpenChange={setDetailOpen} intendedCloseOnly>
        <DialogContent className="max-w-3xl" showCloseButton closeLabel={dict.common.close}>
          <DialogHeader className="pr-12">
            <DialogTitle>{dict.admin.activityLogs.detail}</DialogTitle>
            <DialogDescription>{detail?.summary ?? ""}</DialogDescription>
          </DialogHeader>

          {detail ? (
            <div className="space-y-4 overflow-y-auto px-6 pb-2">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-muted-foreground">{dict.admin.activityLogs.time}</div>
                  <div>{formatDateTime(detail.createdAt)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{dict.admin.activityLogs.actor}</div>
                  <div>{detail.actorEmail}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{dict.admin.activityLogs.module}</div>
                  <div>{detail.module}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{dict.admin.activityLogs.action}</div>
                  <Badge variant={actionBadgeVariant(detail.action)}>{detail.action}</Badge>
                </div>
                {detail.entityType || detail.entityId ? (
                  <div>
                    <div className="text-muted-foreground">{dict.admin.activityLogs.entity}</div>
                    <div className="font-mono text-xs">
                      {[detail.entityType, detail.entityId].filter(Boolean).join(" · ") || "—"}
                    </div>
                  </div>
                ) : null}
              </div>

              {detail.metadata != null ? (
                <div className="space-y-1">
                  <div className="text-sm font-medium">{dict.admin.activityLogs.metadata}</div>
                  <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {prettyJson(detail.metadata)}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDetailOpen(false)}>
              {dict.admin.activityLogs.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
