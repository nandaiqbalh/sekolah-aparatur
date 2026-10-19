import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AdminStatCardProps = {
  label: string
  value: ReactNode
  hint?: ReactNode
  emphasis?: "primary" | "secondary"
  className?: string
}

export function AdminStatCard({
  label,
  value,
  hint,
  emphasis = "primary",
  className,
}: AdminStatCardProps) {
  const secondary = emphasis === "secondary"

  return (
    <Card className={cn(secondary && "bg-muted/30 shadow-none", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("font-semibold", secondary ? "text-lg" : "text-2xl")}>{value}</p>
        {hint ? <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  )
}
