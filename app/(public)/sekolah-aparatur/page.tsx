import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
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
    description: "Dua program Sekolah Aparatur: daerah dan desa, serta legislator.",
  })
}

export default function ProgramIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Sekolah Aparatur"
        description="Sarjana aparatur daerah dan desa di UM Tapsel, serta pascasarjana aparatur dan legislator di Universitas Nasional."
      />
      <div className="bg-[var(--sa-canvas)] py-16">
        <ul className="mx-auto grid max-w-[1280px] gap-4 px-4 sm:px-6 lg:px-8">
          {programs.map((program, index) => (
            <li key={program.slug}>
              <Reveal delay={index * 0.1} className="grid gap-6 rounded-[28px] bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="font-heading text-3xl font-semibold tracking-tight">{program.title}</h2>
                <p className="mt-3 max-w-xl leading-7 text-[var(--sa-muted)]">{program.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <Link
                  href={program.slug === "legislator" ? ROUTES.legislator : ROUTES.daerahDesa}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[var(--sa-navy)] px-5 text-white"
                >
                  Baca detail
                  <ArrowRight className="size-4" />
                </Link>
                <Link href={registrationPath(program.slug)} className="inline-flex h-11 cursor-pointer items-center rounded-full bg-[var(--sa-gold)] px-5 text-[var(--sa-navy)]">
                  Pendaftaran
                </Link>
              </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
