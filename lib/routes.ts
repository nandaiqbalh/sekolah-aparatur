export const ROUTES = {
  home: "",
} as const

export const ADMIN_ROUTES = {
  home: "/admin",
  login: "/admin/login",
  profile: "/admin/profile",
  users: "/admin/system/users",
  roles: "/admin/system/roles",
  activityLogs: "/admin/system/activity-logs",
} as const

export function localizedPath(locale: string, route: string): string {
  return route ? `/${locale}/${route}` : `/${locale}`
}
