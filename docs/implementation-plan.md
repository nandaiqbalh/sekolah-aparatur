# Rencana implementasi — Sekolah Aparatur

## Audit starter

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI, Lucide, React Hook Form, Zod.
- Halaman publik di `app/(public)/`. Locale tanpa prefix URL. Cookie `locale`, default `id`.
- Admin di `app/admin/` dengan Prisma dan sesi. Tidak diubah pada tahap ini.
- Boleh dipakai ulang: `Accordion`, `Button`, `Input`, layout publik, `buildPageMetadata`, `ROUTES`.

## Struktur data dummy

- `data/programs.ts`, `data/news.ts`, `data/gallery.ts`, `data/home.ts`
- `lib/site-contact.ts` untuk telepon, email, alamat, dan WhatsApp

## Halaman

1. Layout, header, footer
2. Beranda
3. Profil
4. Pengantar Sekolah Aparatur
5. Daerah dan Desa
6. Legislator
7. Berita dan detail
8. Galeri
9. Kontak
10. Pendaftaran
11. Unduhan dokumen dan tombol WhatsApp

## Status

- [x] Dokumentasi requirement, sitemap, dan panduan UI
- [x] UI halaman publik
- [x] Lint, tes, dan build (`npm run lint`, `npm test` 15 lulus, `npm run build`)

## Menunggu konfirmasi pemilik situs

Logo, palet resmi, narasi lembaga, kurikulum, jadwal, biaya, persyaratan, kontak, nomor WhatsApp, berkas unduhan, serta berita dan foto yang boleh tayang.
