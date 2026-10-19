export type RecordAdminActivityInput = {
  actorId: string | null
  actorEmail: string
  action: string
  module: string
  entityType?: string | null
  entityId?: string | null
  summary: string
  metadata?: unknown
}

export type AdminActivityLogDto = {
  id: string
  actorId: string | null
  actorEmail: string
  action: string
  module: string
  entityType: string | null
  entityId: string | null
  summary: string
  metadata: unknown
  createdAt: string
}

export type ActivityLogListParams = {
  page?: number
  limit?: number
  modules?: string[]
  actorEmails?: string[]
  from?: string
  to?: string
}

export type ActivityLogActorOption = {
  email: string
  actorId: string | null
}

export type ActivityLogListResult = {
  items: AdminActivityLogDto[]
  total: number
  page: number
  limit: number
  totalPages: number
}
