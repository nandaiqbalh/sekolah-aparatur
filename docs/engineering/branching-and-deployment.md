# Branching, Git & Deployment

One branch supports two production targets: a VPS (Docker image on GHCR) and Vercel with Supabase Postgres.

## Branch strategy

```
master        ← production (GHCR image + Vercel-ready)
feature/*     ← new work
fix/*         ← bugfix
```

Push to `master` builds and pushes a container image. It does not deploy the VPS. Vercel deploys on its own when the GitHub repo is connected to that branch.

### Commit messages

```
{type}: {description}
```

Use English, imperative (`add`, `fix`, `update`). Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`, `perf`.

## Local development

### Host app + Docker Postgres

```bash
cp .env.example .env.local
docker compose up -d db
npm install                  # postinstall → prisma generate
npm run db:migrate
npm run db:seed              # once
npm run dev
```

### Full stack in Docker

```bash
cp .env.example .env
npm run docker:up
```

The entrypoint runs `prisma migrate deploy` with the Prisma CLI under `/opt/tools`, then starts `node server.js` from the Next.js standalone output. It seeds when `RUN_DB_SEED=true` (default in `.env.example` for local Docker). Set `RUN_DB_SEED=false` on the production VPS. The runner image does not contain the full `node_modules` tree.

Postgres is bound to `127.0.0.1:${DB_PORT:-5434}` so it does not collide with other Postgres on the shared VPS (`5432` lencir, `5433` vitalcare).

### Supabase (same commands as Vercel local)

Comment the local `DATABASE_URL` in `.env.local` and set:

- `DATABASE_URL` — Supabase transaction pooler, port 6543, `?pgbouncer=true`
- `DIRECT_URL` — Supabase direct connection, port 5432

`npm run db:migrate` and `npm run db:seed` use `DIRECT_URL` when it is set. There is no local Postgres container in this mode.

Open [http://localhost:3000](http://localhost:3000). Locale comes from the `locale` cookie (default `id`). `/en` and `/id` redirect to the same path without a prefix.

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Default seed user (see `.env.example`):

- **Super Admin:** `superadmin@sekolah-aparatur.local` / `ChangeMeNow123`

## VPS (GHCR)

```
push master
  → GitHub Actions: npm ci, lint (warnings fail the job), unit tests
  → docker build linux/amd64 (Next.js standalone, no full node_modules)
  → ghcr.io/nandaiqbalh/sekolah-aparatur:<sha7> and :latest
  → human SSH → IMAGE_TAG in .env → ./scripts/deploy-prod.sh
```

CI **does not deploy**. Image registry: `ghcr.io/${github.repository}`.

### Deploy on the VPS

Suggested path: `~/opt/apps/sekolah-aparatur` (user `ubuntu`). Neighbor ports already taken:

| Host port | Service |
|-----------|---------|
| `3000` | lencir-app |
| `3001` | healthy-app |
| **`3002`** | **sekolah-aparatur-app (this project)** |
| `5432` | lencir-db |
| `5433` | healthy-app-db |
| **`5434`** | **sekolah-aparatur-db (this project)** |

```bash
git pull
# set IMAGE_TAG=<sha7> in .env  (APP_PORT=3002, DB_PORT=5434)
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh
# first time only, after migrate:
docker compose -f docker-compose.prod.yml exec app npx prisma db seed
```

Rollback: set `IMAGE_TAG` to an older GHCR SHA and rerun the script.

The VPS must `docker login ghcr.io` with a PAT that has `read:packages`.

Host reverse proxy (not a Compose service): [deploy/nginx.conf.example](../../deploy/nginx.conf.example) → `127.0.0.1:3002`. Replace `example.com` then `certbot --nginx`.

## Vercel + Supabase

```
push master (repo connected in Vercel)
  → npm install (postinstall → prisma generate)
  → next build   (or npm run vercel-build)
  → deploy to production / preview URL
```

### First-time setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy connection strings from **Settings → Database**:
   - **Transaction pooler** → `DATABASE_URL` (port 6543, add `?pgbouncer=true`)
   - **Direct connection** → `DIRECT_URL` (port 5432)
3. Connect this GitHub repo to Vercel. Production branch: `master`.
4. Add environment variables in Vercel (Production + Preview):

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Supabase pooler URL |
| `DIRECT_URL` | Yes | Direct URL (migrations only; not used at runtime) |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://your-app.vercel.app` |
| `DEFAULT_LOCALE` | No | Documented only. Runtime default is `id` in `lib/i18n/config.ts` |

5. Run migrations from your machine (`.env.local` with Supabase URLs). Do not add `SEED_*` to Vercel:

```bash
npm run db:migrate
npm run db:seed
```

6. Push to `master`. Vercel builds from the Git integration. The container workflow still publishes a GHCR image for the VPS; it does not affect the Vercel deployment.

Use the Vercel dashboard → Deployments → Promote a previous deployment to roll back.

`VERCEL_URL` is added to Server Action allowed origins for preview deployments. Always use the pooler URL for `DATABASE_URL` on Vercel. Migrations do not run on Vercel deploy.

## Environment

Copy [`.env.example`](../../.env.example).

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Prisma runtime (local Postgres or Supabase pooler) |
| `DIRECT_URL` | Prisma migrations and seed when using Supabase |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL + Server Action origins |
| `SEED_SUPER_ADMIN_*` | Super Admin seed user (local / one-time only) |

Production compose also uses `POSTGRES_*`, `DB_PORT`, `APP_PORT`, `IMAGE_TAG`, optional `IMAGE_REGISTRY`, `SITE_URL`, and `SEED_*`.

Seed creates system roles `super_admin` and `admin`, plus one super admin user. The limited admin role stays in the catalog so staff can be added later. Existing staff passwords are **not** rotated on re-seed.

## RBAC notes

- Cookie `session_token` (httpOnly, SameSite=lax, 5-day sliding inactivity).
- Super Admin bypasses permission rows.
- Catalog: `dashboard.*`, `users.*`, `roles.*`, `permissions.*`, `activity_logs.view`.
