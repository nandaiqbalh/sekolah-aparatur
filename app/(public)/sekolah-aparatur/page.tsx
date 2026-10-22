import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { ProgramSpotlight } from "@/components/public/program-spotlight"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: ROUTES.sekolahAparatur,
    title: dict.meta.programs.title,
    description: dict.meta.programs.description,
    keywords: dict.meta.keywords,
  })
}

export default function ProgramIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Kelas Sarjana dan Pascasarja Sekolah Aparatur"
        description=""
      />
      <div className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ProgramSpotlight />
        </div>
      </div>
    </>
  )
}
