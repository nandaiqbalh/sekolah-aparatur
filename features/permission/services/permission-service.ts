import "server-only"

import { actionSuccess, type ActionResult } from "@/lib/action-result"
import { permissionRepository } from "@/features/permission/repositories/permission-repository"
import type { PermissionSelectDto } from "@/features/permission/schemas/permission"

export const permissionService = {
  async listAll(): Promise<ActionResult<PermissionSelectDto[]>> {
    const permissions = await permissionRepository.findAllForSelect()
    return actionSuccess(
      permissions.map((p) => ({
        id: p.id,
        key: p.key,
        module: p.module,
        description: p.description as { en: string; id: string } | null,
      }))
    )
  },
}
