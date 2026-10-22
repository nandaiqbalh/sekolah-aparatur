import Image from "next/image"
import Link from "next/link"

import { programService } from "@/features/program/services/program-service"
import { programPath, registrationPath } from "@/lib/routes"

export async function ProgramSpotlight() {
  const programs = await programService.listPublished()

  return (
    <ul className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
      {programs.map((item) => (
        <li
          key={item.slug}
          className="flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] bg-[var(--sa-canvas)]"
        >
          <div className="relative h-44 sm:h-48">
            <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>
          <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold tracking-tight break-words sm:text-2xl">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">{item.summary}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={programPath(item.slug)}
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
  )
}
