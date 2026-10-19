import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type AdminTableCardProps = {
  children: ReactNode
  className?: string
  tableClassName?: string
}

export function AdminTableCard({ children, className, tableClassName }: AdminTableCardProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border bg-card", className)}>
      <table className={cn("w-full text-sm", tableClassName)}>{children}</table>
    </div>
  )
}

export function AdminTableHead({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn("bg-muted/50 text-left", className)}>{children}</thead>
}

export function AdminTableRow({
  children,
  className,
  ...props
}: ComponentProps<"tr">) {
  return (
    <tr className={cn("border-b border-border last:border-b-0", className)} {...props}>
      {children}
    </tr>
  )
}

export function AdminTableCell({
  children,
  className,
  align = "left",
  colSpan,
}: {
  children: ReactNode
  className?: string
  align?: "left" | "right" | "center"
  colSpan?: number
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-4 py-3",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  )
}

export function AdminTableHeaderCell({
  children,
  className,
  align = "left",
}: {
  children?: ReactNode
  className?: string
  align?: "left" | "right" | "center"
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 font-medium",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </th>
  )
}
