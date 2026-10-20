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
      "Biaya pendidikan disesuaikan dengan kebijakan universitas mitra, dirancang seefisien mungkin, dan dibayarkan melalui sistem Uang Kuliah Tunggal (UKT). Program dapat didukung skema pendanaan Dana Desa sesuai ketentuan yang berlaku.",
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
        title: "Rekognisi Pembelajaran Lampau",
        paragraphs: [
          "Rekognisi Pembelajaran Lampau (RPL) memberikan pengakuan atas capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja untuk diakui dalam pendidikan formal pada jenjang Sarjana (S-1).",
          "Capaian pembelajaran dari perguruan tinggi sebelumnya dapat diakui melalui asesmen untuk keperluan transfer kredit. Capaian dari pengalaman kerja, pelatihan, dan pembelajaran mandiri diakui melalui asesmen dan rekognisi untuk memperoleh satuan kredit semester (SKS).",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
      {
        kind: "paragraphs",
        title: "Kampus penyelenggara",
        paragraphs: [
          "Program Sarjana diselenggarakan oleh Universitas Muhammadiyah Tapanuli Selatan (UM-Tapsel), perguruan tinggi swasta di bawah naungan Persyarikatan Muhammadiyah yang didirikan pada tahun 1983, dengan misi mengintegrasikan nilai-nilai keislaman untuk menghasilkan lulusan yang berkarakter Islami, kompeten, dan inovatif.",
          "Akreditasi Program Studi Administrasi Publik (S-1): Unggul. Alamat: Jl. Sutan Mohd. Arief No. 32, Batang Ayumi Julu, Padangsidimpuan Utara, Kota Padangsidimpuan, Sumatera Utara 22733.",
        ],
      },
      {
        kind: "list",
        title: "Keunggulan",
        items: [
          "Jenjang Strata Satu (S-1) dapat diselesaikan dalam waktu maksimal 2 tahun; Strata Dua (S-2) maksimal 1,5 tahun.",
          "Kurikulum dirancang secara spesifik untuk memenuhi kebutuhan manajemen pemerintahan desa.",
          "Biaya studi bersifat ekonomis dan menggunakan sistem Uang Kuliah Tunggal (UKT).",
          "Diselenggarakan oleh perguruan tinggi yang telah terakreditasi.",
          "Didukung beasiswa penuh dari pemerintah melalui skema pendanaan Dana Desa.",
        ],
      },
      {
        kind: "list",
        title: "Fasilitas",
        items: [
          "Modul (PDF dan dokumen), presentasi, serta rekaman video pembelajaran.",
          "Simulasi, konferensi video, dan laboratorium virtual.",
          "Kuis, tugas, dan ujian daring.",
          "Enam belas minggu sesi pertemuan, ujian tengah semester dan ujian akhir semester, serta empat belas sesi interaksi daring.",
          "Forum percakapan dosen dan mahasiswa serta interaksi melalui konferensi video.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Sistem perkuliahan",
        paragraphs: [
          "Perkuliahan diselenggarakan secara daring dengan metode sinkron dan asinkron. Metode sinkron dilaksanakan melalui pertemuan tatap muka virtual pada waktu yang dijadwalkan bersama dosen pengampu. Metode asinkron memungkinkan mahasiswa mengakses materi melalui Learning Management System (LMS) selama 24 jam.",
          "Seluruh mata kuliah diasuh oleh dosen berkualifikasi minimal Magister (S-2) dan Doktor (S-3), dengan latar belakang akademik yang kuat serta pengalaman praktis di bidangnya.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Durasi studi",
        paragraphs: [
          "Program Strata Satu (S-1) dapat ditempuh dalam 1,5–2 tahun (3–4 semester). Program Strata Dua (S-2) melalui jalur RPL dapat ditempuh dalam 1–1,5 tahun.",
        ],
      },
      {
        kind: "steps",
        title: "Tahapan",
        steps: [
          { title: "Rekrutmen peserta", body: "Dilaksanakan oleh LPSDM Aparatur bersama asosiasi mitra." },
          { title: "Bimbingan teknis program dan RPL", body: "Dilaksanakan oleh LPSDM Aparatur." },
          { title: "Pemberkasan dan asesmen awal", body: "Dilaksanakan oleh LPSDM Aparatur." },
          { title: "Rekognisi dan registrasi", body: "Dilaksanakan oleh universitas mitra." },
          { title: "Perkuliahan", body: "Dilaksanakan oleh universitas mitra." },
          { title: "Ujian, yudisium, dan wisuda", body: "Dilaksanakan oleh universitas mitra." },
        ],
      },
      {
        kind: "table",
        title: "Kurikulum ringkas",
        headers: ["Tahap", "Isi", "SKS"],
        rows: [
          ["1", "Mata kuliah dasar dan mata kuliah universitas", "22"],
          ["3", "Mata kuliah program studi dan konsentrasi", "24"],
          ["5", "Ujian dan wisuda", "—"],
        ],
      },
      {
        kind: "paragraphs",
        title: "Kepengelolaan",
        paragraphs: [
          "Program dirancang secara akademik oleh LPSDM Aparatur dengan dukungan PPDI dan APDESI. Pelaksanaan perkuliahan dilakukan oleh universitas mitra yang telah menjalin kerja sama.",
          "LPSDM Aparatur beranggotakan akademisi dan praktisi di bidang ilmu politik, administrasi publik, dan ilmu pemerintahan.",
        ],
      },
      {
        kind: "steps",
        title: "Peta jalan",
        steps: [
          { title: "Sosialisasi", body: "Pengenalan program kepada aparatur desa oleh PPDI tingkat kabupaten." },
          { title: "Pendaftaran daring", body: "Calon mahasiswa mengisi data melalui formulir pendaftaran." },
          { title: "Bimbingan teknis dan pemberkasan", body: "LPSDM Aparatur memandu pengisian dokumen RPL." },
          { title: "Asesmen RPL", body: "Tim asesor universitas menilai data dan dokumen calon peserta." },
          { title: "Pengumuman hasil", body: "Hasil asesmen diumumkan oleh rektor atau dekan." },
          { title: "Registrasi", body: "Mahasiswa baru melaksanakan registrasi di universitas mitra, termasuk pembayaran tahap pertama." },
        ],
      },
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
      "Ijazah terakhir dan dokumen administrasi sesuai ketentuan universitas mitra pada saat pendaftaran.",
      "Jalur RPL mensyaratkan asesmen atas capaian pembelajaran dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja.",
    ],
    documents: [],
    sections: [
      {
        kind: "paragraphs",
        title: "Pengantar",
        paragraphs: [
          "Memasuki era transformasi menuju Visi Indonesia Emas 2045, ketersediaan sumber daya manusia unggul, khususnya aparatur negara di pusat dan daerah serta legislator, menjadi prasyarat utama. Peningkatan kompetensi melalui kualifikasi pendidikan formal merupakan keniscayaan.",
          "Sekolah Aparatur dan Legislator merupakan platform pendidikan tinggi yang mencakup program Magister (S-2) dan Doktor (S-3) di bidang politik, pemerintahan, dan kebijakan publik, dengan kurikulum interdisipliner, berbasis riset, dan praktik lapangan.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Visi",
        paragraphs: [
          "Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam bidang kebirokrasian, legislasi, politik, dan kebijakan publik; memperkuat kapasitas kepemimpinan politik nasional; serta mendorong lahirnya kebijakan yang berpihak pada rakyat melalui pendidikan tinggi yang adaptif, berbasis riset, dan responsif terhadap tantangan zaman.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Misi",
        paragraphs: [
          "Menyelenggarakan pendidikan tinggi yang unggul, inklusif, dan relevan pada jenjang magister dan doktor di bidang politik, pemerintahan, dan kebijakan publik. Program dirancang melalui pendekatan pembelajaran adaptif dan hybrid learning, daring serta tatap muka.",
          "Mendorong riset kebijakan berbasis data dan kepentingan publik, serta membangun ekosistem kolaboratif antara akademisi, praktisi, dan masyarakat sipil.",
        ],
      },
      {
        kind: "list",
        title: "Program yang ditawarkan",
        items: [
          "Magister (S-2) Ilmu Politik, konsentrasi Politik dan Kebijakan Publik, gelar M.Sos. Perkuliahan dua semester dengan ujian tesis pada semester ketiga. Durasi jalur RPL 1 tahun; jalur reguler 1,5–2 tahun.",
          "Doktor (S-3) Ilmu Administrasi Publik, konsentrasi Teknologi Kebijakan dan Pelayanan Publik, gelar Dr. Dua semester studi terstruktur dilanjutkan penelitian. Durasi studi 3 tahun.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Sistem perkuliahan",
        paragraphs: [
          "Program Magister diselenggarakan secara tatap muka berbasis mata kuliah selama dua semester, dilanjutkan penyusunan tesis, dengan metode campuran daring dan tatap muka.",
          "Program Doktor berfokus pada penelitian setelah studi terstruktur selama dua semester. Lulusan diharapkan kompeten dalam kebijakan dan politik pemerintahan serta keilmuan sektor publik.",
        ],
      },
      {
        kind: "table",
        title: "Pembiayaan",
        headers: ["Program", "Per semester", "Total", "Keterangan"],
        rows: [
          ["S-2 Ilmu Politik / Kebijakan Publik", "Rp17.500.000", "Rp35.000.000", "Dua semester, di luar tugas akhir"],
          ["S-3 Administrasi Publik", "Rp17.500.000", "Rp105.000.000", "Enam semester, di luar tugas akhir"],
        ],
      },
      {
        kind: "paragraphs",
        title: "Rekognisi Pembelajaran Lampau",
        paragraphs: [
          "Rekognisi Pembelajaran Lampau (RPL) mengakui capaian pembelajaran dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja. Transfer kredit dan pengakuan satuan kredit semester dilakukan setelah asesmen.",
        ],
      },
      { kind: "list", title: "Dasar hukum", items: legalBasis },
      {
        kind: "list",
        title: "Keunggulan",
        items: [
          "Kurikulum menggabungkan ilmu politik, pemerintahan, dan kebijakan publik.",
          "Pembelajaran hybrid: tatap muka intensif dan kelas daring.",
          "Pengajar terdiri atas akademisi serta praktisi politik dan pemerintahan.",
          "Materi memadukan teori dan praktik.",
          "Kemitraan dengan lembaga legislatif serta organisasi politik dan kemasyarakatan.",
        ],
      },
      {
        kind: "list",
        title: "Fasilitas",
        items: [
          "Modul, presentasi, dan rekaman video pembelajaran.",
          "Simulasi, konferensi video, dan laboratorium virtual.",
          "Kuis, tugas, dan ujian daring.",
          "Enam belas minggu sesi pertemuan, ujian tengah semester dan ujian akhir semester, serta interaksi daring.",
        ],
      },
      {
        kind: "paragraphs",
        title: "Kampus penyelenggara",
        paragraphs: [
          "Universitas Nasional didirikan pada 15 Oktober 1949 di Jakarta dengan motto “Pionir Perubahan”. Akreditasi institusi: Unggul.",
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
          "Program dirancang secara akademik oleh LPSDM Aparatur dengan dukungan asosiasi dewan perwakilan rakyat di pusat dan daerah serta pemerintah daerah. Pelaksanaan perkuliahan dilakukan bersama universitas mitra.",
          "LPSDM Aparatur beranggotakan akademisi dan praktisi di bidang ilmu politik, administrasi negara, dan ilmu pemerintahan.",
        ],
      },
      {
        kind: "steps",
        title: "Peta jalan",
        steps: [
          {
            title: "Sosialisasi",
            body: "Pengenalan program kepada aparatur daerah dan legislator, termasuk anggota DPR RI serta DPRD provinsi, kabupaten, dan kota.",
          },
          { title: "Pendaftaran daring", body: "Calon mahasiswa mengisi data melalui formulir pendaftaran." },
          { title: "Bimbingan teknis dan pemberkasan", body: "LPSDM Aparatur memandu pengisian dokumen RPL." },
          { title: "Asesmen RPL", body: "Tim asesor universitas menilai data dan dokumen calon peserta." },
          { title: "Pengumuman hasil", body: "Hasil asesmen diumumkan oleh rektor atau dekan." },
          { title: "Registrasi", body: "Mahasiswa baru melaksanakan registrasi di universitas mitra, termasuk pembayaran tahap pertama." },
        ],
      },
    ],
  },
]

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug)
}
