export type FeeLineSeed = {
  kind: "item" | "subtotal" | "total"
  label: string
  amount: number
  note?: string | null
}

export type FeeProgramGroupSeed = {
  title: string
  lines: FeeLineSeed[]
}

export type FeeScheduleSeed = {
  title: string
  subtitle: string
  groups: FeeProgramGroupSeed[]
}

export const unasFeeScheduleSeed: FeeScheduleSeed = {
  title: "Rincian Biaya Pendidikan Program Magister dan Doktor",
  subtitle: "Fakultas Ilmu Sosial dan Ilmu Politik — Universitas Nasional",
  groups: [
    {
      title: "Program Magister Ilmu Politik",
      lines: [
        { kind: "item", label: "Biaya UPS Semester I (Satu)", amount: 22_500_000 },
        { kind: "item", label: "Biaya UPS Semester II (Dua)", amount: 12_500_000 },
        { kind: "subtotal", label: "Subtotal Biaya Semester", amount: 35_000_000 },
        { kind: "item", label: "Sidang Proposal", amount: 1_500_000 },
        { kind: "item", label: "Sidang Seminar Hasil Penelitian", amount: 1_500_000 },
        { kind: "item", label: "Sidang Tesis", amount: 6_000_000 },
        { kind: "item", label: "Sumbangan Buku Perpustakaan", amount: 375_000 },
        {
          kind: "item",
          label: "Yudisium",
          amount: 400_000,
          note: "Sewaktu-waktu berubah mengikuti SK dan edaran Resmi",
        },
        {
          kind: "item",
          label: "Wisuda",
          amount: 3_750_000,
          note: "Sewaktu-waktu berubah mengikuti SK dan edaran Resmi",
        },
        { kind: "total", label: "Total Keseluruhan", amount: 48_525_000 },
      ],
    },
    {
      title: "Program Doktor Administrasi Publik",
      lines: [
        { kind: "item", label: "Biaya UPS Semester I (Satu)", amount: 21_000_000 },
        { kind: "item", label: "Biaya UPS Semester II (Dua)", amount: 21_000_000 },
        { kind: "item", label: "Biaya UPS Semester III (Tiga)", amount: 16_000_000 },
        { kind: "item", label: "Biaya UPS Semester IV (Empat)", amount: 16_000_000 },
        { kind: "item", label: "Biaya UPS Semester V (Lima)", amount: 16_000_000 },
        { kind: "item", label: "Biaya UPS Semester VI (Enam)", amount: 16_000_000 },
        { kind: "subtotal", label: "Subtotal Biaya Semester", amount: 106_000_000 },
        { kind: "item", label: "Ujian Pra Kualifikasi Doktor", amount: 5_000_000 },
        { kind: "item", label: "Ujian Proposal Disertasi", amount: 5_000_000 },
        { kind: "item", label: "Biaya Seminar Hasil Penelitian (Ujian Tertutup)", amount: 8_000_000 },
        { kind: "item", label: "Biaya Promosi Doktor (Ujian Terbuka)", amount: 9_000_000 },
        { kind: "item", label: "Biaya Bimbingan Disertasi", amount: 7_000_000 },
        { kind: "item", label: "Sumbangan Buku Perpustakaan", amount: 375_000 },
        {
          kind: "item",
          label: "Yudisium",
          amount: 400_000,
          note: "Sewaktu-waktu berubah mengikuti SK dan edaran Resmi",
        },
        {
          kind: "item",
          label: "Wisuda",
          amount: 3_750_000,
          note: "Sewaktu-waktu berubah mengikuti SK dan edaran Resmi",
        },
        { kind: "total", label: "Total Keseluruhan", amount: 144_525_000 },
      ],
    },
  ],
}
