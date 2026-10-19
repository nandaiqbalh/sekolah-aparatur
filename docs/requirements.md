# Requirement — Sekolah Aparatur

## Latar belakang

Situs ini memperkenalkan Sekolah Aparatur sebagai lembaga pendidikan dan pengembangan kapasitas aparatur. Tahap ini hanya membangun tampilan publik dan konten dummy agar pemilik situs bisa meninjau struktur halaman sebelum data resmi tersedia.

## Tujuan

- Menyediakan profil lembaga.
- Mempromosikan program pendidikan dan pelatihan.
- Menyediakan informasi Sekolah Aparatur Daerah dan Desa serta Sekolah Legislator.
- Menampilkan berita dan dokumentasi kegiatan.
- Menyediakan formulir pendaftaran secara visual.
- Menyediakan layanan informasi dan kontak.

## Target pengguna

- Aparatur pemerintah.
- Perangkat desa dan kalurahan.
- Anggota legislatif.
- Calon peserta pendidikan dan pelatihan.
- Instansi pemerintah, lembaga, dan masyarakat yang membutuhkan informasi program.

## Kebutuhan fungsional

- Navigasi: Beranda, Profil, Sekolah Aparatur (submenu dua program), Berita, Galeri, Kontak, serta CTA pendaftaran.
- Halaman program menampilkan deskripsi, sasaran, materi, metode, jadwal, persyaratan, dokumen, biaya, FAQ, dan CTA. Data yang belum resmi ditandai placeholder.
- Daftar berita dan detail berdasarkan slug, dari data statis.
- Galeri foto dan video dengan filter kategori dan lightbox. Video hanya thumbnail, tanpa embed eksternal.
- Formulir kontak dan pendaftaran dengan validasi di peramban. Tidak mengirim atau menyimpan data.
- Daftar unduhan dokumen. Tombol unduh nonaktif sampai berkas asli ada.
- Tombol WhatsApp dari satu konfigurasi. Tanpa nomor resmi, tombol tidak membuka tautan.

## Kebutuhan nonfungsional

- Bahasa Indonesia di seluruh situs publik.
- Responsif pada mobile, tablet, dan desktop.
- HTML semantik, label formulir, kontras teks, dan focus state.
- Server Components sebagai default. Client Component hanya untuk menu, slider, lightbox, dan formulir.
- Admin, Prisma, dan autentikasi yang sudah ada tetap berjalan.

## Batasan tahap ini

Tidak ada backend, API, database baru, autentikasi baru, CMS, pengiriman formulir, penyimpanan pendaftar, pembayaran, WhatsApp API, email, peta eksternal, atau pemutar video eksternal.

## Asumsi yang perlu dikonfirmasi

- Identitas visual resmi (logo, warna, foto).
- Visi, misi, struktur organisasi, dan narasi lembaga.
- Kurikulum, jadwal, durasi, biaya, dan persyaratan tiap program.
- Nomor telepon, email, alamat, jam layanan, dan nomor WhatsApp.
- Berkas unduhan resmi.
- Berita dan dokumentasi kegiatan yang boleh dipublikasikan.
