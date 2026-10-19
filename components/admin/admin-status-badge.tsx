import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AdminStatusBadge({
  isActive,
  activeLabel,
  inactiveLabel,
  className,
}: {
  isActive: boolean
  activeLabel: string
  inactiveLabel: string
  className?: string
}) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "border-0",
        isActive
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "bg-muted text-muted-foreground hover:bg-muted",
        className,
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  )
}
