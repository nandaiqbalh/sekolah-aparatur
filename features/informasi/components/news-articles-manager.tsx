"use client"

import { Newspaper, Pencil, Plus, Trash2 } from "lucide-react"
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
import { deleteNewsArticleAction, listNewsArticlesAction } from "@/features/informasi/actions/news-actions"
import type { NewsArticleDto, NewsArticleListResult } from "@/features/informasi/schemas/news-article"
import { formatArticleDate } from "@/data/news"
import { useUrlListParams } from "@/hooks/use-url-page"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminInformasiPath } from "@/lib/routes"

const PAGE_SIZE = 20

export function NewsArticlesManager({
  initialData,
  categories,
}: {
  initialData: NewsArticleListResult
  categories: string[]
}) {
  const dict = useDictionary()
  const copy = dict.admin.informasi
  const { can } = usePermissions()
  const { page, setPage, queryKey, getParam, replaceQuery } = useUrlListParams()
  const [articles, setArticles] = useState(initialData.articles)
  const [totalPages, setTotalPages] = useState(initialData.totalPages)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(() => getParam("search"))
  const [category, setCategory] = useState(() => getParam("category") || "all")
  const [status, setStatus] = useState(() => getParam("status") || "all")
  const [deleteTarget, setDeleteTarget] = useState<NewsArticleDto | null>(null)
  const skipUrlSync = useRef(true)
  const filterQueryKey = queryKey
    .split("&")
    .filter((part) => part && !part.startsWith("page="))
    .join("&")

  function readFiltersFromUrl() {
    return {
      search: getParam("search"),
      category: getParam("category") || "all",
      status: getParam("status") || "all",
    }
  }

  async function refresh(
    nextPage = page,
    nextSearch = search,
    nextCategory = category,
    nextStatus = status,
  ) {
    const result = await listNewsArticlesAction({
      page: nextPage,
      limit: PAGE_SIZE,
      search: nextSearch || undefined,
      category: nextCategory !== "all" ? nextCategory : undefined,
      status: nextStatus === "published" || nextStatus === "hidden" ? nextStatus : "all",
    })
    if (result.ok && result.data) {
      setArticles(result.data.articles)
      setTotalPages(result.data.totalPages)
      setTotal(result.data.total)
    }
  }

  useEffect(() => {
    const filters = readFiltersFromUrl()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL → draft filter sync
    setSearch(filters.search)
    setCategory(filters.category)
    setStatus(filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQueryKey])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const filters = readFiltersFromUrl()
    void refresh(page, filters.search, filters.category, filters.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  function commitFilters(next?: { search?: string; category?: string; status?: string }) {
    const nextSearch = next?.search ?? search
    const nextCategory = next?.category ?? category
    const nextStatus = next?.status ?? status
    setSearch(nextSearch)
    setCategory(nextCategory)
    setStatus(nextStatus)

    const patch = {
      search: nextSearch || null,
      category: nextCategory === "all" ? null : nextCategory,
      status: nextStatus === "all" ? null : nextStatus,
    }
    const current = readFiltersFromUrl()
    const unchanged =
      page === 1 &&
      current.search === nextSearch &&
      current.category === nextCategory &&
      current.status === nextStatus

    if (unchanged) {
      void refresh(1, nextSearch, nextCategory, nextStatus)
      return
    }

    replaceQuery(patch, { resetPage: true })
  }

  const categoryOptions = categories.includes(category) || category === "all"
    ? categories
    : [category, ...categories]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          can("informasi.create") ? (
            <Button
              nativeButton={false}
              render={<Link href={ADMIN_ROUTES.informasiNew} />}
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
            value={category}
            onValueChange={(value) => {
              if (!value) return
              setCategory(value)
            }}
          >
            <SelectTrigger className={ADMIN_FILTER_CONTROL_CLASS}>
              <SelectValue placeholder={copy.allCategories}>
                {(value: string | null) => {
                  if (!value || value === "all") return copy.allCategories
                  return value
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allCategories}</SelectItem>
              {categoryOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
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
          clearDisabled={!search.trim() && category === "all" && status === "all"}
          onClear={() => commitFilters({ search: "", category: "all", status: "all" })}
        />
      </AdminFilterBar>

      {articles.length === 0 ? (
        <EmptyState icon={Newspaper} title={copy.empty} />
      ) : (
        <>
          <AdminTableCard>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>{copy.columnTitle}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnCategory}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnDate}</AdminTableHeaderCell>
                <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <tbody>
              {articles.map((article) => (
                <AdminTableRow key={article.id} className="hover:bg-muted/30">
                  <AdminTableCell className="max-w-sm font-medium">
                    <span className="line-clamp-2">{article.title}</span>
                  </AdminTableCell>
                  <AdminTableCell className="text-muted-foreground">{article.category}</AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted-foreground">
                    {formatArticleDate(article.publishedAt)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge
                      isActive={article.isPublished}
                      activeLabel={copy.statusPublished}
                      inactiveLabel={copy.statusHidden}
                    />
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex justify-end gap-1">
                      {can("informasi.update") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          nativeButton={false}
                          render={<Link href={adminInformasiPath(article.id)} />}
                          aria-label={copy.edit}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      ) : null}
                      {can("informasi.delete") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => setDeleteTarget(article)}
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
          const result = await deleteNewsArticleAction({ id: deleteTarget.id })
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
