import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/public/page-hero"
import { PartnersSection } from "@/components/public/partners-section"
import { getProgram, programs } from "@/data/programs"
import { getSekolahClass, sekolahClasses } from "@/data/sekolah-classes"
import { RegistrationForm } from "@/features/registration/components/registration-form"
import { getLocale } from "@/lib/i18n/get-locale"
import { registrationPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

type PageProps = {
  params: Promise<{ program: string }>
}

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...programs.map((program) => program.slug),
    ...sekolahClasses.map((item) => item.slug),
  ])
  return [...slugs].map((program) => ({ program }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { program: slug } = await params
  const kelas = getSekolahClass(slug)
  const program = kelas ? getProgram(kelas.programSlug) : getProgram(slug)
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: registrationPath(slug),
    title: kelas ? `Pendaftaran ${kelas.title}` : program ? `Pendaftaran ${program.title}` : "Pendaftaran",
    description: "Formulir pendaftaran peserta Sekolah Aparatur.",
  })
}

export default async function RegistrationPage({ params }: PageProps) {
  const { program: slug } = await params
  const kelas = getSekolahClass(slug)
  const program = kelas ? getProgram(kelas.programSlug) : getProgram(slug)
  if (!program) notFound()

  return (
    <>
      <PageHero
        eyebrow="Pendaftaran peserta"
        title={kelas?.title ?? "Pendaftaran peserta"}
        description="Pilih program pada formulir. Data yang diisi akan disimpan dan tim Sekolah Aparatur akan menghubungi Anda."
      />
      <div className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-[var(--sa-canvas)] px-6 py-8 sm:px-8">
            <RegistrationForm programSlug={kelas?.slug ?? slug} />
          </div>
          <div className="mt-14">
            <PartnersSection />
          </div>
        </div>
      </div>
    </>
  )
}
