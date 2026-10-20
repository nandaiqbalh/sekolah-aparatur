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
  const href = whatsappHref(
    "Yth. Panitia LPSDM Aparatur, saya ingin menanyakan informasi program Sekolah Aparatur.",
  )

  const classNames = cn(
    "inline-flex h-12 items-center gap-2 rounded-full py-1 pr-5 pl-1.5 text-sm font-semibold transition duration-300 ease-out",
    href
      ? "cursor-pointer bg-[var(--sa-navy)] text-white hover:-translate-y-0.5 hover:shadow-lg"
      : "cursor-not-allowed bg-[#d5dee8] text-[#5c6775]",
    className,
  )

  const inner = (
    <>
      <span
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full",
          href ? "bg-[var(--sa-gold)] text-[var(--sa-navy)]" : "bg-white/50 text-[#5c6775]",
        )}
      >
        <MessageCircle className="size-4" aria-hidden />
      </span>
      {label}
    </>
  )

  if (!href) {
    return (
      <button type="button" disabled className={classNames}>
        {inner}
        <span className="sr-only">Nomor WhatsApp resmi belum tersedia.</span>
      </button>
    )
  }

  return (
    <a href={href} className={classNames} target="_blank" rel="noreferrer">
      {inner}
    </a>
  )
}
