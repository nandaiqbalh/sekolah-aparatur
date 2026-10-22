import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { MessageDetail } from "@/features/pesan/components/message-detail"
import { messageService } from "@/features/pesan/services/message-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminPesanDetailPage({ params }: PageProps) {
  if (!(await canAccessPage("pesan.view"))) {
    return <AccessDenied />
  }

  const { id } = await params
  if (!UUID_PATTERN.test(id)) notFound()

  const message = await messageService.getById(id)
  if (!message.ok || !message.data) notFound()

  return <MessageDetail message={message.data} canUpdate={await canAccessPage("pesan.update")} />
}
