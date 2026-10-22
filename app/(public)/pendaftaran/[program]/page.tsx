import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/public/page-hero"
import { PartnersSection } from "@/components/public/partners-section"
import { RegistrationForm } from "@/features/registration/components/registration-form"
import { programService } from "@/features/program/services/program-service"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { registrationPath } from "@/lib/routes"
import { buildPageMetadata, fillSeoTemplate } from "@/lib/seo"

type PageProps = {
  params: Promise<{ program: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { program: slug } = await params
  const program = await programService.getPublishedBySlug(slug)
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: registrationPath(slug),
    title: program
      ? fillSeoTemplate(dict.meta.registrationTitle, { title: program.title })
      : dict.meta.registrationFallbackTitle,
    description: program
      ? fillSeoTemplate(dict.meta.registrationDescription, { title: program.title })
      : dict.meta.registrationFallbackDescription,
    keywords: dict.meta.keywords,
  })
}

export default async function RegistrationPage({ params }: PageProps) {
  const { program: slug } = await params
  const programs = await programService.listPublished()
  const program = programs.find((item) => item.slug === slug)
  if (!program) notFound()

  return (
    <>
      <PageHero
        eyebrow="Pendaftaran peserta"
        title={program.title}
        description="Pilih program pada formulir. Data yang diisi akan disimpan dan tim Sekolah Aparatur akan menghubungi Anda."
      />
      <div className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] bg-[var(--sa-canvas)] px-5 py-6 sm:px-6">
            <RegistrationForm
              programSlug={program.slug}
              options={programs.map((item) => ({ slug: item.slug, title: item.title }))}
            />
          </div>
          <div className="mt-8">
            <PartnersSection />
          </div>
        </div>
      </div>
    </>
  )
}
