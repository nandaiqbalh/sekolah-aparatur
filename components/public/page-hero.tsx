import { Reveal } from "@/components/motion/reveal"

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description: string
}) {
  return (
    <section className="bg-[var(--sa-navy)] text-white">
      <Reveal>
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {eyebrow ? <p className="text-sm font-semibold text-[var(--sa-gold)]">{eyebrow}</p> : null}
          <h1 className="mt-4 max-w-3xl border-l-4 border-[var(--sa-gold)] pl-5 text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl pl-6 text-base leading-7 text-white/75">{description}</p>
        </div>
      </Reveal>
    </section>
  )
}
