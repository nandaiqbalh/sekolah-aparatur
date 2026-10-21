export type SekolahClass = {
  slug: string
  title: string
  summary: string
  /** Program yang dipakai untuk rincian dan formulir pendaftaran. */
  programSlug: string
  image: string
  imageAlt: string
}

export const sekolahClasses: SekolahClass[] = [
  {
    slug: "aparatur-pemerintah",
    title: "Kelas Aparatur Pemerintah Daerah",
    summary:
      "Program pendidikan tinggi bagi aparatur pemerintah dan pemerintah daerah melalui jalur Rekognisi Pembelajaran Lampau.",
    programSlug: "daerah-dan-desa",
    image: "/profile/kegiatan-borobudur-adkasi.jpg",
    imageAlt: "Kegiatan Kelas Aparatur Pemerintah Daerah bersama ADKASI",
  },
  {
    slug: "aparatur-desa",
    title: "Kelas Aparatur Desa",
    summary:
      "Program Sarjana (S1) dengan durasi 1,5–2 tahun dan Magister (S2) dengan durasi 1–1,5 tahun bagi perangkat desa melalui jalur Rekognisi Pembelajaran Lampau.",
    programSlug: "daerah-dan-desa",
    image: "/profile/daerah-000.png",
    imageAlt: "Sambutan mahasiswa baru Kelas Aparatur Desa",
  },
  {
    slug: "legislator",
    title: "Kelas Legislator",
    summary:
      "Program Pascasarjana Magister Ilmu Politik dan Doktor Administrasi Publik bagi legislator, tahun akademik 2026/2027.",
    programSlug: "legislator",
    image: "/profile/hero-001.jpg",
    imageAlt: "Kegiatan Kelas Legislator",
  },
]

export function getSekolahClass(slug: string): SekolahClass | undefined {
  return sekolahClasses.find((item) => item.slug === slug)
}
