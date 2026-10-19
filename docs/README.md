# Documentation

```
docs/
  rules/             # engineering conventions (architecture, forms, i18n, …)
  engineering/       # branching, VPS CI, Vercel, Supabase
  product-vision/    # product goals, UX, roadmap (per project fork)
  README.md          # this index
```

## `rules/` — engineering

Read these when implementing or asking an AI agent to change code.

| Doc | Purpose |
|-----|---------|
| [rules/architecture.md](./rules/architecture.md) | Layers: repository → service → action → UI |
| [rules/ai-rules.md](./rules/ai-rules.md) | Contributor / agent checklist and anti-patterns |
| [rules/forms.md](./rules/forms.md) | React Hook Form + Zod + resolvers |
| [rules/i18n.md](./rules/i18n.md) | Locales, dictionaries, proxy routing |
| [rules/theme.md](./rules/theme.md) | Cookie light/dark theme |
| [rules/backoffice.md](./rules/backoffice.md) | Admin UI shell, filters, dialogs, tables |
| [rules/seo.md](./rules/seo.md) | Metadata, sitemap, robots, JSON-LD |
| [engineering/branching-and-deployment.md](./engineering/branching-and-deployment.md) | VPS, Vercel, Supabase, staff seed |

Index: [rules/README.md](./rules/README.md)

## `product-vision/` — product

Product goals, audience, UX principles, and roadmap for Sekolah Aparatur.

- Current brief: [product-vision/README.md](./product-vision/README.md)
- Expand as the product brief lands (e.g. `overview.md`, `roadmap.md`)

## Quick links

- Public landing: `/` (locale cookie, default `id`)
- Admin: `/admin` (staff RBAC)
- Env template: [`.env.example`](../.env.example)
- Agent entry: [`AGENTS.md`](../AGENTS.md)
- Project overview: [`README.md`](../README.md)

## Stack snapshot

- Prisma 7 · PostgreSQL (Docker or Supabase) · staff RBAC (`/admin`)
