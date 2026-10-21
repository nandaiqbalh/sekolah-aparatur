export type NewsArticle = {
  slug: string
  title: string
  category: string
  publishedAt: string
  summary: string
  thumbnail: string
  gallery: string[]
  /** Konten artikel dari HTML editor. */
  bodyHtml: string
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "penerimaan-sarjana-aparatur-2026",
    title: "Penerimaan mahasiswa baru sarjana aparatur desa dan daerah",
    category: "Penerimaan",
    publishedAt: "2026-09-01",
    summary:
      "Penerimaan mahasiswa baru program sarjana jalur RPL bagi aparatur desa dan aparatur daerah, semester ganjil tahun ajaran 2026/2027, diselenggarakan oleh Universitas Muhammadiyah Tapanuli Selatan.",
    thumbnail: "/informasi/pendaftaran-sarjana.jpeg",
    gallery: [],
    bodyHtml: `
<p>Penerimaan mahasiswa baru Program Sarjana untuk aparatur desa dan aparatur daerah jalur Rekognisi Pembelajaran Lampau (RPL) dibuka pada semester ganjil tahun ajaran 2026/2027.</p>
<p>Program diselenggarakan oleh Universitas Muhammadiyah Tapanuli Selatan pada Program Studi Administrasi Publik, Fakultas Ilmu Sosial dan Ilmu Politik, dengan gelar S.A.P. Pendaftaran dan pemberkasan gelombang terakhir berlangsung pada 1 September sampai 6 Oktober 2026.</p>
<img src="/informasi/pendaftaran-sarjana.jpeg" alt="Poster penerimaan mahasiswa baru program sarjana aparatur desa dan aparatur daerah" />
`.trim(),
  },
  {
    slug: "penerimaan-pascasarjana-sekolah-aparatur-2026",
    title: "Penerimaan mahasiswa baru pascasarjana Sekolah Aparatur",
    category: "Penerimaan",
    publishedAt: "2026-09-01",
    summary:
      "Penerimaan mahasiswa baru Program Pascasarjana Sekolah Aparatur angkatan ke-3, semester ganjil tahun akademik 2026/2027, diselenggarakan oleh Universitas Nasional.",
    thumbnail: "/informasi/pendaftaran-pascasarjana.jpeg",
    gallery: [],
    bodyHtml: `
<p>Penerimaan mahasiswa baru Program Pascasarjana Sekolah Aparatur dibuka untuk angkatan ke-3 pada semester ganjil tahun akademik 2026/2027. Program diselenggarakan oleh Universitas Nasional bagi aparatur pemerintah daerah dan anggota legislatif daerah.</p>
<p>Program yang ditawarkan meliputi Magister (S2) Ilmu Politik, konsentrasi Politik dan Kebijakan Publik, gelar M.Sos., jalur RPL dengan lama studi 1 tahun, serta Doktor (S3) Administrasi Publik, konsentrasi Teknologi Kebijakan dan Pelayanan Publik, gelar Dr., dengan lama studi 3 tahun. Pendaftaran dan pemberkasan berlangsung pada 1 September sampai 10 Oktober 2026.</p>
<img src="/informasi/pendaftaran-pascasarjana.jpeg" alt="Poster penerimaan mahasiswa baru program pascasarjana Sekolah Aparatur" />
`.trim(),
  },
  {
    slug: "penandatanganan-kerjasama-unas-adeksi",
    title: "Penandatanganan kerja sama Universitas Nasional, ADEKSI, dan LPSDM Aparatur",
    category: "Kerja sama",
    publishedAt: "2026-02-09",
    summary:
      "Penandatanganan kerja sama Universitas Nasional, Asosiasi DPRD Kota Seluruh Indonesia (ADEKSI), dan LPSDM Aparatur di Batam, 9 Februari 2026.",
    thumbnail: "/informasi/kerjasama-adeksi-2.jpeg",
    gallery: ["/informasi/kerjasama-adeksi-1.jpeg", "/informasi/kerjasama-adeksi-2.jpeg"],
    bodyHtml: `
<p>Universitas Nasional, Asosiasi DPRD Kota Seluruh Indonesia (ADEKSI), dan LPSDM Aparatur menandatangani kerja sama di Batam pada 9 Februari 2026.</p>
<p>Kerja sama ini menjadi bagian dari penguatan penyelenggaraan pendidikan tinggi bagi legislator melalui Sekolah Aparatur.</p>
`.trim(),
  },
  {
    slug: "penandatanganan-kerjasama-unas-adkasi",
    title: "Penandatanganan kerja sama Universitas Nasional, ADKASI, dan LPSDM Aparatur",
    category: "Kerja sama",
    publishedAt: "2025-07-15",
    summary:
      "Penandatanganan kerja sama Universitas Nasional, Asosiasi DPRD Kabupaten Seluruh Indonesia (ADKASI), dan LPSDM Aparatur di Jakarta, 15 Juli 2025.",
    thumbnail: "/informasi/kerjasama-adkasi-1.jpeg",
    gallery: ["/informasi/kerjasama-adkasi-1.jpeg", "/informasi/kerjasama-adkasi-2.jpeg"],
    bodyHtml: `
<p>Universitas Nasional, Asosiasi DPRD Kabupaten Seluruh Indonesia (ADKASI), dan LPSDM Aparatur menandatangani kerja sama di Jakarta pada 15 Juli 2025.</p>
<p>Kerja sama ini menjadi bagian dari penguatan penyelenggaraan pendidikan tinggi bagi legislator melalui Sekolah Aparatur.</p>
`.trim(),
  },
  {
    slug: "kesepahaman-ucsi-unas-lpsdm",
    title: "Perbincangan kesepahaman UCSI, UNAS, dan LPSDM",
    category: "Kerja sama",
    publishedAt: "2025-01-01",
    summary:
      "Perbincangan kesepahaman antara UCSI, Universitas Nasional, dan LPSDM Aparatur dalam rangka penguatan kerja sama pendidikan tinggi.",
    thumbnail: "/profile/unas-000.png",
    gallery: ["/profile/unas-000.png"],
    bodyHtml: `
<p>LPSDM Aparatur, Universitas Nasional, dan UCSI melaksanakan perbincangan kesepahaman untuk memperkuat kerja sama di bidang pendidikan tinggi bagi aparatur dan legislator.</p>
<p>Kegiatan ini merupakan bagian dari upaya memperluas jejaring kelembagaan dan meningkatkan mutu penyelenggaraan program Sekolah Aparatur.</p>
`.trim(),
  },
  {
    slug: "perkuliahan-angkatan-1-dan-2",
    title: "Perkuliahan mahasiswa angkatan 1 dan 2",
    category: "Perkuliahan",
    publishedAt: "2025-01-01",
    summary:
      "Dokumentasi perkuliahan mahasiswa angkatan 1 dan 2 pada Program Pascasarjana Sekolah Aparatur dan Legislator.",
    thumbnail: "/profile/unas-001.png",
    gallery: ["/profile/unas-001.png"],
    bodyHtml: `
<p>Perkuliahan mahasiswa angkatan 1 dan 2 Program Pascasarjana Sekolah Aparatur dan Legislator berlangsung sesuai kalender akademik yang ditetapkan bersama universitas penyelenggara.</p>
<p>Kegiatan perkuliahan mendukung peningkatan kualifikasi formal aparatur negara dan legislator melalui pendekatan pembelajaran yang adaptif.</p>
`.trim(),
  },
  {
    slug: "kelas-legislator-2025",
    title: "Kelas Legislator 2025",
    category: "Perkuliahan",
    publishedAt: "2025-01-01",
    summary: "Kelas Legislator tahun 2025 sebagai bagian dari Program Pascasarjana Sekolah Aparatur dan Legislator.",
    thumbnail: "/profile/unas-002.png",
    gallery: ["/profile/unas-002.png", "/profile/unas-003.png"],
    bodyHtml: `
<p>Kelas Legislator 2025 diselenggarakan dalam rangka peningkatan kapasitas anggota legislatif melalui pendidikan tinggi di bidang politik, pemerintahan, dan kebijakan publik.</p>
<p>Program ini menjadi salah satu jalur penguatan kompetensi formal bagi legislator di pusat dan daerah.</p>
`.trim(),
  },
  {
    slug: "kuliah-umum-aparatur-desa-2024",
    title: "Kuliah umum peningkatan kualitas aparatur desa",
    category: "Kuliah umum",
    publishedAt: "2024-04-26",
    summary:
      "Kuliah umum bagi mahasiswa baru RPL Administrasi Publik mengenai peningkatan kualitas aparatur desa, 26 April 2024.",
    thumbnail: "/profile/daerah-002.png",
    gallery: ["/profile/daerah-002.png", "/profile/daerah-000.png", "/profile/daerah-001.png"],
    bodyHtml: `
<p>Kuliah umum bertema “Peningkatan Kualitas Aparatur Desa dalam Pelaksanaan Pemerintahan dan Pembangunan di Provinsi Sumatera Utara” diselenggarakan bagi mahasiswa baru Rekognisi Pembelajaran Lampau pada program studi Administrasi Publik.</p>
<p>Kegiatan berlangsung pada 26 April 2024 pukul 17.00–18.30 WIB sebagai bagian dari rangkaian pengenalan program Sarjana Aparatur Daerah dan Desa.</p>
`.trim(),
  },
]

export function getArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug)
}

export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`))
}
