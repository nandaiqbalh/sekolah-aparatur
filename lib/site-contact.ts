/**
 * Kontak dari profil LPSDM Aparatur (PDF daerah dan desa serta PDF UNAS).
 */
export const siteContact = {
  address: null as string | null,
  phones: ["+62 822-4962-1229", "+62 852-1917-7031", "+62 813-1141-4210"],
  email: "lpsdm.aparatur@gmail.com",
  website: "https://www.lpsdmaparatur.com",
  hours: null as string | null,
  /** Nomor yang tercantum di kedua profil. */
  whatsappNumber: "6282249621229",
}

export function whatsappHref(message?: string): string | null {
  const number = siteContact.whatsappNumber?.replace(/\D/g, "")
  if (!number) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${number}${text}`
}
