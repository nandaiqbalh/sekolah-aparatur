export function getClientIpFromHeaders(headersList: Headers): string | undefined {
  const forwarded = headersList.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return headersList.get("x-real-ip")?.trim() || undefined
}
