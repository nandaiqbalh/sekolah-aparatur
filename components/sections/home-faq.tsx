"use client"

import { useState } from "react"

import { FadeIn } from "@/components/motion/fade-in"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { cn } from "@/lib/utils"

export function HomeFaq() {
  const dict = useDictionary()
  const [openIndex, setOpenIndex] = useState(0)

  const items = [
    { q: dict.home.faq1Q, a: dict.home.faq1A },
    { q: dict.home.faq2Q, a: dict.home.faq2A },
    { q: dict.home.faq3Q, a: dict.home.faq3A },
    { q: dict.home.faq4Q, a: dict.home.faq4A },
  ]

  return (
    <section id="faq" className="bg-background py-[5.5rem] sm:py-[8.125rem]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,429px)_minmax(0,797px)] lg:items-start lg:justify-between lg:gap-16 lg:px-20">
        <FadeIn>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-burgundy">
            <span aria-hidden>✦</span>
            <span className="tracking-normal">{dict.home.faqEyebrow}</span>
          </p>
          <h2 className="mt-4 max-w-[8.5ch] font-heading text-[clamp(2.75rem,5.5vw,5rem)] font-bold leading-[0.96] tracking-tight text-[#111]">
            {dict.home.faqTitle}
          </h2>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="border-t border-black/12">
            {items.map((item, index) => {
              const open = openIndex === index
              const panelId = `faq-panel-${index}`
              const triggerId = `faq-trigger-${index}`

              return (
                <div key={item.q} className="border-b border-black/12">
                  <button
                    id={triggerId}
                    type="button"
                    className="flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    <span className="text-[17px] font-bold leading-[1.2] text-black">{item.q}</span>
                    <span
                      className="relative mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-[17px] font-bold leading-none text-black"
                      aria-hidden
                    >
                      <span
                        className={cn(
                          "absolute transition-all duration-300 ease-out",
                          open ? "scale-75 opacity-0" : "scale-100 opacity-100",
                        )}
                      >
                        ＋
                      </span>
                      <span
                        className={cn(
                          "absolute transition-all duration-300 ease-out",
                          open ? "scale-100 opacity-100" : "scale-75 opacity-0",
                        )}
                      >
                        −
                      </span>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!open}
                    className="pb-6 text-sm leading-relaxed text-[#5a5a5a] sm:pb-7"
                  >
                    {item.a}
                  </div>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
