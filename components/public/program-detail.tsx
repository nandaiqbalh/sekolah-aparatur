import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { PageHero } from "@/components/public/page-hero"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import type { Program } from "@/data/programs"
import { programBodyHtml } from "@/lib/program-html"
import { registrationPath } from "@/lib/routes"

export function ProgramDetail({ program }: { program: Program }) {
  return (
    <>
      <PageHero eyebrow="Program" title={program.title} description={program.summary} />

      <div className="bg-white py-12 lg:py-16">
        <article
          className="program-content mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: programBodyHtml(program) }}
        />
      </div>

      <section className="bg-[var(--sa-canvas)] py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pendaftaran mahasiswa baru</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
              Informasi mengenai penerimaan mahasiswa baru dapat disampaikan kepada LPSDM Aparatur melalui WhatsApp
              atau melalui formulir pendaftaran pada situs ini.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <WhatsappButton label="WhatsApp" />
              <Link
                href={registrationPath(program.slug)}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-[var(--sa-navy)] bg-white px-6 text-sm font-semibold text-[var(--sa-navy)] hover:bg-[var(--sa-navy)] hover:text-white"
              >
                Formulir pendaftaran
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
