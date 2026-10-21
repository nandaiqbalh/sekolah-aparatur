"use client"

import { motion, useReducedMotion } from "framer-motion"
import { isValidElement, type ReactNode } from "react"

const EASE = [0.22, 1, 0.36, 1] as const

function isPageLoading(node: ReactNode): boolean {
  if (Array.isArray(node)) return node.some(isPageLoading)
  if (!isValidElement(node)) return false
  const props = node.props as { "data-page-loading"?: unknown; children?: ReactNode }
  if (props["data-page-loading"] != null) return true
  return isPageLoading(props.children)
}

export function PageTransition({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion || isPageLoading(children)) {
    return <div className="flex flex-1 flex-col">{children}</div>
  }

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, filter: "blur(12px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
