"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  changePasswordAction,
  updateProfileAction,
} from "@/features/auth/actions/auth-actions"
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from "@/features/auth/schemas/auth"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

export function ProfileForm({
  name,
  username,
  email,
  roles,
}: {
  name: string
  username: string
  email: string
  roles: string[]
}) {
  const dict = useDictionary()
  const router = useRouter()
  const [pendingProfile, startProfile] = useTransition()
  const [pendingPassword, startPassword] = useTransition()

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  })

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={dict.admin.profile.title}
        description={`${dict.admin.profile.username}: ${username} · ${dict.admin.profile.email}: ${email}${
          roles.length > 0 ? ` · ${dict.admin.profile.role}: ${roles.join(", ")}` : ""
        }`}
      />

      <Card className="max-w-lg border-border">
        <CardHeader>
          <CardTitle className="text-base">{dict.admin.profile.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            noValidate
            onSubmit={profileForm.handleSubmit((values) => {
              startProfile(async () => {
                const result = await updateProfileAction(values)
                if (!result.ok) {
                  toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
                  return
                }
                toastSuccess(dict.admin.profile.saved, dict.common.toastSavedDesc)
                router.refresh()
              })
            })}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{dict.admin.profile.name}</Label>
              <Controller
                name="name"
                control={profileForm.control}
                render={({ field }) => (
                  <Input
                    id="name"
                    disabled={pendingProfile}
                    placeholder={dict.admin.profile.namePlaceholder}
                    {...field}
                  />
                )}
              />
            </div>
            <Button type="submit" disabled={pendingProfile} className="w-fit">
              {pendingProfile ? dict.admin.profile.saving : dict.admin.profile.save}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-lg border-border">
        <CardHeader>
          <CardTitle className="text-base">{dict.admin.profile.changePassword}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            noValidate
            onSubmit={passwordForm.handleSubmit((values) => {
              startPassword(async () => {
                const result = await changePasswordAction(values)
                if (!result.ok) {
                  toastError(dict.common.toastErrorTitle, result.error ?? dict.common.toastTryAgainDesc)
                  return
                }
                toastSuccess(dict.admin.profile.passwordChanged, dict.common.toastSavedDesc)
                passwordForm.reset()
              })
            })}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">{dict.admin.profile.currentPassword}</Label>
              <Controller
                name="currentPassword"
                control={passwordForm.control}
                render={({ field }) => (
                  <PasswordInput
                    id="currentPassword"
                    disabled={pendingPassword}
                    placeholder={dict.admin.profile.currentPasswordPlaceholder}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">{dict.admin.profile.newPassword}</Label>
              <Controller
                name="newPassword"
                control={passwordForm.control}
                render={({ field }) => (
                  <PasswordInput
                    id="newPassword"
                    disabled={pendingPassword}
                    placeholder={dict.admin.profile.newPasswordPlaceholder}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">{dict.admin.profile.confirmPassword}</Label>
              <Controller
                name="confirmPassword"
                control={passwordForm.control}
                render={({ field }) => (
                  <PasswordInput
                    id="confirmPassword"
                    disabled={pendingPassword}
                    placeholder={dict.admin.profile.confirmPasswordPlaceholder}
                    {...field}
                  />
                )}
              />
              {passwordForm.formState.errors.confirmPassword ? (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
            <Button type="submit" disabled={pendingPassword} className="w-fit">
              {pendingPassword
                ? dict.admin.profile.saving
                : dict.admin.profile.changePassword}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
