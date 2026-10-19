import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  compact?: boolean
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact
          ? "rounded-[1.75rem] border border-border/70 bg-muted/20 px-4 py-6"
          : "rounded-[1.75rem] border-2 border-dashed border-muted-foreground/30 bg-transparent px-4 py-10 sm:py-12",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted/80 ring-1 ring-border/60",
          compact ? "size-12" : "size-16",
        )}
      >
        <Icon
          className={cn("text-muted-foreground", compact ? "size-6" : "size-8")}
          strokeWidth={1.5}
        />
      </div>
      <h3
        className={cn(
          "mt-3 font-semibold text-foreground",
          compact ? "text-sm" : "mt-4 text-base",
        )}
      >
        {title}
      </h3>
      {description ? (
        <p
          className={cn(
            "mt-2 max-w-sm leading-relaxed text-muted-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className={cn(buttonVariants({ size: compact ? "sm" : "default" }), "mt-4 rounded-full px-6")}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
