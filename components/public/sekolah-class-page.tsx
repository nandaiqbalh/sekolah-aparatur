import { notFound } from "next/navigation"

import { ProgramDetail } from "@/components/public/program-detail"
import { programService } from "@/features/program/services/program-service"
import { programPath } from "@/lib/routes"
import { jsonLdScript } from "@/lib/seo"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

export async function SekolahClassPage({ slug }: { slug: string }) {
  const program = await programService.getPublishedBySlug(slug)
  if (!program) notFound()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.summary,
    url: absoluteUrl(programPath(slug)),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <ProgramDetail program={program} />
    </>
  )
}
