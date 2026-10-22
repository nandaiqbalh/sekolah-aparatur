import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { RegistrationsManager } from "@/features/registration/components/registrations-manager"
import { programService } from "@/features/program/services/program-service"
import { registrationService } from "@/features/registration/services/registration-service"
import { registrationStatuses } from "@/features/registration/schemas/registration"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    program?: string
    status?: string
  }>
}

export default async function AdminPendaftaranPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("pendaftaran.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const programs = await programService.listTitles()
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const program = parseEnumParam(
    sp.program,
    programs.map((item) => item.slug),
    "",
  )
  const status = parseEnumParam(sp.status, ["all", ...registrationStatuses] as const, "all")

  const registrations = await registrationService.list({
    page,
    limit: 20,
    search,
    program: program || undefined,
    status,
  })

  return (
    <Suspense>
      <RegistrationsManager
        programs={programs}
        initialData={
          registrations.ok && registrations.data
            ? registrations.data
            : { registrations: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
