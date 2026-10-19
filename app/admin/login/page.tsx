import { redirect } from "next/navigation"

import { AdminAuthBrandHeader } from "@/components/admin/admin-auth-brand-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/login-form"
import { getSession } from "@/lib/auth/get-session"
import { ADMIN_DEFAULT_REDIRECT, safeAdminRedirect } from "@/lib/auth/safe-redirect"
import { Providers } from "@/components/providers"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { SITE_NAME } from "@/lib/site"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const session = await getSession()
  if (session) redirect(ADMIN_DEFAULT_REDIRECT)

  const { redirect: redirectTo } = await searchParams
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return (
    <Providers dictionary={dict}>
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm border-border shadow-md">
          <CardHeader className="pb-2">
            <AdminAuthBrandHeader
              brandName={dict.admin.brand || SITE_NAME}
              logoUrl={null}
              backofficeLabel={dict.admin.backofficeLabel}
            />
            <CardTitle className="text-center text-xl">{dict.admin.loginTitle}</CardTitle>
            <p className="text-center text-sm text-muted-foreground">{dict.admin.loginSubtitle}</p>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={safeAdminRedirect(redirectTo)} />
          </CardContent>
        </Card>
      </div>
    </Providers>
  )
}
