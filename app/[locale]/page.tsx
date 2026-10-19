import { HomeAbout } from "@/components/sections/home-about"
import { HomeCta } from "@/components/sections/home-cta"
import { HomeFaq } from "@/components/sections/home-faq"
import { HomeHero } from "@/components/sections/home-hero"
import { HomeWhyUs } from "@/components/sections/home-why-us"
import { getLocaleFromParams } from "@/lib/i18n/get-locale"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { ROUTES, localizedPath } from "@/lib/routes"
import { jsonLdScript } from "@/lib/seo"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = getLocaleFromParams(localeParam)
  const dict = await getDictionary(locale)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(localizedPath(locale, ROUTES.home)),
    description: dict.meta.description,
    inLanguage: locale === "id" ? "id-ID" : "en-US",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <HomeHero dict={dict} />
      <HomeAbout dict={dict} />
      <HomeWhyUs dict={dict} />
      <HomeFaq />
      <HomeCta dict={dict} />
    </>
  )
}
