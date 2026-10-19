# AI / contributor rules

Read this before changing code.

Also read Next.js guides in `node_modules/next/dist/docs/` — this project uses **Next.js 16** (file convention: **`proxy.ts`**, not deprecated `middleware.ts`).

**Must read:** [architecture.md](./architecture.md) · [forms.md](./forms.md)  
**Also:** [i18n.md](./i18n.md) · [theme.md](./theme.md) · [seo.md](./seo.md) · [backoffice.md](./backoffice.md) · [Docs index](../README.md)

---

## Project identity

| Item | Value |
|------|-------|
| Type | **Sekolah Aparatur** |
| Stack | Next.js 16 · React 19 · TypeScript · Tailwind 4 · shadcn/ui |
| Forms | React Hook Form + Zod + `@hookform/resolvers` |
| i18n | Custom `en` / `id` (no next-intl) |
| Theme | Cookie light/dark (no next-themes / localStorage) |
| Deploy | VPS (Docker + GHCR) or Vercel + Supabase — see [branching-and-deployment.md](../engineering/branching-and-deployment.md) |

---

## Principles (required)

1. **Server Components by default.** `"use client"` only for state, effects, events, or browser APIs.
2. **Respect layers.** UI → action → Zod → service → repository. Never call repositories from the client.
3. **Do not edit `components/ui/`.** Extend via wrappers in `shared/` / `features/`.
4. **Small components.** One responsibility; split around ~80 lines or when concerns mix.
5. **No hardcoded UI copy.** Use `lib/i18n/dictionaries/{en,id}/`.
6. **No hardcoded internal paths.** Use `ROUTES` + `localizedPath()` / `localizedHref()`.
7. **Minimize scope.** No drive-by refactors outside the request.
8. **Forms.** RHF + Zod + `zodResolver`; same schema on server `safeParse` — see [forms.md](./forms.md).
9. **Action responses.** Always `ActionResult` with `data`, `error`, `message` — see [architecture.md](./architecture.md).

---

## Folder map (quick)

| Put it here | When |
|-------------|------|
| `app/(public)/…` | Public route / page / layout only |
| `features/{domain}/` | Domain schemas, repo, service, actions, UI |
| `components/shared/` | Cross-page small widgets |
| `components/sections/` | Page-bound composition blocks |
| `components/layout/` | Header, footer, nav chrome |
| `lib/` | Cross-cutting (i18n, seo, theme, utils, action-result) |

---

## Next.js 16 notes

- `params` / `searchParams` are **Promises** — always `await params`
- Locale routing uses root [`proxy.ts`](../../proxy.ts) (not `middleware.ts`)
- Prefer reading current App Router docs under `node_modules/next/dist/docs/` before new APIs

---

## New page checklist

- [ ] Page under `app/(public)/…`
- [ ] `generateMetadata` via `buildPageMetadata` + dictionary (`en` + `id`)
- [ ] Exactly one `<h1>`
- [ ] Internal links via `localizedPath`
- [ ] Public route added to `lib/routes.ts` and `app/sitemap.ts`
- [ ] JSON-LD only when it clearly helps
- [ ] Mutations use RHF + shared Zod schema + `ActionResult`

## New feature (domain) checklist

- [ ] `features/{name}/schemas|repositories|services|actions|components`
- [ ] Repository marked `server-only`
- [ ] Service owns business rules
- [ ] Action: `safeParse` → service → `actionSuccess` / `actionFailure`
- [ ] Client form: `useForm` + `zodResolver(sameSchema)`
- [ ] Dictionaries updated for both locales

---

## Anti-patterns

- Fetching in client components when RSC + service would work
- Business logic inside actions (keep actions thin: validate → service)
- Importing `server-only` modules into client bundles
- Editing shadcn `components/ui/*` by hand
- Giant page files with inline domain logic
- `localStorage` for theme/locale
- Manual form `if (!value)` checks instead of Zod
- Skipping server `safeParse` because the client already validated
- Returning ad-hoc `{ success: true }` instead of `ActionResult`

---

## Quick references

| Topic | Doc |
|-------|-----|
| Layers & ActionResult | [architecture.md](./architecture.md) |
| Forms | [forms.md](./forms.md) |
| i18n | [i18n.md](./i18n.md) |
| Theme | [theme.md](./theme.md) |
| SEO | [seo.md](./seo.md) |
| Backoffice UI | [backoffice.md](./backoffice.md) |
