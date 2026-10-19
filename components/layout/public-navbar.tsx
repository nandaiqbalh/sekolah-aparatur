"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { LocaleSwitcher } from "@/components/shared/locale-switcher"
import type { Locale } from "@/lib/i18n/config"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { localizedPath, ADMIN_ROUTES } from "@/lib/routes"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

export function PublicNavbar({ locale }: { locale: Locale }) {
  const dict = useDictionary()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#about", label: dict.home.navAbout },
    { href: "#why-us", label: dict.home.navWhyUs },
    { href: "#faq", label: dict.home.navFaq },
  ]

  const solid = scrolled || open

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-background/90 text-foreground shadow-sm backdrop-blur-lg" : "text-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-20">
        <Link
          href={localizedPath(locale, "")}
          className="font-heading text-lg font-bold tracking-[0.18em]"
        >
          {SITE_NAME.replace(/\s+/g, " ").toUpperCase()}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-opacity hover:opacity-80">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher locale={locale} variant={solid ? "default" : "hero"} />
          <Link
            href={ADMIN_ROUTES.login}
            className={cn(
              "hidden h-9 items-center rounded-pill px-4 text-sm font-bold transition-colors sm:inline-flex",
              solid
                ? "bg-tiffany-blue text-[#6e1835] hover:bg-tiffany-blue/90"
                : "bg-tiffany-blue text-[#6e1835] hover:bg-tiffany-blue/90",
            )}
          >
            {dict.home.navAdmin}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? dict.home.closeMenu : dict.home.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background px-4 py-4 text-foreground lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link href={ADMIN_ROUTES.login} onClick={() => setOpen(false)}>
              {dict.home.navAdmin}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
