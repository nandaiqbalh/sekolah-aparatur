# SEO

Locale-aware App Router metadata for Sekolah Aparatur.

## Site URL

Set in [`.env.example`](../../.env.example) / `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In production, use your real origin (e.g. `https://example.com`).  
Helpers: `getSiteUrl()` / `absoluteUrl()` in [`lib/site.ts`](../../lib/site.ts). Used for `metadataBase`, sitemap, robots, and JSON-LD.

Brand string: `SITE_NAME` (`"Sekolah Aparatur"`) in [`lib/site.ts`](../../lib/site.ts).

## Helpers

| API | File | Purpose |
|-----|------|---------|
| `buildPageMetadata({ locale, path, title, description })` | [`lib/seo.ts`](../../lib/seo.ts) | canonical, hreflang per path, Open Graph, Twitter |
| `jsonLdScript(data)` | [`lib/seo.ts`](../../lib/seo.ts) | JSON-LD string with `<` escaped |
| `SITE_NAME` / `absoluteUrl` | [`lib/site.ts`](../../lib/site.ts) | brand + absolute URLs |

`buildPageMetadata` sets:

- `metadataBase`
- `alternates.canonical` → `/{locale}{path}`
- `alternates.languages` → `{ en: "/en{path}", id: "/id{path}" }`
- `openGraph` + `twitter.card = summary_large_image`

## Files

| File | Role |
|------|------|
| `app/layout.tsx` | root `metadataBase` |
| `app/[locale]/layout.tsx` | default title template + home metadata |
| `app/sitemap.ts` | all locales × public routes |
| `app/robots.ts` | `Allow: /` + sitemap URL |
| `app/opengraph-image.tsx` | default OG image (`ImageResponse`) |
| `app/twitter-image.tsx` | Twitter card image |

[`proxy.ts`](../../proxy.ts) **excludes** `sitemap.xml` and `robots.txt` from locale redirects.

## New public page checklist

1. `generateMetadata` with `buildPageMetadata` + `dict.meta.*`
2. Add path to `ROUTES` and `SITEMAP_ROUTES` in `app/sitemap.ts`
3. One `<h1>`; meaningful `alt` on images
4. Optional JSON-LD (`WebSite`, `Article`, …) via `jsonLdScript`

Example: home injects `WebSite` JSON-LD.

## Related

- [i18n.md](./i18n.md) · [architecture.md](./architecture.md) · [Docs index](../README.md)
