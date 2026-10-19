"use client"

import { Button } from "@/components/ui/button"

export type AdminPaginationProps = {
  page: number
  totalPages: number
  disabled?: boolean
  onPageChange: (page: number) => void
  countLabel?: string
  previousLabel?: string
  nextLabel?: string
  showPageFraction?: boolean
}

export function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  const total = Math.max(1, totalPages)
  const current = Math.min(Math.max(1, page), total)

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: (number | "ellipsis")[] = []
  const windowStart = Math.max(2, current - 1)
  const windowEnd = Math.min(total - 1, current + 1)

  items.push(1)

  if (windowStart > 2) {
    items.push("ellipsis")
  }

  for (let p = windowStart; p <= windowEnd; p++) {
    items.push(p)
  }

  if (windowEnd < total - 1) {
    items.push("ellipsis")
  }

  items.push(total)

  return items
}

export function AdminPagination({
  page,
  totalPages,
  disabled = false,
  onPageChange,
  countLabel,
  previousLabel = "Prev",
  nextLabel = "Next",
  showPageFraction = true,
}: AdminPaginationProps) {
  const safeTotal = Math.max(1, totalPages)
  const safePage = Math.min(Math.max(1, page), safeTotal)
  const pageItems = getPageItems(safePage, safeTotal)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {countLabel ? (
        <p className="text-sm text-muted-foreground">{countLabel}</p>
      ) : showPageFraction ? (
        <span className="text-sm text-muted-foreground">
          Page {safePage} / {safeTotal}
        </span>
      ) : (
        <span />
      )}
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={safePage <= 1 || disabled}
          onClick={() => onPageChange(safePage - 1)}
        >
          {previousLabel}
        </Button>
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1.5 text-sm text-muted-foreground select-none"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === safePage ? "default" : "outline"}
              size="sm"
              className="min-w-8 px-2"
              disabled={disabled}
              aria-current={item === safePage ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={safePage >= safeTotal || disabled}
          onClick={() => onPageChange(safePage + 1)}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
