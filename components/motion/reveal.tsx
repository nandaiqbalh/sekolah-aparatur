"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.45, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
