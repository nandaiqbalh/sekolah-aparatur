"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFieldArray, useForm, useWatch, type FieldPath } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ImageFileButton } from "@/components/admin/image-file-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  updateInstitutionProfileAction,
  uploadProfileImageAction,
} from "@/features/profil/actions/institution-profile-actions"
import {
  institutionProfileFormSchema,
  type InstitutionProfileDto,
  type InstitutionProfileFormValues,
} from "@/features/profil/schemas/institution-profile"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"

type TextListName = "latarBelakangParagraphs" | "misi" | "rplParagraphs" | "legalBasis"

export function InstitutionProfileForm({
  profile,
  canUpdate,
}: {
  profile: InstitutionProfileDto
  canUpdate: boolean
}) {
  const dict = useDictionary()
  const copy = dict.admin.profilLembaga
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
  } = useForm<InstitutionProfileFormValues>({
    resolver: zodResolver(institutionProfileFormSchema),
    defaultValues: {
      heroEyebrow: profile.heroEyebrow,
      heroTitle: profile.heroTitle,
      heroDescription: profile.heroDescription,
      lembagaImage: profile.lembagaImage,
      lembagaBody: profile.lembagaBody,
      latarBelakangParagraphs: profile.latarBelakangParagraphs,
      latarBelakangPoints: profile.latarBelakangPoints,
      visi: profile.visi,
      misi: profile.misi,
      rplParagraphs: profile.rplParagraphs,
      legalBasis: profile.legalBasis,
    },
  })

  const points = useFieldArray({ control, name: "latarBelakangPoints" })
  const lembagaImage = useWatch({ control, name: "lembagaImage" })
  const paragraphs = useWatch({ control, name: "latarBelakangParagraphs" })
  const misi = useWatch({ control, name: "misi" })
  const rplParagraphs = useWatch({ control, name: "rplParagraphs" })
  const legalBasis = useWatch({ control, name: "legalBasis" })

  async function uploadImage(file: File) {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(true)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadProfileImageAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      setValue("lembagaImage", result.data.path, { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(false)
    }
  }

  function updateList(name: TextListName, next: string[]) {
    setValue(name, next, { shouldValidate: true })
  }

  async function onSubmit(values: InstitutionProfileFormValues) {
    const result = await updateInstitutionProfileAction(values)
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0]) {
            setError(key as FieldPath<InstitutionProfileFormValues>, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }
    toastSuccess(copy.saved, dict.common.toastSavedDesc)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          canUpdate ? (
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting || uploading}>
              {dict.admin.save}
            </Button>
          ) : null
        }
      />

      <Section title={copy.hero}>
        <Field label={copy.eyebrow} error={errors.heroEyebrow?.message}>
          <Input
            placeholder={copy.eyebrowPlaceholder}
            disabled={!canUpdate}
            aria-invalid={Boolean(errors.heroEyebrow)}
            {...register("heroEyebrow")}
          />
        </Field>
        <Field label={copy.heroTitle} error={errors.heroTitle?.message}>
          <Input
            placeholder={copy.heroTitlePlaceholder}
            disabled={!canUpdate}
            aria-invalid={Boolean(errors.heroTitle)}
            {...register("heroTitle")}
          />
        </Field>
        <Field label={copy.heroDescription} error={errors.heroDescription?.message}>
          <Textarea
            rows={3}
            placeholder={copy.heroDescriptionPlaceholder}
            disabled={!canUpdate}
            aria-invalid={Boolean(errors.heroDescription)}
            {...register("heroDescription")}
          />
        </Field>
      </Section>

      <Section title={copy.lembaga}>
        <Field label={copy.lembagaImage} error={errors.lembagaImage?.message}>
          {lembagaImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lembagaImage} alt="" className="mb-2 h-40 w-full max-w-sm rounded-md object-cover" />
          ) : null}
          {canUpdate ? (
            <ImageFileButton label={copy.uploadImage} disabled={uploading} onFile={(file) => void uploadImage(file)} />
          ) : null}
        </Field>
        <Field label={copy.lembagaBody} error={errors.lembagaBody?.message}>
          <Textarea
            rows={5}
            placeholder={copy.bodyPlaceholder}
            disabled={!canUpdate}
            aria-invalid={Boolean(errors.lembagaBody)}
            {...register("lembagaBody")}
          />
        </Field>
      </Section>

      <Section title={copy.latarBelakang}>
        <TextList
          label={copy.paragraphs}
          items={paragraphs}
          disabled={!canUpdate}
          placeholder={copy.bodyPlaceholder}
          addLabel={copy.addParagraph}
          removeLabel={copy.remove}
          error={errors.latarBelakangParagraphs?.message}
          itemError={(index) => errors.latarBelakangParagraphs?.[index]?.message}
          registerName={(index) => register(`latarBelakangParagraphs.${index}`)}
          onAdd={() => updateList("latarBelakangParagraphs", [...getValues("latarBelakangParagraphs"), ""])}
          onRemove={(index) =>
            updateList(
              "latarBelakangParagraphs",
              getValues("latarBelakangParagraphs").filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
        <div className="space-y-3">
          <p className="text-sm font-medium">{copy.points}</p>
          {points.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-2">
              <Field label={copy.pointTitle} error={errors.latarBelakangPoints?.[index]?.title?.message}>
                <Input
                  placeholder={copy.pointTitlePlaceholder}
                  disabled={!canUpdate}
                  {...register(`latarBelakangPoints.${index}.title`)}
                />
              </Field>
              <Field label={copy.pointText} error={errors.latarBelakangPoints?.[index]?.text?.message}>
                <Input
                  placeholder={copy.pointTextPlaceholder}
                  disabled={!canUpdate}
                  {...register(`latarBelakangPoints.${index}.text`)}
                />
              </Field>
              {canUpdate && points.fields.length > 1 ? (
                <button
                  type="button"
                  className="cursor-pointer text-left text-sm text-destructive md:col-span-2"
                  onClick={() => points.remove(index)}
                >
                  {copy.remove}
                </button>
              ) : null}
            </div>
          ))}
          {errors.latarBelakangPoints?.message ? (
            <p className="text-sm text-destructive">{errors.latarBelakangPoints.message}</p>
          ) : null}
          {canUpdate ? (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => points.append({ title: "", text: "" })}
            >
              {copy.addPoint}
            </Button>
          ) : null}
        </div>
      </Section>

      <Section title={copy.visi}>
        <Field label={copy.visi} error={errors.visi?.message}>
          <Textarea rows={5} placeholder={copy.bodyPlaceholder} disabled={!canUpdate} {...register("visi")} />
        </Field>
      </Section>

      <Section title={copy.misi}>
        <TextList
          label={copy.misi}
          items={misi}
          disabled={!canUpdate}
          placeholder={copy.itemPlaceholder}
          addLabel={copy.addItem}
          removeLabel={copy.remove}
          error={errors.misi?.message}
          itemError={(index) => errors.misi?.[index]?.message}
          registerName={(index) => register(`misi.${index}`)}
          onAdd={() => updateList("misi", [...getValues("misi"), ""])}
          onRemove={(index) => updateList("misi", getValues("misi").filter((_, itemIndex) => itemIndex !== index))}
        />
      </Section>

      <Section title={copy.rpl}>
        <TextList
          label={copy.paragraphs}
          items={rplParagraphs}
          disabled={!canUpdate}
          placeholder={copy.bodyPlaceholder}
          addLabel={copy.addParagraph}
          removeLabel={copy.remove}
          error={errors.rplParagraphs?.message}
          itemError={(index) => errors.rplParagraphs?.[index]?.message}
          registerName={(index) => register(`rplParagraphs.${index}`)}
          onAdd={() => updateList("rplParagraphs", [...getValues("rplParagraphs"), ""])}
          onRemove={(index) =>
            updateList(
              "rplParagraphs",
              getValues("rplParagraphs").filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
      </Section>

      <Section title={copy.legalBasis}>
        <TextList
          label={copy.legalBasis}
          items={legalBasis}
          disabled={!canUpdate}
          placeholder={copy.itemPlaceholder}
          addLabel={copy.addItem}
          removeLabel={copy.remove}
          error={errors.legalBasis?.message}
          itemError={(index) => errors.legalBasis?.[index]?.message}
          registerName={(index) => register(`legalBasis.${index}`)}
          onAdd={() => updateList("legalBasis", [...getValues("legalBasis"), ""])}
          onRemove={(index) =>
            updateList(
              "legalBasis",
              getValues("legalBasis").filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
      </Section>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function TextList({
  label,
  items,
  disabled,
  placeholder,
  addLabel,
  removeLabel,
  error,
  itemError,
  registerName,
  onAdd,
  onRemove,
}: {
  label: string
  items: string[]
  disabled: boolean
  placeholder: string
  addLabel: string
  removeLabel: string
  error?: string
  itemError: (index: number) => string | undefined
  registerName: (index: number) => ReturnType<ReturnType<typeof useForm<InstitutionProfileFormValues>>["register"]>
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="grid gap-2">
          <Textarea
            rows={3}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(itemError(index))}
            {...registerName(index)}
          />
          {itemError(index) ? <p className="text-sm text-destructive">{itemError(index)}</p> : null}
          {!disabled && items.length > 1 ? (
            <button type="button" className="cursor-pointer text-left text-sm text-destructive" onClick={() => onRemove(index)}>
              {removeLabel}
            </button>
          ) : null}
        </div>
      ))}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!disabled ? (
        <Button type="button" variant="outline" className="cursor-pointer" onClick={onAdd}>
          {addLabel}
        </Button>
      ) : null}
    </div>
  )
}
