/**
 * Kontak resmi. Kosongkan sampai pemilik situs mengisi.
 * Jangan mengisi nomor atau alamat fiktif.
 */
export const siteContact = {
  address: null as string | null,
  phone: null as string | null,
  email: null as string | null,
  hours: null as string | null,
  /** Digit internasional tanpa tanda tambah, misalnya 6281234567890. */
  whatsappNumber: null as string | null,
}

export function whatsappHref(message?: string): string | null {
  const number = siteContact.whatsappNumber?.replace(/\D/g, "")
  if (!number) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${number}${text}`
}
