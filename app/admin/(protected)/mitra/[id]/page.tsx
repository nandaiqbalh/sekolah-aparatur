import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { PartnerForm } from "@/features/mitra/components/partner-form"
import { partnerService } from "@/features/mitra/services/partner-service"
import { parseEnumParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ jenis?: string }>
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function AdminMitraFormPage({ params, searchParams }: PageProps) {
  const { id } = await params

  if (id === "baru") {
    if (!(await canAccessPage("mitra.create"))) {
      return <AccessDenied />
    }
    const sp = await searchParams
    const kind = parseEnumParam(sp.jenis, ["university", "facilitator"] as const, "university")
    return <PartnerForm mode="create" kind={kind} />
  }

  if (!UUID_PATTERN.test(id)) notFound()
  if (!(await canAccessPage("mitra.update"))) {
    return <AccessDenied />
  }

  const partner = await partnerService.getById(id)
  if (!partner.ok || !partner.data) notFound()

  return <PartnerForm mode="edit" kind={partner.data.kind} partner={partner.data} />
}
