export type UniversityProgramSeed = {
  programSlug: string
  /** Nama resmi mitra `kind=university` (harus cocok dengan partners). */
  partnerName: string
  study: string
  strata: "S1" | "S2" | "S3"
  concentration: string | null
}

export const universityProgramsTitle = "Program studi universitas penyelenggara"

/**
 * Seed awal dari Data AY — tiap baris terikat ke program (kelas)
 * dan mitra universitas penyelenggara.
 */
export const universityProgramSeeds: UniversityProgramSeed[] = [
  {
    programSlug: "legislator",
    partnerName: "Universitas Nasional",
    study: "Ilmu Politik",
    strata: "S2",
    concentration: "Politik dan Kebijakan Publik",
  },
  {
    programSlug: "legislator",
    partnerName: "Universitas Nasional",
    study: "Ilmu Politik",
    strata: "S3",
    concentration: "Politik Indonesia",
  },
  {
    programSlug: "legislator",
    partnerName: "Universitas Nasional",
    study: "Administrasi Publik",
    strata: "S3",
    concentration: "Teknologi Administrasi/Pelayanan Publik",
  },
  {
    programSlug: "legislator",
    partnerName: "Universitas Nasional",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Tata Negara",
  },
  {
    programSlug: "legislator",
    partnerName: "Universitas Nasional",
    study: "Ilmu Hukum",
    strata: "S3",
    concentration: "Ilmu Hukum",
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Ekasakti Padang",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Ekasakti Padang",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Hukum Tata Negara",
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Nurdin Hamzah Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Lancang Kuning Pekanbaru",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Lancang Kuning Pekanbaru",
    study: "Kebijakan Publik",
    strata: "S2",
    concentration: null,
  },
  {
    programSlug: "aparatur-desa",
    partnerName: "Universitas Muhammadiyah Tapanuli Selatan",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    partnerName: "Universitas Muara Bungo Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
]
