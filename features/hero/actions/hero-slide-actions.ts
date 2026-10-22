"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { heroSlideService } from "@/features/hero/services/hero-slide-service"
import {
  createHeroSlideSchema,
  deleteHeroSlideSchema,
  reorderHeroSlidesSchema,
  updateHeroSlideSchema,
  uploadHeroImageSchema,
  type HeroSlideDto,
} from "@/features/hero/schemas/hero-slide"
import { actionFailure, type ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ADMIN_ROUTES, ROUTES } from "@/lib/routes"

function revalidateHero() {
  revalidatePath(ROUTES.home)
  revalidatePath(ADMIN_ROUTES.hero)
}

export async function listHeroSlidesAction(): Promise<ActionResult<HeroSlideDto[]>> {
  const auth = await requirePermission("hero.view")
  if (!auth.ok) return auth

  return heroSlideService.list()
}

export async function createHeroSlideAction(input: unknown): Promise<ActionResult<HeroSlideDto>> {
  const auth = await requirePermission("hero.create")
  if (!auth.ok) return auth

  const parsed = parseInput(createHeroSlideSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await heroSlideService.create(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "create",
    module: "hero",
    entityType: "hero_slide",
    entityId: result.data.id,
    summary: `Created hero slide ${result.data.image}`,
  })

  revalidateHero()
  return result
}

export async function updateHeroSlideAction(input: unknown): Promise<ActionResult<HeroSlideDto>> {
  const auth = await requirePermission("hero.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateHeroSlideSchema, input)
  if (!parsed.ok) return parsed.result

  const { id, ...values } = parsed.data
  const result = await heroSlideService.update(id, values)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "hero",
    entityType: "hero_slide",
    entityId: result.data.id,
    summary: `Updated hero slide ${result.data.image}`,
  })

  revalidateHero()
  return result
}

export async function reorderHeroSlidesAction(
  input: unknown,
): Promise<ActionResult<{ count: number }>> {
  const auth = await requirePermission("hero.update")
  if (!auth.ok) return auth

  const parsed = parseInput(reorderHeroSlidesSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await heroSlideService.reorder(parsed.data.items)
  if (!result.ok) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "hero",
    entityType: "hero_slide",
    summary: "Reordered hero slides",
  })

  revalidateHero()
  return result
}

export async function deleteHeroSlideAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const auth = await requirePermission("hero.delete")
  if (!auth.ok) return auth

  const parsed = parseInput(deleteHeroSlideSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await heroSlideService.delete(parsed.data.id)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "delete",
    module: "hero",
    entityType: "hero_slide",
    entityId: result.data.id,
    summary: "Deleted hero slide",
  })

  revalidateHero()
  return result
}

export async function uploadHeroImageAction(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const createAuth = await requirePermission("hero.create")
  const auth = createAuth.ok ? createAuth : await requirePermission("hero.update")
  if (!auth.ok) return auth

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return actionFailure("VALIDATION_ERROR", "Berkas gambar wajib diunggah.")
  }

  const parsed = parseInput(uploadHeroImageSchema, { type: file.type, size: file.size })
  if (!parsed.ok) return parsed.result

  const bytes = Buffer.from(await file.arrayBuffer())
  return heroSlideService.saveImage({ type: parsed.data.type, bytes })
}
