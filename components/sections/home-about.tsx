import { Layers3, Languages, ShieldCheck } from "lucide-react"

import { FadeIn } from "@/components/motion/fade-in"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function HomeAbout({ dict }: { dict: Dictionary }) {
  const points = [
    { icon: Layers3, title: dict.home.aboutPoint1Title, desc: dict.home.aboutPoint1Desc },
    { icon: Languages, title: dict.home.aboutPoint2Title, desc: dict.home.aboutPoint2Desc },
    { icon: ShieldCheck, title: dict.home.aboutPoint3Title, desc: dict.home.aboutPoint3Desc },
  ]

  return (
    <section id="about" className="bg-background py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-20">
        <FadeIn>
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]"
            aria-hidden
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #6e1835 0%, #3d0d1d 48%, #111 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 80% 18%, rgba(163,219,223,0.45), transparent 58%), radial-gradient(ellipse 40% 50% at 12% 88%, rgba(255,255,255,0.12), transparent 50%)",
              }}
            />
            <div className="absolute inset-8 rounded-[1.5rem] border border-white/15" />
            <p className="absolute bottom-10 left-10 max-w-[12ch] font-heading text-4xl font-bold leading-none text-white sm:text-5xl">
              App Router
              <span className="mt-2 block italic text-tiffany-blue">Prisma RBAC</span>
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-burgundy">
            <span aria-hidden>✦</span>
            <span className="tracking-normal">{dict.home.aboutEyebrow}</span>
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[#111] sm:text-5xl">
            {dict.home.aboutTitlePrefix}{" "}
            <span className="italic text-burgundy">{dict.home.aboutTitleAccent}</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#5a5a5a] sm:text-base">
            {dict.home.aboutDescription}
          </p>
          <div className="mt-8 grid gap-4">
            {points.map((point) => (
              <article key={point.title} className="flex gap-4">
                <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-tiffany-blue text-[#6e1835]">
                  <point.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#111]">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5a5a5a]">{point.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
