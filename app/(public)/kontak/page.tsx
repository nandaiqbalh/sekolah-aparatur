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
    description: "Telepon, surel, dan WhatsApp LPSDM Aparatur untuk informasi serta pendaftaran.",
  })
}

const rows = [
  { label: "Telepon", value: siteContact.phones.join("\n") },
  { label: "Email", value: siteContact.email },
  { label: "Situs", value: siteContact.website },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi Sekolah Aparatur"
        description="Nomor dan surel ini tercantum di profil LPSDM Aparatur. Formulir di halaman ini belum menyimpan pesan."
      />
      <div className="bg-[var(--sa-canvas)]">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
        <Reveal>
        <section className="rounded-[28px] bg-white p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-semibold">Kanal resmi</h2>
          <dl className="mt-8 divide-y divide-[var(--sa-line)] border-t border-[var(--sa-line)]">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="text-sm font-semibold">{row.label}</dt>
                <dd className="text-sm leading-6 whitespace-pre-line text-[var(--sa-muted)]">
                  {row.label === "Situs" ? (
                    <a href={row.value} className="cursor-pointer underline" target="_blank" rel="noreferrer">
                      {row.value.replace("https://", "")}
                    </a>
                  ) : row.label === "Email" ? (
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
            <WhatsappButton className="rounded-full" label="Chat WhatsApp" />
          </div>
        </section>
        </Reveal>
        <Reveal delay={0.12} y={80}>
        <section className="rounded-[28px] bg-white p-6 sm:p-8">
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
