import { MessageCircle } from "lucide-react"

import { whatsappHref } from "@/lib/site-contact"
import { cn } from "@/lib/utils"

export function WhatsappButton({
  className,
  label = "WhatsApp",
}: {
  className?: string
  label?: string
}) {
  const href = whatsappHref("Halo, saya ingin bertanya tentang Sekolah Aparatur.")
  const classNames = cn(
    "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold",
    href
      ? "cursor-pointer bg-[#128C7E] text-white"
      : "cursor-not-allowed bg-[#d5dee8] text-[#5c6775]",
    className
  )

  if (!href) {
    return (
      <button type="button" disabled className={classNames}>
        <MessageCircle className="size-4" aria-hidden />
        {label}
        <span className="sr-only">Nomor WhatsApp resmi belum tersedia.</span>
      </button>
    )
  }

  return (
    <a href={href} className={classNames} target="_blank" rel="noreferrer">
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </a>
  )
}
