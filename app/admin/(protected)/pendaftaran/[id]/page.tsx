import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { programService } from "@/features/program/services/program-service"
import { RegistrationDetail } from "@/features/registration/components/registration-detail"
import { registrationService } from "@/features/registration/services/registration-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminPendaftaranDetailPage({ params }: PageProps) {
  if (!(await canAccessPage("pendaftaran.view"))) {
    return <AccessDenied />
  }

  const { id } = await params
  if (!UUID_PATTERN.test(id)) notFound()

  const registration = await registrationService.getById(id)
  if (!registration.ok || !registration.data) notFound()

  const programs = await programService.listTitles()
  const programTitle =
    programs.find((item) => item.slug === registration.data.programSlug)?.title ?? registration.data.programSlug

  return (
    <RegistrationDetail
      registration={registration.data}
      programTitle={programTitle}
      canUpdate={await canAccessPage("pendaftaran.update")}
    />
  )
}
