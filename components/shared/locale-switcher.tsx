"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config"
import { setLocaleAction } from "@/lib/i18n/locale.actions"
import { switchLocalePath } from "@/lib/i18n/localized-href"
import { cn } from "@/lib/utils"

export function LocaleSwitcher({
  locale,
  className,
  variant = "default",
}: {
  locale: Locale
  className?: string
  variant?: "default" | "hero"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  function switchLocale(next: Locale) {
    if (next === locale) return
    const nextPath = switchLocalePath(pathname, next)
    startTransition(async () => {
      await setLocaleAction(next)
      if (pathname.startsWith("/admin")) {
        router.refresh()
        return
      }
      router.push(nextPath)
    })
  }

  return (
    <div
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-lg border p-0.5 text-xs font-medium",
        variant === "hero"
          ? "border-white/35 text-white"
          : "border-border",
        className
      )}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(code)}
          className={cn(
            "relative rounded-md px-2 py-1 uppercase cursor-pointer disabled:pointer-events-none disabled:opacity-50",
            locale === code
              ? variant === "hero"
                ? "bg-tiffany-blue text-[#6e1835]"
                : "bg-primary text-primary-foreground"
              : variant === "hero"
                ? "text-white/80 hover:text-white"
                : "text-foreground/80 hover:text-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
