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
