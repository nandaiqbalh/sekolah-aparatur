import { ProfileForm } from "@/features/auth/components/profile-form"
import { requireAdmin } from "@/lib/auth/require-admin"
import { redirect } from "next/navigation"
import { ADMIN_LOGIN_PATH } from "@/lib/auth/safe-redirect"
import { authService } from "@/features/auth/services/auth-service"

export default async function AdminProfilePage() {
  const auth = await requireAdmin()
  if (!auth.ok) redirect(ADMIN_LOGIN_PATH)

  const profile = await authService.getProfile(auth.data.id)
  if (!profile.ok || !profile.data) redirect(ADMIN_LOGIN_PATH)

  return (
    <ProfileForm
      name={profile.data.name}
      username={profile.data.username}
      email={profile.data.email}
      roles={profile.data.roles}
    />
  )
}
