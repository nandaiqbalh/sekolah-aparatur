import type { Metadata } from "next"

import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/public/page-hero"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.profil,
    title: "Profil",
    description: "Profil lembaga Sekolah Aparatur. Narasi resmi masih placeholder.",
  })
}

const sections = [
  {
    title: "Latar belakang",
    body: "Teks ini placeholder. Latar belakang pendirian, dasar hukum, dan posisi lembaga akan ditulis setelah naskah resmi tersedia.",
  },
  {
    title: "Visi",
    body: "Visi resmi belum dicantumkan. Kalimat visi tidak dikarang agar tidak terbaca sebagai pernyataan lembaga.",
  },
  {
    title: "Misi",
    body: "Misi resmi menyusul. Sementara, situs hanya menjelaskan bahwa program ditujukan untuk aparatur daerah, perangkat desa, dan legislator.",
  },
  {
    title: "Struktur",
    body: "Bagan pengurus dan narasumber belum ditampilkan karena nama dan jabatan belum dikonfirmasi.",
  },
]

export default function ProfilPage() {
  return (
    <>
      <PageHero
        eyebrow="Profil"
        title="Mengenal Sekolah Aparatur"
        description="Halaman ini menyiapkan ruang untuk narasi lembaga. Bagian yang belum final ditandai agar tidak dianggap fakta resmi."
      />
      <div className="mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        {sections.map((section, index) => (
          <Reveal key={section.title} delay={index * 0.08}>
            <section className="grid gap-3 border-t border-[var(--sa-line)] py-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="max-w-2xl leading-7 text-[var(--sa-muted)]">{section.body}</p>
            </section>
          </Reveal>
        ))}
      </div>
    </>
  )
}
