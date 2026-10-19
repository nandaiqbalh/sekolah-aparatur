"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { loginAction } from "@/features/auth/actions/auth-actions"
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { safeAdminRedirect } from "@/lib/auth/safe-redirect"
import { useDictionary } from "@/lib/i18n/dictionary-provider"

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const dict = useDictionary()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  })

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginAction(values)
      if (!result.ok) {
        if (result.error === "RATE_LIMITED") {
          setError("root", { message: dict.admin.accountLocked })
          return
        }
        if (result.error === "FORBIDDEN") {
          setError("root", { message: dict.admin.accountDisabled })
          return
        }
        setError("root", { message: dict.admin.loginError })
        toast.error(dict.admin.loginError)
        return
      }

      router.replace(safeAdminRedirect(redirectTo))
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="identifier">{dict.admin.loginIdentifier}</Label>
        <Controller
          name="identifier"
          control={control}
          render={({ field }) => (
            <Input
              id="identifier"
              autoComplete="username"
              disabled={pending}
              placeholder={dict.admin.loginIdentifierPlaceholder}
              aria-invalid={Boolean(errors.identifier)}
              {...field}
            />
          )}
        />
        {errors.identifier ? (
          <p className="text-sm text-destructive">{errors.identifier.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{dict.admin.password}</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="password"
              autoComplete="current-password"
              disabled={pending}
              placeholder={dict.admin.passwordPlaceholder}
              aria-invalid={Boolean(errors.password)}
              {...field}
            />
          )}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {errors.root ? (
        <p className="text-sm text-destructive">{errors.root.message}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? dict.admin.signingIn : dict.admin.signIn}
      </Button>
    </form>
  )
}
