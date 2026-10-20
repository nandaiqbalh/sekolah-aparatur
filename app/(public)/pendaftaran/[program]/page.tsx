import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
    description: "Formulir pendaftaran peserta. Data belum dikirim ke server pada tahap ini.",
  })
}

export default async function RegistrationPage({ params }: PageProps) {
  const { program: slug } = await params
  const program = getProgram(slug)
  if (!program) notFound()

  return (
    <>
      <PageHero
        eyebrow="Pendaftaran peserta"
        title={program.title}
        description="Program dipilih sesuai tautan yang dibuka. Unggahan dokumen pada tahap ini belum disimpan di server."
      />
      <div className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-[var(--sa-canvas)] px-6 py-8 sm:px-8">
            <RegistrationForm programSlug={program.slug} />
          </div>
        </div>
      </div>
    </>
  )
}
