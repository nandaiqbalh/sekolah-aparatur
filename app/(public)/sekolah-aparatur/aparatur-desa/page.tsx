import type { Metadata } from "next"

import { SekolahClassPage } from "@/components/public/sekolah-class-page"
import { getSekolahClass } from "@/data/sekolah-classes"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

const kelas = getSekolahClass("aparatur-desa")

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.aparaturDesa,
    title: kelas?.title ?? "Kelas Aparatur Desa",
    description: kelas?.summary ?? "Kelas Aparatur Desa.",
  })
}

export default function AparaturDesaPage() {
  return <SekolahClassPage slug="aparatur-desa" />
}
