import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { SiteContactForm } from "@/features/kontak/components/site-contact-form"
import { siteContactService } from "@/features/kontak/services/site-contact-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

export default async function AdminKontakPage() {
  if (!(await canAccessPage("kontak.view"))) {
    return <AccessDenied />
  }

  const contact = await siteContactService.get()
  if (!contact) notFound()

  return <SiteContactForm contact={contact} canUpdate={await canAccessPage("kontak.update")} />
}
