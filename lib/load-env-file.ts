import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

export function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) return

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const idx = trimmed.indexOf("=")
    if (idx === -1) continue

    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

/** Load `.env.local` then `.env` (same order as Next.js / Prisma config). */
export function loadLocalEnv() {
  loadEnvFile(".env.local")
  loadEnvFile(".env")
}
