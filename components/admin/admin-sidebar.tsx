"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
import { ChevronDown, ClipboardList, GraduationCap, Handshake, Image as ImageIcon, Images, Landmark, LayoutDashboard, LogOut, Mail, Menu, Newspaper, Phone, ScrollText, Shield, User, Users, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { logoutAction } from "@/features/auth/actions/auth-actions"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { LocaleSwitcher } from "@/components/shared/locale-switcher"
import { ADMIN_ROUTES } from "@/lib/routes"
import type { Locale } from "@/lib/i18n/config"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

type NavLabelKey =
  | "dashboard"
  | "users"
  | "roles"
  | "activityLogs"
  | "informasi"
  | "galeri"
  | "profilLembaga"
  | "hero"
  | "mitra"
  | "pendaftaran"
  | "pesan"
  | "program"
  | "kontak"
  | "navSectionSystem"
  | "navSectionContent"
  | "navGroupAdministration"

type NavItem = {
  href: string
  labelKey: NavLabelKey
  icon: React.ElementType
  permission?: string
  exact?: boolean
}

type NavGroup = {
  id: string
  labelKey?: NavLabelKey
  items: NavItem[]
}

type NavSection = {
  id: string
  labelKey?: NavLabelKey
  groups: NavGroup[]
}

const navSections: NavSection[] = [
  {
    id: "overview",
    groups: [
      {
        id: "main",
        items: [
          {
            href: ADMIN_ROUTES.home,
            labelKey: "dashboard",
            icon: LayoutDashboard,
            permission: "dashboard.view",
            exact: true,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    labelKey: "navSectionContent",
    groups: [
      {
        id: "profil-lembaga",
        items: [
          {
            href: ADMIN_ROUTES.profilLembaga,
            labelKey: "profilLembaga",
            icon: Landmark,
            permission: "profil.view",
          },
        ],
      },
      {
        id: "hero",
        items: [
          {
            href: ADMIN_ROUTES.hero,
            labelKey: "hero",
            icon: ImageIcon,
            permission: "hero.view",
          },
        ],
      },
      {
        id: "pendaftaran",
        items: [
          {
            href: ADMIN_ROUTES.pendaftaran,
            labelKey: "pendaftaran",
            icon: ClipboardList,
            permission: "pendaftaran.view",
          },
        ],
      },
      {
        id: "pesan",
        items: [
          {
            href: ADMIN_ROUTES.pesan,
            labelKey: "pesan",
            icon: Mail,
            permission: "pesan.view",
          },
        ],
      },
      {
        id: "program",
        items: [
          {
            href: ADMIN_ROUTES.program,
            labelKey: "program",
            icon: GraduationCap,
            permission: "program.view",
          },
        ],
      },
      {
        id: "informasi",
        items: [
          {
            href: ADMIN_ROUTES.informasi,
            labelKey: "informasi",
            icon: Newspaper,
            permission: "informasi.view",
          },
        ],
      },
      {
        id: "galeri",
        items: [
          {
            href: ADMIN_ROUTES.galeri,
            labelKey: "galeri",
            icon: Images,
            permission: "galeri.view",
          },
        ],
      },
      {
        id: "mitra",
        items: [
          {
            href: ADMIN_ROUTES.mitra,
            labelKey: "mitra",
            icon: Handshake,
            permission: "mitra.view",
          },
        ],
      },
      {
        id: "kontak",
        items: [
          {
            href: ADMIN_ROUTES.kontak,
            labelKey: "kontak",
            icon: Phone,
            permission: "kontak.view",
          },
        ],
      },
    ],
  },
  {
    id: "system",
    labelKey: "navSectionSystem",
    groups: [
      {
        id: "administration",
        labelKey: "navGroupAdministration",
        items: [
          {
            href: ADMIN_ROUTES.users,
            labelKey: "users",
            icon: Users,
            permission: "users.view",
          },
          {
            href: ADMIN_ROUTES.roles,
            labelKey: "roles",
            icon: Shield,
            permission: "roles.view",
          },
          {
            href: ADMIN_ROUTES.activityLogs,
            labelKey: "activityLogs",
            icon: ScrollText,
            permission: "activity_logs.view",
          },
        ],
      },
    ],
  },
]

function isNavItemActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function filterNavSections(sections: NavSection[], can: (key: string) => boolean): NavSection[] {
  return sections
    .map((section) => ({
      ...section,
      groups: section.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.permission || can(item.permission)),
        }))
        .filter((group) => group.items.length > 0),
    }))
    .filter((section) => section.groups.length > 0)
}

function getLabel(dict: ReturnType<typeof useDictionary>, key: NavLabelKey): string {
  switch (key) {
    case "dashboard":
      return dict.admin.nav.dashboard
    case "users":
      return dict.admin.nav.users
    case "roles":
      return dict.admin.nav.roles
    case "activityLogs":
      return dict.admin.nav.activityLogs
    case "informasi":
      return dict.admin.nav.informasi
    case "galeri":
      return dict.admin.nav.galeri
    case "profilLembaga":
      return dict.admin.nav.profilLembaga
    case "hero":
      return dict.admin.nav.hero
    case "mitra":
      return dict.admin.nav.mitra
    case "pendaftaran":
      return dict.admin.nav.pendaftaran
    case "pesan":
      return dict.admin.nav.pesan
    case "program":
      return dict.admin.nav.program
    case "kontak":
      return dict.admin.nav.kontak
    case "navSectionSystem":
      return dict.admin.navSectionSystem
    case "navSectionContent":
      return dict.admin.navSectionContent
    case "navGroupAdministration":
      return dict.admin.navGroupAdministration
    default:
      return key
  }
}

function NavCount({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null
  const text = count > 99 ? "99+" : String(count)
  return (
    <span
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
      aria-label={label}
    >
      {text}
    </span>
  )
}

export function AdminSidebar({
  userName,
  locale,
  incomingRegistrations,
  incomingMessages,
}: {
  userName: string
  locale: Locale
  incomingRegistrations: number
  incomingMessages: number
}) {
  const dict = useDictionary()
  const { can } = usePermissions()
  const pathname = usePathname()
  const [manualState, setManualState] = useState<string | null | undefined>(undefined)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const visibleSections = filterNavSections(navSections, can)
  const visibleGroups = visibleSections.flatMap((section) => section.groups)

  function incomingBadge(labelKey: NavLabelKey) {
    if (labelKey === "pendaftaran") {
      return {
        count: incomingRegistrations,
        label: dict.admin.dashboard.incomingBadge.replace("{count}", String(incomingRegistrations)),
      }
    }
    if (labelKey === "pesan") {
      return {
        count: incomingMessages,
        label: dict.admin.dashboard.incomingMessagesBadge.replace("{count}", String(incomingMessages)),
      }
    }
    return null
  }

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setManualState(undefined)
    setMobileOpen(false)
  }

  const activeGroup = (() => {
    for (const group of visibleGroups) {
      if (group.items.some((item) => isNavItemActive(pathname, item.href, item.exact))) {
        return group.id
      }
    }
    return null
  })()

  const expandedGroup = manualState === undefined ? activeGroup : manualState

  function toggleGroup(groupId: string) {
    const current = manualState === undefined ? activeGroup : manualState
    setManualState(current === groupId ? null : groupId)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  function linkClass(href: string, exact?: boolean, indented = false) {
    const isActive = isNavItemActive(pathname, href, exact)
    return cn(
      "flex cursor-pointer items-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
      indented ? "px-6" : "px-3",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    )
  }

  function renderNavGroup(group: NavGroup) {
    const isMulti = group.items.length > 1
    const isExpanded = expandedGroup === group.id

    if (!isMulti) {
      const item = group.items[0]
      const Icon = item.icon
      const badge = incomingBadge(item.labelKey)
      return (
        <Link
          key={group.id}
          href={item.href}
          prefetch={false}
          className={linkClass(item.href, item.exact)}
          onClick={closeMobile}
        >
          <Icon className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">{getLabel(dict, item.labelKey)}</span>
          {badge ? <NavCount count={badge.count} label={badge.label} /> : null}
        </Link>
      )
    }

    return (
      <div key={group.id} className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggleGroup(group.id)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            isExpanded
              ? "bg-muted/60 text-foreground"
              : "text-foreground/80 hover:bg-muted hover:text-foreground",
          )}
        >
          <span>{group.labelKey ? getLabel(dict, group.labelKey) : ""}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="space-y-0.5 overflow-hidden"
            >
              {group.items.map((item) => {
                const Icon = item.icon
                const badge = incomingBadge(item.labelKey)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className={linkClass(item.href, item.exact, true)}
                    onClick={closeMobile}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1">{getLabel(dict, item.labelKey)}</span>
                    {badge ? <NavCount count={badge.count} label={badge.label} /> : null}
                  </Link>
                )
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] flex h-14 items-center border-b border-border bg-background px-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted"
          aria-label={dict.admin.openMenu}
        >
          <Menu className="size-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center px-2">
          <Link
            href={ADMIN_ROUTES.home}
            prefetch={false}
            className="truncate text-base font-semibold tracking-tight"
            onClick={closeMobile}
          >
            {dict.admin.brand || SITE_NAME}
          </Link>
        </div>
        <div className="size-10 shrink-0" aria-hidden />
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out lg:relative lg:inset-y-0 lg:z-auto lg:h-full lg:w-72 lg:shrink-0 lg:translate-x-0 lg:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="relative border-b border-border px-4 py-5">
          <Link
            href={ADMIN_ROUTES.home}
            prefetch={false}
            className="flex items-center gap-2"
            onClick={closeMobile}
          >
            <span className="truncate text-lg font-semibold tracking-tight">
              {dict.admin.brand || SITE_NAME}
            </span>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{dict.admin.cmsPanel}</p>
          <button
            type="button"
            onClick={closeMobile}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label={dict.admin.closeMenu}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {visibleSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {section.labelKey ? (
                <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {getLabel(dict, section.labelKey)}
                </p>
              ) : null}
              {section.groups.map((group) => renderNavGroup(group))}
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{userName}</p>
          <div className="mb-2 px-3">
            <LocaleSwitcher locale={locale} />
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={ADMIN_ROUTES.profile}
              prefetch={false}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={closeMobile}
            >
              <User className="size-4 shrink-0" />
              <span className="truncate">{dict.admin.nav.profile}</span>
            </Link>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={dict.admin.nav.logout}
            >
              <LogOut className="size-4" />
            </button>
          </div>

          <ConfirmDialog
            open={logoutOpen}
            onOpenChange={setLogoutOpen}
            type="warning"
            title={dict.admin.nav.logout}
            message={dict.admin.logoutConfirm}
            confirmLabel={dict.admin.nav.logout}
            cancelLabel={dict.admin.users.cancel}
            showCancel
            onConfirm={logoutAction}
          />
        </div>
      </aside>
    </>
  )
}
