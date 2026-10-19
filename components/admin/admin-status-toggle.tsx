"use client"

import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { Button } from "@/components/ui/button"

export function AdminStatusToggle({
  isActive,
  loading,
  permission,
  activeLabel,
  inactiveLabel,
  activateLabel,
  deactivateLabel,
  onToggle,
}: {
  isActive: boolean
  loading?: boolean
  permission: string
  activeLabel: string
  inactiveLabel: string
  activateLabel: string
  deactivateLabel: string
  onToggle: () => void
}) {
  const { can } = usePermissions()
  const badge = (
    <AdminStatusBadge
      isActive={isActive}
      activeLabel={activeLabel}
      inactiveLabel={inactiveLabel}
    />
  )

  if (!can(permission)) return badge

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={onToggle}
      aria-label={isActive ? deactivateLabel : activateLabel}
      className="h-auto p-0 hover:bg-transparent"
    >
      {badge}
    </Button>
  )
}
