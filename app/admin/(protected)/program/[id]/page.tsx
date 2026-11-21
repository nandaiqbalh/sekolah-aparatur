import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { ProgramForm } from "@/features/program/components/program-form"
import { programService } from "@/features/program/services/program-service"
import { partnerService } from "@/features/mitra/services/partner-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminProgramFormPage({ params }: PageProps) {
  const { id } = await params
  const facilitators = (await partnerService.listPublished("facilitator")).map((item) => ({
    id: item.id,
    name: item.name,
    detail: item.detail ?? "",
  }))

  if (id === "baru") {
    if (!(await canAccessPage("program.create"))) {
      return <AccessDenied />
    }
    return <ProgramForm mode="create" facilitators={facilitators} />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("program.update"))) {
    return <AccessDenied />
  }

  const program = await programService.getById(id)
  if (!program.ok || !program.data) notFound()

  return <ProgramForm mode="edit" program={program.data} facilitators={facilitators} />
}
