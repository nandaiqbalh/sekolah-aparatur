"use client"

import { createContext, useContext } from "react"

import { hasPermission } from "@/lib/auth/permissions"
import type { AuthUser } from "@/lib/auth/require-admin"

const PermissionsContext = createContext<AuthUser | null>(null)

export function AdminPermissionsProvider({
  roles,
  permissions,
  isSuperAdmin,
  children,
}: {
  roles: string[]
  permissions: string[]
  isSuperAdmin: boolean
  children: React.ReactNode
}) {
  return (
    <PermissionsContext
      value={{
        id: "",
        email: "",
        username: "",
        name: "",
        roles,
        permissions,
        isSuperAdmin,
      }}
    >
      {children}
    </PermissionsContext>
  )
}

export function usePermissions() {
  const user = useContext(PermissionsContext)
  if (!user) {
    throw new Error("usePermissions must be used within AdminPermissionsProvider")
  }

  return {
    roles: user.roles,
    permissions: user.permissions,
    isSuperAdmin: user.isSuperAdmin,
    can: (key: string) => hasPermission(user, key),
  }
}
