import { legalBasis } from "./programs"

export const INSTITUTION_PROFILE_KEY = "lembaga"

export const institutionProfileSeed = {
  key: INSTITUTION_PROFILE_KEY,
  heroEyebrow: "Profil program",
  heroTitle: "Program Sekolah Aparatur",
  heroDescription:
    "Lembaga pengelola program Sekolah Aparatur bagi aparatur daerah, perangkat desa, dan legislator.",
  lembagaImage: "/profile/image-profile.webp",
  lembagaBody:
    "LPSDM Aparatur merancang program secara akademik. Anggotanya terdiri atas akademisi dan praktisi di bidang ilmu politik, administrasi publik, administrasi negara, dan ilmu pemerintahan. Pelaksanaan perkuliahan dilakukan oleh universitas penyelenggara yang telah menjalin kerja sama.",
  latarBelakangParagraphs: [
    "Menuju Visi Indonesia Emas 2045, ketersediaan sumber daya manusia unggul, khususnya aparatur negara di pusat dan daerah serta legislator di DPR dan DPRD, menjadi prasyarat mutu penyelenggaraan pemerintahan. Peningkatan kompetensi melalui kualifikasi pendidikan formal merupakan keniscayaan.",
    "Dalam demokrasi yang terus berkembang, masih terdapat kesenjangan antara kualitas yang diharapkan dan kapasitas nyata birokrasi serta aktor politik. Sekolah Aparatur dan Legislator hadir sebagai pendidikan tinggi jenjang magister dan doktor di bidang politik, pemerintahan, dan kebijakan publik, guna memperkuat kepemimpinan yang berpihak pada rakyat serta kebijakan yang berbasis bukti.",
  ],
  latarBelakangPoints: [
    {
      title: "Indonesia Emas 2045",
      text: "Sumber daya manusia unggul sebagai prasyarat mutu pemerintahan.",
    },
    {
      title: "Aparatur negara",
      text: "Kompetensi aparatur di pusat dan daerah melalui pendidikan formal.",
    },
    {
      title: "Legislator",
      text: "Penguatan kapasitas anggota DPR dan DPRD di bidang kebijakan publik.",
    },
  ],
  visi: "Menghasilkan lulusan yang unggul, berintegritas, dan profesional dalam bidang kebirokrasian, legislasi, politik, dan kebijakan publik; memperkuat kapasitas kepemimpinan politik nasional; serta mendorong lahirnya kebijakan yang berpihak pada rakyat melalui pendidikan tinggi yang adaptif, berbasis riset, dan responsif terhadap tantangan zaman.",
  misi: [
    "Menyelenggarakan pendidikan tinggi yang unggul, inklusif, dan relevan pada jenjang sarjana, magister, dan doktor di bidang politik, pemerintahan, dan kebijakan publik.",
    "Merancang program melalui pendekatan pembelajaran adaptif dan hybrid learning.",
    "Mendorong riset kebijakan berbasis data dan kepentingan publik.",
    "Membangun ekosistem kolaboratif antara akademisi, praktisi, dan masyarakat sipil.",
  ],
  rplParagraphs: [
    "Rekognisi Pembelajaran Lampau (RPL) memberikan pengakuan atas capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal, dan/atau pengalaman kerja untuk diakui dalam pendidikan formal.",
    "Capaian pembelajaran yang diperoleh dari perguruan tinggi sebelumnya dapat diakui melalui asesmen untuk keperluan transfer kredit. Capaian dari pengalaman kerja, pelatihan, dan pembelajaran mandiri diakui melalui asesmen dan rekognisi untuk memperoleh Satuan Kredit Semester (SKS).",
    "Sarjana (S1) dan Magister (S2) diselenggarakan melalui jalur RPL. Doktor (S3) diselenggarakan melalui jalur reguler.",
  ],
  legalBasis: [...legalBasis],
}
