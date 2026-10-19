export type RolePermissionSummary = {
  id: string
  key: string
  module: string
  description: { en: string; id: string } | null
}

export type RoleDto = {
  id: string
  name: string
  slug: string
  description: string | null
  isSystem: boolean
  permissions: RolePermissionSummary[]
  userCount: number
  createdAt: string
  updatedAt: string
}

export type RoleListParams = {
  page?: number
  limit?: number
  search?: string
}

export type RoleListResult = {
  roles: RoleDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
