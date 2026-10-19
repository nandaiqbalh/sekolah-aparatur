import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { DocumentList } from "@/components/public/document-list"
import { PageHero } from "@/components/public/page-hero"
import type { Program, ProgramBlock } from "@/data/programs"
import { registrationPath } from "@/lib/routes"

function BlockView({ block }: { block: ProgramBlock }) {
  if (block.kind === "paragraphs") {
    return (
      <div className="grid max-w-2xl gap-4">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-7 text-[var(--sa-muted)]">
            {paragraph}
          </p>
        ))}
      </div>
    )
  }

  if (block.kind === "list") {
    return (
      <ul className="max-w-2xl list-disc space-y-2 pl-5 leading-7 text-[var(--sa-muted)]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.kind === "steps") {
    return (
      <ol className="grid max-w-2xl gap-4">
        {block.steps.map((step, index) => (
          <li key={step.title}>
            <p className="text-sm font-semibold text-[var(--sa-muted)]">0{index + 1}</p>
            <p className="mt-1 font-semibold">{step.title}</p>
            <p className="mt-1 leading-7 text-[var(--sa-muted)]">{step.body}</p>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--sa-line)]">
            {block.headers.map((header) => (
              <th key={header} className="py-3 pr-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join("|")} className="border-b border-[var(--sa-line)]">
              {row.map((cell, index) => (
                <td key={`${index}-${cell}`} className="py-3 pr-4 align-top leading-6 text-[var(--sa-muted)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProgramDetail({ program }: { program: Program }) {
  return (
    <>
      <PageHero eyebrow="Program" title={program.title} description={program.summary} />
      <div className="bg-[var(--sa-canvas)]">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_0.7fr] lg:px-8">
        <Reveal>
          <div className="grid gap-4">
            {program.sections.map((block) => (
              <section key={block.title} className="rounded-[28px] bg-white p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-semibold">{block.title}</h2>
                <div className="mt-4">
                  <BlockView block={block} />
                </div>
              </section>
            ))}
            {program.documents.length > 0 ? (
              <section className="rounded-[28px] bg-white p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-semibold">Unduhan</h2>
                <div className="mt-2">
                  <DocumentList documents={program.documents} />
                </div>
              </section>
            ) : null}
          </div>
        </Reveal>
        <aside className="h-fit rounded-[28px] bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-sm font-semibold text-[var(--sa-muted)]">Peserta</h2>
          <p className="mt-2 leading-7">{program.audience}</p>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Kalender</h3>
          <p className="mt-2 leading-7">{program.scheduleNote}</p>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Berkas pendaftaran</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-7">
            {program.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-semibold text-[var(--sa-muted)]">Biaya</h3>
          <p className="mt-2 leading-7">{program.feeNote}</p>
          <Link
            href={registrationPath(program.slug)}
            className="mt-8 inline-flex h-12 cursor-pointer items-center rounded-full bg-[var(--sa-gold)] px-6 text-sm font-semibold text-[var(--sa-navy)]"
          >
            Isi formulir pendaftaran
          </Link>
        </aside>
      </div>
      </div>
    </>
  )
}
