"use server"

import { revalidatePath } from "next/cache"

import { recordAdminActivity } from "@/features/activity-log/services/activity-log-service"
import { siteContactService } from "@/features/kontak/services/site-contact-service"
import { updateSiteContactSchema, type SiteContactDto } from "@/features/kontak/schemas/site-contact"
import type { ActionResult } from "@/lib/action-result"
import { requirePermission } from "@/lib/auth/require-permission"
import { parseInput } from "@/lib/parse-input"
import { ROUTES } from "@/lib/routes"

export async function updateSiteContactAction(input: unknown): Promise<ActionResult<SiteContactDto>> {
  const auth = await requirePermission("kontak.update")
  if (!auth.ok) return auth

  const parsed = parseInput(updateSiteContactSchema, input)
  if (!parsed.ok) return parsed.result

  const result = await siteContactService.update(parsed.data)
  if (!result.ok || !result.data) return result

  await recordAdminActivity({
    actorId: auth.data.id,
    actorEmail: auth.data.email,
    action: "update",
    module: "kontak",
    entityType: "site_contact",
    entityId: result.data.key,
    summary: "Updated site contact",
  })

  revalidatePath("/", "layout")
  revalidatePath(ROUTES.kontak)
  revalidatePath("/admin/kontak")
  return result
}
