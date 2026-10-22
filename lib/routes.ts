export const ROUTES = {
  home: "/",
  profil: "/profil",
  sekolahAparatur: "/sekolah-aparatur",
  aparaturPemerintah: "/sekolah-aparatur/aparatur-pemerintah",
  aparaturDesa: "/sekolah-aparatur/aparatur-desa",
  /** Alamat lama, diarahkan ke Kelas Aparatur Desa. */
  daerahDesa: "/sekolah-aparatur/daerah-dan-desa",
  legislator: "/sekolah-aparatur/legislator",
  berita: "/berita",
  galeri: "/galeri",
  kontak: "/kontak",
} as const

export const ADMIN_ROUTES = {
  home: "/admin",
  login: "/admin/login",
  profile: "/admin/profile",
  users: "/admin/system/users",
  roles: "/admin/system/roles",
  activityLogs: "/admin/system/activity-logs",
  informasi: "/admin/informasi",
  informasiNew: "/admin/informasi/baru",
  galeri: "/admin/galeri",
  galeriNew: "/admin/galeri/baru",
  profilLembaga: "/admin/profil-lembaga",
  mitra: "/admin/mitra",
  mitraNew: "/admin/mitra/baru",
  pendaftaran: "/admin/pendaftaran",
  pesan: "/admin/pesan",
  program: "/admin/program",
  programNew: "/admin/program/baru",
  kontak: "/admin/kontak",
} as const

export function adminInformasiPath(id: string): string {
  return `/admin/informasi/${id}`
}

export function adminGaleriPath(id: string): string {
  return `/admin/galeri/${id}`
}

export function adminMitraPath(id: string): string {
  return `/admin/mitra/${id}`
}

export function adminPendaftaranPath(id: string): string {
  return `/admin/pendaftaran/${id}`
}

export function adminPesanPath(id: string): string {
  return `/admin/pesan/${id}`
}

export function adminProgramPath(id: string): string {
  return `/admin/program/${id}`
}

export function programPath(slug: string): string {
  return `/sekolah-aparatur/${slug}`
}

export function localizedPath(_locale: string, route: string): string {
  if (!route || route === "/") return "/"
  return route.startsWith("/") ? route : `/${route}`
}

export function registrationPath(programSlug: string): string {
  return `/pendaftaran/${programSlug}`
}

export function newsPath(slug: string): string {
  return `/berita/${slug}`
}

export function galleryPath(slug: string): string {
  return `/galeri/${slug}`
}
