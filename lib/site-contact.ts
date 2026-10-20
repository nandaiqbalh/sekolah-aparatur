/**
 * Kontak dari profil LPSDM Aparatur (PDF daerah dan desa serta PDF UNAS).
 */
export const siteContact = {
  address:
    "Menara Universitas Nasional, Lt. 5 Ruangan 505, Jl. Harsono RM No.1 9, RT.5/RW.4, Ragunan, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12550",
  phones: ["+62 822-4962-1229"],
  email: "lpsdm.aparatur@gmail.com",
  website: "https://www.lpsdmaparatur.com",
  hours: null as string | null,
  instagram: "https://www.instagram.com/lpsdm.aparatur/",
  facebook: "https://www.facebook.com/profile.php?id=61562050571202",
  /** Nomor WhatsApp/telepon resmi (satu nomor). */
  whatsappNumber: "6282249621229",
}

export function whatsappHref(message?: string): string | null {
  const number = siteContact.whatsappNumber?.replace(/\D/g, "")
  if (!number) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${number}${text}`
}
