import { cn } from "@/lib/utils"

export function MediaPlaceholder({
  label,
  className,
  quiet = false,
}: {
  label: string
  className?: string
  quiet?: boolean
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center bg-[#d7e2ef] px-4 text-center text-sm text-[#3d5168]",
        className
      )}
    >
      {quiet ? <span className="sr-only">{label}</span> : label}
    </div>
  )
}
