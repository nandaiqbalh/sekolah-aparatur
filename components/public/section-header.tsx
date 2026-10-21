import Link from "next/link"

import { cn } from "@/lib/utils"

export function SectionHeader({
  title,
  href,
  action,
  className,
}: {
  title: string
  href?: string
  action?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {href && action ? (
        <Link href={href} className="shrink-0 cursor-pointer text-sm font-semibold">
          {action}
        </Link>
      ) : null}
    </div>
  )
}
