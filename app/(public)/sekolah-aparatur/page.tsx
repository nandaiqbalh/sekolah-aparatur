import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/public/page-hero"
import { sekolahClasses } from "@/data/sekolah-classes"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, registrationPath } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

const classHref: Record<string, string> = {
  "aparatur-pemerintah": ROUTES.aparaturPemerintah,
  "aparatur-desa": ROUTES.aparaturDesa,
  legislator: ROUTES.legislator,
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.sekolahAparatur,
    title: "Program Sarjana dan Pascasarjana Aparatur",
    description:
      "Kelas Aparatur Pemerintah Daerah, Kelas Aparatur Desa, dan Kelas Legislator.",
  })
}

export default function ProgramIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Program Sarjana dan Pascasarjana Aparatur"
        description="Kelas Aparatur Pemerintah Daerah, Kelas Aparatur Desa, dan Kelas Legislator, diselenggarakan bersama universitas penyelenggara melalui jalur Rekognisi Pembelajaran Lampau (RPL)."
      />
      <div className="bg-white py-12 lg:py-16">
        <ul className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 sm:px-6 lg:px-8">
          {sekolahClasses.map((item) => (
            <li key={item.slug} className="min-w-0 rounded-[28px] bg-[var(--sa-canvas)] px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight break-words text-[var(--sa-navy)] sm:text-2xl">
                    {item.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--sa-muted)] sm:text-base">{item.summary}</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-56">
                  <Link
                    href={classHref[item.slug]}
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[var(--sa-navy)] px-5 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Rincian program
                  </Link>
                  <Link
                    href={registrationPath(item.slug)}
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full border border-[var(--sa-navy)] bg-white px-5 text-sm font-semibold text-[var(--sa-navy)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--sa-navy)] hover:text-white hover:shadow-lg"
                  >
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
