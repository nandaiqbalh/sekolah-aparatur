import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description?: ReactNode
  backHref?: string
  onBack?: () => void
  backLabel?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  backHref,
  onBack,
  backLabel,
  actions,
  className,
}: AdminPageHeaderProps) {
  const showBack = Boolean(backLabel && (onBack || backHref))
  const backClassName = "inline-flex items-center gap-1.5 text-sm text-primary hover:underline"

  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1">
        {showBack ? (
          onBack ? (
            <button type="button" onClick={onBack} className={backClassName}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </button>
          ) : (
            <Link href={backHref!} className={backClassName}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          )
        ) : null}
        <h1 className={cn("text-2xl font-semibold", showBack && "mt-2")}>{title}</h1>
        {description ? (
          <div className="text-sm text-muted-foreground">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
