export const ROUTES = {
  home: "/",
  profil: "/profil",
  sekolahAparatur: "/sekolah-aparatur",
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
} as const

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
