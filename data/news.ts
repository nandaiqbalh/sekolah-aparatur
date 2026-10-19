export type NewsArticle = {
  slug: string
  title: string
  category: string
  publishedAt: string
  summary: string
  paragraphs: string[]
}

export const newsArticles: NewsArticle[] = [
  {
    slug: "kesepahaman-ucsi-unas-lpsdm",
    title: "Perbincangan kesepahaman UCSI, UNAS, dan LPSDM",
    category: "Kerja sama",
    publishedAt: "2025-01-01",
    summary:
      "Galeri profil pascasarjana mencatat perbincangan kesepahaman antara UCSI, Universitas Nasional, dan LPSDM Aparatur.",
    paragraphs: [
      "Keterangan ini diambil dari halaman galeri profil Sekolah Aparatur di Universitas Nasional. Tanggal hari pelaksanaan tidak tertulis di profil.",
      "Foto kegiatan ada di galeri situs, pada bagian pascasarjana aparatur dan legislator.",
    ],
  },
  {
    slug: "perkuliahan-angkatan-1-dan-2",
    title: "Perkuliahan mahasiswa angkatan 1 dan 2",
    category: "Perkuliahan",
    publishedAt: "2025-01-01",
    summary:
      "Profil pascasarjana menampilkan dokumentasi perkuliahan mahasiswa angkatan 1 dan 2.",
    paragraphs: [
      "Kegiatan ini disebut pada halaman galeri profil Universitas Nasional. Profil tidak merinci mata kuliah atau jumlah peserta.",
      "Dokumentasi foto dapat dilihat di galeri.",
    ],
  },
  {
    slug: "kelas-legislator-2025",
    title: "Kelas Legislator 2025",
    category: "Perkuliahan",
    publishedAt: "2025-01-01",
    summary: "Galeri profil mencatat Kelas Legislator pada tahun 2025.",
    paragraphs: [
      "Keterangan “Kelas Legislator (2025)” tercetak di halaman galeri profil Sekolah Aparatur Universitas Nasional.",
      "Foto kelas ada di galeri situs.",
    ],
  },
  {
    slug: "kuliah-umum-aparatur-desa-2024",
    title: "Kuliah umum peningkatan kualitas aparatur desa",
    category: "Kuliah umum",
    publishedAt: "2024-04-26",
    summary:
      "Spanduk pada foto galeri program sarjana mencatat kuliah umum bagi mahasiswa baru RPL administrasi publik, 26 April 2024.",
    paragraphs: [
      "Foto di profil Program Sarjana Aparatur Daerah dan Desa memuat kuliah umum “Peningkatan Kualitas Aparatur Desa dalam Pelaksanaan Pemerintahan dan Pembangunan di Provinsi Sumatera Utara”.",
      "Spanduk menyebut mahasiswa baru Rekognisi Pembelajaran Lampau, program studi administrasi publik, 26 April 2024, pukul 17.00–18.30 WIB.",
    ],
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
