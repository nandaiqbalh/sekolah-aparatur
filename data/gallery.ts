export type GalleryItem = {
  id: string
  title: string
  date: string
  category: string
  kind: "photo" | "video"
}

export const galleryCategories = ["Semua", "Pelatihan", "Diskusi", "Kunjungan"] as const

export const galleryItems: GalleryItem[] = [
  {
    id: "pelatihan-ruang-kelas",
    title: "Sesi pelatihan di ruang kelas",
    date: "12 Maret 2026",
    category: "Pelatihan",
    kind: "photo",
  },
  {
    id: "diskusi-kelompok",
    title: "Diskusi kelompok peserta",
    date: "20 Februari 2026",
    category: "Diskusi",
    kind: "photo",
  },
  {
    id: "rekaman-paparan",
    title: "Rekaman paparan materi",
    date: "18 Februari 2026",
    category: "Pelatihan",
    kind: "video",
  },
  {
    id: "kunjungan-balai",
    title: "Kunjungan ke balai pertemuan",
    date: "5 Februari 2026",
    category: "Kunjungan",
    kind: "photo",
  },
  {
    id: "forum-aparatur",
    title: "Forum aparatur daerah",
    date: "28 Januari 2026",
    category: "Diskusi",
    kind: "photo",
  },
  {
    id: "cuplikan-simulasi",
    title: "Cuplikan simulasi rapat",
    date: "15 Januari 2026",
    category: "Diskusi",
    kind: "video",
  },
]
