# Theme (light / dark)

Cookie-based theme — **not** `localStorage`, **not** `next-themes`.

| Item | Value |
|------|-------|
| Cookie | `theme` = `light` \| `dark` |
| Max-age | 1 year · `SameSite=Lax` · `path=/` |
| Default | `light` |
| CSS strategy | Class on `<html>` + Tailwind `@custom-variant dark` |

## Behavior

1. **SSR** — root layout reads the cookie and sets `class="dark"` when needed.
2. **Anti-FOUC** — inline `getThemeInitScript()` in `<head>` syncs class + `colorScheme` before paint.
3. **Client** — `ThemeProvider` toggles class / cookie; `ThemeSwitcher` calls `toggleTheme`.

```
Page load → cookies() → <html class?> → init script → ThemeProvider hydrate
User click → toggleTheme → setThemeCookie + classList
```

## Key files

| File | Role |
|------|------|
| [`lib/theme-cookie.ts`](../../lib/theme-cookie.ts) | parse / get / set |
| [`lib/theme-script.ts`](../../lib/theme-script.ts) | blocking init script |
| [`components/shared/theme-provider.tsx`](../../components/shared/theme-provider.tsx) | context + DOM apply |
| [`components/shared/theme-switcher.tsx`](../../components/shared/theme-switcher.tsx) | toggle UI |
| [`app/layout.tsx`](../../app/layout.tsx) | SSR class + script + provider |
| [`app/globals.css`](../../app/globals.css) | tokens `:root` / `.dark` |

## Rules

- Do **not** re-wrap `ThemeProvider` on pages — once in root layout only.
- Keep the init script in the root layout.
- Labels from `dict.common.theme.*` (i18n).
- Prefer semantic tokens (`bg-background`, `text-foreground`) over hard-coded zinc/black when adding UI.

## Related

- [i18n.md](./i18n.md) · [ai-rules.md](./ai-rules.md) · [Docs index](../README.md)
