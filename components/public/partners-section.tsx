import Image from "next/image"

import { SectionHeader } from "@/components/public/section-header"
import { homeContent } from "@/data/home"

export function PartnersSection() {
  return (
    <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeader title={homeContent.partnersTitle} />
        <ul className="mt-8 flex flex-col gap-6">
          {homeContent.partners.map((partner) => (
            <li key={partner.name} className="flex min-w-0 items-center gap-4">
              <Image
                src={partner.logo}
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight text-[var(--sa-navy)]">{partner.name}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{partner.program}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SectionHeader title={homeContent.facilitatorsTitle} />
        <ul className="mt-8 grid grid-cols-2 gap-6">
          {homeContent.facilitators.map((item) => (
            <li key={item.name} className="flex min-w-0 flex-col items-center text-center">
              <Image
                src={item.logo}
                alt={item.fullName}
                width={96}
                height={96}
                className="h-16 w-full object-contain"
              />
              <p className="mt-3 text-sm font-semibold leading-snug tracking-tight text-[var(--sa-navy)]">{item.fullName}</p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-[var(--sa-muted)]">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
