import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { MessagesManager } from "@/features/pesan/components/messages-manager"
import { messageService } from "@/features/pesan/services/message-service"
import { messageStatuses } from "@/features/pesan/schemas/message"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

export default async function AdminPesanPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("pesan.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const status = parseEnumParam(sp.status, ["all", ...messageStatuses] as const, "all")
  const messages = await messageService.list({ page, limit: 20, search, status })

  return (
    <Suspense>
      <MessagesManager
        initialData={
          messages.ok && messages.data
            ? messages.data
            : { messages: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
