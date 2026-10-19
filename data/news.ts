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
    slug: "penyusunan-kerangka-program",
    title: "Penyusunan kerangka program pendidikan aparatur",
    category: "Kegiatan",
    publishedAt: "2026-03-12",
    summary:
      "Tim penyusun menata urutan materi agar peserta memahami alur kerja sebelum masuk ke latihan kasus.",
    paragraphs: [
      "Catatan ini adalah artikel dummy untuk pratinjau halaman berita. Kegiatan yang disebut belum diverifikasi sebagai peristiwa resmi lembaga.",
      "Kerangka program memisahkan pengenalan lembaga, materi inti, dan latihan. Urutan itu membantu peserta melihat hubungan antar sesi.",
      "Naskah final, tanggal pelaksanaan, dan narasumber akan menggantikan teks ini setelah pemilik situs menyerahkan materi.",
    ],
  },
  {
    slug: "diskusi-pelayanan-desa",
    title: "Diskusi awal pelayanan di tingkat desa",
    category: "Diskusi",
    publishedAt: "2026-02-20",
    summary:
      "Forum membahas cara menjelaskan prosedur layanan agar warga tidak harus datang berulang tanpa kejelasan.",
    paragraphs: [
      "Artikel dummy ini menggambarkan jenis berita yang nanti bisa diisi dokumentasi nyata.",
      "Diskusi menekankan bahasa yang lugas, alur loket, dan catatan tindak lanjut. Tidak ada angka capaian karena datanya belum ada.",
      "Foto kegiatan akan ditambahkan ketika dokumentasi resmi tersedia.",
    ],
  },
  {
    slug: "catatan-fungsi-legislasi",
    title: "Catatan belajar fungsi legislasi",
    category: "Materi",
    publishedAt: "2026-01-28",
    summary:
      "Ringkasan bahan bacaan tentang membedakan fungsi legislasi, anggaran, dan pengawasan.",
    paragraphs: [
      "Teks ini placeholder bahan bacaan, bukan modul yang sudah disahkan.",
      "Peserta diajak membedakan dokumen perencanaan, catatan rapat, dan tindak lanjut agar tidak tercampur dalam satu berkas.",
      "Versi resmi modul akan menggantikan ringkasan ini.",
    ],
  },
  {
    slug: "agenda-pratinjau-situs",
    title: "Situs informasi dibuka untuk pratinjau internal",
    category: "Pengumuman",
    publishedAt: "2026-01-08",
    summary:
      "Halaman publik disiapkan agar struktur informasi bisa ditinjau sebelum data lembaga dilengkapi.",
    paragraphs: [
      "Pengumuman ini menjelaskan status situs pada tahap antarmuka.",
      "Formulir belum terhubung ke penyimpanan. Pengunjung tidak perlu mengirim data pribadi sungguhan.",
      "Masukan tata letak bisa disampaikan lewat kanal yang nanti dicantumkan di halaman kontak.",
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
