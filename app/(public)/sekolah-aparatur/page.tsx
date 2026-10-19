import type { Metadata } from "next"
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
        description="Pilih program sesuai peran peserta. Kurikulum, jadwal, dan biaya resmi belum ditampilkan sebagai angka final."
      />
      <div className="mx-auto max-w-[1280px] px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        <ul className="divide-y divide-[var(--sa-line)] border-t border-[var(--sa-line)]">
          {programs.map((program, index) => (
            <li key={program.slug}>
              <Reveal delay={index * 0.1} className="grid gap-6 py-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">{program.title}</h2>
                <p className="mt-3 max-w-xl leading-7 text-[var(--sa-muted)]">{program.summary}</p>
              </div>
              <div className="flex gap-5 text-sm font-semibold">
                <Link
                  href={program.slug === "legislator" ? ROUTES.legislator : ROUTES.daerahDesa}
                  className="cursor-pointer text-[var(--sa-blue)]"
                >
                  Baca detail
                </Link>
                <Link href={registrationPath(program.slug)} className="cursor-pointer">
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
