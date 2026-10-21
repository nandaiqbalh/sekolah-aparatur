export type ProgramDocument = {
  name: string
  format: string
  size: string | null
  description: string
}

export type ProgramBlock =
  | { kind: "paragraphs"; title: string; paragraphs: string[] }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "table"; title: string; headers: string[]; rows: string[][] }
  | { kind: "steps"; title: string; steps: { title: string; body: string }[] }

export type ProgramHighlight = {
  title: string
  description: string
}

export type StudyProgram = {
  level: string
  name: string
  detail: string
}

export type RegistrationPeriod = {
  term: string
  detail: string
}

export type ProgramCampus = {
  name: string
  logo: string
  description: string
  address: string
}

export type Program = {
  slug: string
  title: string
  summary: string
  audience: string
  scheduleNote: string
  feeNote: string
  requirements: string[]
  documents: ProgramDocument[]
  /** Singkatan mitra fasilitator, sesuai `homeContent.facilitators`. */
  mitra: string[]
  highlights: ProgramHighlight[]
  studies: StudyProgram[]
  registrationPeriods: RegistrationPeriod[]
  campus: ProgramCampus
  sections: ProgramBlock[]
}

const registrationPeriods: RegistrationPeriod[] = [
  {
    term: "Semester ganjil",
    detail:
      "Sosialisasi pada Maret. Pendaftaran pada April–Juni. Seleksi Rekognisi Pembelajaran Lampau pada Juli, pengumuman pada Agustus, dan perkuliahan dimulai pada September.",
  },
  {
    term: "Semester genap",
    detail:
      "Sosialisasi pada Desember–Januari. Pemberkasan pada Januari–Februari. Seleksi pada Februari, serta pengumuman dan perkuliahan pada Maret.",
  },
]

const daerahDocuments: ProgramDocument[] = [
  {
    name: "Format daftar riwayat hidup / CV",
    format: "PDF",
    size: null,
    description: "Format daftar riwayat hidup untuk kelengkapan berkas pendaftaran. Unduhan akan diaktifkan setelah berkas tersedia.",
  },
  {
    name: "Format SKP perangkat dan kepala desa",
    format: "PDF",
    size: null,
    description: "Format sasaran kinerja perangkat dan kepala desa. Unduhan akan diaktifkan setelah berkas tersedia.",
  },
  {
    name: "Format buku harian pekerjaan",
    format: "PDF",
    size: null,
    description: "Format buku harian pekerjaan. Unduhan akan diaktifkan setelah berkas tersedia.",
  },
]

const legalBasis = [
  "UU Sisdiknas No. 20 Tahun 2003",
  "Peraturan Presiden Nomor 8 Tahun 2012 tentang Kerangka Kualifikasi Nasional Indonesia (KKNI)",
  "Peraturan Mendikbudristek Nomor 41 Tahun 2021 tentang Rekognisi Pembelajaran Lampau",
  "Keputusan Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi Nomor 162/E/KPT/2022",
  "MoU Kemendes PDTT, Kemendikbud, dan Kemendagri tahun 2021 tentang afirmasi pendidikan tinggi untuk desa",
]

export const programs: Program[] = [
  {
    slug: "daerah-dan-desa",
    title: "Program Sarjana Aparatur Daerah dan Desa",
    summary:
      "Program Sarjana (S1) dengan durasi 1,5–2 tahun dan Magister (S2) dengan durasi 1–1,5 tahun melalui jalur Rekognisi Pembelajaran Lampau.",
    audience:
      "Aparatur daerah dan perangkat desa, dengan dukungan Persatuan Perangkat Desa Indonesia (PPDI) serta Asosiasi Pemerintah Desa Seluruh Indonesia (APDESI).",
    scheduleNote:
      "Semester ganjil: sosialisasi pada Maret, pendaftaran pada April–Juni, seleksi RPL pada Juli, pengumuman pada Agustus, dan perkuliahan dimulai pada September. Semester genap: sosialisasi pada Desember–Januari, pemberkasan pada Januari–Februari, seleksi pada Februari, serta pengumuman dan perkuliahan pada Maret.",
    feeNote:
      "Biaya pendidikan disesuaikan dengan kebijakan universitas penyelenggara, dirancang seefisien mungkin, dan dibayarkan melalui sistem Uang Kuliah Tunggal (UKT). Program dapat didukung skema pendanaan Dana Desa sesuai ketentuan yang berlaku.",
    requirements: [
      "Daftar riwayat hidup (DRH) / curriculum vitae.",
      "Ijazah terakhir.",
      "Surat keputusan pengangkatan.",
      "Pindaian kartu tanda penduduk.",
      "Surat izin atasan.",
      "Sasaran kinerja perangkat; bagi kepala desa menyesuaikan tugas pokok dan fungsi.",
      "Foto formal dan kartu keluarga.",
      "Surat rekomendasi APDESI atau PPDI bagi pendaftar melalui jalur asosiasi. Berkas nomor 1 sampai 8 bersifat wajib.",
      "Seluruh surat keputusan selama masa tugas.",
      "Seluruh sertifikat yang diperoleh.",
      "Foto kegiatan beserta keterangan.",
      "Buku harian pekerjaan.",
      "Dokumen atau sertifikat pendukung lainnya. Seluruh berkas digabung dalam satu berkas PDF.",
    ],
    documents: daerahDocuments,
    mitra: ["PPDI", "APDESI"],
    highlights: [
      {
        title: "Sistem perkuliahan yang fleksibel",
        description:
          "Perkuliahan daring berlangsung secara sinkron dan asinkron. Pertemuan virtual dijadwalkan bersama dosen, sementara materi dapat diakses melalui Learning Management System (LMS) selama 24 jam.",
      },
      {
        title: "Durasi studi yang singkat",
        description:
          "Sarjana (S1) ditempuh 1,5–2 tahun. Magister (S2) jalur Rekognisi Pembelajaran Lampau ditempuh 1–1,5 tahun.",
      },
      {
        title: "Biaya yang terjangkau",
        description:
          "Biaya dirancang seefisien mungkin dan dibayarkan melalui Uang Kuliah Tunggal (UKT). Program dapat didukung skema pendanaan Dana Desa sesuai ketentuan yang berlaku.",
      },
    ],
    studies: [
      {
        level: "Sarjana (S1)",
        name: "Administrasi Publik",
        detail:
          "Ditempuh 1,5–2 tahun melalui jalur Rekognisi Pembelajaran Lampau. Diselenggarakan oleh Universitas Muhammadiyah Tapanuli Selatan.",
      },
      {
        level: "Magister (S2)",
        name: "Magister (S2)",
        detail: "Ditempuh 1–1,5 tahun melalui jalur Rekognisi Pembelajaran Lampau.",
      },
    ],
    registrationPeriods,
    campus: {
      name: "Universitas Muhammadiyah Tapanuli Selatan",
      logo: "/brand/um-tapsel.jpeg",
      description:
        "Program diselenggarakan oleh Universitas Muhammadiyah Tapanuli Selatan (UM-Tapsel), perguruan tinggi swasta di bawah naungan Persyarikatan Muhammadiyah yang didirikan pada tahun 1983. Akreditasi Program Studi Administrasi Publik (S1): Unggul.",
      address: "Jl. Sutan Mohd. Arief No. 32, Batang Ayumi Julu, Padangsidimpuan Utara, Kota Padangsidimpuan, Sumatera Utara 22733.",
    },
    sections: [
      {
        kind: "paragraphs",
        title: "Pengantar",
        paragraphs: [
          "Sejak diterapkannya kebijakan otonomi daerah, pembangunan di tingkat daerah mengalami kemajuan yang signifikan. Namun demikian, peningkatan tersebut belum sepenuhnya ditopang oleh ketersediaan sumber daya manusia yang memadai.",
          "Data tahun 2022 menunjukkan bahwa hanya 4,39 persen penduduk Indonesia berpendidikan Strata Satu (S-1) dan 1,28 persen berpendidikan Diploma Tiga (D-3). Program ini memberikan jalur bagi aparatur daerah dan desa untuk meraih gelar sarjana dan magister dalam waktu singkat melalui Rekognisi Pembelajaran Lampau.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Rekognisi Pembelajaran Lampau (RPL)",
        paragraphs: [
          "Rekognisi Pembelajaran Lampau (RPL) memberikan pengakuan atas capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja untuk diakui dalam pendidikan formal pada jenjang Sarjana (S-1).",
          "Capaian pembelajaran dari perguruan tinggi sebelumnya dapat diakui melalui asesmen untuk keperluan transfer kredit. Capaian dari pengalaman kerja, pelatihan, dan pembelajaran mandiri diakui melalui asesmen dan rekognisi untuk memperoleh satuan kredit semester (SKS).",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
    ],
  },
  {
    slug: "legislator",
    title: "Sekolah Aparatur dan Legislator",
    summary:
      "Program Pascasarjana Magister Ilmu Politik dan Doktor Administrasi Publik bagi aparatur negara dan legislator, tahun akademik 2026/2027.",
    audience:
      "Aparatur pemerintah pusat dan daerah; anggota DPR, DPRD provinsi, kabupaten, dan kota; anggota DPD; serta akademisi dan peneliti di bidang politik dan kebijakan publik.",
    scheduleNote:
      "Semester ganjil: sosialisasi pada Maret, pendaftaran pada April–Juni, seleksi RPL pada Juli, pengumuman pada Agustus, dan perkuliahan dimulai pada September. Semester genap: sosialisasi pada Desember–Januari, pemberkasan pada Januari–Februari, seleksi pada Februari, serta pengumuman dan perkuliahan pada Maret.",
    feeNote:
      "Magister (S-2) Ilmu Politik: Rp17.500.000 per semester, total Rp35.000.000 untuk dua semester, di luar biaya tugas akhir. Doktor (S-3) Administrasi Publik: Rp17.500.000 per semester, total Rp105.000.000 untuk enam semester, di luar biaya tugas akhir. Pembayaran melalui sistem UKT dan dapat diangsur.",
    requirements: [
      "Ijazah terakhir dan dokumen administrasi sesuai ketentuan universitas penyelenggara pada saat pendaftaran.",
      "Jalur RPL mensyaratkan asesmen atas capaian pembelajaran dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja.",
    ],
    documents: [],
    mitra: [],
    highlights: [
      {
        title: "Sistem perkuliahan yang fleksibel",
        description:
          "Pembelajaran campuran daring dan tatap muka. Magister berlangsung berbasis mata kuliah selama dua semester, kemudian penyusunan tesis. Doktor berfokus pada penelitian setelah studi terstruktur.",
      },
      {
        title: "Durasi studi yang singkat",
        description:
          "Magister Ilmu Politik jalur Rekognisi Pembelajaran Lampau ditempuh 1 tahun. Jalur reguler ditempuh 1,5–2 tahun. Doktor Administrasi Publik ditempuh 3 tahun.",
      },
      {
        title: "Biaya yang terjangkau",
        description:
          "Magister (S2) Ilmu Politik Rp17.500.000 per semester, total Rp35.000.000 untuk dua semester, di luar biaya tugas akhir. Doktor (S3) Administrasi Publik Rp17.500.000 per semester, total Rp105.000.000 untuk enam semester, di luar biaya tugas akhir. Pembayaran melalui UKT dan dapat diangsur.",
      },
    ],
    studies: [
      {
        level: "Magister (S2)",
        name: "Ilmu Politik",
        detail:
          "Konsentrasi Politik dan Kebijakan Publik, gelar M.Sos. Jalur Rekognisi Pembelajaran Lampau ditempuh 1 tahun. Jalur reguler ditempuh 1,5–2 tahun.",
      },
      {
        level: "Doktor (S3)",
        name: "Ilmu Administrasi Publik",
        detail: "Konsentrasi Teknologi Kebijakan dan Pelayanan Publik, gelar Dr. Ditempuh 3 tahun.",
      },
    ],
    registrationPeriods,
    campus: {
      name: "Universitas Nasional",
      logo: "/brand/universitas-nasional.png",
      description:
        "Universitas Nasional didirikan pada 15 Oktober 1949 di Jakarta dengan motto “Pionir Perubahan”. Akreditasi institusi: Unggul.",
      address: "Jl. Sawo Manila No. 61, RT 14/RW 7, Pejaten Barat, Pasar Minggu, Kota Jakarta Selatan, Daerah Khusus Jakarta 12520.",
    },
    sections: [
      {
        kind: "paragraphs",
        title: "Pengantar",
        paragraphs: [
          "Memasuki era transformasi menuju Visi Indonesia Emas 2045, ketersediaan sumber daya manusia unggul, khususnya aparatur negara di pusat dan daerah serta legislator, menjadi prasyarat utama. Peningkatan kompetensi melalui kualifikasi pendidikan formal merupakan keniscayaan.",
          "Sekolah Aparatur dan Legislator merupakan platform pendidikan tinggi yang mencakup program Magister (S2) dan Doktor (S3) di bidang politik, pemerintahan, dan kebijakan publik, dengan kurikulum interdisipliner, berbasis riset, dan praktik lapangan.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Rekognisi Pembelajaran Lampau (RPL)",
        paragraphs: [
          "Rekognisi Pembelajaran Lampau (RPL) mengakui capaian pembelajaran dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja. Transfer kredit dan pengakuan satuan kredit semester dilakukan setelah asesmen.",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
    ],
  },
]

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug)
}
