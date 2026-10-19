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
    description: "Kontak Sekolah Aparatur. Kanal yang belum dikonfirmasi tidak ditampilkan sebagai data aktif.",
  })
}

const rows = [
  { label: "Alamat", value: siteContact.address },
  { label: "Telepon", value: siteContact.phone },
  { label: "Email", value: siteContact.email },
  { label: "Jam layanan", value: siteContact.hours },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Hubungi Sekolah Aparatur"
        description="Formulir memeriksa isian di peramban. Pesan tidak dikirim ke server pada tahap ini."
      />
      <div className="mx-auto grid max-w-[1280px] gap-16 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
        <Reveal>
        <section>
          <h2 className="text-2xl font-semibold">Kanal resmi</h2>
          <dl className="mt-8 divide-y divide-[var(--sa-line)] border-t border-[var(--sa-line)]">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
                <dt className="text-sm font-semibold">{row.label}</dt>
                <dd className="text-sm leading-6 text-[var(--sa-muted)]">
                  {row.value ?? "Belum tersedia"}
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
        <section>
          <h2 className="text-2xl font-semibold">Kirim pesan</h2>
          <div className="mt-8 max-w-xl">
            <ContactForm />
          </div>
        </section>
        </Reveal>
      </div>
    </>
  )
}
