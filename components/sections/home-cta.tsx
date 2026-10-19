import Link from "next/link"

import { FadeIn } from "@/components/motion/fade-in"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import { ADMIN_ROUTES } from "@/lib/routes"

export function HomeCta({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative w-full overflow-hidden bg-burgundy-dark">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 90% 50%, rgba(163,219,223,0.22), transparent 55%)",
        }}
      />
      <div className="relative mx-auto flex min-h-[12rem] w-full max-w-[1440px] items-center px-4 py-12 sm:px-6 lg:aspect-[1440/292] lg:min-h-0 lg:px-20">
        <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <FadeIn className="max-w-[49rem]">
            <h2 className="font-heading text-[clamp(1.75rem,3.9vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
              <span className="block">{dict.home.ctaTitleLine1}</span>
              <span className="block">
                {dict.home.ctaTitleLine2Prefix}{" "}
                <span className="italic text-tiffany-blue">{dict.home.ctaTitleBrand}</span>
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.06} className="shrink-0">
            <Link
              href={ADMIN_ROUTES.login}
              className="inline-flex h-[50px] min-w-[203px] items-center justify-center rounded-pill bg-tiffany-blue px-6 text-sm font-bold text-[#6e1835] transition-colors hover:bg-tiffany-blue/90"
            >
              {dict.home.ctaButton}
              <span aria-hidden className="ml-1.5">
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
