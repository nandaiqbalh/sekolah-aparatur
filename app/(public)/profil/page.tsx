import type { Metadata } from "next"
import Link from "next/link"

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
    description:
      "LPSDM Aparatur merancang Sekolah Aparatur bersama universitas mitra, PPDI, APDESI, serta asosiasi legislatif.",
  })
}

const bodyHtml = `
<h2>Lembaga</h2>
<p>LPSDM Aparatur merancang program secara akademik. Anggotanya terdiri atas akademisi dan praktisi di bidang ilmu politik, administrasi publik, administrasi negara, dan ilmu pemerintahan. Pelaksanaan perkuliahan dilakukan oleh universitas mitra yang telah menjalin kerja sama.</p>
<h2>Latar belakang</h2>
<p>Sejak diterapkannya kebijakan otonomi daerah, pembangunan di tingkat daerah mengalami kemajuan, namun belum sepenuhnya ditopang oleh ketersediaan sumber daya manusia yang memadai.</p>
<p>Data tahun 2022 menunjukkan hanya 4,39 persen penduduk Indonesia berpendidikan Strata Satu (S-1). Di sisi lain, menuju Visi Indonesia Emas 2045, peningkatan kualifikasi formal aparatur negara dan legislator menjadi keniscayaan.</p>
<h2>Visi</h2>
<p>Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam bidang kebirokrasian, legislasi, politik, dan kebijakan publik; memperkuat kapasitas kepemimpinan politik nasional; serta mendorong lahirnya kebijakan yang berpihak pada rakyat melalui pendidikan tinggi yang adaptif, berbasis riset, dan responsif terhadap tantangan zaman.</p>
<h2>Misi</h2>
<ul>
<li>Menyelenggarakan pendidikan tinggi yang unggul, inklusif, dan relevan pada jenjang sarjana, magister, dan doktor di bidang politik, pemerintahan, dan kebijakan publik.</li>
<li>Merancang program melalui pendekatan pembelajaran adaptif dan hybrid learning.</li>
<li>Mendorong riset kebijakan berbasis data dan kepentingan publik.</li>
<li>Membangun ekosistem kolaboratif antara akademisi, praktisi, dan masyarakat sipil.</li>
</ul>
<h2>Mitra</h2>
<ul>
<li>Persatuan Perangkat Desa Indonesia (PPDI)</li>
<li>Asosiasi Pemerintah Desa Seluruh Indonesia (APDESI)</li>
<li>Universitas Muhammadiyah Tapanuli Selatan</li>
<li>Universitas Nasional</li>
<li>Asosiasi dewan perwakilan rakyat pusat dan daerah</li>
</ul>
`.trim()

export default function ProfilPage() {
  return (
    <>
      <PageHero
        eyebrow="Profil lembaga"
        title="LPSDM Aparatur"
        description="Lembaga pengelola program Sekolah Aparatur bagi aparatur daerah, perangkat desa, dan legislator."
      />

      <div className="bg-white py-12 lg:py-16">
        <article
          className="program-content mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <div className="mx-auto mt-8 max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Link
            href={ROUTES.sekolahAparatur}
            className="inline-flex cursor-pointer border-b-2 border-[var(--sa-gold)] pb-1 text-sm font-semibold text-[var(--sa-navy)]"
          >
            Lihat informasi program
          </Link>
        </div>
      </div>
    </>
  )
}
