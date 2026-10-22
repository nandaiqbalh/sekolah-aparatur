import { notFound } from "next/navigation"

import { AccessDenied } from "@/components/admin/access-denied"
import { InstitutionProfileForm } from "@/features/profil/components/institution-profile-form"
import { institutionProfileService } from "@/features/profil/services/institution-profile-service"
import { canAccessPage } from "@/lib/auth/guard-page-permission"

export default async function AdminProfilLembagaPage() {
  if (!(await canAccessPage("profil.view"))) {
    return <AccessDenied />
  }

  const profile = await institutionProfileService.get()
  if (!profile) notFound()

  return (
    <InstitutionProfileForm
      profile={profile}
      canUpdate={await canAccessPage("profil.update")}
    />
  )
}
