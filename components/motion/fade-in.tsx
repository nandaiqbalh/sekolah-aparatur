"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

const EASE = [0.22, 1, 0.36, 1] as const

export function FadeIn({
  children,
  className,
  delay = 0,
  onMount = false,
  y = 16,
}: {
  children: ReactNode
  className?: string
  delay?: number
  onMount?: boolean
  y?: number
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(onMount
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2, margin: "0px 0px -40px 0px" },
          })}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
