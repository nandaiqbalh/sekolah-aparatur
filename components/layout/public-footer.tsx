import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { ROUTES } from "@/lib/routes"
import { SITE_NAME } from "@/lib/site"
import { siteContact, whatsappHref } from "@/lib/site-contact"

const company = [
  { href: ROUTES.profil, label: "Profil" },
  { href: ROUTES.sekolahAparatur, label: "Semua program" },
  { href: ROUTES.daerahDesa, label: "Daerah dan Desa" },
  { href: ROUTES.legislator, label: "Legislator" },
  { href: ROUTES.berita, label: "Berita" },
  { href: ROUTES.galeri, label: "Galeri" },
  { href: ROUTES.kontak, label: "Kontak" },
]

export function PublicFooter() {
  const whatsapp = whatsappHref("Halo, saya ingin bertanya tentang Sekolah Aparatur.")

  return (
    <footer className="bg-[var(--sa-navy)] text-white">
      <Reveal>
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
          <div>
            <Link href={ROUTES.home} className="cursor-pointer font-heading text-lg font-semibold tracking-tight">
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              LPSDM Aparatur. Program sarjana daerah dan desa serta pascasarjana aparatur dan legislator.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Halaman</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
              {company.map((link) => (
                <Link key={link.href} href={link.href} className="cursor-pointer hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Kontak</p>
            <a href={`mailto:${siteContact.email}`} className="mt-4 block cursor-pointer text-sm text-white/70 hover:text-white">
              {siteContact.email}
            </a>
            {siteContact.phones.map((phone) => (
              <p key={phone} className="mt-2 text-sm text-white/70">
                {phone}
              </p>
            ))}
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 inline-flex cursor-pointer text-sm text-[var(--sa-gold)] hover:text-white">
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
        <p className="border-t border-white/10 px-4 py-5 text-xs text-white/45 sm:px-6 lg:px-8">
          <Link href={ROUTES.home} className="cursor-pointer hover:text-white">
            {SITE_NAME}
          </Link>
          {" · "}
          {new Date().getFullYear()}
        </p>
      </Reveal>
    </footer>
  )
}
