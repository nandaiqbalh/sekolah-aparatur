"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { Controller, useForm, type FieldPath } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createUniversityProgramAction,
  updateUniversityProgramAction,
} from "@/features/prodi/actions/university-program-actions"
import {
  emptyUniversityProgramForm,
  programStrata,
  universityProgramFormSchema,
  type UniversityProgramDto,
  type UniversityProgramFormValues,
} from "@/features/prodi/schemas/university-program"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

type UniversityOption = { id: string; name: string }

export function UniversityProgramForm({
  mode,
  program,
  universities,
}: {
  mode: "create" | "edit"
  program?: UniversityProgramDto
  universities: UniversityOption[]
}) {
  const dict = useDictionary()
  const copy = dict.admin.programStudi
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UniversityProgramFormValues>({
    resolver: zodResolver(universityProgramFormSchema),
    defaultValues: program
      ? {
          partnerId: program.partnerId,
          study: program.study,
          strata: program.strata,
          concentration: program.concentration ?? "",
          forAparaturDesa: program.forAparaturDesa,
          forAparaturPemerintah: program.forAparaturPemerintah,
          forLegislator: program.forLegislator,
          isPublished: program.isPublished,
        }
      : {
          ...emptyUniversityProgramForm,
          partnerId: universities[0]?.id ?? "",
        },
  })

  async function onSubmit(values: UniversityProgramFormValues) {
    const result =
      mode === "edit" && program
        ? await updateUniversityProgramAction({ id: program.id, ...values })
        : await createUniversityProgramAction(values)

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0]) {
            setError(key as FieldPath<UniversityProgramFormValues>, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(ADMIN_ROUTES.programStudi)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        actions={
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.push(ADMIN_ROUTES.programStudi)}>
            {copy.backToList}
          </Button>
        }
      />

      <Field label={copy.university} error={errors.partnerId?.message}>
        <Controller
          name="partnerId"
          control={control}
          render={({ field }) => (
            <Select value={field.value || null} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder={copy.universityPlaceholder}>
                  {(value: string | null) =>
                    universities.find((item) => item.id === value)?.name || copy.universityPlaceholder
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

      <Field label={copy.study} error={errors.study?.message}>
        <Input placeholder={copy.studyPlaceholder} {...register("study")} />
      </Field>

      <Field label={copy.strata} error={errors.strata?.message}>
        <Controller
          name="strata"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue>{(value: string | null) => value || "S1"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {programStrata.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field label={copy.concentration} error={errors.concentration?.message}>
        <Input placeholder={copy.concentrationPlaceholder} {...register("concentration")} />
      </Field>

      <div className="grid gap-3 rounded-lg border border-border p-4">
        <p className="text-sm font-medium">{copy.classesLabel}</p>
        <ClassCheckbox control={control} name="forAparaturDesa" label={copy.classAparaturDesa} />
        <ClassCheckbox control={control} name="forAparaturPemerintah" label={copy.classAparaturPemerintah} />
        <ClassCheckbox control={control} name="forLegislator" label={copy.classLegislator} />
      </div>

      <Controller
        name="isPublished"
        control={control}
        render={({ field }) => (
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
            {copy.publishedLabel}
          </label>
        )}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => router.push(ADMIN_ROUTES.programStudi)}
        >
          {dict.admin.cancel}
        </Button>
        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? dict.admin.saving : dict.admin.save}
        </Button>
      </div>
    </form>
  )
}

function ClassCheckbox({
  control,
  name,
  label,
}: {
  control: ReturnType<typeof useForm<UniversityProgramFormValues>>["control"]
  name: "forAparaturDesa" | "forAparaturPemerintah" | "forLegislator"
  label: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
          {label}
        </label>
      )}
    />
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
