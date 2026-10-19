import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Providers } from "@/components/providers"
import { PublicFooter } from "@/components/layout/public-footer"
import { PublicNavbar } from "@/components/layout/public-navbar"
import { SUPPORTED_LOCALES } from "@/lib/i18n/config"
import { getLocaleFromParams, isValidLocale } from "@/lib/i18n/get-locale"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { buildPageMetadata } from "@/lib/seo"
import { SITE_NAME } from "@/lib/site"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

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

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: localeParam } = await params
  if (!isValidLocale(localeParam)) notFound()

  const locale = getLocaleFromParams(localeParam)
  const dict = await getDictionary(locale)

  return (
    <Providers dictionary={dict}>
      <div className="public-font flex min-h-full flex-col bg-background">
        <PublicNavbar locale={locale} />
        <main className="flex flex-1 flex-col">{children}</main>
        <PublicFooter locale={locale} dict={dict} />
      </div>
    </Providers>
  )
}
