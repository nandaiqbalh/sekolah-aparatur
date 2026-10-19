"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function parseUrlPage(raw: string | null | undefined, defaultPage = 1): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return defaultPage
  return Math.floor(n)
}

export type UrlParamValue = string | string[] | null | undefined

function applyParamPatch(params: URLSearchParams, patch: Record<string, UrlParamValue>) {
  for (const [key, value] of Object.entries(patch)) {
    params.delete(key)
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        const trimmed = item.trim()
        if (trimmed) params.append(key, trimmed)
      }
      continue
    }
    const trimmed = value.trim()
    if (!trimmed) continue
    params.set(key, trimmed)
  }
}

export function useUrlListParams(defaultPage = 1): {
  page: number
  queryKey: string
  searchParams: URLSearchParams
  getParam: (key: string) => string
  getAllParams: (key: string) => string[]
  setPage: (page: number) => void
  replaceQuery: (
    patch: Record<string, UrlParamValue>,
    options?: { resetPage?: boolean },
  ) => void
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryKey = searchParams.toString()

  const page = useMemo(
    () => parseUrlPage(searchParams.get("page"), defaultPage),
    [searchParams, defaultPage],
  )

  const replaceQuery = useCallback(
    (patch: Record<string, UrlParamValue>, options?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString())
      applyParamPatch(params, patch)

      if (options?.resetPage) {
        params.delete("page")
      } else if ("page" in patch) {
        const raw = patch.page
        const next =
          raw == null
            ? defaultPage
            : parseUrlPage(Array.isArray(raw) ? raw[0] : raw, defaultPage)
        if (next <= 1) params.delete("page")
        else params.set("page", String(next))
      }

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [defaultPage, pathname, router, searchParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      const safe = Math.max(1, Math.floor(nextPage) || defaultPage)
      replaceQuery({ page: safe <= 1 ? null : String(safe) })
    },
    [defaultPage, replaceQuery],
  )

  const getParam = useCallback(
    (key: string) => searchParams.get(key) ?? "",
    [searchParams],
  )

  const getAllParams = useCallback(
    (key: string) => searchParams.getAll(key).filter(Boolean),
    [searchParams],
  )

  return { page, queryKey, searchParams, getParam, getAllParams, setPage, replaceQuery }
}
