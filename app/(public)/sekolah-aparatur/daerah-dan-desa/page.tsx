import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgramDetail } from "@/components/public/program-detail"
import { getProgram } from "@/data/programs"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const program = getProgram("daerah-dan-desa")
  return buildPageMetadata({
    locale,
    path: ROUTES.daerahDesa,
    title: program?.title ?? "Daerah dan Desa",
    description: program?.summary ?? "Program Sekolah Aparatur Daerah dan Desa.",
  })
}

export default function DaerahDesaPage() {
  const program = getProgram("daerah-dan-desa")
  if (!program) notFound()
  return <ProgramDetail program={program} />
}
