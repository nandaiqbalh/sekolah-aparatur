import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/public/page-hero"
import { programs } from "@/data/programs"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, registrationPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.sekolahAparatur,
    title: "Sekolah Aparatur",
    description:
      "Program Sarjana Aparatur Daerah dan Desa serta Program Pascasarjana Sekolah Aparatur dan Legislator.",
  })
}

export default function ProgramIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Sekolah Aparatur"
        description="Program Sarjana Aparatur Daerah dan Desa serta Program Pascasarjana Sekolah Aparatur dan Legislator, diselenggarakan bersama universitas mitra."
      />
      <div className="bg-white py-12 lg:py-16">
        <ul className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 sm:px-6 lg:px-8">
          {programs.map((program) => (
            <li key={program.slug} className="rounded-[28px] bg-[var(--sa-canvas)] px-6 py-8 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-2xl">
                    {program.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
                    {program.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-5 text-sm font-semibold">
                  <Link
                    href={program.slug === "legislator" ? ROUTES.legislator : ROUTES.daerahDesa}
                    className="cursor-pointer text-[var(--sa-navy)] underline decoration-[var(--sa-gold)] decoration-2 underline-offset-4"
                  >
                    Rincian program
                  </Link>
                  <Link href={registrationPath(program.slug)} className="cursor-pointer text-[var(--sa-ink)]">
                    Formulir pendaftaran
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
