export const SITE_NAME = "Sekolah Aparatur"

export const GITHUB_REPO_URL =
  "https://github.com/nandaiqbalh/sekolah-aparatur"

export const DOCS_URL = `${GITHUB_REPO_URL}/blob/master/docs/README.md`

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl().replace(/\/$/, "")
  if (!path || path === "/") return base
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}
