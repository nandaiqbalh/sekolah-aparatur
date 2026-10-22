import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { AdminPermissionsProvider } from "@/components/admin/admin-permissions-provider"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { messageService } from "@/features/pesan/services/message-service"
import { registrationService } from "@/features/registration/services/registration-service"
import { extractAuthFromSession, getSession } from "@/lib/auth/get-session"
import { hasPermission } from "@/lib/auth/permissions"
import {
  ADMIN_LOGIN_PATH,
  getPathnameFromHeaders,
  withLoginRedirect,
} from "@/lib/auth/safe-redirect"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { Providers } from "@/components/providers"
import { SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: {
    default: `Backoffice — ${SITE_NAME}`,
    template: `%s | Backoffice — ${SITE_NAME}`,
  },
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    const pathname = getPathnameFromHeaders(await headers())
    redirect(withLoginRedirect(ADMIN_LOGIN_PATH, pathname))
  }

  const authUser = extractAuthFromSession(session)
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const [incomingRegistrations, incomingMessages] = await Promise.all([
    hasPermission(authUser, "pendaftaran.view") ? registrationService.count("submitted") : Promise.resolve(0),
    hasPermission(authUser, "pesan.view") ? messageService.count("submitted") : Promise.resolve(0),
  ])

  return (
    <Providers dictionary={dict}>
      <AdminPermissionsProvider
        roles={authUser.roles}
        permissions={authUser.permissions}
        isSuperAdmin={authUser.isSuperAdmin}
      >
        <div className="admin-shell fixed inset-0 flex overflow-hidden">
          <AdminSidebar
            userName={authUser.name}
            locale={locale}
            incomingRegistrations={incomingRegistrations}
            incomingMessages={incomingMessages}
          />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-background p-6 pt-[4.5rem] md:pt-6">
            {children}
          </main>
        </div>
      </AdminPermissionsProvider>
    </Providers>
  )
}
