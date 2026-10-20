import Image from "next/image"

import { homeContent } from "@/data/home"

export function PartnersSection() {
  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{homeContent.partnersTitle}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {homeContent.partners.map((partner) => (
          <li
            key={partner.name}
            className="flex min-w-0 items-center gap-4 rounded-[28px] bg-[var(--sa-canvas)] px-5 py-5 sm:gap-5 sm:px-8 sm:py-6"
          >
            <Image
              src={partner.logo}
              alt=""
              width={96}
              height={96}
              className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain p-1.5"
            />
            <div className="min-w-0">
              <p className="text-base font-semibold tracking-tight text-[var(--sa-navy)] sm:text-xl">{partner.name}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{partner.program}</p>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="mt-12 text-2xl font-semibold tracking-tight sm:text-3xl">{homeContent.facilitatorsTitle}</h3>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homeContent.facilitators.map((item) => (
          <li
            key={item.name}
            className="flex min-w-0 flex-col items-center rounded-[28px] bg-[var(--sa-canvas)] px-5 py-6 text-center"
          >
            <Image
              src={item.logo}
              alt={item.fullName}
              width={200}
              height={200}
              className="h-32 w-full object-contain"
            />
            <p className="mt-3 text-sm font-semibold leading-snug tracking-tight text-[var(--sa-navy)]">{item.fullName}</p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-[var(--sa-muted)]">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
