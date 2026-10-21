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
      <div className="relative min-h-[100svh]">
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div key={slide.src} className="hero-slide absolute inset-0" style={{ animationDelay: `${index * -5}s` }}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20" />
        <Reveal className="absolute inset-x-0 bottom-8 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:bottom-10 lg:px-8">
          <div className="w-full rounded-3xl border border-white/15 bg-black/40 px-5 py-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-7 sm:py-6">
            <HeroMessages messages={homeContent.heroMessages} />
            <div className="mt-6 flex flex-wrap gap-3">
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
