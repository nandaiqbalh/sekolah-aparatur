import Link from "next/link"

import { programs } from "@/data/programs"
import { ROUTES, registrationPath } from "@/lib/routes"

export function ProgramSpotlight() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 sm:items-stretch">
      {programs.map((program) => {
        const detailHref = program.slug === "legislator" ? ROUTES.legislator : ROUTES.daerahDesa

        return (
          <li
            key={program.slug}
            className="flex h-full min-w-0 flex-col rounded-[28px] bg-[var(--sa-canvas)] px-5 py-6 sm:px-8 sm:py-8"
          >
            <h3 className="text-lg font-semibold tracking-tight break-words sm:text-2xl">{program.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
              {program.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
              <Link
                href={detailHref}
                className="cursor-pointer text-[var(--sa-navy)] underline decoration-[var(--sa-gold)] decoration-2 underline-offset-4"
              >
                Rincian program
              </Link>
              <Link href={registrationPath(program.slug)} className="cursor-pointer text-[var(--sa-ink)]">
                Formulir pendaftaran
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
