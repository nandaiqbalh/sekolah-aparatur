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

export type Program = {
  slug: string
  title: string
  summary: string
  audience: string
  scheduleNote: string
  feeNote: string
  requirements: string[]
  documents: ProgramDocument[]
  sections: ProgramBlock[]
}

const daerahDocuments: ProgramDocument[] = [
  {
    name: "Format daftar riwayat hidup / CV",
    format: "PDF",
    size: null,
    description: "Profil menyebut format sudah tersedia. Berkasnya belum diunggah di situs, jadi unduhan tetap nonaktif.",
  },
  {
    name: "Format SKP perangkat dan kepala desa",
    format: "PDF",
    size: null,
    description: "Profil menyebut format sasaran kinerja sudah tersedia. Berkasnya belum diunggah di situs.",
  },
  {
    name: "Format buku harian pekerjaan",
    format: "PDF",
    size: null,
    description: "Profil menyebut format buku harian sudah tersedia. Berkasnya belum diunggah di situs.",
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
      "Sarjana (S1) 1,5–2 tahun dan magister (S2) 1–1,5 tahun melalui jalur RPL di Universitas Muhammadiyah Tapanuli Selatan.",
    audience:
      "Aparatur daerah dan perangkat desa. Program didukung Persatuan Perangkat Desa Indonesia (PPDI) dan Asosiasi Pemerintah Desa Seluruh Indonesia (APDESI).",
    scheduleNote:
      "Semester ganjil: sosialisasi Maret, pendaftaran April–Juni, seleksi RPL Juli, pengumuman Agustus, kuliah September. Semester genap: sosialisasi Desember–Januari, pemberkasan Januari–Februari, seleksi Februari, pengumuman dan kuliah Maret.",
    feeNote:
      "Biaya mengikuti kebijakan universitas mitra, dirancang setara kuliah reguler, dan dibayar sebagai Uang Kuliah Tunggal (UKT). Profil menyebut pembiayaan dapat memakai Dana Desa atau sumber sah lain. Nominal rupiah tidak tercantum.",
    requirements: [
      "Daftar riwayat hidup / CV.",
      "Ijazah terakhir.",
      "SK pengangkatan.",
      "Pindaian KTP.",
      "Surat izin atasan.",
      "SKP. Bagi kepala desa, sasaran kinerja menyesuaikan tugas pokok.",
      "Foto formal dan kartu keluarga.",
      "Surat rekomendasi APDESI atau PPDI bagi pendaftar jalur asosiasi. Berkas 1–8 wajib.",
      "Seluruh SK selama bertugas.",
      "Seluruh sertifikat yang diperoleh.",
      "Foto kegiatan beserta keterangan.",
      "Buku harian pekerjaan.",
      "Dokumen atau sertifikat pendukung lain. Semua berkas dijadikan satu berkas PDF.",
    ],
    documents: daerahDocuments,
    sections: [
      {
        kind: "paragraphs",
        title: "Pengantar",
        paragraphs: [
          "Sejak otonomi daerah, pembangunan di daerah bergerak, tetapi belum sepenuhnya ditopang SDM yang memadai. Profil mengutip data 2022: 4,39 persen penduduk Indonesia berpendidikan strata satu, dan 1,28 persen diploma tiga.",
          "Program ini memberi jalur agar aparatur daerah dan desa meraih gelar sarjana dan magister dalam waktu singkat, melalui Rekognisi Pembelajaran Lampau.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Rekognisi Pembelajaran Lampau",
        paragraphs: [
          "RPL mengakui capaian pembelajaran dari pendidikan formal, nonformal, informal, dan pengalaman kerja untuk pendidikan formal jenjang sarjana. Capaian dari perguruan tinggi sebelumnya dapat ditransfer setelah asesmen. Capaian dari kerja, pelatihan, dan belajar mandiri diakui sebagai SKS setelah asesmen.",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
      {
        kind: "paragraphs",
        title: "Program studi dan kampus",
        paragraphs: [
          "Penyelenggara program sarjana adalah Universitas Muhammadiyah Tapanuli Selatan (UM-Tapsel), perguruan tinggi swasta di bawah Persyarikatan Muhammadiyah, berdiri tahun 1983. Misinya mengintegrasikan nilai keislaman agar lulusan berkarakter Islami, kompeten, dan inovatif.",
          "Akreditasi Program Studi Administrasi Publik (S1): Unggul.",
          "Alamat kampus: Jl. Sutan Mohd. Arief No. 32, Batang Ayumi Julu, Padangsidimpuan Utara, Kota Padangsidimpuan, Sumatera Utara 22733.",
        ],
      },
      {
        kind: "list",
        title: "Keunggulan",
        items: [
          "S1 diselesaikan maksimal 2 tahun. S2 maksimal 1,5 tahun.",
          "Kurikulum disusun untuk kebutuhan manajemen pemerintahan desa.",
          "Biaya ekonomis dengan sistem UKT.",
          "Diselenggarakan perguruan tinggi terakreditasi.",
          "Didukung beasiswa penuh dari pemerintah melalui skema Dana Desa.",
        ],
      },
      {
        kind: "list",
        title: "Fasilitas",
        items: [
          "Modul PDF dan dokumen, presentasi, serta rekaman video pembelajaran.",
          "Simulasi, video conference, dan virtual lab.",
          "Kuis, tugas, dan ujian daring.",
          "16 minggu pertemuan, UTS dan UAS, serta 14 sesi interaksi daring.",
          "Forum chat dosen dan mahasiswa, plus interaksi lewat video conference.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Sistem perkuliahan",
        paragraphs: [
          "Kuliah daring dengan metode sinkron dan asinkron. Sinkron berupa tatap muka virtual di Zoom pada jadwal bersama dosen. Asinkron berupa materi di LMS yang dapat diakses 24 jam.",
          "Dosen berkualifikasi minimal magister dan doktor, dengan pengalaman praktis di bidangnya.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Durasi",
        paragraphs: [
          "S1 ditempuh 1,5–2 tahun (3–4 semester). S2 ditempuh 1 tahun (2 semester) pada jalur RPL. Di bagian keunggulan, S2 disebut maksimal 1,5 tahun.",
        ],
      },
      {
        kind: "steps",
        title: "Tahapan",
        steps: [
          { title: "Rekrutmen peserta", body: "LPSDM Aparatur dan asosiasi." },
          { title: "Bimtek program dan RPL", body: "LPSDM Aparatur." },
          { title: "Pemberkasan dan asesmen awal", body: "LPSDM Aparatur." },
          { title: "Rekognisi dan registrasi", body: "Universitas mitra." },
          { title: "Perkuliahan", body: "Universitas mitra." },
          { title: "Ujian, yudisium, dan wisuda", body: "Universitas mitra." },
        ],
      },
      {
        kind: "table",
        title: "Kurikulum ringkas",
        headers: ["Tahap", "Isi", "Angka di profil"],
        rows: [
          ["1", "Mata kuliah dasar — mata kuliah universitas", "22"],
          ["3", "Mata kuliah prodi dan konsentrasi", "24"],
          ["5", "Ujian dan wisuda", "—"],
        ],
      },
      {
        kind: "paragraphs",
        title: "Kepengelolaan",
        paragraphs: [
          "Program dirancang LPSDM Aparatur dengan dukungan PPDI dan APDESI. Perkuliahan dijalankan universitas mitra yang sudah bekerja sama.",
          "LPSDM Aparatur terdiri dari akademisi dan praktisi di bidang ilmu politik, administrasi publik, dan ilmu pemerintahan.",
        ],
      },
      {
        kind: "steps",
        title: "Roadmap",
        steps: [
          { title: "Sosialisasi", body: "Pengenalan program kepada aparatur desa oleh PPDI kabupaten." },
          { title: "Pendaftaran daring", body: "Calon mahasiswa mengisi data pada tautan pendaftaran." },
          { title: "Bimtek dan pemberkasan", body: "LPSDM memandu pengisian dokumen RPL." },
          { title: "Asesmen RPL", body: "Tim asesor universitas menilai data dan dokumen." },
          { title: "Pengumuman hasil", body: "Hasil asesmen diumumkan rektor atau dekan." },
          { title: "Pengumuman dan registrasi", body: "Mahasiswa baru mengumumkan diri dan registrasi di universitas, termasuk pembayaran tahap 1." },
        ],
      },
    ],
  },
  {
    slug: "legislator",
    title: "Sekolah Aparatur dan Legislator",
    summary:
      "Magister Ilmu Politik dan doktor Administrasi Publik di Universitas Nasional, untuk aparatur dan legislator. Tahun ajaran 2026/2027.",
    audience:
      "Aparatur pemerintah pusat dan daerah, anggota DPR, DPRD provinsi, kabupaten, dan kota, anggota DPD, serta akademisi dan peneliti bidang politik dan kebijakan.",
    scheduleNote:
      "Semester ganjil: sosialisasi Maret, pendaftaran April–Juni, seleksi RPL Juli, pengumuman Agustus, kuliah September. Semester genap: sosialisasi Desember–Januari, pemberkasan Januari–Februari, seleksi Februari, pengumuman dan kuliah Maret.",
    feeNote:
      "S2 Ilmu Politik Rp17.500.000 per semester, total Rp35.000.000 untuk 2 semester, di luar tugas akhir. S3 Administrasi Publik Rp17.500.000 per semester, total Rp105.000.000 untuk 6 semester, di luar tugas akhir. Dibayar sebagai UKT dan dapat diangsur.",
    requirements: [
      "Ijazah terakhir dan dokumen administrasi mengikuti ketentuan universitas mitra pada saat pendaftaran.",
      "Jalur RPL membutuhkan asesmen atas pendidikan formal, nonformal, informal, dan pengalaman kerja.",
    ],
    documents: [],
    sections: [
      {
        kind: "paragraphs",
        title: "Pengantar",
        paragraphs: [
          "Menuju Visi Indonesia Emas 2045, kualitas aparatur negara dan legislator, di pusat maupun daerah, menentukan penyelenggaraan negara. Program ini meningkatkan kualifikasi formal mereka.",
          "Sekolah Aparatur dan Legislator mencakup magister dan doktor di bidang politik, pemerintahan, dan kebijakan publik. Kurikulumnya interdisipliner, berbasis riset, dan praktik lapangan.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Visi",
        paragraphs: [
          "Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam kebirokrasian, legislasi, politik, dan kebijakan publik; memperkuat kepemimpinan politik nasional; serta mendorong kebijakan yang berpihak pada rakyat.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Misi",
        paragraphs: [
          "Menyelenggarakan pendidikan magister dan doktor yang unggul, inklusif, dan relevan di bidang politik, pemerintahan, dan kebijakan publik. Pembelajaran adaptif dan hybrid, daring serta tatap muka.",
          "Mendorong riset kebijakan berbasis data dan kepentingan publik, serta ekosistem belajar yang menghubungkan akademisi, praktisi, dan masyarakat sipil.",
        ],
      },
      {
        kind: "list",
        title: "Program yang ditawarkan",
        items: [
          "Magister (S2) Ilmu Politik, konsentrasi Politik dan Kebijakan Publik. Gelar M.Sos. Kuliah dua semester, ujian tesis pada semester ketiga. Blended dan hybrid. Durasi RPL 1 tahun, reguler 1,5–2 tahun.",
          "Doktor (S3) Ilmu Administrasi Publik, konsentrasi Teknologi Kebijakan dan Pelayanan Publik. Gelar Dr. Dua semester studi terstruktur, kemudian penelitian. Durasi 3 tahun.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Sistem perkuliahan",
        paragraphs: [
          "S2 berlangsung tatap muka by course selama dua semester, lalu tesis. Metode campuran: daring dan tatap muka.",
          "S3 berfokus pada penelitian setelah studi terstruktur dua semester. Lulusan diharapkan kompeten pada kebijakan dan politik pemerintahan serta keilmuan sektor publik.",
        ],
      },
      {
        kind: "table",
        title: "Biaya",
        headers: ["Program", "Per semester", "Total", "Catatan"],
        rows: [
          ["S2 Ilmu Politik / Kebijakan Publik", "Rp17.500.000", "Rp35.000.000", "2 semester, di luar tugas akhir"],
          ["S3 Administrasi Publik", "Rp17.500.000", "Rp105.000.000", "6 semester, di luar tugas akhir"],
        ],
      },
      {
        kind: "paragraphs",
        title: "Rekognisi Pembelajaran Lampau",
        paragraphs: [
          "RPL mengakui capaian dari pendidikan formal, nonformal, informal, dan pengalaman kerja untuk jenjang sarjana dan magister. Transfer kredit dan pengakuan SKS dilakukan setelah asesmen.",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
      {
        kind: "list",
        title: "Keunggulan",
        items: [
          "Kurikulum menggabungkan ilmu politik, pemerintahan, dan kebijakan publik.",
          "Pembelajaran hybrid: tatap muka intensif dan kelas daring.",
          "Pengajar dari akademisi dan praktisi politik serta pemerintahan.",
          "Materi memadukan teori dan praktik.",
          "Kemitraan dengan lembaga legislatif serta organisasi politik dan kemasyarakatan.",
        ],
      },
      {
        kind: "list",
        title: "Fasilitas",
        items: [
          "Modul, presentasi, dan rekaman video pembelajaran.",
          "Simulasi, video conference, dan virtual lab.",
          "Kuis, tugas, dan ujian daring.",
          "16 minggu pertemuan, UTS dan UAS, serta interaksi daring.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Kampus penyelenggara",
        paragraphs: [
          "Universitas Nasional didirikan 15 Oktober 1949 di Jakarta. Motonya “Pionir Perubahan”. Akreditasi institusi: Unggul.",
          "Alamat: Jl. Sawo Manila No. 61, RT 14/RW 7, Pejaten Barat, Pasar Minggu, Kota Jakarta Selatan, Daerah Khusus Jakarta 12520.",
        ],
      },
      {
        kind: "table",
        title: "Kurikulum S3 Administrasi Publik",
        headers: ["Semester", "Mata kuliah", "SKS"],
        rows: [
          ["1", "Filsafat/teori administrasi kontemporer; Kebijakan publik; Perencanaan pembangunan", "9"],
          ["2", "Digitalisasi pelayanan publik; Tata kelola teknologi informasi; Metode riset administrasi publik; Pra-proposal disertasi", "12"],
          ["3", "Publikasi karya ilmiah; Proposal disertasi", "8"],
          ["4", "Seminar hasil penelitian disertasi", "4"],
          ["5", "Sidang disertasi tertutup", "5"],
          ["6", "Sidang terbuka / promosi doktor", "4"],
        ],
      },
      {
        kind: "table",
        title: "Kurikulum S2 Ilmu Politik",
        headers: ["Semester", "Mata kuliah", "SKS"],
        rows: [
          ["1", "Pemikiran politik", "3"],
          ["1", "Pemilu dan perwakilan politik", "3"],
          ["1", "Ekonomi politik", "3"],
          ["1", "Pembangunan politik", "3"],
          ["1", "Metode penelitian", "3"],
          ["2", "Teori politik / pemerintahan", "3"],
          ["2", "Budaya dan pemikiran politik Indonesia", "3"],
          ["2", "Kekuatan-kekuatan politik", "3"],
          ["2", "Media digital dan demokrasi", "3"],
          ["2", "Penulisan dan seminar proposal", "3"],
          ["3", "Kebijakan publik", "3"],
          ["3", "Kebijakan perencanaan pembangunan", "3"],
          ["3", "Politik lokal dan otonomi daerah", "3"],
          ["3", "Manajemen strategik pemerintahan daerah", "3"],
          ["3", "Seminar hasil penelitian", "5"],
          ["4", "Publikasi karya ilmiah", "4"],
          ["4", "Tesis", "6"],
        ],
      },
      {
        kind: "list",
        title: "Tim pengajar",
        items: [
          "Prof. Dr. Yudi Chrisnandi, M.E.",
          "Prof. Dr. Djohermansyah Djohan",
          "Prof. Dr. Umar Basalim, DES.",
          "Prof. Dr. Lili Romli",
          "Prof. Dr. Aris Munandar",
          "Prof. Dr. Paisal Halim",
          "Prof. Dr. Syarif Hidayat",
          "Prof. Dr. Muh. Nur Sadik, MPM",
          "Prof. Dr. Dra. Ernawati Chotim, M.Si.",
          "Prof. Dr. Lijan P. Sinambela, MM",
          "Prof. Dr. Sigit Rochadi, M.Si.",
          "Prof. Dr. Adjat Darajat, M.Si.",
          "Dr. Syaipudin, S.IP., M.Si.",
          "Firdaus Syam, M.A., Ph.D.",
          "Dr. Ramlan Siregar, M.Si.",
          "Dr. Aos Yuli Firdaus, S.I.P., M.Si.",
          "Dr. Andi Yusran, M.Si.",
          "Dr. M. Alfan Alfian Mahyudin, M.Si.",
          "Dr. Syafrizal Rambe, M.Si.",
          "Dr. Diana Fauzi, M.A.",
          "Dr. Syahrudin Lubis, M.A.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Fasilitator",
        paragraphs: [
          "Program dirancang LPSDM Aparatur dengan dukungan asosiasi dewan perwakilan rakyat pusat dan daerah serta pemerintah daerah. Perkuliahan bekerja sama dengan universitas mitra.",
          "LPSDM Aparatur beranggotakan akademisi dan praktisi ilmu politik, administrasi negara, dan ilmu pemerintahan.",
        ],
      },
      {
        kind: "steps",
        title: "Roadmap",
        steps: [
          {
            title: "Sosialisasi",
            body: "Pengenalan kepada aparatur daerah dan legislator: anggota DPR RI serta DPRD provinsi, kabupaten, dan kota.",
          },
          { title: "Pendaftaran daring", body: "Calon mahasiswa mengisi data pada tautan pendaftaran." },
          { title: "Bimtek dan pemberkasan", body: "LPSDM memandu pengisian dokumen RPL." },
          { title: "Asesmen RPL", body: "Tim asesor universitas menilai data dan dokumen." },
          { title: "Pengumuman hasil", body: "Hasil asesmen diumumkan rektor atau dekan." },
          { title: "Pengumuman dan registrasi", body: "Mahasiswa baru registrasi di universitas, termasuk pembayaran tahap 1." },
        ],
      },
    ],
  },
]

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug)
}
