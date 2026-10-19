# Backoffice UI conventions

Admin UI lives under [`components/admin/`](../../components/admin/) (shell) and [`features/*/components/`](../../features/) (domain screens). Routes: `app/admin/**`.

## Mandatory patterns

### 1. List pages — URL-backed filters + pagination

- Server page parses `searchParams` via [`lib/admin/parse-page-param.ts`](../../lib/admin/parse-page-param.ts)
- Client manager uses [`hooks/use-url-page.ts`](../../hooks/use-url-page.ts) (`useUrlListParams`)
- Draft filters locally; commit on **Apply** (`AdminFilterActions`); reset page to 1 when filters change
- Do not debounce search — explicit Apply button

### 2. Pagination — numbered pages

Use [`AdminPagination`](../../components/admin/admin-pagination.tsx) with `onPageChange={setPage}` from `useUrlListParams`.

### 3. Select filters — show labels, not raw values

`SelectValue` must render label text via children function:

```tsx
<SelectValue placeholder={dict.admin.filterRole}>
  {(v) => roles.find((r) => r.id === v)?.name ?? v}
</SelectValue>
```

### 4. Form placeholders — i18n only

All input placeholders from `lib/i18n/dictionaries/{en,id}/admin.ts`.

### 5. Password fields — `PasswordInput`

Use [`components/ui/password-input.tsx`](../../components/ui/password-input.tsx), not plain `type="password"`.

### 6. Active/inactive status — badge toggle

Use `AdminStatusBadge` / `AdminStatusToggle`. Do not use eye icons for status.

### 7. Create/edit dialogs — `AdminFormDialog`

- Width `max-w-lg`
- Close only via X, Cancel, or successful submit (`intendedCloseOnly`)
- Footer: Cancel `outline`, Save primary

### 8. Delete — `ConfirmDialog`

Use [`components/ui/confirm-dialog.tsx`](../../components/ui/confirm-dialog.tsx) (`max-w-md`), not `window.confirm`.

### 9. Tables — `AdminTableCard`

Native `<table>` inside bordered card — not shadcn `Table` for list pages.

### 10. Toasts — title + description

Use [`lib/notification.ts`](../../lib/notification.ts): `toastSuccess(title, description)`.

## Shell layout

- [`app/admin/layout.tsx`](../../app/admin/layout.tsx) — Plus Jakarta Sans + `.admin-font`
- [`app/admin/(protected)/layout.tsx`](../../app/admin/(protected)/layout.tsx) — `.admin-shell`, sidebar + scrollable main
- Admin is always light theme (no theme toggle in sidebar)

## Reference implementation

See [`features/user/components/users-manager.tsx`](../../features/user/components/users-manager.tsx) for the canonical list CRUD pattern.

## Related

- [architecture.md](./architecture.md) · [forms.md](./forms.md) · [i18n.md](./i18n.md) · [theme.md](./theme.md)
