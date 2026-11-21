export type UniversityProgramSeed = {
  partnerName: string
  study: string
  strata: "S1" | "S2" | "S3"
  concentration: string | null
  forAparaturDesa: boolean
  forAparaturPemerintah: boolean
  forLegislator: boolean
}

export const universityProgramsTitle = "Program studi universitas penyelenggara"

/** Seed awal dari Data AY + checklist kelas. */
export const universityProgramSeeds: UniversityProgramSeed[] = [
  {
    partnerName: "Universitas Nasional",
    study: "Ilmu Politik",
    strata: "S2",
    concentration: "Politik dan Kebijakan Publik",
    forAparaturDesa: false,
    forAparaturPemerintah: false,
    forLegislator: true,
  },
  {
    partnerName: "Universitas Nasional",
    study: "Ilmu Politik",
    strata: "S3",
    concentration: "Politik Indonesia",
    forAparaturDesa: false,
    forAparaturPemerintah: false,
    forLegislator: true,
  },
  {
    partnerName: "Universitas Nasional",
    study: "Administrasi Publik",
    strata: "S3",
    concentration: "Teknologi Administrasi/Pelayanan Publik",
    forAparaturDesa: false,
    forAparaturPemerintah: false,
    forLegislator: true,
  },
  {
    partnerName: "Universitas Nasional",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Tata Negara",
    forAparaturDesa: false,
    forAparaturPemerintah: false,
    forLegislator: true,
  },
  {
    partnerName: "Universitas Nasional",
    study: "Ilmu Hukum",
    strata: "S3",
    concentration: "Ilmu Hukum",
    forAparaturDesa: false,
    forAparaturPemerintah: false,
    forLegislator: true,
  },
  {
    partnerName: "Universitas Ekasakti Padang",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Ekasakti Padang",
    study: "Ilmu Hukum",
    strata: "S2",
    concentration: "Hukum Tata Negara",
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Nurdin Hamzah Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Lancang Kuning Pekanbaru",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Lancang Kuning Pekanbaru",
    study: "Kebijakan Publik",
    strata: "S2",
    concentration: null,
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Muhammadiyah Tapanuli Selatan",
    study: "Ilmu Administrasi Publik",
    strata: "S1",
    concentration: null,
    forAparaturDesa: true,
    forAparaturPemerintah: false,
    forLegislator: false,
  },
  {
    partnerName: "Universitas Muara Bungo Jambi",
    study: "Ilmu Pemerintahan",
    strata: "S1",
    concentration: null,
    forAparaturDesa: false,
    forAparaturPemerintah: true,
    forLegislator: false,
  },
]
