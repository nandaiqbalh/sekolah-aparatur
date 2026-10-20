import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function InfoStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>
}

export function InfoCard({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--sa-line)] bg-white px-6 py-6 pl-7 sm:px-8 sm:py-8 sm:pl-9">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--sa-gold)]" />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="text-xs font-semibold tracking-wide text-[var(--sa-gold)]">
          {String(index).padStart(2, "0")}
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--sa-navy)] sm:text-xl">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-7 text-[var(--sa-muted)] sm:text-base sm:leading-8">{children}</div>
    </section>
  )
}

export function InfoProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
