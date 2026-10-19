import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { ProgramSpotlight } from "@/components/public/program-spotlight"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { galleryItems } from "@/data/gallery"
import { homeContent } from "@/data/home"
import { newsArticles, formatArticleDate } from "@/data/news"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES, newsPath, registrationPath } from "@/lib/routes"
import { jsonLdScript } from "@/lib/seo"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

const heroSlides = [
  { src: "/profile/daerah-000.png", alt: "Sambutan mahasiswa baru Program Sarjana Aparatur Desa" },
  { src: "/profile/unas-002.png", alt: "Kelas Legislator 2025" },
  { src: "/profile/daerah-002.png", alt: "Kuliah umum aparatur desa, 26 April 2024" },
]

export default async function Home() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: dict.meta.description,
    inLanguage: "id-ID",
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />

      <section className="bg-[var(--sa-navy)]">
        <div className="relative min-h-[640px] lg:min-h-[760px]">
          <div className="absolute inset-0 overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div key={slide.src} className="hero-slide absolute inset-0" style={{ animationDelay: `${index * -3.3}s` }}>
                <Image src={slide.src} alt={slide.alt} fill priority={index === 0} className="object-cover" sizes="100vw" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
          <Reveal className="relative mx-auto flex min-h-[640px] max-w-[1280px] items-start px-4 pt-48 pb-16 sm:px-6 lg:min-h-[760px] lg:px-8 lg:pt-56">
            <div className="w-full text-white">
              <p className="inline-flex rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white">
                LPSDM Aparatur
              </p>
              <h1 className="mt-5 max-w-none font-heading text-[clamp(2.8rem,5.4vw,4.6rem)] leading-[1.02] font-semibold tracking-tight">
                {homeContent.heroTitle}
              </h1>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={registrationPath("daerah-dan-desa")}
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[var(--sa-gold)] px-6 text-sm font-semibold text-[var(--sa-navy)]"
                >
                  Pendaftaran
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={ROUTES.sekolahAparatur}
                  className="inline-flex h-12 cursor-pointer items-center rounded-full border border-white/70 px-6 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Lihat program
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Reveal>
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative h-80 overflow-hidden rounded-2xl sm:h-[28rem]">
              <Image
                src="/profile/daerah-004.png"
                alt="Kelas program sarjana aparatur"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40rem, 100vw"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--sa-blue)]">Sekolah Aparatur</p>
              <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-5xl sm:leading-[1.1]">
                {homeContent.introTitle}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[var(--sa-muted)]">{homeContent.introDescription}</p>
              <Link
                href={ROUTES.profil}
                className="mt-8 inline-flex h-12 cursor-pointer items-center gap-2 border-b-2 border-[var(--sa-gold)] text-sm font-semibold text-[var(--sa-navy)]"
              >
                Baca profil
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">{homeContent.strengthsTitle}</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-[var(--sa-line)] sm:grid-cols-2">
              {homeContent.strengths.map((item, index) => (
                <li key={item.title} className="bg-white p-7">
                  <p className="text-sm font-semibold text-[var(--sa-blue)]">0{index + 1}</p>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Daerah dan desa, serta legislator</h2>
          </Reveal>
          <div className="mt-12">
            <ProgramSpotlight />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Galeri pilihan</h2>
            <Link href={ROUTES.galeri} className="cursor-pointer text-sm font-semibold text-[var(--sa-navy)]">
              Buka galeri
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {galleryItems.slice(0, 3).map((item, index) => (
              <li key={item.id}>
                <Reveal y={80} delay={index * 0.1}>
                  <Link href={ROUTES.galeri} className="block cursor-pointer overflow-hidden rounded-[28px] bg-[var(--sa-canvas)]">
                    <span className="relative block h-56">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(min-width: 640px) 33vw, 100vw" />
                    </span>
                    <span className="block px-4 py-4">
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-[var(--sa-muted)]">{item.date}</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--sa-navy)] py-16 text-white lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">{homeContent.stepsTitle}</h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2">
              {homeContent.steps.map((step, index) => (
                <li key={step.title} className="border-t border-white/20 pt-5">
                  <p className="text-sm font-semibold text-[var(--sa-gold)]">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Berita terbaru</h2>
            <Link href={ROUTES.berita} className="cursor-pointer text-sm font-semibold">
              Semua berita
            </Link>
          </Reveal>
          <ul className="mt-8 grid gap-4">
            {newsArticles.slice(0, 3).map((article) => (
              <li key={article.slug} className="rounded-[28px] bg-white px-6 py-6">
                <Link href={newsPath(article.slug)} className="grid cursor-pointer gap-2 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <p className="text-sm text-[var(--sa-muted)]">{formatArticleDate(article.publishedAt)}</p>
                  <div>
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--sa-muted)]">{article.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pertanyaan umum</h2>
            <Accordion className="mt-8 border-t border-[var(--sa-line)]">
              {homeContent.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-b border-black/8 last:border-b-0">
                  <AccordionTrigger className="cursor-pointer py-5 text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--sa-muted)]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <h2 className="font-heading text-4xl leading-tight font-semibold">Hubungi lembaga</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--sa-ink)]">
                Hubungi PMB LPSDM Aparatur lewat WhatsApp +62 822-4962-1229, atau buka halaman kontak untuk nomor dan surel lain.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <WhatsappButton className="rounded-full" />
                <Link
                  href={ROUTES.kontak}
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[var(--sa-gold)] px-6 text-sm font-semibold text-[var(--sa-navy)]"
                >
                  Formulir kontak
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] bg-[var(--sa-canvas)] p-8">
              <p className="text-sm leading-7 text-[var(--sa-muted)]">
                Surel lpsdm.aparatur@gmail.com. Telepon lain tercantum di halaman kontak.
              </p>
              <Link
                href={ROUTES.sekolahAparatur}
                className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white"
              >
                Mulai dari halaman program
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
