"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ImageFileButton } from "@/components/admin/image-file-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createGalleryAlbumAction,
  updateGalleryAlbumAction,
  uploadGalleryImageAction,
} from "@/features/galeri/actions/gallery-actions"
import {
  galleryAlbumFormSchema,
  type GalleryAlbumDto,
  type GalleryAlbumFormValues,
} from "@/features/galeri/schemas/gallery-album"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

export function GalleryAlbumForm({
  mode,
  album,
}: {
  mode: "create" | "edit"
  album?: GalleryAlbumDto
}) {
  const dict = useDictionary()
  const copy = dict.admin.galeri
  const router = useRouter()
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<GalleryAlbumFormValues>({
    resolver: zodResolver(galleryAlbumFormSchema),
    defaultValues: {
      title: album?.title ?? "",
      category: album?.category ?? "",
      dateLabel: album?.date ?? "",
      summary: album?.summary ?? "",
      images: album?.images ?? [],
      isPublished: album?.isPublished ?? true,
    },
  })

  const images = useWatch({ control, name: "images" })

  async function uploadImage(file: File) {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadGalleryImageAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      setValue("images", [...getValues("images"), result.data.path], { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(false)
    }
  }

  function moveCover(path: string) {
    setValue(
      "images",
      [path, ...images.filter((item) => item !== path)],
      { shouldValidate: true },
    )
  }

  async function onSubmit(values: GalleryAlbumFormValues) {
    const result =
      mode === "edit" && album
        ? await updateGalleryAlbumAction({ ...values, id: album.id })
        : await createGalleryAlbumAction(values)

    if (!result.ok) {
      const fields = new Set<keyof GalleryAlbumFormValues>([
        "title",
        "category",
        "dateLabel",
        "summary",
        "images",
        "isPublished",
      ])
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0] && fields.has(key as keyof GalleryAlbumFormValues)) {
            setError(key as keyof GalleryAlbumFormValues, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(ADMIN_ROUTES.galeri)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={ADMIN_ROUTES.galeri}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || uploading}>
            {dict.admin.save}
          </Button>
        }
      />

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-2">
        <Field label={copy.titleLabel} error={errors.title?.message}>
          <Input placeholder={copy.titlePlaceholder} aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label={copy.categoryLabel} error={errors.category?.message}>
          <Input
            placeholder={copy.categoryPlaceholder}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
        </Field>
        <Field label={copy.dateLabel} error={errors.dateLabel?.message}>
          <Input
            placeholder={copy.datePlaceholder}
            aria-invalid={Boolean(errors.dateLabel)}
            {...register("dateLabel")}
          />
        </Field>
        <Field label={copy.summaryLabel} error={errors.summary?.message} className="md:col-span-2">
          <Textarea
            rows={3}
            placeholder={copy.summaryPlaceholder}
            aria-invalid={Boolean(errors.summary)}
            {...register("summary")}
          />
        </Field>
        <Field label={copy.imagesLabel} error={errors.images?.message} className="md:col-span-2">
          <div className="mb-2 flex flex-wrap gap-3">
            {images.map((path, index) => (
              <div key={`${path}-${index}`} className="w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={path} alt="" className="aspect-square w-full rounded-md object-cover" />
                <div className="mt-1 flex flex-col gap-1">
                  {index === 0 ? (
                    <span className="text-xs font-medium text-muted-foreground">{copy.cover}</span>
                  ) : (
                    <button
                      type="button"
                      className="cursor-pointer text-left text-xs text-primary"
                      onClick={() => moveCover(path)}
                    >
                      {copy.makeCover}
                    </button>
                  )}
                  <button
                    type="button"
                    className="cursor-pointer text-left text-xs text-destructive"
                    onClick={() =>
                      setValue(
                        "images",
                        images.filter((item) => item !== path),
                        { shouldValidate: true },
                      )
                    }
                  >
                    {copy.removeImage}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ImageFileButton label={copy.uploadImage} disabled={uploading} onFile={(file) => void uploadImage(file)} />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2 md:col-span-2">
              <Checkbox
                id="gallery-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="gallery-published" className="cursor-pointer font-normal">
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
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
