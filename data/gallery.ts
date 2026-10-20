export type GalleryAlbum = {
  slug: string
  title: string
  date: string
  category: string
  summary: string
  images: string[]
}

export const galleryCategories = ["Semua", "Daerah dan Desa", "Legislator"] as const

export const galleryAlbums: GalleryAlbum[] = [
  {
    slug: "sambutan-mahasiswa-baru-desa",
    title: "Sambutan mahasiswa baru Program Sarjana Aparatur Desa",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    summary: "Dokumentasi sambutan mahasiswa baru Program Sarjana Aparatur Daerah dan Desa.",
    images: ["/profile/daerah-000.png", "/profile/daerah-005.png"],
  },
  {
    slug: "sidang-sarjana-aparatur",
    title: "Suasana ruang sidang program sarjana aparatur",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    summary: "Suasana ruang sidang pada kegiatan Program Sarjana Aparatur Daerah dan Desa.",
    images: ["/profile/daerah-001.png", "/profile/daerah-003.png"],
  },
  {
    slug: "kuliah-umum-aparatur-desa",
    title: "Kuliah umum aparatur desa",
    date: "26 April 2024",
    category: "Daerah dan Desa",
    summary: "Kuliah umum peningkatan kualitas aparatur desa bagi mahasiswa baru RPL Administrasi Publik.",
    images: ["/profile/daerah-002.png", "/profile/daerah-000.png", "/profile/daerah-001.png"],
  },
  {
    slug: "kegiatan-borobudur-adkasi",
    title: "Kegiatan di Hotel Borobudur ADKASI",
    date: "15 Desember",
    category: "Daerah dan Desa",
    summary: "Dokumentasi kegiatan LPSDM Aparatur di Hotel Borobudur bersama ADKASI.",
    images: ["/profile/kegiatan-borobudur-adkasi.jpg"],
  },
  {
    slug: "kesepahaman-ucsi-unas-lpsdm",
    title: "Perbincangan kesepahaman UCSI, UNAS, dan LPSDM",
    date: "2025",
    category: "Legislator",
    summary: "Perbincangan kesepahaman antara UCSI, Universitas Nasional, dan LPSDM Aparatur.",
    images: ["/profile/unas-000.png"],
  },
  {
    slug: "perkuliahan-angkatan-1-dan-2",
    title: "Perkuliahan mahasiswa angkatan 1 dan 2",
    date: "2025",
    category: "Legislator",
    summary: "Dokumentasi perkuliahan mahasiswa angkatan 1 dan 2 Program Pascasarjana Sekolah Aparatur dan Legislator.",
    images: ["/profile/unas-001.png"],
  },
  {
    slug: "kelas-legislator-2025",
    title: "Kelas Legislator 2025",
    date: "2025",
    category: "Legislator",
    summary: "Dokumentasi Kelas Legislator tahun 2025.",
    images: ["/profile/unas-002.png", "/profile/unas-003.png"],
  },
]

export function getGalleryAlbum(slug: string): GalleryAlbum | undefined {
  return galleryAlbums.find((album) => album.slug === slug)
}

export function galleryCover(album: GalleryAlbum): string {
  return album.images[0] ?? ""
}
