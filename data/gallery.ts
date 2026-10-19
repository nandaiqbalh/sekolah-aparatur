export type GalleryItem = {
  id: string
  title: string
  date: string
  category: string
  kind: "photo"
  image: string
}

export const galleryCategories = ["Semua", "Daerah dan Desa", "Legislator"] as const

export const galleryItems: GalleryItem[] = [
  {
    id: "sambutan-mahasiswa-baru-desa",
    title: "Sambutan mahasiswa baru Program Sarjana Aparatur Desa",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-000.png",
  },
  {
    id: "sidang-sarjana-aparatur",
    title: "Suasana ruang sidang program sarjana aparatur",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-001.png",
  },
  {
    id: "kuliah-umum-aparatur-desa",
    title: "Kuliah umum aparatur desa, 26 April 2024",
    date: "26 April 2024",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-002.png",
  },
  {
    id: "perkuliahan-daring-desa",
    title: "Perkuliahan daring program sarjana aparatur",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-003.png",
  },
  {
    id: "kelas-sarjana-aparatur",
    title: "Kelas program sarjana aparatur",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-004.png",
  },
  {
    id: "yudisium-sarjana-aparatur",
    title: "Yudisium program sarjana aparatur",
    date: "Profil 2026/2027",
    category: "Daerah dan Desa",
    kind: "photo",
    image: "/profile/daerah-005.png",
  },
  {
    id: "kesepahaman-ucsi-unas-lpsdm",
    title: "Perbincangan kesepahaman UCSI, UNAS, dan LPSDM",
    date: "2025",
    category: "Legislator",
    kind: "photo",
    image: "/profile/unas-000.png",
  },
  {
    id: "perkuliahan-angkatan-1-2",
    title: "Perkuliahan mahasiswa angkatan 1 dan 2",
    date: "2025",
    category: "Legislator",
    kind: "photo",
    image: "/profile/unas-001.png",
  },
  {
    id: "kelas-legislator-2025-a",
    title: "Kelas Legislator 2025",
    date: "2025",
    category: "Legislator",
    kind: "photo",
    image: "/profile/unas-002.png",
  },
  {
    id: "kelas-legislator-2025-b",
    title: "Kelas Legislator 2025",
    date: "2025",
    category: "Legislator",
    kind: "photo",
    image: "/profile/unas-003.png",
  },
]
