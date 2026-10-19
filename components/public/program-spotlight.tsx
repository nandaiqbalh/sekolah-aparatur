"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { programs } from "@/data/programs"
import { ROUTES, registrationPath } from "@/lib/routes"
import { cn } from "@/lib/utils"

export function ProgramSpotlight() {
  const [activeSlug, setActiveSlug] = useState(programs[0]?.slug ?? "")
  const active = programs.find((program) => program.slug === activeSlug) ?? programs[0]

  if (!active) return null

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <Reveal y={80}>
        <span className="relative block h-72 overflow-hidden rounded-[28px] sm:h-[420px]">
          <Image
            src={active.slug === "legislator" ? "/profile/unas-002.png" : "/profile/daerah-004.png"}
            alt={active.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40rem, 100vw"
          />
        </span>
      </Reveal>
      <div className="grid gap-3">
        {programs.map((program, index) => {
          const open = program.slug === active.slug
          const detailHref = program.slug === "legislator" ? ROUTES.legislator : ROUTES.daerahDesa
          return (
              <Reveal key={program.slug} delay={index * 0.1} className={cn("rounded-[28px] bg-white px-6 py-5", open ? "shadow-sm" : "")}>
              <button
                type="button"
                className="w-full cursor-pointer text-left text-lg font-semibold"
                aria-expanded={open}
                onClick={() => setActiveSlug(program.slug)}
              >
                {program.title}
              </button>
              {open ? (
                <div className="mt-2">
                  <p className="max-w-lg text-sm leading-6 text-[var(--sa-muted)]">{program.summary}</p>
                  <div className="mt-4 flex gap-5 text-sm font-semibold">
                    <Link href={detailHref} className="cursor-pointer text-[var(--sa-navy)] underline decoration-[var(--sa-gold)] decoration-2 underline-offset-4">
                      Detail program
                    </Link>
                    <Link href={registrationPath(program.slug)} className="cursor-pointer text-[var(--sa-ink)]">
                      Formulir
                    </Link>
                  </div>
                </div>
              ) : null}
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
