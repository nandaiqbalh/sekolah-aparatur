import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"

import { ROUTES } from "@/lib/routes"
import { SITE_NAME } from "@/lib/site"

const groups = [
  {
    title: "Lembaga",
    links: [
      { href: ROUTES.profil, label: "Profil" },
      { href: ROUTES.kontak, label: "Kontak" },
    ],
  },
  {
    title: "Program",
    links: [
      { href: ROUTES.sekolahAparatur, label: "Semua program" },
      { href: ROUTES.daerahDesa, label: "Daerah dan Desa" },
      { href: ROUTES.legislator, label: "Legislator" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { href: ROUTES.berita, label: "Berita" },
      { href: ROUTES.galeri, label: "Galeri" },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="bg-[var(--sa-navy)] text-white">
      <Reveal y={80} className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
            Informasi program pendidikan dan pelatihan aparatur. Konten yang belum resmi ditandai sebagai placeholder.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold">{group.title}</p>
            <ul className="mt-3 grid gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="cursor-pointer text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1280px] px-4 py-4 text-xs text-white/55 sm:px-6 lg:px-8">
          {SITE_NAME}. Pratinjau situs publik.
        </p>
      </div>
    </footer>
  )
}
