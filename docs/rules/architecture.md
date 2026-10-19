# Architecture

Production-oriented layering for the Sekolah Aparatur Next.js App Router app.

- **Domains** live in `features/{name}/`
- **Cross-cutting** utilities live in `lib/`
- Routes live in `app/[locale]/` (public) and `app/admin/` (staff) and only compose UI + call services/actions

## Layer flow

```
Client UI (RHF) ──invoke──► Server Action ──safeParse──► Zod schema
                                    │
                                    ▼
                                 Service ──► Repository ──► Data
                                    ▲
Server UI (RSC) ──read──────────────┘
```

| Layer | Responsibility | May import | Must not import |
|-------|----------------|------------|-----------------|
| `schemas/` | Zod contracts + `z.infer` types | `zod` | React, Next, services, repos, UI |
| `repositories/` | Data access only | `server-only`, DB clients, schemas | React, services, actions, UI |
| `services/` | Business use-cases | repositories, schemas | React, Next UI, actions |
| `actions/` | `"use server"` boundary | Zod, services, `ActionResult` | repositories directly*, UI |
| Server UI | RSC pages / feature lists | services, actions, shared UI | repositories |
| Client UI | Interactive leaves | actions, RHF, UI primitives | repositories, services |

\* Prefer **action → service → repository**. Do not put business rules only in actions.

## Folder map

```
app/
  layout.tsx                 # html/body, theme, fonts, Toaster
  admin/
    login/page.tsx           # public staff login
    (protected)/             # cookie session + RBAC shell
      page.tsx               # dashboard
      profile/ system/
  [locale]/
    layout.tsx               # dictionary Providers, metadata, public shell
    page.tsx                 # marketing landing
    not-found.tsx
  sitemap.ts  robots.ts
  opengraph-image.tsx  twitter-image.tsx
proxy.ts                     # locale redirect + /admin cookie gate
lib/auth/                    # sessions, requirePermission
lib/rbac/                    # permission catalog
prisma/                      # schema, migrations, seed

features/{domain}/
  schemas/
  repositories/
  services/
  actions/
  components/                # domain server + client UI

components/
  ui/                        # shadcn — do not hand-edit
  layout/                    # header, footer, nav (when added)
  sections/                  # landing blocks (hero, about, why-us, faq, cta)
  shared/                    # cross-page widgets (theme, locale, status)
  providers.tsx

lib/
  i18n/                      # locale + dictionaries
  action-result.ts           # ActionResult envelope
  seo.ts  site.ts  routes.ts
  theme-cookie.ts  theme-script.ts
  utils.ts                   # cn()

hooks/                       # shared client hooks (optional)
docs/
  rules/                     # engineering conventions
  product-vision/            # product goals (per fork)
```

## When to use which entry point

| Need | Use |
|------|-----|
| Read data for a page | RSC → **service** |
| Mutate from a form | Client (RHF + Zod) → **action** → `safeParse` → service → repository |
| Cookie preference | Thin `*.actions.ts` (locale) or client cookie helper (theme) |
| Pure presentational UI | `components/shared` or `sections` |

## ActionResult contract

Every mutating action returns `ActionResult<T>` from [`lib/action-result.ts`](../../lib/action-result.ts):

```ts
{
  ok: boolean
  data: T | null       // payload on success; null on failure
  error: string | null // machine-readable code on failure; null on success
  message: string      // human-readable status
  fieldErrors?: Record<string, string[]>
}
```

Helpers:

```ts
actionSuccess(data, message?)
actionFailure(errorCode, message, fieldErrors?)
```

Example success / failure:

```ts
return actionSuccess(item, "Item created")
// { ok: true, data: item, error: null, message: "Item created" }

return actionFailure("VALIDATION_ERROR", "Validation failed", fieldErrors)
// { ok: false, data: null, error: "VALIDATION_ERROR", message: "Validation failed", fieldErrors }
```

## Naming conventions

| Kind | Pattern | Example |
|------|---------|---------|
| Schema | `{verb}{Entity}Schema` or `{entity}Schema` | `createUserSchema` |
| Inferred type | `z.infer<typeof schema>` | `CreateUserInput` |
| Repository | `{entity}Repository` | `userRepository` |
| Service | `{entity}Service` | `userService` |
| Action | `{verb}{Entity}Action` | `createUserAction` |
| Feature component | kebab-case file | `users-manager.tsx` |

## Reference domain

Staff users and roles: [`features/user/`](../../features/user/) and [`features/role/`](../../features/role/) · routes `/admin/system/users`, `/admin/system/roles`.

Admin list UI conventions: [backoffice.md](./backoffice.md).

## Adding a new domain

1. Create `features/{name}/` with `schemas/`, `repositories/`, `services/`, `actions/`, `components/`.
2. Define Zod schemas first (shared by RHF and actions).
3. Implement repository (swap in-memory for DB later behind the same interface).
4. Implement service methods.
5. Expose mutations via actions; reads via service from RSC.
6. Add a thin `app/[locale]/{route}/page.tsx` that only composes.
7. Wire `ROUTES`, `app/sitemap.ts`, and dictionary keys (`en` + `id`).

## Related docs

- [ai-rules.md](./ai-rules.md) · [forms.md](./forms.md)
- [i18n.md](./i18n.md) · [theme.md](./theme.md) · [seo.md](./seo.md) · [backoffice.md](./backoffice.md)
- [Docs index](../README.md)
