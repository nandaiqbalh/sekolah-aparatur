import type { Metadata } from "next"

import { SekolahClassPage } from "@/components/public/sekolah-class-page"
import { getSekolahClass } from "@/data/sekolah-classes"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

const kelas = getSekolahClass("legislator")

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.legislator,
    title: kelas?.title ?? "Kelas Legislator",
    description: kelas?.summary ?? "Kelas Legislator.",
  })
}

export default function LegislatorPage() {
  return <SekolahClassPage slug="legislator" />
}
