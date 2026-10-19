# Panduan UI — Sekolah Aparatur

## Arah

Tampilan lembaga pendidikan: tenang, mudah dipindai, dan kredibel. Ritme section mengikuti referensi layout (hero gelap, pengenalan terbelah, daftar layanan, sorotan kegiatan, langkah, pertanyaan, kontak, footer). Bukan salinan template pemasaran dan bukan dashboard admin.

## Palet sementara

Ditetapkan pada `.public-font` di `app/globals.css` supaya mudah diganti.

| Token | Nilai | Pemakaian |
|-------|--------|-----------|
| Navy | `#10192b` | Hero, footer, teks judul di atas gelap |
| Biru | `#1d4f91` | Tombol utama, tautan, aksen |
| Biru lembut | `#e8eef6` | Permukaan kartu dan section terang |
| Teks | `#142033` | Isi |
| Teks sekunder | `#5c6775` | Deskripsi |
| Latar | `#f5f7fa` | Halaman |

## Tipografi

Plus Jakarta Sans untuk judul dan isi situs publik. Ukuran judul dibatasi agar tetap terbaca di mobile. Jangan memakai huruf dekoratif untuk paragraf.

## Spacing dan bentuk

- Lebar konten `max-w-[1280px]`, padding horizontal `px-4` sampai `lg:px-8`.
- Hero beranda: teks di tengah, judul besar, latar navy menyatu dengan header.
- Section pengenalan: judul besar di kiri, media di kanan.
- Navigasi desktop: kelompok pill di tengah header, tombol pendaftaran pill di kanan.
- Section lain `py-16` sampai `py-28`.
- Radius kartu `rounded-2xl` atau lebih. Bayangan tipis, tanpa glassmorphism.

## Komponen

- Kartu: latar putih, border halus, satu judul, satu deskripsi, satu tautan.
- Input: label di atas field, error di bawah field.
- Accordion FAQ memakai komponen yang sudah ada.
- Gambar belum resmi memakai blok placeholder berlabel, bukan foto pihak ketiga.

## Responsif dan akses

- Menu mobile membuka panel tautan, termasuk submenu program.
- Grid kartu: 1 kolom di mobile, 2–3 di desktop.
- Setiap input punya `label` terkait.
- Gambar placeholder punya teks alternatif.
- Elemen interaktif punya `cursor-pointer` dan focus ring. Yang nonaktif memakai `cursor-not-allowed`.

## Konten dummy

Angka, biaya, jadwal, dan kutipan yang belum bersumber ditulis sebagai placeholder di data, bukan sebagai klaim lembaga.
