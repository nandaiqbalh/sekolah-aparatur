import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { NewsArticlesManager } from "@/features/informasi/components/news-articles-manager"
import { newsService } from "@/features/informasi/services/news-service"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    status?: string
  }>
}

export default async function AdminInformasiPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("informasi.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const category = parseSearchParam(sp.category)
  const status = parseEnumParam(sp.status, ["all", "published", "hidden"] as const, "all")

  const [articles, categories] = await Promise.all([
    newsService.list({ page, limit: 20, search, category, status }),
    newsService.listCategories(),
  ])

  return (
    <Suspense>
      <NewsArticlesManager
        initialData={
          articles.ok && articles.data
            ? articles.data
            : { articles: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
        categories={categories}
      />
    </Suspense>
  )
}
