import { ArrowRight, BookOpen, CalendarDays, Clock3, Download, FileCheck, GraduationCap, Handshake, Landmark, Laptop, Wallet, type LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { PageHero } from "@/components/public/page-hero"
import { WhatsappButton } from "@/components/public/whatsapp-button"
import { homeContent } from "@/data/home"
import type { RequirementGroup } from "@/data/sekolah-classes"
import type { Program } from "@/data/programs"
import { registrationPath } from "@/lib/routes"

const highlightIcons: Record<string, LucideIcon> = {
  "Sistem perkuliahan yang fleksibel": Laptop,
  "Durasi studi yang singkat": Clock3,
  "Biaya yang terjangkau": Wallet,
}

function GoldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--sa-gold)] text-[var(--sa-navy)] shadow-[0_8px_20px_rgba(255,190,89,0.45)]">
      <Icon className="size-6" aria-hidden />
    </span>
  )
}

function SectionHeading({ icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <GoldIcon icon={icon} />
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--sa-navy)] sm:text-3xl">{title}</h2>
    </div>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--sa-muted)] sm:text-base">
      {items.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--sa-muted)] sm:text-base sm:leading-7">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--sa-gold)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function paragraphsOf(program: Program, title: string): string[] {
  const block = program.sections.find((item) => item.title === title)
  return block?.kind === "paragraphs" ? block.paragraphs : []
}

export function ProgramDetail({
  program,
  image,
  imageAlt,
  requirementGroups,
}: {
  program: Program
  image: string
  imageAlt: string
  requirementGroups: RequirementGroup[]
}) {
  const pengantar = paragraphsOf(program, "Pengantar")
  const mitra = program.mitra
    .map((name) => homeContent.facilitators.find((item) => item.name === name))
    .filter((item) => item !== undefined)

  return (
    <>
      <PageHero eyebrow="Program" title={program.title} description={program.summary} />

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80">
            <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 36rem, 100vw" priority />
          </div>
          <div>
            <SectionHeading icon={GraduationCap} title="Program studi yang ditawarkan" />
            <ul className="mt-6 flex flex-col gap-4">
              {program.studies.map((study) => (
                <li key={study.level} className="rounded-2xl bg-white px-5 py-4">
                  {study.level !== study.name ? (
                    <p className="text-xs font-semibold tracking-wide text-[var(--sa-navy)] uppercase">{study.level}</p>
                  ) : null}
                  <h3 className="text-lg font-semibold text-[var(--sa-navy)]">{study.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--sa-navy)]">{study.track}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{study.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div>
            <SectionHeading icon={BookOpen} title="Pengantar" />
            <Paragraphs items={pengantar} />
          </div>
          <div>
          <SectionHeading icon={Laptop} title="Keunggulan program" />
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {program.highlights.map((item) => {
              const Icon = highlightIcons[item.title] ?? Laptop
              return (
                <li key={item.title} className="rounded-[28px] bg-[var(--sa-canvas)] p-6 sm:p-7">
                  <GoldIcon icon={Icon} />
                  <h3 className="mt-4 text-lg font-semibold text-[var(--sa-navy)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{item.description}</p>
                </li>
              )
            })}
          </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div>
            <SectionHeading icon={CalendarDays} title="Masa pendaftaran dan pemberkasan" />
            <ul className="mt-6 grid gap-4 lg:grid-cols-2">
              {program.registrationPeriods.map((period) => (
                <li key={period.term} className="rounded-[28px] bg-[var(--sa-canvas)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--sa-navy)]">{period.term}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{period.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading icon={Landmark} title="Kampus penyelenggara" />
            <div className="mt-6 flex items-start gap-4">
              <Image
                src={program.campus.logo}
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold text-[var(--sa-navy)]">{program.campus.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{program.campus.description}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--sa-muted)]">{program.campus.address}</p>
              </div>
            </div>
          </div>
          {requirementGroups.length > 0 ? (
            <div>
              <SectionHeading icon={FileCheck} title="Persyaratan" />
              <div className="mt-6 flex flex-col gap-8">
                {requirementGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-lg font-semibold text-[var(--sa-navy)]">{group.title}</h3>
                    <BulletList items={group.items} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {program.documents.length > 0 ? (
            <div>
              <SectionHeading icon={Download} title="Unduhan" />
              <ul className="mt-6 flex flex-col gap-5">
                {program.documents.map((document) => (
                  <li key={document.name} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[var(--sa-navy)]">{document.name}</p>
                      <p className="mt-1 text-sm text-[var(--sa-muted)]">
                        {document.format}
                        {document.size ? ` · ${document.size}` : ""}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--sa-muted)]">{document.description}</p>
                    </div>
                    {document.href ? (
                      <a
                        href={document.href}
                        download
                        className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--sa-navy)] px-5 text-sm font-semibold text-white"
                      >
                        Unduh
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {mitra.length > 0 ? (
            <div>
              <SectionHeading icon={Handshake} title="Mitra" />
              <ul className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-12">
                {mitra.map((item) => (
                  <li key={item.name} className="flex min-w-0 flex-col items-start text-left">
                    <Image src={item.logo} alt={item.fullName} width={96} height={96} className="h-16 w-auto object-contain object-left" />
                    <p className="mt-3 text-sm font-semibold leading-snug text-[var(--sa-navy)]">{item.fullName}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--sa-muted)]">{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[var(--sa-canvas)] py-8 lg:py-10">
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
