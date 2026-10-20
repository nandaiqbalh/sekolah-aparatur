import Link from "next/link"

import { sekolahClasses } from "@/data/sekolah-classes"
import { ROUTES, registrationPath } from "@/lib/routes"

const classHref: Record<string, string> = {
  "aparatur-pemerintah": ROUTES.aparaturPemerintah,
  "aparatur-desa": ROUTES.aparaturDesa,
  legislator: ROUTES.legislator,
}

export function ProgramSpotlight() {
  return (
    <ul className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
      {sekolahClasses.map((item) => (
        <li
          key={item.slug}
          className="flex h-full min-w-0 flex-col rounded-[28px] bg-[var(--sa-canvas)] px-5 py-6 sm:px-8 sm:py-8"
        >
          <h3 className="text-lg font-semibold tracking-tight break-words sm:text-2xl">{item.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">{item.summary}</p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
            <Link
              href={classHref[item.slug]}
              className="cursor-pointer text-[var(--sa-navy)] underline decoration-[var(--sa-gold)] decoration-2 underline-offset-4"
            >
              Rincian program
            </Link>
            <Link href={registrationPath(item.slug)} className="cursor-pointer text-[var(--sa-ink)]">
              Formulir pendaftaran
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
