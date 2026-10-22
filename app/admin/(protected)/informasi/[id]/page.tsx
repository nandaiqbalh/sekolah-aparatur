import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { NewsArticleForm } from "@/features/informasi/components/news-article-form"
import { newsService } from "@/features/informasi/services/news-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminInformasiFormPage({ params }: PageProps) {
  const { id } = await params

  if (id === "baru") {
    if (!(await canAccessPage("informasi.create"))) {
      return <AccessDenied />
    }
    return <NewsArticleForm mode="create" />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("informasi.update"))) {
    return <AccessDenied />
  }

  const article = await newsService.getById(id)
  if (!article.ok || !article.data) notFound()

  return <NewsArticleForm mode="edit" article={article.data} />
}
