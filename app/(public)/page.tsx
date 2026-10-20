import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { HeaderSection } from "@/components/public/header-section"
import { NewsCard } from "@/components/public/news-card"
import { PartnersSection } from "@/components/public/partners-section"
import { ProgramSpotlight } from "@/components/public/program-spotlight"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { homeContent } from "@/data/home"
import { newsArticles } from "@/data/news"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
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

      <HeaderSection />

      <section className="bg-white py-16 lg:py-24">
        <Reveal>
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
              <Image
                src="/profile/image-profile.webp"
                alt="Aparatur peserta program di depan peta"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 36rem, 100vw"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--sa-blue)]">Program Sarjana dan Pascasarjana Aparatur</p>
              <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-5xl sm:leading-[1.1]">
                {homeContent.introTitle}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[var(--sa-muted)]">{homeContent.introDescription}</p>
              <Link
                href={ROUTES.profil}
                className="mt-8 inline-flex h-12 cursor-pointer items-center gap-2 border-b-2 border-[var(--sa-gold)] text-sm font-semibold text-[var(--sa-navy)]"
              >
                Profil lembaga
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

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Program Sarjana dan Pascasarjana Aparatur
            </h2>
          </Reveal>
          <div className="mt-12">
            <ProgramSpotlight />
          </div>
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Informasi dan kegiatan</h2>
            <Link href={ROUTES.berita} className="cursor-pointer text-sm font-semibold">
              Seluruh informasi
            </Link>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-4">
            {newsArticles.slice(0, 3).map((article) => (
              <li key={article.slug}>
                <NewsCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white pt-16 pb-6 lg:pt-20 lg:pb-8">
        <Reveal>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pertanyaan yang sering diajukan</h2>
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

      <section className="bg-white pt-4 pb-10 lg:pt-6 lg:pb-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <PartnersSection />
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hubungi panitia penerimaan</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
                Informasi mengenai penerimaan mahasiswa baru dapat disampaikan kepada LPSDM Aparatur melalui WhatsApp
                atau halaman kontak.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <WhatsappButton label="WhatsApp" />
                <Link
                  href={ROUTES.kontak}
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-[var(--sa-navy)] bg-white px-6 text-sm font-semibold text-[var(--sa-navy)] hover:bg-[var(--sa-navy)] hover:text-white"
                >
                  Halaman kontak
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
