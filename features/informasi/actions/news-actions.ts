"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { newsService } from "@/features/informasi/services/news-service"
import {
  createNewsArticleSchema,
  deleteNewsArticleSchema,
  getNewsArticleSchema,
  listNewsArticlesSchema,
  updateNewsArticleSchema,
  uploadNewsImageSchema,
  type NewsArticleDto,
  type NewsArticleListResult,
} from "@/features/informasi/schemas/news-article"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

function revalidateNews(slug?: string) {
  revalidatePath(ROUTES.home)
  revalidatePath(ROUTES.berita)
  revalidatePath("/admin/informasi")
  if (slug) revalidatePath(`/berita/${slug}`)
}

export async function listNewsArticlesAction(
  input: unknown,
): Promise<ActionResult<NewsArticleListResult>> {
  const auth = await requirePermission("informasi.view")
  if (!auth.ok) return auth

  const parsed = parseInput(listNewsArticlesSchema, input)
  if (!parsed.ok) return parsed.result

  return newsService.list(parsed.data)
}

export async function getNewsArticleAction(
  input: unknown,
): Promise<ActionResult<NewsArticleDto>> {
  const auth = await requirePermission("informasi.view")
  if (!auth.ok) return auth

  const parsed = parseInput(getNewsArticleSchema, input)
  if (!parsed.ok) return parsed.result

  return newsService.getById(parsed.data.id)
}

export async function createNewsArticleAction(
  input: unknown,
): Promise<ActionResult<NewsArticleDto>> {
  const auth = await requirePermission("informasi.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createNewsArticleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await newsService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "informasi",
    entityType: "news_article",
    entityId: result.data.id,
    summary: `Created article ${result.data.slug}`,
  })

  revalidateNews(result.data.slug)
  return result
}

export async function updateNewsArticleAction(
  input: unknown,
): Promise<ActionResult<NewsArticleDto>> {
  const auth = await requirePermission("informasi.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateNewsArticleSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await newsService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "informasi",
    entityType: "news_article",
    entityId: result.data.id,
    summary: `Updated article ${result.data.slug}`,
  })

  revalidateNews(result.data.slug)
  return result
}

export async function deleteNewsArticleAction(
  input: unknown,
): Promise<ActionResult<{ id: string; title: string }>> {
  const auth = await requirePermission("informasi.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteNewsArticleSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await newsService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "informasi",
    entityType: "news_article",
    entityId: result.data.id,
    summary: `Deleted article ${result.data.title}`,
  })

  revalidateNews()
  return result
}

export async function uploadNewsImageAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const createAuth = await requirePermission("informasi.create")
  const auth = createAuth.ok ? createAuth : await requirePermission("informasi.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadNewsImageSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return newsService.saveImage({ type: parsed.data.type, bytes })
}
