"use client"

import { useLayoutEffect, useState, createContext, useContext, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const PageLoadingContext = createContext<(loading: boolean) => void>(() => {})

export function PageLoadingMarker() {
  const setLoading = useContext(PageLoadingContext)

  useLayoutEffect(() => {
    setLoading(true)
    return () => setLoading(false)
  }, [setLoading])

  return null
}

export function PageTransition({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <PageLoadingContext.Provider value={setLoading}>
      <div className={cn("flex flex-1 flex-col", !loading && "page-enter")}>{children}</div>
    </PageLoadingContext.Provider>
  )
}
