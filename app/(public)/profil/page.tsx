import { BadgeCheck, BookOpen, Compass, GraduationCap, Handshake, Landmark, Laptop, LineChart, Scale, type LucideIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/public/page-hero"
import { PartnersSection } from "@/components/public/partners-section"
import { institutionProfileService } from "@/features/profil/services/institution-profile-service"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"

const LATAR_ICONS = [Compass, Landmark, Scale]
const MISI_ICONS = [GraduationCap, Laptop, LineChart, Handshake]

function GoldIcon({ icon: Icon, size = "md" }: { icon: LucideIcon; size?: "md" | "sm" }) {
  const box = size === "sm" ? "size-9 rounded-xl" : "size-12 rounded-2xl shadow-[0_8px_20px_rgba(255,190,89,0.45)]"
  const glyph = size === "sm" ? "size-4" : "size-6"
  return (
    <span className={`inline-flex shrink-0 items-center justify-center bg-[var(--sa-gold)] text-[var(--sa-navy)] ${box}`}>
      <Icon className={glyph} aria-hidden />
    </span>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: ROUTES.profil,
    title: dict.meta.profile.title,
    description: dict.meta.profile.description,
    keywords: dict.meta.keywords,
  })
}

export default async function ProfilPage() {
  const profile = await institutionProfileService.get()
  if (!profile) notFound()

  return (
    <>
      <PageHero
        eyebrow={profile.heroEyebrow}
        title={profile.heroTitle}
        description={profile.heroDescription}
      />

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            <Image
              src={profile.lembagaImage}
              alt="Ilustrasi aparatur peserta program"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 36rem, 100vw"
            />
          </div>
          <div>
            <GoldIcon icon={Landmark} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Lembaga</h2>
            <p className="mt-4 text-base leading-7 text-[var(--sa-muted)]">{profile.lembagaBody}</p>
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
            {profile.latarBelakangParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {profile.latarBelakangPoints.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <GoldIcon icon={LATAR_ICONS[index % LATAR_ICONS.length]} size="sm" />
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
            <p className="mt-4 text-base leading-7 text-[var(--sa-muted)]">{profile.visi}</p>
          </div>
          <div>
            <GoldIcon icon={GraduationCap} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Misi</h2>
            <ul className="mt-6 flex flex-col gap-5">
              {profile.misi.map((text, index) => (
                <li key={text} className="flex gap-3">
                  <GoldIcon icon={MISI_ICONS[index % MISI_ICONS.length]} size="sm" />
                  <p className="text-sm leading-6 text-[var(--sa-muted)]">{text}</p>
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
              {profile.rplParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <GoldIcon icon={Scale} />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--sa-navy)]">Dasar hukum</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {profile.legalBasis.map((item) => (
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
