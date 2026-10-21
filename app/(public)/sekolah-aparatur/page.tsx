import type { Metadata } from "next"

import { PageHero } from "@/components/public/page-hero"
import { ProgramSpotlight } from "@/components/public/program-spotlight"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.sekolahAparatur,
    title: "Program Sarjana dan Pascasarjana Aparatur",
    description:
      "Kelas Aparatur Pemerintah Daerah, Kelas Aparatur Desa, dan Kelas Legislator.",
  })
}

export default function ProgramIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Program Sarjana dan Pascasarjana Aparatur"
        description="Kelas Aparatur Pemerintah Daerah, Kelas Aparatur Desa, dan Kelas Legislator, diselenggarakan bersama universitas penyelenggara melalui jalur Rekognisi Pembelajaran Lampau (RPL)."
      />
      <div className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ProgramSpotlight />
        </div>
      </div>
    </>
  )
}
