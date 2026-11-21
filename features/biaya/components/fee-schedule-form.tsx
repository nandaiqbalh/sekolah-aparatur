"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type ReactNode } from "react"
import { Controller, useFieldArray, useForm, type FieldPath } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createFeeScheduleAction,
  updateFeeScheduleAction,
} from "@/features/biaya/actions/fee-schedule-actions"
import {
  emptyFeeGroup,
  emptyFeeLine,
  feeLineKinds,
  feeScheduleFormSchema,
  type FeeScheduleDto,
  type FeeScheduleFormValues,
  type FeeLineKind,
} from "@/features/biaya/schemas/fee-schedule"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES } from "@/lib/routes"

function toFormValues(schedule?: FeeScheduleDto): FeeScheduleFormValues {
  if (!schedule) {
    return {
      title: "",
      subtitle: "",
      isPublished: true,
      groups: [{ ...emptyFeeGroup, lines: [{ ...emptyFeeLine }] }],
    }
  }
  return {
    title: schedule.title,
    subtitle: schedule.subtitle,
    isPublished: schedule.isPublished,
    groups: schedule.groups.map((group) => ({
      title: group.title,
      lines: group.lines.map((line) => ({
        kind: line.kind,
        label: line.label,
        amount: String(line.amount),
        note: line.note ?? "",
      })),
    })),
  }
}

export function FeeScheduleForm({
  mode,
  schedule,
}: {
  mode: "create" | "edit"
  schedule?: FeeScheduleDto
}) {
  const dict = useDictionary()
  const copy = dict.admin.rincianBiaya
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeeScheduleFormValues>({
    resolver: zodResolver(feeScheduleFormSchema),
    defaultValues: toFormValues(schedule),
  })

  const groups = useFieldArray({ control, name: "groups" })

  function kindLabel(kind: FeeLineKind) {
    if (kind === "subtotal") return copy.lineKindSubtotal
    if (kind === "total") return copy.lineKindTotal
    return copy.lineKindItem
  }

  async function onSubmit(values: FeeScheduleFormValues) {
    const result =
      mode === "edit" && schedule
        ? await updateFeeScheduleAction({ id: schedule.id, ...values })
        : await createFeeScheduleAction(values)

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0]) {
            setError(key as FieldPath<FeeScheduleFormValues>, { message: messages[0] })
          }
        }
      }
      toastError(dict.common.toastErrorTitle, result.message || copy.saveFailed)
      return
    }

    toastSuccess(mode === "edit" ? copy.updated : copy.saved, dict.common.toastSavedDesc)
    router.push(ADMIN_ROUTES.rincianBiaya)
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <AdminPageHeader
        title={mode === "edit" ? copy.edit : copy.create}
        description={mode === "edit" ? copy.editDescription : copy.createDescription}
        backHref={ADMIN_ROUTES.rincianBiaya}
        backLabel={copy.backToList}
        actions={
          <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
            {dict.admin.save}
          </Button>
        }
      />

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
        <Field label={copy.titleLabel} error={errors.title?.message}>
          <Input placeholder={copy.titlePlaceholder} aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label={copy.subtitleLabel} error={errors.subtitle?.message}>
          <Input
            placeholder={copy.subtitlePlaceholder}
            aria-invalid={Boolean(errors.subtitle)}
            {...register("subtitle")}
          />
        </Field>
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="fee-published"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
              />
              <Label htmlFor="fee-published" className="cursor-pointer font-normal">
                {copy.publishedLabel}
              </Label>
            </div>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">{copy.groupsLabel}</h2>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => groups.append({ ...emptyFeeGroup, lines: [{ ...emptyFeeLine }] })}
          >
            {copy.groupAdd}
          </Button>
        </div>
        {errors.groups?.root?.message || errors.groups?.message ? (
          <p className="text-sm text-red-700">{errors.groups.root?.message || errors.groups.message}</p>
        ) : null}

        {groups.fields.map((groupField, groupIndex) => (
          <GroupEditor
            key={groupField.id}
            groupIndex={groupIndex}
            control={control}
            register={register}
            errors={errors}
            copy={copy}
            kindLabel={kindLabel}
            canRemove={groups.fields.length > 1}
            onRemove={() => groups.remove(groupIndex)}
          />
        ))}
      </div>
    </form>
  )
}

function GroupEditor({
  groupIndex,
  control,
  register,
  errors,
  copy,
  kindLabel,
  canRemove,
  onRemove,
}: {
  groupIndex: number
  control: ReturnType<typeof useForm<FeeScheduleFormValues>>["control"]
  register: ReturnType<typeof useForm<FeeScheduleFormValues>>["register"]
  errors: ReturnType<typeof useForm<FeeScheduleFormValues>>["formState"]["errors"]
  copy: ReturnType<typeof useDictionary>["admin"]["rincianBiaya"]
  kindLabel: (kind: FeeLineKind) => string
  canRemove: boolean
  onRemove: () => void
}) {
  const lines = useFieldArray({ control, name: `groups.${groupIndex}.lines` })

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
      <Field
        label={copy.groupTitle}
        error={errors.groups?.[groupIndex]?.title?.message}
      >
        <Input
          placeholder={copy.groupTitlePlaceholder}
          aria-invalid={Boolean(errors.groups?.[groupIndex]?.title)}
          {...register(`groups.${groupIndex}.title`)}
        />
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{copy.linesLabel}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => lines.append({ ...emptyFeeLine })}
          >
            {copy.lineAdd}
          </Button>
        </div>

        {lines.fields.map((lineField, lineIndex) => (
          <div key={lineField.id} className="grid gap-3 rounded-md border border-border/70 p-3">
            <Field
              label={copy.lineKind}
              error={errors.groups?.[groupIndex]?.lines?.[lineIndex]?.kind?.message}
            >
              <Controller
                name={`groups.${groupIndex}.lines.${lineIndex}.kind`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue>
                        {(value: string | null) => kindLabel((value as FeeLineKind) || "item")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {feeLineKinds.map((kind) => (
                        <SelectItem key={kind} value={kind}>
                          {kindLabel(kind)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field
              label={copy.lineLabel}
              error={errors.groups?.[groupIndex]?.lines?.[lineIndex]?.label?.message}
            >
              <Input
                placeholder={copy.lineLabelPlaceholder}
                {...register(`groups.${groupIndex}.lines.${lineIndex}.label`)}
              />
            </Field>
            <Field
              label={copy.lineAmount}
              error={errors.groups?.[groupIndex]?.lines?.[lineIndex]?.amount?.message}
            >
              <Input
                inputMode="numeric"
                placeholder={copy.lineAmountPlaceholder}
                {...register(`groups.${groupIndex}.lines.${lineIndex}.amount`)}
              />
            </Field>
            <Field
              label={copy.lineNote}
              error={errors.groups?.[groupIndex]?.lines?.[lineIndex]?.note?.message}
            >
              <Input
                placeholder={copy.lineNotePlaceholder}
                {...register(`groups.${groupIndex}.lines.${lineIndex}.note`)}
              />
            </Field>
            {lines.fields.length > 1 ? (
              <Button type="button" variant="ghost" className="cursor-pointer justify-self-start" onClick={() => lines.remove(lineIndex)}>
                {copy.removeLine}
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {canRemove ? (
        <Button type="button" variant="ghost" className="cursor-pointer justify-self-start" onClick={onRemove}>
          {copy.removeGroup}
        </Button>
      ) : null}
    </div>
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
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  )
}
