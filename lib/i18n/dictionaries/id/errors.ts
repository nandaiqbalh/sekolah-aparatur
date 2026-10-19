const errors = {
  notFound: {
    title: "Halaman tidak ditemukan",
    description:
      "Halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.",
    cta: "Kembali ke Beranda",
  },
  error: {
    title: "Terjadi kesalahan",
    description:
      "Terjadi error yang tidak terduga. Silakan coba lagi atau kembali ke halaman beranda.",
    cta: "Kembali ke Beranda",
    retry: "Coba lagi",
  },
} as const

export default errors
