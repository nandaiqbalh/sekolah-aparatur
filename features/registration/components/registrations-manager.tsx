"use client"

import { ClipboardList } from "lucide-react"
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
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listRegistrationsAction } from "@/features/registration/actions/registration-actions"
import {
  RegistrationStatusSelect,
} from "@/features/registration/components/registration-status-select"
import {
  registrationStatuses,
  type RegistrationListResult,
  type RegistrationStatus,
} from "@/features/registration/schemas/registration"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { adminPendaftaranPath } from "@/lib/routes"

const PAGE_SIZE = 20

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export function RegistrationsManager({
  initialData,
  programs,
}: {
  initialData: RegistrationListResult
  programs: { slug: string; title: string }[]
}) {
  const dict = useDictionary()
  const copy = dict.admin.pendaftaran
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [registrations, setRegistrations] = useState(initialData.registrations)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [program, setProgram] = useState(() => getParam("program") || "all")
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  function readFiltersFromUrl() {
    return {
      search: getParam("search"),
      program: getParam("program") || "all",
      status: getParam("status") || "all",
    }
  }

  async function refresh(nextPage = page, nextSearch = search, nextProgram = program, nextStatus = status) {
    const result = await listRegistrationsAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      program: nextProgram !== "all" ? nextProgram : undefined,
      status: nextStatus === "all" ? "all" : (nextStatus as RegistrationStatus),
    })
    if (result.ok && result.data) {
      setRegistrations(result.data.registrations)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL → draft filter sync
    setSearch(filters.search)
    setProgram(filters.program)
    setStatus(filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search, filters.program, filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string; program?: string; status?: string }) {
    const nextSearch = next?.search ?? search
    const nextProgram = next?.program ?? program
    const nextStatus = next?.status ?? status
    setSearch(nextSearch)
    setProgram(nextProgram)
    setStatus(nextStatus)

    const patch = {
      search: nextSearch || null,
      program: nextProgram === "all" ? null : nextProgram,
      status: nextStatus === "all" ? null : nextStatus,
    }
    const current = readFiltersFromUrl()
    const unchanged =
      page === 1 &&
      current.search === nextSearch &&
      current.program === nextProgram &&
      current.status === nextStatus

    if (unchanged) {
      void refresh(1, nextSearch, nextProgram, nextStatus)
      return
    }

    replaceQuery(patch, { resetPage: true })
  }

  function statusFilterLabel(value: string) {
    if (value === "submitted") return copy.statusSubmitted
    if (value === "contacted") return copy.statusContacted
    if (value === "accepted") return copy.statusAccepted
    if (value === "declined") return copy.statusDeclined
    return copy.allStatuses
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title={copy.title} description={copy.description} />

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
            value={program}
            onValueChange={(value) => {
              if (value) setProgram(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={copy.allPrograms}>
                {(value: string | null) =>
                  !value || value === "all" ? copy.allPrograms : programs.find((item) => item.slug === value)?.title ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allPrograms}</SelectItem>
              {programs.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                {(value: string | null) => statusFilterLabel(value || "all")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allStatuses}</SelectItem>
              {registrationStatuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {statusFilterLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AdminFilterField>
        <AdminFilterActions
          clearDisabled={!search.trim() && program === "all" && status === "all"}
          onClear={() => commitFilters({ search: "", program: "all", status: "all" })}
        />
      </AdminFilterBar>

      {registrations.length === 0 ? (
        <EmptyState icon={ClipboardList} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>{copy.columnName}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnProgram}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnWhatsapp}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnDate}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {registrations.map((item) => (
                <AdminTableRow key={item.id} className="hover:bg-muted/30">
                  <AdminTableCell className="font-medium">
                    <Link href={adminPendaftaranPath(item.id)} className="cursor-pointer hover:underline">
                      {item.name}
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell className="text-muted-foreground">
                    {programs.find((program) => program.slug === item.programSlug)?.title ?? item.programSlug}
                  </AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted-foreground">{item.whatsapp}</AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted-foreground">
                    {formatSubmittedAt(item.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <RegistrationStatusSelect
                      id={item.id}
                      status={item.status}
                      disabled={!can("pendaftaran.update")}
                    />
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
    </div>
  )
}
