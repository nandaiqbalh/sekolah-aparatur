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
    <section>
      <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-2 sm:px-6 sm:pt-24 lg:px-8">
        <Reveal>
          {eyebrow ? <p className="text-sm text-[var(--sa-muted)]">{eyebrow}</p> : null}
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--sa-muted)]">{description}</p>
        </Reveal>
      </div>
    </section>
  )
}
