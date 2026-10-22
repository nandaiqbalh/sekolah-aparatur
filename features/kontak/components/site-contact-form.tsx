"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { useFieldArray, useForm, useWatch, type FieldPath } from "react-hook-form"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateSiteContactAction } from "@/features/kontak/actions/site-contact-actions"
import {
  siteContactFormSchema,
  socialPlatforms,
  type SiteContactDto,
  type SiteContactFormValues,
  type SocialPlatform,
} from "@/features/kontak/schemas/site-contact"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"

const platformLabelKey = {
  instagram: "platformInstagram",
  facebook: "platformFacebook",
  tiktok: "platformTiktok",
  youtube: "platformYoutube",
  x: "platformX",
  linkedin: "platformLinkedin",
} as const

export function SiteContactForm({
  contact,
  canUpdate,
}: {
  contact: SiteContactDto
  canUpdate: boolean
}) {
  const dict = useDictionary()
  const copy = dict.admin.kontak
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SiteContactFormValues>({
    resolver: zodResolver(siteContactFormSchema),
    defaultValues: {
      address: contact.address,
      phones: contact.phones,
      email: contact.email,
      website: contact.website,
      whatsappNumber: contact.whatsappNumber,
      socials: contact.socials,
    },
  })

  const socials = useFieldArray({ control, name: "socials" })
  const phones = useWatch({ control, name: "phones" })
  const socialValues = useWatch({ control, name: "socials" })
  const usedPlatforms = new Set(socialValues.map((item) => item.platform))

  function platformLabel(platform: SocialPlatform) {
    return copy[platformLabelKey[platform]]
  }

  async function onSubmit(values: SiteContactFormValues) {
    setSubmitError(null)
    const result = await updateSiteContactAction(values)
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages[0]) setError(key as FieldPath<SiteContactFormValues>, { message: messages[0] })
        }
      }
      setSubmitError(result.message || copy.saveFailed)
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
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {dict.admin.save}
            </Button>
          ) : null
        }
      />

      <Section title={copy.contact}>
        <Field label={copy.address} error={errors.address?.message}>
          <Textarea rows={4} aria-invalid={Boolean(errors.address)} {...register("address")} />
        </Field>
        {phones.map((_, index) => (
          <Field key={`phone-${index}`} label={`${copy.phone} ${index + 1}`} error={errors.phones?.[index]?.message}>
            <Input {...register(`phones.${index}`)} />
            <RemoveButton
              label={copy.remove}
              onClick={() =>
                setValue(
                  "phones",
                  getValues("phones").filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          </Field>
        ))}
        <AddButton label={copy.addPhone} onClick={() => setValue("phones", [...getValues("phones"), ""])} />
        <Field label={copy.email} error={errors.email?.message}>
          <Input type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
        </Field>
        <Field label={copy.website} error={errors.website?.message}>
          <Input placeholder="https://" aria-invalid={Boolean(errors.website)} {...register("website")} />
        </Field>
        <Field label={copy.whatsapp} error={errors.whatsappNumber?.message}>
          <Input aria-invalid={Boolean(errors.whatsappNumber)} {...register("whatsappNumber")} />
        </Field>
      </Section>

      <Section title={copy.socials}>
        {socials.fields.map((field, index) => {
          const current = socialValues[index]?.platform
          const choices = socialPlatforms.filter((platform) => platform === current || !usedPlatforms.has(platform))
          return (
            <div key={field.id} className="grid gap-3 rounded-lg border border-border p-3">
              <Field label={copy.platform} error={errors.socials?.[index]?.platform?.message}>
                <Select
                  value={current}
                  onValueChange={(value) => {
                    if (value && socialPlatforms.includes(value as SocialPlatform)) {
                      setValue(`socials.${index}.platform`, value as SocialPlatform, { shouldValidate: true })
                    }
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue>
                      {(value: string | null) =>
                        value && socialPlatforms.includes(value as SocialPlatform)
                          ? platformLabel(value as SocialPlatform)
                          : copy.platform
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {choices.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platformLabel(platform)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={copy.url} error={errors.socials?.[index]?.url?.message}>
                <Input placeholder="https://" {...register(`socials.${index}.url`)} />
              </Field>
              <RemoveButton label={copy.remove} onClick={() => socials.remove(index)} />
            </div>
          )
        })}
        {errors.socials?.message ? <p className="text-sm text-destructive">{errors.socials.message}</p> : null}
        <AddButton
          label={copy.addSocial}
          disabled={usedPlatforms.size >= socialPlatforms.length}
          onClick={() => {
            const platform = socialPlatforms.find((item) => !usedPlatforms.has(item))
            if (!platform) return
            socials.append({ platform, url: "" })
          }}
        />
      </Section>

      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
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

function AddButton({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" className="cursor-pointer disabled:cursor-not-allowed" disabled={disabled} onClick={onClick}>
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
