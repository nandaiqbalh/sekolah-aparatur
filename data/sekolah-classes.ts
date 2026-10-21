export type RequirementGroup = {
  title: string
  items: string[]
}

export type SekolahClass = {
  slug: string
  title: string
  summary: string
  /** Program yang dipakai untuk rincian dan formulir pendaftaran. */
  programSlug: string
  image: string
  imageAlt: string
  requirementGroups: RequirementGroup[]
}

const desaRequirements: RequirementGroup[] = [
  {
    title: "Persyaratan program sarjana (S1) jalur RPL",
    items: [
      "Daftar riwayat hidup.",
      "Scan ijazah terakhir.",
      "Scan SK pengangkatan.",
      "Scan KTP.",
      "Scan kartu keluarga.",
      "Pasfoto 3x4 dengan latar putih.",
      "SKP (Sasaran Kinerja Perangkat) sudah tersedia. Sasaran kinerja bagi kepala desa dapat menyesuaikan tugas pokok dan fungsi.",
      "Melampirkan seluruh scan SK ketika bertugas.",
      "Melampirkan foto kegiatan, scan sertifikat, dan dokumen relevan yang mendukung.",
      "Buku harian yang memuat pekerjaan hari-hari yang dijalankan (format sudah tersedia).",
    ],
  },
]

const pemerintahDanLegislatorRequirements: RequirementGroup[] = [
  {
    title: "Persyaratan program sarjana (S1) jalur RPL",
    items: [
      "Daftar riwayat hidup.",
      "Scan ijazah terakhir.",
      "Scan SK pengangkatan.",
      "Scan KTP.",
      "Scan kartu keluarga.",
      "Pasfoto 3x4 dengan latar putih.",
      "SKP (Sasaran Kinerja Perangkat).",
      "Melampirkan seluruh scan SK ketika bertugas.",
      "Melampirkan foto kegiatan, scan sertifikat, dan dokumen relevan yang mendukung.",
    ],
  },
  {
    title: "Persyaratan program magister (S2) jalur RPL",
    items: [
      "Daftar riwayat hidup.",
      "Scan KTP.",
      "Scan legalisir ijazah S1 cap basah.",
      "Scan legalisir transkrip nilai S1 cap basah.",
      "Scan SK penyetaraan ijazah S1 oleh Dikti bagi lulusan luar negeri.",
      "Scan kartu keluarga.",
      "Pasfoto ukuran 3x4 dengan latar putih.",
      "Scan surat tugas atau SK pengangkatan.",
      "Scan sertifikat bimtek atau sertifikat kegiatan relevan lainnya sebagai dokumen pendukung.",
    ],
  },
  {
    title: "Persyaratan program doktor (S3) reguler",
    items: [
      "Scan KTP.",
      "Scan legalisir ijazah S1 dan S2 cap basah.",
      "Scan legalisir transkrip nilai S1 dan S2 cap basah.",
      "Scan SK penyetaraan ijazah S1 dan S2 oleh Dikti bagi lulusan luar negeri.",
      "Scan kartu keluarga.",
      "Pasfoto ukuran 3x4 dengan latar putih.",
      "Menyertakan pra-proposal disertasi.",
      "Mengikuti ujian masuk program studi.",
    ],
  },
]

export const sekolahClasses: SekolahClass[] = [
  {
    slug: "aparatur-pemerintah",
    title: "Kelas Aparatur Pemerintah Daerah",
    summary:
      "Program pendidikan tinggi bagi aparatur pemerintah dan pemerintah daerah melalui jalur Rekognisi Pembelajaran Lampau.",
    programSlug: "daerah-dan-desa",
    image: "/profile/aparatur-pemerintah-daerah.jpeg",
    imageAlt: "Kelas Aparatur Pemerintah Daerah",
    requirementGroups: pemerintahDanLegislatorRequirements,
  },
  {
    slug: "aparatur-desa",
    title: "Kelas Aparatur Desa",
    summary:
      "Program Sarjana (S1) dengan durasi 1,5–2 tahun dan Magister (S2) dengan durasi 1–1,5 tahun bagi perangkat desa melalui jalur Rekognisi Pembelajaran Lampau.",
    programSlug: "daerah-dan-desa",
    image: "/profile/aparatur-desa.jpeg",
    imageAlt: "Kelas Aparatur Desa",
    requirementGroups: desaRequirements,
  },
  {
    slug: "legislator",
    title: "Kelas Legislator",
    summary:
      "Program Pascasarjana Magister Ilmu Politik dan Doktor Administrasi Publik bagi legislator, tahun akademik 2026/2027.",
    programSlug: "legislator",
    image: "/profile/sekolah-legislator.jpeg",
    imageAlt: "Kelas Legislator",
    requirementGroups: pemerintahDanLegislatorRequirements,
  },
]

export function getSekolahClass(slug: string): SekolahClass | undefined {
  return sekolahClasses.find((item) => item.slug === slug)
}
