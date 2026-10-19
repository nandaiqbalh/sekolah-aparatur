"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

import { ROUTES } from "@/lib/routes"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

const links = [
  { href: ROUTES.home, label: "Beranda" },
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.berita, label: "Berita" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

const programLinks = [
  { href: ROUTES.daerahDesa, label: "Daerah dan Desa" },
  { href: ROUTES.legislator, label: "Legislator" },
]

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

const pillLink =
  "cursor-pointer rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white"

export function PublicNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const programActive = pathname.startsWith(ROUTES.sekolahAparatur)

  return (
    <header className="sticky top-0 z-40 bg-[var(--sa-navy)] text-white">
      <div className="relative mx-auto flex h-[4.75rem] max-w-[1280px] items-center px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="cursor-pointer text-base font-semibold tracking-tight">
          {SITE_NAME}
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-black/25 p-1 lg:flex"
          aria-label="Utama"
        >
          {links.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(pillLink, isCurrent(pathname, link.href) && "bg-white/10 text-white")}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              className={cn(
                "inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white",
                programActive && "bg-white/10 text-white"
              )}
              aria-expanded={programsOpen}
              aria-haspopup="true"
              onClick={() => setProgramsOpen((value) => !value)}
            >
              Sekolah Aparatur
              <ChevronDown className="size-4" aria-hidden />
            </button>
            {programsOpen ? (
              <div className="absolute top-full left-1/2 z-20 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#1a2740] p-2 text-white shadow-lg">
                <Link
                  href={ROUTES.sekolahAparatur}
                  className="block cursor-pointer rounded-full px-3 py-2 text-sm hover:bg-white/10"
                  onClick={() => setProgramsOpen(false)}
                >
                  Semua program
                </Link>
                {programLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block cursor-pointer rounded-full px-3 py-2 text-sm hover:bg-white/10"
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
              className={cn(pillLink, isCurrent(pathname, link.href) && "bg-white/10 text-white")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ROUTES.sekolahAparatur}
          className="ml-auto hidden h-11 cursor-pointer items-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--sa-navy)] lg:inline-flex"
        >
          Pendaftaran
        </Link>

        <button
          type="button"
          className="ml-auto inline-flex size-10 cursor-pointer items-center justify-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden" aria-label="Menu mobile">
          <div className="mx-auto grid max-w-[1280px] gap-1">
            {links.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer rounded-full px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <p className="px-4 pt-3 text-xs font-semibold tracking-wide text-white/50">Sekolah Aparatur</p>
            <Link
              href={ROUTES.sekolahAparatur}
              className="cursor-pointer rounded-full px-4 py-2 text-sm hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Semua program
            </Link>
            {programLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer rounded-full px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {links.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer rounded-full px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ROUTES.sekolahAparatur}
              className="mt-2 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--sa-navy)]"
              onClick={() => setOpen(false)}
            >
              Pendaftaran
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}
