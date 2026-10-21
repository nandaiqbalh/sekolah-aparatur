import { notFound } from "next/navigation"

import { ProgramDetail } from "@/components/public/program-detail"
import { getProgram } from "@/data/programs"
import { getSekolahClass } from "@/data/sekolah-classes"

export function SekolahClassPage({ slug }: { slug: string }) {
  const item = getSekolahClass(slug)
  const program = item ? getProgram(item.programSlug) : undefined
  if (!item || !program) notFound()

  return (
    <ProgramDetail
      program={{ ...program, slug: item.slug, title: item.title, summary: item.summary }}
      image={item.image}
      imageAlt={item.imageAlt}
    />
  )
}
