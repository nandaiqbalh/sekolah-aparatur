"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ImageFileButton } from "@/components/admin/image-file-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createPartnerAction,
  updatePartnerAction,
  uploadPartnerLogoAction,
} from "@/features/mitra/actions/partner-actions"
import {
  partnerFormSchema,
  type PartnerDto,
  type PartnerFormValues,
  type PartnerKind,
} from "@/features/mitra/schemas/partner"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

export function PartnerForm({
  mode,
  kind,
  partner,
}: {
  mode: "create" | "edit"
  kind: PartnerKind
  partner?: PartnerDto
}) {
  const dict = useDictionary()
  const copy = dict.admin.mitra
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const isUniversity = kind === "university"

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      kind,
      name: partner?.name ?? "",
      detail: partner?.detail ?? "",
      logo: partner?.logo ?? "",
      isPublished: partner?.isPublished ?? true,
    },
  })

  const logo = useWatch({ control, name: "logo" })

  async function uploadLogo(file: File) {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadPartnerLogoAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      setValue("logo", result.data.path, { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: PartnerFormValues) {
    const result =
      mode === "edit" && partner
        ? await updatePartnerAction({
            id: partner.id,
            name: values.name,
            detail: values.detail,
            logo: values.logo,
            isPublished: values.isPublished,
          })
        : await createPartnerAction(values)

    if (!result.ok) {
      const fields = new Set<keyof PartnerFormValues>(["name", "detail", "logo", "isPublished", "kind"])
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0] && fields.has(key as keyof PartnerFormValues)) {
            setError(key as FieldPath<PartnerFormValues>, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(kind === "facilitator" ? `${ADMIN_ROUTES.mitra}?jenis=facilitator` : ADMIN_ROUTES.mitra)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={kind === "facilitator" ? `${ADMIN_ROUTES.mitra}?jenis=facilitator` : ADMIN_ROUTES.mitra}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || uploading}>
            {dict.admin.save}
          </Button>
        }
      />

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium">{isUniversity ? copy.kindUniversity : copy.kindFacilitator}</p>
        <Field label={isUniversity ? copy.nameLabel : copy.shortNameLabel} error={errors.name?.message}>
          <Input
            placeholder={isUniversity ? copy.namePlaceholder : copy.shortNamePlaceholder}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>
        <Field label={isUniversity ? copy.programLabel : copy.fullNameLabel} error={errors.detail?.message}>
          <Input
            placeholder={isUniversity ? copy.programPlaceholder : copy.fullNamePlaceholder}
            aria-invalid={Boolean(errors.detail)}
            {...register("detail")}
          />
        </Field>
        <Field label={copy.logoLabel} error={errors.logo?.message}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="mb-2 h-16 w-16 object-contain" />
          ) : null}
          <ImageFileButton label={copy.uploadLogo} disabled={uploading} onFile={(file) => void uploadLogo(file)} />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="partner-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="partner-published" className="cursor-pointer font-normal">
                {copy.publishedLabel}
              </Label>
            </div>
          )}
        />
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
