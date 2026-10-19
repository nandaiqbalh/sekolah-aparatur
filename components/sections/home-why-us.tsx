import { FadeIn } from "@/components/motion/fade-in"
import type { Dictionary } from "@/lib/i18n/dictionaries/en"

export function HomeWhyUs({ dict }: { dict: Dictionary }) {
  const points = [
    { title: dict.home.whyUsPoint1Title, desc: dict.home.whyUsPoint1Desc },
    { title: dict.home.whyUsPoint2Title, desc: dict.home.whyUsPoint2Desc },
    { title: dict.home.whyUsPoint3Title, desc: dict.home.whyUsPoint3Desc },
  ]

  return (
    <section id="why-us" className="relative overflow-hidden bg-burgundy-dark py-16 text-white sm:py-24">
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-20">
        <FadeIn className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-medium text-white/90">
              <span aria-hidden>✦</span>
              {dict.home.whyUsEyebrow}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-5xl">
              {dict.home.whyUsTitlePrefix}{" "}
              <span className="italic text-tiffany-blue">{dict.home.whyUsTitleAccent}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base lg:text-right">
            {dict.home.whyUsDescription}
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {points.map((point) => (
            <FadeIn key={point.title}>
              <article className="flex h-full flex-col rounded-3xl bg-white p-7 text-foreground shadow-sm sm:p-8">
                <h3 className="font-heading text-2xl font-bold text-[#111]">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5a5a5a]">{point.desc}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
