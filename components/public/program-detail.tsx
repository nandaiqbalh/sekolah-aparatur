import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { DocumentList } from "@/components/public/document-list"
import { PageHero } from "@/components/public/page-hero"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Program } from "@/data/programs"
import { registrationPath } from "@/lib/routes"

export function ProgramDetail({ program }: { program: Program }) {
  return (
    <>
      <PageHero eyebrow="Program" title={program.title} description={program.summary} />
      <div className="mx-auto grid max-w-[1280px] gap-16 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[1.4fr_0.7fr] lg:px-8">
        <Reveal>
        <div>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Deskripsi</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--sa-muted)]">{program.description}</p>
          </section>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Tujuan dan manfaat</h2>
            <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-[var(--sa-muted)]">
              {program.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </section>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Materi</h2>
            <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-[var(--sa-muted)]">
              {program.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </section>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Metode</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--sa-muted)]">{program.method}</p>
          </section>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Unduhan</h2>
            <div className="mt-2">
              <DocumentList documents={program.documents} />
            </div>
          </section>
          <section className="border-t border-[var(--sa-line)] py-8">
            <h2 className="text-xl font-semibold">Pertanyaan</h2>
            <Accordion className="mt-2">
              {program.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-b border-[var(--sa-line)]">
                  <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--sa-muted)]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
        </Reveal>
        <aside className="h-fit lg:sticky lg:top-28">
          <h2 className="text-sm font-semibold text-[var(--sa-muted)]">Peserta</h2>
          <p className="mt-2 leading-7">{program.audience}</p>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Jadwal</h3>
          <p className="mt-2 leading-7">{program.scheduleNote}</p>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Persyaratan</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-7">
            {program.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Biaya</h3>
          <p className="mt-2 leading-7">{program.feeNote}</p>
          <Link
            href={registrationPath(program.slug)}
            className="mt-8 inline-flex h-12 cursor-pointer items-center rounded-full bg-[var(--sa-navy)] px-6 text-sm font-semibold text-white"
          >
            Isi formulir pendaftaran
          </Link>
        </aside>
      </div>
    </>
  )
}
