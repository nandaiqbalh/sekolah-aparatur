import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { HeroMessages } from "@/components/public/hero-messages"
import { homeContent } from "@/data/home"
import { ROUTES, registrationPath } from "@/lib/routes"

const heroSlides = [
  { src: "/profile/hero-001.jpg", alt: "Kegiatan Sekolah Aparatur" },
  { src: "/profile/hero-002.jpg", alt: "Kegiatan Sekolah Aparatur" },
]

export function HeaderSection() {
  return (
    <section className="bg-[var(--sa-navy)]">
      <div className="relative min-h-[640px] lg:min-h-[760px]">
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div key={slide.src} className="hero-slide absolute inset-0" style={{ animationDelay: `${index * -5}s` }}>
              <Image src={slide.src} alt={slide.alt} fill priority={index === 0} className="object-cover" sizes="100vw" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        <Reveal className="relative mx-auto flex min-h-[640px] max-w-[1280px] items-start px-4 pt-48 pb-16 sm:px-6 lg:min-h-[760px] lg:px-8 lg:pt-56">
          <div className="w-full text-white">
            <HeroMessages messages={homeContent.heroMessages} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={registrationPath("daerah-dan-desa")}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[var(--sa-gold)] px-6 text-sm font-semibold text-[var(--sa-navy)]"
              >
                Pendaftaran peserta
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={ROUTES.sekolahAparatur}
                className="inline-flex h-12 cursor-pointer items-center rounded-full border border-white/70 px-6 text-sm font-semibold text-white hover:bg-white/10"
              >
                Informasi program
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
