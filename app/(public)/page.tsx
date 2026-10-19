import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { MediaPlaceholder } from "@/components/public/media-placeholder"
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
import { ROUTES, newsPath } from "@/lib/routes"
import { jsonLdScript } from "@/lib/seo"
import { SITE_NAME, absoluteUrl } from "@/lib/site"

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

      <section className="bg-[var(--sa-navy)] text-white">
        <div className="mx-auto flex min-h-[calc(100svh-4.75rem)] max-w-[1280px] flex-col items-center justify-center px-4 pb-24 pt-10 text-center sm:px-6 lg:px-8">
          <Reveal className="mb-12 flex items-end justify-center gap-4" y={40}>
            <span className="h-16 w-24 -skew-x-12 rounded-2xl bg-[#1d4f91]/80" aria-hidden />
            <span className="h-24 w-36 -skew-x-12 rounded-2xl bg-[#3d7cc4]" aria-hidden />
            <span className="h-14 w-20 -skew-x-12 rounded-2xl bg-[#7eb0e0]/80" aria-hidden />
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-[4.75rem] lg:leading-[1.05]">
              {homeContent.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{homeContent.heroDescription}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              {homeContent.introTitle}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-[var(--sa-muted)]">
              {homeContent.introDescription}
            </p>
            <Link
              href={ROUTES.profil}
              className="mt-8 inline-flex h-12 cursor-pointer items-center rounded-full border border-[var(--sa-ink)]/15 px-6 text-sm font-semibold"
            >
              Baca profil lembaga
            </Link>
          </Reveal>
          <Reveal y={80} delay={0.12}>
            <MediaPlaceholder label="Suasana ruang belajar" className="h-[280px] rounded-[1.75rem] sm:h-[420px]" />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f3f5f8]">
        <div className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Dua program utama</h2>
            <p className="mt-4 text-base leading-7 text-[var(--sa-muted)]">
              Pilih program sesuai peran peserta. Jadwal dan biaya resmi belum ditampilkan sebagai angka final.
            </p>
          </Reveal>
          <div className="mt-14">
            <ProgramSpotlight />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
              {homeContent.strengthsTitle}
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {homeContent.strengths.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 0.1}>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--sa-muted)]">{item.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Berita terbaru</h2>
            <Link href={ROUTES.berita} className="cursor-pointer text-sm font-semibold text-[var(--sa-blue)]">
              Semua berita
            </Link>
          </Reveal>
          <ul className="mt-10 divide-y divide-[var(--sa-line)]">
            {newsArticles.slice(0, 3).map((article, index) => (
              <li key={article.slug}>
                <Reveal delay={index * 0.08}>
                <Link href={newsPath(article.slug)} className="grid cursor-pointer gap-2 py-8 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <p className="text-sm text-[var(--sa-muted)]">{formatArticleDate(article.publishedAt)}</p>
                  <div>
                    <h3 className="text-xl font-semibold">{article.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--sa-muted)]">{article.summary}</p>
                  </div>
                </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-24 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Galeri pilihan</h2>
            <Link href={ROUTES.galeri} className="cursor-pointer text-sm font-semibold text-[var(--sa-blue)]">
              Buka galeri
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {galleryItems.slice(0, 3).map((item, index) => (
              <li key={item.id}>
                <Reveal y={80} delay={index * 0.1}>
                <Link href={ROUTES.galeri} className="block cursor-pointer">
                  <MediaPlaceholder quiet label={item.title} className="h-56 rounded-[1.75rem]" />
                  <p className="mt-4 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--sa-muted)]">{item.date}</p>
                </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-24 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{homeContent.stepsTitle}</h2>
          </Reveal>
          <ol className="mt-16 grid gap-12 text-left sm:grid-cols-3">
            {homeContent.steps.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 0.12}>
                  <p className="text-sm font-semibold text-[var(--sa-muted)]">0{index + 1}</p>
                  <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--sa-muted)]">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={0.2}>
          <Link
            href={ROUTES.sekolahAparatur}
            className="mt-12 inline-flex h-12 cursor-pointer items-center rounded-full border border-[var(--sa-ink)]/15 px-6 text-sm font-semibold"
          >
            Mulai dari halaman program
          </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Hubungi lembaga</h2>
            <p className="mt-4 max-w-md leading-7 text-[var(--sa-muted)]">
              Kanal resmi yang belum diisi tidak ditampilkan sebagai nomor aktif. Pesan lewat formulir kontak, atau WhatsApp setelah nomor dikonfirmasi.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WhatsappButton className="rounded-full" />
              <Link
                href={ROUTES.kontak}
                className="inline-flex h-11 cursor-pointer items-center rounded-full border border-[var(--sa-ink)]/15 px-5 text-sm font-semibold"
              >
                Formulir kontak
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Pertanyaan umum</h2>
            <Accordion className="mt-6">
              {homeContent.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-b border-[var(--sa-line)]">
                  <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--sa-muted)]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  )
}
