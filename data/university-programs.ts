export type UniversityProgramSeed = {
  programSlug: string
  university: string
  study: string
  strata: "S1" | "S2" | "S3"
  concentration: string | null
}

export const universityProgramsTitle = "Program studi universitas penyelenggara"

/** Seed awal dari Data AY — tiap baris terikat ke program (kelas). */
export const universityProgramSeeds: UniversityProgramSeed[] = [
  {
    programSlug: "legislator",
    university: "Univ. Nasional",
    study: "Ilmu Politik",
    strata: "S2",
    concentration: "Politik dan Kebijakan Publik",
  },
  {
    programSlug: "legislator",
    university: "Univ. Nasional",
    study: "Ilmu Politik",
    strata: "S3",
    concentration: "Politik Indonesia",
  },
  {
    programSlug: "legislator",
    university: "Univ. Nasional",
    study: "Administrasi Publik",
    strata: "S3",
    concentration: "Administrasi Publik / Teknologi Pelayanan Publik",
  },
  {
    programSlug: "legislator",
    university: "Univ. Nasional",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Hukum Tata Negara",
  },
  {
    programSlug: "legislator",
    university: "Univ. Nasional",
    study: "Ilmu Hukum",
    strata: "S3",
    concentration: "Hukum Tata Negara",
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Univ Ekasakti Padang",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Univ Ekasakti Padang",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Hukum Tata Negara",
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Univ Nurdin Hamzah Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Univ Lancang Kuning Pekanbaru",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Univ Lancang Kuning Pekanbaru",
    study: "Kebijakan Publik",
    strata: "S2",
    concentration: null,
  },
  {
    programSlug: "aparatur-desa",
    university: "Universitas Muhammadiyah Tapsel",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
  },
  {
    programSlug: "aparatur-pemerintah",
    university: "Universitas Muara Bungo Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
  },
]
