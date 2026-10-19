export function parsePageParam(raw: string | string[] | undefined | null): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  const n = Number(value)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

export function parseSearchParam(
  raw: string | string[] | undefined | null,
): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function parseSearchParamList(
  raw: string | string[] | undefined | null,
): string[] {
  if (raw == null) return []
  const parts = Array.isArray(raw) ? raw : [raw]
  return parts
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter(Boolean)
}

export function parseEnumParam<T extends string>(
  raw: string | string[] | undefined | null,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = parseSearchParam(raw)
  if (value && (allowed as readonly string[]).includes(value)) return value as T
  return fallback
}
