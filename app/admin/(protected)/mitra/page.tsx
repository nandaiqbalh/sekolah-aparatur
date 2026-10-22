import { Suspense } from "react"

import { AccessDenied } from "@/components/admin/access-denied"
import { PartnersManager } from "@/features/mitra/components/partners-manager"
import { partnerService } from "@/features/mitra/services/partner-service"
import { parseEnumParam, parsePageParam, parseSearchParam } from "@/lib/admin/parse-page-param"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

type PageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    jenis?: string
    status?: string
  }>
}

export default async function AdminMitraPage({ searchParams }: PageProps) {
  if (!(await canAccessPage("mitra.view"))) {
    return <AccessDenied />
  }

  const sp = await searchParams
  const page = parsePageParam(sp.page)
  const search = parseSearchParam(sp.search)
  const kind = parseEnumParam(sp.jenis, ["university", "facilitator"] as const, "university")
  const status = parseEnumParam(sp.status, ["all", "published", "hidden"] as const, "all")

  const partners = await partnerService.list({ page, limit: 20, search, kind, status })

  return (
    <Suspense>
      <PartnersManager
        initialData={
          partners.ok && partners.data
            ? partners.data
            : { partners: [], total: 0, page: 1, limit: 20, totalPages: 1 }
        }
      />
    </Suspense>
  )
}
