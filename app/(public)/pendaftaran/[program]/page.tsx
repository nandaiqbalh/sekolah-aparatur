import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/public/page-hero"
import { getProgram, programs } from "@/data/programs"
import { RegistrationForm } from "@/features/registration/components/registration-form"
import { getLocale } from "@/lib/i18n/get-locale"
import { registrationPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ program: string }>
}

export function generateStaticParams() {
  return programs.map((program) => ({ program: program.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { program: slug } = await params
  const program = getProgram(slug)
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: registrationPath(slug),
    title: program ? `Pendaftaran ${program.title}` : "Pendaftaran",
    description: "Formulir pendaftaran pratinjau. Data tidak dikirim ke server.",
  })
}

export default async function RegistrationPage({ params }: PageProps) {
  const { program: slug } = await params
  const program = getProgram(slug)
  if (!program) notFound()

  return (
    <>
      <PageHero
        eyebrow="Pendaftaran"
        title={program.title}
        description="Program terkunci dari tautan. Unggahan berkas hanya tampilan dan tidak disimpan."
      />
      <div className="mx-auto max-w-xl px-4 pt-12 pb-24 sm:px-6">
        <Reveal y={80}>
          <RegistrationForm programSlug={program.slug} />
        </Reveal>
      </div>
    </>
  )
}
