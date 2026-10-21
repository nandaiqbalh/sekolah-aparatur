import { ArrowRight, BadgeCheck, Clock3, Laptop, Wallet, type LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { HeaderSection } from "@/components/public/header-section"
import { NewsCard } from "@/components/public/news-card"
import { PartnersSection } from "@/components/public/partners-section"
import { SectionHeader } from "@/components/public/section-header"
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

const strengthIcons: Record<string, LucideIcon> = {
  badge: BadgeCheck,
  clock: Clock3,
  laptop: Laptop,
  wallet: Wallet,
}

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

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-24">
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

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="Program Sarjana dan Pascasarjana Aparatur" />
          </Reveal>
          <div className="mt-12">
            <ProgramSpotlight />
          </div>
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <SectionHeader title={homeContent.strengthsTitle} />
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-[var(--sa-line)] sm:grid-cols-2">
              {homeContent.strengths.map((item) => {
                const Icon = strengthIcons[item.icon]
                return (
                <li key={item.title} className="bg-white p-7">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--sa-gold)] text-[var(--sa-navy)] shadow-[0_8px_20px_rgba(255,190,89,0.45)]">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{item.description}</p>
                </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="Informasi dan kegiatan" href={ROUTES.berita} action="Seluruh informasi" />
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

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Pertanyaan yang sering diajukan" />
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
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <PartnersSection />
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <Reveal>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <SectionHeader title="Hubungi panitia penerimaan" />
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
