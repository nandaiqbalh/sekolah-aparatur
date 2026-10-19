import { StatusPage } from "@/components/shared/status-page"
import { getLocale } from "@/lib/i18n/get-locale"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { ROUTES, localizedPath } from "@/lib/routes"

export default async function NotFound() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const { notFound } = dict.errors

  return (
    <StatusPage
      statusCode={404}
      title={notFound.title}
      description={notFound.description}
      ctaLabel={notFound.cta}
      ctaHref={localizedPath(locale, ROUTES.home)}
    />
  )
}
