import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { UniversityProgramForm } from "@/features/prodi/components/university-program-form"
import { partnerService } from "@/features/mitra/services/partner-service"
import { universityProgramService } from "@/features/prodi/services/university-program-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminProgramStudiFormPage({ params }: PageProps) {
  const { id } = await params
  const universities = await partnerService.listOptions("university")

  if (id === "baru") {
    if (!(await canAccessPage("prodi.create"))) {
      return <AccessDenied />
    }
    return <UniversityProgramForm mode="create" universities={universities} />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("prodi.update"))) {
    return <AccessDenied />
  }

  const program = await universityProgramService.getById(id)
  if (!program.ok || !program.data) notFound()

  return <UniversityProgramForm mode="edit" program={program.data} universities={universities} />
}
