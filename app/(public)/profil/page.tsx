import { BadgeCheck, BookOpen, Compass, GraduationCap, Handshake, Landmark, Laptop, LineChart, Scale, type LucideIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { PageHero } from "@/components/public/page-hero"
import { PartnersSection } from "@/components/public/partners-section"
import { legalBasis } from "@/data/programs"
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
      "LPSDM Aparatur merancang Sekolah Aparatur bersama universitas penyelenggara, PPDI, APDESI, serta asosiasi legislatif.",
  })
}

const misi: { icon: LucideIcon; text: string }[] = [
  {
    icon: GraduationCap,
    text: "Menyelenggarakan pendidikan tinggi yang unggul, inklusif, dan relevan pada jenjang sarjana, magister, dan doktor di bidang politik, pemerintahan, dan kebijakan publik.",
  },
  {
    icon: Laptop,
    text: "Merancang program melalui pendekatan pembelajaran adaptif dan hybrid learning.",
  },
  {
    icon: LineChart,
    text: "Mendorong riset kebijakan berbasis data dan kepentingan publik.",
  },
  {
    icon: Handshake,
    text: "Membangun ekosistem kolaboratif antara akademisi, praktisi, dan masyarakat sipil.",
  },
]

const latarBelakang = [
  { icon: Compass, title: "Indonesia Emas 2045", text: "Sumber daya manusia unggul sebagai prasyarat mutu pemerintahan." },
  { icon: Landmark, title: "Aparatur negara", text: "Kompetensi aparatur di pusat dan daerah melalui pendidikan formal." },
  { icon: Scale, title: "Legislator", text: "Penguatan kapasitas anggota DPR dan DPRD di bidang kebijakan publik." },
]

function GoldIcon({ icon: Icon, size = "md" }: { icon: LucideIcon; size?: "md" | "sm" }) {
  const box = size === "sm" ? "size-9 rounded-xl" : "size-12 rounded-2xl shadow-[0_8px_20px_rgba(255,190,89,0.45)]"
  const glyph = size === "sm" ? "size-4" : "size-6"
  return (
    <span className={`inline-flex shrink-0 items-center justify-center bg-[var(--sa-gold)] text-[var(--sa-navy)] ${box}`}>
      <Icon className={glyph} aria-hidden />
    </span>
  )
}

export default function ProfilPage() {
  return (
    <>
      <PageHero
        eyebrow="Profil lembaga"
        title="LPSDM Aparatur"
        description="Lembaga pengelola program Sekolah Aparatur bagi aparatur daerah, perangkat desa, dan legislator."
      />

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            <Image
              src="/profile/image-profile.webp"
              alt="Ilustrasi aparatur peserta program"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 36rem, 100vw"
            />
          </div>
          <div>
            <GoldIcon icon={Landmark} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Lembaga</h2>
            <p className="mt-4 text-base leading-7 text-[var(--sa-muted)]">
              LPSDM Aparatur merancang program secara akademik. Anggotanya terdiri atas akademisi dan praktisi di bidang ilmu politik, administrasi publik, administrasi negara, dan ilmu pemerintahan. Pelaksanaan perkuliahan dilakukan oleh universitas penyelenggara yang telah menjalin kerja sama.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <GoldIcon icon={BookOpen} />
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Latar belakang</h2>
          </div>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-[var(--sa-muted)]">
            <p>
              Menuju Visi Indonesia Emas 2045, ketersediaan sumber daya manusia unggul, khususnya aparatur negara di pusat dan daerah serta legislator di DPR dan DPRD, menjadi prasyarat mutu penyelenggaraan pemerintahan. Peningkatan kompetensi melalui kualifikasi pendidikan formal merupakan keniscayaan.
            </p>
            <p>
              Dalam demokrasi yang terus berkembang, masih terdapat kesenjangan antara kualitas yang diharapkan dan kapasitas nyata birokrasi serta aktor politik. Sekolah Aparatur dan Legislator hadir sebagai pendidikan tinggi jenjang magister dan doktor di bidang politik, pemerintahan, dan kebijakan publik, guna memperkuat kepemimpinan yang berpihak pada rakyat serta kebijakan yang berbasis bukti.
            </p>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {latarBelakang.map((item) => (
              <li key={item.title} className="flex gap-4">
                <GoldIcon icon={item.icon} size="sm" />
                <div>
                  <h3 className="font-semibold text-[var(--sa-navy)]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <GoldIcon icon={Compass} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Visi</h2>
            <p className="mt-4 text-base leading-7 text-[var(--sa-muted)]">
              Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam bidang kebirokrasian, legislasi, politik, dan kebijakan publik; memperkuat kapasitas kepemimpinan politik nasional; serta mendorong lahirnya kebijakan yang berpihak pada rakyat melalui pendidikan tinggi yang adaptif, berbasis riset, dan responsif terhadap tantangan zaman.
            </p>
          </div>
          <div>
            <GoldIcon icon={GraduationCap} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Misi</h2>
            <ul className="mt-6 flex flex-col gap-5">
              {misi.map((item) => (
                <li key={item.text} className="flex gap-3">
                  <GoldIcon icon={item.icon} size="sm" />
                  <p className="text-sm leading-6 text-[var(--sa-muted)]">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <GoldIcon icon={BadgeCheck} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Rekognisi Pembelajaran Lampau</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-[var(--sa-muted)]">
              <p>
                Rekognisi Pembelajaran Lampau (RPL) memberikan pengakuan atas capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja untuk diakui dalam pendidikan formal.
              </p>
              <p>
                Capaian pembelajaran dari perguruan tinggi sebelumnya dapat diakui melalui asesmen untuk keperluan transfer kredit. Capaian dari pengalaman kerja, pelatihan, dan pembelajaran mandiri diakui melalui asesmen dan rekognisi untuk memperoleh satuan kredit semester (SKS).
              </p>
              <p>Sarjana (S1) dan Magister (S2) diselenggarakan melalui jalur RPL. Doktor (S3) diselenggarakan melalui jalur reguler.</p>
            </div>
          </div>
          <div>
            <GoldIcon icon={Scale} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Dasar hukum</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {legalBasis.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--sa-muted)]">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--sa-gold)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <PartnersSection />
          <div className="mt-6">
            <Link
              href={ROUTES.sekolahAparatur}
              className="inline-flex cursor-pointer border-b-2 border-[var(--sa-gold)] pb-1 text-sm font-semibold text-[var(--sa-navy)]"
            >
              Lihat informasi program
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
