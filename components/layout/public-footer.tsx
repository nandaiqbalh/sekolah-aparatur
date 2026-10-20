import { Mail } from "lucide-react"

import { WhatsAppIcon } from "@/components/public/whatsapp-button"
import Image from "next/image"
import Link from "next/link"

import { ROUTES } from "@/lib/routes"
import { siteContact, whatsappHref } from "@/lib/site-contact"

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.1C12.4 3 11 4.5 11 6.6v1.9H9v2.6h2V21h3.5v-9.9h2.3l.4-2.6h-2.7Z" />
    </svg>
  )
}

const links = [
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.sekolahAparatur, label: "Program" },
  { href: ROUTES.berita, label: "Informasi" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

const iconClassName =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"

export function PublicFooter() {
  const year = new Date().getFullYear()
  const whatsapp = whatsappHref(
    "Yth. Panitia LPSDM Aparatur, saya ingin menanyakan informasi program Sekolah Aparatur.",
  )
  const socials = [
    { href: `mailto:${siteContact.email}`, label: `Surel ${siteContact.email}`, external: false, icon: <Mail className="size-4" /> },
    ...(whatsapp
      ? [{ href: whatsapp, label: "WhatsApp panitia", external: true, icon: <WhatsAppIcon /> }]
      : []),
    { href: siteContact.instagram, label: "Instagram LPSDM Aparatur", external: true, icon: <InstagramIcon /> },
    { href: siteContact.facebook, label: "Facebook LPSDM Aparatur", external: true, icon: <FacebookIcon /> },
  ]

  return (
    <footer className="bg-[var(--sa-navy)] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.55fr)] lg:gap-x-10 lg:px-8">
        <div className="min-w-0">
          <Link
            href={ROUTES.home}
            className="relative block size-28 shrink-0 cursor-pointer overflow-hidden rounded-full bg-white"
          >
            <Image
              src="/brand/logo-lpsdm.png"
              alt="LPSDM Aparatur"
              fill
              sizes="112px"
              className="object-contain p-2"
            />
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/70">
            LPSDM Aparatur menyelenggarakan Program Sarjana dan Pascasarjana Aparatur.
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">{siteContact.address}</p>
        </div>

        <nav className="min-w-0" aria-label="Footer">
          <p className="text-sm font-semibold">Navigasi</p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm marker:text-white/40">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="cursor-pointer text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className="text-sm font-semibold">Ikuti Kami</p>
          <ul className="mt-3 flex w-fit gap-3">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={iconClassName}
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">
        © {year} LPSDM Aparatur. All rights reserved.
      </p>
    </footer>
  )
}
