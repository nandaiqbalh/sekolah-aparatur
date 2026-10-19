export type ProgramDocument = {
  name: string
  format: string
  size: string | null
  description: string
}

export type ProgramFaq = {
  question: string
  answer: string
}

export type Program = {
  slug: string
  title: string
  summary: string
  description: string
  goals: string[]
  audience: string
  topics: string[]
  method: string
  scheduleNote: string
  requirements: string[]
  documents: ProgramDocument[]
  feeNote: string
  faqs: ProgramFaq[]
}

const placeholderSchedule =
  "Jadwal dan durasi belum ditetapkan. Informasi ini placeholder sampai kalender resmi terbit."

const placeholderFee =
  "Biaya program belum dipublikasikan. Angka tidak dicantumkan agar tidak terbaca sebagai tarif resmi."

const sharedDocuments: ProgramDocument[] = [
  {
    name: "Formulir pernyataan peserta",
    format: "PDF",
    size: null,
    description: "Berkas belum diunggah. Tombol unduh sengaja nonaktif.",
  },
  {
    name: "Daftar periksa kelengkapan",
    format: "PDF",
    size: null,
    description: "Daftar ini placeholder dan akan diganti berkas resmi.",
  },
]

export const programs: Program[] = [
  {
    slug: "daerah-dan-desa",
    title: "Sekolah Aparatur Daerah dan Desa",
    summary:
      "Program penguatan kapasitas aparatur daerah serta perangkat desa dan kalurahan.",
    description:
      "Program ini disiapkan bagi aparatur yang menangani pelayanan, tata kelola, dan pendampingan di tingkat daerah maupun desa. Uraian berikut adalah kerangka dummy untuk pratinjau tata letak, bukan kurikulum resmi.",
    goals: [
      "Memperkenalkan alur kerja pelayanan publik di tingkat daerah dan desa.",
      "Melatih cara menyusun prioritas kerja yang dapat dijelaskan kepada warga.",
      "Membiasakan dokumentasi kegiatan agar mudah ditinjau ulang.",
    ],
    audience:
      "Aparatur pemerintah daerah serta perangkat desa dan kalurahan. Kriteria peserta resmi masih menunggu keputusan lembaga.",
    topics: [
      "Tata kelola pemerintahan daerah dan desa",
      "Pelayanan publik dan komunikasi warga",
      "Perencanaan kegiatan tingkat lokal",
      "Etika aparatur dalam pekerjaan sehari-hari",
    ],
    method:
      "Kombinasi paparan, diskusi kelompok, dan latihan kasus. Metode final mengikuti panduan penyelenggara.",
    scheduleNote: placeholderSchedule,
    requirements: [
      "Peserta berasal dari instansi atau desa yang relevan. Surat tugas resmi menyusul.",
      "Bersedia mengikuti seluruh sesi pada gelombang yang dipilih.",
      "Kelengkapan administrasi akan diumumkan bersama pembukaan pendaftaran.",
    ],
    documents: sharedDocuments,
    feeNote: placeholderFee,
    faqs: [
      {
        question: "Apakah program ini sudah membuka pendaftaran?",
        answer:
          "Belum. Formulir di situs ini hanya pratinjau tampilan dan tidak mengirim data.",
      },
      {
        question: "Siapa yang boleh mengikuti?",
        answer:
          "Sasaran sementara adalah aparatur daerah serta perangkat desa. Ketentuan resmi belum terbit.",
      },
    ],
  },
  {
    slug: "legislator",
    title: "Sekolah Legislator",
    summary:
      "Program penguatan kapasitas bagi anggota dan calon anggota legislatif.",
    description:
      "Program ini membahas peran legislasi, pengawasan, dan penyerapan aspirasi dalam bahasa yang dapat dipraktikkan. Materi di halaman ini adalah kerangka dummy, bukan silabus yang sudah disahkan.",
    goals: [
      "Menjelaskan fungsi legislasi dan pengawasan secara operasional.",
      "Melatih penyusunan catatan rapat dan tindak lanjut.",
      "Membahas etika komunikasi dengan konstituen.",
    ],
    audience:
      "Anggota legislatif dan pihak yang dipersiapkan lembaga untuk mengikuti program. Daftar sasaran resmi belum dikunci.",
    topics: [
      "Fungsi legislasi dan pengawasan",
      "Penyerapan aspirasi",
      "Kerja sama dengan perangkat daerah",
      "Komunikasi publik yang dapat dipertanggungjawabkan",
    ],
    method:
      "Diskusi kasus, simulasi rapat, dan tinjauan dokumen. Rangkaian sesi final menunggu jadwal resmi.",
    scheduleNote: placeholderSchedule,
    requirements: [
      "Peserta memenuhi kriteria yang akan ditetapkan penyelenggara.",
      "Mengikuti tata tertib selama program berlangsung.",
      "Dokumen pendukung akan diumumkan saat pendaftaran dibuka.",
    ],
    documents: sharedDocuments,
    feeNote: placeholderFee,
    faqs: [
      {
        question: "Apakah ada biaya yang sudah ditetapkan?",
        answer: "Belum. Halaman ini tidak menampilkan tarif karena angka resminya belum ada.",
      },
      {
        question: "Bagaimana cara mendaftar nanti?",
        answer:
          "Tombol pendaftaran membuka formulir pratinjau. Pengiriman ke server belum dihubungkan.",
      },
    ],
  },
]

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug)
}
