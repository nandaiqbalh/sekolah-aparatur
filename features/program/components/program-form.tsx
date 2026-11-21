"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { Controller, useFieldArray, useForm, useWatch, type FieldPath } from "react-hook-form"

import { AdminFileButton } from "@/components/admin/admin-file-button"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ImageFileButton } from "@/components/admin/image-file-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  createProgramAction,
  updateProgramAction,
  uploadProgramDocumentAction,
  uploadProgramImageAction,
} from "@/features/program/actions/program-actions"
import {
  emptyProgramForm,
  programFormSchema,
  type ProgramDto,
  type ProgramFormValues,
} from "@/features/program/schemas/program"
import {
  DOCUMENT_TOO_LARGE_MESSAGE,
  isDocumentTooLarge,
} from "@/lib/document-upload"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { IMAGE_TOO_LARGE_MESSAGE, isBodyLimitError, isImageTooLarge } from "@/lib/image-upload"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminProgramPath } from "@/lib/routes"

type FacilitatorOption = {
  id: string
  name: string
  detail: string
}

type UniversityOption = {
  id: string
  name: string
}

export function ProgramForm({
  mode,
  program,
  facilitators,
  universities,
}: {
  mode: "create" | "edit"
  program?: ProgramDto
  facilitators: FacilitatorOption[]
  universities: UniversityOption[]
}) {
  const dict = useDictionary()
  const copy = dict.admin.program
  const router = useRouter()
  const [uploading, setUploading] = useState<"image" | "logo" | `document-${number}` | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: program
      ? {
          title: program.title,
          summary: program.summary,
          image: program.image,
          imageAlt: program.imageAlt,
          introParagraphs: program.introParagraphs,
          highlights: program.highlights,
          studies: program.studies.map((item) => ({
            partnerId: item.partnerId,
            study: item.study,
            strata: item.strata,
            concentration: item.concentration,
          })),
          registrationPeriods: program.registrationPeriods,
          campus: program.campus,
          requirementGroups: program.requirementGroups,
          documents: program.documents,
          mitraIds: program.mitraIds,
          isPublished: program.isPublished,
        }
      : emptyProgramForm,
  })

  const highlights = useFieldArray({ control, name: "highlights" })
  const studies = useFieldArray({ control, name: "studies" })
  const periods = useFieldArray({ control, name: "registrationPeriods" })
  const groups = useFieldArray({ control, name: "requirementGroups" })
  const documents = useFieldArray({ control, name: "documents" })
  const image = useWatch({ control, name: "image" })
  const campusLogo = useWatch({ control, name: "campus.logo" })
  const introParagraphs = useWatch({ control, name: "introParagraphs" })
  const requirementGroups = useWatch({ control, name: "requirementGroups" })
  const documentValues = useWatch({ control, name: "documents" })
  const mitraIds = useWatch({ control, name: "mitraIds" })

  async function upload(file: File, target: "image" | "logo") {
    if (isImageTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, IMAGE_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(target)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadProgramImageAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.uploadFailed)
        return
      }
      if (target === "image") {
        setValue("image", result.data.path, { shouldValidate: true })
      } else {
        setValue("campus.logo", result.data.path, { shouldValidate: true })
      }
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? IMAGE_TOO_LARGE_MESSAGE : copy.uploadFailed,
      )
    } finally {
      setUploading(null)
    }
  }

  async function uploadDocument(file: File, index: number) {
    if (isDocumentTooLarge(file)) {
      toastError(dict.common.toastErrorTitle, DOCUMENT_TOO_LARGE_MESSAGE)
      return
    }
    setUploading(`document-${index}`)
    try {
      const body = new FormData()
      body.set("file", file)
      const result = await uploadProgramDocumentAction(body)
      if (!result.ok || !result.data) {
        toastError(dict.common.toastErrorTitle, result.message || copy.documentUploadFailed)
        return
      }
      const currentName = getValues(`documents.${index}.name`)
      if (!currentName.trim() && result.data.suggestedName) {
        setValue(`documents.${index}.name`, result.data.suggestedName, { shouldValidate: true })
      }
      setValue(`documents.${index}.format`, result.data.format, { shouldValidate: true })
      setValue(`documents.${index}.size`, result.data.size, { shouldValidate: true })
      setValue(`documents.${index}.href`, result.data.path, { shouldValidate: true })
    } catch (error) {
      toastError(
        dict.common.toastErrorTitle,
        isBodyLimitError(error) ? DOCUMENT_TOO_LARGE_MESSAGE : copy.documentUploadFailed,
      )
    } finally {
      setUploading(null)
    }
  }

  async function onSubmit(values: ProgramFormValues) {
    const result =
      mode === "edit" && program
        ? await updateProgramAction({ id: program.id, ...values })
        : await createProgramAction(values)
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0]) setError(key as FieldPath<ProgramFormValues>, { message: messages[0] })
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }
    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    if (mode === "create" && result.data) {
      router.push(adminProgramPath(result.data.id))
    } else {
      router.refresh()
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={ADMIN_ROUTES.program}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting || uploading !== null}>
            {dict.admin.save}
          </Button>
        }
      />

      <Section title={copy.identity}>
        {program ? (
          <p className="text-sm text-muted-foreground">
            {copy.slugLabel}: /sekolah-aparatur/{program.slug}
          </p>
        ) : null}
        <Field label={copy.titleLabel} error={errors.title?.message}>
          <Input aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label={copy.summaryLabel} error={errors.summary?.message}>
          <Textarea rows={4} aria-invalid={Boolean(errors.summary)} {...register("summary")} />
        </Field>
        <Field label={copy.imageLabel} error={errors.image?.message}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="mb-2 h-24 w-40 rounded-lg object-cover" />
          ) : null}
          <ImageFileButton
            label={copy.uploadImage}
            disabled={uploading !== null}
            onFile={(file) => void upload(file, "image")}
          />
        </Field>
        <Field label={copy.imageAltLabel} error={errors.imageAlt?.message}>
          <Input aria-invalid={Boolean(errors.imageAlt)} {...register("imageAlt")} />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="program-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="program-published" className="cursor-pointer font-normal">
                {copy.publishedLabel}
              </Label>
            </div>
          )}
        />
      </Section>

      <Section title={copy.intro}>
        {introParagraphs.map((paragraph, index) => (
          <Field key={`intro-${index}`} label={`${index + 1}`} error={errors.introParagraphs?.[index]?.message}>
            <Textarea rows={3} {...register(`introParagraphs.${index}`)} />
            <RemoveButton
              label={copy.remove}
              onClick={() =>
                setValue(
                  "introParagraphs",
                  getValues("introParagraphs").filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          </Field>
        ))}
        <AddButton
          label={copy.introAdd}
          onClick={() => setValue("introParagraphs", [...getValues("introParagraphs"), ""])}
        />
      </Section>

      <Section title={copy.highlights}>
        {highlights.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
            <Field label={copy.highlightTitle} error={errors.highlights?.[index]?.title?.message}>
              <Input {...register(`highlights.${index}.title`)} />
            </Field>
            <Field label={copy.highlightDescription} error={errors.highlights?.[index]?.description?.message}>
              <Textarea rows={3} {...register(`highlights.${index}.description`)} />
            </Field>
            <RemoveButton label={copy.remove} onClick={() => highlights.remove(index)} />
          </div>
        ))}
        <AddButton
          label={copy.highlightAdd}
          onClick={() => highlights.append({ title: "", description: "" })}
        />
      </Section>

      <Section title={copy.studies}>
        {studies.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
            <Field label={copy.studyUniversity} error={errors.studies?.[index]?.partnerId?.message}>
              <Controller
                name={`studies.${index}.partnerId`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value || null} onValueChange={(value) => value && field.onChange(value)}>
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder={copy.studyUniversityPlaceholder}>
                        {(value: string | null) =>
                          universities.find((item) => item.id === value)?.name || copy.studyUniversityPlaceholder
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label={copy.studyName} error={errors.studies?.[index]?.study?.message}>
              <Input placeholder={copy.studyNamePlaceholder} {...register(`studies.${index}.study`)} />
            </Field>
            <Field label={copy.studyStrata} error={errors.studies?.[index]?.strata?.message}>
              <Controller
                name={`studies.${index}.strata`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue>{(value: string | null) => value || "S1"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label={copy.studyConcentration} error={errors.studies?.[index]?.concentration?.message}>
              <Input
                placeholder={copy.studyConcentrationPlaceholder}
                {...register(`studies.${index}.concentration`)}
              />
            </Field>
            <RemoveButton label={copy.remove} onClick={() => studies.remove(index)} />
          </div>
        ))}
        <AddButton
          label={copy.studyAdd}
          onClick={() =>
            studies.append({
              partnerId: universities[0]?.id ?? "",
              study: "",
              strata: "S1",
              concentration: "",
            })
          }
        />
      </Section>

      <Section title={copy.periods}>
        {periods.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
            <Field label={copy.periodTerm} error={errors.registrationPeriods?.[index]?.term?.message}>
              <Input {...register(`registrationPeriods.${index}.term`)} />
            </Field>
            <Field label={copy.periodDetail} error={errors.registrationPeriods?.[index]?.detail?.message}>
              <Textarea rows={3} {...register(`registrationPeriods.${index}.detail`)} />
            </Field>
            <RemoveButton label={copy.remove} onClick={() => periods.remove(index)} />
          </div>
        ))}
        <AddButton
          label={copy.periodAdd}
          onClick={() => periods.append({ term: "", detail: "" })}
        />
      </Section>

      <Section title={copy.campus}>
        <Field label={copy.campusName} error={errors.campus?.name?.message}>
          <Input {...register("campus.name")} />
        </Field>
        <Field label={copy.campusLogo} error={errors.campus?.logo?.message}>
          {campusLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={campusLogo} alt="" className="mb-2 h-16 w-16 object-contain" />
          ) : null}
          <ImageFileButton
            label={copy.uploadImage}
            disabled={uploading !== null}
            onFile={(file) => void upload(file, "logo")}
          />
        </Field>
        <Field label={copy.campusDescription} error={errors.campus?.description?.message}>
          <Textarea rows={4} {...register("campus.description")} />
        </Field>
        <Field label={copy.campusAddress} error={errors.campus?.address?.message}>
          <Textarea rows={2} {...register("campus.address")} />
        </Field>
      </Section>

      <Section title={copy.requirements}>
        {groups.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
            <Field label={copy.requirementTitle} error={errors.requirementGroups?.[index]?.title?.message}>
              <Input {...register(`requirementGroups.${index}.title`)} />
            </Field>
            {(requirementGroups[index]?.items ?? []).map((_, itemIndex) => (
              <Field
                key={`${field.id}-${itemIndex}`}
                label={`${itemIndex + 1}`}
                error={errors.requirementGroups?.[index]?.items?.[itemIndex]?.message}
              >
                <Textarea rows={2} {...register(`requirementGroups.${index}.items.${itemIndex}`)} />
                <RemoveButton
                  label={copy.remove}
                  onClick={() => {
                    const items = getValues(`requirementGroups.${index}.items`).filter((_, current) => current !== itemIndex)
                    setValue(`requirementGroups.${index}.items`, items)
                  }}
                />
              </Field>
            ))}
            <AddButton
              label={copy.requirementItemAdd}
              onClick={() => {
                const items = getValues(`requirementGroups.${index}.items`)
                setValue(`requirementGroups.${index}.items`, [...items, ""])
              }}
            />
            <RemoveButton label={copy.remove} onClick={() => groups.remove(index)} />
          </div>
        ))}
        <AddButton
          label={copy.requirementAdd}
          onClick={() => groups.append({ title: "", items: [""] })}
        />
      </Section>

      <Section title={copy.documents}>
        <p className="text-sm text-muted-foreground">{copy.documentHint}</p>
        {documents.fields.map((field, index) => {
          const current = documentValues?.[index]
          const href = current?.href?.trim() ?? ""
          const meta = [current?.format, current?.size].filter(Boolean).join(" · ")
          return (
            <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
              <Field label={copy.documentName} error={errors.documents?.[index]?.name?.message}>
                <Input {...register(`documents.${index}.name`)} />
              </Field>
              <Field label={copy.documentDescription} error={errors.documents?.[index]?.description?.message}>
                <Textarea rows={2} {...register(`documents.${index}.description`)} />
              </Field>
              <Field label={copy.documentFile} error={errors.documents?.[index]?.href?.message}>
                <div className="flex flex-wrap items-center gap-3">
                  <AdminFileButton
                    label={href ? copy.documentReplace : copy.documentUpload}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    disabled={uploading !== null}
                    onFile={(file) => void uploadDocument(file, index)}
                  />
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {copy.documentOpen}
                    </a>
                  ) : null}
                </div>
                <input type="hidden" {...register(`documents.${index}.href`)} />
                <input type="hidden" {...register(`documents.${index}.format`)} />
                <input type="hidden" {...register(`documents.${index}.size`)} />
                {meta ? <p className="mt-2 text-xs text-muted-foreground">{meta}</p> : null}
              </Field>
              <RemoveButton label={copy.remove} onClick={() => documents.remove(index)} />
            </div>
          )
        })}
        <AddButton
          label={copy.documentAdd}
          onClick={() => documents.append({ name: "", format: "", size: "", description: "", href: "" })}
        />
      </Section>

      <Section title={copy.mitra}>
        {facilitators.length === 0 ? <p className="text-sm text-muted-foreground">{copy.mitraEmpty}</p> : null}
        <ul className="grid gap-2">
          {facilitators.map((item) => {
            const checked = mitraIds.includes(item.id)
            return (
              <li key={item.id} className="flex items-start gap-2">
                <Checkbox
                  id={`mitra-${item.id}`}
                  checked={checked}
                  onCheckedChange={(next) => {
                    const current = getValues("mitraIds")
                    setValue(
                      "mitraIds",
                      next === true ? [...current, item.id] : current.filter((id) => id !== item.id),
                    )
                  }}
                />
                <Label htmlFor={`mitra-${item.id}`} className="cursor-pointer font-normal">
                  {item.name}
                  <span className="mt-0.5 block text-sm text-muted-foreground">{item.detail}</span>
                </Label>
              </li>
            )
          })}
        </ul>
      </Section>
    </form>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" className="cursor-pointer" onClick={onClick}>
      {label}
    </Button>
  )
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" className="w-fit cursor-pointer" onClick={onClick}>
      {label}
    </Button>
  )
}
