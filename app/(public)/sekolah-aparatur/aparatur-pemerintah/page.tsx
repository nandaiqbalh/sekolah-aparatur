import type { Metadata } from "next"

import { SekolahClassPage } from "@/components/public/sekolah-class-page"
import { getSekolahClass } from "@/data/sekolah-classes"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

const kelas = getSekolahClass("aparatur-pemerintah")

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.aparaturPemerintah,
    title: kelas?.title ?? "Kelas Aparatur Pemerintah Daerah",
    description: kelas?.summary ?? "Kelas Aparatur Pemerintah Daerah.",
  })
}

export default function AparaturPemerintahPage() {
  return <SekolahClassPage slug="aparatur-pemerintah" />
}
