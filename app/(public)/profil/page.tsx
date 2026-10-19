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
    description: "LPSDM Aparatur merancang Sekolah Aparatur bersama universitas mitra, PPDI, dan APDESI.",
  })
}

const sections = [
  {
    title: "Lembaga",
    body: "LPSDM Aparatur merancang program secara akademik. Anggotanya akademisi dan praktisi ilmu politik, administrasi publik, administrasi negara, dan ilmu pemerintahan. Perkuliahan dijalankan universitas mitra.",
  },
  {
    title: "Latar",
    body: "Otonomi daerah menggerakkan pembangunan, tetapi ketersediaan SDM aparatur belum sebanding. Profil daerah dan desa mengutip data 2022: 4,39 persen penduduk berpendidikan strata satu. Profil pascasarjana menempatkan penguatan aparatur dan legislator sebagai bagian dari jalan menuju Indonesia Emas 2045.",
  },
  {
    title: "Visi",
    body: "Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam kebirokrasian, legislasi, politik, dan kebijakan publik, serta mendorong kebijakan yang berpihak pada rakyat.",
  },
  {
    title: "Misi",
    body: "Menyelenggarakan pendidikan tinggi yang relevan bagi aparatur dan legislator, dengan pembelajaran hybrid, riset kebijakan berbasis data, dan kerja sama akademisi, praktisi, serta masyarakat sipil.",
  },
  {
    title: "Mitra",
    body: "Program sarjana daerah dan desa didukung PPDI dan APDESI, serta diselenggarakan Universitas Muhammadiyah Tapanuli Selatan. Program pascasarjana aparatur dan legislator diselenggarakan Universitas Nasional, dengan dukungan asosiasi dewan perwakilan rakyat pusat dan daerah.",
  },
]

export default function ProfilPage() {
  return (
    <>
      <PageHero
        eyebrow="Profil"
        title="LPSDM Aparatur"
        description="Lembaga yang merancang Sekolah Aparatur untuk aparatur daerah, perangkat desa, dan legislator."
      />
      <div className="bg-[var(--sa-canvas)] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.08}>
              <section className="h-full rounded-[28px] bg-white p-6">
                <h2 className="font-heading text-2xl font-semibold">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--sa-muted)]">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  )
}
