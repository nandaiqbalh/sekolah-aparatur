import Image from "next/image"
import type { ReactNode } from "react"

import { SectionHeader } from "@/components/public/section-header"
import { homeContent } from "@/data/home"
import { partnerService } from "@/features/mitra/services/partner-service"

function repeat<T>(items: T[], times: number) {
  return Array.from({ length: times }, () => items).flat()
}

function LogoTrack<T extends { name: string }>({
  label,
  direction,
  items,
  render,
  labelOf,
}: {
  label: string
  direction: "left" | "right"
  items: T[]
  render: (item: T) => ReactNode
  labelOf?: (item: T) => string
}) {
  const loop = repeat(items, 4)

  return (
    <div
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      role="region"
      aria-label={label}
    >
      <div
        className={
          direction === "left"
            ? "flex w-max animate-marquee motion-reduce:hidden"
            : "flex w-max animate-marquee-reverse motion-reduce:hidden"
        }
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-start gap-16 pr-16" aria-hidden>
            {loop.map((item, index) => (
              <div key={`${item.name}-${index}`}>{render(item)}</div>
            ))}
          </div>
        ))}
      </div>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.name}>{labelOf ? labelOf(item) : item.name}</li>
        ))}
      </ul>
      <ul className="hidden list-none motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-8">
        {items.map((item) => (
          <li key={item.name}>{render(item)}</li>
        ))}
      </ul>
    </div>
  )
}

export async function PartnersSection() {
  const [universities, facilitators] = await Promise.all([
    partnerService.listPublished("university"),
    partnerService.listPublished("facilitator"),
  ])

  return (
    <div>
      <SectionHeader title={homeContent.mitraTitle} />
      <div className="mt-5 flex flex-col gap-6">
        <LogoTrack
          label={homeContent.partnersTitle}
          direction="left"
          items={universities}
          labelOf={(partner) => (partner.detail ? `${partner.name}. ${partner.detail}` : partner.name)}
          render={(partner) => (
            <div className="flex w-56 shrink-0 flex-col items-center text-center">
              <Image src={partner.logo} alt="" width={72} height={72} className="h-14 w-14 object-contain" />
              <p className="mt-3 text-sm font-semibold tracking-tight text-[var(--sa-navy)]">{partner.name}</p>
              {partner.detail ? (
                <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{partner.detail}</p>
              ) : null}
            </div>
          )}
        />
        <LogoTrack
          label={homeContent.facilitatorsTitle}
          direction="right"
          items={facilitators}
          labelOf={(item) => (item.detail ? `${item.detail}, ${item.name}` : item.name)}
          render={(item) => (
            <div className="flex w-52 shrink-0 flex-col items-center text-center">
              <Image src={item.logo} alt="" width={96} height={96} className="h-16 w-full object-contain" />
              <p className="mt-3 text-sm font-semibold leading-snug tracking-tight text-[var(--sa-navy)]">{item.detail}</p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-[var(--sa-muted)]">{item.name}</p>
            </div>
          )}
        />
      </div>
    </div>
  )
}
