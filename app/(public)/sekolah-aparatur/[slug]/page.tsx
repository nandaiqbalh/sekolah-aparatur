import type { Metadata } from "next"

import { SekolahClassPage } from "@/components/public/sekolah-class-page"
import { programService } from "@/features/program/services/program-service"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { programPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const program = await programService.getPublishedBySlug(slug)
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: programPath(slug),
    title: program?.title ?? dict.meta.programs.title,
    description: program?.summary || dict.meta.programFallbackDescription,
    keywords: dict.meta.keywords,
  })
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params
  return <SekolahClassPage slug={slug} />
}
