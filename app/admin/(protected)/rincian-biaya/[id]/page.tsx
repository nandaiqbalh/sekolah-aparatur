import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { FeeScheduleForm } from "@/features/biaya/components/fee-schedule-form"
import { feeScheduleService } from "@/features/biaya/services/fee-schedule-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminRincianBiayaFormPage({ params }: PageProps) {
  const { id } = await params

  if (id === "baru") {
    if (!(await canAccessPage("biaya.create"))) {
      return <AccessDenied />
    }
    return <FeeScheduleForm mode="create" />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("biaya.update"))) {
    return <AccessDenied />
  }

  const schedule = await feeScheduleService.getById(id)
  if (!schedule.ok || !schedule.data) notFound()

  return <FeeScheduleForm mode="edit" schedule={schedule.data} />
}
