import { whatsappHref } from "@/lib/site-contact"
import { cn } from "@/lib/utils"

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.9 11.9 0 0 0 5.75 1.46h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.43-8.43ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98.1-3.65-.23-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.9 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

const WHATSAPP_MESSAGE =
  "Yth. Panitia LPSDM Aparatur, saya ingin menanyakan informasi program Sekolah Aparatur."

export function WhatsappButton({
  number,
  className,
  label = "WhatsApp",
  onClick,
}: {
  number: string
  className?: string
  label?: string
  onClick?: () => void
}) {
  const href = whatsappHref(number, WHATSAPP_MESSAGE)

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
        <WhatsAppIcon />
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
    <a href={href} className={classNames} target="_blank" rel="noreferrer" onClick={onClick}>
      {inner}
    </a>
  )
}
