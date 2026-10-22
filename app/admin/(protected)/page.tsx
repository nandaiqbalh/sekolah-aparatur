import Link from "next/link"

import { AccessDenied } from "@/components/admin/access-denied"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { buttonVariants } from "@/components/ui/button"
import { galleryService } from "@/features/galeri/services/gallery-service"
import { newsService } from "@/features/informasi/services/news-service"
import { partnerService } from "@/features/mitra/services/partner-service"
import { programService } from "@/features/program/services/program-service"
import { messageService } from "@/features/pesan/services/message-service"
import { registrationService } from "@/features/registration/services/registration-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"
import { extractAuthFromSession, getSession } from "@/lib/auth/get-session"
import { hasPermission } from "@/lib/auth/permissions"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ADMIN_ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

export default async function AdminDashboardPage() {
  if (!(await canAccessPage("dashboard.view"))) {
    return <AccessDenied />
  }

  const session = await getSession()
  const dict = await getDictionary(await getLocale())
  const copy = dict.admin.dashboard
  const user = session ? extractAuthFromSession(session) : null
  const can = (key: string) => (user ? hasPermission(user, key) : false)

  const [incoming, registrations, incomingMessages, messages, programs, news, galleries, partners] = await Promise.all([
    can("pendaftaran.view") ? registrationService.count("submitted") : Promise.resolve(0),
    can("pendaftaran.view") ? registrationService.count() : Promise.resolve(0),
    can("pesan.view") ? messageService.count("submitted") : Promise.resolve(0),
    can("pesan.view") ? messageService.count() : Promise.resolve(0),
    can("program.view") ? programService.count() : Promise.resolve(0),
    can("informasi.view") ? newsService.count() : Promise.resolve(0),
    can("galeri.view") ? galleryService.count() : Promise.resolve(0),
    can("mitra.view") ? partnerService.count() : Promise.resolve(0),
  ])

  const stats = [
    can("pendaftaran.view")
      ? {
          label: copy.incomingRegistrations,
          value: incoming,
          hint: copy.incomingHint,
          href: `${ADMIN_ROUTES.pendaftaran}?status=submitted`,
          emphasis: "primary" as const,
        }
      : null,
    can("pendaftaran.view")
      ? {
          label: copy.totalRegistrations,
          value: registrations,
          hint: undefined,
          href: ADMIN_ROUTES.pendaftaran,
          emphasis: "secondary" as const,
        }
      : null,
    can("pesan.view")
      ? {
          label: copy.incomingMessages,
          value: incomingMessages,
          hint: copy.incomingHint,
          href: `${ADMIN_ROUTES.pesan}?status=submitted`,
          emphasis: "primary" as const,
        }
      : null,
    can("pesan.view")
      ? {
          label: copy.totalMessages,
          value: messages,
          hint: undefined,
          href: ADMIN_ROUTES.pesan,
          emphasis: "secondary" as const,
        }
      : null,
    can("program.view")
      ? {
          label: copy.programs,
          value: programs,
          hint: undefined,
          href: ADMIN_ROUTES.program,
          emphasis: "secondary" as const,
        }
      : null,
    can("informasi.view")
      ? {
          label: copy.news,
          value: news,
          hint: undefined,
          href: ADMIN_ROUTES.informasi,
          emphasis: "secondary" as const,
        }
      : null,
    can("galeri.view")
      ? {
          label: copy.galleries,
          value: galleries,
          hint: undefined,
          href: ADMIN_ROUTES.galeri,
          emphasis: "secondary" as const,
        }
      : null,
    can("mitra.view")
      ? {
          label: copy.partners,
          value: partners,
          hint: undefined,
          href: ADMIN_ROUTES.mitra,
          emphasis: "secondary" as const,
        }
      : null,
  ].filter((item) => item !== null)

  const links = [
    can("profil.view") ? { href: ADMIN_ROUTES.profilLembaga, label: copy.viewProfile } : null,
    can("pendaftaran.view") ? { href: ADMIN_ROUTES.pendaftaran, label: copy.viewRegistrations } : null,
    can("pesan.view") ? { href: ADMIN_ROUTES.pesan, label: copy.viewMessages } : null,
    can("program.view") ? { href: ADMIN_ROUTES.program, label: copy.viewPrograms } : null,
    can("informasi.view") ? { href: ADMIN_ROUTES.informasi, label: copy.viewNews } : null,
    can("galeri.view") ? { href: ADMIN_ROUTES.galeri, label: copy.viewGalleries } : null,
    can("mitra.view") ? { href: ADMIN_ROUTES.mitra, label: copy.viewPartners } : null,
    can("kontak.view") ? { href: ADMIN_ROUTES.kontak, label: copy.viewContact } : null,
  ].filter((item) => item !== null)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={
          <>
            {copy.description}
            {user ? (
              <span className="mt-1 block">
                {copy.signedInAs} {user.name} ({user.email})
              </span>
            ) : null}
          </>
        }
      />

      {stats.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <Link key={item.label} href={item.href} className="cursor-pointer">
              <AdminStatCard
                label={item.label}
                value={item.value}
                hint={item.hint}
                emphasis={item.emphasis}
              />
            </Link>
          ))}
        </div>
      ) : null}

      {links.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-medium">{copy.quickLinks}</h2>
          <div className="flex flex-wrap gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
