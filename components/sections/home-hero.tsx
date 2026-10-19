import Link from "next/link"

import { FadeIn } from "@/components/motion/fade-in"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"
import { ADMIN_ROUTES } from "@/lib/routes"
import { DOCS_URL } from "@/lib/site"

export function HomeHero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative w-full overflow-hidden bg-[#6e1835] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 80% 20%, rgba(163,219,223,0.28), transparent 55%), radial-gradient(ellipse 50% 60% at 10% 90%, rgba(0,0,0,0.25), transparent 50%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[32rem] w-full max-w-[1440px] flex-col justify-center px-4 pb-20 pt-28 sm:min-h-[40rem] sm:px-6 lg:aspect-[1440/858] lg:min-h-0 lg:px-20">
        <FadeIn onMount className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-white/80">
            <span aria-hidden>✦</span>
            {dict.home.heroEyebrow}
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-tight">
            {dict.home.heroTitlePrefix}{" "}
            <span className="italic text-tiffany-blue">{dict.home.heroTitleAccent}</span>{" "}
            {dict.home.heroTitleSuffix}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            {dict.home.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ADMIN_ROUTES.login}
              className="inline-flex h-[50px] items-center justify-center rounded-pill bg-tiffany-blue px-7 text-sm font-bold text-[#6e1835] transition-colors hover:bg-tiffany-blue/90"
            >
              {dict.home.heroPrimaryCta}
              <span aria-hidden className="ml-1.5">
                →
              </span>
            </Link>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[50px] items-center justify-center rounded-pill border border-white/40 px-7 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              {dict.home.heroSecondaryCta}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
