import { loadLocalEnv } from "./lib/load-env-file"
import { defineConfig } from "prisma/config"

loadLocalEnv()

const databaseUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in .env.local, Docker Compose, or the host environment (Vercel).",
  )
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
    ...(directUrl ? { directUrl } : {}),
  },
})
