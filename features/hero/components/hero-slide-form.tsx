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
  createHeroSlideAction,
  updateHeroSlideAction,
  uploadHeroImageAction,
} from "@/features/hero/actions/hero-slide-actions"
import {
  heroSlideFormSchema,
  type HeroSlideDto,
  type HeroSlideFormValues,
} from "@/features/hero/schemas/hero-slide"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

export function HeroSlideForm({ mode, slide }: { mode: "create" | "edit"; slide?: HeroSlideDto }) {
  const dict = useDictionary()
  const copy = dict.admin.hero
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideFormSchema),
    defaultValues: {
      image: slide?.image ?? "",
      alt: slide?.alt ?? "",
      isPublished: slide?.isPublished ?? true,
    },
  })

  const image = useWatch({ control, name: "image" })

  async function uploadImage(file: File) {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadHeroImageAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      setValue("image", result.data.path, { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(values: HeroSlideFormValues) {
    const result =
      mode === "edit" && slide
        ? await updateHeroSlideAction({ id: slide.id, ...values })
        : await createHeroSlideAction(values)

    if (!result.ok) {
      const fields = new Set<keyof HeroSlideFormValues>(["image", "alt", "isPublished"])
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0] && fields.has(key as keyof HeroSlideFormValues)) {
            setError(key as FieldPath<HeroSlideFormValues>, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(ADMIN_ROUTES.hero)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={ADMIN_ROUTES.hero}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || uploading}>
            {dict.admin.save}
          </Button>
        }
      />

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
        <Field label={copy.imageLabel} error={errors.image?.message}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="mb-2 aspect-[16/9] w-full max-w-md rounded-lg object-cover" />
          ) : null}
          <ImageFileButton
            label={copy.uploadImage}
            disabled={uploading}
            onFile={(file) => void uploadImage(file)}
          />
        </Field>
        <Field label={copy.altLabel} error={errors.alt?.message}>
          <Input
            placeholder={copy.altPlaceholder}
            aria-invalid={Boolean(errors.alt)}
            {...register("alt")}
          />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="hero-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="hero-published" className="cursor-pointer font-normal">
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
