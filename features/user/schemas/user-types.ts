export type StaffRoleSummary = {
  id: string
  name: string
  slug: string
  isSystem: boolean
}

export type StaffUserDto = {
  id: string
  name: string
  username: string
  email: string
  isActive: boolean
  roles: StaffRoleSummary[]
  createdAt: string
  updatedAt: string
}

export type StaffUserListParams = {
  page?: number
  limit?: number
  search?: string
  roleId?: string
}

export type StaffUserListResult = {
  users: StaffUserDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
