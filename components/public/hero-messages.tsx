"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

type HeroMessage = {
  eyebrow: string
  title: string
}

export function HeroMessages({ messages }: { messages: HeroMessage[] }) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const active = messages[index] ?? messages[0]

  useEffect(() => {
    if (reducedMotion || messages.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [messages.length, reducedMotion])

  if (!active) return null

  return (
    <div className="relative">
      <div className="invisible grid" aria-hidden>
        {messages.map((message) => (
          <div key={`measure-${message.title}`} className="col-start-1 row-start-1">
            <p className="inline-flex rounded-full border border-transparent px-3 py-1 text-xs font-semibold">
              {message.eyebrow}
            </p>
            <p className="mt-4 font-heading text-[clamp(2.15rem,3.8vw,3.35rem)] leading-[1.08] font-semibold tracking-tight">
              {message.title}
            </p>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.title}
          className="absolute inset-x-0 top-0"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <p className="inline-flex rounded-full border border-white/40 px-3 py-1 text-xs font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
            {active.eyebrow}
          </p>
          <h1 className="mt-4 max-w-none font-heading text-[clamp(2.15rem,3.8vw,3.35rem)] leading-[1.08] font-semibold tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_8px_24px_rgba(0,0,0,0.45)]">
            {active.title}
          </h1>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
