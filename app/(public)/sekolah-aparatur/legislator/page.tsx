import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProgramDetail } from "@/components/public/program-detail"
import { getProgram } from "@/data/programs"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const program = getProgram("legislator")
  return buildPageMetadata({
    locale,
    path: ROUTES.legislator,
    title: program?.title ?? "Legislator",
    description: program?.summary ?? "Program Sekolah Legislator.",
  })
}

export default function LegislatorPage() {
  const program = getProgram("legislator")
  if (!program) notFound()
  return <ProgramDetail program={program} />
}
