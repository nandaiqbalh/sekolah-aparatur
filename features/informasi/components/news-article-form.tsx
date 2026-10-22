"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ImageFileButton } from "@/components/admin/image-file-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createNewsArticleAction,
  updateNewsArticleAction,
  uploadNewsImageAction,
} from "@/features/informasi/actions/news-actions"
import {
  newsArticleFormSchema,
  type NewsArticleDto,
  type NewsArticleFormValues,
} from "@/features/informasi/schemas/news-article"
import { slugifyTitle } from "@/lib/slug"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

export function NewsArticleForm({
  mode,
  article,
}: {
  mode: "create" | "edit"
  article?: NewsArticleDto
}) {
  const dict = useDictionary()
  const copy = dict.admin.informasi
  const router = useRouter()
  const [slugManual, setSlugManual] = useState(mode === "edit")
  const [uploading, setUploading] = useState<"thumbnail" | "gallery" | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<NewsArticleFormValues>({
    resolver: zodResolver(newsArticleFormSchema),
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      category: article?.category ?? "",
      publishedAt: article?.publishedAt ?? "",
      summary: article?.summary ?? "",
      thumbnail: article?.thumbnail ?? "",
      gallery: article?.gallery ?? [],
      bodyHtml: article?.bodyHtml ?? "",
      isPublished: article?.isPublished ?? true,
    },
  })

  const title = useWatch({ control, name: "title" })
  const thumbnail = useWatch({ control, name: "thumbnail" })
  const gallery = useWatch({ control, name: "gallery" })

  useEffect(() => {
    if (slugManual) return
    setValue("slug", slugifyTitle(title))
  }, [setValue, slugManual, title])

  async function uploadImage(file: File, target: "thumbnail" | "gallery") {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(target)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadNewsImageAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      if (target === "thumbnail") {
        setValue("thumbnail", result.data.path, { shouldValidate: true })
        return
      }
      setValue("gallery", [...getValues("gallery"), result.data.path], { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(null)
    }
  }

  async function onSubmit(values: NewsArticleFormValues) {
    const result =
      mode === "edit" && article
        ? await updateNewsArticleAction({ ...values, id: article.id })
        : await createNewsArticleAction(values)

    if (!result.ok) {
      const fields = new Set<keyof NewsArticleFormValues>([
        "title",
        "slug",
        "category",
        "publishedAt",
        "summary",
        "thumbnail",
        "gallery",
        "bodyHtml",
        "isPublished",
      ])
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0] && fields.has(key as keyof NewsArticleFormValues)) {
            setError(key as keyof NewsArticleFormValues, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(ADMIN_ROUTES.informasi)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={ADMIN_ROUTES.informasi}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || Boolean(uploading)}>
            {dict.admin.save}
          </Button>
        }
      />

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-2">
        <Field label={copy.titleLabel} error={errors.title?.message}>
          <Input placeholder={copy.titlePlaceholder} aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label={copy.slugLabel} error={errors.slug?.message}>
          <Input
            placeholder={copy.slugPlaceholder}
            aria-invalid={Boolean(errors.slug)}
            {...register("slug", {
              onChange: () => {
                setSlugManual(true)
              },
            })}
          />
        </Field>
        <Field label={copy.categoryLabel} error={errors.category?.message}>
          <Input
            placeholder={copy.categoryPlaceholder}
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
        </Field>
        <Field label={copy.dateLabel} error={errors.publishedAt?.message}>
          <Input type="date" aria-invalid={Boolean(errors.publishedAt)} {...register("publishedAt")} />
        </Field>
        <Field label={copy.summaryLabel} error={errors.summary?.message} className="md:col-span-2">
          <Textarea
            rows={3}
            placeholder={copy.summaryPlaceholder}
            aria-invalid={Boolean(errors.summary)}
            {...register("summary")}
          />
        </Field>
        <Field label={copy.bodyLabel} error={errors.bodyHtml?.message} className="md:col-span-2">
          <Textarea
            rows={14}
            className="font-mono text-sm"
            placeholder={copy.bodyPlaceholder}
            aria-invalid={Boolean(errors.bodyHtml)}
            {...register("bodyHtml")}
          />
        </Field>
        <Field label={copy.thumbnailLabel} error={errors.thumbnail?.message}>
          <input type="hidden" {...register("thumbnail")} />
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded local paths are not known at build time
            <img src={thumbnail} alt="" className="mb-2 aspect-square w-32 rounded-md object-cover" />
          ) : null}
          <ImageFileButton
            label={copy.uploadThumbnail}
            disabled={uploading === "thumbnail"}
            onFile={(file) => void uploadImage(file, "thumbnail")}
          />
        </Field>
        <Field label={copy.galleryLabel} error={errors.gallery?.message}>
          <div className="mb-2 flex flex-wrap gap-2">
            {gallery.map((path) => (
              <div key={path} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={path} alt="" className="size-20 rounded-md object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 cursor-pointer rounded bg-background/90 px-1.5 text-xs"
                  onClick={() =>
                    setValue(
                      "gallery",
                      gallery.filter((item) => item !== path),
                      { shouldValidate: true },
                    )
                  }
                >
                  {copy.removeImage}
                </button>
              </div>
            ))}
          </div>
          <ImageFileButton
            label={copy.uploadGallery}
            disabled={uploading === "gallery"}
            onFile={(file) => void uploadImage(file, "gallery")}
          />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2 md:col-span-2">
              <Checkbox
                id="news-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="news-published" className="cursor-pointer font-normal">
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
