import type { Metadata } from "next"

import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/public/page-hero"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import { ContactForm } from "@/features/contact/components/contact-form"
import { getLocale } from "@/lib/i18n/get-locale"
import { ROUTES } from "@/lib/routes"
import { buildPageMetadata } from "@/lib/seo"
import { siteContact } from "@/lib/site-contact"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    path: ROUTES.kontak,
    title: "Kontak",
    description: "Telepon, surel, dan WhatsApp panitia LPSDM Aparatur untuk informasi program dan pendaftaran.",
  })
}

const rows = [
  { label: "Telepon", value: siteContact.phones.join("\n") },
  { label: "Surel", value: siteContact.email },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi panitia LPSDM Aparatur"
        description="Nomor telepon, surel, dan formulir untuk menghubungi panitia LPSDM Aparatur."
      />
      <div className="bg-[var(--sa-canvas)]">
      <div className="mx-auto grid max-w-[1280px] gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8 lg:py-10">
        <Reveal>
        <section className="rounded-[28px] bg-white p-5 sm:p-6">
          <h2 className="font-heading text-2xl font-semibold">Kontak resmi</h2>
          <dl className="mt-5 divide-y divide-[var(--sa-line)] border-t border-[var(--sa-line)]">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="text-sm font-semibold">{row.label}</dt>
                <dd className="text-sm leading-6 whitespace-pre-line text-[var(--sa-muted)]">
                  {row.label === "Surel" ? (
                    <a href={`mailto:${row.value}`} className="cursor-pointer underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <WhatsappButton className="rounded-full" label="WhatsApp panitia" />
          </div>
        </section>
        </Reveal>
        <Reveal delay={0.12}>
        <section className="rounded-[28px] bg-white p-5 sm:p-6">
          <h2 className="font-heading text-2xl font-semibold">Kirim pesan</h2>
          <div className="mt-8 max-w-xl">
            <ContactForm />
          </div>
        </section>
        </Reveal>
      </div>
      </div>
    </>
  )
}
