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
      <div className="mx-auto max-w-[1280px] px-4 pt-28 pb-6 sm:px-6 lg:px-8 lg:pt-32 lg:pb-8">
        {eyebrow ? <p className="text-xs font-semibold tracking-wide text-[var(--sa-gold)] uppercase">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-snug">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-[0.95rem] sm:leading-7">{description}</p>
      </div>
    </section>
  )
}
