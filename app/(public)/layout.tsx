import type { Metadata } from "next"

import { Providers } from "@/components/providers"
import { PublicFooter } from "@/components/layout/public-footer"
import { PublicNavbar } from "@/components/layout/public-navbar"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { buildPageMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const page = buildPageMetadata({
    locale,
    path: "",
    title: dict.meta.title,
    description: dict.meta.description,
  })

  return {
    ...page,
    title: {
      template: `%s | ${SITE_NAME}`,
      default: dict.meta.title,
    },
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  return (
    <Providers dictionary={dict}>
      <div className="public-font flex min-h-full flex-col bg-background">
        <PublicNavbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <PublicFooter />
        <WhatsappButton
          label="Konsultasi"
          className="fixed right-4 bottom-4 z-40 shadow-lg sm:right-6 sm:bottom-6"
        />
      </div>
    </Providers>
  )
}
