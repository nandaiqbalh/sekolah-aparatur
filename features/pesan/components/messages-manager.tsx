"use client"

import { Mail } from "lucide-react"
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
import { listMessagesAction } from "@/features/pesan/actions/message-actions"
import { MessageStatusSelect, messageStatusLabel } from "@/features/pesan/components/message-status-select"
import { messageStatuses, type MessageListResult, type MessageStatus } from "@/features/pesan/schemas/message"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { adminPesanPath } from "@/lib/routes"

const PAGE_SIZE = 20

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export function MessagesManager({ initialData }: { initialData: MessageListResult }) {
  const dict = useDictionary()
  const copy = dict.admin.pesan
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [messages, setMessages] = useState(initialData.messages)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [status, setStatus] = useState(() => getParam("status") || "all")
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
    const result = await listMessagesAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      status: nextStatus === "all" ? "all" : (nextStatus as MessageStatus),
    })
    if (result.ok && result.data) {
      setMessages(result.data.messages)
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

  function statusFilterLabel(value: string) {
    if (messageStatuses.includes(value as MessageStatus)) {
      return messageStatusLabel(value as MessageStatus, copy)
    }
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
              {messageStatuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {statusFilterLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AdminFilterField>
        <AdminFilterActions
          clearDisabled={!search.trim() && status === "all"}
          onClear={() => commitFilters({ search: "", status: "all" })}
        />
      </AdminFilterBar>

      {messages.length === 0 ? (
        <EmptyState icon={Mail} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>{copy.columnName}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnContact}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnMessage}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnDate}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {messages.map((item) => (
                <AdminTableRow key={item.id} className="hover:bg-muted/30">
                  <AdminTableCell className="font-medium">
                    <Link href={adminPesanPath(item.id)} className="cursor-pointer hover:underline">
                      {item.name}
                    </Link>
                  </AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted-foreground">{item.contact}</AdminTableCell>
                  <AdminTableCell className="max-w-sm text-muted-foreground">
                    <span className="line-clamp-2">{item.message}</span>
                  </AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted-foreground">
                    {formatSubmittedAt(item.createdAt)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <MessageStatusSelect id={item.id} status={item.status} disabled={!can("pesan.update")} />
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
