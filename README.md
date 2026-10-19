# Sekolah Aparatur

Situs Sekolah Aparatur, dengan back office staf untuk mengelola konten.

Two deploy targets from `master`:

- **VPS:** push builds a GHCR image; deploy with `scripts/deploy-prod.sh` (Docker Postgres).
- **Vercel:** connect the repo and use Supabase (`DATABASE_URL` pooler + `DIRECT_URL`).

## Quick start

Postgres via Docker, or a [Supabase](https://supabase.com) project. See `.env.example`.

```bash
cp .env.example .env
docker compose up -d db      # skip when DATABASE_URL points at Supabase
npm install                  # postinstall → prisma generate
npm run db:migrate
npm run db:seed              # once — super admin only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirected to `/en` or `/id`.

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Seeded user (see `.env`):

- **Super Admin:** `superadmin@sekolah-aparatur.local` / `ChangeMeNow123`

Set `NEXT_PUBLIC_SITE_URL` in `.env`. Production deploy: [docs/engineering/branching-and-deployment.md](docs/engineering/branching-and-deployment.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (fails on warnings) |
| `npm test` | Unit tests |
| `npm run db:migrate` | Apply Prisma migrations (`DIRECT_URL`) |
| `npm run db:seed` | Seed RBAC roles, permissions, and staff users |
| `npm run vercel-build` | Prisma generate + Next build (Vercel override) |
| `npm run docker:db` | Start local Postgres only |
| `npm run docker:up` | Full stack in Docker |
| `npm run docker:down` | Stop the full Docker stack |

## What you get

| Area | Implementation |
|------|----------------|
| Architecture | `features/{domain}`: schemas → repositories → services → actions → components |
| Forms | React Hook Form + Zod + `@hookform/resolvers` |
| Actions | `ActionResult` with `data`, `error`, `message` |
| i18n | Custom en/id, cookie + `proxy.ts` |
| Theme | Cookie light/dark, no FOUC |
| Deploy | VPS (Docker + GHCR) or Vercel + Supabase Postgres |
| Auth | Cookie sessions + Prisma RBAC (`/admin`) |

**Demo:** staff back office at [/admin](http://localhost:3000/admin) after seed.

## Structure

```
app/[locale]/          # public routes (RSC)
app/admin/             # staff back office (no locale prefix)
features/              # domain modules
prisma/                # schema, migrations, seed
docs/
  rules/               # engineering conventions
  engineering/         # branching and deployment
  product-vision/      # product goals
proxy.ts               # locale redirect + /admin cookie gate
```

## Documentation

Start here: **[docs/README.md](docs/README.md)**

| Area | Path |
|------|------|
| Engineering rules | [docs/rules/](docs/rules/) |
| Product vision | [docs/product-vision/](docs/product-vision/) |

| Rule doc | Topic |
|----------|-------|
| [architecture.md](docs/rules/architecture.md) | Layers & ActionResult |
| [ai-rules.md](docs/rules/ai-rules.md) | Contributor / AI checklist |
| [forms.md](docs/rules/forms.md) | RHF + Zod |
| [i18n.md](docs/rules/i18n.md) | Locales & dictionaries |
| [theme.md](docs/rules/theme.md) | Light / dark |
| [seo.md](docs/rules/seo.md) | Metadata & sitemap |
| [backoffice.md](docs/rules/backoffice.md) | Admin UI shell, filters, dialogs |
| [branching-and-deployment.md](docs/engineering/branching-and-deployment.md) | VPS, Vercel, Supabase, staff seed |

Agents: read [`AGENTS.md`](AGENTS.md) before editing.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui
- Zod · React Hook Form · Server Actions · custom i18n · cookie theme
- Prisma 7 · PostgreSQL (Docker or Supabase) · staff RBAC (`/admin`)
