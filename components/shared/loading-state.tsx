import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type LoadingStateProps = {
  message?: string
  variant?: "inline" | "card" | "page"
  skeletonCount?: number
  className?: string
}

function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-xl border border-border/50 bg-background/60 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="h-3.5 w-40 max-w-full rounded-md bg-muted" />
          <div className="h-2.5 w-28 max-w-full rounded-md bg-muted/80" />
        </div>
        <div className="h-3.5 w-14 shrink-0 rounded-md bg-muted" />
      </div>
    </div>
  )
}

export function LoadingState({
  message,
  variant = "card",
  skeletonCount = 0,
  className,
}: LoadingStateProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden />
        {message ? <span>{message}</span> : null}
      </div>
    )
  }

  if (variant === "page") {
    return (
      <div
        className={cn("flex flex-col items-center justify-center px-4 py-16 text-center", className)}
        role="status"
        aria-live="polite"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/80 ring-1 ring-border/60">
          <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
        </div>
        {message ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{message}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-muted-foreground/35 bg-muted/15 px-4 py-4 sm:py-5",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border/60">
          <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
      {skeletonCount > 0 ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
