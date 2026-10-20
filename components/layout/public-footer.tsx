import { Mail, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { ROUTES } from "@/lib/routes"
import { siteContact, whatsappHref } from "@/lib/site-contact"

const links = [
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.sekolahAparatur, label: "Program" },
  { href: ROUTES.berita, label: "Informasi" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

export function PublicFooter() {
  const whatsapp = whatsappHref(
    "Yth. Panitia LPSDM Aparatur, saya ingin menanyakan informasi program Sekolah Aparatur.",
  )
  return (
    <footer className="bg-[var(--sa-navy)] text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Link href={ROUTES.home} className="inline-flex cursor-pointer">
            <Image
              src="/brand/logo-lpsdm.jpeg"
              alt="LPSDM Aparatur"
              width={48}
              height={64}
              className="h-12 w-auto rounded-md bg-white object-contain p-1"
            />
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/70">
            LPSDM Aparatur menyelenggarakan Program Sarjana Aparatur Daerah dan Desa serta Program Pascasarjana Sekolah
            Aparatur dan Legislator bersama universitas mitra.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-sm" aria-label="Footer">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="cursor-pointer text-white/70 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${siteContact.email}`}
            aria-label={`Surel ${siteContact.email}`}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Mail className="size-4" />
          </a>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp panitia"
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <MessageCircle className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-xs text-white/45 sm:px-6 lg:px-8">
        LPSDM Aparatur · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
