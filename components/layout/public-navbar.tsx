"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ChevronDown, Menu, Phone, X } from "lucide-react"

import { ROUTES } from "@/lib/routes"
import { SITE_NAME } from "@/lib/site"
import { whatsappHref } from "@/lib/site-contact"
import { cn } from "@/lib/utils"

const links = [
  { href: ROUTES.home, label: "Beranda" },
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.berita, label: "Berita" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

const programLinks = [
  { href: ROUTES.sekolahAparatur, label: "Semua program" },
  { href: ROUTES.daerahDesa, label: "Daerah dan Desa" },
  { href: ROUTES.legislator, label: "Legislator" },
]

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function PublicNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const downDistance = useRef(0)
  const whatsapp = whatsappHref("Halo, saya ingin bertanya tentang Sekolah Aparatur.")
  const programActive = pathname.startsWith(ROUTES.sekolahAparatur)

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
    setProgramsOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    lastY.current = window.scrollY
    function onScroll() {
      const y = window.scrollY
      const delta = y - lastY.current
      if (y < 24) {
        setHidden(false)
        downDistance.current = 0
      } else if (delta > 0) {
        downDistance.current += delta
        if (downDistance.current > 72) {
          setHidden(true)
          setOpen(false)
          setProgramsOpen(false)
        }
      } else if (delta < -4) {
        downDistance.current = 0
        setHidden(false)
      }
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const ctaClassName =
    "inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[var(--sa-navy)] py-1 pr-5 pl-1.5 text-sm font-semibold text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"

  const ctaInner = (
    <>
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--sa-gold)] text-[var(--sa-navy)]">
        <Phone className="size-4" />
      </span>
      WhatsApp
    </>
  )

  const linkClassName = (active: boolean) =>
    cn(
      "cursor-pointer rounded-full px-3 py-1.5 text-sm text-[var(--sa-muted)] hover:bg-[var(--sa-canvas)] hover:text-[var(--sa-navy)]",
      active && "bg-[var(--sa-navy)] font-semibold text-white hover:bg-[var(--sa-navy)] hover:text-white",
    )

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-3 z-50 px-3 transition-transform duration-500 ease-out motion-reduce:transition-none sm:px-4",
          hidden && !open && "-translate-y-[140%]",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 rounded-full bg-white px-2 text-[var(--sa-navy)] shadow-[0_10px_30px_rgba(16,25,43,0.14)] sm:px-3">
          <Link href={ROUTES.home} className="cursor-pointer font-heading text-lg font-semibold tracking-tight">
            {SITE_NAME}
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 text-[15px] lg:flex" aria-label="Utama">
            {links.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={linkClassName(isCurrent(pathname, link.href))}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className={cn(linkClassName(programActive), "inline-flex cursor-pointer items-center gap-1")}
                aria-expanded={programsOpen}
                aria-haspopup="true"
                onClick={() => setProgramsOpen((value) => !value)}
              >
                Sekolah Aparatur
                <ChevronDown className="size-4" aria-hidden />
              </button>
              {programsOpen ? (
                <div className="absolute top-full left-1/2 z-20 mt-3 w-64 -translate-x-1/2 rounded-[20px] bg-white p-2 text-[var(--sa-navy)] shadow-xl">
                  {programLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block cursor-pointer rounded-xl px-3 py-2 text-sm hover:bg-[var(--sa-canvas)]"
                      onClick={() => setProgramsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {links.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={linkClassName(isCurrent(pathname, link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noreferrer" className={cn(ctaClassName, "hidden sm:inline-flex")}>
                {ctaInner}
              </a>
            ) : null}
            <button
              type="button"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-[var(--sa-canvas)] lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <button
          type="button"
          className={cn("absolute inset-0 cursor-pointer bg-transparent", open ? "opacity-100" : "opacity-0")}
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
        />
        <nav
          className={cn(
            "absolute inset-x-3 top-[5.25rem] mx-auto flex max-h-[calc(100svh-6.5rem)] max-w-[1280px] flex-col gap-1 overflow-y-auto rounded-[2rem] bg-white p-3 text-sm font-medium text-[var(--sa-navy)] shadow-[0_10px_30px_rgba(16,25,43,0.14)] transition-transform duration-300 ease-out motion-reduce:transition-none sm:inset-x-4",
            open ? "translate-y-0" : "-translate-y-4",
          )}
        >
          {links.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-full px-4 py-2 hover:bg-[var(--sa-canvas)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <p className="px-4 pt-2 text-xs font-semibold text-[var(--sa-muted)]">Sekolah Aparatur</p>
          {programLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-full px-4 py-2 hover:bg-[var(--sa-canvas)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {links.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-full px-4 py-2 hover:bg-[var(--sa-canvas)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className={cn(ctaClassName, "mt-2")} onClick={() => setOpen(false)}>
              {ctaInner}
            </a>
          ) : null}
        </nav>
      </div>
    </>
  )
}
